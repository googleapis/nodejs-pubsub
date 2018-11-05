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

const gapicConfig = require('./publisher_client_config');
const gax = require('google-gax');
const merge = require('lodash.merge');
const path = require('path');
const protobuf = require('protobufjs');

const VERSION = require('../../../package.json').version;

/**
 * The service that an application uses to manipulate topics, and to send
 * messages to a topic.
 *
 * @class
 * @memberof v1
 */
class PublisherClient {
  /**
   * Construct an instance of PublisherClient.
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
    const gaxGrpc = new gax.GrpcClient(opts);

    // Save the auth object to the client, for use by other methods.
    this.auth = gaxGrpc.auth;

    // Determine the client header string.
    const clientHeader = [
      `gl-node/${process.version}`,
      `grpc/${gaxGrpc.grpcVersion}`,
      `gax/${gax.version}`,
      `gapic/${VERSION}`,
    ];
    if (opts.libName && opts.libVersion) {
      clientHeader.push(`${opts.libName}/${opts.libVersion}`);
    }

    // Load the applicable protos.
    const protos = merge(
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
      topicPathTemplate: new gax.PathTemplate(
        'projects/{project}/topics/{topic}'
      ),
      projectPathTemplate: new gax.PathTemplate('projects/{project}'),
    };

    // Some of the methods on this service return "paged" results,
    // (e.g. 50 results at a time, with tokens to get subsequent
    // pages). Denote the keys used for pagination and results.
    this._descriptors.page = {
      listTopics: new gax.PageDescriptor(
        'pageToken',
        'nextPageToken',
        'topics'
      ),
      listTopicSubscriptions: new gax.PageDescriptor(
        'pageToken',
        'nextPageToken',
        'subscriptions'
      ),
    };
    let protoFilesRoot = new gax.GoogleProtoFilesRoot();
    protoFilesRoot = protobuf.loadSync(
      path.join(
        __dirname,
        '..',
        '..',
        'protos',
        'google/iam/v1/iam_policy.proto'
      ),
      protoFilesRoot
    );
    protoFilesRoot = protobuf.loadSync(
      path.join(
        __dirname,
        '..',
        '..',
        'protos',
        'google/pubsub/v1/pubsub.proto'
      ),
      protoFilesRoot
    );

    // Some methods on this API support automatically batching
    // requests; denote this.
    this._descriptors.batching = {
      publish: new gax.BundleDescriptor(
        'messages',
        ['topic'],
        'messageIds',
        gax.createByteLengthFunction(
          protoFilesRoot.lookup('google.pubsub.v1.PubsubMessage')
        )
      ),
    };

    // Put together the default options sent with requests.
    const defaults = gaxGrpc.constructSettings(
      'google.pubsub.v1.Publisher',
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
      protos.google.iam.v1.IAMPolicy,
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
      this._innerApiCalls[methodName] = gax.createApiCall(
        iamPolicyStub.then(
          stub =>
            function() {
              const args = Array.prototype.slice.call(arguments, 0);
              return stub[methodName].apply(stub, args);
            }
        ),
        defaults[methodName],
        this._descriptors.page[methodName] ||
          this._descriptors.batching[methodName]
      );
    }

    // Put together the "service stub" for
    // google.pubsub.v1.Publisher.
    const publisherStub = gaxGrpc.createStub(
      protos.google.pubsub.v1.Publisher,
      opts
    );

    // Iterate over each of the methods that the service provides
    // and create an API call method for each.
    const publisherStubMethods = [
      'createTopic',
      'updateTopic',
      'publish',
      'getTopic',
      'listTopics',
      'listTopicSubscriptions',
      'deleteTopic',
    ];
    for (const methodName of publisherStubMethods) {
      this._innerApiCalls[methodName] = gax.createApiCall(
        publisherStub.then(
          stub =>
            function() {
              const args = Array.prototype.slice.call(arguments, 0);
              return stub[methodName].apply(stub, args);
            }
        ),
        defaults[methodName],
        this._descriptors.page[methodName] ||
          this._descriptors.batching[methodName]
      );
    }
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
   * Creates the given topic with the given name. See the
   * <a href="/pubsub/docs/admin#resource_names"> resource name rules</a>.
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {string} request.name
   *   The name of the topic. It must have the format
   *   `"projects/{project}/topics/{topic}"`. `{topic}` must start with a letter,
   *   and contain only letters (`[A-Za-z]`), numbers (`[0-9]`), dashes (`-`),
   *   underscores (`_`), periods (`.`), tildes (`~`), plus (`+`) or percent
   *   signs (`%`). It must be between 3 and 255 characters in length, and it
   *   must not start with `"goog"`.
   * @param {Object.<string, string>} [request.labels]
   *   See <a href="/pubsub/docs/labels"> Creating and managing labels</a>.
   * @param {Object} [request.messageStoragePolicy]
   *   Policy constraining how messages published to the topic may be stored. It
   *   is determined when the topic is created based on the policy configured at
   *   the project level. It must not be set by the caller in the request to
   *   CreateTopic or to UpdateTopic. This field will be populated in the
   *   responses for GetTopic, CreateTopic, and UpdateTopic: if not present in the
   *   response, then no constraints are in effect.
   *
   *   This object should have the same structure as [MessageStoragePolicy]{@link google.pubsub.v1.MessageStoragePolicy}
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions} for the details.
   * @param {function(?Error, ?Object)} [callback]
   *   The function which will be called with the result of the API call.
   *
   *   The second parameter to the callback is an object representing [Topic]{@link google.pubsub.v1.Topic}.
   * @returns {Promise} - The promise which resolves to an array.
   *   The first element of the array is an object representing [Topic]{@link google.pubsub.v1.Topic}.
   *   The promise has a method named "cancel" which cancels the ongoing API call.
   *
   * @example
   *
   * const pubsub = require('@google-cloud/pubsub');
   *
   * const client = new pubsub.v1.PublisherClient({
   *   // optional auth parameters.
   * });
   *
   * const formattedName = client.topicPath('[PROJECT]', '[TOPIC]');
   * client.createTopic({name: formattedName})
   *   .then(responses => {
   *     const response = responses[0];
   *     // doThingsWith(response)
   *   })
   *   .catch(err => {
   *     console.error(err);
   *   });
   */
  createTopic(request, options, callback) {
    if (options instanceof Function && callback === undefined) {
      callback = options;
      options = {};
    }
    options = options || {};

    return this._innerApiCalls.createTopic(request, options, callback);
  }

