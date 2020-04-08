// Copyright 2020 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

const gapicConfig = require('./subscriber_client_config.json');
const gax = require('google-gax');
const path = require('path');

const VERSION = require('../../../package.json').version;

/**
 * The service that an application uses to manipulate subscriptions and to
 * consume messages from a subscription via the `Pull` method or by
 * establishing a bi-directional stream using the `StreamingPull` method.
 *
 * @class
 * @memberof v1
 */
class SubscriberClient {
  /**
   * Construct an instance of SubscriberClient.
   *
   * @param {object} [options] - The configuration object. See the subsequent
   *   parameters for more details.
   * @param {object} [options.credentials] - Credentials object.
   * @param {string} [options.credentials.client_email]
   * @param {string} [options.credentials.private_key]
   * @param {string} [options.email] - Account email address. Required when
   *     using a .pem or .p12 keyFilename.
   * @param {string} [options.keyFilename] - Full path to the a .json, .pem, or
   *     .p12 key downloaded from the Google Developers Console. If you provide
   *     a path to a JSON file, the projectId option below is not necessary.
   *     NOTE: .pem and .p12 require you to specify options.email as well.
   * @param {number} [options.port] - The port on which to connect to
   *     the remote host.
   * @param {string} [options.projectId] - The project ID from the Google
   *     Developer's Console, e.g. 'grape-spaceship-123'. We will also check
   *     the environment variable GCLOUD_PROJECT for your project ID. If your
   *     app is running in an environment which supports
   *     {@link https://developers.google.com/identity/protocols/application-default-credentials Application Default Credentials},
   *     your project ID will be detected automatically.
   * @param {function} [options.promise] - Custom promise module to use instead
   *     of native Promises.
   * @param {string} [options.apiEndpoint] - The domain name of the
   *     API remote host.
   */
  constructor(opts) {
    opts = opts || {};
    this._descriptors = {};

    if (global.isBrowser) {
      // If we're in browser, we use gRPC fallback.
      opts.fallback = true;
    }

    // If we are in browser, we are already using fallback because of the
    // "browser" field in package.json.
    // But if we were explicitly requested to use fallback, let's do it now.
    const gaxModule = !global.isBrowser && opts.fallback ? gax.fallback : gax;

    const servicePath =
      opts.servicePath || opts.apiEndpoint || this.constructor.servicePath;

    // Ensure that options include the service address and port.
    opts = Object.assign(
      {
        clientConfig: {},
        port: this.constructor.port,
        servicePath,
      },
      opts
    );

    // Create a `gaxGrpc` object, with any grpc-specific options
    // sent to the client.
    opts.scopes = this.constructor.scopes;
    const gaxGrpc = new gaxModule.GrpcClient(opts);

    // Save the auth object to the client, for use by other methods.
    this.auth = gaxGrpc.auth;

    // Determine the client header string.
    const clientHeader = [];

    if (typeof process !== 'undefined' && 'versions' in process) {
      clientHeader.push(`gl-node/${process.versions.node}`);
    }
    clientHeader.push(`gax/${gaxModule.version}`);
    if (opts.fallback) {
      clientHeader.push(`gl-web/${gaxModule.version}`);
    } else {
      clientHeader.push(`grpc/${gaxGrpc.grpcVersion}`);
    }
    clientHeader.push(`gapic/${VERSION}`);
    if (opts.libName && opts.libVersion) {
      clientHeader.push(`${opts.libName}/${opts.libVersion}`);
    }

    // Load the applicable protos.
    // For Node.js, pass the path to JSON proto file.
    // For browsers, pass the JSON content.

    const nodejsProtoPath = path.join(
      __dirname,
      '..',
      '..',
      'protos',
      'protos.json'
    );
    const protos = gaxGrpc.loadProto(
      opts.fallback ? require('../../protos/protos.json') : nodejsProtoPath
    );

    // This API contains "path templates"; forward-slash-separated
    // identifiers to uniquely identify resources within the API.
    // Create useful helper objects for these.
    this._pathTemplates = {
      projectPathTemplate: new gaxModule.PathTemplate('projects/{project}'),
      snapshotPathTemplate: new gaxModule.PathTemplate(
        'projects/{project}/snapshots/{snapshot}'
      ),
      subscriptionPathTemplate: new gaxModule.PathTemplate(
        'projects/{project}/subscriptions/{subscription}'
      ),
      topicPathTemplate: new gaxModule.PathTemplate(
        'projects/{project}/topics/{topic}'
      ),
    };

    // Some of the methods on this service return "paged" results,
    // (e.g. 50 results at a time, with tokens to get subsequent
    // pages). Denote the keys used for pagination and results.
    this._descriptors.page = {
      listSubscriptions: new gaxModule.PageDescriptor(
        'pageToken',
        'nextPageToken',
        'subscriptions'
      ),
      listSnapshots: new gaxModule.PageDescriptor(
        'pageToken',
        'nextPageToken',
        'snapshots'
      ),
    };

    // Some of the methods on this service provide streaming responses.
    // Provide descriptors for these.
    this._descriptors.stream = {
      streamingPull: new gaxModule.StreamDescriptor(
        gax.StreamType.BIDI_STREAMING
      ),
    };

    // Put together the default options sent with requests.
    const defaults = gaxGrpc.constructSettings(
      'google.pubsub.v1.Subscriber',
      gapicConfig,
      opts.clientConfig,
      {'x-goog-api-client': clientHeader.join(' ')}
    );

    // Set up a dictionary of "inner API calls"; the core implementation
    // of calling the API is handled in `google-gax`, with this code
    // merely providing the destination and request information.
    this._innerApiCalls = {};

    // Put together the "service stub" for
    // google.iam.v1.IAMPolicy.
    const iamPolicyStub = gaxGrpc.createStub(
      opts.fallback
        ? protos.lookupService('google.iam.v1.IAMPolicy')
        : protos.google.iam.v1.IAMPolicy,
      opts
    );

    // Iterate over each of the methods that the service provides
    // and create an API call method for each.
    const iamPolicyStubMethods = [
      'setIamPolicy',
      'getIamPolicy',
      'testIamPermissions',
    ];
    for (const methodName of iamPolicyStubMethods) {
      const innerCallPromise = iamPolicyStub.then(
        stub => (...args) => {
          return stub[methodName].apply(stub, args);
        },
        err => () => {
          throw err;
        }
      );
      this._innerApiCalls[methodName] = gaxModule.createApiCall(
        innerCallPromise,
        defaults[methodName],
        this._descriptors.page[methodName] ||
          this._descriptors.stream[methodName]
      );
    }

    // Put together the "service stub" for
    // google.pubsub.v1.Subscriber.
    const subscriberStub = gaxGrpc.createStub(
      opts.fallback
        ? protos.lookupService('google.pubsub.v1.Subscriber')
        : protos.google.pubsub.v1.Subscriber,
      opts
    );

    // Iterate over each of the methods that the service provides
    // and create an API call method for each.
    // note: editing generated code
    this.subscriberStub = subscriberStub;
    const subscriberStubMethods = [
      'createSubscription',
      'getSubscription',
      'updateSubscription',
      'listSubscriptions',
      'deleteSubscription',
      'modifyAckDeadline',
      'acknowledge',
      'pull',
      'streamingPull',
      'modifyPushConfig',
      'listSnapshots',
      'createSnapshot',
      'updateSnapshot',
      'deleteSnapshot',
      'seek',
    ];
    for (const methodName of subscriberStubMethods) {
      const innerCallPromise = subscriberStub.then(
        stub => (...args) => {
          return stub[methodName].apply(stub, args);
        },
        err => () => {
          throw err;
        }
      );
      this._innerApiCalls[methodName] = gaxModule.createApiCall(
        innerCallPromise,
        defaults[methodName],
        this._descriptors.page[methodName] ||
          this._descriptors.stream[methodName]
      );
    }

    // note: editing generated code
    this.waitForReady = function(deadline, callback) {
      return subscriberStub.then(
        stub => stub.waitForReady(deadline, callback),
        callback
      );
    };
    this.getSubscriberStub = function() {
      return subscriberStub;
    };
  }

  /**
   * The DNS address for this API service.
   */
  static get servicePath() {
    return 'pubsub.googleapis.com';
  }

