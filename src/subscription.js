/*!
 * Copyright 2014 Google Inc. All Rights Reserved.
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
var snakeCase = require('lodash.snakecase');
var util = require('util');

var ConnectionPool = require('./connection-pool.js');
var Histogram = require('./histogram.js');
var IAM = require('./iam.js');
var Snapshot = require('./snapshot.js');

/**
 * @type {number} - The maximum number of ackIds to be sent in acknowledge/modifyAckDeadline
 *     requests. There is an API limit of 524288 bytes (512KiB) per acknowledge/modifyAckDeadline
 *     request. ackIds have a maximum size of 164 bytes, so 524288/164 ~= 3197. Accounting for some
 *     overhead, a maximum of 3000 ackIds per request should be safe.
 * @private
 */
var MAX_ACK_IDS_PER_REQUEST = 3000;

/**
 * A Subscription object will give you access to your Cloud Pub/Sub
 * subscription.
 *
 * Subscriptions are sometimes retrieved when using various methods:
 *
 * - {@link Pubsub#getSubscriptions}
 * - {@link Topic#getSubscriptions}
 * - {@link Topic#createSubscription}
 *
 * Subscription objects may be created directly with:
 *
 * - {@link Topic#subscription}
 *
 * All Subscription objects are instances of an
 * [EventEmitter](http://nodejs.org/api/events.html). The subscription will pull
 * for messages automatically as long as there is at least one listener assigned
 * for the `message` event.
 *
 * By default Subscription objects allow you to process 100 messages at the same
 * time. You can fine tune this value by adjusting the
 * `options.flowControl.maxMessages` option.
 *
 * @class
 *
 * @param {PubSub} pubsub PubSub object.
 * @param {string} name The name of the subscription.
 * @param {object} [options] See a
 *     [Subscription resource](https://cloud.google.com/pubsub/docs/reference/rest/v1/projects.subscriptions)
 * @param {object} [options.flowControl] Flow control configurations for
 *     receiving messages. Note that these options do not persist across
 *     subscription instances.
 * @param {number} [options.flowControl.maxBytes] The maximum number of bytes
 *     in un-acked messages to allow before the subscription pauses incoming
 *     messages. Defaults to 20% of free memory.
 * @param {number} [options.flowControl.maxMessages] The maximum number of
 *     un-acked messages to allow before the subscription pauses incoming
 *     messages. Default: 100.
 * @param {number} [options.maxConnections] Use this to limit the number of
 *     connections to be used when sending and receiving messages. Default: 5.
 *
 * @example
 * const PubSub = require('@google-cloud/pubsub');
 * const pubsub = new PubSub();
 *
 * //-
 * // From {@link PubSub#getSubscriptions}:
 * //-
 * pubsub.getSubscriptions(function(err, subscriptions) {
 *   // `subscriptions` is an array of Subscription objects.
 * });
 *
 * //-
 * // From {@link Topic#getSubscriptions}:
 * //-
 * var topic = pubsub.topic('my-topic');
 * topic.getSubscriptions(function(err, subscriptions) {
 *   // `subscriptions` is an array of Subscription objects.
 * });
 *
 * //-
 * // From {@link Topic#createSubscription}:
 * //-
 * var topic = pubsub.topic('my-topic');
 * topic.createSubscription('new-subscription', function(err, subscription) {
 *   // `subscription` is a Subscription object.
 * });
 *
 * //-
 * // From {@link Topic#subscription}:
 * //-
 * var topic = pubsub.topic('my-topic');
 * var subscription = topic.subscription('my-subscription');
 * // `subscription` is a Subscription object.
 *
 * //-
 * // Once you have obtained a subscription object, you may begin to register
 * // listeners. This will automatically trigger pulling for messages.
 * //-
 *
 * // Register an error handler.
 * subscription.on('error', function(err) {});
 *
 * // Register a listener for `message` events.
 * function onMessage(message) {
 *   // Called every time a message is received.
 *
 *   // message.id = ID of the message.
 *   // message.ackId = ID used to acknowledge the message receival.
 *   // message.data = Contents of the message.
 *   // message.attributes = Attributes of the message.
 *   // message.timestamp = Timestamp when Pub/Sub received the message.
 *
 *   // Ack the message:
 *   // message.ack();
 *
 *   // This doesn't ack the message, but allows more messages to be retrieved
 *   // if your limit was hit or if you don't want to ack the message.
 *   // message.nack();
 * }
 * subscription.on('message', onMessage);
 *
 * // Remove the listener from receiving `message` events.
 * subscription.removeListener('message', onMessage);
 */
