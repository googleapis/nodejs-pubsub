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

const {replaceProjectIdToken} = require('@google-cloud/projectify');
const {paginator} = require('@google-cloud/paginator');
const {promisifyAll} = require('@google-cloud/promisify');
const extend = require('extend');
const {GoogleAuth} = require('google-auth-library');
const gax = require('google-gax');
const {grpc} = new gax.GrpcClient();
const is = require('is');

const PKG = require('../package.json');
const v1 = require('./v1');

const Snapshot = require('./snapshot');
const Subscription = require('./subscription');
const Topic = require('./topic');

/**
 * @type {string} - Project ID placeholder.
 * @private
 */
const PROJECT_ID_PLACEHOLDER = '{{projectId}}';

/**
 * @typedef {object} ClientConfig
 * @property {string} [projectId] The project ID from the Google Developer's
 *     Console, e.g. 'grape-spaceship-123'. We will also check the environment
 *     variable `GCLOUD_PROJECT` for your project ID. If your app is running in
 *     an environment which supports {@link https://cloud.google.com/docs/authentication/production#providing_credentials_to_your_application Application Default Credentials},
 *     your project ID will be detected automatically.
 * @property {string} [keyFilename] Full path to the a .json, .pem, or .p12 key
 *     downloaded from the Google Developers Console. If you provide a path to a
 *     JSON file, the `projectId` option above is not necessary. NOTE: .pem and
 *     .p12 require you to specify the `email` option as well.
 * @property {string} [apiEndpoint] The `apiEndpoint` from options will set the
 *     host. If not set, the `PUBSUB_EMULATOR_HOST` environment variable from
 *     the gcloud SDK is honored, otherwise the actual API endpoint will be
 *     used.
 * @property {string} [email] Account email address. Required when using a .pem
 *     or .p12 keyFilename.
 * @property {object} [credentials] Credentials object.
 * @property {string} [credentials.client_email]
 * @property {string} [credentials.private_key]
 * @property {boolean} [autoRetry=true] Automatically retry requests if the
 *     response is related to rate limits or certain intermittent server errors.
 *     We will exponentially backoff subsequent requests by default.
 * @property {number} [maxRetries=3] Maximum number of automatic retries
 *     attempted before returning the error.
 * @property {Constructor} [promise] Custom promise module to use instead of
 *     native Promises.
 */
/**
 * [Cloud Pub/Sub](https://developers.google.com/pubsub/overview) is a
 * reliable, many-to-many, asynchronous messaging service from Cloud
 * Platform.
 *
 * @class
 *
 * @see [Cloud Pub/Sub overview]{@link https://developers.google.com/pubsub/overview}
 *
 * @param {ClientConfig} [options] Configuration options.
 *
 * @example <caption>Import the client library</caption>
 * const PubSub = require('@google-cloud/pubsub');
 *
 * @example <caption>Create a client that uses <a href="https://cloud.google.com/docs/authentication/production#providing_credentials_to_your_application">Application Default Credentials (ADC)</a>:</caption>
 * const pubsub = new PubSub();
 *
 * @example <caption>Create a client with <a href="https://cloud.google.com/docs/authentication/production#obtaining_and_providing_service_account_credentials_manually">explicit credentials</a>:</caption>
 * const pubsub = new PubSub({
 *   projectId: 'your-project-id',
 *   keyFilename: '/path/to/keyfile.json'
 * });
 *
 * @example <caption>include:samples/quickstart.js</caption>
 * region_tag:pubsub_quickstart_create_topic
 * Full quickstart example:
 */