  /**
   * The DNS address for this API service - same as servicePath(),
   * exists for compatibility reasons.
   */
  static get apiEndpoint() {
    return 'pubsub.googleapis.com';
  }

  /**
   * The port for this API service.
   */
  static get port() {
    return 443;
  }

  /**
   * The scopes needed to make gRPC calls for every method defined
   * in this service.
   */
  static get scopes() {
    return [
      'https://www.googleapis.com/auth/cloud-platform',
      'https://www.googleapis.com/auth/pubsub',
    ];
  }

  /**
   * Return the project ID used by this class.
   * @param {function(Error, string)} callback - the callback to
   *   be called with the current project Id.
   */
  getProjectId(callback) {
    return this.auth.getProjectId(callback);
  }

  // -------------------
  // -- Service calls --
  // -------------------

  /**
   * Creates a subscription to a given topic. See the
   * <a href="https://cloud.google.com/pubsub/docs/admin#resource_names">
   * resource name rules</a>.
   * If the subscription already exists, returns `ALREADY_EXISTS`.
   * If the corresponding topic doesn't exist, returns `NOT_FOUND`.
   *
   * If the name is not provided in the request, the server will assign a random
   * name for this subscription on the same project as the topic, conforming
   * to the
   * [resource name
   * format](https://cloud.google.com/pubsub/docs/admin#resource_names). The
   * generated name is populated in the returned Subscription object. Note that
   * for REST API requests, you must specify a name in the request.
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {string} request.name
   *   Required. The name of the subscription. It must have the format
   *   `"projects/{project}/subscriptions/{subscription}"`. `{subscription}` must
   *   start with a letter, and contain only letters (`[A-Za-z]`), numbers
   *   (`[0-9]`), dashes (`-`), underscores (`_`), periods (`.`), tildes (`~`),
   *   plus (`+`) or percent signs (`%`). It must be between 3 and 255 characters
   *   in length, and it must not start with `"goog"`.
   * @param {string} request.topic
   *   Required. The name of the topic from which this subscription is receiving
   *   messages. Format is `projects/{project}/topics/{topic}`. The value of this
   *   field will be `_deleted-topic_` if the topic has been deleted.
   * @param {Object} [request.pushConfig]
   *   If push delivery is used with this subscription, this field is
   *   used to configure it. An empty `pushConfig` signifies that the subscriber
   *   will pull and ack messages using API methods.
   *
   *   This object should have the same structure as [PushConfig]{@link google.pubsub.v1.PushConfig}
   * @param {number} [request.ackDeadlineSeconds]
   *   The approximate amount of time (on a best-effort basis) Pub/Sub waits for
   *   the subscriber to acknowledge receipt before resending the message. In the
   *   interval after the message is delivered and before it is acknowledged, it
   *   is considered to be <i>outstanding</i>. During that time period, the
   *   message will not be redelivered (on a best-effort basis).
   *
   *   For pull subscriptions, this value is used as the initial value for the ack
   *   deadline. To override this value for a given message, call
   *   `ModifyAckDeadline` with the corresponding `ack_id` if using
   *   non-streaming pull or send the `ack_id` in a
   *   `StreamingModifyAckDeadlineRequest` if using streaming pull.
   *   The minimum custom deadline you can specify is 10 seconds.
   *   The maximum custom deadline you can specify is 600 seconds (10 minutes).
   *   If this parameter is 0, a default value of 10 seconds is used.
   *
   *   For push delivery, this value is also used to set the request timeout for
   *   the call to the push endpoint.
   *
   *   If the subscriber never acknowledges the message, the Pub/Sub
   *   system will eventually redeliver the message.
   * @param {boolean} [request.retainAckedMessages]
   *   Indicates whether to retain acknowledged messages. If true, then
   *   messages are not expunged from the subscription's backlog, even if they are
   *   acknowledged, until they fall out of the `message_retention_duration`
   *   window. This must be true if you would like to
   *   <a
   *   href="https://cloud.google.com/pubsub/docs/replay-overview#seek_to_a_time">
   *   Seek to a timestamp</a>.
   * @param {Object} [request.messageRetentionDuration]
   *   How long to retain unacknowledged messages in the subscription's backlog,
   *   from the moment a message is published.
   *   If `retain_acked_messages` is true, then this also configures the retention
   *   of acknowledged messages, and thus configures how far back in time a `Seek`
   *   can be done. Defaults to 7 days. Cannot be more than 7 days or less than 10
   *   minutes.
   *
   *   This object should have the same structure as [Duration]{@link google.protobuf.Duration}
   * @param {Object.<string, string>} [request.labels]
   *   See <a href="https://cloud.google.com/pubsub/docs/labels"> Creating and
   *   managing labels</a>.
   * @param {boolean} [request.enableMessageOrdering]
   *   If true, messages published with the same `ordering_key` in `PubsubMessage`
   *   will be delivered to the subscribers in the order in which they
   *   are received by the Pub/Sub system. Otherwise, they may be delivered in
   *   any order.
   *   <b>EXPERIMENTAL:</b> This feature is part of a closed alpha release. This
   *   API might be changed in backward-incompatible ways and is not recommended
   *   for production use. It is not subject to any SLA or deprecation policy.
   * @param {Object} [request.expirationPolicy]
   *   A policy that specifies the conditions for this subscription's expiration.
   *   A subscription is considered active as long as any connected subscriber is
   *   successfully consuming messages from the subscription or is issuing
   *   operations on the subscription. If `expiration_policy` is not set, a
   *   *default policy* with `ttl` of 31 days will be used. The minimum allowed
   *   value for `expiration_policy.ttl` is 1 day.
   *
   *   This object should have the same structure as [ExpirationPolicy]{@link google.pubsub.v1.ExpirationPolicy}
   * @param {Object} [request.deadLetterPolicy]
   *   A policy that specifies the conditions for dead lettering messages in
   *   this subscription. If dead_letter_policy is not set, dead lettering
   *   is disabled.
   *
   *   The Cloud Pub/Sub service account associated with this subscriptions's
   *   parent project (i.e.,
   *   service-{project_number}@gcp-sa-pubsub.iam.gserviceaccount.com) must have
   *   permission to Acknowledge() messages on this subscription.
   *   <b>EXPERIMENTAL:</b> This feature is part of a closed alpha release. This
   *   API might be changed in backward-incompatible ways and is not recommended
   *   for production use. It is not subject to any SLA or deprecation policy.
   *
   *   This object should have the same structure as [DeadLetterPolicy]{@link google.pubsub.v1.DeadLetterPolicy}
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/interfaces/CallOptions.html} for the details.
   * @param {function(?Error, ?Object)} [callback]
   *   The function which will be called with the result of the API call.
   *
   *   The second parameter to the callback is an object representing [Subscription]{@link google.pubsub.v1.Subscription}.
   * @returns {Promise} - The promise which resolves to an array.
   *   The first element of the array is an object representing [Subscription]{@link google.pubsub.v1.Subscription}.
   *   The promise has a method named "cancel" which cancels the ongoing API call.
   *
   * @example
   *
   * const pubsub = require('@google-cloud/pubsub');
   *
   * const client = new pubsub.v1.SubscriberClient({
   *   // optional auth parameters.
   * });
   *
   * const formattedName = client.subscriptionPath('[PROJECT]', '[SUBSCRIPTION]');
   * const formattedTopic = client.topicPath('[PROJECT]', '[TOPIC]');
   * const request = {
   *   name: formattedName,
   *   topic: formattedTopic,
   * };
   * client.createSubscription(request)
   *   .then(responses => {
   *     const response = responses[0];
   *     // doThingsWith(response)
   *   })
   *   .catch(err => {
   *     console.error(err);
   *   });
   */
  createSubscription(request, options, callback) {
    if (options instanceof Function && callback === undefined) {
      callback = options;
      options = {};
    }
    request = request || {};
    options = options || {};
    options.otherArgs = options.otherArgs || {};
    options.otherArgs.headers = options.otherArgs.headers || {};
    options.otherArgs.headers[
      'x-goog-request-params'
    ] = gax.routingHeader.fromParams({
      name: request.name,
    });

    return this._innerApiCalls.createSubscription(request, options, callback);
  }

