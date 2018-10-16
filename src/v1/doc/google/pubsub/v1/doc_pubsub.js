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

// Note: this file is purely for documentation. Any contents are not expected
// to be loaded as the JS file.

/**
 * @property {string[]} allowedPersistenceRegions
 *   The list of GCP regions where messages that are published to the topic may
 *   be persisted in storage. Messages published by publishers running in
 *   non-allowed GCP regions (or running outside of GCP altogether) will be
 *   routed for storage in one of the allowed regions. An empty list indicates a
 *   misconfiguration at the project or organization level, which will result in
 *   all Publish operations failing.
 *
 * @typedef MessageStoragePolicy
 * @memberof google.pubsub.v1
 * @see [google.pubsub.v1.MessageStoragePolicy definition in proto format]{@link https://github.com/googleapis/googleapis/blob/master/google/pubsub/v1/pubsub.proto}
 */
const MessageStoragePolicy = {
  // This is for documentation. Actual contents will be loaded by gRPC.
};

/**
 * A topic resource.
 *
 * @property {string} name
 *   The name of the topic. It must have the format
 *   `"projects/{project}/topics/{topic}"`. `{topic}` must start with a letter,
 *   and contain only letters (`[A-Za-z]`), numbers (`[0-9]`), dashes (`-`),
 *   underscores (`_`), periods (`.`), tildes (`~`), plus (`+`) or percent
 *   signs (`%`). It must be between 3 and 255 characters in length, and it
 *   must not start with `"goog"`.
 *
 * @property {Object.<string, string>} labels
 *   See <a href="/pubsub/docs/labels"> Creating and managing labels</a>.
 *
 * @property {Object} messageStoragePolicy
 *   Policy constraining how messages published to the topic may be stored. It
 *   is determined when the topic is created based on the policy configured at
 *   the project level. It must not be set by the caller in the request to
 *   CreateTopic or to UpdateTopic. This field will be populated in the
 *   responses for GetTopic, CreateTopic, and UpdateTopic: if not present in the
 *   response, then no constraints are in effect.
 *
 *   This object should have the same structure as [MessageStoragePolicy]{@link google.pubsub.v1.MessageStoragePolicy}
 *
 * @typedef Topic
 * @memberof google.pubsub.v1
 * @see [google.pubsub.v1.Topic definition in proto format]{@link https://github.com/googleapis/googleapis/blob/master/google/pubsub/v1/pubsub.proto}
 */
const Topic = {
  // This is for documentation. Actual contents will be loaded by gRPC.
};

/**
 * A message that is published by publishers and consumed by subscribers. The
 * message must contain either a non-empty data field or at least one attribute.
 * See <a href="/pubsub/quotas">Quotas and limits</a> for more information about
 * message limits.
 *
 * @property {string} data
 *   The message data field. If this field is empty, the message must contain
 *   at least one attribute.
 *
 * @property {Object.<string, string>} attributes
 *   Optional attributes for this message.
 *
 * @property {string} messageId
 *   ID of this message, assigned by the server when the message is published.
 *   Guaranteed to be unique within the topic. This value may be read by a
 *   subscriber that receives a `PubsubMessage` via a `Pull` call or a push
 *   delivery. It must not be populated by the publisher in a `Publish` call.
 *
 * @property {Object} publishTime
 *   The time at which the message was published, populated by the server when
 *   it receives the `Publish` call. It must not be populated by the
 *   publisher in a `Publish` call.
 *
 *   This object should have the same structure as [Timestamp]{@link google.protobuf.Timestamp}
 *
 * @typedef PubsubMessage
 * @memberof google.pubsub.v1
 * @see [google.pubsub.v1.PubsubMessage definition in proto format]{@link https://github.com/googleapis/googleapis/blob/master/google/pubsub/v1/pubsub.proto}
 */
const PubsubMessage = {
  // This is for documentation. Actual contents will be loaded by gRPC.
};

/**
 * Request for the GetTopic method.
 *
 * @property {string} topic
 *   The name of the topic to get.
 *   Format is `projects/{project}/topics/{topic}`.
 *
 * @typedef GetTopicRequest
 * @memberof google.pubsub.v1
 * @see [google.pubsub.v1.GetTopicRequest definition in proto format]{@link https://github.com/googleapis/googleapis/blob/master/google/pubsub/v1/pubsub.proto}
 */
const GetTopicRequest = {
  // This is for documentation. Actual contents will be loaded by gRPC.
};

/**
 * Request for the UpdateTopic method.
 *
 * @property {Object} topic
 *   The updated topic object.
 *
 *   This object should have the same structure as [Topic]{@link google.pubsub.v1.Topic}
 *
 * @property {Object} updateMask
 *   Indicates which fields in the provided topic to update. Must be specified
 *   and non-empty. Note that if `update_mask` contains
 *   "message_storage_policy" then the new value will be determined based on the
 *   policy configured at the project or organization level. The
 *   `message_storage_policy` must not be set in the `topic` provided above.
 *
 *   This object should have the same structure as [FieldMask]{@link google.protobuf.FieldMask}
 *
 * @typedef UpdateTopicRequest
 * @memberof google.pubsub.v1
 * @see [google.pubsub.v1.UpdateTopicRequest definition in proto format]{@link https://github.com/googleapis/googleapis/blob/master/google/pubsub/v1/pubsub.proto}
 */
