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

var arrify = require('arrify');
var chunk = require('lodash.chunk');
var common = require('@google-cloud/common');
var delay = require('delay');
var events = require('events');
var extend = require('extend');
var is = require('is');
var os = require('os');
var util = require('util');

var ConnectionPool = require('./connection-pool.js');
var Histogram = require('./histogram.js');

/**
 * @type {number} - The maximum number of ackIds to be sent in acknowledge/modifyAckDeadline
 *     requests. There is an API limit of 524288 bytes (512KiB) per acknowledge/modifyAckDeadline
 *     request. ackIds have a maximum size of 164 bytes, so 524288/164 ~= 3197. Accounting for some
 *     overhead, a maximum of 3000 ackIds per request should be safe.
 * @private
 */
var MAX_ACK_IDS_PER_REQUEST = 3000;

/**
 * Subscriber class is used to manage all message related functionality.
 * @private
 *
 * @param {object} options Configuration object.
 */
function Subscriber(options) {
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

  events.EventEmitter.call(this);

  this.listenForEvents_();
}

util.inherits(Subscriber, events.EventEmitter);

/*!
 * Acks the provided message. If the connection pool is absent, it will be
 * placed in an internal queue and sent out after 1 second or if the pool is
 * re-opened before the timeout hits.
 *
 * @private
 *
 * @param {object} message The message object.
 */
Subscriber.prototype.ack_ = function(message) {
  var breakLease = this.breakLease_.bind(this, message);

  this.histogram.add(Date.now() - message.received);

  if (this.writeToStreams_ && this.isConnected_()) {
    this.acknowledge_(message.ackId, message.connectionId).then(breakLease);
    return;
  }

  this.inventory_.ack.push(message.ackId);
  this.setFlushTimeout_().then(breakLease);
};

/*!
 * Sends an acknowledge request for the provided ack ids.
 *
 * @private
 *
 * @param {string|string[]} ackIds The ack IDs to acknowledge.
 * @param {string} [connId] Connection ID to send request on.
 * @return {Promise}
 */
Subscriber.prototype.acknowledge_ = function(ackIds, connId) {
  var self = this;

  ackIds = arrify(ackIds);

  var promises = chunk(ackIds, MAX_ACK_IDS_PER_REQUEST).map(function(
    ackIdChunk
  ) {
    if (self.writeToStreams_ && self.isConnected_()) {
      return self.writeTo_(connId, {ackIds: ackIdChunk});
    }

    return common.util.promisify(self.request).call(self, {
      client: 'SubscriberClient',
      method: 'acknowledge',
      reqOpts: {
        subscription: self.name,
        ackIds: ackIdChunk,
      },
    });
  });

  return Promise.all(promises).catch(function(err) {
    self.emit('error', err);
  });
};

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
Subscriber.prototype.breakLease_ = function(message) {
  var messageIndex = this.inventory_.lease.indexOf(message.ackId);

  if (messageIndex === -1) {
    return;
  }

  this.inventory_.lease.splice(messageIndex, 1);
  this.inventory_.bytes -= message.length;

  var pool = this.connectionPool;

  if (pool && pool.isPaused && !this.hasMaxMessages_()) {
    pool.resume();
  }

  if (!this.inventory_.lease.length) {
    clearTimeout(this.leaseTimeoutHandle_);
    this.leaseTimeoutHandle_ = null;
  }
};

/**
 * Closes the Subscriber, once this is called you will no longer receive
 * message events unless you add a new message listener.
 *
 * @param {function} [callback] The callback function.
 * @param {?error} callback.err An error returned while closing the
 *     Subscriber.
 *
 * @example
 * Subscriber.close(function(err) {
 *   if (err) {
 *     // Error handling omitted.
 *   }
 * });
 *
 * //-
 * // If the callback is omitted, we'll return a Promise.
 * //-
 * Subscriber.close().then(function() {});
 */
Subscriber.prototype.close = function(callback) {
  var self = this;

  this.userClosed_ = true;

  var inventory = this.inventory_;
  inventory.lease.length = inventory.bytes = 0;

  clearTimeout(this.leaseTimeoutHandle_);
  this.leaseTimeoutHandle_ = null;

  this.flushQueues_().then(function() {
    self.closeConnection_(callback);
  });
};

/*!
 * Closes the connection pool.
 *
 * @private
 *
 * @param {function} [callback] The callback function.
 * @param {?error} err An error returned from this request.
 */
Subscriber.prototype.closeConnection_ = function(callback) {
  this.isOpen = false;

  if (this.connectionPool) {
    this.connectionPool.close(callback || common.util.noop);
    this.connectionPool = null;
  } else if (is.fn(callback)) {
    setImmediate(callback);
  }
};

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
Subscriber.prototype.flushQueues_ = function() {
  var self = this;

  if (this.flushTimeoutHandle_) {
    this.flushTimeoutHandle_.cancel();
    this.flushTimeoutHandle_ = null;
  }

  var acks = this.inventory_.ack;
  var nacks = this.inventory_.nack;

  if (!acks.length && !nacks.length) {
    return Promise.resolve();
  }

  var requests = [];

  if (acks.length) {
    requests.push(
      this.acknowledge_(acks).then(function() {
        self.inventory_.ack = [];
      })
    );
  }

  if (nacks.length) {
    requests.push(
      this.modifyAckDeadline_(nacks, 0).then(function() {
        self.inventory_.nack = [];
      })
    );
  }

  return Promise.all(requests);
};

/*!
 * Checks to see if we currently have a streaming connection.
 *
 * @private
 *
 * @return {boolean}
 */
Subscriber.prototype.isConnected_ = function() {
  return !!(this.connectionPool && this.connectionPool.isConnected());
};