  /**
   * Gets the configuration details of a subscription.
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {string} request.subscription
   *   Required. The name of the subscription to get.
   *   Format is `projects/{project}/subscriptions/{sub}`.
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/interfaces/CallOptions.html} for the details.
   * @param {function(?Error, ?Object)} [callback]
   *   The function which will be called with the result of the API call.
   *
   *   The second parameter to the callback is an object representing [Subscription]{@link google.pubsub.v1.Subscription}.
   * @returns {Promise} - The promise which resolves to an array.
   *   The first element of the array is an object representing [Subscription]{@link google.pubsub.v1.Subscription}.
   *   The promise has a method named "cancel" which cancels the ongoing API call.
   *
   * @example
   *
   * const pubsub = require('@google-cloud/pubsub');
   *
   * const client = new pubsub.v1.SubscriberClient({
   *   // optional auth parameters.
   * });
   *
   * const formattedSubscription = client.subscriptionPath('[PROJECT]', '[SUBSCRIPTION]');
   * client.getSubscription({subscription: formattedSubscription})
   *   .then(responses => {
   *     const response = responses[0];
   *     // doThingsWith(response)
   *   })
   *   .catch(err => {
   *     console.error(err);
   *   });
   */
  getSubscription(request, options, callback) {
    if (options instanceof Function && callback === undefined) {
      callback = options;
      options = {};
    }
    request = request || {};
    options = options || {};
    options.otherArgs = options.otherArgs || {};
    options.otherArgs.headers = options.otherArgs.headers || {};
    options.otherArgs.headers[
      'x-goog-request-params'
    ] = gax.routingHeader.fromParams({
      subscription: request.subscription,
    });

    return this._innerApiCalls.getSubscription(request, options, callback);
  }

  /**
   * Updates an existing subscription. Note that certain properties of a
   * subscription, such as its topic, are not modifiable.
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {Object} request.subscription
   *   Required. The updated subscription object.
   *
   *   This object should have the same structure as [Subscription]{@link google.pubsub.v1.Subscription}
   * @param {Object} request.updateMask
   *   Required. Indicates which fields in the provided subscription to update.
   *   Must be specified and non-empty.
   *
   *   This object should have the same structure as [FieldMask]{@link google.protobuf.FieldMask}
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/interfaces/CallOptions.html} for the details.
   * @param {function(?Error, ?Object)} [callback]
   *   The function which will be called with the result of the API call.
   *
   *   The second parameter to the callback is an object representing [Subscription]{@link google.pubsub.v1.Subscription}.
   * @returns {Promise} - The promise which resolves to an array.
   *   The first element of the array is an object representing [Subscription]{@link google.pubsub.v1.Subscription}.
   *   The promise has a method named "cancel" which cancels the ongoing API call.
   *
   * @example
   *
   * const pubsub = require('@google-cloud/pubsub');
   *
   * const client = new pubsub.v1.SubscriberClient({
   *   // optional auth parameters.
   * });
   *
   * const ackDeadlineSeconds = 42;
   * const subscription = {
   *   ackDeadlineSeconds: ackDeadlineSeconds,
   * };
   * const pathsElement = 'ack_deadline_seconds';
   * const paths = [pathsElement];
   * const updateMask = {
   *   paths: paths,
   * };
   * const request = {
   *   subscription: subscription,
   *   updateMask: updateMask,
   * };
   * client.updateSubscription(request)
   *   .then(responses => {
   *     const response = responses[0];
   *     // doThingsWith(response)
   *   })
   *   .catch(err => {
   *     console.error(err);
   *   });
   */
  updateSubscription(request, options, callback) {
    if (options instanceof Function && callback === undefined) {
      callback = options;
      options = {};
    }
    request = request || {};
    options = options || {};
    options.otherArgs = options.otherArgs || {};
    options.otherArgs.headers = options.otherArgs.headers || {};
    options.otherArgs.headers[
      'x-goog-request-params'
    ] = gax.routingHeader.fromParams({
      'subscription.name': request.subscription.name,
    });

    return this._innerApiCalls.updateSubscription(request, options, callback);
  }

  /**
   * Lists matching subscriptions.
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {string} request.project
   *   Required. The name of the project in which to list subscriptions.
   *   Format is `projects/{project-id}`.
   * @param {number} [request.pageSize]
   *   The maximum number of resources contained in the underlying API
   *   response. If page streaming is performed per-resource, this
   *   parameter does not affect the return value. If page streaming is
   *   performed per-page, this determines the maximum number of
   *   resources in a page.
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/interfaces/CallOptions.html} for the details.
   * @param {function(?Error, ?Array, ?Object, ?Object)} [callback]
   *   The function which will be called with the result of the API call.
   *
   *   The second parameter to the callback is Array of [Subscription]{@link google.pubsub.v1.Subscription}.
   *
   *   When autoPaginate: false is specified through options, it contains the result
   *   in a single response. If the response indicates the next page exists, the third
   *   parameter is set to be used for the next request object. The fourth parameter keeps
   *   the raw response object of an object representing [ListSubscriptionsResponse]{@link google.pubsub.v1.ListSubscriptionsResponse}.
   * @returns {Promise} - The promise which resolves to an array.
   *   The first element of the array is Array of [Subscription]{@link google.pubsub.v1.Subscription}.
   *
   *   When autoPaginate: false is specified through options, the array has three elements.
   *   The first element is Array of [Subscription]{@link google.pubsub.v1.Subscription} in a single response.
   *   The second element is the next request object if the response
   *   indicates the next page exists, or null. The third element is
   *   an object representing [ListSubscriptionsResponse]{@link google.pubsub.v1.ListSubscriptionsResponse}.
   *
   *   The promise has a method named "cancel" which cancels the ongoing API call.
   *
   * @example
   *
   * const pubsub = require('@google-cloud/pubsub');
   *
   * const client = new pubsub.v1.SubscriberClient({
   *   // optional auth parameters.
   * });
   *
   * // Iterate over all elements.
   * const formattedProject = client.projectPath('[PROJECT]');
   *
   * client.listSubscriptions({project: formattedProject})
   *   .then(responses => {
   *     const resources = responses[0];
   *     for (const resource of resources) {
   *       // doThingsWith(resource)
   *     }
   *   })
   *   .catch(err => {
   *     console.error(err);
   *   });
   *
   * // Or obtain the paged response.
   * const formattedProject = client.projectPath('[PROJECT]');
   *
   *
   * const options = {autoPaginate: false};
   * const callback = responses => {
   *   // The actual resources in a response.
   *   const resources = responses[0];
   *   // The next request if the response shows that there are more responses.
   *   const nextRequest = responses[1];
   *   // The actual response object, if necessary.
   *   // const rawResponse = responses[2];
   *   for (const resource of resources) {
   *     // doThingsWith(resource);
   *   }
   *   if (nextRequest) {
   *     // Fetch the next page.
   *     return client.listSubscriptions(nextRequest, options).then(callback);
   *   }
   * }
   * client.listSubscriptions({project: formattedProject}, options)
   *   .then(callback)
   *   .catch(err => {
   *     console.error(err);
   *   });
   */
  listSubscriptions(request, options, callback) {
    if (options instanceof Function && callback === undefined) {
      callback = options;
      options = {};
    }
    request = request || {};
    options = options || {};
    options.otherArgs = options.otherArgs || {};
    options.otherArgs.headers = options.otherArgs.headers || {};
    options.otherArgs.headers[
      'x-goog-request-params'
    ] = gax.routingHeader.fromParams({
      project: request.project,
    });

    return this._innerApiCalls.listSubscriptions(request, options, callback);
  }