const UpdateTopicRequest = {
  // This is for documentation. Actual contents will be loaded by gRPC.
};

/**
 * Request for the Publish method.
 *
 * @property {string} topic
 *   The messages in the request will be published on this topic.
 *   Format is `projects/{project}/topics/{topic}`.
 *
 * @property {Object[]} messages
 *   The messages to publish.
 *
 *   This object should have the same structure as [PubsubMessage]{@link google.pubsub.v1.PubsubMessage}
 *
 * @typedef PublishRequest
 * @memberof google.pubsub.v1
 * @see [google.pubsub.v1.PublishRequest definition in proto format]{@link https://github.com/googleapis/googleapis/blob/master/google/pubsub/v1/pubsub.proto}
 */
const PublishRequest = {
  // This is for documentation. Actual contents will be loaded by gRPC.
};

/**
 * Response for the `Publish` method.
 *
 * @property {string[]} messageIds
 *   The server-assigned ID of each published message, in the same order as
 *   the messages in the request. IDs are guaranteed to be unique within
 *   the topic.
 *
 * @typedef PublishResponse
 * @memberof google.pubsub.v1
 * @see [google.pubsub.v1.PublishResponse definition in proto format]{@link https://github.com/googleapis/googleapis/blob/master/google/pubsub/v1/pubsub.proto}
 */
const PublishResponse = {
  // This is for documentation. Actual contents will be loaded by gRPC.
};

/**
 * Request for the `ListTopics` method.
 *
 * @property {string} project
 *   The name of the project in which to list topics.
 *   Format is `projects/{project-id}`.
 *
 * @property {number} pageSize
 *   Maximum number of topics to return.
 *
 * @property {string} pageToken
 *   The value returned by the last `ListTopicsResponse`; indicates that this is
 *   a continuation of a prior `ListTopics` call, and that the system should
 *   return the next page of data.
 *
 * @typedef ListTopicsRequest
 * @memberof google.pubsub.v1
 * @see [google.pubsub.v1.ListTopicsRequest definition in proto format]{@link https://github.com/googleapis/googleapis/blob/master/google/pubsub/v1/pubsub.proto}
 */
const ListTopicsRequest = {
  // This is for documentation. Actual contents will be loaded by gRPC.
};

/**
 * Response for the `ListTopics` method.
 *
 * @property {Object[]} topics
 *   The resulting topics.
 *
 *   This object should have the same structure as [Topic]{@link google.pubsub.v1.Topic}
 *
 * @property {string} nextPageToken
 *   If not empty, indicates that there may be more topics that match the
 *   request; this value should be passed in a new `ListTopicsRequest`.
 *
 * @typedef ListTopicsResponse
 * @memberof google.pubsub.v1
 * @see [google.pubsub.v1.ListTopicsResponse definition in proto format]{@link https://github.com/googleapis/googleapis/blob/master/google/pubsub/v1/pubsub.proto}
 */
const ListTopicsResponse = {
  // This is for documentation. Actual contents will be loaded by gRPC.
};

/**
 * Request for the `ListTopicSubscriptions` method.
 *
 * @property {string} topic
 *   The name of the topic that subscriptions are attached to.
 *   Format is `projects/{project}/topics/{topic}`.
 *
 * @property {number} pageSize
 *   Maximum number of subscription names to return.
 *
 * @property {string} pageToken
 *   The value returned by the last `ListTopicSubscriptionsResponse`; indicates
 *   that this is a continuation of a prior `ListTopicSubscriptions` call, and
 *   that the system should return the next page of data.
 *
 * @typedef ListTopicSubscriptionsRequest
 * @memberof google.pubsub.v1
 * @see [google.pubsub.v1.ListTopicSubscriptionsRequest definition in proto format]{@link https://github.com/googleapis/googleapis/blob/master/google/pubsub/v1/pubsub.proto}
 */
const ListTopicSubscriptionsRequest = {
  // This is for documentation. Actual contents will be loaded by gRPC.
};

/**
 * Response for the `ListTopicSubscriptions` method.
 *
 * @property {string[]} subscriptions
 *   The names of the subscriptions that match the request.
 *
 * @property {string} nextPageToken
 *   If not empty, indicates that there may be more subscriptions that match
 *   the request; this value should be passed in a new
 *   `ListTopicSubscriptionsRequest` to get more subscriptions.
 *
 * @typedef ListTopicSubscriptionsResponse
 * @memberof google.pubsub.v1
 * @see [google.pubsub.v1.ListTopicSubscriptionsResponse definition in proto format]{@link https://github.com/googleapis/googleapis/blob/master/google/pubsub/v1/pubsub.proto}
 */
const ListTopicSubscriptionsResponse = {
  // This is for documentation. Actual contents will be loaded by gRPC.
};

