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

/**
 * @namespace google.pubsub.v1
 */
/**
 * @namespace google.protobuf
 */

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
 * @example <caption>Install the client library with <a
 * href="https://www.npmjs.com/">npm</a>:</caption> npm install --save
 * @google-cloud/pubsub
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
module.exports.v1 = require('./v1');

export {CallOptions} from 'google-gax';
export {ServiceError} from 'grpc';
export {Policy, GetPolicyCallback, SetPolicyCallback, SetPolicyResponse, GetPolicyResponse, IamPermissionsMap, TestIamPermissionsResponse, TestIamPermissionsCallback, IAM} from './iam';
export {Attributes, PublishCallback} from './publisher';
export {PageOptions, GetSnapshotsCallback, GetSnapshotsResponse, GetSubscriptionsCallback, GetSubscriptionsResponse, GetTopicsCallback, GetTopicsResponse, EmptyCallback, EmptyResponse, ExistsCallback, ExistsResponse, PubSub} from './pubsub';
export {CreateSnapshotCallback, CreateSnapshotResponse, SeekCallback, SeekResponse, Snapshot} from './snapshot';
export {Message} from './subscriber';
export {PushConfig, SubscriptionMetadata, SubscriptionOptions, SubscriptionCloseCallback, CreateSubscriptionOptions, CreateSubscriptionCallback, CreateSubscriptionResponse, GetSubscriptionOptions, GetSubscriptionCallback, GetSubscriptionResponse, GetSubscriptionMetadataCallback, GetSubscriptionMetadataResponse, SetSubscriptionMetadataCallback, SetSubscriptionMetadataResponse, Subscription} from './subscription';
export {CreateTopicCallback, CreateTopicResponse, GetTopicCallback, GetTopicResponse, GetTopicOptions, GetTopicMetadataCallback, GetTopicMetadataResponse, GetTopicSubscriptionsCallback, GetTopicSubscriptionsResponse, SetTopicMetadataCallback, SetTopicMetadataResponse, Topic, TopicMetadata} from './topic';