function Subscription(pubsub, name, options) {
  if (pubsub.Promise) {
    this.Promise = pubsub.Promise;
  }

  options = options || {};

  this.pubsub = pubsub;
  this.projectId = pubsub.projectId;
  this.request = pubsub.request.bind(pubsub);
  this.histogram = new Histogram();
  this.latency_ = new Histogram({min: 0});

  this.name = Subscription.formatName_(pubsub.projectId, name);

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

  this.flushTimeoutHandle_ = null;
  this.leaseTimeoutHandle_ = null;
  this.userClosed_ = false;
  this.isOpen = false;

  events.EventEmitter.call(this);
  this.messageListeners = 0;

  if (options.topic) {
    this.create = pubsub.createSubscription.bind(pubsub, options.topic, name);
  }

  /**
   * [IAM (Identity and Access Management)](https://cloud.google.com/pubsub/access_control)
   * allows you to set permissions on individual resources and offers a wider
   * range of roles: editor, owner, publisher, subscriber, and viewer. This
   * gives you greater flexibility and allows you to set more fine-grained
   * access control.
   *
   * *The IAM access control features described in this document are Beta,
   * including the API methods to get and set IAM policies, and to test IAM
   * permissions. Cloud Pub/Sub's use of IAM features is not covered by
   * any SLA or deprecation policy, and may be subject to backward-incompatible
   * changes.*
   *
   * @name Subscription#iam
   * @mixes IAM
   *
   * @see [Access Control Overview]{@link https://cloud.google.com/pubsub/access_control}
   * @see [What is Cloud IAM?]{@link https://cloud.google.com/iam/}
   *
   * @example
   * //-
   * // Get the IAM policy for your subscription.
   * //-
   * subscription.iam.getPolicy(function(err, policy) {
   *   console.log(policy);
   * });
   *
   * //-
   * // If the callback is omitted, we'll return a Promise.
   * //-
   * subscription.iam.getPolicy().then(function(data) {
   *   var policy = data[0];
   *   var apiResponse = data[1];
   * });
   */
  this.iam = new IAM(pubsub, this.name);

  this.listenForEvents_();
}

util.inherits(Subscription, events.EventEmitter);

/*!
 * Formats Subscription metadata.
 *
 * @private
 */
Subscription.formatMetadata_ = function(metadata) {
  var formatted = extend({}, metadata);

  if (metadata.messageRetentionDuration) {
    formatted.retainAckedMessages = true;

    formatted.messageRetentionDuration = {
      seconds: metadata.messageRetentionDuration,
      nanos: 0,
    };
  }

  if (metadata.pushEndpoint) {
    delete formatted.pushEndpoint;

    formatted.pushConfig = {
      pushEndpoint: metadata.pushEndpoint,
    };
  }

  return formatted;
};

/*!
 * Format the name of a subscription. A subscription's full name is in the
 * format of projects/{projectId}/subscriptions/{subName}.
 *
 * @private
 */
Subscription.formatName_ = function(projectId, name) {
  // Simple check if the name is already formatted.
  if (name.indexOf('/') > -1) {
    return name;
  }

  return 'projects/' + projectId + '/subscriptions/' + name;
};

/*!
 * Acks the provided message. If the connection pool is absent, it will be
 * placed in an internal queue and sent out after 1 second or if the pool is
 * re-opened before the timeout hits.
 *
 * @private
 *
 * @param {object} message The message object.
 */