  /**
   * Equivalent to {@link listSubscriptions}, but returns a NodeJS Stream object.
   *
   * This fetches the paged responses for {@link listSubscriptions} continuously
   * and invokes the callback registered for 'data' event for each element in the
   * responses.
   *
   * The returned object has 'end' method when no more elements are required.
   *
   * autoPaginate option will be ignored.
   *
   * @see {@link https://nodejs.org/api/stream.html}
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {string} request.project
   *   Required. The name of the project in which to list subscriptions.
   *   Format is `projects/{project-id}`.
   * @param {number} [request.pageSize]
   *   The maximum number of resources contained in the underlying API
   *   response. If page streaming is performed per-resource, this
   *   parameter does not affect the return value. If page streaming is
   *   performed per-page, this determines the maximum number of
   *   resources in a page.
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/interfaces/CallOptions.html} for the details.
   * @returns {Stream}
   *   An object stream which emits an object representing [Subscription]{@link google.pubsub.v1.Subscription} on 'data' event.
   *
   * @example
   *
   * const pubsub = require('@google-cloud/pubsub');
   *
   * const client = new pubsub.v1.SubscriberClient({
   *   // optional auth parameters.
   * });
   *
   * const formattedProject = client.projectPath('[PROJECT]');
   * client.listSubscriptionsStream({project: formattedProject})
   *   .on('data', element => {
   *     // doThingsWith(element)
   *   }).on('error', err => {
   *     console.log(err);
   *   });
   */
  listSubscriptionsStream(request, options) {
    options = options || {};

    return this._descriptors.page.listSubscriptions.createStream(
      this._innerApiCalls.listSubscriptions,
      request,
      options
    );
  }

  /**
   * Deletes an existing subscription. All messages retained in the subscription
   * are immediately dropped. Calls to `Pull` after deletion will return
   * `NOT_FOUND`. After a subscription is deleted, a new one may be created with
   * the same name, but the new one has no association with the old
   * subscription or its topic unless the same topic is specified.
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {string} request.subscription
   *   Required. The subscription to delete.
   *   Format is `projects/{project}/subscriptions/{sub}`.
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/interfaces/CallOptions.html} for the details.
   * @param {function(?Error)} [callback]
   *   The function which will be called with the result of the API call.
   * @returns {Promise} - The promise which resolves when API call finishes.
   *   The promise has a method named "cancel" which cancels the ongoing API call.
   *
   * @example
   *
   * const pubsub = require('@google-cloud/pubsub');
   *
   * const client = new pubsub.v1.SubscriberClient({
   *   // optional auth parameters.
   * });
   *
   * const formattedSubscription = client.subscriptionPath('[PROJECT]', '[SUBSCRIPTION]');
   * client.deleteSubscription({subscription: formattedSubscription}).catch(err => {
   *   console.error(err);
   * });
   */
  deleteSubscription(request, options, callback) {
    if (options instanceof Function && callback === undefined) {
      callback = options;
      options = {};
    }
    request = request || {};
    options = options || {};
    options.otherArgs = options.otherArgs || {};
    options.otherArgs.headers = options.otherArgs.headers || {};
    options.otherArgs.headers[
      'x-goog-request-params'
    ] = gax.routingHeader.fromParams({
      subscription: request.subscription,
    });

    return this._innerApiCalls.deleteSubscription(request, options, callback);
  }

  /**
   * Modifies the ack deadline for a specific message. This method is useful
   * to indicate that more time is needed to process a message by the
   * subscriber, or to make the message available for redelivery if the
   * processing was interrupted. Note that this does not modify the
   * subscription-level `ackDeadlineSeconds` used for subsequent messages.
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {string} request.subscription
   *   Required. The name of the subscription.
   *   Format is `projects/{project}/subscriptions/{sub}`.
   * @param {string[]} request.ackIds
   *   Required. List of acknowledgment IDs.
   * @param {number} request.ackDeadlineSeconds
   *   Required. The new ack deadline with respect to the time this request was
   *   sent to the Pub/Sub system. For example, if the value is 10, the new ack
   *   deadline will expire 10 seconds after the `ModifyAckDeadline` call was
   *   made. Specifying zero might immediately make the message available for
   *   delivery to another subscriber client. This typically results in an
   *   increase in the rate of message redeliveries (that is, duplicates).
   *   The minimum deadline you can specify is 0 seconds.
   *   The maximum deadline you can specify is 600 seconds (10 minutes).
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/interfaces/CallOptions.html} for the details.
   * @param {function(?Error)} [callback]
   *   The function which will be called with the result of the API call.
   * @returns {Promise} - The promise which resolves when API call finishes.
   *   The promise has a method named "cancel" which cancels the ongoing API call.
   *
   * @example
   *
   * const pubsub = require('@google-cloud/pubsub');
   *
   * const client = new pubsub.v1.SubscriberClient({
   *   // optional auth parameters.
   * });
   *
   * const formattedSubscription = client.subscriptionPath('[PROJECT]', '[SUBSCRIPTION]');
   * const ackIds = [];
   * const ackDeadlineSeconds = 0;
   * const request = {
   *   subscription: formattedSubscription,
   *   ackIds: ackIds,
   *   ackDeadlineSeconds: ackDeadlineSeconds,
   * };
   * client.modifyAckDeadline(request).catch(err => {
   *   console.error(err);
   * });
   */
  modifyAckDeadline(request, options, callback) {
    if (options instanceof Function && callback === undefined) {
      callback = options;
      options = {};
    }
    request = request || {};
    options = options || {};
    options.otherArgs = options.otherArgs || {};
    options.otherArgs.headers = options.otherArgs.headers || {};
    options.otherArgs.headers[
      'x-goog-request-params'
    ] = gax.routingHeader.fromParams({
      subscription: request.subscription,
    });

    return this._innerApiCalls.modifyAckDeadline(request, options, callback);
  }

  /**
   * Acknowledges the messages associated with the `ack_ids` in the
   * `AcknowledgeRequest`. The Pub/Sub system can remove the relevant messages
   * from the subscription.
   *
   * Acknowledging a message whose ack deadline has expired may succeed,
   * but such a message may be redelivered later. Acknowledging a message more
   * than once will not result in an error.
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {string} request.subscription
   *   Required. The subscription whose message is being acknowledged.
   *   Format is `projects/{project}/subscriptions/{sub}`.
   * @param {string[]} request.ackIds
   *   Required. The acknowledgment ID for the messages being acknowledged that
   *   was returned by the Pub/Sub system in the `Pull` response. Must not be
   *   empty.
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/interfaces/CallOptions.html} for the details.
   * @param {function(?Error)} [callback]
   *   The function which will be called with the result of the API call.
   * @returns {Promise} - The promise which resolves when API call finishes.
   *   The promise has a method named "cancel" which cancels the ongoing API call.
   *
   * @example
   *
   * const pubsub = require('@google-cloud/pubsub');
   *
   * const client = new pubsub.v1.SubscriberClient({
   *   // optional auth parameters.
   * });
   *
   * const formattedSubscription = client.subscriptionPath('[PROJECT]', '[SUBSCRIPTION]');
   * const ackIds = [];
   * const request = {
   *   subscription: formattedSubscription,
   *   ackIds: ackIds,
   * };
   * client.acknowledge(request).catch(err => {
   *   console.error(err);
   * });
   */
  acknowledge(request, options, callback) {
    if (options instanceof Function && callback === undefined) {
      callback = options;
      options = {};
    }
    request = request || {};
    options = options || {};
    options.otherArgs = options.otherArgs || {};
    options.otherArgs.headers = options.otherArgs.headers || {};
    options.otherArgs.headers[
      'x-goog-request-params'
    ] = gax.routingHeader.fromParams({
      subscription: request.subscription,
    });

    return this._innerApiCalls.acknowledge(request, options, callback);
  }

