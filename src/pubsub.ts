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


import {paginator} from '@google-cloud/paginator';
import {replaceProjectIdToken} from '@google-cloud/projectify';
import {promisifyAll} from '@google-cloud/promisify';
import is from '@sindresorhus/is';
import * as extend from 'extend';
import {GoogleAuth} from 'google-auth-library';
import * as gax from 'google-gax';

const PKG = require('../../package.json');
const v1 = require('./v1');

import {Snapshot} from './snapshot';
import {Subscription, SubscriptionMetadata, SubscriptionOptions, CreateSubscriptionOptions, CreateSubscriptionCallback, CreateSubscriptionResponse} from './subscription';
import {Topic, GetTopicSubscriptionsCallback, GetTopicSubscriptionsResponse, CreateTopicCallback, CreateTopicResponse} from './topic';
import {PublishOptions} from './publisher';
import {CallOptions} from 'google-gax';
import {Transform} from 'stream';
import {google} from '../proto/pubsub';
import {ServiceError, ChannelCredentials} from 'grpc';

const opts = {} as gax.GrpcClientOptions;
const {grpc} = new gax.GrpcClient(opts);

/**
 * Project ID placeholder.
 * @type {string}
 * @private
 */
const PROJECT_ID_PLACEHOLDER = '{{projectId}}';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface ClientConfig extends gax.GrpcClientOptions {
  apiEndpoint?: string;
  servicePath?: string;
  port?: string|number;
  sslCreds?: ChannelCredentials;
}

export interface PageOptions {
  gaxOpts?: CallOptions;
  pageSize?: number;
  pageToken?: string;
  autoPaginate?: boolean;
}

export type GetSnapshotsCallback =
    RequestCallback<Snapshot, google.pubsub.v1.IListSnapshotsResponse>;

export type GetSnapshotsResponse =
    PagedResponse<Snapshot, google.pubsub.v1.IListSnapshotsResponse>;

export type GetSubscriptionsOptions = PageOptions&{topic?: string | Topic};

type GetAllSubscriptionsCallback =
    RequestCallback<Subscription, google.pubsub.v1.IListSubscriptionsResponse>;

type GetAllSubscriptionsResponse =
    PagedResponse<Subscription, google.pubsub.v1.IListSubscriptionsResponse>;

export type GetSubscriptionsCallback =
    GetAllSubscriptionsCallback|GetTopicSubscriptionsCallback;

export type GetSubscriptionsResponse =
    GetAllSubscriptionsResponse|GetTopicSubscriptionsResponse;

export type GetTopicsCallback =
    RequestCallback<Topic, google.pubsub.v1.IListTopicsResponse>;

export type GetTopicsResponse =
    PagedResponse<Topic, google.pubsub.v1.IListTopicsResponse>;

export type EmptyCallback = RequestCallback<google.protobuf.IEmpty>;
export type EmptyResponse = [google.protobuf.IEmpty];

export type ExistsCallback = RequestCallback<boolean>;
export type ExistsResponse = [boolean];

export interface GetClientConfig {
  client: 'PublisherClient'|'SubscriberClient';
}

export interface RequestConfig extends GetClientConfig {
  method: string;
  reqOpts?: object;
  gaxOpts?: CallOptions;
}

export interface ResourceCallback<Resource, Response> {
  (err: ServiceError|null, resource?: Resource|null,
   response?: Response|null): void;
}

export type RequestCallback<T, R = void> =
    R extends void ? NormalCallback<T>: PagedCallback<T, R>;

export interface NormalCallback<TResponse> {
  (err: ServiceError|null, res?: TResponse|null): void;
}

export interface PagedCallback<Item, Response> {
  (err: ServiceError|null, results?: Item[]|null, nextQuery?: {}|null,
   response?: Response|null): void;
}

export type PagedResponse<Item, Response> =
    [Item[]]|[Item[], {} | null, Response];

export type ObjectStream<O> = {
  addListener(event: 'data', listener: (data: O) => void): ObjectStream<O>;
  emit(event: 'data', data: O): boolean;
  on(event: 'data', listener: (data: O) => void): ObjectStream<O>;
  once(event: 'data', listener: (data: O) => void): ObjectStream<O>;
  prependListener(event: 'data', listener: (data: O) => void): ObjectStream<O>;
  prependOnceListener(event: 'data', listener: (data: O) => void):
      ObjectStream<O>;
}&Transform;

