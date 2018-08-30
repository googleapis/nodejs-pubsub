/*!
 * Copyright 2018 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const arrify = require('arrify');
const chunk = require('lodash.chunk');
const util = require('./util');
const {promisify} = require('@google-cloud/promisify');
const delay = require('delay');
const {EventEmitter} = require('events');
const extend = require('extend');
const is = require('is');
const os = require('os');

const ConnectionPool = require('./connection-pool');
const Histogram = require('./histogram');

/**
 * @type {number} - The maximum number of ackIds to be sent in acknowledge/modifyAckDeadline
 *     requests. There is an API limit of 524288 bytes (512KiB) per acknowledge/modifyAckDeadline
 *     request. ackIds have a maximum size of 164 bytes, so 524288/164 ~= 3197. Accounting for some
 *     overhead, a maximum of 3000 ackIds per request should be safe.
 * @private
 */
const MAX_ACK_IDS_PER_REQUEST = 3000;

/**
 * Subscriber class is used to manage all message related functionality.
 * @private
 *
 * @param {object} options Configuration object.
 */
class Subscriber extends EventEmitter {
  constructor(options) {
    super();
    options = options || {};
    this.histogram = new Histogram();
    this.latency_ = new Histogram({min: 0});
    this.connectionPool = null;
    this.ackDeadline = 10000;
    this.maxConnections = options.maxConnections || 5;
    this.inventory_ = {
      lease: [],
      ack: [],
      nack: [],
      bytes: 0,
    };
    this.flowControl = extend(
      {
        maxBytes: os.freemem() * 0.2,
        maxMessages: 100,
      },
      options.flowControl
    );
    this.batching = extend(
      {
        maxMilliseconds: 100,
      },
      options.batching
    );
    this.flushTimeoutHandle_ = null;
    this.leaseTimeoutHandle_ = null;
    this.userClosed_ = false;
    this.isOpen = false;
    this.messageListeners = 0;
    // As of right now we do not write any acks/modacks to the pull streams.
    // But with allowing users to opt out of using streaming pulls altogether on
    // the horizon, we may need to support this feature again in the near future.
    this.writeToStreams_ = false;
    this.listenForEvents_();
  }
  /*!
   * Acks the provided message. If the connection pool is absent, it will be
   * placed in an internal queue and sent out after 1 second or if the pool is
   * re-opened before the timeout hits.
   *
   * @private
   *
   * @param {object} message The message object.
   */
  ack_(message) {
    const breakLease = this.breakLease_.bind(this, message);
    this.histogram.add(Date.now() - message.received);
    if (this.writeToStreams_ && this.isConnected_()) {
      this.acknowledge_(message.ackId, message.connectionId).then(breakLease);
      return;
    }
    this.inventory_.ack.push(message.ackId);
    this.setFlushTimeout_().then(breakLease);
  }
  /*!
   * Sends an acknowledge request for the provided ack ids.
   *
   * @private
   *
   * @param {string|string[]} ackIds The ack IDs to acknowledge.
   * @param {string} [connId] Connection ID to send request on.
   * @return {Promise}
   */
  acknowledge_(ackIds, connId) {
    ackIds = arrify(ackIds);
    const promises = chunk(ackIds, MAX_ACK_IDS_PER_REQUEST).map(ackIdChunk => {
      if (this.writeToStreams_ && this.isConnected_()) {
        return this.writeTo_(connId, {ackIds: ackIdChunk});
      }
      return promisify(this.request).call(this, {
        client: 'SubscriberClient',
        method: 'acknowledge',
        reqOpts: {
          subscription: this.name,
          ackIds: ackIdChunk,
        },
      });
    });
    return Promise.all(promises).catch(err => {
      this.emit('error', err);
    });
  }
  /*!
   * Breaks the lease on a message. Essentially this means we no longer treat the
   * message as being un-acked and count it towards the flow control limits.
   *
   * If the pool was previously paused and we freed up space, we'll continue to
   * recieve messages.
   *
   * @private
   *
   * @param {object} message The message object.
   */
  breakLease_(message) {
    const messageIndex = this.inventory_.lease.indexOf(message.ackId);
    if (messageIndex === -1) {
      return;
    }
    this.inventory_.lease.splice(messageIndex, 1);
    this.inventory_.bytes -= message.length;
    const pool = this.connectionPool;
    if (pool && pool.isPaused && !this.hasMaxMessages_()) {
      pool.resume();
    }
    if (!this.inventory_.lease.length) {
      clearTimeout(this.leaseTimeoutHandle_);
      this.leaseTimeoutHandle_ = null;
    }
  }
  /**
   * Closes the Subscriber, once this is called you will no longer receive
   * message events unless you add a new message listener.
   *
   * @param {function} [callback] The callback function.
   * @param {?error} callback.err An error returned while closing the
   *     Subscriber.
   *
   * @example
   * Subscriber.close((err) => {
   *   if (err) {
   *     // Error handling omitted.
   *   }
   * });
   *
   * //-
   * // If the callback is omitted, we'll return a Promise.
   * //-
   * Subscriber.close().then(() => {});
   */
  close(callback) {
    this.userClosed_ = true;
    const inventory = this.inventory_;
    inventory.lease.length = inventory.bytes = 0;
    clearTimeout(this.leaseTimeoutHandle_);
    this.leaseTimeoutHandle_ = null;
    this.flushQueues_().then(() => {
      this.closeConnection_(callback);
    });
  }
  /*!
   * Closes the connection pool.
   *
   * @private
   *
   * @param {function} [callback] The callback function.
   * @param {?error} err An error returned from this request.
   */
  closeConnection_(callback) {
    this.isOpen = false;
    if (this.connectionPool) {
      this.connectionPool.close(callback || util.noop);
      this.connectionPool = null;
    } else if (is.fn(callback)) {
      setImmediate(callback);
    }
  }
  /*!
   * Flushes internal queues. These can build up if a user attempts to ack/nack
   * while there is no connection pool (e.g. after they called close).
   *
   * Typically this will only be called either after a timeout or when a
   * connection is re-opened.
   *
   * Any errors that occur will be emitted via `error` events.
   *
   * @private
   */
  flushQueues_() {
    if (this.flushTimeoutHandle_) {
      this.flushTimeoutHandle_.clear();
      this.flushTimeoutHandle_ = null;
    }
    const acks = this.inventory_.ack;
    const nacks = this.inventory_.nack;
    if (!acks.length && !nacks.length) {
      return Promise.resolve();
    }
    const requests = [];
    if (acks.length) {
      requests.push(
        this.acknowledge_(acks).then(() => {
          this.inventory_.ack = [];
        })
      );
    }
    if (nacks.length) {
      requests.push(
        this.modifyAckDeadline_(nacks, 0).then(() => {
          this.inventory_.nack = [];
        })
      );
    }
    return Promise.all(requests);
  }
  /*!
   * Checks to see if we currently have a streaming connection.
   *
   * @private
   *
   * @return {boolean}
   */
  isConnected_() {
    return !!(this.connectionPool && this.connectionPool.isConnected());
  }
  /*!
   * Checks to see if this Subscriber has hit any of the flow control
   * thresholds.
   *
   * @private
   *
   * @return {boolean}
   */
  hasMaxMessages_() {
    return (
      this.inventory_.lease.length >= this.flowControl.maxMessages ||
      this.inventory_.bytes >= this.flowControl.maxBytes
    );
  }
  /*!
   * Leases a message. This will add the message to our inventory list and then
   * modifiy the ack deadline for the user if they exceed the specified ack
   * deadline.
   *
   * @private
   *
   * @param {object} message The message object.
   */
  leaseMessage_(message) {
    this.modifyAckDeadline_(
      message.ackId,
      this.ackDeadline / 1000,
      message.connectionId
    );
    this.inventory_.lease.push(message.ackId);
    this.inventory_.bytes += message.length;
    this.setLeaseTimeout_();
    return message;
  }
  /*!
   * Begin listening for events on the Subscriber. This method keeps track of
   * how many message listeners are assigned, and then removed, making sure
   * polling is handled automatically.
   *
   * As long as there is one active message listener, the connection is open. As
   * soon as there are no more message listeners, the connection is closed.
   *
   * @private
   *
   * @example
   * Subscriber.listenForEvents_();
   */
  listenForEvents_() {
    this.on('newListener', event => {
      if (event === 'message') {
        this.messageListeners++;
        if (!this.connectionPool) {
          this.userClosed_ = false;
          this.openConnection_();
        }
      }
    });
    this.on('removeListener', event => {
      if (event === 'message' && --this.messageListeners === 0) {
        this.closeConnection_();
      }
    });
  }
  /*!
   * Sends a modifyAckDeadline request for the provided ack ids.
   *
   * @private
   *
   * @param {string|string[]} ackIds The ack IDs to acknowledge.
   * @param {number} deadline The dealine in seconds.
   * @param {string=} connId Connection ID to send request on.
   * @return {Promise}
   */
  modifyAckDeadline_(ackIds, deadline, connId) {
    ackIds = arrify(ackIds);
    const promises = chunk(ackIds, MAX_ACK_IDS_PER_REQUEST).map(ackIdChunk => {
      if (this.writeToStreams_ && this.isConnected_()) {
        return this.writeTo_(connId, {
          modifyDeadlineAckIds: ackIdChunk,
          modifyDeadlineSeconds: Array(ackIdChunk.length).fill(deadline),
        });
      }
      return promisify(this.request).call(this, {
        client: 'SubscriberClient',
        method: 'modifyAckDeadline',
        reqOpts: {
          subscription: this.name,
          ackDeadlineSeconds: deadline,
          ackIds: ackIdChunk,
        },
      });
    });
    return Promise.all(promises).catch(err => {
      this.emit('error', err);
    });
  }
  /*!
   * Nacks the provided message. If the connection pool is absent, it will be
   * placed in an internal queue and sent out after 1 second or if the pool is
   * re-opened before the timeout hits.
   *
   * @private
   *
   * @param {object} message - The message object.
   */
  nack_(message) {
    const breakLease = this.breakLease_.bind(this, message);
    if (this.isConnected_()) {
      this.modifyAckDeadline_(message.ackId, 0, message.connectionId).then(
        breakLease
      );
      return;
    }
    this.inventory_.nack.push(message.ackId);
    this.setFlushTimeout_().then(breakLease);
  }
  /*!
   * Opens the ConnectionPool.
   *
   * @private
   */
  openConnection_() {
    const pool = (this.connectionPool = new ConnectionPool(this));
    this.isOpen = true;
    pool.on('error', err => {
      this.emit('error', err);
    });
    pool.on('message', message => {
      this.emit('message', this.leaseMessage_(message));
      if (!pool.isPaused && this.hasMaxMessages_()) {
        pool.pause();
      }
    });
    pool.once('connected', () => {
      this.flushQueues_();
    });
  }
  /*!
   * Modifies the ack deadline on messages that have yet to be acked. We update
   * the ack deadline to the 99th percentile of known ack times.
   *
   * @private
   */
  renewLeases_() {
    clearTimeout(this.leaseTimeoutHandle_);
    this.leaseTimeoutHandle_ = null;
    if (!this.inventory_.lease.length) {
      return;
    }
    this.ackDeadline = this.histogram.percentile(99);
    const ackIds = this.inventory_.lease.slice();
    const ackDeadlineSeconds = this.ackDeadline / 1000;
    this.modifyAckDeadline_(ackIds, ackDeadlineSeconds).then(() => {
      this.setLeaseTimeout_();
    });
  }
  /*!
   * Sets a timeout to flush any acks/nacks that have been made since the pool has
   * closed.
   *
   * @private
   */
  setFlushTimeout_() {
    if (!this.flushTimeoutHandle_) {
      const timeout = delay(this.batching.maxMilliseconds);
      const promise = timeout
        .then(this.flushQueues_.bind(this))
        .catch(util.noop);
      promise.clear = timeout.clear.bind(timeout);
      this.flushTimeoutHandle_ = promise;
    }
    return this.flushTimeoutHandle_;
  }
  /*!
   * Sets a timeout to modify the ack deadlines for any unacked/unnacked messages,
   * renewing their lease.
   *
   * @private
   */
  setLeaseTimeout_() {
    if (this.leaseTimeoutHandle_ || !this.isOpen) {
      return;
    }
    const latency = this.latency_.percentile(99);
    const timeout = Math.random() * this.ackDeadline * 0.9 - latency;
    this.leaseTimeoutHandle_ = setTimeout(
      this.renewLeases_.bind(this),
      timeout
    );
  }
  /**
   * Writes to specified duplex stream. This is useful for capturing write
   * latencies that can later be used to adjust the auto lease timeout.
   *
   * @private
   *
   * @param {string} connId The ID of the connection to write to.
   * @param {object} data The data to be written to the stream.
   * @returns {Promise}
   */
  writeTo_(connId, data) {
    const startTime = Date.now();
    return new Promise((resolve, reject) => {
      this.connectionPool.acquire(connId, (err, connection) => {
        if (err) {
          reject(err);
          return;
        }
        // we can ignore any errors that come from this since they'll be
        // re-emitted later
        connection.write(data, err => {
          if (!err) {
            this.latency_.add(Date.now() - startTime);
          }
          resolve();
        });
      });
    });
  }
}

module.exports = Subscriber;