  /**
   * Pulls messages from the server. The server may return `UNAVAILABLE` if
   * there are too many concurrent pull requests pending for the given
   * subscription.
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {string} request.subscription
   *   Required. The subscription from which messages should be pulled.
   *   Format is `projects/{project}/subscriptions/{sub}`.
   * @param {number} request.maxMessages
   *   Required. The maximum number of messages to return for this request. Must
   *   be a positive integer. The Pub/Sub system may return fewer than the number
   *   specified.
   * @param {boolean} [request.returnImmediately]
   *   Optional. If this field set to true, the system will respond immediately
   *   even if it there are no messages available to return in the `Pull`
   *   response. Otherwise, the system may wait (for a bounded amount of time)
   *   until at least one message is available, rather than returning no messages.
   *   Warning: setting this field to `true` is discouraged because it adversely
   *   impacts the performance of `Pull` operations. We recommend that users do
   *   not set this field.
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/interfaces/CallOptions.html} for the details.
   * @param {function(?Error, ?Object)} [callback]
   *   The function which will be called with the result of the API call.
   *
   *   The second parameter to the callback is an object representing [PullResponse]{@link google.pubsub.v1.PullResponse}.
   * @returns {Promise} - The promise which resolves to an array.
   *   The first element of the array is an object representing [PullResponse]{@link google.pubsub.v1.PullResponse}.
   *   The promise has a method named "cancel" which cancels the ongoing API call.
   *
   * @example
   *
   * const pubsub = require('@google-cloud/pubsub');
   *
   * const client = new pubsub.v1.SubscriberClient({
   *   // optional auth parameters.
   * });
   *
   * const formattedSubscription = client.subscriptionPath('[PROJECT]', '[SUBSCRIPTION]');
   * const maxMessages = 0;
   * const request = {
   *   subscription: formattedSubscription,
   *   maxMessages: maxMessages,
   * };
   * client.pull(request)
   *   .then(responses => {
   *     const response = responses[0];
   *     // doThingsWith(response)
   *   })
   *   .catch(err => {
   *     console.error(err);
   *   });
   */
  pull(request, options, callback) {
    if (options instanceof Function && callback === undefined) {
      callback = options;
      options = {};
    }
    request = request || {};
    options = options || {};
    options.otherArgs = options.otherArgs || {};
    options.otherArgs.headers = options.otherArgs.headers || {};
    options.otherArgs.headers[
      'x-goog-request-params'
    ] = gax.routingHeader.fromParams({
      subscription: request.subscription,
    });

    return this._innerApiCalls.pull(request, options, callback);
  }

  /**
   * Establishes a stream with the server, which sends messages down to the
   * client. The client streams acknowledgements and ack deadline modifications
   * back to the server. The server will close the stream and return the status
   * on any error. The server may close the stream with status `UNAVAILABLE` to
   * reassign server-side resources, in which case, the client should
   * re-establish the stream. Flow control can be achieved by configuring the
   * underlying RPC channel.
   *
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/interfaces/CallOptions.html} for the details.
   * @returns {Stream}
   *   An object stream which is both readable and writable. It accepts objects
   *   representing [StreamingPullRequest]{@link google.pubsub.v1.StreamingPullRequest} for write() method, and
   *   will emit objects representing [StreamingPullResponse]{@link google.pubsub.v1.StreamingPullResponse} on 'data' event asynchronously.
   *
   * @example
   *
   * const pubsub = require('@google-cloud/pubsub');
   *
   * const client = new pubsub.v1.SubscriberClient({
   *   // optional auth parameters.
   * });
   *
   * const stream = client.streamingPull().on('data', response => {
   *   // doThingsWith(response)
   * });
   * const formattedSubscription = client.subscriptionPath('[PROJECT]', '[SUBSCRIPTION]');
   * const streamAckDeadlineSeconds = 0;
   * const request = {
   *   subscription: formattedSubscription,
   *   streamAckDeadlineSeconds: streamAckDeadlineSeconds,
   * };
   * // Write request objects.
   * stream.write(request);
   */
  streamingPull(options) {
    options = options || {};

    return this._innerApiCalls.streamingPull(options);
  }

  /**
   * Modifies the `PushConfig` for a specified subscription.
   *
   * This may be used to change a push subscription to a pull one (signified by
   * an empty `PushConfig`) or vice versa, or change the endpoint URL and other
   * attributes of a push subscription. Messages will accumulate for delivery
   * continuously through the call regardless of changes to the `PushConfig`.
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {string} request.subscription
   *   Required. The name of the subscription.
   *   Format is `projects/{project}/subscriptions/{sub}`.
   * @param {Object} request.pushConfig
   *   Required. The push configuration for future deliveries.
   *
   *   An empty `pushConfig` indicates that the Pub/Sub system should
   *   stop pushing messages from the given subscription and allow
   *   messages to be pulled and acknowledged - effectively pausing
   *   the subscription if `Pull` or `StreamingPull` is not called.
   *
   *   This object should have the same structure as [PushConfig]{@link google.pubsub.v1.PushConfig}
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/interfaces/CallOptions.html} for the details.
   * @param {function(?Error)} [callback]
   *   The function which will be called with the result of the API call.
   * @returns {Promise} - The promise which resolves when API call finishes.
   *   The promise has a method named "cancel" which cancels the ongoing API call.
   *
   * @example
   *
   * const pubsub = require('@google-cloud/pubsub');
   *
   * const client = new pubsub.v1.SubscriberClient({
   *   // optional auth parameters.
   * });
   *
   * const formattedSubscription = client.subscriptionPath('[PROJECT]', '[SUBSCRIPTION]');
   * const pushConfig = {};
   * const request = {
   *   subscription: formattedSubscription,
   *   pushConfig: pushConfig,
   * };
   * client.modifyPushConfig(request).catch(err => {
   *   console.error(err);
   * });
   */
  modifyPushConfig(request, options, callback) {
    if (options instanceof Function && callback === undefined) {
      callback = options;
      options = {};
    }
    request = request || {};
    options = options || {};
    options.otherArgs = options.otherArgs || {};
    options.otherArgs.headers = options.otherArgs.headers || {};
    options.otherArgs.headers[
      'x-goog-request-params'
    ] = gax.routingHeader.fromParams({
      subscription: request.subscription,
    });

    return this._innerApiCalls.modifyPushConfig(request, options, callback);
  }

  /**
   * Lists the existing snapshots. Snapshots are used in
   * <a href="https://cloud.google.com/pubsub/docs/replay-overview">Seek</a>
   * operations, which allow
   * you to manage message acknowledgments in bulk. That is, you can set the
   * acknowledgment state of messages in an existing subscription to the state
   * captured by a snapshot.
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {string} request.project
   *   Required. The name of the project in which to list snapshots.
   *   Format is `projects/{project-id}`.
   * @param {number} [request.pageSize]
   *   The maximum number of resources contained in the underlying API
   *   response. If page streaming is performed per-resource, this
   *   parameter does not affect the return value. If page streaming is
   *   performed per-page, this determines the maximum number of
   *   resources in a page.
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/interfaces/CallOptions.html} for the details.
   * @param {function(?Error, ?Array, ?Object, ?Object)} [callback]
   *   The function which will be called with the result of the API call.
   *
   *   The second parameter to the callback is Array of [Snapshot]{@link google.pubsub.v1.Snapshot}.
   *
   *   When autoPaginate: false is specified through options, it contains the result
   *   in a single response. If the response indicates the next page exists, the third
   *   parameter is set to be used for the next request object. The fourth parameter keeps
   *   the raw response object of an object representing [ListSnapshotsResponse]{@link google.pubsub.v1.ListSnapshotsResponse}.
   * @returns {Promise} - The promise which resolves to an array.
   *   The first element of the array is Array of [Snapshot]{@link google.pubsub.v1.Snapshot}.
   *
   *   When autoPaginate: false is specified through options, the array has three elements.
   *   The first element is Array of [Snapshot]{@link google.pubsub.v1.Snapshot} in a single response.
   *   The second element is the next request object if the response
   *   indicates the next page exists, or null. The third element is
   *   an object representing [ListSnapshotsResponse]{@link google.pubsub.v1.ListSnapshotsResponse}.
   *
   *   The promise has a method named "cancel" which cancels the ongoing API call.
   *
   * @example
   *
   * const pubsub = require('@google-cloud/pubsub');
   *
   * const client = new pubsub.v1.SubscriberClient({
   *   // optional auth parameters.
   * });
   *
   * // Iterate over all elements.
   * const formattedProject = client.projectPath('[PROJECT]');
   *
   * client.listSnapshots({project: formattedProject})
   *   .then(responses => {
   *     const resources = responses[0];
   *     for (const resource of resources) {
   *       // doThingsWith(resource)
   *     }
   *   })
   *   .catch(err => {
   *     console.error(err);
   *   });
   *
   * // Or obtain the paged response.
   * const formattedProject = client.projectPath('[PROJECT]');
   *
   *
   * const options = {autoPaginate: false};
   * const callback = responses => {
   *   // The actual resources in a response.
   *   const resources = responses[0];
   *   // The next request if the response shows that there are more responses.
   *   const nextRequest = responses[1];
   *   // The actual response object, if necessary.
   *   // const rawResponse = responses[2];
   *   for (const resource of resources) {
   *     // doThingsWith(resource);
   *   }
   *   if (nextRequest) {
   *     // Fetch the next page.
   *     return client.listSnapshots(nextRequest, options).then(callback);
   *   }
   * }
   * client.listSnapshots({project: formattedProject}, options)
   *   .then(callback)
   *   .catch(err => {
   *     console.error(err);
   *   });
   */
  listSnapshots(request, options, callback) {
    if (options instanceof Function && callback === undefined) {
      callback = options;
      options = {};
    }
    request = request || {};
    options = options || {};
    options.otherArgs = options.otherArgs || {};
    options.otherArgs.headers = options.otherArgs.headers || {};
    options.otherArgs.headers[
      'x-goog-request-params'
    ] = gax.routingHeader.fromParams({
      project: request.project,
    });

    return this._innerApiCalls.listSnapshots(request, options, callback);
  }