interface GetClientCallback {
  (err: Error|null, gaxClient?: gax.ClientStub): void;
}

/**
 * @typedef {object} ClientConfig
 * @property {string} [projectId] The project ID from the Google Developer's
 *     Console, e.g. 'grape-spaceship-123'. We will also check the environment
 *     variable `GCLOUD_PROJECT` for your project ID. If your app is running in
 *     an environment which supports {@link
 * https://cloud.google.com/docs/authentication/production#providing_credentials_to_your_application
 * Application Default Credentials}, your project ID will be detected
 * automatically.
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
 * const {PubSub} = require('@google-cloud/pubsub');
 *
 * @example <caption>Create a client that uses <a
 * href="https://cloud.google.com/docs/authentication/production#providing_credentials_to_your_application">Application
 * Default Credentials (ADC)</a>:</caption> const pubsub = new PubSub();
 *
 * @example <caption>Create a client with <a
 * href="https://cloud.google.com/docs/authentication/production#obtaining_and_providing_service_account_credentials_manually">explicit
 * credentials</a>:</caption> const pubsub = new PubSub({ projectId:
 * 'your-project-id', keyFilename: '/path/to/keyfile.json'
 * });
 *
 * @example <caption>include:samples/quickstart.js</caption>
 * region_tag:pubsub_quickstart_create_topic
 * Full quickstart example:
 */
export class PubSub {
  options: ClientConfig;
  isEmulator: boolean;
  api: {[key: string]: gax.ClientStub};
  auth: GoogleAuth;
  projectId: string;
  // tslint:disable-next-line variable-name
  Promise?: PromiseConstructor;
  getSubscriptionsStream = paginator.streamify('getSubscriptions') as() =>
                               ObjectStream<Subscription>;
  getSnapshotsStream = paginator.streamify('getSnapshots') as() =>
                           ObjectStream<Snapshot>;
  getTopicsStream = paginator.streamify('getTopics') as() =>
                        ObjectStream<Topic>;