class PubSub {
  constructor(options) {
    options = options || {};
    // Determine what scopes are needed.
    // It is the union of the scopes on both clients.
    const clientClasses = [v1.SubscriberClient, v1.PublisherClient];
    const allScopes = {};
    for (let clientClass of clientClasses) {
      for (let scope of clientClass.scopes) {
        allScopes[scope] = true;
      }
    }
    this.options = extend(
      {
        'grpc.keepalive_time_ms': 300000,
        'grpc.max_receive_message_length': 20000001,
        libName: 'gccl',
        libVersion: PKG.version,
        scopes: Object.keys(allScopes),
      },
      options
    );
    /**
     * @name PubSub#isEmulator
     * @type {boolean}
     */
    this.isEmulator = false;
    this.determineBaseUrl_();
    this.api = {};
    this.auth = new GoogleAuth(this.options);
    this.projectId = this.options.projectId || PROJECT_ID_PLACEHOLDER;
    if (this.options.promise) {
      this.Promise = this.options.promise;
    }
  }
  /**
   * Options for creating a subscription.
   *
   * See a [Subscription resource](https://cloud.google.com/pubsub/docs/reference/rest/v1/projects.subscriptions).
   *
   * @typedef {object} CreateSubscriptionRequest
   * @property {object} [flowControl] Flow control configurations for
   *     receiving messages. Note that these options do not persist across
   *     subscription instances.
   * @property {number} [flowControl.maxBytes] The maximum number of bytes
   *     in un-acked messages to allow before the subscription pauses incoming
   *     messages. Defaults to 20% of free memory.
   * @property {number} [flowControl.maxMessages=Infinity] The maximum number
   *     of un-acked messages to allow before the subscription pauses incoming
   *     messages.
   * @property {object} [gaxOpts] Request configuration options, outlined
   *     here: https://googleapis.github.io/gax-nodejs/CallSettings.html.
   * @property {number|date} [messageRetentionDuration] Set this to override
   *     the default duration of 7 days. This value is expected in seconds.
   *     Acceptable values are in the range of 10 minutes and 7 days.
   * @property {string} [pushEndpoint] A URL to a custom endpoint that
   *     messages should be pushed to.
   * @property {boolean} [retainAckedMessages=false] If set, acked messages
   *     are retained in the subscription's backlog for the length of time
   *     specified by `options.messageRetentionDuration`.
   */
  /**
   * @typedef {array} CreateSubscriptionResponse
   * @property {Subscription} 0 The new {@link Subscription}.
   * @property {object} 1 The full API response.
   */
  /**
   * @callback CreateSubscriptionCallback
   * @param {?Error} err Request error, if any.
   * @param {Subscription} subscription The new {@link Subscription}.
   * @param {object} apiResponse The full API response.
   */
  /**
   * Create a subscription to a topic.
   *
   * @see [Subscriptions: create API Documentation]{@link https://cloud.google.com/pubsub/docs/reference/rest/v1/projects.subscriptions/create}
   * @see {@link Topic#createSubscription}
   *
   * @throws {Error} If a Topic instance or topic name is not provided.
   * @throws {Error} If a subscription name is not provided.
   *
   * @param {Topic|string} topic The Topic to create a
   *     subscription to.
   * @param {string} name The name of the subscription.
   * @param {CreateSubscriptionRequest} [options] See a
   *     [Subscription resource](https://cloud.google.com/pubsub/docs/reference/rest/v1/projects.subscriptions).
   * @param {CreateSubscriptionCallback} [callback] Callback function.
   * @returns {Promise<CreateSubscriptionResponse>}
   *
   * @example <caption>Subscribe to a topic.</caption>
   * const PubSub = require('@google-cloud/pubsub');
   * const pubsub = new PubSub();
   *
   * const topic = 'messageCenter';
   * const name = 'newMessages';
   *
   * const callback = function(err, subscription, apiResponse) {};
   *
   * pubsub.createSubscription(topic, name, callback);
   *
   * @example <caption>If the callback is omitted, we'll return a Promise.</caption>
   * pubsub.createSubscription(topic, name).then(function(data) {
   *   const subscription = data[0];
   *   const apiResponse = data[1];
   * });
   */
  createSubscription(topic, name, options, callback) {
    if (!is.string(topic) && !(topic instanceof Topic)) {
      throw new Error('A Topic is required for a new subscription.');
    }
    if (!is.string(name)) {
      throw new Error('A subscription name is required.');
    }
    if (is.string(topic)) {
      topic = this.topic(topic);
    }
    if (is.fn(options)) {
      callback = options;
      options = {};
    }
    options = options || {};
    const metadata = Subscription.formatMetadata_(options);
    const subscription = this.subscription(name, metadata);
    const reqOpts = extend(metadata, {
      topic: topic.name,
      name: subscription.name,
    });
    delete reqOpts.gaxOpts;
    delete reqOpts.flowControl;
    this.request(
      {
        client: 'SubscriberClient',
        method: 'createSubscription',
        reqOpts: reqOpts,
        gaxOpts: options.gaxOpts,
      },
      function(err, resp) {
        if (err) {
          callback(err, null, resp);
          return;
        }
        subscription.metadata = resp;
        callback(null, subscription, resp);
      }
    );
  }
  /**
   * @typedef {array} CreateTopicResponse
   * @property {Topic} 0 The new {@link Topic}.
   * @property {object} 1 The full API response.
   */
  /**
   * @callback CreateTopicCallback
   * @param {?Error} err Request error, if any.
   * @param {Topic} topic The new {@link Topic}.
   * @param {object} apiResponse The full API response.
   */
  /**
   * Create a topic with the given name.
   *
   * @see [Topics: create API Documentation]{@link https://cloud.google.com/pubsub/docs/reference/rest/v1/projects.topics/create}
   *
   * @param {string} name Name of the topic.
   * @param {object} [gaxOpts] Request configuration options, outlined
   *     here: https://googleapis.github.io/gax-nodejs/CallSettings.html.
   * @param {CreateTopicCallback} [callback] Callback function.
   * @returns {Promise<CreateTopicResponse>}
   *
   * @example
   * const PubSub = require('@google-cloud/pubsub');
   * const pubsub = new PubSub();
   *
   * pubsub.createTopic('my-new-topic', function(err, topic, apiResponse) {
   *   if (!err) {
   *     // The topic was created successfully.
   *   }
   * });
   *
   * //-
   * // If the callback is omitted, we'll return a Promise.
   * //-
   * pubsub.createTopic('my-new-topic').then(function(data) {
   *   const topic = data[0];
   *   const apiResponse = data[1];
   * });
   */
  createTopic(name, gaxOpts, callback) {
    const topic = this.topic(name);
    const reqOpts = {
      name: topic.name,
    };
    if (is.fn(gaxOpts)) {
      callback = gaxOpts;
      gaxOpts = {};
    }
    this.request(
      {
        client: 'PublisherClient',
        method: 'createTopic',
        reqOpts: reqOpts,
        gaxOpts: gaxOpts,
      },
      function(err, resp) {
        if (err) {
          callback(err, null, resp);
          return;
        }
        topic.metadata = resp;
        callback(null, topic, resp);
      }
    );
  }
  /**
   * Determine the appropriate endpoint to use for API requests, first trying the
   * local `apiEndpoint` parameter. If the `apiEndpoint` parameter is null we try
   * Pub/Sub emulator environment variable (PUBSUB_EMULATOR_HOST), otherwise the
   * default JSON API.
   *
   * @private
   */
  determineBaseUrl_() {
    const apiEndpoint = this.options.apiEndpoint;
    if (!apiEndpoint && !process.env.PUBSUB_EMULATOR_HOST) {
      return;
    }
    const baseUrl = apiEndpoint || process.env.PUBSUB_EMULATOR_HOST;
    const leadingProtocol = new RegExp('^https*://');
    const trailingSlashes = new RegExp('/*$');
    const baseUrlParts = baseUrl
      .replace(leadingProtocol, '')
      .replace(trailingSlashes, '')
      .split(':');
    this.options.servicePath = baseUrlParts[0];
    this.options.port = baseUrlParts[1];
    this.options.sslCreds = grpc.credentials.createInsecure();
    this.isEmulator = true;
  }
  /**
   * Query object for listing snapshots.
   *
   * @typedef {object} GetSnapshotsRequest
   * @property {boolean} [autoPaginate=true] Have pagination handled
   *     automatically.
   * @property {object} [options.gaxOpts] Request configuration options, outlined
   *     here: https://googleapis.github.io/gax-nodejs/CallSettings.html.
   * @property {number} [options.pageSize] Maximum number of results to return.
   * @property {string} [options.pageToken] Page token.
   */
  /**
   * @typedef {array} GetSnapshotsResponse
   * @property {Snapshot[]} 0 Array of {@link Snapshot} instances.
   * @property {object} 1 The full API response.
   */
  /**
   * @callback GetSnapshotsCallback
   * @param {?Error} err Request error, if any.
   * @param {Snapshot[]} snapshots Array of {@link Snapshot} instances.
   * @param {object} apiResponse The full API response.
   */
  /**
   * Get a list of snapshots.
   *
   * @param {GetSnapshotsRequest} [query] Query object for listing snapshots.
   * @param {GetSnapshotsCallback} [callback] Callback function.
   * @returns {Promise<GetSnapshotsResponse>}
   *
   * @example
   * const PubSub = require('@google-cloud/pubsub');
   * const pubsub = new PubSub();
   *
   * pubsub.getSnapshots(function(err, snapshots) {
   *   if (!err) {
   *     // snapshots is an array of Snapshot objects.
   *   }
   * });
   *
   * //-
   * // If the callback is omitted, we'll return a Promise.
   * //-
   * pubsub.getSnapshots().then(function(data) {
   *   const snapshots = data[0];
   * });
   */
  getSnapshots(options, callback) {
    const self = this;
    if (is.fn(options)) {
      callback = options;
      options = {};
    }
    const reqOpts = extend(
      {
        project: 'projects/' + this.projectId,
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
        client: 'SubscriberClient',
        method: 'listSnapshots',
        reqOpts: reqOpts,
        gaxOpts: gaxOpts,
      },
      function() {
        const snapshots = arguments[1];
        if (snapshots) {
          arguments[1] = snapshots.map(function(snapshot) {
            const snapshotInstance = self.snapshot(snapshot.name);
            snapshotInstance.metadata = snapshot;
            return snapshotInstance;
          });
        }
        callback.apply(null, arguments);
      }
    );
  }
  /**
   * Query object for listing subscriptions.
   *
   * @typedef {object} GetSubscriptionsRequest
   * @property {boolean} [autoPaginate=true] Have pagination handled
   *     automatically.
   * @property {object} [options.gaxOpts] Request configuration options, outlined
   *     here: https://googleapis.github.io/gax-nodejs/CallSettings.html.
   * @property {number} [options.pageSize] Maximum number of results to return.
   * @property {string} [options.pageToken] Page token.
   * @param {string|Topic} options.topic - The name of the topic to
   *     list subscriptions from.
   */
  /**
   * @typedef {array} GetSubscriptionsResponse
   * @property {Subscription[]} 0 Array of {@link Subscription} instances.
   * @property {object} 1 The full API response.
   */
  /**
   * @callback GetSubscriptionsCallback
   * @param {?Error} err Request error, if any.
   * @param {Subscription[]} subscriptions Array of {@link Subscription} instances.
   * @param {object} apiResponse The full API response.
   */
  /**
   * Get a list of the subscriptions registered to all of your project's topics.
   * You may optionally provide a query object as the first argument to customize
   * the response.
   *
   * Your provided callback will be invoked with an error object if an API error
   * occurred or an array of {@link Subscription} objects.
   *
   * To get subscriptions for a topic, see {@link Topic}.
   *
   * @see [Subscriptions: list API Documentation]{@link https://cloud.google.com/pubsub/docs/reference/rest/v1/projects.subscriptions/list}
   *
   * @param {GetSubscriptionsRequest} [query] Query object for listing subscriptions.
   * @param {GetSubscriptionsCallback} [callback] Callback function.
   * @returns {Promise<GetSubscriptionsResponse>}
   *
   * @example
   * const PubSub = require('@google-cloud/pubsub');
   * const pubsub = new PubSub();
   *
   * pubsub.getSubscriptions(function(err, subscriptions) {
   *   if (!err) {
   *     // subscriptions is an array of Subscription objects.
   *   }
   * });
   *
   * //-
   * // If the callback is omitted, we'll return a Promise.
   * //-
   * pubsub.getSubscriptions().then(function(data) {
   *   const subscriptions = data[0];
   * });
   */
  getSubscriptions(options, callback) {
    const self = this;
    if (is.fn(options)) {
      callback = options;
      options = {};
    }
    let topic = options.topic;
    if (topic) {
      if (!(topic instanceof Topic)) {
        topic = this.topic(topic);
      }
      return topic.getSubscriptions(options, callback);
    }
    const reqOpts = extend({}, options);
    reqOpts.project = 'projects/' + this.projectId;
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
        client: 'SubscriberClient',
        method: 'listSubscriptions',
        reqOpts: reqOpts,
        gaxOpts: gaxOpts,
      },
      function() {
        const subscriptions = arguments[1];
        if (subscriptions) {
          arguments[1] = subscriptions.map(function(sub) {
            const subscriptionInstance = self.subscription(sub.name);
            subscriptionInstance.metadata = sub;
            return subscriptionInstance;
          });
        }
        callback.apply(null, arguments);
      }
    );
  }
  /**
   * Query object for listing topics.
   *
   * @typedef {object} GetTopicsRequest
   * @property {boolean} [autoPaginate=true] Have pagination handled
   *     automatically.
   * @property {object} [options.gaxOpts] Request configuration options, outlined
   *     here: https://googleapis.github.io/gax-nodejs/CallSettings.html.
   * @property {number} [options.pageSize] Maximum number of results to return.
   * @property {string} [options.pageToken] Page token.
   */
  /**
   * @typedef {array} GetTopicsResponse
   * @property {Topic[]} 0 Array of {@link Topic} instances.
   * @property {object} 1 The full API response.
   */
  /**
   * @callback GetTopicsCallback
   * @param {?Error} err Request error, if any.
   * @param {Topic[]} topics Array of {@link Topic} instances.
   * @param {object} apiResponse The full API response.
   */
  /**
   * Get a list of the topics registered to your project. You may optionally
   * provide a query object as the first argument to customize the response.
   *
   * @see [Topics: list API Documentation]{@link https://cloud.google.com/pubsub/docs/reference/rest/v1/projects.topics/list}
   *
   * @param {GetTopicsRequest} [query] Query object for listing topics.
   * @param {GetTopicsCallback} [callback] Callback function.
   * @returns {Promise<GetTopicsResponse>}
   *
   * @example
   * const PubSub = require('@google-cloud/pubsub');
   * const pubsub = new PubSub();
   *
   * pubsub.getTopics(function(err, topics) {
   *   if (!err) {
   *     // topics is an array of Topic objects.
   *   }
   * });
   *
   * //-
   * // Customize the query.
   * //-
   * pubsub.getTopics({
   *   pageSize: 3
   * }, function(err, topics) {});
   *
   * //-
   * // If the callback is omitted, we'll return a Promise.
   * //-
   * pubsub.getTopics().then(function(data) {
   *   const topics = data[0];
   * });
   */
  getTopics(options, callback) {
    const self = this;
    if (is.fn(options)) {
      callback = options;
      options = {};
    }
    const reqOpts = extend(
      {
        project: 'projects/' + this.projectId,
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
        method: 'listTopics',
        reqOpts: reqOpts,
        gaxOpts: gaxOpts,
      },
      function() {
        const topics = arguments[1];
        if (topics) {
          arguments[1] = topics.map(function(topic) {
            const topicInstance = self.topic(topic.name);
            topicInstance.metadata = topic;
            return topicInstance;
          });
        }
        callback.apply(null, arguments);
      }
    );
  }
  /**
   * Get the PubSub client object.
   *
   * @private
   *
   * @param {object} config Configuration object.
   * @param {object} config.gaxOpts GAX options.
   * @param {function} config.method The gax method to call.
   * @param {object} config.reqOpts Request options.
   * @param {function} [callback] The callback function.
   */
  getClient_(config, callback) {
    const self = this;
    const hasProjectId =
      this.projectId && this.projectId !== PROJECT_ID_PLACEHOLDER;
    if (!hasProjectId && !this.isEmulator) {
      this.auth.getProjectId(function(err, projectId) {
        if (err) {
          callback(err);
          return;
        }
        self.projectId = projectId;
        self.getClient_(config, callback);
      });
      return;
    }
    let gaxClient = this.api[config.client];
    if (!gaxClient) {
      // Lazily instantiate client.
      gaxClient = new v1[config.client](this.options);
      this.api[config.client] = gaxClient;
    }
    callback(null, gaxClient);
  }
  /**
   * Funnel all API requests through this method, to be sure we have a project ID.
   *
   * @private
   *
   * @param {object} config Configuration object.
   * @param {object} config.gaxOpts GAX options.
   * @param {function} config.method The gax method to call.
   * @param {object} config.reqOpts Request options.
   * @param {function} [callback] The callback function.
   */
  request(config, callback) {
    const self = this;
    this.getClient_(config, function(err, client) {
      if (err) {
        callback(err);
        return;
      }
      let reqOpts = extend(true, {}, config.reqOpts);
      reqOpts = replaceProjectIdToken(reqOpts, self.projectId);
      client[config.method](reqOpts, config.gaxOpts, callback);
    });
  }
  /**
   * Create a Snapshot object. See {@link Subscription#createSnapshot} to
   * create a snapshot.
   *
   * @throws {Error} If a name is not provided.
   *
   * @param {string} name The name of the snapshot.
   * @returns {Snapshot} A {@link Snapshot} instance.
   *
   * @example
   * const PubSub = require('@google-cloud/pubsub');
   * const pubsub = new PubSub();
   *
   * const snapshot = pubsub.snapshot('my-snapshot');
   */
  snapshot(name) {
    if (!is.string(name)) {
      throw new Error('You must supply a valid name for the snapshot.');
    }
    return new Snapshot(this, name);
  }
  /**
   * Create a Subscription object. This command by itself will not run any API
   * requests. You will receive a {@link Subscription} object,
   * which will allow you to interact with a subscription.
   *
   * @throws {Error} If subscription name is omitted.
   *
   * @param {string} name - Name of the subscription.
   * @param {object=} options - Configuration object.
   * @param {object} options.flowControl - Flow control configurations for
   *     receiving messages. Note that these options do not persist across
   *     subscription instances.
   * @param {number} options.flowControl.maxBytes - The maximum number of bytes
   *     in un-acked messages to allow before the subscription pauses incoming
   *     messages. Defaults to 20% of free memory.
   * @param {number} options.flowControl.maxMessages - The maximum number of
   *     un-acked messages to allow before the subscription pauses incoming
   *     messages. Default: Infinity.
   * @param {number} options.maxConnections - Use this to limit the number of
   *     connections to be used when sending and receiving messages. Default: 5.
   * @returns {Subscription} A {@link Subscription} instance.
   *
   * @example
   * const PubSub = require('@google-cloud/pubsub');
   * const pubsub = new PubSub();
   *
   * const subscription = pubsub.subscription('my-subscription');
   *
   * // Register a listener for `message` events.
   * subscription.on('message', function(message) {
   *   // Called every time a message is received.
   *   // message.id = ID of the message.
   *   // message.ackId = ID used to acknowledge the message receival.
   *   // message.data = Contents of the message.
   *   // message.attributes = Attributes of the message.
   *   // message.publishTime = Timestamp when Pub/Sub received the message.
   * });
   */
  subscription(name, options) {
    if (!name) {
      throw new Error('A name must be specified for a subscription.');
    }
    return new Subscription(this, name, options);
  }
  /**
   * Create a Topic object. See {@link PubSub#createTopic} to create a topic.
   *
   * @throws {Error} If a name is not provided.
   *
   * @param {string} name The name of the topic.
   * @returns {Topic} A {@link Topic} instance.
   *
   * @example
   * const PubSub = require('@google-cloud/pubsub');
   * const pubsub = new PubSub();
   *
   * const topic = pubsub.topic('my-topic');
   */
  topic(name, options) {
    if (!name) {
      throw new Error('A name must be specified for a topic.');
    }
    return new Topic(this, name, options);
  }
}