  /**
   * Equivalent to {@link listSnapshots}, but returns a NodeJS Stream object.
   *
   * This fetches the paged responses for {@link listSnapshots} continuously
   * and invokes the callback registered for 'data' event for each element in the
   * responses.
   *
   * The returned object has 'end' method when no more elements are required.
   *
   * autoPaginate option will be ignored.
   *
   * @see {@link https://nodejs.org/api/stream.html}
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {string} request.project
   *   Required. The name of the project in which to list snapshots.
   *   Format is `projects/{project-id}`.
   * @param {number} [request.pageSize]
   *   The maximum number of resources contained in the underlying API
   *   response. If page streaming is performed per-resource, this
   *   parameter does not affect the return value. If page streaming is
   *   performed per-page, this determines the maximum number of
   *   resources in a page.
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/interfaces/CallOptions.html} for the details.
   * @returns {Stream}
   *   An object stream which emits an object representing [Snapshot]{@link google.pubsub.v1.Snapshot} on 'data' event.
   *
   * @example
   *
   * const pubsub = require('@google-cloud/pubsub');
   *
   * const client = new pubsub.v1.SubscriberClient({
   *   // optional auth parameters.
   * });
   *
   * const formattedProject = client.projectPath('[PROJECT]');
   * client.listSnapshotsStream({project: formattedProject})
   *   .on('data', element => {
   *     // doThingsWith(element)
   *   }).on('error', err => {
   *     console.log(err);
   *   });
   */
  listSnapshotsStream(request, options) {
    options = options || {};

    return this._descriptors.page.listSnapshots.createStream(
      this._innerApiCalls.listSnapshots,
      request,
      options
    );
  }

  /**
   * Creates a snapshot from the requested subscription. Snapshots are used in
   * <a href="https://cloud.google.com/pubsub/docs/replay-overview">Seek</a>
   * operations, which allow
   * you to manage message acknowledgments in bulk. That is, you can set the
   * acknowledgment state of messages in an existing subscription to the state
   * captured by a snapshot.
   * <br><br>If the snapshot already exists, returns `ALREADY_EXISTS`.
   * If the requested subscription doesn't exist, returns `NOT_FOUND`.
   * If the backlog in the subscription is too old -- and the resulting snapshot
   * would expire in less than 1 hour -- then `FAILED_PRECONDITION` is returned.
   * See also the `Snapshot.expire_time` field. If the name is not provided in
   * the request, the server will assign a random
   * name for this snapshot on the same project as the subscription, conforming
   * to the
   * [resource name
   * format](https://cloud.google.com/pubsub/docs/admin#resource_names). The
   * generated name is populated in the returned Snapshot object. Note that for
   * REST API requests, you must specify a name in the request.
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {string} request.name
   *   Required. User-provided name for this snapshot. If the name is not provided
   *   in the request, the server will assign a random name for this snapshot on
   *   the same project as the subscription. Note that for REST API requests, you
   *   must specify a name.  See the <a
   *   href="https://cloud.google.com/pubsub/docs/admin#resource_names"> resource
   *   name rules</a>. Format is `projects/{project}/snapshots/{snap}`.
   * @param {string} request.subscription
   *   Required. The subscription whose backlog the snapshot retains.
   *   Specifically, the created snapshot is guaranteed to retain:
   *    (a) The existing backlog on the subscription. More precisely, this is
   *        defined as the messages in the subscription's backlog that are
   *        unacknowledged upon the successful completion of the
   *        `CreateSnapshot` request; as well as:
   *    (b) Any messages published to the subscription's topic following the
   *        successful completion of the CreateSnapshot request.
   *   Format is `projects/{project}/subscriptions/{sub}`.
   * @param {Object.<string, string>} [request.labels]
   *   See <a href="https://cloud.google.com/pubsub/docs/labels"> Creating and
   *   managing labels</a>.
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/interfaces/CallOptions.html} for the details.
   * @param {function(?Error, ?Object)} [callback]
   *   The function which will be called with the result of the API call.
   *
   *   The second parameter to the callback is an object representing [Snapshot]{@link google.pubsub.v1.Snapshot}.
   * @returns {Promise} - The promise which resolves to an array.
   *   The first element of the array is an object representing [Snapshot]{@link google.pubsub.v1.Snapshot}.
   *   The promise has a method named "cancel" which cancels the ongoing API call.
   *
   * @example
   *
   * const pubsub = require('@google-cloud/pubsub');
   *
   * const client = new pubsub.v1.SubscriberClient({
   *   // optional auth parameters.
   * });
   *
   * const formattedName = client.snapshotPath('[PROJECT]', '[SNAPSHOT]');
   * const formattedSubscription = client.subscriptionPath('[PROJECT]', '[SUBSCRIPTION]');
   * const request = {
   *   name: formattedName,
   *   subscription: formattedSubscription,
   * };
   * client.createSnapshot(request)
   *   .then(responses => {
   *     const response = responses[0];
   *     // doThingsWith(response)
   *   })
   *   .catch(err => {
   *     console.error(err);
   *   });
   */
  createSnapshot(request, options, callback) {
    if (options instanceof Function && callback === undefined) {
      callback = options;
      options = {};
    }
    request = request || {};
    options = options || {};
    options.otherArgs = options.otherArgs || {};
    options.otherArgs.headers = options.otherArgs.headers || {};
    options.otherArgs.headers[
      'x-goog-request-params'
    ] = gax.routingHeader.fromParams({
      name: request.name,
    });

    return this._innerApiCalls.createSnapshot(request, options, callback);
  }

  /**
   * Updates an existing snapshot. Snapshots are used in
   * <a href="https://cloud.google.com/pubsub/docs/replay-overview">Seek</a>
   * operations, which allow
   * you to manage message acknowledgments in bulk. That is, you can set the
   * acknowledgment state of messages in an existing subscription to the state
   * captured by a snapshot.
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {Object} request.snapshot
   *   Required. The updated snapshot object.
   *
   *   This object should have the same structure as [Snapshot]{@link google.pubsub.v1.Snapshot}
   * @param {Object} request.updateMask
   *   Required. Indicates which fields in the provided snapshot to update.
   *   Must be specified and non-empty.
   *
   *   This object should have the same structure as [FieldMask]{@link google.protobuf.FieldMask}
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/interfaces/CallOptions.html} for the details.
   * @param {function(?Error, ?Object)} [callback]
   *   The function which will be called with the result of the API call.
   *
   *   The second parameter to the callback is an object representing [Snapshot]{@link google.pubsub.v1.Snapshot}.
   * @returns {Promise} - The promise which resolves to an array.
   *   The first element of the array is an object representing [Snapshot]{@link google.pubsub.v1.Snapshot}.
   *   The promise has a method named "cancel" which cancels the ongoing API call.
   *
   * @example
   *
   * const pubsub = require('@google-cloud/pubsub');
   *
   * const client = new pubsub.v1.SubscriberClient({
   *   // optional auth parameters.
   * });
   *
   * const seconds = 123456;
   * const expireTime = {
   *   seconds: seconds,
   * };
   * const snapshot = {
   *   expireTime: expireTime,
   * };
   * const pathsElement = 'expire_time';
   * const paths = [pathsElement];
   * const updateMask = {
   *   paths: paths,
   * };
   * const request = {
   *   snapshot: snapshot,
   *   updateMask: updateMask,
   * };
   * client.updateSnapshot(request)
   *   .then(responses => {
   *     const response = responses[0];
   *     // doThingsWith(response)
   *   })
   *   .catch(err => {
   *     console.error(err);
   *   });
   */
  updateSnapshot(request, options, callback) {
    if (options instanceof Function && callback === undefined) {
      callback = options;
      options = {};
    }
    request = request || {};
    options = options || {};
    options.otherArgs = options.otherArgs || {};
    options.otherArgs.headers = options.otherArgs.headers || {};
    options.otherArgs.headers[
      'x-goog-request-params'
    ] = gax.routingHeader.fromParams({
      'snapshot.name': request.snapshot.name,
    });

    return this._innerApiCalls.updateSnapshot(request, options, callback);
  }