  /**
   * Updates an existing topic. Note that certain properties of a
   * topic are not modifiable.
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {Object} request.topic
   *   The updated topic object.
   *
   *   This object should have the same structure as [Topic]{@link google.pubsub.v1.Topic}
   * @param {Object} request.updateMask
   *   Indicates which fields in the provided topic to update. Must be specified
   *   and non-empty. Note that if `update_mask` contains
   *   "message_storage_policy" then the new value will be determined based on the
   *   policy configured at the project or organization level. The
   *   `message_storage_policy` must not be set in the `topic` provided above.
   *
   *   This object should have the same structure as [FieldMask]{@link google.protobuf.FieldMask}
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions} for the details.
   * @param {function(?Error, ?Object)} [callback]
   *   The function which will be called with the result of the API call.
   *
   *   The second parameter to the callback is an object representing [Topic]{@link google.pubsub.v1.Topic}.
   * @returns {Promise} - The promise which resolves to an array.
   *   The first element of the array is an object representing [Topic]{@link google.pubsub.v1.Topic}.
   *   The promise has a method named "cancel" which cancels the ongoing API call.
   *
   * @example
   *
   * const pubsub = require('@google-cloud/pubsub');
   *
   * const client = new pubsub.v1.PublisherClient({
   *   // optional auth parameters.
   * });
   *
   * const topic = {};
   * const updateMask = {};
   * const request = {
   *   topic: topic,
   *   updateMask: updateMask,
   * };
   * client.updateTopic(request)
   *   .then(responses => {
   *     const response = responses[0];
   *     // doThingsWith(response)
   *   })
   *   .catch(err => {
   *     console.error(err);
   *   });
   */
  updateTopic(request, options, callback) {
    if (options instanceof Function && callback === undefined) {
      callback = options;
      options = {};
    }
    options = options || {};

    return this._innerApiCalls.updateTopic(request, options, callback);
  }