/**
 * Request for the `ListTopicSnapshots` method.<br><br>
 * <b>ALPHA:</b> This feature is part of an alpha release. This API might be
 * changed in backward-incompatible ways and is not recommended for production
 * use. It is not subject to any SLA or deprecation policy.
 *
 * @property {string} topic
 *   The name of the topic that snapshots are attached to.
 *   Format is `projects/{project}/topics/{topic}`.
 *
 * @property {number} pageSize
 *   Maximum number of snapshot names to return.
 *
 * @property {string} pageToken
 *   The value returned by the last `ListTopicSnapshotsResponse`; indicates
 *   that this is a continuation of a prior `ListTopicSnapshots` call, and
 *   that the system should return the next page of data.
 *
 * @typedef ListTopicSnapshotsRequest
 * @memberof google.pubsub.v1
 * @see [google.pubsub.v1.ListTopicSnapshotsRequest definition in proto format]{@link https://github.com/googleapis/googleapis/blob/master/google/pubsub/v1/pubsub.proto}
 */
const ListTopicSnapshotsRequest = {
  // This is for documentation. Actual contents will be loaded by gRPC.
};

/**
 * Response for the `ListTopicSnapshots` method.<br><br>
 * <b>ALPHA:</b> This feature is part of an alpha release. This API might be
 * changed in backward-incompatible ways and is not recommended for production
 * use. It is not subject to any SLA or deprecation policy.
 *
 * @property {string[]} snapshots
 *   The names of the snapshots that match the request.
 *
 * @property {string} nextPageToken
 *   If not empty, indicates that there may be more snapshots that match
 *   the request; this value should be passed in a new
 *   `ListTopicSnapshotsRequest` to get more snapshots.
 *
 * @typedef ListTopicSnapshotsResponse
 * @memberof google.pubsub.v1
 * @see [google.pubsub.v1.ListTopicSnapshotsResponse definition in proto format]{@link https://github.com/googleapis/googleapis/blob/master/google/pubsub/v1/pubsub.proto}
 */
const ListTopicSnapshotsResponse = {
  // This is for documentation. Actual contents will be loaded by gRPC.
};

/**
 * Request for the `DeleteTopic` method.
 *
 * @property {string} topic
 *   Name of the topic to delete.
 *   Format is `projects/{project}/topics/{topic}`.
 *
 * @typedef DeleteTopicRequest
 * @memberof google.pubsub.v1
 * @see [google.pubsub.v1.DeleteTopicRequest definition in proto format]{@link https://github.com/googleapis/googleapis/blob/master/google/pubsub/v1/pubsub.proto}
 */
const DeleteTopicRequest = {
  // This is for documentation. Actual contents will be loaded by gRPC.
};

/**
 * A subscription resource.
 *
 * @property {string} name
 *   The name of the subscription. It must have the format
 *   `"projects/{project}/subscriptions/{subscription}"`. `{subscription}` must
 *   start with a letter, and contain only letters (`[A-Za-z]`), numbers
 *   (`[0-9]`), dashes (`-`), underscores (`_`), periods (`.`), tildes (`~`),
 *   plus (`+`) or percent signs (`%`). It must be between 3 and 255 characters
 *   in length, and it must not start with `"goog"`
 *
 * @property {string} topic
 *   The name of the topic from which this subscription is receiving messages.
 *   Format is `projects/{project}/topics/{topic}`.
 *   The value of this field will be `_deleted-topic_` if the topic has been
 *   deleted.
 *
 * @property {Object} pushConfig
 *   If push delivery is used with this subscription, this field is
 *   used to configure it. An empty `pushConfig` signifies that the subscriber
 *   will pull and ack messages using API methods.
 *
 *   This object should have the same structure as [PushConfig]{@link google.pubsub.v1.PushConfig}
 *
 * @property {number} ackDeadlineSeconds
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
 *
 * @property {boolean} retainAckedMessages
 *   Indicates whether to retain acknowledged messages. If true, then
 *   messages are not expunged from the subscription's backlog, even if they are
 *   acknowledged, until they fall out of the `message_retention_duration`
 *   window.<br><br>
 *   <b>ALPHA:</b> This feature is part of an alpha release. This API might be
 *   changed in backward-incompatible ways and is not recommended for production
 *   use. It is not subject to any SLA or deprecation policy.
 *
 * @property {Object} messageRetentionDuration
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
 *
 * @property {Object.<string, string>} labels
 *   See <a href="/pubsub/docs/labels"> Creating and managing labels</a>.
 *
 * @property {Object} expirationPolicy
 *   A policy that specifies the conditions for this subscription's expiration.
 *   A subscription is considered active as long as any connected subscriber is
 *   successfully consuming messages from the subscription or is issuing
 *   operations on the subscription. If `expiration_policy` is not set, a
 *   *default policy* with `ttl` of 31 days will be used. The minimum allowed
 *   value for `expiration_policy.ttl` is 1 day.
 *   <b>BETA:</b> This feature is part of a beta release. This API might be
 *   changed in backward-incompatible ways and is not recommended for production
 *   use. It is not subject to any SLA or deprecation policy.
 *
 *   This object should have the same structure as [ExpirationPolicy]{@link google.pubsub.v1.ExpirationPolicy}
 *
 * @typedef Subscription
 * @memberof google.pubsub.v1
 * @see [google.pubsub.v1.Subscription definition in proto format]{@link https://github.com/googleapis/googleapis/blob/master/google/pubsub/v1/pubsub.proto}
 */
