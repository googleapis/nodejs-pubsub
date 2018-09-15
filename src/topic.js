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

const util = require('./util');
const {promisifyAll} = require('@google-cloud/promisify');
const {paginator} = require('@google-cloud/paginator');
const extend = require('extend');
const is = require('is');

const IAM = require('./iam');
const Publisher = require('./publisher');

/**
 * A Topic object allows you to interact with a Cloud Pub/Sub topic.
 *
 * @class
 * @param {PubSub} pubsub PubSub object.
 * @param {string} name Name of the topic.
 *
 * @example
 * const PubSub = require('@google-cloud/pubsub');
 * const pubsub = new PubSub();
 *
 * const topic = pubsub.topic('my-topic');
 */
class Topic {
  constructor(pubsub, name) {
    if (pubsub.Promise) {
      this.Promise = pubsub.Promise;
    }
    /**
     * The fully qualified name of this topic.
     * @name Topic#name
     * @type {string}
     */
    this.name = Topic.formatName_(pubsub.projectId, name);
    /**
     * The parent {@link PubSub} instance of this topic instance.
     * @name Topic#pubsub
     * @type {PubSub}
     */
    /**
     * The parent {@link PubSub} instance of this topic instance.
     * @name Topic#parent
     * @type {PubSub}
     */
    this.parent = this.pubsub = pubsub;
    this.request = pubsub.request.bind(pubsub);
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
     * @name Topic#iam
     * @mixes IAM
     *
     * @see [Access Control Overview]{@link https://cloud.google.com/pubsub/access_control}
     * @see [What is Cloud IAM?]{@link https://cloud.google.com/iam/}
     *
     * @example
     * const PubSub = require('@google-cloud/pubsub');
     * const pubsub = new PubSub();
     *
     * const topic = pubsub.topic('my-topic');
     *
     * //-
     * // Get the IAM policy for your topic.
     * //-
     * topic.iam.getPolicy((err, policy) => {
     *   console.log(policy);
     * });
     *
     * //-
     * // If the callback is omitted, we'll return a Promise.
     * //-
     * topic.iam.getPolicy().then((data) => {
     *   const policy = data[0];
     *   const apiResponse = data[1];
     * });
     */
    this.iam = new IAM(pubsub, this.name);
  }
  /**
   * Create a topic.
   *
   * @param {object} [gaxOpts] Request configuration options, outlined
   *     here: https://googleapis.github.io/gax-nodejs/CallSettings.html.
   * @param {CreateTopicCallback} [callback] Callback function.
   * @returns {Promise<CreateTopicResponse>}
   *
   * @example
   * const PubSub = require('@google-cloud/pubsub');
   * const pubsub = new PubSub();
   *
   * const topic = pubsub.topic('my-topic');
   *
   * topic.create((err, topic, apiResponse) => {
   *   if (!err) {
   *     // The topic was created successfully.
   *   }
   * });
   *
   * //-
   * // If the callback is omitted, we'll return a Promise.
   * //-
   * topic.create().then((data) => {
   *   const topic = data[0];
   *   const apiResponse = data[1];
   * });
   */
  create(gaxOpts, callback) {
    this.pubsub.createTopic(this.name, gaxOpts, callback);
  }
  /**
   * Create a subscription to this topic.
   *
   * @see [Subscriptions: create API Documentation]{@link https://cloud.google.com/pubsub/docs/reference/rest/v1/projects.subscriptions/create}
   *
   * @throws {Error} If subscription name is omitted.
   *
   * @param {string} name The name of the subscription.
   * @param {CreateSubscriptionRequest} [options] See a
   *     [Subscription resource](https://cloud.google.com/pubsub/docs/reference/rest/v1/projects.subscriptions).
   * @param {CreateSubscriptionCallback} [callback] Callback function.
   * @returns {Promise<CreateSubscriptionResponse>}
   *
   * @example
   * const PubSub = require('@google-cloud/pubsub');
   * const pubsub = new PubSub();
   *
   * const topic = pubsub.topic('my-topic');
   * const callback = function(err, subscription, apiResponse) {};
   *
   * // Without specifying any options.
   * topic.createSubscription('newMessages', callback);
   *
   * // With options.
   * topic.createSubscription('newMessages', {
   *   ackDeadlineSeconds: 90
   * }, callback);
   *
   * //-
   * // If the callback is omitted, we'll return a Promise.
   * //-
   * topic.createSubscription('newMessages').then((data) => {
   *   const subscription = data[0];
   *   const apiResponse = data[1];
   * });
   */
  createSubscription(name, options, callback) {
    this.pubsub.createSubscription(this, name, options, callback);
  }
  /**
   * Delete the topic. This will not delete subscriptions to this topic.
   *
   * @see [Topics: delete API Documentation]{@link https://cloud.google.com/pubsub/docs/reference/rest/v1/projects.topics/delete}
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
   *
   * topic.delete((err, apiResponse) => {});
   *
   * //-
   * // If the callback is omitted, we'll return a Promise.
   * //-
   * topic.delete().then((data) => {
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
      topic: this.name,
    };
    this.request(
      {
        client: 'PublisherClient',
        method: 'deleteTopic',
        reqOpts: reqOpts,
        gaxOpts: gaxOpts,
      },
      callback
    );
  }
  /**
   * @typedef {array} TopicExistsResponse
   * @property {boolean} 0 Whether the topic exists
   */
  /**
   * @callback TopicExistsCallback
   * @param {?Error} err Request error, if any.
   * @param {boolean} exists Whether the topic exists.
   */
  /**
   * Check if a topic exists.
   *
   * @param {TopicExistsCallback} [callback] Callback function.
   * @returns {Promise<TopicExistsResponse>}
   *
   * @example
   * const PubSub = require('@google-cloud/pubsub');
   * const pubsub = new PubSub();
   *
   * const topic = pubsub.topic('my-topic');
   *
   * topic.exists((err, exists) => {});
   *
   * //-
   * // If the callback is omitted, we'll return a Promise.
   * //-
   * topic.exists().then((data) => {
   *   const exists = data[0];
   * });
   */
  exists(callback) {
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
  }
  /**
   * @typedef {array} GetTopicResponse
   * @property {Topic} 0 The {@link Topic}.
   * @property {object} 1 The full API response.
   */
  /**
   * @callback GetTopicCallback
   * @param {?Error} err Request error, if any.
   * @param {Topic} topic The {@link Topic}.
   * @param {object} apiResponse The full API response.
   */
  /**
   * Get a topic if it exists.
   *
   * @param {object} [gaxOpts] Request configuration options, outlined
   *     here: https://googleapis.github.io/gax-nodejs/CallSettings.html.
   * @param {boolean} [gaxOpts.autoCreate=false] Automatically create the topic
   *     does not already exist.
   * @param {GetTopicCallback} [callback] Callback function.
   * @returns {Promise<GetTopicResponse>}
   *
   * @example
   * const PubSub = require('@google-cloud/pubsub');
   * const pubsub = new PubSub();
   *
   * const topic = pubsub.topic('my-topic');
   *
   * topic.get((err, topic, apiResponse) => {
   *   // The `topic` data has been populated.
   * });
   *
   * //-
   * // If the callback is omitted, we'll return a Promise.
   * //-
   * topic.get().then((data) => {
   *   const topic = data[0];
   *   const apiResponse = data[1];
   * });
   */
  get(gaxOpts, callback) {
    if (is.fn(gaxOpts)) {
      callback = gaxOpts;
      gaxOpts = {};
    }
    const autoCreate = !!gaxOpts.autoCreate;
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
   * @typedef {array} GetTopicMetadataResponse
   * @property {object} 0 The full API response.
   */
  /**
   * @callback GetTopicMetadataCallback
   * @param {?Error} err Request error, if any.
   * @param {object} apiResponse The full API response.
   */
  /**
   * Get the official representation of this topic from the API.
   *
   * @see [Topics: get API Documentation]{@link https://cloud.google.com/pubsub/docs/reference/rest/v1/projects.topics/get}
   *
   * @param {object} [gaxOpts] Request configuration options, outlined
   *     here: https://googleapis.github.io/gax-nodejs/CallSettings.html.
   * @param {GetTopicMetadataCallback} [callback] Callback function.
   * @returns {Promise<GetTopicMetadataResponse>}
   *
   * @example
   * const PubSub = require('@google-cloud/pubsub');
   * const pubsub = new PubSub();
   *
   * const topic = pubsub.topic('my-topic');
   *
   * topic.getMetadata((err, apiResponse) => {});
   *
   * //-
   * // If the callback is omitted, we'll return a Promise.
   * //-
   * topic.getMetadata().then((data) => {
   *   const apiResponse = data[0];
   * });
   */
  getMetadata(gaxOpts, callback) {
    if (is.fn(gaxOpts)) {
      callback = gaxOpts;
      gaxOpts = {};
    }
    const reqOpts = {
      topic: this.name,
    };
    this.request(
      {
        client: 'PublisherClient',
        method: 'getTopic',
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
   * Get a list of the subscriptions registered to this topic. You may optionally
   * provide a query object as the first argument to customize the response.
   *
   * Your provided callback will be invoked with an error object if an API error
   * occurred or an array of {module:pubsub/subscription} objects.
   *
   * @see [Subscriptions: list API Documentation]{@link https://cloud.google.com/pubsub/docs/reference/rest/v1/projects.topics.subscriptions/list}
   *
   * @param {GetSubscriptionsRequest} [query] Query object for listing subscriptions.
   * @param {GetSubscriptionsCallback} [callback] Callback function.
   * @returns {Promise<GetSubscriptionsResponse>}
   *
   * @example
   * const PubSub = require('@google-cloud/pubsub');
   * const pubsub = new PubSub();
   *
   * const topic = pubsub.topic('my-topic');
   *
   * topic.getSubscriptions((err, subscriptions) => {
   *   // subscriptions is an array of `Subscription` objects.
   * });
   *
   * // Customize the query.
   * topic.getSubscriptions({
   *   pageSize: 3
   * }, callback);
   *
   * //-
   * // If the callback is omitted, we'll return a Promise.
   * //-
   * topic.getSubscriptions().then((data) => {
   *   const subscriptions = data[0];
   * });
   */
  getSubscriptions(options, callback) {
    const self = this;
    if (is.fn(options)) {
      callback = options;
      options = {};
    }
    const reqOpts = extend(
      {
        topic: this.name,
      },
      options
    );
    delete reqOpts.gaxOpts;
    delete reqOpts.autoPaginate;
    const gaxOpts = extend(
      {
        autoPaginate: options.autoPaginate,
      },
      options.gaxOpts
    );
    this.request(
      {
        client: 'PublisherClient',
        method: 'listTopicSubscriptions',
        reqOpts: reqOpts,
        gaxOpts: gaxOpts,
      },
      function() {
        const subscriptions = arguments[1];
        if (subscriptions) {
          arguments[1] = subscriptions.map(function(sub) {
            // ListTopicSubscriptions only returns sub names
            return self.subscription(sub);
          });
        }
        callback.apply(null, arguments);
      }
    );
  }
  /**
   * Creates a Publisher object that allows you to publish messages to this topic.
   *
   * @param {object} [options] Configuration object.
   * @param {object} [options.batching] Batching settings.
   * @param {number} [options.batching.maxBytes] The maximum number of bytes to
   *     buffer before sending a payload.
   * @param {number} [options.batching.maxMessages] The maximum number of messages
   *     to buffer before sending a payload.
   * @param {number} [options.batching.maxMilliseconds] The maximum duration to
   *     wait before sending a payload.
   *
   * @return {Publisher}
   *
   * @example
   * const PubSub = require('@google-cloud/pubsub');
   * const pubsub = new PubSub();
   *
   * const topic = pubsub.topic('my-topic');
   * const publisher = topic.publisher();
   *
   * publisher.publish(Buffer.from('Hello, world!'), (err, messageId) => {
   *   if (err) {
   *     // Error handling omitted.
   *   }
   * });
   */
  publisher(options) {
    return new Publisher(this, options);
  }
  /**
   * Create a Subscription object. This command by itself will not run any API
   * requests. You will receive a {module:pubsub/subscription} object,
   * which will allow you to interact with a subscription.
   *
   * @throws {Error} If subscription name is omitted.
   *
   * @param {string} name Name of the subscription.
   * @param {object} [options] Configuration object.
   * @param {object} [options.flowControl] Flow control configurations for
   *     receiving messages. Note that these options do not persist across
   *     subscription instances.
   * @param {number} [options.flowControl.maxBytes] The maximum number of bytes
   *     in un-acked messages to allow before the subscription pauses incoming
   *     messages. Defaults to 20% of free memory.
   * @param {number} [options.flowControl.maxMessages=Infinity] The maximum number
   *     of un-acked messages to allow before the subscription pauses incoming
   *     messages.
   * @param {number} [options.maxConnections=5] Use this to limit the number of
   *     connections to be used when sending and receiving messages.
   * @return {Subscription}
   *
   * @example
   * const PubSub = require('@google-cloud/pubsub');
   * const pubsub = new PubSub();
   *
   * const topic = pubsub.topic('my-topic');
   * const subscription = topic.subscription('my-subscription');
   *
   * // Register a listener for `message` events.
   * subscription.on('message', (message) => {
   *   // Called every time a message is received.
   *   // message.id = ID of the message.
   *   // message.ackId = ID used to acknowledge the message receival.
   *   // message.data = Contents of the message.
   *   // message.attributes = Attributes of the message.
   *   // message.publishTime = Timestamp when Pub/Sub received the message.
   * });
   */
  subscription(name, options) {
    options = options || {};
    options.topic = this;
    return this.pubsub.subscription(name, options);
  }
  /**
   * Format the name of a topic. A Topic's full name is in the format of
   * 'projects/{projectId}/topics/{topicName}'.
   *
   * @private
   *
   * @return {string}
   */
  static formatName_(projectId, name) {
    // Simple check if the name is already formatted.
    if (name.indexOf('/') > -1) {
      return name;
    }
    return 'projects/' + projectId + '/topics/' + name;
  }
}

/**
 * Get a list of the {module:pubsub/subscription} objects registered to this
 * topic as a readable object stream.
 *
 * @method PubSub#getSubscriptionsStream
 * @param {GetSubscriptionsRequest} [options] Configuration object. See
 *     {@link PubSub#getSubscriptions} for a complete list of options.
 * @returns {ReadableStream} A readable stream of {@link Subscription} instances.
 *
 * @example
 * const PubSub = require('@google-cloud/pubsub');
 * const pubsub = new PubSub();
 *
 * const topic = pubsub.topic('my-topic');
 *
 * topic.getSubscriptionsStream()
 *   .on('error', console.error)
 *   .on('data', (subscription) => {
 *     // subscription is a Subscription object.
 *   })
 *   .on('end', () => {
 *     // All subscriptions retrieved.
 *   });
 *
 * //-
 * // If you anticipate many results, you can end a stream early to prevent
 * // unnecessary processing and API requests.
 * //-
 * topic.getSubscriptionsStream()
 *   .on('data', function(subscription) {
 *     this.end();
 *   });
 */
Topic.prototype.getSubscriptionsStream = paginator.streamify(
  'getSubscriptions'
);

/*! Developer Documentation
 *
 * These methods can be agto-paginated.
 */
paginator.extend(Topic, ['getSubscriptions']);

/*! Developer Documentation
 *
 * All async methods (except for streams) will return a Promise in the event
 * that a callback is omitted.
 */
promisifyAll(Topic, {
  exclude: ['publisher', 'subscription'],
});

module.exports = Topic;
