/*!
 * Copyright 2017 Google Inc. All Rights Reserved.
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

const {replaceProjectIdToken} = require('@google-cloud/projectify');
const duplexify = require('duplexify');
const each = require('async-each');
const {EventEmitter} = require('events');
const is = require('is');
const through = require('through2');
const uuid = require('uuid');
const util = require('./util');

const CHANNEL_READY_EVENT = 'channel.ready';
const CHANNEL_ERROR_EVENT = 'channel.error';

const KEEP_ALIVE_INTERVAL = 30000;

/*!
 * if we can't establish a connection within 5 minutes, we need to back off
 * and emit an error to the user.
 */
const MAX_TIMEOUT = 300000;

/*!
 * codes to retry streams
 */
const RETRY_CODES = [
  0, // ok
  1, // canceled
  2, // unknown
  4, // deadline exceeded
  8, // resource exhausted
  10, // aborted
  13, // internal error
  14, // unavailable
  15, // dataloss
];

/*!
 * ConnectionPool is used to manage the stream connections created via
 * StreamingPull rpc.
 *
 * @private
 * @param {Subscription} subscription The subscription to create
 *     connections for.
 * @param {object} [options] Pool options.
 * @param {number} [options.maxConnections=5] Number of connections to create.
 * @param {number} [options.ackDeadline] The ack deadline to send when
 *     creating a connection.
 */