  /**
   * Removes an existing snapshot. Snapshots are used in
   * <a href="https://cloud.google.com/pubsub/docs/replay-overview">Seek</a>
   * operations, which allow
   * you to manage message acknowledgments in bulk. That is, you can set the
   * acknowledgment state of messages in an existing subscription to the state
   * captured by a snapshot.<br><br>
   * When the snapshot is deleted, all messages retained in the snapshot
   * are immediately dropped. After a snapshot is deleted, a new one may be
   * created with the same name, but the new one has no association with the old
   * snapshot or its subscription, unless the same subscription is specified.
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {string} request.snapshot
   *   Required. The name of the snapshot to delete.
   *   Format is `projects/{project}/snapshots/{snap}`.
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/interfaces/CallOptions.html} for the details.
   * @param {function(?Error)} [callback]
   *   The function which will be called with the result of the API call.
   * @returns {Promise} - The promise which resolves when API call finishes.
   *   The promise has a method named "cancel" which cancels the ongoing API call.
   *
   * @example
   *
   * const pubsub = require('@google-cloud/pubsub');
   *
   * const client = new pubsub.v1.SubscriberClient({
   *   // optional auth parameters.
   * });
   *
   * const formattedSnapshot = client.snapshotPath('[PROJECT]', '[SNAPSHOT]');
   * client.deleteSnapshot({snapshot: formattedSnapshot}).catch(err => {
   *   console.error(err);
   * });
   */
  deleteSnapshot(request, options, callback) {
    if (options instanceof Function && callback === undefined) {
      callback = options;
      options = {};
    }
    request = request || {};
    options = options || {};
    options.otherArgs = options.otherArgs || {};
    options.otherArgs.headers = options.otherArgs.headers || {};
    options.otherArgs.headers[
      'x-goog-request-params'
    ] = gax.routingHeader.fromParams({
      snapshot: request.snapshot,
    });

    return this._innerApiCalls.deleteSnapshot(request, options, callback);
  }

  /**
   * Seeks an existing subscription to a point in time or to a given snapshot,
   * whichever is provided in the request. Snapshots are used in
   * <a href="https://cloud.google.com/pubsub/docs/replay-overview">Seek</a>
   * operations, which allow
   * you to manage message acknowledgments in bulk. That is, you can set the
   * acknowledgment state of messages in an existing subscription to the state
   * captured by a snapshot. Note that both the subscription and the snapshot
   * must be on the same topic.
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {string} request.subscription
   *   Required. The subscription to affect.
   * @param {Object} [request.time]
   *   The time to seek to.
   *   Messages retained in the subscription that were published before this
   *   time are marked as acknowledged, and messages retained in the
   *   subscription that were published after this time are marked as
   *   unacknowledged. Note that this operation affects only those messages
   *   retained in the subscription (configured by the combination of
   *   `message_retention_duration` and `retain_acked_messages`). For example,
   *   if `time` corresponds to a point before the message retention
   *   window (or to a point before the system's notion of the subscription
   *   creation time), only retained messages will be marked as unacknowledged,
   *   and already-expunged messages will not be restored.
   *
   *   This object should have the same structure as [Timestamp]{@link google.protobuf.Timestamp}
   * @param {string} [request.snapshot]
   *   The snapshot to seek to. The snapshot's topic must be the same as that of
   *   the provided subscription.
   *   Format is `projects/{project}/snapshots/{snap}`.
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/interfaces/CallOptions.html} for the details.
   * @param {function(?Error, ?Object)} [callback]
   *   The function which will be called with the result of the API call.
   *
   *   The second parameter to the callback is an object representing [SeekResponse]{@link google.pubsub.v1.SeekResponse}.
   * @returns {Promise} - The promise which resolves to an array.
   *   The first element of the array is an object representing [SeekResponse]{@link google.pubsub.v1.SeekResponse}.
   *   The promise has a method named "cancel" which cancels the ongoing API call.
   *
   * @example
   *
   * const pubsub = require('@google-cloud/pubsub');
   *
   * const client = new pubsub.v1.SubscriberClient({
   *   // optional auth parameters.
   * });
   *
   * const formattedSubscription = client.subscriptionPath('[PROJECT]', '[SUBSCRIPTION]');
   * client.seek({subscription: formattedSubscription})
   *   .then(responses => {
   *     const response = responses[0];
   *     // doThingsWith(response)
   *   })
   *   .catch(err => {
   *     console.error(err);
   *   });
   */
  seek(request, options, callback) {
    if (options instanceof Function && callback === undefined) {
      callback = options;
      options = {};
    }
    request = request || {};
    options = options || {};
    options.otherArgs = options.otherArgs || {};
    options.otherArgs.headers = options.otherArgs.headers || {};
    options.otherArgs.headers[
      'x-goog-request-params'
    ] = gax.routingHeader.fromParams({
      subscription: request.subscription,
    });

    return this._innerApiCalls.seek(request, options, callback);
  }

  /**
   * Sets the access control policy on the specified resource. Replaces
   * any existing policy.
   *
   * Can return Public Errors: NOT_FOUND, INVALID_ARGUMENT and
   * PERMISSION_DENIED
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {string} request.resource
   *   REQUIRED: The resource for which the policy is being specified.
   *   See the operation documentation for the appropriate value for this field.
   * @param {Object} request.policy
   *   REQUIRED: The complete policy to be applied to the `resource`. The size of
   *   the policy is limited to a few 10s of KB. An empty policy is a
   *   valid policy but certain Cloud Platform services (such as Projects)
   *   might reject them.
   *
   *   This object should have the same structure as [Policy]{@link google.iam.v1.Policy}
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/interfaces/CallOptions.html} for the details.
   * @param {function(?Error, ?Object)} [callback]
   *   The function which will be called with the result of the API call.
   *
   *   The second parameter to the callback is an object representing [Policy]{@link google.iam.v1.Policy}.
   * @returns {Promise} - The promise which resolves to an array.
   *   The first element of the array is an object representing [Policy]{@link google.iam.v1.Policy}.
   *   The promise has a method named "cancel" which cancels the ongoing API call.
   *
   * @example
   *
   * const pubsub = require('@google-cloud/pubsub');
   *
   * const client = new pubsub.v1.SubscriberClient({
   *   // optional auth parameters.
   * });
   *
   * const formattedResource = client.subscriptionPath('[PROJECT]', '[SUBSCRIPTION]');
   * const policy = {};
   * const request = {
   *   resource: formattedResource,
   *   policy: policy,
   * };
   * client.setIamPolicy(request)
   *   .then(responses => {
   *     const response = responses[0];
   *     // doThingsWith(response)
   *   })
   *   .catch(err => {
   *     console.error(err);
   *   });
   */
  setIamPolicy(request, options, callback) {
    if (options instanceof Function && callback === undefined) {
      callback = options;
      options = {};
    }
    request = request || {};
    options = options || {};
    options.otherArgs = options.otherArgs || {};
    options.otherArgs.headers = options.otherArgs.headers || {};
    options.otherArgs.headers[
      'x-goog-request-params'
    ] = gax.routingHeader.fromParams({
      resource: request.resource,
    });

    return this._innerApiCalls.setIamPolicy(request, options, callback);
  }