const Subscription = {
  // This is for documentation. Actual contents will be loaded by gRPC.
};

/**
 * A policy that specifies the conditions for resource expiration (i.e.,
 * automatic resource deletion).
 *
 * @property {Object} ttl
 *   Specifies the "time-to-live" duration for an associated resource. The
 *   resource expires if it is not active for a period of `ttl`. The definition
 *   of "activity" depends on the type of the associated resource. The minimum
 *   and maximum allowed values for `ttl` depend on the type of the associated
 *   resource, as well. If `ttl` is not set, the associated resource never
 *   expires.
 *
 *   This object should have the same structure as [Duration]{@link google.protobuf.Duration}
 *
 * @typedef ExpirationPolicy
 * @memberof google.pubsub.v1
 * @see [google.pubsub.v1.ExpirationPolicy definition in proto format]{@link https://github.com/googleapis/googleapis/blob/master/google/pubsub/v1/pubsub.proto}
 */
const ExpirationPolicy = {
  // This is for documentation. Actual contents will be loaded by gRPC.
};

/**
 * Configuration for a push delivery endpoint.
 *
 * @property {string} pushEndpoint
 *   A URL locating the endpoint to which messages should be pushed.
 *   For example, a Webhook endpoint might use "https://example.com/push".
 *
 * @property {Object.<string, string>} attributes
 *   Endpoint configuration attributes.
 *
 *   Every endpoint has a set of API supported attributes that can be used to
 *   control different aspects of the message delivery.
 *
 *   The currently supported attribute is `x-goog-version`, which you can
 *   use to change the format of the pushed message. This attribute
 *   indicates the version of the data expected by the endpoint. This
 *   controls the shape of the pushed message (i.e., its fields and metadata).
 *   The endpoint version is based on the version of the Pub/Sub API.
 *
 *   If not present during the `CreateSubscription` call, it will default to
 *   the version of the API used to make such call. If not present during a
 *   `ModifyPushConfig` call, its value will not be changed. `GetSubscription`
 *   calls will always return a valid version, even if the subscription was
 *   created without this attribute.
 *
 *   The possible values for this attribute are:
 *
 *   * `v1beta1`: uses the push format defined in the v1beta1 Pub/Sub API.
 *   * `v1` or `v1beta2`: uses the push format defined in the v1 Pub/Sub API.
 *
 * @typedef PushConfig
 * @memberof google.pubsub.v1
 * @see [google.pubsub.v1.PushConfig definition in proto format]{@link https://github.com/googleapis/googleapis/blob/master/google/pubsub/v1/pubsub.proto}
 */
const PushConfig = {
  // This is for documentation. Actual contents will be loaded by gRPC.
};

/**
 * A message and its corresponding acknowledgment ID.
 *
 * @property {string} ackId
 *   This ID can be used to acknowledge the received message.
 *
 * @property {Object} message
 *   The message.
 *
 *   This object should have the same structure as [PubsubMessage]{@link google.pubsub.v1.PubsubMessage}
 *
 * @typedef ReceivedMessage
 * @memberof google.pubsub.v1
 * @see [google.pubsub.v1.ReceivedMessage definition in proto format]{@link https://github.com/googleapis/googleapis/blob/master/google/pubsub/v1/pubsub.proto}
 */
const ReceivedMessage = {
  // This is for documentation. Actual contents will be loaded by gRPC.
};

/**
 * Request for the GetSubscription method.
 *
 * @property {string} subscription
 *   The name of the subscription to get.
 *   Format is `projects/{project}/subscriptions/{sub}`.
 *
 * @typedef GetSubscriptionRequest
 * @memberof google.pubsub.v1
 * @see [google.pubsub.v1.GetSubscriptionRequest definition in proto format]{@link https://github.com/googleapis/googleapis/blob/master/google/pubsub/v1/pubsub.proto}
 */
const GetSubscriptionRequest = {
  // This is for documentation. Actual contents will be loaded by gRPC.
};

/**
 * Request for the UpdateSubscription method.
 *
 * @property {Object} subscription
 *   The updated subscription object.
 *
 *   This object should have the same structure as [Subscription]{@link google.pubsub.v1.Subscription}
 *
 * @property {Object} updateMask
 *   Indicates which fields in the provided subscription to update.
 *   Must be specified and non-empty.
 *
 *   This object should have the same structure as [FieldMask]{@link google.protobuf.FieldMask}
 *
 * @typedef UpdateSubscriptionRequest
 * @memberof google.pubsub.v1
 * @see [google.pubsub.v1.UpdateSubscriptionRequest definition in proto format]{@link https://github.com/googleapis/googleapis/blob/master/google/pubsub/v1/pubsub.proto}
 */