class ConnectionPool extends EventEmitter {
  constructor(subscription) {
    super();
    this.subscription = subscription;
    this.pubsub = subscription.pubsub;
    this.connections = new Map();
    this.isPaused = false;
    this.isOpen = false;
    this.isGettingChannelState = false;
    this.failedConnectionAttempts = 0;
    this.noConnectionsTime = 0;
    this.settings = {
      maxConnections: subscription.maxConnections || 5,
      ackDeadline: subscription.ackDeadline || 10000,
    };
    this.queue = [];
    this.open();
  }
  /*!
   * Acquires a connection from the pool. Optionally you can specify an id for a
   * specific connection, but if it is no longer available it will return the
   * first available connection.
   *
   * @private
   * @param {string} [id] The id of the connection to retrieve.
   * @param {function} callback The callback function.
   * @param {?error} callback.err An error returned while acquiring a
   *     connection.
   * @param {stream} callback.connection A duplex stream.
   */
  acquire(id, callback) {
    if (is.fn(id)) {
      callback = id;
      id = null;
    }
    if (!this.isOpen) {
      callback(new Error('No connections available to make request.'));
      return;
    }
    // it's possible that by the time a user acks the connection could have
    // closed, so in that case we'll just return any connection
    if (!this.connections.has(id)) {
      id = this.connections.keys().next().value;
    }
    const connection = this.connections.get(id);
    if (connection) {
      callback(null, connection);
      return;
    }
    this.once('connected', connection => {
      callback(null, connection);
    });
  }
  /*!
   * Ends each connection in the pool and closes the pool, preventing new
   * connections from being created.
   *
   * @private
   * @param {function} callback The callback function.
   * @param {?error} callback.error An error returned while closing the pool.
   */
  close(callback) {
    const connections = Array.from(this.connections.values());
    callback = callback || util.noop;
    clearInterval(this.keepAliveHandle);
    this.connections.clear();
    this.queue.forEach(clearTimeout);
    this.queue.length = 0;
    this.isOpen = false;
    this.isGettingChannelState = false;
    this.removeAllListeners('newListener')
      .removeAllListeners(CHANNEL_READY_EVENT)
      .removeAllListeners(CHANNEL_ERROR_EVENT);
    this.failedConnectionAttempts = 0;
    this.noConnectionsTime = 0;
    each(
      connections,
      (connection, onEndCallback) => {
        connection.end(err => {
          connection.cancel();
          onEndCallback(err);
        });
      },
      err => {
        if (this.client) {
          this.client.close();
          this.client = null;
        }
        callback(err);
      }
    );
  }
  /*!
   * Creates a connection. This is async but instead of providing a callback
   * a `connected` event will fire once the connection is ready.
   *
   * @private
   */
  createConnection() {
    this.getClient((err, client) => {
      if (err) {
        this.emit('error', err);
        return;
      }
      const requestStream = client.streamingPull();
      const readStream = requestStream.pipe(
        through.obj((chunk, enc, next) => {
          chunk.receivedMessages.forEach(message => {
            readStream.push(message);
          });
          next();
        })
      );
      const connection = duplexify(requestStream, readStream, {
        objectMode: true,
      });
      const id = uuid.v4();
      let errorImmediateHandle;
      connection.cancel = requestStream.cancel.bind(requestStream);
      if (this.isPaused) {
        connection.pause();
      }

      const onChannelError = () => {
        this.removeListener(CHANNEL_READY_EVENT, onChannelReady);
        requestStream.cancel();
      };
      const onChannelReady = () => {
        this.removeListener(CHANNEL_ERROR_EVENT, onChannelError);
        connection.isConnected = true;
        this.noConnectionsTime = 0;
        this.failedConnectionAttempts = 0;
        this.emit('connected', connection);
      };
      // since this is a bidi stream it's possible that we recieve errors from
      // reads or writes. We also want to try and cut down on the number of
      // errors that we emit if other connections are still open. So by using
      // setImmediate we're able to cancel the error message if it gets passed
      // to the `status` event where we can check if the connection should be
      // re-opened or if we should send the error to the user
      const onConnectionError = err => {
        errorImmediateHandle = setImmediate(() => this.emit('error', err));
      };
      const onConnectionData = message => {
        this.emit('message', this.createMessage(id, message));
      };
      const onConnectionStatus = status => {
        clearImmediate(errorImmediateHandle);
        connection.end();
        this.connections.delete(id);
        if (!connection.isConnected) {
          this.failedConnectionAttempts += 1;
        }
        if (!this.isConnected() && !this.noConnectionsTime) {
          this.noConnectionsTime = Date.now();
        }
        if (this.shouldReconnect(status)) {
          this.queueConnection();
        } else if (this.isOpen && !this.connections.size) {
          const error = new Error(status.details);
          error.code = status.code;
          this.emit('error', error);
        }
      };

      this.once(CHANNEL_ERROR_EVENT, onChannelError).once(
        CHANNEL_READY_EVENT,
        onChannelReady
      );
      requestStream.on('status', status =>
        setImmediate(onConnectionStatus, status)
      );
      connection
        .on('error', onConnectionError)
        .on('data', onConnectionData)
        .write({
          subscription: replaceProjectIdToken(
            this.subscription.name,
            this.pubsub.projectId
          ),
          streamAckDeadlineSeconds: this.settings.ackDeadline / 1000,
        });
      this.connections.set(id, connection);
    });
  }
  /**
   * Creates a message object for the user.
   *
   * @param {string} connectionId The connection id that the message was
   *     received on.
   * @param {object} resp The message response data from StreamingPull.
   * @return {object} message The message object.
   */
  createMessage(connectionId, resp) {
    const pt = resp.message.publishTime;
    const milliseconds = parseInt(pt.nanos, 10) / 1e6;
    const originalDataLength = resp.message.data.length;
    const message = {
      connectionId: connectionId,
      ackId: resp.ackId,
      id: resp.message.messageId,
      attributes: resp.message.attributes,
      publishTime: new Date(parseInt(pt.seconds, 10) * 1000 + milliseconds),
      received: Date.now(),
      data: resp.message.data,
      // using get here to prevent user from overwriting data
      get length() {
        return originalDataLength;
      },
    };
    message.ack = () => {
      this.subscription.ack_(message);
    };
    message.nack = () => {
      this.subscription.nack_(message);
    };
    return message;
  }
  /*!
   * Gets the channels connectivity state and emits channel events accordingly.
   *
   * @private
   * @fires CHANNEL_ERROR_EVENT
   * @fires CHANNEL_READY_EVENT
   */
  getAndEmitChannelState() {
    this.isGettingChannelState = true;
    this.getClient((err, client) => {
      if (err) {
        this.isGettingChannelState = false;
        this.emit(CHANNEL_ERROR_EVENT);
        this.emit('error', err);
        return;
      }
      let elapsedTimeWithoutConnection = 0;
      const now = Date.now();
      let deadline;
      if (this.noConnectionsTime) {
        elapsedTimeWithoutConnection = now - this.noConnectionsTime;
      }
      deadline = now + (MAX_TIMEOUT - elapsedTimeWithoutConnection);
      client.waitForReady(deadline, err => {
        this.isGettingChannelState = false;
        if (err) {
          this.emit(CHANNEL_ERROR_EVENT, err);
          return;
        }
        this.emit(CHANNEL_READY_EVENT);
      });
    });
  }
  /*!
   * Gets the Subscriber client. We need to bypass GAX until they allow deadlines
   * to be optional.
   *
   * @private
   * @param {function} callback The callback function.
   * @param {?error} callback.err An error occurred while getting the client.
   * @param {object} callback.client The Subscriber client.
   */
  getClient(callback) {
    return this.pubsub.getClient_({client: 'SubscriberClient'}, callback);
  }
  /*!
   * Check to see if at least one stream in the pool is connected.
   *
   * @private
   * @returns {boolean}
   */
  isConnected() {
    const interator = this.connections.values();
    let connection = interator.next().value;
    while (connection) {
      if (connection.isConnected) {
        return true;
      }
      connection = interator.next().value;
    }
    return false;
  }
  /*!
   * Creates specified number of connections and puts pool in open state.
   *
   * @private
   */
  open() {
    let existing = this.connections.size;
    const max = this.settings.maxConnections;
    for (; existing < max; existing++) {
      this.queueConnection();
    }
    this.isOpen = true;
    this.failedConnectionAttempts = 0;
    this.noConnectionsTime = Date.now();
    this.on('newListener', eventName => {
      if (eventName === CHANNEL_READY_EVENT && !this.isGettingChannelState) {
        this.getAndEmitChannelState();
      }
    });
    if (!this.subscription.writeToStreams_) {
      this.keepAliveHandle = setInterval(() => {
        this.sendKeepAlives();
      }, KEEP_ALIVE_INTERVAL);
      this.keepAliveHandle.unref();
    }
  }
  /*!
   * Pauses each of the connections, causing `message` events to stop firing.
   *
   * @private
   */
  pause() {
    this.isPaused = true;
    this.connections.forEach(connection => {
      connection.pause();
    });
  }
  /*!
   * Queues a connection to be created. If any previous connections have failed,
   * it will apply a back off based on the number of failures.
   *
   * @private
   */
  queueConnection() {
    let delay = 0;
    if (this.failedConnectionAttempts > 0) {
      delay =
        Math.pow(2, this.failedConnectionAttempts) * 1000 +
        Math.floor(Math.random() * 1000);
    }
    const createConnection = () => {
      setImmediate(() => {
        this.createConnection();
        this.queue.splice(this.queue.indexOf(timeoutHandle), 1);
      });
    };
    const timeoutHandle = setTimeout(createConnection, delay);
    this.queue.push(timeoutHandle);
  }
  /*!
   * Calls resume on each connection, allowing `message` events to fire off again.
   *
   * @private
   */
  resume() {
    this.isPaused = false;
    this.connections.forEach(connection => {
      connection.resume();
    });
  }
  /*!
   * Sends empty message in an effort to keep the stream alive.
   *
   * @private
   */
  sendKeepAlives() {
    this.connections.forEach(connection => {
      connection.write({});
    });
  }
  /*!
   * Inspects a status object to determine whether or not we should try and
   * reconnect.
   *
   * @private
   * @param {object} status The gRPC status object.
   * @return {boolean}
   */
  shouldReconnect(status) {
    // If the pool was closed, we should definitely not reconnect
    if (!this.isOpen) {
      return false;
    }
    // We should check to see if the status code is a non-recoverable error
    if (RETRY_CODES.indexOf(status.code) === -1) {
      return false;
    }
    const exceededRetryLimit =
      this.noConnectionsTime &&
      Date.now() - this.noConnectionsTime > MAX_TIMEOUT;
    if (exceededRetryLimit) {
      return false;
    }
    return true;
  }
}

module.exports = ConnectionPool;
