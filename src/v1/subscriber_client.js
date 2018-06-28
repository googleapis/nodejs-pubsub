// Copyright 2018 Google LLC
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

const gapicConfig = require('./subscriber_client_config');
const gax = require('google-gax');
const merge = require('lodash.merge');
const path = require('path');

const VERSION = require('../../package.json').version;

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
   * @param {string} [options.servicePath] - The domain name of the
   *     API remote host.
   */
  constructor(opts) {
    this._descriptors = {};

    // Ensure that options include the service address and port.
    opts = Object.assign(
      {
        clientConfig: {},
        port: this.constructor.port,
        servicePath: this.constructor.servicePath,
      },
      opts
    );

    // Create a `gaxGrpc` object, with any grpc-specific options
    // sent to the client.
    opts.scopes = this.constructor.scopes;
    var gaxGrpc = new gax.GrpcClient(opts);

    // Save the auth object to the client, for use by other methods.
    this.auth = gaxGrpc.auth;

    // Determine the client header string.
    var clientHeader = [
      `gl-node/${process.version}`,
      `grpc/${gaxGrpc.grpcVersion}`,
      `gax/${gax.version}`,
      `gapic/${VERSION}`,
    ];
    if (opts.libName && opts.libVersion) {
      clientHeader.push(`${opts.libName}/${opts.libVersion}`);
    }

    // Load the applicable protos.
    var protos = merge(
      {},
      gaxGrpc.loadProto(
        path.join(__dirname, '..', '..', 'protos'),
        'google/iam/v1/iam_policy.proto'
      ),
      gaxGrpc.loadProto(
        path.join(__dirname, '..', '..', 'protos'),
        'google/pubsub/v1/pubsub.proto'
      )
    );

    // This API contains "path templates"; forward-slash-separated
    // identifiers to uniquely identify resources within the API.
    // Create useful helper objects for these.
    this._pathTemplates = {
      subscriptionPathTemplate: new gax.PathTemplate(
        'projects/{project}/subscriptions/{subscription}'
      ),
      topicPathTemplate: new gax.PathTemplate(
        'projects/{project}/topics/{topic}'
      ),
      projectPathTemplate: new gax.PathTemplate('projects/{project}'),
      snapshotPathTemplate: new gax.PathTemplate(
        'projects/{project}/snapshots/{snapshot}'
      ),
    };

    // Some of the methods on this service return "paged" results,
    // (e.g. 50 results at a time, with tokens to get subsequent
    // pages). Denote the keys used for pagination and results.
    this._descriptors.page = {
      listSubscriptions: new gax.PageDescriptor(
        'pageToken',
        'nextPageToken',
        'subscriptions'
      ),
      listSnapshots: new gax.PageDescriptor(
        'pageToken',
        'nextPageToken',
        'snapshots'
      ),
    };

    // Some of the methods on this service provide streaming responses.
    // Provide descriptors for these.
    this._descriptors.stream = {
      streamingPull: new gax.StreamDescriptor(gax.StreamType.BIDI_STREAMING),
    };

    // Put together the default options sent with requests.
    var defaults = gaxGrpc.constructSettings(
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
    var iamPolicyStub = gaxGrpc.createStub(
      protos.google.iam.v1.IAMPolicy,
      opts
    );

    // Iterate over each of the methods that the service provides
    // and create an API call method for each.
    var iamPolicyStubMethods = [
      'setIamPolicy',
      'getIamPolicy',
      'testIamPermissions',
    ];
    for (let methodName of iamPolicyStubMethods) {
      this._innerApiCalls[methodName] = gax.createApiCall(
        iamPolicyStub.then(
          stub =>
            function() {
              var args = Array.prototype.slice.call(arguments, 0);
              return stub[methodName].apply(stub, args);
            }
        ),
        defaults[methodName],
        this._descriptors.page[methodName] ||
          this._descriptors.stream[methodName]
      );
    }

    // Put together the "service stub" for
    // google.pubsub.v1.Subscriber.
    var subscriberStub = gaxGrpc.createStub(
      protos.google.pubsub.v1.Subscriber,
      opts
    );

    // Iterate over each of the methods that the service provides
    // and create an API call method for each.
    var subscriberStubMethods = [
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
    for (let methodName of subscriberStubMethods) {
      this._innerApiCalls[methodName] = gax.createApiCall(
        subscriberStub.then(
          stub =>
            function() {
              var args = Array.prototype.slice.call(arguments, 0);
              return stub[methodName].apply(stub, args);
            }
        ),
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
  }

  /**
   * The DNS address for this API service.
   */
  static get servicePath() {
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
   * <a href="/pubsub/docs/admin#resource_names"> resource name rules</a>.
   * If the subscription already exists, returns `ALREADY_EXISTS`.
   * If the corresponding topic doesn't exist, returns `NOT_FOUND`.
   *
   * If the name is not provided in the request, the server will assign a random
   * name for this subscription on the same project as the topic, conforming
   * to the
   * [resource name format](https://cloud.google.com/pubsub/docs/overview#names).
   * The generated name is populated in the returned Subscription object.
   * Note that for REST API requests, you must specify a name in the request.
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {string} request.name
   *   The name of the subscription. It must have the format
   *   `"projects/{project}/subscriptions/{subscription}"`. `{subscription}` must
   *   start with a letter, and contain only letters (`[A-Za-z]`), numbers
   *   (`[0-9]`), dashes (`-`), underscores (`_`), periods (`.`), tildes (`~`),
   *   plus (`+`) or percent signs (`%`). It must be between 3 and 255 characters
   *   in length, and it must not start with `"goog"`
   * @param {string} request.topic
   *   The name of the topic from which this subscription is receiving messages.
   *   Format is `projects/{project}/topics/{topic}`.
   *   The value of this field will be `_deleted-topic_` if the topic has been
   *   deleted.
   * @param {Object} [request.pushConfig]
   *   If push delivery is used with this subscription, this field is
   *   used to configure it. An empty `pushConfig` signifies that the subscriber
   *   will pull and ack messages using API methods.
   *
   *   This object should have the same structure as [PushConfig]{@link google.pubsub.v1.PushConfig}
   * @param {number} [request.ackDeadlineSeconds]
   *   This value is the maximum time after a subscriber receives a message
   *   before the subscriber should acknowledge the message. After message
   *   delivery but before the ack deadline expires and before the message is
   *   acknowledged, it is an outstanding message and will not be delivered
   *   again during that time (on a best-effort basis).
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
   *   window.<br><br>
   *   <b>ALPHA:</b> This feature is part of an alpha release. This API might be
   *   changed in backward-incompatible ways and is not recommended for production
   *   use. It is not subject to any SLA or deprecation policy.
   * @param {Object} [request.messageRetentionDuration]
   *   How long to retain unacknowledged messages in the subscription's backlog,
   *   from the moment a message is published.
   *   If `retain_acked_messages` is true, then this also configures the retention
   *   of acknowledged messages, and thus configures how far back in time a `Seek`
   *   can be done. Defaults to 7 days. Cannot be more than 7 days or less than 10
   *   minutes.<br><br>
   *   <b>ALPHA:</b> This feature is part of an alpha release. This API might be
   *   changed in backward-incompatible ways and is not recommended for production
   *   use. It is not subject to any SLA or deprecation policy.
   *
   *   This object should have the same structure as [Duration]{@link google.protobuf.Duration}
   * @param {Object.<string, string>} [request.labels]
   *   User labels.
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions} for the details.
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
   * var client = new pubsub.v1.SubscriberClient({
   *   // optional auth parameters.
   * });
   *
   * var formattedName = client.subscriptionPath('[PROJECT]', '[SUBSCRIPTION]');
   * var formattedTopic = client.topicPath('[PROJECT]', '[TOPIC]');
   * var request = {
   *   name: formattedName,
   *   topic: formattedTopic,
   * };
   * client.createSubscription(request)
   *   .then(responses => {
   *     var response = responses[0];
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
    options = options || {};

    return this._innerApiCalls.createSubscription(request, options, callback);
  }

  /**
   * Gets the configuration details of a subscription.
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {string} request.subscription
   *   The name of the subscription to get.
   *   Format is `projects/{project}/subscriptions/{sub}`.
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions} for the details.
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
   * var client = new pubsub.v1.SubscriberClient({
   *   // optional auth parameters.
   * });
   *
   * var formattedSubscription = client.subscriptionPath('[PROJECT]', '[SUBSCRIPTION]');
   * client.getSubscription({subscription: formattedSubscription})
   *   .then(responses => {
   *     var response = responses[0];
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
    options = options || {};

    return this._innerApiCalls.getSubscription(request, options, callback);
  }

  /**
   * Updates an existing subscription. Note that certain properties of a
   * subscription, such as its topic, are not modifiable.
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {Object} request.subscription
   *   The updated subscription object.
   *
   *   This object should have the same structure as [Subscription]{@link google.pubsub.v1.Subscription}
   * @param {Object} request.updateMask
   *   Indicates which fields in the provided subscription to update.
   *   Must be specified and non-empty.
   *
   *   This object should have the same structure as [FieldMask]{@link google.protobuf.FieldMask}
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions} for the details.
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
   * var client = new pubsub.v1.SubscriberClient({
   *   // optional auth parameters.
   * });
   *
   * var ackDeadlineSeconds = 42;
   * var subscription = {
   *   ackDeadlineSeconds: ackDeadlineSeconds,
   * };
   * var pathsElement = 'ack_deadline_seconds';
   * var paths = [pathsElement];
   * var updateMask = {
   *   paths: paths,
   * };
   * var request = {
   *   subscription: subscription,
   *   updateMask: updateMask,
   * };
   * client.updateSubscription(request)
   *   .then(responses => {
   *     var response = responses[0];
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
    options = options || {};

    return this._innerApiCalls.updateSubscription(request, options, callback);
  }

  /**
   * Lists matching subscriptions.
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {string} request.project
   *   The name of the cloud project that subscriptions belong to.
   *   Format is `projects/{project}`.
   * @param {number} [request.pageSize]
   *   The maximum number of resources contained in the underlying API
   *   response. If page streaming is performed per-resource, this
   *   parameter does not affect the return value. If page streaming is
   *   performed per-page, this determines the maximum number of
   *   resources in a page.
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions} for the details.
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
   * var client = new pubsub.v1.SubscriberClient({
   *   // optional auth parameters.
   * });
   *
   * // Iterate over all elements.
   * var formattedProject = client.projectPath('[PROJECT]');
   *
   * client.listSubscriptions({project: formattedProject})
   *   .then(responses => {
   *     var resources = responses[0];
   *     for (let i = 0; i < resources.length; i += 1) {
   *       // doThingsWith(resources[i])
   *     }
   *   })
   *   .catch(err => {
   *     console.error(err);
   *   });
   *
   * // Or obtain the paged response.
   * var formattedProject = client.projectPath('[PROJECT]');
   *
   *
   * var options = {autoPaginate: false};
   * var callback = responses => {
   *   // The actual resources in a response.
   *   var resources = responses[0];
   *   // The next request if the response shows that there are more responses.
   *   var nextRequest = responses[1];
   *   // The actual response object, if necessary.
   *   // var rawResponse = responses[2];
   *   for (let i = 0; i < resources.length; i += 1) {
   *     // doThingsWith(resources[i]);
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
    options = options || {};

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
   *   The name of the cloud project that subscriptions belong to.
   *   Format is `projects/{project}`.
   * @param {number} [request.pageSize]
   *   The maximum number of resources contained in the underlying API
   *   response. If page streaming is performed per-resource, this
   *   parameter does not affect the return value. If page streaming is
   *   performed per-page, this determines the maximum number of
   *   resources in a page.
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions} for the details.
   * @returns {Stream}
   *   An object stream which emits an object representing [Subscription]{@link google.pubsub.v1.Subscription} on 'data' event.
   *
   * @example
   *
   * const pubsub = require('@google-cloud/pubsub');
   *
   * var client = new pubsub.v1.SubscriberClient({
   *   // optional auth parameters.
   * });
   *
   * var formattedProject = client.projectPath('[PROJECT]');
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
   *   The subscription to delete.
   *   Format is `projects/{project}/subscriptions/{sub}`.
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions} for the details.
   * @param {function(?Error)} [callback]
   *   The function which will be called with the result of the API call.
   * @returns {Promise} - The promise which resolves when API call finishes.
   *   The promise has a method named "cancel" which cancels the ongoing API call.
   *
   * @example
   *
   * const pubsub = require('@google-cloud/pubsub');
   *
   * var client = new pubsub.v1.SubscriberClient({
   *   // optional auth parameters.
   * });
   *
   * var formattedSubscription = client.subscriptionPath('[PROJECT]', '[SUBSCRIPTION]');
   * client.deleteSubscription({subscription: formattedSubscription}).catch(err => {
   *   console.error(err);
   * });
   */
  deleteSubscription(request, options, callback) {
    if (options instanceof Function && callback === undefined) {
      callback = options;
      options = {};
    }
    options = options || {};

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
   *   The name of the subscription.
   *   Format is `projects/{project}/subscriptions/{sub}`.
   * @param {string[]} request.ackIds
   *   List of acknowledgment IDs.
   * @param {number} request.ackDeadlineSeconds
   *   The new ack deadline with respect to the time this request was sent to
   *   the Pub/Sub system. For example, if the value is 10, the new
   *   ack deadline will expire 10 seconds after the `ModifyAckDeadline` call
   *   was made. Specifying zero may immediately make the message available for
   *   another pull request.
   *   The minimum deadline you can specify is 0 seconds.
   *   The maximum deadline you can specify is 600 seconds (10 minutes).
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions} for the details.
   * @param {function(?Error)} [callback]
   *   The function which will be called with the result of the API call.
   * @returns {Promise} - The promise which resolves when API call finishes.
   *   The promise has a method named "cancel" which cancels the ongoing API call.
   *
   * @example
   *
   * const pubsub = require('@google-cloud/pubsub');
   *
   * var client = new pubsub.v1.SubscriberClient({
   *   // optional auth parameters.
   * });
   *
   * var formattedSubscription = client.subscriptionPath('[PROJECT]', '[SUBSCRIPTION]');
   * var ackIds = [];
   * var ackDeadlineSeconds = 0;
   * var request = {
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
    options = options || {};

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
   *   The subscription whose message is being acknowledged.
   *   Format is `projects/{project}/subscriptions/{sub}`.
   * @param {string[]} request.ackIds
   *   The acknowledgment ID for the messages being acknowledged that was returned
   *   by the Pub/Sub system in the `Pull` response. Must not be empty.
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions} for the details.
   * @param {function(?Error)} [callback]
   *   The function which will be called with the result of the API call.
   * @returns {Promise} - The promise which resolves when API call finishes.
   *   The promise has a method named "cancel" which cancels the ongoing API call.
   *
   * @example
   *
   * const pubsub = require('@google-cloud/pubsub');
   *
   * var client = new pubsub.v1.SubscriberClient({
   *   // optional auth parameters.
   * });
   *
   * var formattedSubscription = client.subscriptionPath('[PROJECT]', '[SUBSCRIPTION]');
   * var ackIds = [];
   * var request = {
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
    options = options || {};

    return this._innerApiCalls.acknowledge(request, options, callback);
  }

  /**
   * Pulls messages from the server. Returns an empty list if there are no
   * messages available in the backlog. The server may return `UNAVAILABLE` if
   * there are too many concurrent pull requests pending for the given
   * subscription.
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {string} request.subscription
   *   The subscription from which messages should be pulled.
   *   Format is `projects/{project}/subscriptions/{sub}`.
   * @param {number} request.maxMessages
   *   The maximum number of messages returned for this request. The Pub/Sub
   *   system may return fewer than the number specified.
   * @param {boolean} [request.returnImmediately]
   *   If this field set to true, the system will respond immediately even if
   *   it there are no messages available to return in the `Pull` response.
   *   Otherwise, the system may wait (for a bounded amount of time) until at
   *   least one message is available, rather than returning no messages. The
   *   client may cancel the request if it does not wish to wait any longer for
   *   the response.
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions} for the details.
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
   * var client = new pubsub.v1.SubscriberClient({
   *   // optional auth parameters.
   * });
   *
   * var formattedSubscription = client.subscriptionPath('[PROJECT]', '[SUBSCRIPTION]');
   * var maxMessages = 0;
   * var request = {
   *   subscription: formattedSubscription,
   *   maxMessages: maxMessages,
   * };
   * client.pull(request)
   *   .then(responses => {
   *     var response = responses[0];
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
    options = options || {};

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
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions} for the details.
   * @returns {Stream}
   *   An object stream which is both readable and writable. It accepts objects
   *   representing [StreamingPullRequest]{@link google.pubsub.v1.StreamingPullRequest} for write() method, and
   *   will emit objects representing [StreamingPullResponse]{@link google.pubsub.v1.StreamingPullResponse} on 'data' event asynchronously.
   *
   * @example
   *
   * const pubsub = require('@google-cloud/pubsub');
   *
   * var client = new pubsub.v1.SubscriberClient({
   *   // optional auth parameters.
   * });
   *
   * var stream = client.streamingPull().on('data', response => {
   *   // doThingsWith(response)
   * });
   * var formattedSubscription = client.subscriptionPath('[PROJECT]', '[SUBSCRIPTION]');
   * var streamAckDeadlineSeconds = 0;
   * var request = {
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
   *   The name of the subscription.
   *   Format is `projects/{project}/subscriptions/{sub}`.
   * @param {Object} request.pushConfig
   *   The push configuration for future deliveries.
   *
   *   An empty `pushConfig` indicates that the Pub/Sub system should
   *   stop pushing messages from the given subscription and allow
   *   messages to be pulled and acknowledged - effectively pausing
   *   the subscription if `Pull` or `StreamingPull` is not called.
   *
   *   This object should have the same structure as [PushConfig]{@link google.pubsub.v1.PushConfig}
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions} for the details.
   * @param {function(?Error)} [callback]
   *   The function which will be called with the result of the API call.
   * @returns {Promise} - The promise which resolves when API call finishes.
   *   The promise has a method named "cancel" which cancels the ongoing API call.
   *
   * @example
   *
   * const pubsub = require('@google-cloud/pubsub');
   *
   * var client = new pubsub.v1.SubscriberClient({
   *   // optional auth parameters.
   * });
   *
   * var formattedSubscription = client.subscriptionPath('[PROJECT]', '[SUBSCRIPTION]');
   * var pushConfig = {};
   * var request = {
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
    options = options || {};

    return this._innerApiCalls.modifyPushConfig(request, options, callback);
  }

  /**
   * Lists the existing snapshots.<br><br>
   * <b>ALPHA:</b> This feature is part of an alpha release. This API might be
   * changed in backward-incompatible ways and is not recommended for production
   * use. It is not subject to any SLA or deprecation policy.
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {string} request.project
   *   The name of the cloud project that snapshots belong to.
   *   Format is `projects/{project}`.
   * @param {number} [request.pageSize]
   *   The maximum number of resources contained in the underlying API
   *   response. If page streaming is performed per-resource, this
   *   parameter does not affect the return value. If page streaming is
   *   performed per-page, this determines the maximum number of
   *   resources in a page.
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions} for the details.
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
   * var client = new pubsub.v1.SubscriberClient({
   *   // optional auth parameters.
   * });
   *
   * // Iterate over all elements.
   * var formattedProject = client.projectPath('[PROJECT]');
   *
   * client.listSnapshots({project: formattedProject})
   *   .then(responses => {
   *     var resources = responses[0];
   *     for (let i = 0; i < resources.length; i += 1) {
   *       // doThingsWith(resources[i])
   *     }
   *   })
   *   .catch(err => {
   *     console.error(err);
   *   });
   *
   * // Or obtain the paged response.
   * var formattedProject = client.projectPath('[PROJECT]');
   *
   *
   * var options = {autoPaginate: false};
   * var callback = responses => {
   *   // The actual resources in a response.
   *   var resources = responses[0];
   *   // The next request if the response shows that there are more responses.
   *   var nextRequest = responses[1];
   *   // The actual response object, if necessary.
   *   // var rawResponse = responses[2];
   *   for (let i = 0; i < resources.length; i += 1) {
   *     // doThingsWith(resources[i]);
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
    options = options || {};

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
   *   The name of the cloud project that snapshots belong to.
   *   Format is `projects/{project}`.
   * @param {number} [request.pageSize]
   *   The maximum number of resources contained in the underlying API
   *   response. If page streaming is performed per-resource, this
   *   parameter does not affect the return value. If page streaming is
   *   performed per-page, this determines the maximum number of
   *   resources in a page.
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions} for the details.
   * @returns {Stream}
   *   An object stream which emits an object representing [Snapshot]{@link google.pubsub.v1.Snapshot} on 'data' event.
   *
   * @example
   *
   * const pubsub = require('@google-cloud/pubsub');
   *
   * var client = new pubsub.v1.SubscriberClient({
   *   // optional auth parameters.
   * });
   *
   * var formattedProject = client.projectPath('[PROJECT]');
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
   * Creates a snapshot from the requested subscription.<br><br>
   * <b>ALPHA:</b> This feature is part of an alpha release. This API might be
   * changed in backward-incompatible ways and is not recommended for production
   * use. It is not subject to any SLA or deprecation policy.
   * If the snapshot already exists, returns `ALREADY_EXISTS`.
   * If the requested subscription doesn't exist, returns `NOT_FOUND`.
   * If the backlog in the subscription is too old -- and the resulting snapshot
   * would expire in less than 1 hour -- then `FAILED_PRECONDITION` is returned.
   * See also the `Snapshot.expire_time` field. If the name is not provided in
   * the request, the server will assign a random
   * name for this snapshot on the same project as the subscription, conforming
   * to the [resource name format](https://cloud.google.com/pubsub/docs/overview#names).
   * The generated
   * name is populated in the returned Snapshot object. Note that for REST API
   * requests, you must specify a name in the request.
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {string} request.name
   *   Optional user-provided name for this snapshot.
   *   If the name is not provided in the request, the server will assign a random
   *   name for this snapshot on the same project as the subscription.
   *   Note that for REST API requests, you must specify a name.
   *   Format is `projects/{project}/snapshots/{snap}`.
   * @param {string} request.subscription
   *   The subscription whose backlog the snapshot retains.
   *   Specifically, the created snapshot is guaranteed to retain:
   *    (a) The existing backlog on the subscription. More precisely, this is
   *        defined as the messages in the subscription's backlog that are
   *        unacknowledged upon the successful completion of the
   *        `CreateSnapshot` request; as well as:
   *    (b) Any messages published to the subscription's topic following the
   *        successful completion of the CreateSnapshot request.
   *   Format is `projects/{project}/subscriptions/{sub}`.
   * @param {Object.<string, string>} [request.labels]
   *   User labels.
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions} for the details.
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
   * var client = new pubsub.v1.SubscriberClient({
   *   // optional auth parameters.
   * });
   *
   * var formattedName = client.snapshotPath('[PROJECT]', '[SNAPSHOT]');
   * var formattedSubscription = client.subscriptionPath('[PROJECT]', '[SUBSCRIPTION]');
   * var request = {
   *   name: formattedName,
   *   subscription: formattedSubscription,
   * };
   * client.createSnapshot(request)
   *   .then(responses => {
   *     var response = responses[0];
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
    options = options || {};

    return this._innerApiCalls.createSnapshot(request, options, callback);
  }

  /**
   * Updates an existing snapshot.<br><br>
   * <b>ALPHA:</b> This feature is part of an alpha release. This API might be
   * changed in backward-incompatible ways and is not recommended for production
   * use. It is not subject to any SLA or deprecation policy.
   * Note that certain properties of a snapshot are not modifiable.
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {Object} request.snapshot
   *   The updated snapshot object.
   *
   *   This object should have the same structure as [Snapshot]{@link google.pubsub.v1.Snapshot}
   * @param {Object} request.updateMask
   *   Indicates which fields in the provided snapshot to update.
   *   Must be specified and non-empty.
   *
   *   This object should have the same structure as [FieldMask]{@link google.protobuf.FieldMask}
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions} for the details.
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
   * var client = new pubsub.v1.SubscriberClient({
   *   // optional auth parameters.
   * });
   *
   * var seconds = 123456;
   * var expireTime = {
   *   seconds: seconds,
   * };
   * var snapshot = {
   *   expireTime: expireTime,
   * };
   * var pathsElement = 'expire_time';
   * var paths = [pathsElement];
   * var updateMask = {
   *   paths: paths,
   * };
   * var request = {
   *   snapshot: snapshot,
   *   updateMask: updateMask,
   * };
   * client.updateSnapshot(request)
   *   .then(responses => {
   *     var response = responses[0];
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
    options = options || {};

    return this._innerApiCalls.updateSnapshot(request, options, callback);
  }

  /**
   * Removes an existing snapshot. <br><br>
   * <b>ALPHA:</b> This feature is part of an alpha release. This API might be
   * changed in backward-incompatible ways and is not recommended for production
   * use. It is not subject to any SLA or deprecation policy.
   * When the snapshot is deleted, all messages retained in the snapshot
   * are immediately dropped. After a snapshot is deleted, a new one may be
   * created with the same name, but the new one has no association with the old
   * snapshot or its subscription, unless the same subscription is specified.
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {string} request.snapshot
   *   The name of the snapshot to delete.
   *   Format is `projects/{project}/snapshots/{snap}`.
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions} for the details.
   * @param {function(?Error)} [callback]
   *   The function which will be called with the result of the API call.
   * @returns {Promise} - The promise which resolves when API call finishes.
   *   The promise has a method named "cancel" which cancels the ongoing API call.
   *
   * @example
   *
   * const pubsub = require('@google-cloud/pubsub');
   *
   * var client = new pubsub.v1.SubscriberClient({
   *   // optional auth parameters.
   * });
   *
   * var formattedSnapshot = client.snapshotPath('[PROJECT]', '[SNAPSHOT]');
   * client.deleteSnapshot({snapshot: formattedSnapshot}).catch(err => {
   *   console.error(err);
   * });
   */
  deleteSnapshot(request, options, callback) {
    if (options instanceof Function && callback === undefined) {
      callback = options;
      options = {};
    }
    options = options || {};

    return this._innerApiCalls.deleteSnapshot(request, options, callback);
  }

  /**
   * Seeks an existing subscription to a point in time or to a given snapshot,
   * whichever is provided in the request.<br><br>
   * <b>ALPHA:</b> This feature is part of an alpha release. This API might be
   * changed in backward-incompatible ways and is not recommended for production
   * use. It is not subject to any SLA or deprecation policy.
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {string} request.subscription
   *   The subscription to affect.
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
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions} for the details.
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
   * var client = new pubsub.v1.SubscriberClient({
   *   // optional auth parameters.
   * });
   *
   * var formattedSubscription = client.subscriptionPath('[PROJECT]', '[SUBSCRIPTION]');
   * client.seek({subscription: formattedSubscription})
   *   .then(responses => {
   *     var response = responses[0];
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
    options = options || {};

    return this._innerApiCalls.seek(request, options, callback);
  }

  /**
   * Sets the access control policy on the specified resource. Replaces any
   * existing policy.
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {string} request.resource
   *   REQUIRED: The resource for which the policy is being specified.
   *   `resource` is usually specified as a path. For example, a Project
   *   resource is specified as `projects/{project}`.
   * @param {Object} request.policy
   *   REQUIRED: The complete policy to be applied to the `resource`. The size of
   *   the policy is limited to a few 10s of KB. An empty policy is a
   *   valid policy but certain Cloud Platform services (such as Projects)
   *   might reject them.
   *
   *   This object should have the same structure as [Policy]{@link google.iam.v1.Policy}
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions} for the details.
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
   * var client = new pubsub.v1.SubscriberClient({
   *   // optional auth parameters.
   * });
   *
   * var formattedResource = client.subscriptionPath('[PROJECT]', '[SUBSCRIPTION]');
   * var policy = {};
   * var request = {
   *   resource: formattedResource,
   *   policy: policy,
   * };
   * client.setIamPolicy(request)
   *   .then(responses => {
   *     var response = responses[0];
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
    options = options || {};

    return this._innerApiCalls.setIamPolicy(request, options, callback);
  }

  /**
   * Gets the access control policy for a resource.
   * Returns an empty policy if the resource exists and does not have a policy
   * set.
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {string} request.resource
   *   REQUIRED: The resource for which the policy is being requested.
   *   `resource` is usually specified as a path. For example, a Project
   *   resource is specified as `projects/{project}`.
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions} for the details.
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
   * var client = new pubsub.v1.SubscriberClient({
   *   // optional auth parameters.
   * });
   *
   * var formattedResource = client.subscriptionPath('[PROJECT]', '[SUBSCRIPTION]');
   * client.getIamPolicy({resource: formattedResource})
   *   .then(responses => {
   *     var response = responses[0];
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
    options = options || {};

    return this._innerApiCalls.getIamPolicy(request, options, callback);
  }

  /**
   * Returns permissions that a caller has on the specified resource.
   * If the resource does not exist, this will return an empty set of
   * permissions, not a NOT_FOUND error.
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {string} request.resource
   *   REQUIRED: The resource for which the policy detail is being requested.
   *   `resource` is usually specified as a path. For example, a Project
   *   resource is specified as `projects/{project}`.
   * @param {string[]} request.permissions
   *   The set of permissions to check for the `resource`. Permissions with
   *   wildcards (such as '*' or 'storage.*') are not allowed. For more
   *   information see
   *   [IAM Overview](https://cloud.google.com/iam/docs/overview#permissions).
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions} for the details.
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
   * var client = new pubsub.v1.SubscriberClient({
   *   // optional auth parameters.
   * });
   *
   * var formattedResource = client.subscriptionPath('[PROJECT]', '[SUBSCRIPTION]');
   * var permissions = [];
   * var request = {
   *   resource: formattedResource,
   *   permissions: permissions,
   * };
   * client.testIamPermissions(request)
   *   .then(responses => {
   *     var response = responses[0];
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
    options = options || {};

    return this._innerApiCalls.testIamPermissions(request, options, callback);
  }

  // --------------------
  // -- Path templates --
  // --------------------

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
}

module.exports = SubscriberClient;