const UpdateSubscriptionRequest = {
  // This is for documentation. Actual contents will be loaded by gRPC.
};

/**
 * Request for the `ListSubscriptions` method.
 *
 * @property {string} project
 *   The name of the project in which to list subscriptions.
 *   Format is `projects/{project-id}`.
 *
 * @property {number} pageSize
 *   Maximum number of subscriptions to return.
 *
 * @property {string} pageToken
 *   The value returned by the last `ListSubscriptionsResponse`; indicates that
 *   this is a continuation of a prior `ListSubscriptions` call, and that the
 *   system should return the next page of data.
 *
 * @typedef ListSubscriptionsRequest
 * @memberof google.pubsub.v1
 * @see [google.pubsub.v1.ListSubscriptionsRequest definition in proto format]{@link https://github.com/googleapis/googleapis/blob/master/google/pubsub/v1/pubsub.proto}
 */
const ListSubscriptionsRequest = {
  // This is for documentation. Actual contents will be loaded by gRPC.
};

/**
 * Response for the `ListSubscriptions` method.
 *
 * @property {Object[]} subscriptions
 *   The subscriptions that match the request.
 *
 *   This object should have the same structure as [Subscription]{@link google.pubsub.v1.Subscription}
 *
 * @property {string} nextPageToken
 *   If not empty, indicates that there may be more subscriptions that match
 *   the request; this value should be passed in a new
 *   `ListSubscriptionsRequest` to get more subscriptions.
 *
 * @typedef ListSubscriptionsResponse
 * @memberof google.pubsub.v1
 * @see [google.pubsub.v1.ListSubscriptionsResponse definition in proto format]{@link https://github.com/googleapis/googleapis/blob/master/google/pubsub/v1/pubsub.proto}
 */
const ListSubscriptionsResponse = {
  // This is for documentation. Actual contents will be loaded by gRPC.
};

/**
 * Request for the DeleteSubscription method.
 *
 * @property {string} subscription
 *   The subscription to delete.
 *   Format is `projects/{project}/subscriptions/{sub}`.
 *
 * @typedef DeleteSubscriptionRequest
 * @memberof google.pubsub.v1
 * @see [google.pubsub.v1.DeleteSubscriptionRequest definition in proto format]{@link https://github.com/googleapis/googleapis/blob/master/google/pubsub/v1/pubsub.proto}
 */
const DeleteSubscriptionRequest = {
  // This is for documentation. Actual contents will be loaded by gRPC.
};

/**
 * Request for the ModifyPushConfig method.
 *
 * @property {string} subscription
 *   The name of the subscription.
 *   Format is `projects/{project}/subscriptions/{sub}`.
 *
 * @property {Object} pushConfig
 *   The push configuration for future deliveries.
 *
 *   An empty `pushConfig` indicates that the Pub/Sub system should
 *   stop pushing messages from the given subscription and allow
 *   messages to be pulled and acknowledged - effectively pausing
 *   the subscription if `Pull` or `StreamingPull` is not called.
 *
 *   This object should have the same structure as [PushConfig]{@link google.pubsub.v1.PushConfig}
 *
 * @typedef ModifyPushConfigRequest
 * @memberof google.pubsub.v1
 * @see [google.pubsub.v1.ModifyPushConfigRequest definition in proto format]{@link https://github.com/googleapis/googleapis/blob/master/google/pubsub/v1/pubsub.proto}
 */
const ModifyPushConfigRequest = {
  // This is for documentation. Actual contents will be loaded by gRPC.
};

/**
 * Request for the `Pull` method.
 *
 * @property {string} subscription
 *   The subscription from which messages should be pulled.
 *   Format is `projects/{project}/subscriptions/{sub}`.
 *
 * @property {boolean} returnImmediately
 *   If this field set to true, the system will respond immediately even if
 *   it there are no messages available to return in the `Pull` response.
 *   Otherwise, the system may wait (for a bounded amount of time) until at
 *   least one message is available, rather than returning no messages.
 *
 * @property {number} maxMessages
 *   The maximum number of messages returned for this request. The Pub/Sub
 *   system may return fewer than the number specified.
 *
 * @typedef PullRequest
 * @memberof google.pubsub.v1
 * @see [google.pubsub.v1.PullRequest definition in proto format]{@link https://github.com/googleapis/googleapis/blob/master/google/pubsub/v1/pubsub.proto}
 */
const PullRequest = {
  // This is for documentation. Actual contents will be loaded by gRPC.
};

/**
 * Response for the `Pull` method.
 *
 * @property {Object[]} receivedMessages
 *   Received Pub/Sub messages. The list will be empty if there are no more
 *   messages available in the backlog. For JSON, the response can be entirely
 *   empty. The Pub/Sub system may return fewer than the `maxMessages` requested
 *   even if there are more messages available in the backlog.
 *
 *   This object should have the same structure as [ReceivedMessage]{@link google.pubsub.v1.ReceivedMessage}
 *
 * @typedef PullResponse
 * @memberof google.pubsub.v1
 * @see [google.pubsub.v1.PullResponse definition in proto format]{@link https://github.com/googleapis/googleapis/blob/master/google/pubsub/v1/pubsub.proto}
 */