  /**
   * Adds one or more messages to the topic. Returns `NOT_FOUND` if the topic
   * does not exist.
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {string} request.topic
   *   The messages in the request will be published on this topic.
   *   Format is `projects/{project}/topics/{topic}`.
   * @param {Object[]} request.messages
   *   The messages to publish.
   *
   *   This object should have the same structure as [PubsubMessage]{@link google.pubsub.v1.PubsubMessage}
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions} for the details.
   * @param {function(?Error, ?Object)} [callback]
   *   The function which will be called with the result of the API call.
   *
   *   The second parameter to the callback is an object representing [PublishResponse]{@link google.pubsub.v1.PublishResponse}.
   * @returns {Promise} - The promise which resolves to an array.
   *   The first element of the array is an object representing [PublishResponse]{@link google.pubsub.v1.PublishResponse}.
   *   The promise has a method named "cancel" which cancels the ongoing API call.
   *
   * @example
   *
   * const pubsub = require('@google-cloud/pubsub');
   *
   * const client = new pubsub.v1.PublisherClient({
   *   // optional auth parameters.
   * });
   *
   * const formattedTopic = client.topicPath('[PROJECT]', '[TOPIC]');
   * const data = '';
   * const messagesElement = {
   *   data: data,
   * };
   * const messages = [messagesElement];
   * const request = {
   *   topic: formattedTopic,
   *   messages: messages,
   * };
   * client.publish(request)
   *   .then(responses => {
   *     const response = responses[0];
   *     // doThingsWith(response)
   *   })
   *   .catch(err => {
   *     console.error(err);
   *   });
   */
  publish(request, options, callback) {
    if (options instanceof Function && callback === undefined) {
      callback = options;
      options = {};
    }
    options = options || {};

    return this._innerApiCalls.publish(request, options, callback);
  }

  /**
   * Gets the configuration of a topic.
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {string} request.topic
   *   The name of the topic to get.
   *   Format is `projects/{project}/topics/{topic}`.
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions} for the details.
   * @param {function(?Error, ?Object)} [callback]
   *   The function which will be called with the result of the API call.
   *
   *   The second parameter to the callback is an object representing [Topic]{@link google.pubsub.v1.Topic}.
   * @returns {Promise} - The promise which resolves to an array.
   *   The first element of the array is an object representing [Topic]{@link google.pubsub.v1.Topic}.
   *   The promise has a method named "cancel" which cancels the ongoing API call.
   *
   * @example
   *
   * const pubsub = require('@google-cloud/pubsub');
   *
   * const client = new pubsub.v1.PublisherClient({
   *   // optional auth parameters.
   * });
   *
   * const formattedTopic = client.topicPath('[PROJECT]', '[TOPIC]');
   * client.getTopic({topic: formattedTopic})
   *   .then(responses => {
   *     const response = responses[0];
   *     // doThingsWith(response)
   *   })
   *   .catch(err => {
   *     console.error(err);
   *   });
   */
  getTopic(request, options, callback) {
    if (options instanceof Function && callback === undefined) {
      callback = options;
      options = {};
    }
    options = options || {};

    return this._innerApiCalls.getTopic(request, options, callback);
  }