  constructor(options?: ClientConfig) {
    options = options || {};
    // Determine what scopes are needed.
    // It is the union of the scopes on both clients.
    const clientClasses = [v1.SubscriberClient, v1.PublisherClient];
    const allScopes: {[key: string]: boolean} = {};
    for (const clientClass of clientClasses) {
      for (const scope of clientClass.scopes) {
        allScopes[scope] = true;
      }
    }
    this.options = Object.assign(
        {
          'grpc.keepalive_time_ms': 300000,
          'grpc.max_send_message_length': -1,
          'grpc.max_receive_message_length': 20000001,
          libName: 'gccl',
          libVersion: PKG.version,
          scopes: Object.keys(allScopes),
        },
        options);
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

  createSubscription(
      topic: Topic|string, name: string,
      options?: CreateSubscriptionOptions): Promise<CreateSubscriptionResponse>;
  createSubscription(
      topic: Topic|string, name: string,
      callback: CreateSubscriptionCallback): void;
  createSubscription(
      topic: Topic|string, name: string, options: CreateSubscriptionOptions,
      callback: CreateSubscriptionCallback): void;
  /**
   * @typedef {array} CreateSubscriptionResponse
   * @property {Subscription} 0 The new {@link Subscription}.
   * @property {object} 1 The full API response.
   */
  /**
   * @callback CreateSubscriptionCallback
   * @param {?Error} err Request error, if any.
   * @param {Subscription} Subscription
   * @param {object} apiResponse The full API response.
   */
  /**
   * Options for creating a subscription.
   *
   * See a [Subscription
   * resource](https://cloud.google.com/pubsub/docs/reference/rest/v1/projects.subscriptions).
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
   * @property {ExpirationPolicy} [expirationPolicy] A policy that specifies
   * the conditions for this subscription's expiration.
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
   *     [Subscription
   * resource](https://cloud.google.com/pubsub/docs/reference/rest/v1/projects.subscriptions).
   * @param {CreateSubscriptionCallback} [callback] Callback function.
   * @returns {Promise<CreateSubscriptionResponse>}
   *
   * @example <caption>Subscribe to a topic.</caption>
   * const {PubSub} = require('@google-cloud/pubsub');
   * const pubsub = new PubSub();
   *
   * const topic = 'messageCenter';
   * const name = 'newMessages';
   *
   * const callback = function(err, subscription, apiResponse) {};
   *
   * pubsub.createSubscription(topic, name, callback);
   *
   * @example <caption>If the callback is omitted, we'll return a
   * Promise.</caption> pubsub.createSubscription(topic,
   * name).then(function(data) { const subscription = data[0]; const apiResponse
   * = data[1];
   * });
   */
  createSubscription(
      topic: Topic|string, name: string,
      optionsOrCallback?: CreateSubscriptionOptions|CreateSubscriptionCallback,
      callback?: CreateSubscriptionCallback):
      Promise<CreateSubscriptionResponse>|void {
    if (!is.string(topic) && !(topic instanceof Topic)) {
      throw new Error('A Topic is required for a new subscription.');
    }
    if (!is.string(name)) {
      throw new Error('A subscription name is required.');
    }
    if (typeof topic === 'string') {
      topic = this.topic(topic);
    }
    let options = typeof optionsOrCallback === 'object' ?
        optionsOrCallback :
        {} as CreateSubscriptionOptions;
    callback =
        typeof optionsOrCallback === 'function' ? optionsOrCallback : callback;

    // Make a deep copy of options to not pollute caller object.
    options = extend(true, {}, options);

    const gaxOpts = options.gaxOpts;
    const flowControl = options.flowControl;
    delete options.gaxOpts;
    delete options.flowControl;

    const metadata =
        Subscription.formatMetadata_(options as SubscriptionMetadata);

    let subscriptionCtorOptions = flowControl ? {flowControl} : {};
    subscriptionCtorOptions = Object.assign(subscriptionCtorOptions, metadata);
    const subscription = this.subscription(name, subscriptionCtorOptions);

    const reqOpts = Object.assign(metadata, {
      topic: topic.name,
      name: subscription.name,
    });

    this.request<google.pubsub.v1.ISubscription>(
        {
          client: 'SubscriberClient',
          method: 'createSubscription',
          reqOpts,
          gaxOpts,
        },
        (err, resp) => {
          if (err) {
            callback!(err, null, resp);
            return;
          }
          subscription.metadata = resp!;
          callback!(null, subscription, resp!);
        });
  }

  createTopic(name: string, gaxOpts?: CallOptions):
      Promise<CreateTopicResponse>;
  createTopic(name: string, callback: CreateTopicCallback): void;
  createTopic(
      name: string, gaxOpts: CallOptions, callback: CreateTopicCallback): void;
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
   * const {PubSub} = require('@google-cloud/pubsub');
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
  createTopic(
      name: string, optsOrCallback?: CallOptions|CreateTopicCallback,
      callback?: CreateTopicCallback): Promise<CreateTopicResponse>|void {
    const topic = this.topic(name);
    const reqOpts = {
      name: topic.name,
    };

    const gaxOpts = typeof optsOrCallback === 'object' ? optsOrCallback : {};
    callback = typeof optsOrCallback === 'function' ? optsOrCallback : callback;

    this.request<google.pubsub.v1.ITopic>(
        {
          client: 'PublisherClient',
          method: 'createTopic',
          reqOpts,
          gaxOpts,
        },
        (err, resp) => {
          if (err) {
            callback!(err, null, resp);
            return;
          }
          topic.metadata = resp!;
          callback!(null, topic, resp!);
        });
  }
  /**
   * Determine the appropriate endpoint to use for API requests, first trying
   * the local `apiEndpoint` parameter. If the `apiEndpoint` parameter is null
   * we try Pub/Sub emulator environment variable (PUBSUB_EMULATOR_HOST),
   * otherwise the default JSON API.
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
    const baseUrlParts = baseUrl!.replace(leadingProtocol, '')
                             .replace(trailingSlashes, '')
                             .split(':');
    this.options.servicePath = baseUrlParts[0];
    this.options.port = baseUrlParts[1];
    this.options.sslCreds = grpc.credentials.createInsecure();
    this.isEmulator = true;
  }

  getSnapshots(options?: PageOptions): Promise<GetSnapshotsResponse>;
  getSnapshots(callback: GetSnapshotsCallback): void;
  getSnapshots(options: PageOptions, callback: GetSnapshotsCallback): void;
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
   * const {PubSub} = require('@google-cloud/pubsub');
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
  getSnapshots(
      optsOrCallback?: PageOptions|GetSnapshotsCallback,
      callback?: GetSnapshotsCallback): void|Promise<GetSnapshotsResponse> {
    const options = typeof optsOrCallback === 'object' ? optsOrCallback : {};
    callback = typeof optsOrCallback === 'function' ? optsOrCallback : callback;

    const reqOpts = Object.assign(
        {
          project: 'projects/' + this.projectId,
        },
        options);

    delete reqOpts.gaxOpts;
    delete reqOpts.autoPaginate;

    const gaxOpts = Object.assign(
        {
          autoPaginate: options.autoPaginate,
        },
        options.gaxOpts);

    this.request<
        google.pubsub.v1.ISnapshot, google.pubsub.v1.IListSnapshotsResponse>(
        {
          client: 'SubscriberClient',
          method: 'listSnapshots',
          reqOpts,
          gaxOpts,
        },
        (err, rawSnapshots, ...args) => {
          let snapshots: Snapshot[];

          if (rawSnapshots) {
            snapshots = rawSnapshots.map(snapshot => {
              const snapshotInstance = this.snapshot(snapshot.name!);
              snapshotInstance.metadata = snapshot;
              return snapshotInstance;
            });
          }

          callback!(err, snapshots!, ...args);
        });
  }

  getSubscriptions(options?: GetSubscriptionsOptions):
      Promise<GetSubscriptionsResponse>;
  getSubscriptions(callback: GetSubscriptionsCallback): void;
  getSubscriptions(
      options: GetSubscriptionsOptions,
      callback: GetSubscriptionsCallback): void;
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
   * You may optionally provide a query object as the first argument to
   * customize the response.
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
   * const {PubSub} = require('@google-cloud/pubsub');
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
  getSubscriptions(
      optsOrCallback?: GetSubscriptionsOptions|GetSubscriptionsCallback,
      callback?: GetSubscriptionsCallback):
      void|Promise<GetSubscriptionsResponse> {
    const options = typeof optsOrCallback === 'object' ? optsOrCallback : {};
    callback = typeof optsOrCallback === 'function' ? optsOrCallback : callback;

    let topic = options.topic;
    if (topic) {
      if (!(topic instanceof Topic)) {
        topic = this.topic(topic);
      }
      return topic.getSubscriptions(
          options, callback as GetTopicSubscriptionsCallback);
    }
    const reqOpts = Object.assign({}, options) as
        google.pubsub.v1.IListSubscriptionsRequest;
    reqOpts.project = 'projects/' + this.projectId;

    delete (reqOpts as GetSubscriptionsOptions).gaxOpts;
    delete (reqOpts as GetSubscriptionsOptions).autoPaginate;

    const gaxOpts = Object.assign(
        {
          autoPaginate: options.autoPaginate,
        },
        options.gaxOpts);

    this.request<
        google.pubsub.v1.ISubscription,
        google.pubsub.v1.IListSubscriptionsResponse>(
        {
          client: 'SubscriberClient',
          method: 'listSubscriptions',
          reqOpts,
          gaxOpts,
        },
        (err, rawSubs, ...args) => {
          let subscriptions: Subscription[];

          if (rawSubs) {
            subscriptions = rawSubs.map(sub => {
              const subscriptionInstance = this.subscription(sub.name!);
              subscriptionInstance.metadata = sub;
              return subscriptionInstance;
            });
          }

          (callback as GetAllSubscriptionsCallback)(
              err, subscriptions!, ...args);
        });
  }

  getTopics(options?: PageOptions): Promise<GetTopicsResponse>;
  getTopics(callback: GetTopicsCallback): void;
  getTopics(options: PageOptions, callback: GetTopicsCallback): void;
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
   * const {PubSub} = require('@google-cloud/pubsub');
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
  getTopics(
      optsOrCallback?: PageOptions|GetTopicsCallback,
      callback?: GetTopicsCallback): void|Promise<GetTopicsResponse> {
    const options = typeof optsOrCallback === 'object' ? optsOrCallback : {};
    callback = typeof optsOrCallback === 'function' ? optsOrCallback : callback;

    const reqOpts = Object.assign(
        {
          project: 'projects/' + this.projectId,
        },
        options);

    delete reqOpts.gaxOpts;
    delete reqOpts.autoPaginate;

    const gaxOpts = Object.assign(
        {
          autoPaginate: options.autoPaginate,
        },
        options.gaxOpts);

    this.request<google.pubsub.v1.Topic, google.pubsub.v1.IListTopicsResponse>(
        {
          client: 'PublisherClient',
          method: 'listTopics',
          reqOpts,
          gaxOpts,
        },
        (err, rawTopics, ...args) => {
          let topics: Topic[];

          if (rawTopics) {
            topics = rawTopics.map(topic => {
              const topicInstance = this.topic(topic.name);
              topicInstance.metadata = topic;
              return topicInstance;
            });
          }

          callback!(err, topics!, ...args);
        });
  }
  /**
   * Callback function to PubSub.getClient_().
   * @private
   * @callback GetClientCallback
   * @param err - Error, if any.
   * @param gaxClient - The gax client specified in RequestConfig.client.
   *                    Typed any since it's importing Javascript source.
   */
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
  getClient_(config: GetClientConfig, callback: GetClientCallback) {
    const hasProjectId =
        this.projectId && this.projectId !== PROJECT_ID_PLACEHOLDER;
    if (!hasProjectId && !this.isEmulator) {
      this.auth.getProjectId((err, projectId) => {
        if (err) {
          callback(err);
          return;
        }
        this.projectId = projectId!;
        this.options.projectId = projectId!;

        this.getClient_(config, callback);
      });
      return;
    }
    let gaxClient = this.api[config.client];
    if (!gaxClient) {
      // Lazily instantiate client.
      gaxClient = new v1[config.client](this.options) as gax.ClientStub;
      this.api[config.client] = gaxClient;
    }
    callback(null, gaxClient);
  }
  /**
   * Funnel all API requests through this method, to be sure we have a project
   * ID.
   *
   * @private
   *
   * @param {object} config Configuration object.
   * @param {object} config.gaxOpts GAX options.
   * @param {function} config.method The gax method to call.
   * @param {object} config.reqOpts Request options.
   * @param {function} [callback] The callback function.
   */
  request<T, R = void>(config: RequestConfig, callback: RequestCallback<T, R>) {
    this.getClient_(config, (err, client) => {
      if (err) {
        callback(err);
        return;
      }
      let reqOpts = extend(true, {}, config.reqOpts);
      reqOpts = replaceProjectIdToken(reqOpts, this.projectId);
      client![config.method](reqOpts, config.gaxOpts, callback);
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
   * const {PubSub} = require('@google-cloud/pubsub');
   * const pubsub = new PubSub();
   *
   * const snapshot = pubsub.snapshot('my-snapshot');
   */
  snapshot(name: string): Snapshot {
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
   * @param {string} name Name of the subscription.
   * @param {SubscriberOptions} [options] Subscription options.
   * @returns {Subscription} A {@link Subscription} instance.
   *
   * @example
   * const {PubSub} = require('@google-cloud/pubsub');
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
   *   // message.publishTime = Date when Pub/Sub received the message.
   * });
   */
  subscription(name: string, options?: SubscriptionOptions): Subscription {
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
   * const {PubSub} = require('@google-cloud/pubsub');
   * const pubsub = new PubSub();
   *
   * const topic = pubsub.topic('my-topic');
   */
  topic(name: string, options?: PublishOptions): Topic {
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
 * const {PubSub} = require('@google-cloud/pubsub');
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
 * const {PubSub} = require('@google-cloud/pubsub');
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
 * const {PubSub} = require('@google-cloud/pubsub');
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