const PullResponse = {
  // This is for documentation. Actual contents will be loaded by gRPC.
};

/**
 * Request for the ModifyAckDeadline method.
 *
 * @property {string} subscription
 *   The name of the subscription.
 *   Format is `projects/{project}/subscriptions/{sub}`.
 *
 * @property {string[]} ackIds
 *   List of acknowledgment IDs.
 *
 * @property {number} ackDeadlineSeconds
 *   The new ack deadline with respect to the time this request was sent to
 *   the Pub/Sub system. For example, if the value is 10, the new
 *   ack deadline will expire 10 seconds after the `ModifyAckDeadline` call
 *   was made. Specifying zero may immediately make the message available for
 *   another pull request.
 *   The minimum deadline you can specify is 0 seconds.
 *   The maximum deadline you can specify is 600 seconds (10 minutes).
 *
 * @typedef ModifyAckDeadlineRequest
 * @memberof google.pubsub.v1
 * @see [google.pubsub.v1.ModifyAckDeadlineRequest definition in proto format]{@link https://github.com/googleapis/googleapis/blob/master/google/pubsub/v1/pubsub.proto}
 */
const ModifyAckDeadlineRequest = {
  // This is for documentation. Actual contents will be loaded by gRPC.
};

/**
 * Request for the Acknowledge method.
 *
 * @property {string} subscription
 *   The subscription whose message is being acknowledged.
 *   Format is `projects/{project}/subscriptions/{sub}`.
 *
 * @property {string[]} ackIds
 *   The acknowledgment ID for the messages being acknowledged that was returned
 *   by the Pub/Sub system in the `Pull` response. Must not be empty.
 *
 * @typedef AcknowledgeRequest
 * @memberof google.pubsub.v1
 * @see [google.pubsub.v1.AcknowledgeRequest definition in proto format]{@link https://github.com/googleapis/googleapis/blob/master/google/pubsub/v1/pubsub.proto}
 */
const AcknowledgeRequest = {
  // This is for documentation. Actual contents will be loaded by gRPC.
};

/**
 * Request for the `StreamingPull` streaming RPC method. This request is used to
 * establish the initial stream as well as to stream acknowledgements and ack
 * deadline modifications from the client to the server.
 *
 * @property {string} subscription
 *   The subscription for which to initialize the new stream. This must be
 *   provided in the first request on the stream, and must not be set in
 *   subsequent requests from client to server.
 *   Format is `projects/{project}/subscriptions/{sub}`.
 *
 * @property {string[]} ackIds
 *   List of acknowledgement IDs for acknowledging previously received messages
 *   (received on this stream or a different stream). If an ack ID has expired,
 *   the corresponding message may be redelivered later. Acknowledging a message
 *   more than once will not result in an error. If the acknowledgement ID is
 *   malformed, the stream will be aborted with status `INVALID_ARGUMENT`.
 *
 * @property {number[]} modifyDeadlineSeconds
 *   The list of new ack deadlines for the IDs listed in
 *   `modify_deadline_ack_ids`. The size of this list must be the same as the
 *   size of `modify_deadline_ack_ids`. If it differs the stream will be aborted
 *   with `INVALID_ARGUMENT`. Each element in this list is applied to the
 *   element in the same position in `modify_deadline_ack_ids`. The new ack
 *   deadline is with respect to the time this request was sent to the Pub/Sub
 *   system. Must be >= 0. For example, if the value is 10, the new ack deadline
 *   will expire 10 seconds after this request is received. If the value is 0,
 *   the message is immediately made available for another streaming or
 *   non-streaming pull request. If the value is < 0 (an error), the stream will
 *   be aborted with status `INVALID_ARGUMENT`.
 *
 * @property {string[]} modifyDeadlineAckIds
 *   List of acknowledgement IDs whose deadline will be modified based on the
 *   corresponding element in `modify_deadline_seconds`. This field can be used
 *   to indicate that more time is needed to process a message by the
 *   subscriber, or to make the message available for redelivery if the
 *   processing was interrupted.
 *
 * @property {number} streamAckDeadlineSeconds
 *   The ack deadline to use for the stream. This must be provided in the
 *   first request on the stream, but it can also be updated on subsequent
 *   requests from client to server. The minimum deadline you can specify is 10
 *   seconds. The maximum deadline you can specify is 600 seconds (10 minutes).
 *
 * @typedef StreamingPullRequest
 * @memberof google.pubsub.v1
 * @see [google.pubsub.v1.StreamingPullRequest definition in proto format]{@link https://github.com/googleapis/googleapis/blob/master/google/pubsub/v1/pubsub.proto}
 */
const StreamingPullRequest = {
  // This is for documentation. Actual contents will be loaded by gRPC.
};