Subscription.prototype.ack_ = function(message) {
  var breakLease = this.breakLease_.bind(this, message);

  this.histogram.add(Date.now() - message.received);

  if (this.isConnected_()) {
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
Subscription.prototype.acknowledge_ = function(ackIds, connId) {
  var self = this;

  ackIds = arrify(ackIds);

  var promises = chunk(ackIds, MAX_ACK_IDS_PER_REQUEST).map(function(
    ackIdChunk
  ) {
    if (self.isConnected_()) {
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
Subscription.prototype.breakLease_ = function(message) {
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
 * Closes the subscription, once this is called you will no longer receive
 * message events unless you add a new message listener.
 *
 * @param {function} [callback] The callback function.
 * @param {?error} callback.err An error returned while closing the
 *     Subscription.
 *
 * @example
 * subscription.close(function(err) {
 *   if (err) {
 *     // Error handling omitted.
 *   }
 * });
 *
 * //-
 * // If the callback is omitted, we'll return a Promise.
 * //-
 * subscription.close().then(function() {});
 */
Subscription.prototype.close = function(callback) {
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
Subscription.prototype.closeConnection_ = function(callback) {
  this.isOpen = false;

  if (this.connectionPool) {
    this.connectionPool.close(callback || common.util.noop);
    this.connectionPool = null;
  } else if (is.fn(callback)) {
    setImmediate(callback);
  }
};

/**
 * @typedef {array} CreateSnapshotResponse
 * @property {Snapshot} 0 The new {@link Snapshot}.
 * @property {object} 1 The full API response.
 */
/**
 * @callback CreateSnapshotCallback
 * @param {?Error} err Request error, if any.
 * @param {Snapshot} snapshot The new {@link Snapshot}.
 * @param {object} apiResponse The full API response.
 */
/**
 * Create a snapshot with the given name.
 *
 * @param {string} name Name of the snapshot.
 * @param {object} [gaxOpts] Request configuration options, outlined
 *     here: https://googleapis.github.io/gax-nodejs/CallSettings.html.
 * @param {CreateSnapshotCallback} [callback] Callback function.
 * @returns {Promise<CreateSnapshotResponse>}
 *
 * @example
 * const PubSub = require('@google-cloud/pubsub');
 * const pubsub = new PubSub();
 *
 * const topic = pubsub.topic('my-topic');
 * const subscription = topic.subscription('my-subscription');
 *
 * const callback = function(err, snapshot, apiResponse) {
 *   if (!err) {
 *     // The snapshot was created successfully.
 *   }
 * };
 *
 * subscription.createSnapshot('my-snapshot', callback);
 *
 * //-
 * // If the callback is omitted, we'll return a Promise.
 * //-
 * subscription.createSnapshot('my-snapshot').then(function(data) {
 *   const snapshot = data[0];
 *   const apiResponse = data[1];
 * });
 */
Subscription.prototype.createSnapshot = function(name, gaxOpts, callback) {
  var self = this;

  if (!is.string(name)) {
    throw new Error('A name is required to create a snapshot.');
  }

  if (is.fn(gaxOpts)) {
    callback = gaxOpts;
    gaxOpts = {};
  }

  var snapshot = self.snapshot(name);

  var reqOpts = {
    name: snapshot.name,
    subscription: this.name,
  };

  this.request(
    {
      client: 'SubscriberClient',
      method: 'createSnapshot',
      reqOpts: reqOpts,
      gaxOpts: gaxOpts,
    },
    function(err, resp) {
      if (err) {
        callback(err, null, resp);
        return;
      }

      snapshot.metadata = resp;
      callback(null, snapshot, resp);
    }
  );
};

/**
 * Delete the subscription. Pull requests from the current subscription will be
 * errored once unsubscription is complete.
 *
 * @see [Subscriptions: delete API Documentation]{@link https://cloud.google.com/pubsub/docs/reference/rest/v1/projects.subscriptions/delete}
 *
 * @param {object} [gaxOpts] Request configuration options, outlined
 *     here: https://googleapis.github.io/gax-nodejs/CallSettings.html.
 * @param {function} [callback] The callback function.
 * @param {?error} callback.err An error returned while making this
 *     request.
 * @param {object} callback.apiResponse Raw API response.
 *
 * @example
 * const PubSub = require('@google-cloud/pubsub');
 * const pubsub = new PubSub();
 *
 * const topic = pubsub.topic('my-topic');
 * const subscription = topic.subscription('my-subscription');
 *
 * subscription.delete(function(err, apiResponse) {});
 *
 * //-
 * // If the callback is omitted, we'll return a Promise.
 * //-
 * subscription.delete().then(function(data) {
 *   const apiResponse = data[0];
 * });
 */
Subscription.prototype.delete = function(gaxOpts, callback) {
  var self = this;

  if (is.fn(gaxOpts)) {
    callback = gaxOpts;
    gaxOpts = {};
  }

  callback = callback || common.util.noop;

  var reqOpts = {
    subscription: this.name,
  };

  this.request(
    {
      client: 'SubscriberClient',
      method: 'deleteSubscription',
      reqOpts: reqOpts,
      gaxOpts: gaxOpts,
    },
    function(err, resp) {
      if (!err) {
        self.removeAllListeners();
        self.close();
      }

      callback(err, resp);
    }
  );
};

/**
 * @typedef {array} SubscriptionExistsResponse
 * @property {boolean} 0 Whether the subscription exists
 */
/**
 * @callback SubscriptionExistsCallback
 * @param {?Error} err Request error, if any.
 * @param {boolean} exists Whether the subscription exists.
 */
/**
 * Check if a subscription exists.
 *
 * @param {SubscriptionExistsCallback} [callback] Callback function.
 * @returns {Promise<SubscriptionExistsResponse>}
 *
 * @example
 * const PubSub = require('@google-cloud/pubsub');
 * const pubsub = new PubSub();
 *
 * const topic = pubsub.topic('my-topic');
 * const subscription = topic.subscription('my-subscription');
 *
 * subscription.exists(function(err, exists) {});
 *
 * //-
 * // If the callback is omitted, we'll return a Promise.
 * //-
 * subscription.exists().then(function(data) {
 *   var exists = data[0];
 * });
 */
Subscription.prototype.exists = function(callback) {
  this.getMetadata(function(err) {
    if (!err) {
      callback(null, true);
      return;
    }

    if (err.code === 5) {
      callback(null, false);
      return;
    }

    callback(err);
  });
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
Subscription.prototype.flushQueues_ = function() {
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

/**
 * @typedef {array} GetSubscriptionResponse
 * @property {Subscription} 0 The {@link Subscription}.
 * @property {object} 1 The full API response.
 */
/**
 * @callback GetSubscriptionCallback
 * @param {?Error} err Request error, if any.
 * @param {Subscription} subscription The {@link Subscription}.
 * @param {object} apiResponse The full API response.
 */
/**
 * Get a subscription if it exists.
 *
 * @param {object} [gaxOpts] Request configuration options, outlined
 *     here: https://googleapis.github.io/gax-nodejs/CallSettings.html.
 * @param {boolean} [gaxOpts.autoCreate=false] Automatically create the
 *     subscription if it does not already exist.
 * @param {GetSubscriptionCallback} [callback] Callback function.
 * @returns {Promise<GetSubscriptionResponse>}
 *
 * @example
 * const PubSub = require('@google-cloud/pubsub');
 * const pubsub = new PubSub();
 *
 * const topic = pubsub.topic('my-topic');
 * const subscription = topic.subscription('my-subscription');
 *
 * subscription.get(function(err, subscription, apiResponse) {
 *   // The `subscription` data has been populated.
 * });
 *
 * //-
 * // If the callback is omitted, we'll return a Promise.
 * //-
 * subscription.get().then(function(data) {
 *   const subscription = data[0];
 *   const apiResponse = data[1];
 * });
 */
Subscription.prototype.get = function(gaxOpts, callback) {
  var self = this;

  if (is.fn(gaxOpts)) {
    callback = gaxOpts;
    gaxOpts = {};
  }

  var autoCreate = !!gaxOpts.autoCreate && is.fn(this.create);
  delete gaxOpts.autoCreate;

  this.getMetadata(gaxOpts, function(err, apiResponse) {
    if (!err) {
      callback(null, self, apiResponse);
      return;
    }

    if (err.code !== 5 || !autoCreate) {
      callback(err, null, apiResponse);
      return;
    }

    self.create(gaxOpts, callback);
  });
};

/**
 * @typedef {array} GetSubscriptionMetadataResponse
 * @property {object} 0 The full API response.
 */
/**
 * @callback GetSubscriptionMetadataCallback
 * @param {?Error} err Request error, if any.
 * @param {object} apiResponse The full API response.
 */
/**
 * Fetches the subscriptions metadata.
 *
 * @param {object} [gaxOpts] Request configuration options, outlined
 *     here: https://googleapis.github.io/gax-nodejs/CallSettings.html.
 * @param {GetSubscriptionMetadataCallback} [callback] Callback function.
 * @returns {Promise<GetSubscriptionMetadataResponse>}
 *
 * @example
 * const PubSub = require('@google-cloud/pubsub');
 * const pubsub = new PubSub();
 *
 * const topic = pubsub.topic('my-topic');
 * const subscription = topic.subscription('my-subscription');
 *
 * subscription.getMetadata(function(err, apiResponse) {
 *   if (err) {
 *     // Error handling omitted.
 *   }
 * });
 *
 * //-
 * // If the callback is omitted, we'll return a Promise.
 * //-
 * subscription.getMetadata().then(function(data) {
 *   var apiResponse = data[0];
 * });
 */
Subscription.prototype.getMetadata = function(gaxOpts, callback) {
  var self = this;

  if (is.fn(gaxOpts)) {
    callback = gaxOpts;
    gaxOpts = {};
  }

  var reqOpts = {
    subscription: this.name,
  };

  this.request(
    {
      client: 'SubscriberClient',
      method: 'getSubscription',
      reqOpts: reqOpts,
      gaxOpts: gaxOpts,
    },
    function(err, apiResponse) {
      if (!err) {
        self.metadata = apiResponse;
      }

      callback(err, apiResponse);
    }
  );
};

/*!
 * Checks to see if we currently have a streaming connection.
 *
 * @private
 *
 * @return {boolean}
 */
Subscription.prototype.isConnected_ = function() {
  return !!(this.connectionPool && this.connectionPool.isConnected());
};

/*!
 * Checks to see if this Subscription has hit any of the flow control
 * thresholds.
 *
 * @private
 *
 * @return {boolean}
 */
Subscription.prototype.hasMaxMessages_ = function() {
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
Subscription.prototype.leaseMessage_ = function(message) {
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
 * Begin listening for events on the subscription. This method keeps track of
 * how many message listeners are assigned, and then removed, making sure
 * polling is handled automatically.
 *
 * As long as there is one active message listener, the connection is open. As
 * soon as there are no more message listeners, the connection is closed.
 *
 * @private
 *
 * @example
 * subscription.listenForEvents_();
 */
Subscription.prototype.listenForEvents_ = function() {
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
Subscription.prototype.modifyAckDeadline_ = function(ackIds, deadline, connId) {
  var self = this;

  ackIds = arrify(ackIds);

  var promises = chunk(ackIds, MAX_ACK_IDS_PER_REQUEST).map(function(
    ackIdChunk
  ) {
    if (self.isConnected_()) {
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

/**
 * @typedef {array} ModifyPushConfigResponse
 * @property {object} 0 The full API response.
 */
/**
 * @callback ModifyPushConfigCallback
 * @param {?Error} err Request error, if any.
 * @param {object} apiResponse The full API response.
 */
/**
 * Modify the push config for the subscription.
 *
 * @param {object} config The push config.
 * @param {string} config.pushEndpoint A URL locating the endpoint to which
 *     messages should be published.
 * @param {object} config.attributes [PushConfig attributes](https://cloud.google.com/pubsub/docs/reference/rpc/google.pubsub.v1#google.pubsub.v1.PushConfig).
 * @param {object} [gaxOpts] Request configuration options, outlined
 *     here: https://googleapis.github.io/gax-nodejs/CallSettings.html.
 * @param {ModifyPushConfigCallback} [callback] Callback function.
 * @returns {Promise<ModifyPushConfigResponse>}
 *
 * @example
 * const PubSub = require('@google-cloud/pubsub');
 * const pubsub = new PubSub();
 *
 * const topic = pubsub.topic('my-topic');
 * const subscription = topic.subscription('my-subscription');
 *
 * var pushConfig = {
 *   pushEndpoint: 'https://mydomain.com/push',
 *   attributes: {
 *     key: 'value'
 *   }
 * };
 *
 * subscription.modifyPushConfig(pushConfig, function(err, apiResponse) {
 *   if (err) {
 *     // Error handling omitted.
 *   }
 * });
 *
 * //-
 * // If the callback is omitted, we'll return a Promise.
 * //-
 * subscription.modifyPushConfig(pushConfig).then(function(data) {
 *   var apiResponse = data[0];
 * });
 */
Subscription.prototype.modifyPushConfig = function(config, gaxOpts, callback) {
  if (is.fn(gaxOpts)) {
    callback = gaxOpts;
    gaxOpts = {};
  }

  var reqOpts = {
    subscription: this.name,
    pushConfig: config,
  };

  this.request(
    {
      client: 'SubscriberClient',
      method: 'modifyPushConfig',
      reqOpts: reqOpts,
      gaxOpts: gaxOpts,
    },
    callback
  );
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
Subscription.prototype.nack_ = function(message) {
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
Subscription.prototype.openConnection_ = function() {
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
Subscription.prototype.renewLeases_ = function() {
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

/**
 * @typedef {array} SeekResponse
 * @property {object} 0 The full API response.
 */
/**
 * @callback SeekCallback
 * @param {?Error} err Request error, if any.
 * @param {object} apiResponse The full API response.
 */
/**
 * Seeks an existing subscription to a point in time or a given snapshot.
 *
 * @param {string|date} snapshot The point to seek to. This will accept the
 *     name of the snapshot or a Date object.
 * @param {object} [gaxOpts] Request configuration options, outlined
 *     here: https://googleapis.github.io/gax-nodejs/CallSettings.html.
 * @param {SeekCallback} [callback] Callback function.
 * @returns {Promise<SeekResponse>}
 *
 * @example
 * var callback = function(err, resp) {
 *   if (!err) {
 *     // Seek was successful.
 *   }
 * };
 *
 * subscription.seek('my-snapshot', callback);
 *
 * //-
 * // Alternatively, to specify a certain point in time, you can provide a Date
 * // object.
 * //-
 * var date = new Date('October 21 2015');
 *
 * subscription.seek(date, callback);
 */
Subscription.prototype.seek = function(snapshot, gaxOpts, callback) {
  if (is.fn(gaxOpts)) {
    callback = gaxOpts;
    gaxOpts = {};
  }

  var reqOpts = {
    subscription: this.name,
  };

  if (is.string(snapshot)) {
    reqOpts.snapshot = Snapshot.formatName_(this.pubsub.projectId, snapshot);
  } else if (is.date(snapshot)) {
    reqOpts.time = snapshot;
  } else {
    throw new Error('Either a snapshot name or Date is needed to seek to.');
  }

  this.request(
    {
      client: 'SubscriberClient',
      method: 'seek',
      reqOpts: reqOpts,
      gaxOpts: gaxOpts,
    },
    callback
  );
};

/*!
 * Sets a timeout to flush any acks/nacks that have been made since the pool has
 * closed.
 *
 * @private
 */
Subscription.prototype.setFlushTimeout_ = function() {
  if (!this.flushTimeoutHandle_) {
    var timeout = delay(1000);
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
Subscription.prototype.setLeaseTimeout_ = function() {
  if (this.leaseTimeoutHandle_ || !this.isOpen) {
    return;
  }

  var latency = this.latency_.percentile(99);
  var timeout = Math.random() * this.ackDeadline * 0.9 - latency;

  this.leaseTimeoutHandle_ = setTimeout(this.renewLeases_.bind(this), timeout);
};

/**
 * @typedef {array} SetSubscriptionMetadataResponse
 * @property {object} 0 The full API response.
 */
/**
 * @callback SetSubscriptionMetadataCallback
 * @param {?Error} err Request error, if any.
 * @param {object} apiResponse The full API response.
 */
/**
 * Update the subscription object.
 *
 * @param {object} metadata The subscription metadata.
 * @param {object} [gaxOpts] Request configuration options, outlined
 *     here: https://googleapis.github.io/gax-nodejs/CallSettings.html.
 * @param {SetSubscriptionMetadataCallback} [callback] Callback function.
 * @returns {Promise<SetSubscriptionMetadataResponse>}
 *
 * @example
 * var metadata = {
 *   key: 'value'
 * };
 *
 * subscription.setMetadata(metadata, function(err, apiResponse) {
 *   if (err) {
 *     // Error handling omitted.
 *   }
 * });
 *
 * //-
 * // If the callback is omitted, we'll return a Promise.
 * //-
 * subscription.setMetadata(metadata).then(function(data) {
 *   var apiResponse = data[0];
 * });
 */
Subscription.prototype.setMetadata = function(metadata, gaxOpts, callback) {
  if (is.fn(gaxOpts)) {
    callback = gaxOpts;
    gaxOpts = {};
  }

  var subscription = Subscription.formatMetadata_(metadata);
  var fields = Object.keys(subscription).map(snakeCase);

  subscription.name = this.name;

  var reqOpts = {
    subscription: subscription,
    updateMask: {
      paths: fields,
    },
  };

  this.request(
    {
      client: 'SubscriberClient',
      method: 'updateSubscription',
      reqOpts: reqOpts,
      gaxOpts: gaxOpts,
    },
    callback
  );
};

/**
 * Create a Snapshot object. See {@link Subscription#createSnapshot} to
 * create a snapshot.
 *
 * @throws {Error} If a name is not provided.
 *
 * @param {string} name The name of the snapshot.
 * @returns {Snapshot}
 *
 * @example
 * var snapshot = subscription.snapshot('my-snapshot');
 */
Subscription.prototype.snapshot = function(name) {
  return this.pubsub.snapshot.call(this, name);
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
Subscription.prototype.writeTo_ = function(connId, data) {
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

/*! Developer Documentation
 *
 * All async methods (except for streams) will return a Promise in the event
 * that a callback is omitted.
 */
common.util.promisifyAll(Subscription, {
  exclude: ['snapshot'],
});

module.exports = Subscription;
