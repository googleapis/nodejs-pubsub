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

const util = require('./util');
const {promisifyAll} = require('@google-cloud/promisify');
const extend = require('extend');
const is = require('is');
const snakeCase = require('lodash.snakecase');

const IAM = require('./iam');
const Snapshot = require('./snapshot');
const Subscriber = require('./subscriber');

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
 * Subscription objects handle ack management, by automatically extending the
 * ack deadline while the message is being processed, to then issue the ack or
 * nack of such message when the processing is done. **Note:** message
 * redelivery is still possible.
 *
 * @class
 *
 * @param {PubSub} pubsub PubSub object.
 * @param {string} name The name of the subscription.
 * @param {object} [options] See a
 *     [Subscription resource](https://cloud.google.com/pubsub/docs/reference/rest/v1/projects.subscriptions)
 * @param {object} [options.batching] Batch configurations for sending out
 *     Acknowledge and ModifyAckDeadline requests.
 * @param {number} [options.batching.maxMilliseconds] The maximum amount of time
 *     to buffer Acknowledge and ModifyAckDeadline requests. Default: 100.
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
 * pubsub.getSubscriptions((err, subscriptions) => {
 *   // `subscriptions` is an array of Subscription objects.
 * });
 *
 * //-
 * // From {@link Topic#getSubscriptions}:
 * //-
 * const topic = pubsub.topic('my-topic');
 * topic.getSubscriptions((err, subscriptions) => {
 *   // `subscriptions` is an array of Subscription objects.
 * });
 *
 * //-
 * // From {@link Topic#createSubscription}:
 * //-
 * const topic = pubsub.topic('my-topic');
 * topic.createSubscription('new-subscription', (err, subscription) => {
 *   // `subscription` is a Subscription object.
 * });
 *
 * //-
 * // From {@link Topic#subscription}:
 * //-
 * const topic = pubsub.topic('my-topic');
 * const subscription = topic.subscription('my-subscription');
 * // `subscription` is a Subscription object.
 *
 * //-
 * // Once you have obtained a subscription object, you may begin to register
 * // listeners. This will automatically trigger pulling for messages.
 * //-
 *
 * // Register an error handler.
 * subscription.on('error', (err) => {});
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
class Subscription extends Subscriber {
  constructor(pubsub, name, options) {
    options = options || {};
    super(options);
    if (pubsub.Promise) {
      this.Promise = pubsub.Promise;
    }
    this.pubsub = pubsub;
    this.projectId = pubsub.projectId;
    this.request = pubsub.request.bind(pubsub);
    this.name = Subscription.formatName_(pubsub.projectId, name);
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
     * subscription.iam.getPolicy((err, policy) => {
     *   console.log(policy);
     * });
     *
     * //-
     * // If the callback is omitted, we'll return a Promise.
     * //-
     * subscription.iam.getPolicy().then((data) => {
     *   const policy = data[0];
     *   const apiResponse = data[1];
     * });
     */
    this.iam = new IAM(pubsub, this.name);
  }
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
   * const callback = (err, snapshot, apiResponse) => {
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
   * subscription.createSnapshot('my-snapshot').then((data) => {
   *   const snapshot = data[0];
   *   const apiResponse = data[1];
   * });
   */
  createSnapshot(name, gaxOpts, callback) {
    if (!is.string(name)) {
      throw new Error('A name is required to create a snapshot.');
    }
    if (is.fn(gaxOpts)) {
      callback = gaxOpts;
      gaxOpts = {};
    }
    const snapshot = this.snapshot(name);
    const reqOpts = {
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
      (err, resp) => {
        if (err) {
          callback(err, null, resp);
          return;
        }
        snapshot.metadata = resp;
        callback(null, snapshot, resp);
      }
    );
  }
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
   * subscription.delete((err, apiResponse) => {});
   *
   * //-
   * // If the callback is omitted, we'll return a Promise.
   * //-
   * subscription.delete().then((data) => {
   *   const apiResponse = data[0];
   * });
   */
  delete(gaxOpts, callback) {
    if (is.fn(gaxOpts)) {
      callback = gaxOpts;
      gaxOpts = {};
    }
    callback = callback || util.noop;
    const reqOpts = {
      subscription: this.name,
    };
    this.request(
      {
        client: 'SubscriberClient',
        method: 'deleteSubscription',
        reqOpts: reqOpts,
        gaxOpts: gaxOpts,
      },
      (err, resp) => {
        if (!err) {
          this.removeAllListeners();
          this.close();
        }
        callback(err, resp);
      }
    );
  }
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
   * subscription.exists((err, exists) => {});
   *
   * //-
   * // If the callback is omitted, we'll return a Promise.
   * //-
   * subscription.exists().then((data) => {
   *   const exists = data[0];
   * });
   */
  exists(callback) {
    this.getMetadata(err => {
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
  }
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
   * subscription.get((err, subscription, apiResponse) => {
   *   // The `subscription` data has been populated.
   * });
   *
   * //-
   * // If the callback is omitted, we'll return a Promise.
   * //-
   * subscription.get().then((data) => {
   *   const subscription = data[0];
   *   const apiResponse = data[1];
   * });
   */
  get(gaxOpts, callback) {
    if (is.fn(gaxOpts)) {
      callback = gaxOpts;
      gaxOpts = {};
    }
    const autoCreate = !!gaxOpts.autoCreate && is.fn(this.create);
    delete gaxOpts.autoCreate;
    this.getMetadata(gaxOpts, (err, apiResponse) => {
      if (!err) {
        callback(null, this, apiResponse);
        return;
      }
      if (err.code !== 5 || !autoCreate) {
        callback(err, null, apiResponse);
        return;
      }
      this.create(gaxOpts, callback);
    });
  }
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
   * subscription.getMetadata((err, apiResponse) => {
   *   if (err) {
   *     // Error handling omitted.
   *   }
   * });
   *
   * //-
   * // If the callback is omitted, we'll return a Promise.
   * //-
   * subscription.getMetadata().then((data) => {
   *   const apiResponse = data[0];
   * });
   */
  getMetadata(gaxOpts, callback) {
    if (is.fn(gaxOpts)) {
      callback = gaxOpts;
      gaxOpts = {};
    }
    const reqOpts = {
      subscription: this.name,
    };
    this.request(
      {
        client: 'SubscriberClient',
        method: 'getSubscription',
        reqOpts: reqOpts,
        gaxOpts: gaxOpts,
      },
      (err, apiResponse) => {
        if (!err) {
          this.metadata = apiResponse;
        }
        callback(err, apiResponse);
      }
    );
  }
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
   * const pushConfig = {
   *   pushEndpoint: 'https://mydomain.com/push',
   *   attributes: {
   *     key: 'value'
   *   }
   * };
   *
   * subscription.modifyPushConfig(pushConfig, (err, apiResponse) => {
   *   if (err) {
   *     // Error handling omitted.
   *   }
   * });
   *
   * //-
   * // If the callback is omitted, we'll return a Promise.
   * //-
   * subscription.modifyPushConfig(pushConfig).then((data) => {
   *   const apiResponse = data[0];
   * });
   */
  modifyPushConfig(config, gaxOpts, callback) {
    if (is.fn(gaxOpts)) {
      callback = gaxOpts;
      gaxOpts = {};
    }
    const reqOpts = {
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
  }
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
   * const callback = (err, resp) => {
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
   * const date = new Date('October 21 2015');
   *
   * subscription.seek(date, callback);
   */
  seek(snapshot, gaxOpts, callback) {
    if (is.fn(gaxOpts)) {
      callback = gaxOpts;
      gaxOpts = {};
    }
    const reqOpts = {
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
  }
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
   * const metadata = {
   *   key: 'value'
   * };
   *
   * subscription.setMetadata(metadata, (err, apiResponse) => {
   *   if (err) {
   *     // Error handling omitted.
   *   }
   * });
   *
   * //-
   * // If the callback is omitted, we'll return a Promise.
   * //-
   * subscription.setMetadata(metadata).then((data) => {
   *   const apiResponse = data[0];
   * });
   */
  setMetadata(metadata, gaxOpts, callback) {
    if (is.fn(gaxOpts)) {
      callback = gaxOpts;
      gaxOpts = {};
    }
    const subscription = Subscription.formatMetadata_(metadata);
    const fields = Object.keys(subscription).map(snakeCase);
    subscription.name = this.name;
    const reqOpts = {
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
  }
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
   * const snapshot = subscription.snapshot('my-snapshot');
   */
  snapshot(name) {
    return this.pubsub.snapshot.call(this, name);
  }
  /*!
   * Formats Subscription metadata.
   *
   * @private
   */
  static formatMetadata_(metadata) {
    const formatted = extend({}, metadata);
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
  }
  /*!
   * Format the name of a subscription. A subscription's full name is in the
   * format of projects/{projectId}/subscriptions/{subName}.
   *
   * @private
   */
  static formatName_(projectId, name) {
    // Simple check if the name is already formatted.
    if (name.indexOf('/') > -1) {
      return name;
    }
    return 'projects/' + projectId + '/subscriptions/' + name;
  }
}

/*! Developer Documentation
 *
 * All async methods (except for streams) will return a Promise in the event
 * that a callback is omitted.
 */
promisifyAll(Subscription, {
  exclude: ['snapshot'],
});

module.exports = Subscription;