/**
 * Response for the `StreamingPull` method. This response is used to stream
 * messages from the server to the client.
 *
 * @property {Object[]} receivedMessages
 *   Received Pub/Sub messages. This will not be empty.
 *
 *   This object should have the same structure as [ReceivedMessage]{@link google.pubsub.v1.ReceivedMessage}
 *
 * @typedef StreamingPullResponse
 * @memberof google.pubsub.v1
 * @see [google.pubsub.v1.StreamingPullResponse definition in proto format]{@link https://github.com/googleapis/googleapis/blob/master/google/pubsub/v1/pubsub.proto}
 */
const StreamingPullResponse = {
  // This is for documentation. Actual contents will be loaded by gRPC.
};

/**
 * Request for the `CreateSnapshot` method.<br><br>
 * <b>ALPHA:</b> This feature is part of an alpha release. This API might be changed in
 * backward-incompatible ways and is not recommended for production use.
 * It is not subject to any SLA or deprecation policy.
 *
 * @property {string} name
 *   Optional user-provided name for this snapshot.
 *   If the name is not provided in the request, the server will assign a random
 *   name for this snapshot on the same project as the subscription.
 *   Note that for REST API requests, you must specify a name.  See the
 *   <a href="/pubsub/docs/admin#resource_names">resource name rules</a>.
 *   Format is `projects/{project}/snapshots/{snap}`.
 *
 * @property {string} subscription
 *   The subscription whose backlog the snapshot retains.
 *   Specifically, the created snapshot is guaranteed to retain:
 *    (a) The existing backlog on the subscription. More precisely, this is
 *        defined as the messages in the subscription's backlog that are
 *        unacknowledged upon the successful completion of the
 *        `CreateSnapshot` request; as well as:
 *    (b) Any messages published to the subscription's topic following the
 *        successful completion of the CreateSnapshot request.
 *   Format is `projects/{project}/subscriptions/{sub}`.
 *
 * @property {Object.<string, string>} labels
 *   See <a href="/pubsub/docs/labels"> Creating and managing labels</a>.
 *
 * @typedef CreateSnapshotRequest
 * @memberof google.pubsub.v1
 * @see [google.pubsub.v1.CreateSnapshotRequest definition in proto format]{@link https://github.com/googleapis/googleapis/blob/master/google/pubsub/v1/pubsub.proto}
 */
const CreateSnapshotRequest = {
  // This is for documentation. Actual contents will be loaded by gRPC.
};

/**
 * Request for the UpdateSnapshot method.<br><br>
 * <b>ALPHA:</b> This feature is part of an alpha release. This API might be
 * changed in backward-incompatible ways and is not recommended for production
 * use. It is not subject to any SLA or deprecation policy.
 *
 * @property {Object} snapshot
 *   The updated snapshot object.
 *
 *   This object should have the same structure as [Snapshot]{@link google.pubsub.v1.Snapshot}
 *
 * @property {Object} updateMask
 *   Indicates which fields in the provided snapshot to update.
 *   Must be specified and non-empty.
 *
 *   This object should have the same structure as [FieldMask]{@link google.protobuf.FieldMask}
 *
 * @typedef UpdateSnapshotRequest
 * @memberof google.pubsub.v1
 * @see [google.pubsub.v1.UpdateSnapshotRequest definition in proto format]{@link https://github.com/googleapis/googleapis/blob/master/google/pubsub/v1/pubsub.proto}
 */
const UpdateSnapshotRequest = {
  // This is for documentation. Actual contents will be loaded by gRPC.
};

/**
 * A snapshot resource.<br><br>
 * <b>ALPHA:</b> This feature is part of an alpha release. This API might be
 * changed in backward-incompatible ways and is not recommended for production
 * use. It is not subject to any SLA or deprecation policy.
 *
 * @property {string} name
 *   The name of the snapshot.
 *
 * @property {string} topic
 *   The name of the topic from which this snapshot is retaining messages.
 *
 * @property {Object} expireTime
 *   The snapshot is guaranteed to exist up until this time.
 *   A newly-created snapshot expires no later than 7 days from the time of its
 *   creation. Its exact lifetime is determined at creation by the existing
 *   backlog in the source subscription. Specifically, the lifetime of the
 *   snapshot is `7 days - (age of oldest unacked message in the subscription)`.
 *   For example, consider a subscription whose oldest unacked message is 3 days
 *   old. If a snapshot is created from this subscription, the snapshot -- which
 *   will always capture this 3-day-old backlog as long as the snapshot
 *   exists -- will expire in 4 days. The service will refuse to create a
 *   snapshot that would expire in less than 1 hour after creation.
 *
 *   This object should have the same structure as [Timestamp]{@link google.protobuf.Timestamp}
 *
 * @property {Object.<string, string>} labels
 *   See <a href="/pubsub/docs/labels"> Creating and managing labels</a>.
 *
 * @typedef Snapshot
 * @memberof google.pubsub.v1
 * @see [google.pubsub.v1.Snapshot definition in proto format]{@link https://github.com/googleapis/googleapis/blob/master/google/pubsub/v1/pubsub.proto}
 */
const Snapshot = {
  // This is for documentation. Actual contents will be loaded by gRPC.
};