/**
 * Get a list of the {@link Snapshot} objects as a readable object stream.
 *
 * @method PubSub#getSnapshotsStream
 * @param {GetSnapshotsRequest} [options] Configuration object. See
 *     {@link PubSub#getSnapshots} for a complete list of options.
 * @returns {ReadableStream} A readable stream of {@link Snapshot} instances.
 *
 * @example
 * const PubSub = require('@google-cloud/pubsub');
 * const pubsub = new PubSub();
 *
 * pubsub.getSnapshotsStream()
 *   .on('error', console.error)
 *   .on('data', function(snapshot) {
 *     // snapshot is a Snapshot object.
 *   })
 *   .on('end', function() {
 *     // All snapshots retrieved.
 *   });
 *
 * //-
 * // If you anticipate many results, you can end a stream early to prevent
 * // unnecessary processing and API requests.
 * //-
 * pubsub.getSnapshotsStream()
 *   .on('data', function(snapshot) {
 *     this.end();
 *   });
 */
PubSub.prototype.getSnapshotsStream = paginator.streamify('getSnapshots');

/**
 * Get a list of the {@link Subscription} objects registered to all of
 * your project's topics as a readable object stream.
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
 * pubsub.getSubscriptionsStream()
 *   .on('error', console.error)
 *   .on('data', function(subscription) {
 *     // subscription is a Subscription object.
 *   })
 *   .on('end', function() {
 *     // All subscriptions retrieved.
 *   });
 *
 * //-
 * // If you anticipate many results, you can end a stream early to prevent
 * // unnecessary processing and API requests.
 * //-
 * pubsub.getSubscriptionsStream()
 *   .on('data', function(subscription) {
 *     this.end();
 *   });
 */