/*!
 * Checks to see if this Subscriber has hit any of the flow control
 * thresholds.
 *
 * @private
 *
 * @return {boolean}
 */
Subscriber.prototype.hasMaxMessages_ = function() {
  return (
    this.inventory_.lease.length >= this.flowControl.maxMessages ||
    this.inventory_.bytes >= this.flowControl.maxBytes
  );
};

/*!
 * Leases a message. This will add the message to our inventory list and then
 * modifiy the ack deadline for the user if they exceed the specified ack
 * deadline.
 *
 * @private
 *
 * @param {object} message The message object.
 */
Subscriber.prototype.leaseMessage_ = function(message) {
  this.modifyAckDeadline_(
    message.ackId,
    this.ackDeadline / 1000,
    message.connectionId
  );

  this.inventory_.lease.push(message.ackId);
  this.inventory_.bytes += message.length;
  this.setLeaseTimeout_();

  return message;
};

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
Subscriber.prototype.listenForEvents_ = function() {
  var self = this;

  this.on('newListener', function(event) {
    if (event === 'message') {
      self.messageListeners++;

      if (!self.connectionPool) {
        self.userClosed_ = false;
        self.openConnection_();
      }
    }
  });

  this.on('removeListener', function(event) {
    if (event === 'message' && --self.messageListeners === 0) {
      self.closeConnection_();
    }
  });
};

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
Subscriber.prototype.modifyAckDeadline_ = function(ackIds, deadline, connId) {
  var self = this;

  ackIds = arrify(ackIds);

  var promises = chunk(ackIds, MAX_ACK_IDS_PER_REQUEST).map(function(
    ackIdChunk
  ) {
    if (self.writeToStreams_ && self.isConnected_()) {
      return self.writeTo_(connId, {
        modifyDeadlineAckIds: ackIdChunk,
        modifyDeadlineSeconds: Array(ackIdChunk.length).fill(deadline),
      });
    }

    return common.util.promisify(self.request).call(self, {
      client: 'SubscriberClient',
      method: 'modifyAckDeadline',
      reqOpts: {
        subscription: self.name,
        ackDeadlineSeconds: deadline,
        ackIds: ackIdChunk,
      },
    });
  });

  return Promise.all(promises).catch(function(err) {
    self.emit('error', err);
  });
};

/*!
 * Nacks the provided message. If the connection pool is absent, it will be
 * placed in an internal queue and sent out after 1 second or if the pool is
 * re-opened before the timeout hits.
 *
 * @private
 *
 * @param {object} message - The message object.
 */
Subscriber.prototype.nack_ = function(message) {
  var breakLease = this.breakLease_.bind(this, message);

  if (this.isConnected_()) {
    this.modifyAckDeadline_(message.ackId, 0, message.connectionId).then(
      breakLease
    );
    return;
  }

  this.inventory_.nack.push(message.ackId);
  this.setFlushTimeout_().then(breakLease);
};

/*!
 * Opens the ConnectionPool.
 *
 * @private
 */
Subscriber.prototype.openConnection_ = function() {
  var self = this;
  var pool = (this.connectionPool = new ConnectionPool(this));

  this.isOpen = true;

  pool.on('error', function(err) {
    self.emit('error', err);
  });

  pool.on('message', function(message) {
    self.emit('message', self.leaseMessage_(message));

    if (!pool.isPaused && self.hasMaxMessages_()) {
      pool.pause();
    }
  });

  pool.once('connected', function() {
    self.flushQueues_();
  });
};

/*!
 * Modifies the ack deadline on messages that have yet to be acked. We update
 * the ack deadline to the 99th percentile of known ack times.
 *
 * @private
 */
Subscriber.prototype.renewLeases_ = function() {
  var self = this;

  clearTimeout(this.leaseTimeoutHandle_);
  this.leaseTimeoutHandle_ = null;

  if (!this.inventory_.lease.length) {
    return;
  }

  this.ackDeadline = this.histogram.percentile(99);

  var ackIds = this.inventory_.lease.slice();
  var ackDeadlineSeconds = this.ackDeadline / 1000;

  this.modifyAckDeadline_(ackIds, ackDeadlineSeconds).then(function() {
    self.setLeaseTimeout_();
  });
};

/*!
 * Sets a timeout to flush any acks/nacks that have been made since the pool has
 * closed.
 *
 * @private
 */
Subscriber.prototype.setFlushTimeout_ = function() {
  if (!this.flushTimeoutHandle_) {
    var timeout = delay(this.batching.maxMilliseconds);
    var promise = timeout
      .then(this.flushQueues_.bind(this))
      .catch(common.util.noop);

    promise.cancel = timeout.cancel.bind(timeout);
    this.flushTimeoutHandle_ = promise;
  }

  return this.flushTimeoutHandle_;
};

/*!
 * Sets a timeout to modify the ack deadlines for any unacked/unnacked messages,
 * renewing their lease.
 *
 * @private
 */
Subscriber.prototype.setLeaseTimeout_ = function() {
  if (this.leaseTimeoutHandle_ || !this.isOpen) {
    return;
  }

  var latency = this.latency_.percentile(99);
  var timeout = Math.random() * this.ackDeadline * 0.9 - latency;

  this.leaseTimeoutHandle_ = setTimeout(this.renewLeases_.bind(this), timeout);
};

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
Subscriber.prototype.writeTo_ = function(connId, data) {
  var self = this;
  var startTime = Date.now();

  return new Promise(function(resolve, reject) {
    self.connectionPool.acquire(connId, function(err, connection) {
      if (err) {
        reject(err);
        return;
      }

      // we can ignore any errors that come from this since they'll be
      // re-emitted later
      connection.write(data, function(err) {
        if (!err) {
          self.latency_.add(Date.now() - startTime);
        }

        resolve();
      });
    });
  });
};

module.exports = Subscriber;