/**
 * Request for the GetSnapshot method.<br><br>
 * <b>ALPHA:</b> This feature is part of an alpha release. This API might be
 * changed in backward-incompatible ways and is not recommended for production
 * use. It is not subject to any SLA or deprecation policy.
 *
 * @property {string} snapshot
 *   The name of the snapshot to get.
 *   Format is `projects/{project}/snapshots/{snap}`.
 *
 * @typedef GetSnapshotRequest
 * @memberof google.pubsub.v1
 * @see [google.pubsub.v1.GetSnapshotRequest definition in proto format]{@link https://github.com/googleapis/googleapis/blob/master/google/pubsub/v1/pubsub.proto}
 */
const GetSnapshotRequest = {
  // This is for documentation. Actual contents will be loaded by gRPC.
};

/**
 * Request for the `ListSnapshots` method.<br><br>
 * <b>ALPHA:</b> This feature is part of an alpha release. This API might be
 * changed in backward-incompatible ways and is not recommended for production
 * use. It is not subject to any SLA or deprecation policy.
 *
 * @property {string} project
 *   The name of the project in which to list snapshots.
 *   Format is `projects/{project-id}`.
 *
 * @property {number} pageSize
 *   Maximum number of snapshots to return.
 *
 * @property {string} pageToken
 *   The value returned by the last `ListSnapshotsResponse`; indicates that this
 *   is a continuation of a prior `ListSnapshots` call, and that the system
 *   should return the next page of data.
 *
 * @typedef ListSnapshotsRequest
 * @memberof google.pubsub.v1
 * @see [google.pubsub.v1.ListSnapshotsRequest definition in proto format]{@link https://github.com/googleapis/googleapis/blob/master/google/pubsub/v1/pubsub.proto}
 */
const ListSnapshotsRequest = {
  // This is for documentation. Actual contents will be loaded by gRPC.
};

/**
 * Response for the `ListSnapshots` method.<br><br>
 * <b>ALPHA:</b> This feature is part of an alpha release. This API might be
 * changed in backward-incompatible ways and is not recommended for production
 * use. It is not subject to any SLA or deprecation policy.
 *
 * @property {Object[]} snapshots
 *   The resulting snapshots.
 *
 *   This object should have the same structure as [Snapshot]{@link google.pubsub.v1.Snapshot}
 *
 * @property {string} nextPageToken
 *   If not empty, indicates that there may be more snapshot that match the
 *   request; this value should be passed in a new `ListSnapshotsRequest`.
 *
 * @typedef ListSnapshotsResponse
 * @memberof google.pubsub.v1
 * @see [google.pubsub.v1.ListSnapshotsResponse definition in proto format]{@link https://github.com/googleapis/googleapis/blob/master/google/pubsub/v1/pubsub.proto}
 */
const ListSnapshotsResponse = {
  // This is for documentation. Actual contents will be loaded by gRPC.
};

/**
 * Request for the `DeleteSnapshot` method.<br><br>
 * <b>ALPHA:</b> This feature is part of an alpha release. This API might be
 * changed in backward-incompatible ways and is not recommended for production
 * use. It is not subject to any SLA or deprecation policy.
 *
 * @property {string} snapshot
 *   The name of the snapshot to delete.
 *   Format is `projects/{project}/snapshots/{snap}`.
 *
 * @typedef DeleteSnapshotRequest
 * @memberof google.pubsub.v1
 * @see [google.pubsub.v1.DeleteSnapshotRequest definition in proto format]{@link https://github.com/googleapis/googleapis/blob/master/google/pubsub/v1/pubsub.proto}
 */
const DeleteSnapshotRequest = {
  // This is for documentation. Actual contents will be loaded by gRPC.
};

/**
 * Request for the `Seek` method.<br><br>
 * <b>ALPHA:</b> This feature is part of an alpha release. This API might be
 * changed in backward-incompatible ways and is not recommended for production
 * use. It is not subject to any SLA or deprecation policy.
 *
 * @property {string} subscription
 *   The subscription to affect.
 *
 * @property {Object} time
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
 *
 * @property {string} snapshot
 *   The snapshot to seek to. The snapshot's topic must be the same as that of
 *   the provided subscription.
 *   Format is `projects/{project}/snapshots/{snap}`.
 *
 * @typedef SeekRequest
 * @memberof google.pubsub.v1
 * @see [google.pubsub.v1.SeekRequest definition in proto format]{@link https://github.com/googleapis/googleapis/blob/master/google/pubsub/v1/pubsub.proto}
 */
const SeekRequest = {
  // This is for documentation. Actual contents will be loaded by gRPC.
};

/**
 * Response for the `Seek` method (this response is empty).
 * @typedef SeekResponse
 * @memberof google.pubsub.v1
 * @see [google.pubsub.v1.SeekResponse definition in proto format]{@link https://github.com/googleapis/googleapis/blob/master/google/pubsub/v1/pubsub.proto}
 */
const SeekResponse = {
  // This is for documentation. Actual contents will be loaded by gRPC.
};