PubSub.prototype.getSubscriptionsStream = paginator.streamify(
  'getSubscriptions'
);

/**
 * Get a list of the {module:pubsub/topic} objects registered to your project as
 * a readable object stream.
 *
 * @method PubSub#getTopicsStream
 * @param {GetTopicsRequest} [options] Configuration object. See
 *     {@link PubSub#getTopics} for a complete list of options.
 * @returns {ReadableStream} A readable stream of {@link Topic} instances.
 *
 * @example
 * const PubSub = require('@google-cloud/pubsub');
 * const pubsub = new PubSub();
 *
 * pubsub.getTopicsStream()
 *   .on('error', console.error)
 *   .on('data', function(topic) {
 *     // topic is a Topic object.
 *   })
 *   .on('end', function() {
 *     // All topics retrieved.
 *   });
 *
 * //-
 * // If you anticipate many results, you can end a stream early to prevent
 * // unnecessary processing and API requests.
 * //-
 * pubsub.getTopicsStream()
 *   .on('data', function(topic) {
 *     this.end();
 *   });
 */
PubSub.prototype.getTopicsStream = paginator.streamify('getTopics');

/*! Developer Documentation
 *
 * These methods can be agto-paginated.
 */
paginator.extend(PubSub, ['getSnapshots', 'getSubscriptions', 'getTopics']);