  /**
   * Lists matching topics.
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {string} request.project
   *   The name of the project in which to list topics.
   *   Format is `projects/{project-id}`.
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
   *   The second parameter to the callback is Array of [Topic]{@link google.pubsub.v1.Topic}.
   *
   *   When autoPaginate: false is specified through options, it contains the result
   *   in a single response. If the response indicates the next page exists, the third
   *   parameter is set to be used for the next request object. The fourth parameter keeps
   *   the raw response object of an object representing [ListTopicsResponse]{@link google.pubsub.v1.ListTopicsResponse}.
   * @returns {Promise} - The promise which resolves to an array.
   *   The first element of the array is Array of [Topic]{@link google.pubsub.v1.Topic}.
   *
   *   When autoPaginate: false is specified through options, the array has three elements.
   *   The first element is Array of [Topic]{@link google.pubsub.v1.Topic} in a single response.
   *   The second element is the next request object if the response
   *   indicates the next page exists, or null. The third element is
   *   an object representing [ListTopicsResponse]{@link google.pubsub.v1.ListTopicsResponse}.
   *
   *   The promise has a method named "cancel" which cancels the ongoing API call.
   *
   * @example
   *
   * const pubsub = require('@google-cloud/pubsub');
   *
   * const client = new pubsub.v1.PublisherClient({
   *   // optional auth parameters.
   * });
   *
   * // Iterate over all elements.
   * const formattedProject = client.projectPath('[PROJECT]');
   *
   * client.listTopics({project: formattedProject})
   *   .then(responses => {
   *     const resources = responses[0];
   *     for (let i = 0; i < resources.length; i += 1) {
   *       // doThingsWith(resources[i])
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
   *   for (let i = 0; i < resources.length; i += 1) {
   *     // doThingsWith(resources[i]);
   *   }
   *   if (nextRequest) {
   *     // Fetch the next page.
   *     return client.listTopics(nextRequest, options).then(callback);
   *   }
   * }
   * client.listTopics({project: formattedProject}, options)
   *   .then(callback)
   *   .catch(err => {
   *     console.error(err);
   *   });
   */
  listTopics(request, options, callback) {
    if (options instanceof Function && callback === undefined) {
      callback = options;
      options = {};
    }
    options = options || {};

    return this._innerApiCalls.listTopics(request, options, callback);
  }

  /**
   * Equivalent to {@link listTopics}, but returns a NodeJS Stream object.
   *
   * This fetches the paged responses for {@link listTopics} continuously
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
   *   The name of the project in which to list topics.
   *   Format is `projects/{project-id}`.
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
   *   An object stream which emits an object representing [Topic]{@link google.pubsub.v1.Topic} on 'data' event.
   *
   * @example
   *
   * const pubsub = require('@google-cloud/pubsub');
   *
   * const client = new pubsub.v1.PublisherClient({
   *   // optional auth parameters.
   * });
   *
   * const formattedProject = client.projectPath('[PROJECT]');
   * client.listTopicsStream({project: formattedProject})
   *   .on('data', element => {
   *     // doThingsWith(element)
   *   }).on('error', err => {
   *     console.log(err);
   *   });
   */
  listTopicsStream(request, options) {
    options = options || {};

    return this._descriptors.page.listTopics.createStream(
      this._innerApiCalls.listTopics,
      request,
      options
    );
  }

  /**
   * Lists the names of the subscriptions on this topic.
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {string} request.topic
   *   The name of the topic that subscriptions are attached to.
   *   Format is `projects/{project}/topics/{topic}`.
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
   *   The second parameter to the callback is Array of string.
   *
   *   When autoPaginate: false is specified through options, it contains the result
   *   in a single response. If the response indicates the next page exists, the third
   *   parameter is set to be used for the next request object. The fourth parameter keeps
   *   the raw response object of an object representing [ListTopicSubscriptionsResponse]{@link google.pubsub.v1.ListTopicSubscriptionsResponse}.
   * @returns {Promise} - The promise which resolves to an array.
   *   The first element of the array is Array of string.
   *
   *   When autoPaginate: false is specified through options, the array has three elements.
   *   The first element is Array of string in a single response.
   *   The second element is the next request object if the response
   *   indicates the next page exists, or null. The third element is
   *   an object representing [ListTopicSubscriptionsResponse]{@link google.pubsub.v1.ListTopicSubscriptionsResponse}.
   *
   *   The promise has a method named "cancel" which cancels the ongoing API call.
   *
   * @example
   *
   * const pubsub = require('@google-cloud/pubsub');
   *
   * const client = new pubsub.v1.PublisherClient({
   *   // optional auth parameters.
   * });
   *
   * // Iterate over all elements.
   * const formattedTopic = client.topicPath('[PROJECT]', '[TOPIC]');
   *
   * client.listTopicSubscriptions({topic: formattedTopic})
   *   .then(responses => {
   *     const resources = responses[0];
   *     for (let i = 0; i < resources.length; i += 1) {
   *       // doThingsWith(resources[i])
   *     }
   *   })
   *   .catch(err => {
   *     console.error(err);
   *   });
   *
   * // Or obtain the paged response.
   * const formattedTopic = client.topicPath('[PROJECT]', '[TOPIC]');
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
   *   for (let i = 0; i < resources.length; i += 1) {
   *     // doThingsWith(resources[i]);
   *   }
   *   if (nextRequest) {
   *     // Fetch the next page.
   *     return client.listTopicSubscriptions(nextRequest, options).then(callback);
   *   }
   * }
   * client.listTopicSubscriptions({topic: formattedTopic}, options)
   *   .then(callback)
   *   .catch(err => {
   *     console.error(err);
   *   });
   */
  listTopicSubscriptions(request, options, callback) {
    if (options instanceof Function && callback === undefined) {
      callback = options;
      options = {};
    }
    options = options || {};

    return this._innerApiCalls.listTopicSubscriptions(
      request,
      options,
      callback
    );
  }