  /**
   * Gets the access control policy for a resource. Returns an empty policy
   * if the resource exists and does not have a policy set.
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {string} request.resource
   *   REQUIRED: The resource for which the policy is being requested.
   *   See the operation documentation for the appropriate value for this field.
   * @param {Object} [request.options]
   *   OPTIONAL: A `GetPolicyOptions` object for specifying options to
   *   `GetIamPolicy`. This field is only used by Cloud IAM.
   *
   *   This object should have the same structure as [GetPolicyOptions]{@link google.iam.v1.GetPolicyOptions}
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/interfaces/CallOptions.html} for the details.
   * @param {function(?Error, ?Object)} [callback]
   *   The function which will be called with the result of the API call.
   *
   *   The second parameter to the callback is an object representing [Policy]{@link google.iam.v1.Policy}.
   * @returns {Promise} - The promise which resolves to an array.
   *   The first element of the array is an object representing [Policy]{@link google.iam.v1.Policy}.
   *   The promise has a method named "cancel" which cancels the ongoing API call.
   *
   * @example
   *
   * const pubsub = require('@google-cloud/pubsub');
   *
   * const client = new pubsub.v1.SubscriberClient({
   *   // optional auth parameters.
   * });
   *
   * const formattedResource = client.subscriptionPath('[PROJECT]', '[SUBSCRIPTION]');
   * client.getIamPolicy({resource: formattedResource})
   *   .then(responses => {
   *     const response = responses[0];
   *     // doThingsWith(response)
   *   })
   *   .catch(err => {
   *     console.error(err);
   *   });
   */
  getIamPolicy(request, options, callback) {
    if (options instanceof Function && callback === undefined) {
      callback = options;
      options = {};
    }
    request = request || {};
    options = options || {};
    options.otherArgs = options.otherArgs || {};
    options.otherArgs.headers = options.otherArgs.headers || {};
    options.otherArgs.headers[
      'x-goog-request-params'
    ] = gax.routingHeader.fromParams({
      resource: request.resource,
    });

    return this._innerApiCalls.getIamPolicy(request, options, callback);
  }

  /**
   * Returns permissions that a caller has on the specified resource. If the
   * resource does not exist, this will return an empty set of
   * permissions, not a NOT_FOUND error.
   *
   * Note: This operation is designed to be used for building
   * permission-aware UIs and command-line tools, not for authorization
   * checking. This operation may "fail open" without warning.
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {string} request.resource
   *   REQUIRED: The resource for which the policy detail is being requested.
   *   See the operation documentation for the appropriate value for this field.
   * @param {string[]} request.permissions
   *   The set of permissions to check for the `resource`. Permissions with
   *   wildcards (such as '*' or 'storage.*') are not allowed. For more
   *   information see
   *   [IAM Overview](https://cloud.google.com/iam/docs/overview#permissions).
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/interfaces/CallOptions.html} for the details.
   * @param {function(?Error, ?Object)} [callback]
   *   The function which will be called with the result of the API call.
   *
   *   The second parameter to the callback is an object representing [TestIamPermissionsResponse]{@link google.iam.v1.TestIamPermissionsResponse}.
   * @returns {Promise} - The promise which resolves to an array.
   *   The first element of the array is an object representing [TestIamPermissionsResponse]{@link google.iam.v1.TestIamPermissionsResponse}.
   *   The promise has a method named "cancel" which cancels the ongoing API call.
   *
   * @example
   *
   * const pubsub = require('@google-cloud/pubsub');
   *
   * const client = new pubsub.v1.SubscriberClient({
   *   // optional auth parameters.
   * });
   *
   * const formattedResource = client.subscriptionPath('[PROJECT]', '[SUBSCRIPTION]');
   * const permissions = [];
   * const request = {
   *   resource: formattedResource,
   *   permissions: permissions,
   * };
   * client.testIamPermissions(request)
   *   .then(responses => {
   *     const response = responses[0];
   *     // doThingsWith(response)
   *   })
   *   .catch(err => {
   *     console.error(err);
   *   });
   */
  testIamPermissions(request, options, callback) {
    if (options instanceof Function && callback === undefined) {
      callback = options;
      options = {};
    }
    request = request || {};
    options = options || {};
    options.otherArgs = options.otherArgs || {};
    options.otherArgs.headers = options.otherArgs.headers || {};
    options.otherArgs.headers[
      'x-goog-request-params'
    ] = gax.routingHeader.fromParams({
      resource: request.resource,
    });

    return this._innerApiCalls.testIamPermissions(request, options, callback);
  }

  // --------------------
  // -- Path templates --
  // --------------------

  /**
   * Return a fully-qualified project resource name string.
   *
   * @param {String} project
   * @returns {String}
   */
  projectPath(project) {
    return this._pathTemplates.projectPathTemplate.render({
      project: project,
    });
  }

  /**
   * Return a fully-qualified snapshot resource name string.
   *
   * @param {String} project
   * @param {String} snapshot
   * @returns {String}
   */
  snapshotPath(project, snapshot) {
    return this._pathTemplates.snapshotPathTemplate.render({
      project: project,
      snapshot: snapshot,
    });
  }

  /**
   * Return a fully-qualified subscription resource name string.
   *
   * @param {String} project
   * @param {String} subscription
   * @returns {String}
   */
  subscriptionPath(project, subscription) {
    return this._pathTemplates.subscriptionPathTemplate.render({
      project: project,
      subscription: subscription,
    });
  }

  /**
   * Return a fully-qualified topic resource name string.
   *
   * @param {String} project
   * @param {String} topic
   * @returns {String}
   */
  topicPath(project, topic) {
    return this._pathTemplates.topicPathTemplate.render({
      project: project,
      topic: topic,
    });
  }

  /**
   * Terminate the GRPC channel and close the client.
   * note: editing generated code
   *
   * The client will no longer be usable and all future behavior is undefined.
   */
  close() {
    return this.subscriberStub.then(stub => {
      stub.close();
    });
  }

  /**
   * Parse the projectName from a project resource.
   *
   * @param {String} projectName
   *   A fully-qualified path representing a project resources.
   * @returns {String} - A string representing the project.
   */
  matchProjectFromProjectName(projectName) {
    return this._pathTemplates.projectPathTemplate.match(projectName).project;
  }

  /**
   * Parse the snapshotName from a snapshot resource.
   *
   * @param {String} snapshotName
   *   A fully-qualified path representing a snapshot resources.
   * @returns {String} - A string representing the project.
   */
  matchProjectFromSnapshotName(snapshotName) {
    return this._pathTemplates.snapshotPathTemplate.match(snapshotName).project;
  }

  /**
   * Parse the snapshotName from a snapshot resource.
   *
   * @param {String} snapshotName
   *   A fully-qualified path representing a snapshot resources.
   * @returns {String} - A string representing the snapshot.
   */
  matchSnapshotFromSnapshotName(snapshotName) {
    return this._pathTemplates.snapshotPathTemplate.match(snapshotName)
      .snapshot;
  }

  /**
   * Parse the subscriptionName from a subscription resource.
   *
   * @param {String} subscriptionName
   *   A fully-qualified path representing a subscription resources.
   * @returns {String} - A string representing the project.
   */
  matchProjectFromSubscriptionName(subscriptionName) {
    return this._pathTemplates.subscriptionPathTemplate.match(subscriptionName)
      .project;
  }

  /**
   * Parse the subscriptionName from a subscription resource.
   *
   * @param {String} subscriptionName
   *   A fully-qualified path representing a subscription resources.
   * @returns {String} - A string representing the subscription.
   */
  matchSubscriptionFromSubscriptionName(subscriptionName) {
    return this._pathTemplates.subscriptionPathTemplate.match(subscriptionName)
      .subscription;
  }

  /**
   * Parse the topicName from a topic resource.
   *
   * @param {String} topicName
   *   A fully-qualified path representing a topic resources.
   * @returns {String} - A string representing the project.
   */
  matchProjectFromTopicName(topicName) {
    return this._pathTemplates.topicPathTemplate.match(topicName).project;
  }

  /**
   * Parse the topicName from a topic resource.
   *
   * @param {String} topicName
   *   A fully-qualified path representing a topic resources.
   * @returns {String} - A string representing the topic.
   */
  matchTopicFromTopicName(topicName) {
    return this._pathTemplates.topicPathTemplate.match(topicName).topic;
  }
}

module.exports = SubscriberClient;