/*! Developer Documentation
 *
 * All async methods (except for streams) will return a Promise in the event
 * that a callback is omitted.
 */
promisifyAll(PubSub, {
  exclude: ['request', 'snapshot', 'subscription', 'topic'],
});

/**
 * The default export of the `@google-cloud/pubsub` package is the
 * {@link PubSub} class.
 *
 * See {@link PubSub} and {@link ClientConfig} for client methods and
 * configuration options.
 *
 * @module {PubSub} @google-cloud/pubsub
 * @alias nodejs-pubsub
 *
 * @example <caption>Install the client library with <a href="https://www.npmjs.com/">npm</a>:</caption>
 * npm install --save @google-cloud/pubsub
 *
 * @example <caption>Import the client library</caption>
 * const PubSub = require('@google-cloud/pubsub');
 *
 * @example <caption>Create a client that uses <a href="https://cloud.google.com/docs/authentication/production#providing_credentials_to_your_application">Application Default Credentials (ADC)</a>:</caption>
 * const pubsub = new PubSub();
 *
 * @example <caption>Create a client with <a href="https://cloud.google.com/docs/authentication/production#obtaining_and_providing_service_account_credentials_manually">explicit credentials</a>:</caption>
 * const pubsub = new PubSub({
 *   projectId: 'your-project-id',
 *   keyFilename: '/path/to/keyfile.json'
 * });
 *
 * @example <caption>include:samples/quickstart.js</caption>
 * region_tag:pubsub_quickstart_create_topic
 * Full quickstart example:
 */
module.exports = PubSub;

/**
 * @name PubSub.v1
 * @see v1.PublisherClient
 * @see v1.SubscriberClient
 * @type {object}
 * @property {constructor} PublisherClient
 *     Reference to {@link v1.PublisherClient}.
 * @property {constructor} SubscriberClient
 *     Reference to {@link v1.SubscriberClient}.
 */

/**
 * @name module:@google-cloud/pubsub.v1
 * @see v1.PublisherClient
 * @see v1.SubscriberClient
 * @type {object}
 * @property {constructor} PublisherClient
 *     Reference to {@link v1.PublisherClient}.
 * @property {constructor} SubscriberClient
 *     Reference to {@link v1.SubscriberClient}.
 */
module.exports.v1 = v1;