  /**
   * Equivalent to {@link listTopicSubscriptions}, but returns a NodeJS Stream object.
   *
   * This fetches the paged responses for {@link listTopicSubscriptions} continuously
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
   * @param {string} request.topic
   *   The name of the topic that subscriptions are attached to.
   *   Format is `projects/{project}/topics/{topic}`.
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
   *   An object stream which emits a string on 'data' event.
   *
   * @example
   *
   * const pubsub = require('@google-cloud/pubsub');
   *
   * const client = new pubsub.v1.PublisherClient({
   *   // optional auth parameters.
   * });
   *
   * const formattedTopic = client.topicPath('[PROJECT]', '[TOPIC]');
   * client.listTopicSubscriptionsStream({topic: formattedTopic})
   *   .on('data', element => {
   *     // doThingsWith(element)
   *   }).on('error', err => {
   *     console.log(err);
   *   });
   */
  listTopicSubscriptionsStream(request, options) {
    options = options || {};

    return this._descriptors.page.listTopicSubscriptions.createStream(
      this._innerApiCalls.listTopicSubscriptions,
      request,
      options
    );
  }

  /**
   * Deletes the topic with the given name. Returns `NOT_FOUND` if the topic
   * does not exist. After a topic is deleted, a new topic may be created with
   * the same name; this is an entirely new topic with none of the old
   * configuration or subscriptions. Existing subscriptions to this topic are
   * not deleted, but their `topic` field is set to `_deleted-topic_`.
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {string} request.topic
   *   Name of the topic to delete.
   *   Format is `projects/{project}/topics/{topic}`.
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
   * const client = new pubsub.v1.PublisherClient({
   *   // optional auth parameters.
   * });
   *
   * const formattedTopic = client.topicPath('[PROJECT]', '[TOPIC]');
   * client.deleteTopic({topic: formattedTopic}).catch(err => {
   *   console.error(err);
   * });
   */
  deleteTopic(request, options, callback) {
    if (options instanceof Function && callback === undefined) {
      callback = options;
      options = {};
    }
    options = options || {};

    return this._innerApiCalls.deleteTopic(request, options, callback);
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
   * const client = new pubsub.v1.PublisherClient({
   *   // optional auth parameters.
   * });
   *
   * const formattedResource = client.topicPath('[PROJECT]', '[TOPIC]');
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
   * const client = new pubsub.v1.PublisherClient({
   *   // optional auth parameters.
   * });
   *
   * const formattedResource = client.topicPath('[PROJECT]', '[TOPIC]');
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
   * const client = new pubsub.v1.PublisherClient({
   *   // optional auth parameters.
   * });
   *
   * const formattedResource = client.topicPath('[PROJECT]', '[TOPIC]');
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
    options = options || {};

    return this._innerApiCalls.testIamPermissions(request, options, callback);
  }

  // --------------------
  // -- Path templates --
  // --------------------

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
}

module.exports = PublisherClient;
