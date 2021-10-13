// Copyright 2021 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as Long from "long";
import {protobuf as $protobuf} from "google-gax";
/** Namespace google. */
export namespace google {

    /** Namespace pubsub. */
    namespace pubsub {

        /** Namespace v1. */
        namespace v1 {

            /** Represents a Publisher */
            class Publisher extends $protobuf.rpc.Service {

                /**
                 * Constructs a new Publisher service.
                 * @param rpcImpl RPC implementation
                 * @param [requestDelimited=false] Whether requests are length-delimited
                 * @param [responseDelimited=false] Whether responses are length-delimited
                 */
                constructor(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean);

                /**
                 * Creates new Publisher service using the specified rpc implementation.
                 * @param rpcImpl RPC implementation
                 * @param [requestDelimited=false] Whether requests are length-delimited
                 * @param [responseDelimited=false] Whether responses are length-delimited
                 * @returns RPC service. Useful where requests and/or responses are streamed.
                 */
                public static create(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean): Publisher;

                /**
                 * Calls CreateTopic.
                 * @param request Topic message or plain object
                 * @param callback Node-style callback called with the error, if any, and Topic
                 */
                public createTopic(request: google.pubsub.v1.ITopic, callback: google.pubsub.v1.Publisher.CreateTopicCallback): void;

                /**
                 * Calls CreateTopic.
                 * @param request Topic message or plain object
                 * @returns Promise
                 */
                public createTopic(request: google.pubsub.v1.ITopic): Promise<google.pubsub.v1.Topic>;

                /**
                 * Calls UpdateTopic.
                 * @param request UpdateTopicRequest message or plain object
                 * @param callback Node-style callback called with the error, if any, and Topic
                 */
                public updateTopic(request: google.pubsub.v1.IUpdateTopicRequest, callback: google.pubsub.v1.Publisher.UpdateTopicCallback): void;

                /**
                 * Calls UpdateTopic.
                 * @param request UpdateTopicRequest message or plain object
                 * @returns Promise
                 */
                public updateTopic(request: google.pubsub.v1.IUpdateTopicRequest): Promise<google.pubsub.v1.Topic>;

                /**
                 * Calls Publish.
                 * @param request PublishRequest message or plain object
                 * @param callback Node-style callback called with the error, if any, and PublishResponse
                 */
                public publish(request: google.pubsub.v1.IPublishRequest, callback: google.pubsub.v1.Publisher.PublishCallback): void;

                /**
                 * Calls Publish.
                 * @param request PublishRequest message or plain object
                 * @returns Promise
                 */
                public publish(request: google.pubsub.v1.IPublishRequest): Promise<google.pubsub.v1.PublishResponse>;

                /**
                 * Calls GetTopic.
                 * @param request GetTopicRequest message or plain object
                 * @param callback Node-style callback called with the error, if any, and Topic
                 */
                public getTopic(request: google.pubsub.v1.IGetTopicRequest, callback: google.pubsub.v1.Publisher.GetTopicCallback): void;

                /**
                 * Calls GetTopic.
                 * @param request GetTopicRequest message or plain object
                 * @returns Promise
                 */
                public getTopic(request: google.pubsub.v1.IGetTopicRequest): Promise<google.pubsub.v1.Topic>;

                /**
                 * Calls ListTopics.
                 * @param request ListTopicsRequest message or plain object
                 * @param callback Node-style callback called with the error, if any, and ListTopicsResponse
                 */
                public listTopics(request: google.pubsub.v1.IListTopicsRequest, callback: google.pubsub.v1.Publisher.ListTopicsCallback): void;

                /**
                 * Calls ListTopics.
                 * @param request ListTopicsRequest message or plain object
                 * @returns Promise
                 */
                public listTopics(request: google.pubsub.v1.IListTopicsRequest): Promise<google.pubsub.v1.ListTopicsResponse>;

                /**
                 * Calls ListTopicSubscriptions.
                 * @param request ListTopicSubscriptionsRequest message or plain object
                 * @param callback Node-style callback called with the error, if any, and ListTopicSubscriptionsResponse
                 */
                public listTopicSubscriptions(request: google.pubsub.v1.IListTopicSubscriptionsRequest, callback: google.pubsub.v1.Publisher.ListTopicSubscriptionsCallback): void;

                /**
                 * Calls ListTopicSubscriptions.
                 * @param request ListTopicSubscriptionsRequest message or plain object
                 * @returns Promise
                 */
                public listTopicSubscriptions(request: google.pubsub.v1.IListTopicSubscriptionsRequest): Promise<google.pubsub.v1.ListTopicSubscriptionsResponse>;

                /**
                 * Calls ListTopicSnapshots.
                 * @param request ListTopicSnapshotsRequest message or plain object
                 * @param callback Node-style callback called with the error, if any, and ListTopicSnapshotsResponse
                 */
                public listTopicSnapshots(request: google.pubsub.v1.IListTopicSnapshotsRequest, callback: google.pubsub.v1.Publisher.ListTopicSnapshotsCallback): void;

                /**
                 * Calls ListTopicSnapshots.
                 * @param request ListTopicSnapshotsRequest message or plain object
                 * @returns Promise
                 */
                public listTopicSnapshots(request: google.pubsub.v1.IListTopicSnapshotsRequest): Promise<google.pubsub.v1.ListTopicSnapshotsResponse>;

                /**
                 * Calls DeleteTopic.
                 * @param request DeleteTopicRequest message or plain object
                 * @param callback Node-style callback called with the error, if any, and Empty
                 */
                public deleteTopic(request: google.pubsub.v1.IDeleteTopicRequest, callback: google.pubsub.v1.Publisher.DeleteTopicCallback): void;

                /**
                 * Calls DeleteTopic.
                 * @param request DeleteTopicRequest message or plain object
                 * @returns Promise
                 */
                public deleteTopic(request: google.pubsub.v1.IDeleteTopicRequest): Promise<google.protobuf.Empty>;

                /**
                 * Calls DetachSubscription.
                 * @param request DetachSubscriptionRequest message or plain object
                 * @param callback Node-style callback called with the error, if any, and DetachSubscriptionResponse
                 */
                public detachSubscription(request: google.pubsub.v1.IDetachSubscriptionRequest, callback: google.pubsub.v1.Publisher.DetachSubscriptionCallback): void;

                /**
                 * Calls DetachSubscription.
                 * @param request DetachSubscriptionRequest message or plain object
                 * @returns Promise
                 */
                public detachSubscription(request: google.pubsub.v1.IDetachSubscriptionRequest): Promise<google.pubsub.v1.DetachSubscriptionResponse>;
            }

            namespace Publisher {

                /**
                 * Callback as used by {@link google.pubsub.v1.Publisher#createTopic}.
                 * @param error Error, if any
                 * @param [response] Topic
                 */
                type CreateTopicCallback = (error: (Error|null), response?: google.pubsub.v1.Topic) => void;

                /**
                 * Callback as used by {@link google.pubsub.v1.Publisher#updateTopic}.
                 * @param error Error, if any
                 * @param [response] Topic
                 */
                type UpdateTopicCallback = (error: (Error|null), response?: google.pubsub.v1.Topic) => void;

                /**
                 * Callback as used by {@link google.pubsub.v1.Publisher#publish}.
                 * @param error Error, if any
                 * @param [response] PublishResponse
                 */
                type PublishCallback = (error: (Error|null), response?: google.pubsub.v1.PublishResponse) => void;

                /**
                 * Callback as used by {@link google.pubsub.v1.Publisher#getTopic}.
                 * @param error Error, if any
                 * @param [response] Topic
                 */
                type GetTopicCallback = (error: (Error|null), response?: google.pubsub.v1.Topic) => void;

                /**
                 * Callback as used by {@link google.pubsub.v1.Publisher#listTopics}.
                 * @param error Error, if any
                 * @param [response] ListTopicsResponse
                 */
                type ListTopicsCallback = (error: (Error|null), response?: google.pubsub.v1.ListTopicsResponse) => void;

                /**
                 * Callback as used by {@link google.pubsub.v1.Publisher#listTopicSubscriptions}.
                 * @param error Error, if any
                 * @param [response] ListTopicSubscriptionsResponse
                 */
                type ListTopicSubscriptionsCallback = (error: (Error|null), response?: google.pubsub.v1.ListTopicSubscriptionsResponse) => void;

                /**
                 * Callback as used by {@link google.pubsub.v1.Publisher#listTopicSnapshots}.
                 * @param error Error, if any
                 * @param [response] ListTopicSnapshotsResponse
                 */
                type ListTopicSnapshotsCallback = (error: (Error|null), response?: google.pubsub.v1.ListTopicSnapshotsResponse) => void;

                /**
                 * Callback as used by {@link google.pubsub.v1.Publisher#deleteTopic}.
                 * @param error Error, if any
                 * @param [response] Empty
                 */
                type DeleteTopicCallback = (error: (Error|null), response?: google.protobuf.Empty) => void;

                /**
                 * Callback as used by {@link google.pubsub.v1.Publisher#detachSubscription}.
                 * @param error Error, if any
                 * @param [response] DetachSubscriptionResponse
                 */
                type DetachSubscriptionCallback = (error: (Error|null), response?: google.pubsub.v1.DetachSubscriptionResponse) => void;
            }

            /** Properties of a MessageStoragePolicy. */
            interface IMessageStoragePolicy {

                /** MessageStoragePolicy allowedPersistenceRegions */
                allowedPersistenceRegions?: (string[]|null);
            }

            /** Represents a MessageStoragePolicy. */
            class MessageStoragePolicy implements IMessageStoragePolicy {

                /**
                 * Constructs a new MessageStoragePolicy.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.pubsub.v1.IMessageStoragePolicy);

                /** MessageStoragePolicy allowedPersistenceRegions. */
                public allowedPersistenceRegions: string[];

                /**
                 * Creates a new MessageStoragePolicy instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns MessageStoragePolicy instance
                 */
                public static create(properties?: google.pubsub.v1.IMessageStoragePolicy): google.pubsub.v1.MessageStoragePolicy;

                /**
                 * Encodes the specified MessageStoragePolicy message. Does not implicitly {@link google.pubsub.v1.MessageStoragePolicy.verify|verify} messages.
                 * @param message MessageStoragePolicy message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.pubsub.v1.IMessageStoragePolicy, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified MessageStoragePolicy message, length delimited. Does not implicitly {@link google.pubsub.v1.MessageStoragePolicy.verify|verify} messages.
                 * @param message MessageStoragePolicy message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.pubsub.v1.IMessageStoragePolicy, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a MessageStoragePolicy message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns MessageStoragePolicy
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.pubsub.v1.MessageStoragePolicy;

                /**
                 * Decodes a MessageStoragePolicy message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns MessageStoragePolicy
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.pubsub.v1.MessageStoragePolicy;

                /**
                 * Verifies a MessageStoragePolicy message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a MessageStoragePolicy message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns MessageStoragePolicy
                 */
                public static fromObject(object: { [k: string]: any }): google.pubsub.v1.MessageStoragePolicy;

                /**
                 * Creates a plain object from a MessageStoragePolicy message. Also converts values to other types if specified.
                 * @param message MessageStoragePolicy
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.pubsub.v1.MessageStoragePolicy, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this MessageStoragePolicy to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a SchemaSettings. */
            interface ISchemaSettings {

                /** SchemaSettings schema */
                schema?: (string|null);

                /** SchemaSettings encoding */
                encoding?: (google.pubsub.v1.Encoding|keyof typeof google.pubsub.v1.Encoding|null);
            }

            /** Represents a SchemaSettings. */
            class SchemaSettings implements ISchemaSettings {

                /**
                 * Constructs a new SchemaSettings.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.pubsub.v1.ISchemaSettings);

                /** SchemaSettings schema. */
                public schema: string;

                /** SchemaSettings encoding. */
                public encoding: (google.pubsub.v1.Encoding|keyof typeof google.pubsub.v1.Encoding);

                /**
                 * Creates a new SchemaSettings instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns SchemaSettings instance
                 */
                public static create(properties?: google.pubsub.v1.ISchemaSettings): google.pubsub.v1.SchemaSettings;

                /**
                 * Encodes the specified SchemaSettings message. Does not implicitly {@link google.pubsub.v1.SchemaSettings.verify|verify} messages.
                 * @param message SchemaSettings message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.pubsub.v1.ISchemaSettings, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified SchemaSettings message, length delimited. Does not implicitly {@link google.pubsub.v1.SchemaSettings.verify|verify} messages.
                 * @param message SchemaSettings message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.pubsub.v1.ISchemaSettings, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a SchemaSettings message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns SchemaSettings
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.pubsub.v1.SchemaSettings;

                /**
                 * Decodes a SchemaSettings message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns SchemaSettings
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.pubsub.v1.SchemaSettings;

                /**
                 * Verifies a SchemaSettings message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a SchemaSettings message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns SchemaSettings
                 */
                public static fromObject(object: { [k: string]: any }): google.pubsub.v1.SchemaSettings;

                /**
                 * Creates a plain object from a SchemaSettings message. Also converts values to other types if specified.
                 * @param message SchemaSettings
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.pubsub.v1.SchemaSettings, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this SchemaSettings to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a Topic. */
            interface ITopic {

                /** Topic name */
                name?: (string|null);

                /** Topic labels */
                labels?: ({ [k: string]: string }|null);

                /** Topic messageStoragePolicy */
                messageStoragePolicy?: (google.pubsub.v1.IMessageStoragePolicy|null);

                /** Topic kmsKeyName */
                kmsKeyName?: (string|null);

                /** Topic schemaSettings */
                schemaSettings?: (google.pubsub.v1.ISchemaSettings|null);

                /** Topic satisfiesPzs */
                satisfiesPzs?: (boolean|null);

                /** Topic messageRetentionDuration */
                messageRetentionDuration?: (google.protobuf.IDuration|null);
            }

            /** Represents a Topic. */
            class Topic implements ITopic {

                /**
                 * Constructs a new Topic.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.pubsub.v1.ITopic);

                /** Topic name. */
                public name: string;

                /** Topic labels. */
                public labels: { [k: string]: string };

                /** Topic messageStoragePolicy. */
                public messageStoragePolicy?: (google.pubsub.v1.IMessageStoragePolicy|null);

                /** Topic kmsKeyName. */
                public kmsKeyName: string;

                /** Topic schemaSettings. */
                public schemaSettings?: (google.pubsub.v1.ISchemaSettings|null);

                /** Topic satisfiesPzs. */
                public satisfiesPzs: boolean;

                /** Topic messageRetentionDuration. */
                public messageRetentionDuration?: (google.protobuf.IDuration|null);

                /**
                 * Creates a new Topic instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Topic instance
                 */
                public static create(properties?: google.pubsub.v1.ITopic): google.pubsub.v1.Topic;

                /**
                 * Encodes the specified Topic message. Does not implicitly {@link google.pubsub.v1.Topic.verify|verify} messages.
                 * @param message Topic message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.pubsub.v1.ITopic, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Topic message, length delimited. Does not implicitly {@link google.pubsub.v1.Topic.verify|verify} messages.
                 * @param message Topic message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.pubsub.v1.ITopic, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Topic message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Topic
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.pubsub.v1.Topic;

                /**
                 * Decodes a Topic message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Topic
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.pubsub.v1.Topic;

                /**
                 * Verifies a Topic message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Topic message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Topic
                 */
                public static fromObject(object: { [k: string]: any }): google.pubsub.v1.Topic;

                /**
                 * Creates a plain object from a Topic message. Also converts values to other types if specified.
                 * @param message Topic
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.pubsub.v1.Topic, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Topic to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a PubsubMessage. */
            interface IPubsubMessage {

                /** PubsubMessage data */
                data?: (Uint8Array|string|null);

                /** PubsubMessage attributes */
                attributes?: ({ [k: string]: string }|null);

                /** PubsubMessage messageId */
                messageId?: (string|null);

                /** PubsubMessage publishTime */
                publishTime?: (google.protobuf.ITimestamp|null);

                /** PubsubMessage orderingKey */
                orderingKey?: (string|null);
            }

            /** Represents a PubsubMessage. */
            class PubsubMessage implements IPubsubMessage {

                /**
                 * Constructs a new PubsubMessage.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.pubsub.v1.IPubsubMessage);

                /** PubsubMessage data. */
                public data: (Uint8Array|string);

                /** PubsubMessage attributes. */
                public attributes: { [k: string]: string };

                /** PubsubMessage messageId. */
                public messageId: string;

                /** PubsubMessage publishTime. */
                public publishTime?: (google.protobuf.ITimestamp|null);

                /** PubsubMessage orderingKey. */
                public orderingKey: string;

                /**
                 * Creates a new PubsubMessage instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns PubsubMessage instance
                 */
                public static create(properties?: google.pubsub.v1.IPubsubMessage): google.pubsub.v1.PubsubMessage;

                /**
                 * Encodes the specified PubsubMessage message. Does not implicitly {@link google.pubsub.v1.PubsubMessage.verify|verify} messages.
                 * @param message PubsubMessage message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.pubsub.v1.IPubsubMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified PubsubMessage message, length delimited. Does not implicitly {@link google.pubsub.v1.PubsubMessage.verify|verify} messages.
                 * @param message PubsubMessage message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.pubsub.v1.IPubsubMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a PubsubMessage message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns PubsubMessage
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.pubsub.v1.PubsubMessage;

                /**
                 * Decodes a PubsubMessage message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns PubsubMessage
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.pubsub.v1.PubsubMessage;

                /**
                 * Verifies a PubsubMessage message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a PubsubMessage message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns PubsubMessage
                 */
                public static fromObject(object: { [k: string]: any }): google.pubsub.v1.PubsubMessage;

                /**
                 * Creates a plain object from a PubsubMessage message. Also converts values to other types if specified.
                 * @param message PubsubMessage
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.pubsub.v1.PubsubMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this PubsubMessage to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a GetTopicRequest. */
            interface IGetTopicRequest {

                /** GetTopicRequest topic */
                topic?: (string|null);
            }

            /** Represents a GetTopicRequest. */
            class GetTopicRequest implements IGetTopicRequest {

                /**
                 * Constructs a new GetTopicRequest.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.pubsub.v1.IGetTopicRequest);

                /** GetTopicRequest topic. */
                public topic: string;

                /**
                 * Creates a new GetTopicRequest instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns GetTopicRequest instance
                 */
                public static create(properties?: google.pubsub.v1.IGetTopicRequest): google.pubsub.v1.GetTopicRequest;

                /**
                 * Encodes the specified GetTopicRequest message. Does not implicitly {@link google.pubsub.v1.GetTopicRequest.verify|verify} messages.
                 * @param message GetTopicRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.pubsub.v1.IGetTopicRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified GetTopicRequest message, length delimited. Does not implicitly {@link google.pubsub.v1.GetTopicRequest.verify|verify} messages.
                 * @param message GetTopicRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.pubsub.v1.IGetTopicRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a GetTopicRequest message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns GetTopicRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.pubsub.v1.GetTopicRequest;

                /**
                 * Decodes a GetTopicRequest message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns GetTopicRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.pubsub.v1.GetTopicRequest;

                /**
                 * Verifies a GetTopicRequest message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a GetTopicRequest message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns GetTopicRequest
                 */
                public static fromObject(object: { [k: string]: any }): google.pubsub.v1.GetTopicRequest;

                /**
                 * Creates a plain object from a GetTopicRequest message. Also converts values to other types if specified.
                 * @param message GetTopicRequest
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.pubsub.v1.GetTopicRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this GetTopicRequest to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of an UpdateTopicRequest. */
            interface IUpdateTopicRequest {

                /** UpdateTopicRequest topic */
                topic?: (google.pubsub.v1.ITopic|null);

                /** UpdateTopicRequest updateMask */
                updateMask?: (google.protobuf.IFieldMask|null);
            }

            /** Represents an UpdateTopicRequest. */
            class UpdateTopicRequest implements IUpdateTopicRequest {

                /**
                 * Constructs a new UpdateTopicRequest.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.pubsub.v1.IUpdateTopicRequest);

                /** UpdateTopicRequest topic. */
                public topic?: (google.pubsub.v1.ITopic|null);

                /** UpdateTopicRequest updateMask. */
                public updateMask?: (google.protobuf.IFieldMask|null);

                /**
                 * Creates a new UpdateTopicRequest instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns UpdateTopicRequest instance
                 */
                public static create(properties?: google.pubsub.v1.IUpdateTopicRequest): google.pubsub.v1.UpdateTopicRequest;

                /**
                 * Encodes the specified UpdateTopicRequest message. Does not implicitly {@link google.pubsub.v1.UpdateTopicRequest.verify|verify} messages.
                 * @param message UpdateTopicRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.pubsub.v1.IUpdateTopicRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified UpdateTopicRequest message, length delimited. Does not implicitly {@link google.pubsub.v1.UpdateTopicRequest.verify|verify} messages.
                 * @param message UpdateTopicRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.pubsub.v1.IUpdateTopicRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an UpdateTopicRequest message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns UpdateTopicRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.pubsub.v1.UpdateTopicRequest;

                /**
                 * Decodes an UpdateTopicRequest message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns UpdateTopicRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.pubsub.v1.UpdateTopicRequest;

                /**
                 * Verifies an UpdateTopicRequest message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an UpdateTopicRequest message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns UpdateTopicRequest
                 */
                public static fromObject(object: { [k: string]: any }): google.pubsub.v1.UpdateTopicRequest;

                /**
                 * Creates a plain object from an UpdateTopicRequest message. Also converts values to other types if specified.
                 * @param message UpdateTopicRequest
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.pubsub.v1.UpdateTopicRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this UpdateTopicRequest to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a PublishRequest. */
            interface IPublishRequest {

                /** PublishRequest topic */
                topic?: (string|null);

                /** PublishRequest messages */
                messages?: (google.pubsub.v1.IPubsubMessage[]|null);
            }

            /** Represents a PublishRequest. */
            class PublishRequest implements IPublishRequest {

                /**
                 * Constructs a new PublishRequest.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.pubsub.v1.IPublishRequest);

                /** PublishRequest topic. */
                public topic: string;

                /** PublishRequest messages. */
                public messages: google.pubsub.v1.IPubsubMessage[];

                /**
                 * Creates a new PublishRequest instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns PublishRequest instance
                 */
                public static create(properties?: google.pubsub.v1.IPublishRequest): google.pubsub.v1.PublishRequest;

                /**
                 * Encodes the specified PublishRequest message. Does not implicitly {@link google.pubsub.v1.PublishRequest.verify|verify} messages.
                 * @param message PublishRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.pubsub.v1.IPublishRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified PublishRequest message, length delimited. Does not implicitly {@link google.pubsub.v1.PublishRequest.verify|verify} messages.
                 * @param message PublishRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.pubsub.v1.IPublishRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a PublishRequest message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns PublishRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.pubsub.v1.PublishRequest;

                /**
                 * Decodes a PublishRequest message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns PublishRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.pubsub.v1.PublishRequest;

                /**
                 * Verifies a PublishRequest message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a PublishRequest message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns PublishRequest
                 */
                public static fromObject(object: { [k: string]: any }): google.pubsub.v1.PublishRequest;

                /**
                 * Creates a plain object from a PublishRequest message. Also converts values to other types if specified.
                 * @param message PublishRequest
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.pubsub.v1.PublishRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this PublishRequest to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a PublishResponse. */
            interface IPublishResponse {

                /** PublishResponse messageIds */
                messageIds?: (string[]|null);
            }

            /** Represents a PublishResponse. */
            class PublishResponse implements IPublishResponse {

                /**
                 * Constructs a new PublishResponse.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.pubsub.v1.IPublishResponse);

                /** PublishResponse messageIds. */
                public messageIds: string[];

                /**
                 * Creates a new PublishResponse instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns PublishResponse instance
                 */
                public static create(properties?: google.pubsub.v1.IPublishResponse): google.pubsub.v1.PublishResponse;

                /**
                 * Encodes the specified PublishResponse message. Does not implicitly {@link google.pubsub.v1.PublishResponse.verify|verify} messages.
                 * @param message PublishResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.pubsub.v1.IPublishResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified PublishResponse message, length delimited. Does not implicitly {@link google.pubsub.v1.PublishResponse.verify|verify} messages.
                 * @param message PublishResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.pubsub.v1.IPublishResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a PublishResponse message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns PublishResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.pubsub.v1.PublishResponse;

                /**
                 * Decodes a PublishResponse message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns PublishResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.pubsub.v1.PublishResponse;

                /**
                 * Verifies a PublishResponse message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a PublishResponse message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns PublishResponse
                 */
                public static fromObject(object: { [k: string]: any }): google.pubsub.v1.PublishResponse;

                /**
                 * Creates a plain object from a PublishResponse message. Also converts values to other types if specified.
                 * @param message PublishResponse
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.pubsub.v1.PublishResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this PublishResponse to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a ListTopicsRequest. */
            interface IListTopicsRequest {

                /** ListTopicsRequest project */
                project?: (string|null);

                /** ListTopicsRequest pageSize */
                pageSize?: (number|null);

                /** ListTopicsRequest pageToken */
                pageToken?: (string|null);
            }

            /** Represents a ListTopicsRequest. */
            class ListTopicsRequest implements IListTopicsRequest {

                /**
                 * Constructs a new ListTopicsRequest.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.pubsub.v1.IListTopicsRequest);

                /** ListTopicsRequest project. */
                public project: string;

                /** ListTopicsRequest pageSize. */
                public pageSize: number;

                /** ListTopicsRequest pageToken. */
                public pageToken: string;

                /**
                 * Creates a new ListTopicsRequest instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns ListTopicsRequest instance
                 */
                public static create(properties?: google.pubsub.v1.IListTopicsRequest): google.pubsub.v1.ListTopicsRequest;

                /**
                 * Encodes the specified ListTopicsRequest message. Does not implicitly {@link google.pubsub.v1.ListTopicsRequest.verify|verify} messages.
                 * @param message ListTopicsRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.pubsub.v1.IListTopicsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ListTopicsRequest message, length delimited. Does not implicitly {@link google.pubsub.v1.ListTopicsRequest.verify|verify} messages.
                 * @param message ListTopicsRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.pubsub.v1.IListTopicsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a ListTopicsRequest message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns ListTopicsRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.pubsub.v1.ListTopicsRequest;

                /**
                 * Decodes a ListTopicsRequest message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns ListTopicsRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.pubsub.v1.ListTopicsRequest;

                /**
                 * Verifies a ListTopicsRequest message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a ListTopicsRequest message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns ListTopicsRequest
                 */
                public static fromObject(object: { [k: string]: any }): google.pubsub.v1.ListTopicsRequest;

                /**
                 * Creates a plain object from a ListTopicsRequest message. Also converts values to other types if specified.
                 * @param message ListTopicsRequest
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.pubsub.v1.ListTopicsRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this ListTopicsRequest to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a ListTopicsResponse. */
            interface IListTopicsResponse {

                /** ListTopicsResponse topics */
                topics?: (google.pubsub.v1.ITopic[]|null);

                /** ListTopicsResponse nextPageToken */
                nextPageToken?: (string|null);
            }

            /** Represents a ListTopicsResponse. */
            class ListTopicsResponse implements IListTopicsResponse {

                /**
                 * Constructs a new ListTopicsResponse.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.pubsub.v1.IListTopicsResponse);

                /** ListTopicsResponse topics. */
                public topics: google.pubsub.v1.ITopic[];

                /** ListTopicsResponse nextPageToken. */
                public nextPageToken: string;

                /**
                 * Creates a new ListTopicsResponse instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns ListTopicsResponse instance
                 */
                public static create(properties?: google.pubsub.v1.IListTopicsResponse): google.pubsub.v1.ListTopicsResponse;

                /**
                 * Encodes the specified ListTopicsResponse message. Does not implicitly {@link google.pubsub.v1.ListTopicsResponse.verify|verify} messages.
                 * @param message ListTopicsResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.pubsub.v1.IListTopicsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ListTopicsResponse message, length delimited. Does not implicitly {@link google.pubsub.v1.ListTopicsResponse.verify|verify} messages.
                 * @param message ListTopicsResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.pubsub.v1.IListTopicsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a ListTopicsResponse message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns ListTopicsResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.pubsub.v1.ListTopicsResponse;

                /**
                 * Decodes a ListTopicsResponse message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns ListTopicsResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.pubsub.v1.ListTopicsResponse;

                /**
                 * Verifies a ListTopicsResponse message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a ListTopicsResponse message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns ListTopicsResponse
                 */
                public static fromObject(object: { [k: string]: any }): google.pubsub.v1.ListTopicsResponse;

                /**
                 * Creates a plain object from a ListTopicsResponse message. Also converts values to other types if specified.
                 * @param message ListTopicsResponse
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.pubsub.v1.ListTopicsResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this ListTopicsResponse to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a ListTopicSubscriptionsRequest. */
            interface IListTopicSubscriptionsRequest {

                /** ListTopicSubscriptionsRequest topic */
                topic?: (string|null);

                /** ListTopicSubscriptionsRequest pageSize */
                pageSize?: (number|null);

                /** ListTopicSubscriptionsRequest pageToken */
                pageToken?: (string|null);
            }

            /** Represents a ListTopicSubscriptionsRequest. */
            class ListTopicSubscriptionsRequest implements IListTopicSubscriptionsRequest {

                /**
                 * Constructs a new ListTopicSubscriptionsRequest.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.pubsub.v1.IListTopicSubscriptionsRequest);

                /** ListTopicSubscriptionsRequest topic. */
                public topic: string;

                /** ListTopicSubscriptionsRequest pageSize. */
                public pageSize: number;

                /** ListTopicSubscriptionsRequest pageToken. */
                public pageToken: string;

                /**
                 * Creates a new ListTopicSubscriptionsRequest instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns ListTopicSubscriptionsRequest instance
                 */
                public static create(properties?: google.pubsub.v1.IListTopicSubscriptionsRequest): google.pubsub.v1.ListTopicSubscriptionsRequest;

                /**
                 * Encodes the specified ListTopicSubscriptionsRequest message. Does not implicitly {@link google.pubsub.v1.ListTopicSubscriptionsRequest.verify|verify} messages.
                 * @param message ListTopicSubscriptionsRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.pubsub.v1.IListTopicSubscriptionsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ListTopicSubscriptionsRequest message, length delimited. Does not implicitly {@link google.pubsub.v1.ListTopicSubscriptionsRequest.verify|verify} messages.
                 * @param message ListTopicSubscriptionsRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.pubsub.v1.IListTopicSubscriptionsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a ListTopicSubscriptionsRequest message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns ListTopicSubscriptionsRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.pubsub.v1.ListTopicSubscriptionsRequest;

                /**
                 * Decodes a ListTopicSubscriptionsRequest message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns ListTopicSubscriptionsRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.pubsub.v1.ListTopicSubscriptionsRequest;

                /**
                 * Verifies a ListTopicSubscriptionsRequest message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a ListTopicSubscriptionsRequest message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns ListTopicSubscriptionsRequest
                 */
                public static fromObject(object: { [k: string]: any }): google.pubsub.v1.ListTopicSubscriptionsRequest;

                /**
                 * Creates a plain object from a ListTopicSubscriptionsRequest message. Also converts values to other types if specified.
                 * @param message ListTopicSubscriptionsRequest
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.pubsub.v1.ListTopicSubscriptionsRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this ListTopicSubscriptionsRequest to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a ListTopicSubscriptionsResponse. */
            interface IListTopicSubscriptionsResponse {

                /** ListTopicSubscriptionsResponse subscriptions */
                subscriptions?: (string[]|null);

                /** ListTopicSubscriptionsResponse nextPageToken */
                nextPageToken?: (string|null);
            }

            /** Represents a ListTopicSubscriptionsResponse. */
            class ListTopicSubscriptionsResponse implements IListTopicSubscriptionsResponse {

                /**
                 * Constructs a new ListTopicSubscriptionsResponse.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.pubsub.v1.IListTopicSubscriptionsResponse);

                /** ListTopicSubscriptionsResponse subscriptions. */
                public subscriptions: string[];

                /** ListTopicSubscriptionsResponse nextPageToken. */
                public nextPageToken: string;

                /**
                 * Creates a new ListTopicSubscriptionsResponse instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns ListTopicSubscriptionsResponse instance
                 */
                public static create(properties?: google.pubsub.v1.IListTopicSubscriptionsResponse): google.pubsub.v1.ListTopicSubscriptionsResponse;

                /**
                 * Encodes the specified ListTopicSubscriptionsResponse message. Does not implicitly {@link google.pubsub.v1.ListTopicSubscriptionsResponse.verify|verify} messages.
                 * @param message ListTopicSubscriptionsResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.pubsub.v1.IListTopicSubscriptionsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ListTopicSubscriptionsResponse message, length delimited. Does not implicitly {@link google.pubsub.v1.ListTopicSubscriptionsResponse.verify|verify} messages.
                 * @param message ListTopicSubscriptionsResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.pubsub.v1.IListTopicSubscriptionsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a ListTopicSubscriptionsResponse message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns ListTopicSubscriptionsResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.pubsub.v1.ListTopicSubscriptionsResponse;

                /**
                 * Decodes a ListTopicSubscriptionsResponse message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns ListTopicSubscriptionsResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.pubsub.v1.ListTopicSubscriptionsResponse;

                /**
                 * Verifies a ListTopicSubscriptionsResponse message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a ListTopicSubscriptionsResponse message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns ListTopicSubscriptionsResponse
                 */
                public static fromObject(object: { [k: string]: any }): google.pubsub.v1.ListTopicSubscriptionsResponse;

                /**
                 * Creates a plain object from a ListTopicSubscriptionsResponse message. Also converts values to other types if specified.
                 * @param message ListTopicSubscriptionsResponse
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.pubsub.v1.ListTopicSubscriptionsResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this ListTopicSubscriptionsResponse to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a ListTopicSnapshotsRequest. */
            interface IListTopicSnapshotsRequest {

                /** ListTopicSnapshotsRequest topic */
                topic?: (string|null);

                /** ListTopicSnapshotsRequest pageSize */
                pageSize?: (number|null);

                /** ListTopicSnapshotsRequest pageToken */
                pageToken?: (string|null);
            }

            /** Represents a ListTopicSnapshotsRequest. */
            class ListTopicSnapshotsRequest implements IListTopicSnapshotsRequest {

                /**
                 * Constructs a new ListTopicSnapshotsRequest.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.pubsub.v1.IListTopicSnapshotsRequest);

                /** ListTopicSnapshotsRequest topic. */
                public topic: string;

                /** ListTopicSnapshotsRequest pageSize. */
                public pageSize: number;

                /** ListTopicSnapshotsRequest pageToken. */
                public pageToken: string;

                /**
                 * Creates a new ListTopicSnapshotsRequest instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns ListTopicSnapshotsRequest instance
                 */
                public static create(properties?: google.pubsub.v1.IListTopicSnapshotsRequest): google.pubsub.v1.ListTopicSnapshotsRequest;

                /**
                 * Encodes the specified ListTopicSnapshotsRequest message. Does not implicitly {@link google.pubsub.v1.ListTopicSnapshotsRequest.verify|verify} messages.
                 * @param message ListTopicSnapshotsRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.pubsub.v1.IListTopicSnapshotsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ListTopicSnapshotsRequest message, length delimited. Does not implicitly {@link google.pubsub.v1.ListTopicSnapshotsRequest.verify|verify} messages.
                 * @param message ListTopicSnapshotsRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.pubsub.v1.IListTopicSnapshotsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a ListTopicSnapshotsRequest message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns ListTopicSnapshotsRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.pubsub.v1.ListTopicSnapshotsRequest;

                /**
                 * Decodes a ListTopicSnapshotsRequest message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns ListTopicSnapshotsRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.pubsub.v1.ListTopicSnapshotsRequest;

                /**
                 * Verifies a ListTopicSnapshotsRequest message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a ListTopicSnapshotsRequest message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns ListTopicSnapshotsRequest
                 */
                public static fromObject(object: { [k: string]: any }): google.pubsub.v1.ListTopicSnapshotsRequest;

                /**
                 * Creates a plain object from a ListTopicSnapshotsRequest message. Also converts values to other types if specified.
                 * @param message ListTopicSnapshotsRequest
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.pubsub.v1.ListTopicSnapshotsRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this ListTopicSnapshotsRequest to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a ListTopicSnapshotsResponse. */
            interface IListTopicSnapshotsResponse {

                /** ListTopicSnapshotsResponse snapshots */
                snapshots?: (string[]|null);

                /** ListTopicSnapshotsResponse nextPageToken */
                nextPageToken?: (string|null);
            }

            /** Represents a ListTopicSnapshotsResponse. */
            class ListTopicSnapshotsResponse implements IListTopicSnapshotsResponse {

                /**
                 * Constructs a new ListTopicSnapshotsResponse.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.pubsub.v1.IListTopicSnapshotsResponse);

                /** ListTopicSnapshotsResponse snapshots. */
                public snapshots: string[];

                /** ListTopicSnapshotsResponse nextPageToken. */
                public nextPageToken: string;

                /**
                 * Creates a new ListTopicSnapshotsResponse instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns ListTopicSnapshotsResponse instance
                 */
                public static create(properties?: google.pubsub.v1.IListTopicSnapshotsResponse): google.pubsub.v1.ListTopicSnapshotsResponse;

                /**
                 * Encodes the specified ListTopicSnapshotsResponse message. Does not implicitly {@link google.pubsub.v1.ListTopicSnapshotsResponse.verify|verify} messages.
                 * @param message ListTopicSnapshotsResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.pubsub.v1.IListTopicSnapshotsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ListTopicSnapshotsResponse message, length delimited. Does not implicitly {@link google.pubsub.v1.ListTopicSnapshotsResponse.verify|verify} messages.
                 * @param message ListTopicSnapshotsResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.pubsub.v1.IListTopicSnapshotsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a ListTopicSnapshotsResponse message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns ListTopicSnapshotsResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.pubsub.v1.ListTopicSnapshotsResponse;

                /**
                 * Decodes a ListTopicSnapshotsResponse message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns ListTopicSnapshotsResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.pubsub.v1.ListTopicSnapshotsResponse;

                /**
                 * Verifies a ListTopicSnapshotsResponse message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a ListTopicSnapshotsResponse message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns ListTopicSnapshotsResponse
                 */
                public static fromObject(object: { [k: string]: any }): google.pubsub.v1.ListTopicSnapshotsResponse;

                /**
                 * Creates a plain object from a ListTopicSnapshotsResponse message. Also converts values to other types if specified.
                 * @param message ListTopicSnapshotsResponse
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.pubsub.v1.ListTopicSnapshotsResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this ListTopicSnapshotsResponse to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a DeleteTopicRequest. */
            interface IDeleteTopicRequest {

                /** DeleteTopicRequest topic */
                topic?: (string|null);
            }

            /** Represents a DeleteTopicRequest. */
            class DeleteTopicRequest implements IDeleteTopicRequest {

                /**
                 * Constructs a new DeleteTopicRequest.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.pubsub.v1.IDeleteTopicRequest);

                /** DeleteTopicRequest topic. */
                public topic: string;

                /**
                 * Creates a new DeleteTopicRequest instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns DeleteTopicRequest instance
                 */
                public static create(properties?: google.pubsub.v1.IDeleteTopicRequest): google.pubsub.v1.DeleteTopicRequest;

                /**
                 * Encodes the specified DeleteTopicRequest message. Does not implicitly {@link google.pubsub.v1.DeleteTopicRequest.verify|verify} messages.
                 * @param message DeleteTopicRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.pubsub.v1.IDeleteTopicRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified DeleteTopicRequest message, length delimited. Does not implicitly {@link google.pubsub.v1.DeleteTopicRequest.verify|verify} messages.
                 * @param message DeleteTopicRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.pubsub.v1.IDeleteTopicRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a DeleteTopicRequest message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns DeleteTopicRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.pubsub.v1.DeleteTopicRequest;

                /**
                 * Decodes a DeleteTopicRequest message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns DeleteTopicRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.pubsub.v1.DeleteTopicRequest;

                /**
                 * Verifies a DeleteTopicRequest message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a DeleteTopicRequest message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns DeleteTopicRequest
                 */
                public static fromObject(object: { [k: string]: any }): google.pubsub.v1.DeleteTopicRequest;

                /**
                 * Creates a plain object from a DeleteTopicRequest message. Also converts values to other types if specified.
                 * @param message DeleteTopicRequest
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.pubsub.v1.DeleteTopicRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this DeleteTopicRequest to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a DetachSubscriptionRequest. */
            interface IDetachSubscriptionRequest {

                /** DetachSubscriptionRequest subscription */
                subscription?: (string|null);
            }

            /** Represents a DetachSubscriptionRequest. */
            class DetachSubscriptionRequest implements IDetachSubscriptionRequest {

                /**
                 * Constructs a new DetachSubscriptionRequest.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.pubsub.v1.IDetachSubscriptionRequest);

                /** DetachSubscriptionRequest subscription. */
                public subscription: string;

                /**
                 * Creates a new DetachSubscriptionRequest instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns DetachSubscriptionRequest instance
                 */
                public static create(properties?: google.pubsub.v1.IDetachSubscriptionRequest): google.pubsub.v1.DetachSubscriptionRequest;

                /**
                 * Encodes the specified DetachSubscriptionRequest message. Does not implicitly {@link google.pubsub.v1.DetachSubscriptionRequest.verify|verify} messages.
                 * @param message DetachSubscriptionRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.pubsub.v1.IDetachSubscriptionRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified DetachSubscriptionRequest message, length delimited. Does not implicitly {@link google.pubsub.v1.DetachSubscriptionRequest.verify|verify} messages.
                 * @param message DetachSubscriptionRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.pubsub.v1.IDetachSubscriptionRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a DetachSubscriptionRequest message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns DetachSubscriptionRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.pubsub.v1.DetachSubscriptionRequest;

                /**
                 * Decodes a DetachSubscriptionRequest message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns DetachSubscriptionRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.pubsub.v1.DetachSubscriptionRequest;

                /**
                 * Verifies a DetachSubscriptionRequest message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a DetachSubscriptionRequest message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns DetachSubscriptionRequest
                 */
                public static fromObject(object: { [k: string]: any }): google.pubsub.v1.DetachSubscriptionRequest;

                /**
                 * Creates a plain object from a DetachSubscriptionRequest message. Also converts values to other types if specified.
                 * @param message DetachSubscriptionRequest
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.pubsub.v1.DetachSubscriptionRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this DetachSubscriptionRequest to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a DetachSubscriptionResponse. */
            interface IDetachSubscriptionResponse {
            }

            /** Represents a DetachSubscriptionResponse. */
            class DetachSubscriptionResponse implements IDetachSubscriptionResponse {

                /**
                 * Constructs a new DetachSubscriptionResponse.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.pubsub.v1.IDetachSubscriptionResponse);

                /**
                 * Creates a new DetachSubscriptionResponse instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns DetachSubscriptionResponse instance
                 */
                public static create(properties?: google.pubsub.v1.IDetachSubscriptionResponse): google.pubsub.v1.DetachSubscriptionResponse;

                /**
                 * Encodes the specified DetachSubscriptionResponse message. Does not implicitly {@link google.pubsub.v1.DetachSubscriptionResponse.verify|verify} messages.
                 * @param message DetachSubscriptionResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.pubsub.v1.IDetachSubscriptionResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified DetachSubscriptionResponse message, length delimited. Does not implicitly {@link google.pubsub.v1.DetachSubscriptionResponse.verify|verify} messages.
                 * @param message DetachSubscriptionResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.pubsub.v1.IDetachSubscriptionResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a DetachSubscriptionResponse message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns DetachSubscriptionResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.pubsub.v1.DetachSubscriptionResponse;

                /**
                 * Decodes a DetachSubscriptionResponse message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns DetachSubscriptionResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.pubsub.v1.DetachSubscriptionResponse;

                /**
                 * Verifies a DetachSubscriptionResponse message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a DetachSubscriptionResponse message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns DetachSubscriptionResponse
                 */
                public static fromObject(object: { [k: string]: any }): google.pubsub.v1.DetachSubscriptionResponse;

                /**
                 * Creates a plain object from a DetachSubscriptionResponse message. Also converts values to other types if specified.
                 * @param message DetachSubscriptionResponse
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.pubsub.v1.DetachSubscriptionResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this DetachSubscriptionResponse to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Represents a Subscriber */
            class Subscriber extends $protobuf.rpc.Service {

                /**
                 * Constructs a new Subscriber service.
                 * @param rpcImpl RPC implementation
                 * @param [requestDelimited=false] Whether requests are length-delimited
                 * @param [responseDelimited=false] Whether responses are length-delimited
                 */
                constructor(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean);

                /**
                 * Creates new Subscriber service using the specified rpc implementation.
                 * @param rpcImpl RPC implementation
                 * @param [requestDelimited=false] Whether requests are length-delimited
                 * @param [responseDelimited=false] Whether responses are length-delimited
                 * @returns RPC service. Useful where requests and/or responses are streamed.
                 */
                public static create(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean): Subscriber;

                /**
                 * Calls CreateSubscription.
                 * @param request Subscription message or plain object
                 * @param callback Node-style callback called with the error, if any, and Subscription
                 */
                public createSubscription(request: google.pubsub.v1.ISubscription, callback: google.pubsub.v1.Subscriber.CreateSubscriptionCallback): void;

                /**
                 * Calls CreateSubscription.
                 * @param request Subscription message or plain object
                 * @returns Promise
                 */
                public createSubscription(request: google.pubsub.v1.ISubscription): Promise<google.pubsub.v1.Subscription>;

                /**
                 * Calls GetSubscription.
                 * @param request GetSubscriptionRequest message or plain object
                 * @param callback Node-style callback called with the error, if any, and Subscription
                 */
                public getSubscription(request: google.pubsub.v1.IGetSubscriptionRequest, callback: google.pubsub.v1.Subscriber.GetSubscriptionCallback): void;

                /**
                 * Calls GetSubscription.
                 * @param request GetSubscriptionRequest message or plain object
                 * @returns Promise
                 */
                public getSubscription(request: google.pubsub.v1.IGetSubscriptionRequest): Promise<google.pubsub.v1.Subscription>;

                /**
                 * Calls UpdateSubscription.
                 * @param request UpdateSubscriptionRequest message or plain object
                 * @param callback Node-style callback called with the error, if any, and Subscription
                 */
                public updateSubscription(request: google.pubsub.v1.IUpdateSubscriptionRequest, callback: google.pubsub.v1.Subscriber.UpdateSubscriptionCallback): void;

                /**
                 * Calls UpdateSubscription.
                 * @param request UpdateSubscriptionRequest message or plain object
                 * @returns Promise
                 */
                public updateSubscription(request: google.pubsub.v1.IUpdateSubscriptionRequest): Promise<google.pubsub.v1.Subscription>;

                /**
                 * Calls ListSubscriptions.
                 * @param request ListSubscriptionsRequest message or plain object
                 * @param callback Node-style callback called with the error, if any, and ListSubscriptionsResponse
                 */
                public listSubscriptions(request: google.pubsub.v1.IListSubscriptionsRequest, callback: google.pubsub.v1.Subscriber.ListSubscriptionsCallback): void;

                /**
                 * Calls ListSubscriptions.
                 * @param request ListSubscriptionsRequest message or plain object
                 * @returns Promise
                 */
                public listSubscriptions(request: google.pubsub.v1.IListSubscriptionsRequest): Promise<google.pubsub.v1.ListSubscriptionsResponse>;

                /**
                 * Calls DeleteSubscription.
                 * @param request DeleteSubscriptionRequest message or plain object
                 * @param callback Node-style callback called with the error, if any, and Empty
                 */
                public deleteSubscription(request: google.pubsub.v1.IDeleteSubscriptionRequest, callback: google.pubsub.v1.Subscriber.DeleteSubscriptionCallback): void;

                /**
                 * Calls DeleteSubscription.
                 * @param request DeleteSubscriptionRequest message or plain object
                 * @returns Promise
                 */
                public deleteSubscription(request: google.pubsub.v1.IDeleteSubscriptionRequest): Promise<google.protobuf.Empty>;

                /**
                 * Calls ModifyAckDeadline.
                 * @param request ModifyAckDeadlineRequest message or plain object
                 * @param callback Node-style callback called with the error, if any, and Empty
                 */
                public modifyAckDeadline(request: google.pubsub.v1.IModifyAckDeadlineRequest, callback: google.pubsub.v1.Subscriber.ModifyAckDeadlineCallback): void;

                /**
                 * Calls ModifyAckDeadline.
                 * @param request ModifyAckDeadlineRequest message or plain object
                 * @returns Promise
                 */
                public modifyAckDeadline(request: google.pubsub.v1.IModifyAckDeadlineRequest): Promise<google.protobuf.Empty>;

                /**
                 * Calls Acknowledge.
                 * @param request AcknowledgeRequest message or plain object
                 * @param callback Node-style callback called with the error, if any, and Empty
                 */
                public acknowledge(request: google.pubsub.v1.IAcknowledgeRequest, callback: google.pubsub.v1.Subscriber.AcknowledgeCallback): void;

                /**
                 * Calls Acknowledge.
                 * @param request AcknowledgeRequest message or plain object
                 * @returns Promise
                 */
                public acknowledge(request: google.pubsub.v1.IAcknowledgeRequest): Promise<google.protobuf.Empty>;

                /**
                 * Calls Pull.
                 * @param request PullRequest message or plain object
                 * @param callback Node-style callback called with the error, if any, and PullResponse
                 */
                public pull(request: google.pubsub.v1.IPullRequest, callback: google.pubsub.v1.Subscriber.PullCallback): void;

                /**
                 * Calls Pull.
                 * @param request PullRequest message or plain object
                 * @returns Promise
                 */
                public pull(request: google.pubsub.v1.IPullRequest): Promise<google.pubsub.v1.PullResponse>;

                /**
                 * Calls StreamingPull.
                 * @param request StreamingPullRequest message or plain object
                 * @param callback Node-style callback called with the error, if any, and StreamingPullResponse
                 */
                public streamingPull(request: google.pubsub.v1.IStreamingPullRequest, callback: google.pubsub.v1.Subscriber.StreamingPullCallback): void;

                /**
                 * Calls StreamingPull.
                 * @param request StreamingPullRequest message or plain object
                 * @returns Promise
                 */
                public streamingPull(request: google.pubsub.v1.IStreamingPullRequest): Promise<google.pubsub.v1.StreamingPullResponse>;

                /**
                 * Calls ModifyPushConfig.
                 * @param request ModifyPushConfigRequest message or plain object
                 * @param callback Node-style callback called with the error, if any, and Empty
                 */
                public modifyPushConfig(request: google.pubsub.v1.IModifyPushConfigRequest, callback: google.pubsub.v1.Subscriber.ModifyPushConfigCallback): void;

                /**
                 * Calls ModifyPushConfig.
                 * @param request ModifyPushConfigRequest message or plain object
                 * @returns Promise
                 */
                public modifyPushConfig(request: google.pubsub.v1.IModifyPushConfigRequest): Promise<google.protobuf.Empty>;

                /**
                 * Calls GetSnapshot.
                 * @param request GetSnapshotRequest message or plain object
                 * @param callback Node-style callback called with the error, if any, and Snapshot
                 */
                public getSnapshot(request: google.pubsub.v1.IGetSnapshotRequest, callback: google.pubsub.v1.Subscriber.GetSnapshotCallback): void;

                /**
                 * Calls GetSnapshot.
                 * @param request GetSnapshotRequest message or plain object
                 * @returns Promise
                 */
                public getSnapshot(request: google.pubsub.v1.IGetSnapshotRequest): Promise<google.pubsub.v1.Snapshot>;

                /**
                 * Calls ListSnapshots.
                 * @param request ListSnapshotsRequest message or plain object
                 * @param callback Node-style callback called with the error, if any, and ListSnapshotsResponse
                 */
                public listSnapshots(request: google.pubsub.v1.IListSnapshotsRequest, callback: google.pubsub.v1.Subscriber.ListSnapshotsCallback): void;

                /**
                 * Calls ListSnapshots.
                 * @param request ListSnapshotsRequest message or plain object
                 * @returns Promise
                 */
                public listSnapshots(request: google.pubsub.v1.IListSnapshotsRequest): Promise<google.pubsub.v1.ListSnapshotsResponse>;

                /**
                 * Calls CreateSnapshot.
                 * @param request CreateSnapshotRequest message or plain object
                 * @param callback Node-style callback called with the error, if any, and Snapshot
                 */
                public createSnapshot(request: google.pubsub.v1.ICreateSnapshotRequest, callback: google.pubsub.v1.Subscriber.CreateSnapshotCallback): void;

                /**
                 * Calls CreateSnapshot.
                 * @param request CreateSnapshotRequest message or plain object
                 * @returns Promise
                 */
                public createSnapshot(request: google.pubsub.v1.ICreateSnapshotRequest): Promise<google.pubsub.v1.Snapshot>;

                /**
                 * Calls UpdateSnapshot.
                 * @param request UpdateSnapshotRequest message or plain object
                 * @param callback Node-style callback called with the error, if any, and Snapshot
                 */
                public updateSnapshot(request: google.pubsub.v1.IUpdateSnapshotRequest, callback: google.pubsub.v1.Subscriber.UpdateSnapshotCallback): void;

                /**
                 * Calls UpdateSnapshot.
                 * @param request UpdateSnapshotRequest message or plain object
                 * @returns Promise
                 */
                public updateSnapshot(request: google.pubsub.v1.IUpdateSnapshotRequest): Promise<google.pubsub.v1.Snapshot>;

                /**
                 * Calls DeleteSnapshot.
                 * @param request DeleteSnapshotRequest message or plain object
                 * @param callback Node-style callback called with the error, if any, and Empty
                 */
                public deleteSnapshot(request: google.pubsub.v1.IDeleteSnapshotRequest, callback: google.pubsub.v1.Subscriber.DeleteSnapshotCallback): void;

                /**
                 * Calls DeleteSnapshot.
                 * @param request DeleteSnapshotRequest message or plain object
                 * @returns Promise
                 */
                public deleteSnapshot(request: google.pubsub.v1.IDeleteSnapshotRequest): Promise<google.protobuf.Empty>;

                /**
                 * Calls Seek.
                 * @param request SeekRequest message or plain object
                 * @param callback Node-style callback called with the error, if any, and SeekResponse
                 */
                public seek(request: google.pubsub.v1.ISeekRequest, callback: google.pubsub.v1.Subscriber.SeekCallback): void;

                /**
                 * Calls Seek.
                 * @param request SeekRequest message or plain object
                 * @returns Promise
                 */
                public seek(request: google.pubsub.v1.ISeekRequest): Promise<google.pubsub.v1.SeekResponse>;
            }

            namespace Subscriber {

                /**
                 * Callback as used by {@link google.pubsub.v1.Subscriber#createSubscription}.
                 * @param error Error, if any
                 * @param [response] Subscription
                 */
                type CreateSubscriptionCallback = (error: (Error|null), response?: google.pubsub.v1.Subscription) => void;

                /**
                 * Callback as used by {@link google.pubsub.v1.Subscriber#getSubscription}.
                 * @param error Error, if any
                 * @param [response] Subscription
                 */
                type GetSubscriptionCallback = (error: (Error|null), response?: google.pubsub.v1.Subscription) => void;

                /**
                 * Callback as used by {@link google.pubsub.v1.Subscriber#updateSubscription}.
                 * @param error Error, if any
                 * @param [response] Subscription
                 */
                type UpdateSubscriptionCallback = (error: (Error|null), response?: google.pubsub.v1.Subscription) => void;

                /**
                 * Callback as used by {@link google.pubsub.v1.Subscriber#listSubscriptions}.
                 * @param error Error, if any
                 * @param [response] ListSubscriptionsResponse
                 */
                type ListSubscriptionsCallback = (error: (Error|null), response?: google.pubsub.v1.ListSubscriptionsResponse) => void;

                /**
                 * Callback as used by {@link google.pubsub.v1.Subscriber#deleteSubscription}.
                 * @param error Error, if any
                 * @param [response] Empty
                 */
                type DeleteSubscriptionCallback = (error: (Error|null), response?: google.protobuf.Empty) => void;

                /**
                 * Callback as used by {@link google.pubsub.v1.Subscriber#modifyAckDeadline}.
                 * @param error Error, if any
                 * @param [response] Empty
                 */
                type ModifyAckDeadlineCallback = (error: (Error|null), response?: google.protobuf.Empty) => void;

                /**
                 * Callback as used by {@link google.pubsub.v1.Subscriber#acknowledge}.
                 * @param error Error, if any
                 * @param [response] Empty
                 */
                type AcknowledgeCallback = (error: (Error|null), response?: google.protobuf.Empty) => void;

                /**
                 * Callback as used by {@link google.pubsub.v1.Subscriber#pull}.
                 * @param error Error, if any
                 * @param [response] PullResponse
                 */
                type PullCallback = (error: (Error|null), response?: google.pubsub.v1.PullResponse) => void;

                /**
                 * Callback as used by {@link google.pubsub.v1.Subscriber#streamingPull}.
                 * @param error Error, if any
                 * @param [response] StreamingPullResponse
                 */
                type StreamingPullCallback = (error: (Error|null), response?: google.pubsub.v1.StreamingPullResponse) => void;

                /**
                 * Callback as used by {@link google.pubsub.v1.Subscriber#modifyPushConfig}.
                 * @param error Error, if any
                 * @param [response] Empty
                 */
                type ModifyPushConfigCallback = (error: (Error|null), response?: google.protobuf.Empty) => void;

                /**
                 * Callback as used by {@link google.pubsub.v1.Subscriber#getSnapshot}.
                 * @param error Error, if any
                 * @param [response] Snapshot
                 */
                type GetSnapshotCallback = (error: (Error|null), response?: google.pubsub.v1.Snapshot) => void;

                /**
                 * Callback as used by {@link google.pubsub.v1.Subscriber#listSnapshots}.
                 * @param error Error, if any
                 * @param [response] ListSnapshotsResponse
                 */
                type ListSnapshotsCallback = (error: (Error|null), response?: google.pubsub.v1.ListSnapshotsResponse) => void;

                /**
                 * Callback as used by {@link google.pubsub.v1.Subscriber#createSnapshot}.
                 * @param error Error, if any
                 * @param [response] Snapshot
                 */
                type CreateSnapshotCallback = (error: (Error|null), response?: google.pubsub.v1.Snapshot) => void;

                /**
                 * Callback as used by {@link google.pubsub.v1.Subscriber#updateSnapshot}.
                 * @param error Error, if any
                 * @param [response] Snapshot
                 */
                type UpdateSnapshotCallback = (error: (Error|null), response?: google.pubsub.v1.Snapshot) => void;

                /**
                 * Callback as used by {@link google.pubsub.v1.Subscriber#deleteSnapshot}.
                 * @param error Error, if any
                 * @param [response] Empty
                 */
                type DeleteSnapshotCallback = (error: (Error|null), response?: google.protobuf.Empty) => void;

                /**
                 * Callback as used by {@link google.pubsub.v1.Subscriber#seek}.
                 * @param error Error, if any
                 * @param [response] SeekResponse
                 */
                type SeekCallback = (error: (Error|null), response?: google.pubsub.v1.SeekResponse) => void;
            }

            /** Properties of a Subscription. */
            interface ISubscription {

                /** Subscription name */
                name?: (string|null);

                /** Subscription topic */
                topic?: (string|null);

                /** Subscription pushConfig */
                pushConfig?: (google.pubsub.v1.IPushConfig|null);

                /** Subscription ackDeadlineSeconds */
                ackDeadlineSeconds?: (number|null);

                /** Subscription retainAckedMessages */
                retainAckedMessages?: (boolean|null);

                /** Subscription messageRetentionDuration */
                messageRetentionDuration?: (google.protobuf.IDuration|null);

                /** Subscription labels */
                labels?: ({ [k: string]: string }|null);

                /** Subscription enableMessageOrdering */
                enableMessageOrdering?: (boolean|null);

                /** Subscription expirationPolicy */
                expirationPolicy?: (google.pubsub.v1.IExpirationPolicy|null);

                /** Subscription filter */
                filter?: (string|null);

                /** Subscription deadLetterPolicy */
                deadLetterPolicy?: (google.pubsub.v1.IDeadLetterPolicy|null);

                /** Subscription retryPolicy */
                retryPolicy?: (google.pubsub.v1.IRetryPolicy|null);

                /** Subscription detached */
                detached?: (boolean|null);

                /** Subscription topicMessageRetentionDuration */
                topicMessageRetentionDuration?: (google.protobuf.IDuration|null);
            }

            /** Represents a Subscription. */
            class Subscription implements ISubscription {

                /**
                 * Constructs a new Subscription.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.pubsub.v1.ISubscription);

                /** Subscription name. */
                public name: string;

                /** Subscription topic. */
                public topic: string;

                /** Subscription pushConfig. */
                public pushConfig?: (google.pubsub.v1.IPushConfig|null);

                /** Subscription ackDeadlineSeconds. */
                public ackDeadlineSeconds: number;

                /** Subscription retainAckedMessages. */
                public retainAckedMessages: boolean;

                /** Subscription messageRetentionDuration. */
                public messageRetentionDuration?: (google.protobuf.IDuration|null);

                /** Subscription labels. */
                public labels: { [k: string]: string };

                /** Subscription enableMessageOrdering. */
                public enableMessageOrdering: boolean;

                /** Subscription expirationPolicy. */
                public expirationPolicy?: (google.pubsub.v1.IExpirationPolicy|null);

                /** Subscription filter. */
                public filter: string;

                /** Subscription deadLetterPolicy. */
                public deadLetterPolicy?: (google.pubsub.v1.IDeadLetterPolicy|null);

                /** Subscription retryPolicy. */
                public retryPolicy?: (google.pubsub.v1.IRetryPolicy|null);

                /** Subscription detached. */
                public detached: boolean;

                /** Subscription topicMessageRetentionDuration. */
                public topicMessageRetentionDuration?: (google.protobuf.IDuration|null);

                /**
                 * Creates a new Subscription instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Subscription instance
                 */
                public static create(properties?: google.pubsub.v1.ISubscription): google.pubsub.v1.Subscription;

                /**
                 * Encodes the specified Subscription message. Does not implicitly {@link google.pubsub.v1.Subscription.verify|verify} messages.
                 * @param message Subscription message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.pubsub.v1.ISubscription, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Subscription message, length delimited. Does not implicitly {@link google.pubsub.v1.Subscription.verify|verify} messages.
                 * @param message Subscription message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.pubsub.v1.ISubscription, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Subscription message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Subscription
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.pubsub.v1.Subscription;

                /**
                 * Decodes a Subscription message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Subscription
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.pubsub.v1.Subscription;

                /**
                 * Verifies a Subscription message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Subscription message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Subscription
                 */
                public static fromObject(object: { [k: string]: any }): google.pubsub.v1.Subscription;

                /**
                 * Creates a plain object from a Subscription message. Also converts values to other types if specified.
                 * @param message Subscription
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.pubsub.v1.Subscription, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Subscription to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a RetryPolicy. */
            interface IRetryPolicy {

                /** RetryPolicy minimumBackoff */
                minimumBackoff?: (google.protobuf.IDuration|null);

                /** RetryPolicy maximumBackoff */
                maximumBackoff?: (google.protobuf.IDuration|null);
            }

            /** Represents a RetryPolicy. */
            class RetryPolicy implements IRetryPolicy {

                /**
                 * Constructs a new RetryPolicy.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.pubsub.v1.IRetryPolicy);

                /** RetryPolicy minimumBackoff. */
                public minimumBackoff?: (google.protobuf.IDuration|null);

                /** RetryPolicy maximumBackoff. */
                public maximumBackoff?: (google.protobuf.IDuration|null);

                /**
                 * Creates a new RetryPolicy instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns RetryPolicy instance
                 */
                public static create(properties?: google.pubsub.v1.IRetryPolicy): google.pubsub.v1.RetryPolicy;

                /**
                 * Encodes the specified RetryPolicy message. Does not implicitly {@link google.pubsub.v1.RetryPolicy.verify|verify} messages.
                 * @param message RetryPolicy message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.pubsub.v1.IRetryPolicy, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified RetryPolicy message, length delimited. Does not implicitly {@link google.pubsub.v1.RetryPolicy.verify|verify} messages.
                 * @param message RetryPolicy message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.pubsub.v1.IRetryPolicy, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a RetryPolicy message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns RetryPolicy
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.pubsub.v1.RetryPolicy;

                /**
                 * Decodes a RetryPolicy message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns RetryPolicy
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.pubsub.v1.RetryPolicy;

                /**
                 * Verifies a RetryPolicy message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a RetryPolicy message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns RetryPolicy
                 */
                public static fromObject(object: { [k: string]: any }): google.pubsub.v1.RetryPolicy;

                /**
                 * Creates a plain object from a RetryPolicy message. Also converts values to other types if specified.
                 * @param message RetryPolicy
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.pubsub.v1.RetryPolicy, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this RetryPolicy to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a DeadLetterPolicy. */
            interface IDeadLetterPolicy {

                /** DeadLetterPolicy deadLetterTopic */
                deadLetterTopic?: (string|null);

                /** DeadLetterPolicy maxDeliveryAttempts */
                maxDeliveryAttempts?: (number|null);
            }

            /** Represents a DeadLetterPolicy. */
            class DeadLetterPolicy implements IDeadLetterPolicy {

                /**
                 * Constructs a new DeadLetterPolicy.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.pubsub.v1.IDeadLetterPolicy);

                /** DeadLetterPolicy deadLetterTopic. */
                public deadLetterTopic: string;

                /** DeadLetterPolicy maxDeliveryAttempts. */
                public maxDeliveryAttempts: number;

                /**
                 * Creates a new DeadLetterPolicy instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns DeadLetterPolicy instance
                 */
                public static create(properties?: google.pubsub.v1.IDeadLetterPolicy): google.pubsub.v1.DeadLetterPolicy;

                /**
                 * Encodes the specified DeadLetterPolicy message. Does not implicitly {@link google.pubsub.v1.DeadLetterPolicy.verify|verify} messages.
                 * @param message DeadLetterPolicy message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.pubsub.v1.IDeadLetterPolicy, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified DeadLetterPolicy message, length delimited. Does not implicitly {@link google.pubsub.v1.DeadLetterPolicy.verify|verify} messages.
                 * @param message DeadLetterPolicy message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.pubsub.v1.IDeadLetterPolicy, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a DeadLetterPolicy message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns DeadLetterPolicy
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.pubsub.v1.DeadLetterPolicy;

                /**
                 * Decodes a DeadLetterPolicy message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns DeadLetterPolicy
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.pubsub.v1.DeadLetterPolicy;

                /**
                 * Verifies a DeadLetterPolicy message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a DeadLetterPolicy message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns DeadLetterPolicy
                 */
                public static fromObject(object: { [k: string]: any }): google.pubsub.v1.DeadLetterPolicy;

                /**
                 * Creates a plain object from a DeadLetterPolicy message. Also converts values to other types if specified.
                 * @param message DeadLetterPolicy
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.pubsub.v1.DeadLetterPolicy, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this DeadLetterPolicy to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of an ExpirationPolicy. */
            interface IExpirationPolicy {

                /** ExpirationPolicy ttl */
                ttl?: (google.protobuf.IDuration|null);
            }

            /** Represents an ExpirationPolicy. */
            class ExpirationPolicy implements IExpirationPolicy {

                /**
                 * Constructs a new ExpirationPolicy.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.pubsub.v1.IExpirationPolicy);

                /** ExpirationPolicy ttl. */
                public ttl?: (google.protobuf.IDuration|null);

                /**
                 * Creates a new ExpirationPolicy instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns ExpirationPolicy instance
                 */
                public static create(properties?: google.pubsub.v1.IExpirationPolicy): google.pubsub.v1.ExpirationPolicy;

                /**
                 * Encodes the specified ExpirationPolicy message. Does not implicitly {@link google.pubsub.v1.ExpirationPolicy.verify|verify} messages.
                 * @param message ExpirationPolicy message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.pubsub.v1.IExpirationPolicy, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ExpirationPolicy message, length delimited. Does not implicitly {@link google.pubsub.v1.ExpirationPolicy.verify|verify} messages.
                 * @param message ExpirationPolicy message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.pubsub.v1.IExpirationPolicy, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an ExpirationPolicy message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns ExpirationPolicy
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.pubsub.v1.ExpirationPolicy;

                /**
                 * Decodes an ExpirationPolicy message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns ExpirationPolicy
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.pubsub.v1.ExpirationPolicy;

                /**
                 * Verifies an ExpirationPolicy message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an ExpirationPolicy message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns ExpirationPolicy
                 */
                public static fromObject(object: { [k: string]: any }): google.pubsub.v1.ExpirationPolicy;

                /**
                 * Creates a plain object from an ExpirationPolicy message. Also converts values to other types if specified.
                 * @param message ExpirationPolicy
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.pubsub.v1.ExpirationPolicy, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this ExpirationPolicy to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a PushConfig. */
            interface IPushConfig {

                /** PushConfig pushEndpoint */
                pushEndpoint?: (string|null);

                /** PushConfig attributes */
                attributes?: ({ [k: string]: string }|null);

                /** PushConfig oidcToken */
                oidcToken?: (google.pubsub.v1.PushConfig.IOidcToken|null);
            }

            /** Represents a PushConfig. */
            class PushConfig implements IPushConfig {

                /**
                 * Constructs a new PushConfig.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.pubsub.v1.IPushConfig);

                /** PushConfig pushEndpoint. */
                public pushEndpoint: string;

                /** PushConfig attributes. */
                public attributes: { [k: string]: string };

                /** PushConfig oidcToken. */
                public oidcToken?: (google.pubsub.v1.PushConfig.IOidcToken|null);

                /** PushConfig authenticationMethod. */
                public authenticationMethod?: "oidcToken";

                /**
                 * Creates a new PushConfig instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns PushConfig instance
                 */
                public static create(properties?: google.pubsub.v1.IPushConfig): google.pubsub.v1.PushConfig;

                /**
                 * Encodes the specified PushConfig message. Does not implicitly {@link google.pubsub.v1.PushConfig.verify|verify} messages.
                 * @param message PushConfig message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.pubsub.v1.IPushConfig, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified PushConfig message, length delimited. Does not implicitly {@link google.pubsub.v1.PushConfig.verify|verify} messages.
                 * @param message PushConfig message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.pubsub.v1.IPushConfig, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a PushConfig message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns PushConfig
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.pubsub.v1.PushConfig;

                /**
                 * Decodes a PushConfig message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns PushConfig
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.pubsub.v1.PushConfig;

                /**
                 * Verifies a PushConfig message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a PushConfig message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns PushConfig
                 */
                public static fromObject(object: { [k: string]: any }): google.pubsub.v1.PushConfig;

                /**
                 * Creates a plain object from a PushConfig message. Also converts values to other types if specified.
                 * @param message PushConfig
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.pubsub.v1.PushConfig, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this PushConfig to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            namespace PushConfig {

                /** Properties of an OidcToken. */
                interface IOidcToken {

                    /** OidcToken serviceAccountEmail */
                    serviceAccountEmail?: (string|null);

                    /** OidcToken audience */
                    audience?: (string|null);
                }

                /** Represents an OidcToken. */
                class OidcToken implements IOidcToken {

                    /**
                     * Constructs a new OidcToken.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: google.pubsub.v1.PushConfig.IOidcToken);

                    /** OidcToken serviceAccountEmail. */
                    public serviceAccountEmail: string;

                    /** OidcToken audience. */
                    public audience: string;

                    /**
                     * Creates a new OidcToken instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns OidcToken instance
                     */
                    public static create(properties?: google.pubsub.v1.PushConfig.IOidcToken): google.pubsub.v1.PushConfig.OidcToken;

                    /**
                     * Encodes the specified OidcToken message. Does not implicitly {@link google.pubsub.v1.PushConfig.OidcToken.verify|verify} messages.
                     * @param message OidcToken message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: google.pubsub.v1.PushConfig.IOidcToken, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified OidcToken message, length delimited. Does not implicitly {@link google.pubsub.v1.PushConfig.OidcToken.verify|verify} messages.
                     * @param message OidcToken message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: google.pubsub.v1.PushConfig.IOidcToken, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes an OidcToken message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns OidcToken
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.pubsub.v1.PushConfig.OidcToken;

                    /**
                     * Decodes an OidcToken message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns OidcToken
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.pubsub.v1.PushConfig.OidcToken;

                    /**
                     * Verifies an OidcToken message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates an OidcToken message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns OidcToken
                     */
                    public static fromObject(object: { [k: string]: any }): google.pubsub.v1.PushConfig.OidcToken;

                    /**
                     * Creates a plain object from an OidcToken message. Also converts values to other types if specified.
                     * @param message OidcToken
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: google.pubsub.v1.PushConfig.OidcToken, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this OidcToken to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }
            }

            /** Properties of a ReceivedMessage. */
            interface IReceivedMessage {

                /** ReceivedMessage ackId */
                ackId?: (string|null);

                /** ReceivedMessage message */
                message?: (google.pubsub.v1.IPubsubMessage|null);

                /** ReceivedMessage deliveryAttempt */
                deliveryAttempt?: (number|null);
            }

            /** Represents a ReceivedMessage. */
            class ReceivedMessage implements IReceivedMessage {

                /**
                 * Constructs a new ReceivedMessage.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.pubsub.v1.IReceivedMessage);

                /** ReceivedMessage ackId. */
                public ackId: string;

                /** ReceivedMessage message. */
                public message?: (google.pubsub.v1.IPubsubMessage|null);

                /** ReceivedMessage deliveryAttempt. */
                public deliveryAttempt: number;

                /**
                 * Creates a new ReceivedMessage instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns ReceivedMessage instance
                 */
                public static create(properties?: google.pubsub.v1.IReceivedMessage): google.pubsub.v1.ReceivedMessage;

                /**
                 * Encodes the specified ReceivedMessage message. Does not implicitly {@link google.pubsub.v1.ReceivedMessage.verify|verify} messages.
                 * @param message ReceivedMessage message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.pubsub.v1.IReceivedMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ReceivedMessage message, length delimited. Does not implicitly {@link google.pubsub.v1.ReceivedMessage.verify|verify} messages.
                 * @param message ReceivedMessage message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.pubsub.v1.IReceivedMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a ReceivedMessage message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns ReceivedMessage
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.pubsub.v1.ReceivedMessage;

                /**
                 * Decodes a ReceivedMessage message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns ReceivedMessage
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.pubsub.v1.ReceivedMessage;

                /**
                 * Verifies a ReceivedMessage message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a ReceivedMessage message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns ReceivedMessage
                 */
                public static fromObject(object: { [k: string]: any }): google.pubsub.v1.ReceivedMessage;

                /**
                 * Creates a plain object from a ReceivedMessage message. Also converts values to other types if specified.
                 * @param message ReceivedMessage
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.pubsub.v1.ReceivedMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this ReceivedMessage to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a GetSubscriptionRequest. */
            interface IGetSubscriptionRequest {

                /** GetSubscriptionRequest subscription */
                subscription?: (string|null);
            }

            /** Represents a GetSubscriptionRequest. */
            class GetSubscriptionRequest implements IGetSubscriptionRequest {

                /**
                 * Constructs a new GetSubscriptionRequest.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.pubsub.v1.IGetSubscriptionRequest);

                /** GetSubscriptionRequest subscription. */
                public subscription: string;

                /**
                 * Creates a new GetSubscriptionRequest instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns GetSubscriptionRequest instance
                 */
                public static create(properties?: google.pubsub.v1.IGetSubscriptionRequest): google.pubsub.v1.GetSubscriptionRequest;

                /**
                 * Encodes the specified GetSubscriptionRequest message. Does not implicitly {@link google.pubsub.v1.GetSubscriptionRequest.verify|verify} messages.
                 * @param message GetSubscriptionRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.pubsub.v1.IGetSubscriptionRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified GetSubscriptionRequest message, length delimited. Does not implicitly {@link google.pubsub.v1.GetSubscriptionRequest.verify|verify} messages.
                 * @param message GetSubscriptionRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.pubsub.v1.IGetSubscriptionRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a GetSubscriptionRequest message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns GetSubscriptionRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.pubsub.v1.GetSubscriptionRequest;

                /**
                 * Decodes a GetSubscriptionRequest message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns GetSubscriptionRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.pubsub.v1.GetSubscriptionRequest;

                /**
                 * Verifies a GetSubscriptionRequest message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a GetSubscriptionRequest message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns GetSubscriptionRequest
                 */
                public static fromObject(object: { [k: string]: any }): google.pubsub.v1.GetSubscriptionRequest;

                /**
                 * Creates a plain object from a GetSubscriptionRequest message. Also converts values to other types if specified.
                 * @param message GetSubscriptionRequest
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.pubsub.v1.GetSubscriptionRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this GetSubscriptionRequest to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of an UpdateSubscriptionRequest. */
            interface IUpdateSubscriptionRequest {

                /** UpdateSubscriptionRequest subscription */
                subscription?: (google.pubsub.v1.ISubscription|null);

                /** UpdateSubscriptionRequest updateMask */
                updateMask?: (google.protobuf.IFieldMask|null);
            }

            /** Represents an UpdateSubscriptionRequest. */
            class UpdateSubscriptionRequest implements IUpdateSubscriptionRequest {

                /**
                 * Constructs a new UpdateSubscriptionRequest.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.pubsub.v1.IUpdateSubscriptionRequest);

                /** UpdateSubscriptionRequest subscription. */
                public subscription?: (google.pubsub.v1.ISubscription|null);

                /** UpdateSubscriptionRequest updateMask. */
                public updateMask?: (google.protobuf.IFieldMask|null);

                /**
                 * Creates a new UpdateSubscriptionRequest instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns UpdateSubscriptionRequest instance
                 */
                public static create(properties?: google.pubsub.v1.IUpdateSubscriptionRequest): google.pubsub.v1.UpdateSubscriptionRequest;

                /**
                 * Encodes the specified UpdateSubscriptionRequest message. Does not implicitly {@link google.pubsub.v1.UpdateSubscriptionRequest.verify|verify} messages.
                 * @param message UpdateSubscriptionRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.pubsub.v1.IUpdateSubscriptionRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified UpdateSubscriptionRequest message, length delimited. Does not implicitly {@link google.pubsub.v1.UpdateSubscriptionRequest.verify|verify} messages.
                 * @param message UpdateSubscriptionRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.pubsub.v1.IUpdateSubscriptionRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an UpdateSubscriptionRequest message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns UpdateSubscriptionRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.pubsub.v1.UpdateSubscriptionRequest;

                /**
                 * Decodes an UpdateSubscriptionRequest message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns UpdateSubscriptionRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.pubsub.v1.UpdateSubscriptionRequest;

                /**
                 * Verifies an UpdateSubscriptionRequest message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an UpdateSubscriptionRequest message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns UpdateSubscriptionRequest
                 */
                public static fromObject(object: { [k: string]: any }): google.pubsub.v1.UpdateSubscriptionRequest;

                /**
                 * Creates a plain object from an UpdateSubscriptionRequest message. Also converts values to other types if specified.
                 * @param message UpdateSubscriptionRequest
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.pubsub.v1.UpdateSubscriptionRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this UpdateSubscriptionRequest to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a ListSubscriptionsRequest. */
            interface IListSubscriptionsRequest {

                /** ListSubscriptionsRequest project */
                project?: (string|null);

                /** ListSubscriptionsRequest pageSize */
                pageSize?: (number|null);

                /** ListSubscriptionsRequest pageToken */
                pageToken?: (string|null);
            }

            /** Represents a ListSubscriptionsRequest. */
            class ListSubscriptionsRequest implements IListSubscriptionsRequest {

                /**
                 * Constructs a new ListSubscriptionsRequest.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.pubsub.v1.IListSubscriptionsRequest);

                /** ListSubscriptionsRequest project. */
                public project: string;

                /** ListSubscriptionsRequest pageSize. */
                public pageSize: number;

                /** ListSubscriptionsRequest pageToken. */
                public pageToken: string;

                /**
                 * Creates a new ListSubscriptionsRequest instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns ListSubscriptionsRequest instance
                 */
                public static create(properties?: google.pubsub.v1.IListSubscriptionsRequest): google.pubsub.v1.ListSubscriptionsRequest;

                /**
                 * Encodes the specified ListSubscriptionsRequest message. Does not implicitly {@link google.pubsub.v1.ListSubscriptionsRequest.verify|verify} messages.
                 * @param message ListSubscriptionsRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.pubsub.v1.IListSubscriptionsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ListSubscriptionsRequest message, length delimited. Does not implicitly {@link google.pubsub.v1.ListSubscriptionsRequest.verify|verify} messages.
                 * @param message ListSubscriptionsRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.pubsub.v1.IListSubscriptionsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a ListSubscriptionsRequest message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns ListSubscriptionsRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.pubsub.v1.ListSubscriptionsRequest;

                /**
                 * Decodes a ListSubscriptionsRequest message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns ListSubscriptionsRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.pubsub.v1.ListSubscriptionsRequest;

                /**
                 * Verifies a ListSubscriptionsRequest message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a ListSubscriptionsRequest message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns ListSubscriptionsRequest
                 */
                public static fromObject(object: { [k: string]: any }): google.pubsub.v1.ListSubscriptionsRequest;

                /**
                 * Creates a plain object from a ListSubscriptionsRequest message. Also converts values to other types if specified.
                 * @param message ListSubscriptionsRequest
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.pubsub.v1.ListSubscriptionsRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this ListSubscriptionsRequest to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a ListSubscriptionsResponse. */
            interface IListSubscriptionsResponse {

                /** ListSubscriptionsResponse subscriptions */
                subscriptions?: (google.pubsub.v1.ISubscription[]|null);

                /** ListSubscriptionsResponse nextPageToken */
                nextPageToken?: (string|null);
            }

            /** Represents a ListSubscriptionsResponse. */
            class ListSubscriptionsResponse implements IListSubscriptionsResponse {

                /**
                 * Constructs a new ListSubscriptionsResponse.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.pubsub.v1.IListSubscriptionsResponse);

                /** ListSubscriptionsResponse subscriptions. */
                public subscriptions: google.pubsub.v1.ISubscription[];

                /** ListSubscriptionsResponse nextPageToken. */
                public nextPageToken: string;

                /**
                 * Creates a new ListSubscriptionsResponse instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns ListSubscriptionsResponse instance
                 */
                public static create(properties?: google.pubsub.v1.IListSubscriptionsResponse): google.pubsub.v1.ListSubscriptionsResponse;

                /**
                 * Encodes the specified ListSubscriptionsResponse message. Does not implicitly {@link google.pubsub.v1.ListSubscriptionsResponse.verify|verify} messages.
                 * @param message ListSubscriptionsResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.pubsub.v1.IListSubscriptionsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ListSubscriptionsResponse message, length delimited. Does not implicitly {@link google.pubsub.v1.ListSubscriptionsResponse.verify|verify} messages.
                 * @param message ListSubscriptionsResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.pubsub.v1.IListSubscriptionsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a ListSubscriptionsResponse message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns ListSubscriptionsResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.pubsub.v1.ListSubscriptionsResponse;

                /**
                 * Decodes a ListSubscriptionsResponse message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns ListSubscriptionsResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.pubsub.v1.ListSubscriptionsResponse;

                /**
                 * Verifies a ListSubscriptionsResponse message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a ListSubscriptionsResponse message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns ListSubscriptionsResponse
                 */
                public static fromObject(object: { [k: string]: any }): google.pubsub.v1.ListSubscriptionsResponse;

                /**
                 * Creates a plain object from a ListSubscriptionsResponse message. Also converts values to other types if specified.
                 * @param message ListSubscriptionsResponse
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.pubsub.v1.ListSubscriptionsResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this ListSubscriptionsResponse to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a DeleteSubscriptionRequest. */
            interface IDeleteSubscriptionRequest {

                /** DeleteSubscriptionRequest subscription */
                subscription?: (string|null);
            }

            /** Represents a DeleteSubscriptionRequest. */
            class DeleteSubscriptionRequest implements IDeleteSubscriptionRequest {

                /**
                 * Constructs a new DeleteSubscriptionRequest.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.pubsub.v1.IDeleteSubscriptionRequest);

                /** DeleteSubscriptionRequest subscription. */
                public subscription: string;

                /**
                 * Creates a new DeleteSubscriptionRequest instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns DeleteSubscriptionRequest instance
                 */
                public static create(properties?: google.pubsub.v1.IDeleteSubscriptionRequest): google.pubsub.v1.DeleteSubscriptionRequest;

                /**
                 * Encodes the specified DeleteSubscriptionRequest message. Does not implicitly {@link google.pubsub.v1.DeleteSubscriptionRequest.verify|verify} messages.
                 * @param message DeleteSubscriptionRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.pubsub.v1.IDeleteSubscriptionRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified DeleteSubscriptionRequest message, length delimited. Does not implicitly {@link google.pubsub.v1.DeleteSubscriptionRequest.verify|verify} messages.
                 * @param message DeleteSubscriptionRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.pubsub.v1.IDeleteSubscriptionRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a DeleteSubscriptionRequest message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns DeleteSubscriptionRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.pubsub.v1.DeleteSubscriptionRequest;

                /**
                 * Decodes a DeleteSubscriptionRequest message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns DeleteSubscriptionRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.pubsub.v1.DeleteSubscriptionRequest;

                /**
                 * Verifies a DeleteSubscriptionRequest message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a DeleteSubscriptionRequest message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns DeleteSubscriptionRequest
                 */
                public static fromObject(object: { [k: string]: any }): google.pubsub.v1.DeleteSubscriptionRequest;

                /**
                 * Creates a plain object from a DeleteSubscriptionRequest message. Also converts values to other types if specified.
                 * @param message DeleteSubscriptionRequest
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.pubsub.v1.DeleteSubscriptionRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this DeleteSubscriptionRequest to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a ModifyPushConfigRequest. */
            interface IModifyPushConfigRequest {

                /** ModifyPushConfigRequest subscription */
                subscription?: (string|null);

                /** ModifyPushConfigRequest pushConfig */
                pushConfig?: (google.pubsub.v1.IPushConfig|null);
            }

            /** Represents a ModifyPushConfigRequest. */
            class ModifyPushConfigRequest implements IModifyPushConfigRequest {

                /**
                 * Constructs a new ModifyPushConfigRequest.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.pubsub.v1.IModifyPushConfigRequest);

                /** ModifyPushConfigRequest subscription. */
                public subscription: string;

                /** ModifyPushConfigRequest pushConfig. */
                public pushConfig?: (google.pubsub.v1.IPushConfig|null);

                /**
                 * Creates a new ModifyPushConfigRequest instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns ModifyPushConfigRequest instance
                 */
                public static create(properties?: google.pubsub.v1.IModifyPushConfigRequest): google.pubsub.v1.ModifyPushConfigRequest;

                /**
                 * Encodes the specified ModifyPushConfigRequest message. Does not implicitly {@link google.pubsub.v1.ModifyPushConfigRequest.verify|verify} messages.
                 * @param message ModifyPushConfigRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.pubsub.v1.IModifyPushConfigRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ModifyPushConfigRequest message, length delimited. Does not implicitly {@link google.pubsub.v1.ModifyPushConfigRequest.verify|verify} messages.
                 * @param message ModifyPushConfigRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.pubsub.v1.IModifyPushConfigRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a ModifyPushConfigRequest message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns ModifyPushConfigRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.pubsub.v1.ModifyPushConfigRequest;

                /**
                 * Decodes a ModifyPushConfigRequest message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns ModifyPushConfigRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.pubsub.v1.ModifyPushConfigRequest;

                /**
                 * Verifies a ModifyPushConfigRequest message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a ModifyPushConfigRequest message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns ModifyPushConfigRequest
                 */
                public static fromObject(object: { [k: string]: any }): google.pubsub.v1.ModifyPushConfigRequest;

                /**
                 * Creates a plain object from a ModifyPushConfigRequest message. Also converts values to other types if specified.
                 * @param message ModifyPushConfigRequest
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.pubsub.v1.ModifyPushConfigRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this ModifyPushConfigRequest to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a PullRequest. */
            interface IPullRequest {

                /** PullRequest subscription */
                subscription?: (string|null);

                /** PullRequest returnImmediately */
                returnImmediately?: (boolean|null);

                /** PullRequest maxMessages */
                maxMessages?: (number|null);
            }

            /** Represents a PullRequest. */
            class PullRequest implements IPullRequest {

                /**
                 * Constructs a new PullRequest.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.pubsub.v1.IPullRequest);

                /** PullRequest subscription. */
                public subscription: string;

                /** PullRequest returnImmediately. */
                public returnImmediately: boolean;

                /** PullRequest maxMessages. */
                public maxMessages: number;

                /**
                 * Creates a new PullRequest instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns PullRequest instance
                 */
                public static create(properties?: google.pubsub.v1.IPullRequest): google.pubsub.v1.PullRequest;

                /**
                 * Encodes the specified PullRequest message. Does not implicitly {@link google.pubsub.v1.PullRequest.verify|verify} messages.
                 * @param message PullRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.pubsub.v1.IPullRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified PullRequest message, length delimited. Does not implicitly {@link google.pubsub.v1.PullRequest.verify|verify} messages.
                 * @param message PullRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.pubsub.v1.IPullRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a PullRequest message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns PullRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.pubsub.v1.PullRequest;

                /**
                 * Decodes a PullRequest message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns PullRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.pubsub.v1.PullRequest;

                /**
                 * Verifies a PullRequest message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a PullRequest message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns PullRequest
                 */
                public static fromObject(object: { [k: string]: any }): google.pubsub.v1.PullRequest;

                /**
                 * Creates a plain object from a PullRequest message. Also converts values to other types if specified.
                 * @param message PullRequest
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.pubsub.v1.PullRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this PullRequest to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a PullResponse. */
            interface IPullResponse {

                /** PullResponse receivedMessages */
                receivedMessages?: (google.pubsub.v1.IReceivedMessage[]|null);
            }

            /** Represents a PullResponse. */
            class PullResponse implements IPullResponse {

                /**
                 * Constructs a new PullResponse.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.pubsub.v1.IPullResponse);

                /** PullResponse receivedMessages. */
                public receivedMessages: google.pubsub.v1.IReceivedMessage[];

                /**
                 * Creates a new PullResponse instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns PullResponse instance
                 */
                public static create(properties?: google.pubsub.v1.IPullResponse): google.pubsub.v1.PullResponse;

                /**
                 * Encodes the specified PullResponse message. Does not implicitly {@link google.pubsub.v1.PullResponse.verify|verify} messages.
                 * @param message PullResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.pubsub.v1.IPullResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified PullResponse message, length delimited. Does not implicitly {@link google.pubsub.v1.PullResponse.verify|verify} messages.
                 * @param message PullResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.pubsub.v1.IPullResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a PullResponse message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns PullResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.pubsub.v1.PullResponse;

                /**
                 * Decodes a PullResponse message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns PullResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.pubsub.v1.PullResponse;

                /**
                 * Verifies a PullResponse message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a PullResponse message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns PullResponse
                 */
                public static fromObject(object: { [k: string]: any }): google.pubsub.v1.PullResponse;

                /**
                 * Creates a plain object from a PullResponse message. Also converts values to other types if specified.
                 * @param message PullResponse
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.pubsub.v1.PullResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this PullResponse to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a ModifyAckDeadlineRequest. */
            interface IModifyAckDeadlineRequest {

                /** ModifyAckDeadlineRequest subscription */
                subscription?: (string|null);

                /** ModifyAckDeadlineRequest ackIds */
                ackIds?: (string[]|null);

                /** ModifyAckDeadlineRequest ackDeadlineSeconds */
                ackDeadlineSeconds?: (number|null);
            }

            /** Represents a ModifyAckDeadlineRequest. */
            class ModifyAckDeadlineRequest implements IModifyAckDeadlineRequest {

                /**
                 * Constructs a new ModifyAckDeadlineRequest.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.pubsub.v1.IModifyAckDeadlineRequest);

                /** ModifyAckDeadlineRequest subscription. */
                public subscription: string;

                /** ModifyAckDeadlineRequest ackIds. */
                public ackIds: string[];

                /** ModifyAckDeadlineRequest ackDeadlineSeconds. */
                public ackDeadlineSeconds: number;

                /**
                 * Creates a new ModifyAckDeadlineRequest instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns ModifyAckDeadlineRequest instance
                 */
                public static create(properties?: google.pubsub.v1.IModifyAckDeadlineRequest): google.pubsub.v1.ModifyAckDeadlineRequest;

                /**
                 * Encodes the specified ModifyAckDeadlineRequest message. Does not implicitly {@link google.pubsub.v1.ModifyAckDeadlineRequest.verify|verify} messages.
                 * @param message ModifyAckDeadlineRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.pubsub.v1.IModifyAckDeadlineRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ModifyAckDeadlineRequest message, length delimited. Does not implicitly {@link google.pubsub.v1.ModifyAckDeadlineRequest.verify|verify} messages.
                 * @param message ModifyAckDeadlineRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.pubsub.v1.IModifyAckDeadlineRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a ModifyAckDeadlineRequest message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns ModifyAckDeadlineRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.pubsub.v1.ModifyAckDeadlineRequest;

                /**
                 * Decodes a ModifyAckDeadlineRequest message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns ModifyAckDeadlineRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.pubsub.v1.ModifyAckDeadlineRequest;

                /**
                 * Verifies a ModifyAckDeadlineRequest message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a ModifyAckDeadlineRequest message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns ModifyAckDeadlineRequest
                 */
                public static fromObject(object: { [k: string]: any }): google.pubsub.v1.ModifyAckDeadlineRequest;

                /**
                 * Creates a plain object from a ModifyAckDeadlineRequest message. Also converts values to other types if specified.
                 * @param message ModifyAckDeadlineRequest
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.pubsub.v1.ModifyAckDeadlineRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this ModifyAckDeadlineRequest to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of an AcknowledgeRequest. */
            interface IAcknowledgeRequest {

                /** AcknowledgeRequest subscription */
                subscription?: (string|null);

                /** AcknowledgeRequest ackIds */
                ackIds?: (string[]|null);
            }

            /** Represents an AcknowledgeRequest. */
            class AcknowledgeRequest implements IAcknowledgeRequest {

                /**
                 * Constructs a new AcknowledgeRequest.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.pubsub.v1.IAcknowledgeRequest);

                /** AcknowledgeRequest subscription. */
                public subscription: string;

                /** AcknowledgeRequest ackIds. */
                public ackIds: string[];

                /**
                 * Creates a new AcknowledgeRequest instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns AcknowledgeRequest instance
                 */
                public static create(properties?: google.pubsub.v1.IAcknowledgeRequest): google.pubsub.v1.AcknowledgeRequest;

                /**
                 * Encodes the specified AcknowledgeRequest message. Does not implicitly {@link google.pubsub.v1.AcknowledgeRequest.verify|verify} messages.
                 * @param message AcknowledgeRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.pubsub.v1.IAcknowledgeRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified AcknowledgeRequest message, length delimited. Does not implicitly {@link google.pubsub.v1.AcknowledgeRequest.verify|verify} messages.
                 * @param message AcknowledgeRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.pubsub.v1.IAcknowledgeRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an AcknowledgeRequest message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns AcknowledgeRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.pubsub.v1.AcknowledgeRequest;

                /**
                 * Decodes an AcknowledgeRequest message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns AcknowledgeRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.pubsub.v1.AcknowledgeRequest;

                /**
                 * Verifies an AcknowledgeRequest message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an AcknowledgeRequest message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns AcknowledgeRequest
                 */
                public static fromObject(object: { [k: string]: any }): google.pubsub.v1.AcknowledgeRequest;

                /**
                 * Creates a plain object from an AcknowledgeRequest message. Also converts values to other types if specified.
                 * @param message AcknowledgeRequest
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.pubsub.v1.AcknowledgeRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this AcknowledgeRequest to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a StreamingPullRequest. */
            interface IStreamingPullRequest {

                /** StreamingPullRequest subscription */
                subscription?: (string|null);

                /** StreamingPullRequest ackIds */
                ackIds?: (string[]|null);

                /** StreamingPullRequest modifyDeadlineSeconds */
                modifyDeadlineSeconds?: (number[]|null);

                /** StreamingPullRequest modifyDeadlineAckIds */
                modifyDeadlineAckIds?: (string[]|null);

                /** StreamingPullRequest streamAckDeadlineSeconds */
                streamAckDeadlineSeconds?: (number|null);

                /** StreamingPullRequest clientId */
                clientId?: (string|null);

                /** StreamingPullRequest maxOutstandingMessages */
                maxOutstandingMessages?: (number|Long|string|null);

                /** StreamingPullRequest maxOutstandingBytes */
                maxOutstandingBytes?: (number|Long|string|null);
            }

            /** Represents a StreamingPullRequest. */
            class StreamingPullRequest implements IStreamingPullRequest {

                /**
                 * Constructs a new StreamingPullRequest.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.pubsub.v1.IStreamingPullRequest);

                /** StreamingPullRequest subscription. */
                public subscription: string;

                /** StreamingPullRequest ackIds. */
                public ackIds: string[];

                /** StreamingPullRequest modifyDeadlineSeconds. */
                public modifyDeadlineSeconds: number[];

                /** StreamingPullRequest modifyDeadlineAckIds. */
                public modifyDeadlineAckIds: string[];

                /** StreamingPullRequest streamAckDeadlineSeconds. */
                public streamAckDeadlineSeconds: number;

                /** StreamingPullRequest clientId. */
                public clientId: string;

                /** StreamingPullRequest maxOutstandingMessages. */
                public maxOutstandingMessages: (number|Long|string);

                /** StreamingPullRequest maxOutstandingBytes. */
                public maxOutstandingBytes: (number|Long|string);

                /**
                 * Creates a new StreamingPullRequest instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns StreamingPullRequest instance
                 */
                public static create(properties?: google.pubsub.v1.IStreamingPullRequest): google.pubsub.v1.StreamingPullRequest;

                /**
                 * Encodes the specified StreamingPullRequest message. Does not implicitly {@link google.pubsub.v1.StreamingPullRequest.verify|verify} messages.
                 * @param message StreamingPullRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.pubsub.v1.IStreamingPullRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified StreamingPullRequest message, length delimited. Does not implicitly {@link google.pubsub.v1.StreamingPullRequest.verify|verify} messages.
                 * @param message StreamingPullRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.pubsub.v1.IStreamingPullRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a StreamingPullRequest message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns StreamingPullRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.pubsub.v1.StreamingPullRequest;

                /**
                 * Decodes a StreamingPullRequest message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns StreamingPullRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.pubsub.v1.StreamingPullRequest;

                /**
                 * Verifies a StreamingPullRequest message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a StreamingPullRequest message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns StreamingPullRequest
                 */
                public static fromObject(object: { [k: string]: any }): google.pubsub.v1.StreamingPullRequest;

                /**
                 * Creates a plain object from a StreamingPullRequest message. Also converts values to other types if specified.
                 * @param message StreamingPullRequest
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.pubsub.v1.StreamingPullRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this StreamingPullRequest to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a StreamingPullResponse. */
            interface IStreamingPullResponse {

                /** StreamingPullResponse receivedMessages */
                receivedMessages?: (google.pubsub.v1.IReceivedMessage[]|null);

                /** StreamingPullResponse subscriptionProperties */
                subscriptionProperties?: (google.pubsub.v1.StreamingPullResponse.ISubscriptionProperties|null);
            }

            /** Represents a StreamingPullResponse. */
            class StreamingPullResponse implements IStreamingPullResponse {

                /**
                 * Constructs a new StreamingPullResponse.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.pubsub.v1.IStreamingPullResponse);

                /** StreamingPullResponse receivedMessages. */
                public receivedMessages: google.pubsub.v1.IReceivedMessage[];

                /** StreamingPullResponse subscriptionProperties. */
                public subscriptionProperties?: (google.pubsub.v1.StreamingPullResponse.ISubscriptionProperties|null);

                /**
                 * Creates a new StreamingPullResponse instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns StreamingPullResponse instance
                 */
                public static create(properties?: google.pubsub.v1.IStreamingPullResponse): google.pubsub.v1.StreamingPullResponse;

                /**
                 * Encodes the specified StreamingPullResponse message. Does not implicitly {@link google.pubsub.v1.StreamingPullResponse.verify|verify} messages.
                 * @param message StreamingPullResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.pubsub.v1.IStreamingPullResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified StreamingPullResponse message, length delimited. Does not implicitly {@link google.pubsub.v1.StreamingPullResponse.verify|verify} messages.
                 * @param message StreamingPullResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.pubsub.v1.IStreamingPullResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a StreamingPullResponse message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns StreamingPullResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.pubsub.v1.StreamingPullResponse;

                /**
                 * Decodes a StreamingPullResponse message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns StreamingPullResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.pubsub.v1.StreamingPullResponse;

                /**
                 * Verifies a StreamingPullResponse message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a StreamingPullResponse message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns StreamingPullResponse
                 */
                public static fromObject(object: { [k: string]: any }): google.pubsub.v1.StreamingPullResponse;

                /**
                 * Creates a plain object from a StreamingPullResponse message. Also converts values to other types if specified.
                 * @param message StreamingPullResponse
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.pubsub.v1.StreamingPullResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this StreamingPullResponse to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            namespace StreamingPullResponse {

                /** Properties of a SubscriptionProperties. */
                interface ISubscriptionProperties {

                    /** SubscriptionProperties messageOrderingEnabled */
                    messageOrderingEnabled?: (boolean|null);
                }

                /** Represents a SubscriptionProperties. */
                class SubscriptionProperties implements ISubscriptionProperties {

                    /**
                     * Constructs a new SubscriptionProperties.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: google.pubsub.v1.StreamingPullResponse.ISubscriptionProperties);

                    /** SubscriptionProperties messageOrderingEnabled. */
                    public messageOrderingEnabled: boolean;

                    /**
                     * Creates a new SubscriptionProperties instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns SubscriptionProperties instance
                     */
                    public static create(properties?: google.pubsub.v1.StreamingPullResponse.ISubscriptionProperties): google.pubsub.v1.StreamingPullResponse.SubscriptionProperties;

                    /**
                     * Encodes the specified SubscriptionProperties message. Does not implicitly {@link google.pubsub.v1.StreamingPullResponse.SubscriptionProperties.verify|verify} messages.
                     * @param message SubscriptionProperties message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: google.pubsub.v1.StreamingPullResponse.ISubscriptionProperties, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified SubscriptionProperties message, length delimited. Does not implicitly {@link google.pubsub.v1.StreamingPullResponse.SubscriptionProperties.verify|verify} messages.
                     * @param message SubscriptionProperties message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: google.pubsub.v1.StreamingPullResponse.ISubscriptionProperties, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a SubscriptionProperties message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns SubscriptionProperties
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.pubsub.v1.StreamingPullResponse.SubscriptionProperties;

                    /**
                     * Decodes a SubscriptionProperties message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns SubscriptionProperties
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.pubsub.v1.StreamingPullResponse.SubscriptionProperties;

                    /**
                     * Verifies a SubscriptionProperties message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a SubscriptionProperties message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns SubscriptionProperties
                     */
                    public static fromObject(object: { [k: string]: any }): google.pubsub.v1.StreamingPullResponse.SubscriptionProperties;

                    /**
                     * Creates a plain object from a SubscriptionProperties message. Also converts values to other types if specified.
                     * @param message SubscriptionProperties
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: google.pubsub.v1.StreamingPullResponse.SubscriptionProperties, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this SubscriptionProperties to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }
            }

            /** Properties of a CreateSnapshotRequest. */
            interface ICreateSnapshotRequest {

                /** CreateSnapshotRequest name */
                name?: (string|null);

                /** CreateSnapshotRequest subscription */
                subscription?: (string|null);

                /** CreateSnapshotRequest labels */
                labels?: ({ [k: string]: string }|null);
            }

            /** Represents a CreateSnapshotRequest. */
            class CreateSnapshotRequest implements ICreateSnapshotRequest {

                /**
                 * Constructs a new CreateSnapshotRequest.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.pubsub.v1.ICreateSnapshotRequest);

                /** CreateSnapshotRequest name. */
                public name: string;

                /** CreateSnapshotRequest subscription. */
                public subscription: string;

                /** CreateSnapshotRequest labels. */
                public labels: { [k: string]: string };

                /**
                 * Creates a new CreateSnapshotRequest instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns CreateSnapshotRequest instance
                 */
                public static create(properties?: google.pubsub.v1.ICreateSnapshotRequest): google.pubsub.v1.CreateSnapshotRequest;

                /**
                 * Encodes the specified CreateSnapshotRequest message. Does not implicitly {@link google.pubsub.v1.CreateSnapshotRequest.verify|verify} messages.
                 * @param message CreateSnapshotRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.pubsub.v1.ICreateSnapshotRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified CreateSnapshotRequest message, length delimited. Does not implicitly {@link google.pubsub.v1.CreateSnapshotRequest.verify|verify} messages.
                 * @param message CreateSnapshotRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.pubsub.v1.ICreateSnapshotRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a CreateSnapshotRequest message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns CreateSnapshotRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.pubsub.v1.CreateSnapshotRequest;

                /**
                 * Decodes a CreateSnapshotRequest message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns CreateSnapshotRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.pubsub.v1.CreateSnapshotRequest;

                /**
                 * Verifies a CreateSnapshotRequest message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a CreateSnapshotRequest message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns CreateSnapshotRequest
                 */
                public static fromObject(object: { [k: string]: any }): google.pubsub.v1.CreateSnapshotRequest;

                /**
                 * Creates a plain object from a CreateSnapshotRequest message. Also converts values to other types if specified.
                 * @param message CreateSnapshotRequest
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.pubsub.v1.CreateSnapshotRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this CreateSnapshotRequest to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of an UpdateSnapshotRequest. */
            interface IUpdateSnapshotRequest {

                /** UpdateSnapshotRequest snapshot */
                snapshot?: (google.pubsub.v1.ISnapshot|null);

                /** UpdateSnapshotRequest updateMask */
                updateMask?: (google.protobuf.IFieldMask|null);
            }

            /** Represents an UpdateSnapshotRequest. */
            class UpdateSnapshotRequest implements IUpdateSnapshotRequest {

                /**
                 * Constructs a new UpdateSnapshotRequest.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.pubsub.v1.IUpdateSnapshotRequest);

                /** UpdateSnapshotRequest snapshot. */
                public snapshot?: (google.pubsub.v1.ISnapshot|null);

                /** UpdateSnapshotRequest updateMask. */
                public updateMask?: (google.protobuf.IFieldMask|null);

                /**
                 * Creates a new UpdateSnapshotRequest instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns UpdateSnapshotRequest instance
                 */
                public static create(properties?: google.pubsub.v1.IUpdateSnapshotRequest): google.pubsub.v1.UpdateSnapshotRequest;

                /**
                 * Encodes the specified UpdateSnapshotRequest message. Does not implicitly {@link google.pubsub.v1.UpdateSnapshotRequest.verify|verify} messages.
                 * @param message UpdateSnapshotRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.pubsub.v1.IUpdateSnapshotRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified UpdateSnapshotRequest message, length delimited. Does not implicitly {@link google.pubsub.v1.UpdateSnapshotRequest.verify|verify} messages.
                 * @param message UpdateSnapshotRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.pubsub.v1.IUpdateSnapshotRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an UpdateSnapshotRequest message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns UpdateSnapshotRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.pubsub.v1.UpdateSnapshotRequest;

                /**
                 * Decodes an UpdateSnapshotRequest message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns UpdateSnapshotRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.pubsub.v1.UpdateSnapshotRequest;

                /**
                 * Verifies an UpdateSnapshotRequest message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an UpdateSnapshotRequest message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns UpdateSnapshotRequest
                 */
                public static fromObject(object: { [k: string]: any }): google.pubsub.v1.UpdateSnapshotRequest;

                /**
                 * Creates a plain object from an UpdateSnapshotRequest message. Also converts values to other types if specified.
                 * @param message UpdateSnapshotRequest
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.pubsub.v1.UpdateSnapshotRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this UpdateSnapshotRequest to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a Snapshot. */
            interface ISnapshot {

                /** Snapshot name */
                name?: (string|null);

                /** Snapshot topic */
                topic?: (string|null);

                /** Snapshot expireTime */
                expireTime?: (google.protobuf.ITimestamp|null);

                /** Snapshot labels */
                labels?: ({ [k: string]: string }|null);
            }

            /** Represents a Snapshot. */
            class Snapshot implements ISnapshot {

                /**
                 * Constructs a new Snapshot.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.pubsub.v1.ISnapshot);

                /** Snapshot name. */
                public name: string;

                /** Snapshot topic. */
                public topic: string;

                /** Snapshot expireTime. */
                public expireTime?: (google.protobuf.ITimestamp|null);

                /** Snapshot labels. */
                public labels: { [k: string]: string };

                /**
                 * Creates a new Snapshot instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Snapshot instance
                 */
                public static create(properties?: google.pubsub.v1.ISnapshot): google.pubsub.v1.Snapshot;

                /**
                 * Encodes the specified Snapshot message. Does not implicitly {@link google.pubsub.v1.Snapshot.verify|verify} messages.
                 * @param message Snapshot message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.pubsub.v1.ISnapshot, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Snapshot message, length delimited. Does not implicitly {@link google.pubsub.v1.Snapshot.verify|verify} messages.
                 * @param message Snapshot message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.pubsub.v1.ISnapshot, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Snapshot message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Snapshot
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.pubsub.v1.Snapshot;

                /**
                 * Decodes a Snapshot message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Snapshot
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.pubsub.v1.Snapshot;

                /**
                 * Verifies a Snapshot message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Snapshot message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Snapshot
                 */
                public static fromObject(object: { [k: string]: any }): google.pubsub.v1.Snapshot;

                /**
                 * Creates a plain object from a Snapshot message. Also converts values to other types if specified.
                 * @param message Snapshot
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.pubsub.v1.Snapshot, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Snapshot to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a GetSnapshotRequest. */
            interface IGetSnapshotRequest {

                /** GetSnapshotRequest snapshot */
                snapshot?: (string|null);
            }

            /** Represents a GetSnapshotRequest. */
            class GetSnapshotRequest implements IGetSnapshotRequest {

                /**
                 * Constructs a new GetSnapshotRequest.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.pubsub.v1.IGetSnapshotRequest);

                /** GetSnapshotRequest snapshot. */
                public snapshot: string;

                /**
                 * Creates a new GetSnapshotRequest instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns GetSnapshotRequest instance
                 */
                public static create(properties?: google.pubsub.v1.IGetSnapshotRequest): google.pubsub.v1.GetSnapshotRequest;

                /**
                 * Encodes the specified GetSnapshotRequest message. Does not implicitly {@link google.pubsub.v1.GetSnapshotRequest.verify|verify} messages.
                 * @param message GetSnapshotRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.pubsub.v1.IGetSnapshotRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified GetSnapshotRequest message, length delimited. Does not implicitly {@link google.pubsub.v1.GetSnapshotRequest.verify|verify} messages.
                 * @param message GetSnapshotRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.pubsub.v1.IGetSnapshotRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a GetSnapshotRequest message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns GetSnapshotRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.pubsub.v1.GetSnapshotRequest;

                /**
                 * Decodes a GetSnapshotRequest message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns GetSnapshotRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.pubsub.v1.GetSnapshotRequest;

                /**
                 * Verifies a GetSnapshotRequest message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a GetSnapshotRequest message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns GetSnapshotRequest
                 */
                public static fromObject(object: { [k: string]: any }): google.pubsub.v1.GetSnapshotRequest;

                /**
                 * Creates a plain object from a GetSnapshotRequest message. Also converts values to other types if specified.
                 * @param message GetSnapshotRequest
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.pubsub.v1.GetSnapshotRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this GetSnapshotRequest to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a ListSnapshotsRequest. */
            interface IListSnapshotsRequest {

                /** ListSnapshotsRequest project */
                project?: (string|null);

                /** ListSnapshotsRequest pageSize */
                pageSize?: (number|null);

                /** ListSnapshotsRequest pageToken */
                pageToken?: (string|null);
            }

            /** Represents a ListSnapshotsRequest. */
            class ListSnapshotsRequest implements IListSnapshotsRequest {

                /**
                 * Constructs a new ListSnapshotsRequest.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.pubsub.v1.IListSnapshotsRequest);

                /** ListSnapshotsRequest project. */
                public project: string;

                /** ListSnapshotsRequest pageSize. */
                public pageSize: number;

                /** ListSnapshotsRequest pageToken. */
                public pageToken: string;

                /**
                 * Creates a new ListSnapshotsRequest instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns ListSnapshotsRequest instance
                 */
                public static create(properties?: google.pubsub.v1.IListSnapshotsRequest): google.pubsub.v1.ListSnapshotsRequest;

                /**
                 * Encodes the specified ListSnapshotsRequest message. Does not implicitly {@link google.pubsub.v1.ListSnapshotsRequest.verify|verify} messages.
                 * @param message ListSnapshotsRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.pubsub.v1.IListSnapshotsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ListSnapshotsRequest message, length delimited. Does not implicitly {@link google.pubsub.v1.ListSnapshotsRequest.verify|verify} messages.
                 * @param message ListSnapshotsRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.pubsub.v1.IListSnapshotsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a ListSnapshotsRequest message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns ListSnapshotsRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.pubsub.v1.ListSnapshotsRequest;

                /**
                 * Decodes a ListSnapshotsRequest message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns ListSnapshotsRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.pubsub.v1.ListSnapshotsRequest;

                /**
                 * Verifies a ListSnapshotsRequest message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a ListSnapshotsRequest message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns ListSnapshotsRequest
                 */
                public static fromObject(object: { [k: string]: any }): google.pubsub.v1.ListSnapshotsRequest;

                /**
                 * Creates a plain object from a ListSnapshotsRequest message. Also converts values to other types if specified.
                 * @param message ListSnapshotsRequest
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.pubsub.v1.ListSnapshotsRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this ListSnapshotsRequest to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a ListSnapshotsResponse. */
            interface IListSnapshotsResponse {

                /** ListSnapshotsResponse snapshots */
                snapshots?: (google.pubsub.v1.ISnapshot[]|null);

                /** ListSnapshotsResponse nextPageToken */
                nextPageToken?: (string|null);
            }

            /** Represents a ListSnapshotsResponse. */
            class ListSnapshotsResponse implements IListSnapshotsResponse {

                /**
                 * Constructs a new ListSnapshotsResponse.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.pubsub.v1.IListSnapshotsResponse);

                /** ListSnapshotsResponse snapshots. */
                public snapshots: google.pubsub.v1.ISnapshot[];

                /** ListSnapshotsResponse nextPageToken. */
                public nextPageToken: string;

                /**
                 * Creates a new ListSnapshotsResponse instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns ListSnapshotsResponse instance
                 */
                public static create(properties?: google.pubsub.v1.IListSnapshotsResponse): google.pubsub.v1.ListSnapshotsResponse;

                /**
                 * Encodes the specified ListSnapshotsResponse message. Does not implicitly {@link google.pubsub.v1.ListSnapshotsResponse.verify|verify} messages.
                 * @param message ListSnapshotsResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.pubsub.v1.IListSnapshotsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ListSnapshotsResponse message, length delimited. Does not implicitly {@link google.pubsub.v1.ListSnapshotsResponse.verify|verify} messages.
                 * @param message ListSnapshotsResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.pubsub.v1.IListSnapshotsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a ListSnapshotsResponse message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns ListSnapshotsResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.pubsub.v1.ListSnapshotsResponse;

                /**
                 * Decodes a ListSnapshotsResponse message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns ListSnapshotsResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.pubsub.v1.ListSnapshotsResponse;

                /**
                 * Verifies a ListSnapshotsResponse message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a ListSnapshotsResponse message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns ListSnapshotsResponse
                 */
                public static fromObject(object: { [k: string]: any }): google.pubsub.v1.ListSnapshotsResponse;

                /**
                 * Creates a plain object from a ListSnapshotsResponse message. Also converts values to other types if specified.
                 * @param message ListSnapshotsResponse
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.pubsub.v1.ListSnapshotsResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this ListSnapshotsResponse to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a DeleteSnapshotRequest. */
            interface IDeleteSnapshotRequest {

                /** DeleteSnapshotRequest snapshot */
                snapshot?: (string|null);
            }

            /** Represents a DeleteSnapshotRequest. */
            class DeleteSnapshotRequest implements IDeleteSnapshotRequest {

                /**
                 * Constructs a new DeleteSnapshotRequest.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.pubsub.v1.IDeleteSnapshotRequest);

                /** DeleteSnapshotRequest snapshot. */
                public snapshot: string;

                /**
                 * Creates a new DeleteSnapshotRequest instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns DeleteSnapshotRequest instance
                 */
                public static create(properties?: google.pubsub.v1.IDeleteSnapshotRequest): google.pubsub.v1.DeleteSnapshotRequest;

                /**
                 * Encodes the specified DeleteSnapshotRequest message. Does not implicitly {@link google.pubsub.v1.DeleteSnapshotRequest.verify|verify} messages.
                 * @param message DeleteSnapshotRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.pubsub.v1.IDeleteSnapshotRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified DeleteSnapshotRequest message, length delimited. Does not implicitly {@link google.pubsub.v1.DeleteSnapshotRequest.verify|verify} messages.
                 * @param message DeleteSnapshotRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.pubsub.v1.IDeleteSnapshotRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a DeleteSnapshotRequest message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns DeleteSnapshotRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.pubsub.v1.DeleteSnapshotRequest;

                /**
                 * Decodes a DeleteSnapshotRequest message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns DeleteSnapshotRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.pubsub.v1.DeleteSnapshotRequest;

                /**
                 * Verifies a DeleteSnapshotRequest message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a DeleteSnapshotRequest message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns DeleteSnapshotRequest
                 */
                public static fromObject(object: { [k: string]: any }): google.pubsub.v1.DeleteSnapshotRequest;

                /**
                 * Creates a plain object from a DeleteSnapshotRequest message. Also converts values to other types if specified.
                 * @param message DeleteSnapshotRequest
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.pubsub.v1.DeleteSnapshotRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this DeleteSnapshotRequest to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a SeekRequest. */
            interface ISeekRequest {

                /** SeekRequest subscription */
                subscription?: (string|null);

                /** SeekRequest time */
                time?: (google.protobuf.ITimestamp|null);

                /** SeekRequest snapshot */
                snapshot?: (string|null);
            }

            /** Represents a SeekRequest. */
            class SeekRequest implements ISeekRequest {

                /**
                 * Constructs a new SeekRequest.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.pubsub.v1.ISeekRequest);

                /** SeekRequest subscription. */
                public subscription: string;

                /** SeekRequest time. */
                public time?: (google.protobuf.ITimestamp|null);

                /** SeekRequest snapshot. */
                public snapshot?: (string|null);

                /** SeekRequest target. */
                public target?: ("time"|"snapshot");

                /**
                 * Creates a new SeekRequest instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns SeekRequest instance
                 */
                public static create(properties?: google.pubsub.v1.ISeekRequest): google.pubsub.v1.SeekRequest;

                /**
                 * Encodes the specified SeekRequest message. Does not implicitly {@link google.pubsub.v1.SeekRequest.verify|verify} messages.
                 * @param message SeekRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.pubsub.v1.ISeekRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified SeekRequest message, length delimited. Does not implicitly {@link google.pubsub.v1.SeekRequest.verify|verify} messages.
                 * @param message SeekRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.pubsub.v1.ISeekRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a SeekRequest message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns SeekRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.pubsub.v1.SeekRequest;

                /**
                 * Decodes a SeekRequest message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns SeekRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.pubsub.v1.SeekRequest;

                /**
                 * Verifies a SeekRequest message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a SeekRequest message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns SeekRequest
                 */
                public static fromObject(object: { [k: string]: any }): google.pubsub.v1.SeekRequest;

                /**
                 * Creates a plain object from a SeekRequest message. Also converts values to other types if specified.
                 * @param message SeekRequest
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.pubsub.v1.SeekRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this SeekRequest to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a SeekResponse. */
            interface ISeekResponse {
            }

            /** Represents a SeekResponse. */
            class SeekResponse implements ISeekResponse {

                /**
                 * Constructs a new SeekResponse.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.pubsub.v1.ISeekResponse);

                /**
                 * Creates a new SeekResponse instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns SeekResponse instance
                 */
                public static create(properties?: google.pubsub.v1.ISeekResponse): google.pubsub.v1.SeekResponse;

                /**
                 * Encodes the specified SeekResponse message. Does not implicitly {@link google.pubsub.v1.SeekResponse.verify|verify} messages.
                 * @param message SeekResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.pubsub.v1.ISeekResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified SeekResponse message, length delimited. Does not implicitly {@link google.pubsub.v1.SeekResponse.verify|verify} messages.
                 * @param message SeekResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.pubsub.v1.ISeekResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a SeekResponse message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns SeekResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.pubsub.v1.SeekResponse;

                /**
                 * Decodes a SeekResponse message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns SeekResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.pubsub.v1.SeekResponse;

                /**
                 * Verifies a SeekResponse message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a SeekResponse message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns SeekResponse
                 */
                public static fromObject(object: { [k: string]: any }): google.pubsub.v1.SeekResponse;

                /**
                 * Creates a plain object from a SeekResponse message. Also converts values to other types if specified.
                 * @param message SeekResponse
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.pubsub.v1.SeekResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this SeekResponse to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Represents a SchemaService */
            class SchemaService extends $protobuf.rpc.Service {

                /**
                 * Constructs a new SchemaService service.
                 * @param rpcImpl RPC implementation
                 * @param [requestDelimited=false] Whether requests are length-delimited
                 * @param [responseDelimited=false] Whether responses are length-delimited
                 */
                constructor(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean);

                /**
                 * Creates new SchemaService service using the specified rpc implementation.
                 * @param rpcImpl RPC implementation
                 * @param [requestDelimited=false] Whether requests are length-delimited
                 * @param [responseDelimited=false] Whether responses are length-delimited
                 * @returns RPC service. Useful where requests and/or responses are streamed.
                 */
                public static create(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean): SchemaService;

                /**
                 * Calls CreateSchema.
                 * @param request CreateSchemaRequest message or plain object
                 * @param callback Node-style callback called with the error, if any, and Schema
                 */
                public createSchema(request: google.pubsub.v1.ICreateSchemaRequest, callback: google.pubsub.v1.SchemaService.CreateSchemaCallback): void;

                /**
                 * Calls CreateSchema.
                 * @param request CreateSchemaRequest message or plain object
                 * @returns Promise
                 */
                public createSchema(request: google.pubsub.v1.ICreateSchemaRequest): Promise<google.pubsub.v1.Schema>;

                /**
                 * Calls GetSchema.
                 * @param request GetSchemaRequest message or plain object
                 * @param callback Node-style callback called with the error, if any, and Schema
                 */
                public getSchema(request: google.pubsub.v1.IGetSchemaRequest, callback: google.pubsub.v1.SchemaService.GetSchemaCallback): void;

                /**
                 * Calls GetSchema.
                 * @param request GetSchemaRequest message or plain object
                 * @returns Promise
                 */
                public getSchema(request: google.pubsub.v1.IGetSchemaRequest): Promise<google.pubsub.v1.Schema>;

                /**
                 * Calls ListSchemas.
                 * @param request ListSchemasRequest message or plain object
                 * @param callback Node-style callback called with the error, if any, and ListSchemasResponse
                 */
                public listSchemas(request: google.pubsub.v1.IListSchemasRequest, callback: google.pubsub.v1.SchemaService.ListSchemasCallback): void;

                /**
                 * Calls ListSchemas.
                 * @param request ListSchemasRequest message or plain object
                 * @returns Promise
                 */
                public listSchemas(request: google.pubsub.v1.IListSchemasRequest): Promise<google.pubsub.v1.ListSchemasResponse>;

                /**
                 * Calls DeleteSchema.
                 * @param request DeleteSchemaRequest message or plain object
                 * @param callback Node-style callback called with the error, if any, and Empty
                 */
                public deleteSchema(request: google.pubsub.v1.IDeleteSchemaRequest, callback: google.pubsub.v1.SchemaService.DeleteSchemaCallback): void;

                /**
                 * Calls DeleteSchema.
                 * @param request DeleteSchemaRequest message or plain object
                 * @returns Promise
                 */
                public deleteSchema(request: google.pubsub.v1.IDeleteSchemaRequest): Promise<google.protobuf.Empty>;

                /**
                 * Calls ValidateSchema.
                 * @param request ValidateSchemaRequest message or plain object
                 * @param callback Node-style callback called with the error, if any, and ValidateSchemaResponse
                 */
                public validateSchema(request: google.pubsub.v1.IValidateSchemaRequest, callback: google.pubsub.v1.SchemaService.ValidateSchemaCallback): void;

                /**
                 * Calls ValidateSchema.
                 * @param request ValidateSchemaRequest message or plain object
                 * @returns Promise
                 */
                public validateSchema(request: google.pubsub.v1.IValidateSchemaRequest): Promise<google.pubsub.v1.ValidateSchemaResponse>;

                /**
                 * Calls ValidateMessage.
                 * @param request ValidateMessageRequest message or plain object
                 * @param callback Node-style callback called with the error, if any, and ValidateMessageResponse
                 */
                public validateMessage(request: google.pubsub.v1.IValidateMessageRequest, callback: google.pubsub.v1.SchemaService.ValidateMessageCallback): void;

                /**
                 * Calls ValidateMessage.
                 * @param request ValidateMessageRequest message or plain object
                 * @returns Promise
                 */
                public validateMessage(request: google.pubsub.v1.IValidateMessageRequest): Promise<google.pubsub.v1.ValidateMessageResponse>;
            }

            namespace SchemaService {

                /**
                 * Callback as used by {@link google.pubsub.v1.SchemaService#createSchema}.
                 * @param error Error, if any
                 * @param [response] Schema
                 */
                type CreateSchemaCallback = (error: (Error|null), response?: google.pubsub.v1.Schema) => void;

                /**
                 * Callback as used by {@link google.pubsub.v1.SchemaService#getSchema}.
                 * @param error Error, if any
                 * @param [response] Schema
                 */
                type GetSchemaCallback = (error: (Error|null), response?: google.pubsub.v1.Schema) => void;

                /**
                 * Callback as used by {@link google.pubsub.v1.SchemaService#listSchemas}.
                 * @param error Error, if any
                 * @param [response] ListSchemasResponse
                 */
                type ListSchemasCallback = (error: (Error|null), response?: google.pubsub.v1.ListSchemasResponse) => void;

                /**
                 * Callback as used by {@link google.pubsub.v1.SchemaService#deleteSchema}.
                 * @param error Error, if any
                 * @param [response] Empty
                 */
                type DeleteSchemaCallback = (error: (Error|null), response?: google.protobuf.Empty) => void;

                /**
                 * Callback as used by {@link google.pubsub.v1.SchemaService#validateSchema}.
                 * @param error Error, if any
                 * @param [response] ValidateSchemaResponse
                 */
                type ValidateSchemaCallback = (error: (Error|null), response?: google.pubsub.v1.ValidateSchemaResponse) => void;

                /**
                 * Callback as used by {@link google.pubsub.v1.SchemaService#validateMessage}.
                 * @param error Error, if any
                 * @param [response] ValidateMessageResponse
                 */
                type ValidateMessageCallback = (error: (Error|null), response?: google.pubsub.v1.ValidateMessageResponse) => void;
            }

            /** Properties of a Schema. */
            interface ISchema {

                /** Schema name */
                name?: (string|null);

                /** Schema type */
                type?: (google.pubsub.v1.Schema.Type|keyof typeof google.pubsub.v1.Schema.Type|null);

                /** Schema definition */
                definition?: (string|null);
            }

            /** Represents a Schema. */
            class Schema implements ISchema {

                /**
                 * Constructs a new Schema.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.pubsub.v1.ISchema);

                /** Schema name. */
                public name: string;

                /** Schema type. */
                public type: (google.pubsub.v1.Schema.Type|keyof typeof google.pubsub.v1.Schema.Type);

                /** Schema definition. */
                public definition: string;

                /**
                 * Creates a new Schema instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Schema instance
                 */
                public static create(properties?: google.pubsub.v1.ISchema): google.pubsub.v1.Schema;

                /**
                 * Encodes the specified Schema message. Does not implicitly {@link google.pubsub.v1.Schema.verify|verify} messages.
                 * @param message Schema message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.pubsub.v1.ISchema, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Schema message, length delimited. Does not implicitly {@link google.pubsub.v1.Schema.verify|verify} messages.
                 * @param message Schema message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.pubsub.v1.ISchema, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Schema message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Schema
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.pubsub.v1.Schema;

                /**
                 * Decodes a Schema message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Schema
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.pubsub.v1.Schema;

                /**
                 * Verifies a Schema message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Schema message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Schema
                 */
                public static fromObject(object: { [k: string]: any }): google.pubsub.v1.Schema;

                /**
                 * Creates a plain object from a Schema message. Also converts values to other types if specified.
                 * @param message Schema
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.pubsub.v1.Schema, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Schema to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            namespace Schema {

                /** Type enum. */
                enum Type {
                    TYPE_UNSPECIFIED = 0,
                    PROTOCOL_BUFFER = 1,
                    AVRO = 2
                }
            }

            /** Properties of a CreateSchemaRequest. */
            interface ICreateSchemaRequest {

                /** CreateSchemaRequest parent */
                parent?: (string|null);

                /** CreateSchemaRequest schema */
                schema?: (google.pubsub.v1.ISchema|null);

                /** CreateSchemaRequest schemaId */
                schemaId?: (string|null);
            }

            /** Represents a CreateSchemaRequest. */
            class CreateSchemaRequest implements ICreateSchemaRequest {

                /**
                 * Constructs a new CreateSchemaRequest.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.pubsub.v1.ICreateSchemaRequest);

                /** CreateSchemaRequest parent. */
                public parent: string;

                /** CreateSchemaRequest schema. */
                public schema?: (google.pubsub.v1.ISchema|null);

                /** CreateSchemaRequest schemaId. */
                public schemaId: string;

                /**
                 * Creates a new CreateSchemaRequest instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns CreateSchemaRequest instance
                 */
                public static create(properties?: google.pubsub.v1.ICreateSchemaRequest): google.pubsub.v1.CreateSchemaRequest;

                /**
                 * Encodes the specified CreateSchemaRequest message. Does not implicitly {@link google.pubsub.v1.CreateSchemaRequest.verify|verify} messages.
                 * @param message CreateSchemaRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.pubsub.v1.ICreateSchemaRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified CreateSchemaRequest message, length delimited. Does not implicitly {@link google.pubsub.v1.CreateSchemaRequest.verify|verify} messages.
                 * @param message CreateSchemaRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.pubsub.v1.ICreateSchemaRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a CreateSchemaRequest message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns CreateSchemaRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.pubsub.v1.CreateSchemaRequest;

                /**
                 * Decodes a CreateSchemaRequest message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns CreateSchemaRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.pubsub.v1.CreateSchemaRequest;

                /**
                 * Verifies a CreateSchemaRequest message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a CreateSchemaRequest message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns CreateSchemaRequest
                 */
                public static fromObject(object: { [k: string]: any }): google.pubsub.v1.CreateSchemaRequest;

                /**
                 * Creates a plain object from a CreateSchemaRequest message. Also converts values to other types if specified.
                 * @param message CreateSchemaRequest
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.pubsub.v1.CreateSchemaRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this CreateSchemaRequest to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** SchemaView enum. */
            enum SchemaView {
                SCHEMA_VIEW_UNSPECIFIED = 0,
                BASIC = 1,
                FULL = 2
            }

            /** Properties of a GetSchemaRequest. */
            interface IGetSchemaRequest {

                /** GetSchemaRequest name */
                name?: (string|null);

                /** GetSchemaRequest view */
                view?: (google.pubsub.v1.SchemaView|keyof typeof google.pubsub.v1.SchemaView|null);
            }

            /** Represents a GetSchemaRequest. */
            class GetSchemaRequest implements IGetSchemaRequest {

                /**
                 * Constructs a new GetSchemaRequest.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.pubsub.v1.IGetSchemaRequest);

                /** GetSchemaRequest name. */
                public name: string;

                /** GetSchemaRequest view. */
                public view: (google.pubsub.v1.SchemaView|keyof typeof google.pubsub.v1.SchemaView);

                /**
                 * Creates a new GetSchemaRequest instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns GetSchemaRequest instance
                 */
                public static create(properties?: google.pubsub.v1.IGetSchemaRequest): google.pubsub.v1.GetSchemaRequest;

                /**
                 * Encodes the specified GetSchemaRequest message. Does not implicitly {@link google.pubsub.v1.GetSchemaRequest.verify|verify} messages.
                 * @param message GetSchemaRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.pubsub.v1.IGetSchemaRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified GetSchemaRequest message, length delimited. Does not implicitly {@link google.pubsub.v1.GetSchemaRequest.verify|verify} messages.
                 * @param message GetSchemaRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.pubsub.v1.IGetSchemaRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a GetSchemaRequest message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns GetSchemaRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.pubsub.v1.GetSchemaRequest;

                /**
                 * Decodes a GetSchemaRequest message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns GetSchemaRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.pubsub.v1.GetSchemaRequest;

                /**
                 * Verifies a GetSchemaRequest message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a GetSchemaRequest message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns GetSchemaRequest
                 */
                public static fromObject(object: { [k: string]: any }): google.pubsub.v1.GetSchemaRequest;

                /**
                 * Creates a plain object from a GetSchemaRequest message. Also converts values to other types if specified.
                 * @param message GetSchemaRequest
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.pubsub.v1.GetSchemaRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this GetSchemaRequest to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a ListSchemasRequest. */
            interface IListSchemasRequest {

                /** ListSchemasRequest parent */
                parent?: (string|null);

                /** ListSchemasRequest view */
                view?: (google.pubsub.v1.SchemaView|keyof typeof google.pubsub.v1.SchemaView|null);

                /** ListSchemasRequest pageSize */
                pageSize?: (number|null);

                /** ListSchemasRequest pageToken */
                pageToken?: (string|null);
            }

            /** Represents a ListSchemasRequest. */
            class ListSchemasRequest implements IListSchemasRequest {

                /**
                 * Constructs a new ListSchemasRequest.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.pubsub.v1.IListSchemasRequest);

                /** ListSchemasRequest parent. */
                public parent: string;

                /** ListSchemasRequest view. */
                public view: (google.pubsub.v1.SchemaView|keyof typeof google.pubsub.v1.SchemaView);

                /** ListSchemasRequest pageSize. */
                public pageSize: number;

                /** ListSchemasRequest pageToken. */
                public pageToken: string;

                /**
                 * Creates a new ListSchemasRequest instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns ListSchemasRequest instance
                 */
                public static create(properties?: google.pubsub.v1.IListSchemasRequest): google.pubsub.v1.ListSchemasRequest;

                /**
                 * Encodes the specified ListSchemasRequest message. Does not implicitly {@link google.pubsub.v1.ListSchemasRequest.verify|verify} messages.
                 * @param message ListSchemasRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.pubsub.v1.IListSchemasRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ListSchemasRequest message, length delimited. Does not implicitly {@link google.pubsub.v1.ListSchemasRequest.verify|verify} messages.
                 * @param message ListSchemasRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.pubsub.v1.IListSchemasRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a ListSchemasRequest message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns ListSchemasRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.pubsub.v1.ListSchemasRequest;

                /**
                 * Decodes a ListSchemasRequest message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns ListSchemasRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.pubsub.v1.ListSchemasRequest;

                /**
                 * Verifies a ListSchemasRequest message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a ListSchemasRequest message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns ListSchemasRequest
                 */
                public static fromObject(object: { [k: string]: any }): google.pubsub.v1.ListSchemasRequest;

                /**
                 * Creates a plain object from a ListSchemasRequest message. Also converts values to other types if specified.
                 * @param message ListSchemasRequest
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.pubsub.v1.ListSchemasRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this ListSchemasRequest to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a ListSchemasResponse. */
            interface IListSchemasResponse {

                /** ListSchemasResponse schemas */
                schemas?: (google.pubsub.v1.ISchema[]|null);

                /** ListSchemasResponse nextPageToken */
                nextPageToken?: (string|null);
            }

            /** Represents a ListSchemasResponse. */
            class ListSchemasResponse implements IListSchemasResponse {

                /**
                 * Constructs a new ListSchemasResponse.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.pubsub.v1.IListSchemasResponse);

                /** ListSchemasResponse schemas. */
                public schemas: google.pubsub.v1.ISchema[];

                /** ListSchemasResponse nextPageToken. */
                public nextPageToken: string;

                /**
                 * Creates a new ListSchemasResponse instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns ListSchemasResponse instance
                 */
                public static create(properties?: google.pubsub.v1.IListSchemasResponse): google.pubsub.v1.ListSchemasResponse;

                /**
                 * Encodes the specified ListSchemasResponse message. Does not implicitly {@link google.pubsub.v1.ListSchemasResponse.verify|verify} messages.
                 * @param message ListSchemasResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.pubsub.v1.IListSchemasResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ListSchemasResponse message, length delimited. Does not implicitly {@link google.pubsub.v1.ListSchemasResponse.verify|verify} messages.
                 * @param message ListSchemasResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.pubsub.v1.IListSchemasResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a ListSchemasResponse message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns ListSchemasResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.pubsub.v1.ListSchemasResponse;

                /**
                 * Decodes a ListSchemasResponse message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns ListSchemasResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.pubsub.v1.ListSchemasResponse;

                /**
                 * Verifies a ListSchemasResponse message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a ListSchemasResponse message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns ListSchemasResponse
                 */
                public static fromObject(object: { [k: string]: any }): google.pubsub.v1.ListSchemasResponse;

                /**
                 * Creates a plain object from a ListSchemasResponse message. Also converts values to other types if specified.
                 * @param message ListSchemasResponse
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.pubsub.v1.ListSchemasResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this ListSchemasResponse to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a DeleteSchemaRequest. */
            interface IDeleteSchemaRequest {

                /** DeleteSchemaRequest name */
                name?: (string|null);
            }

            /** Represents a DeleteSchemaRequest. */
            class DeleteSchemaRequest implements IDeleteSchemaRequest {

                /**
                 * Constructs a new DeleteSchemaRequest.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.pubsub.v1.IDeleteSchemaRequest);

                /** DeleteSchemaRequest name. */
                public name: string;

                /**
                 * Creates a new DeleteSchemaRequest instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns DeleteSchemaRequest instance
                 */
                public static create(properties?: google.pubsub.v1.IDeleteSchemaRequest): google.pubsub.v1.DeleteSchemaRequest;

                /**
                 * Encodes the specified DeleteSchemaRequest message. Does not implicitly {@link google.pubsub.v1.DeleteSchemaRequest.verify|verify} messages.
                 * @param message DeleteSchemaRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.pubsub.v1.IDeleteSchemaRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified DeleteSchemaRequest message, length delimited. Does not implicitly {@link google.pubsub.v1.DeleteSchemaRequest.verify|verify} messages.
                 * @param message DeleteSchemaRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.pubsub.v1.IDeleteSchemaRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a DeleteSchemaRequest message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns DeleteSchemaRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.pubsub.v1.DeleteSchemaRequest;

                /**
                 * Decodes a DeleteSchemaRequest message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns DeleteSchemaRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.pubsub.v1.DeleteSchemaRequest;

                /**
                 * Verifies a DeleteSchemaRequest message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a DeleteSchemaRequest message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns DeleteSchemaRequest
                 */
                public static fromObject(object: { [k: string]: any }): google.pubsub.v1.DeleteSchemaRequest;

                /**
                 * Creates a plain object from a DeleteSchemaRequest message. Also converts values to other types if specified.
                 * @param message DeleteSchemaRequest
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.pubsub.v1.DeleteSchemaRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this DeleteSchemaRequest to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a ValidateSchemaRequest. */
            interface IValidateSchemaRequest {

                /** ValidateSchemaRequest parent */
                parent?: (string|null);

                /** ValidateSchemaRequest schema */
                schema?: (google.pubsub.v1.ISchema|null);
            }

            /** Represents a ValidateSchemaRequest. */
            class ValidateSchemaRequest implements IValidateSchemaRequest {

                /**
                 * Constructs a new ValidateSchemaRequest.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.pubsub.v1.IValidateSchemaRequest);

                /** ValidateSchemaRequest parent. */
                public parent: string;

                /** ValidateSchemaRequest schema. */
                public schema?: (google.pubsub.v1.ISchema|null);

                /**
                 * Creates a new ValidateSchemaRequest instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns ValidateSchemaRequest instance
                 */
                public static create(properties?: google.pubsub.v1.IValidateSchemaRequest): google.pubsub.v1.ValidateSchemaRequest;

                /**
                 * Encodes the specified ValidateSchemaRequest message. Does not implicitly {@link google.pubsub.v1.ValidateSchemaRequest.verify|verify} messages.
                 * @param message ValidateSchemaRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.pubsub.v1.IValidateSchemaRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ValidateSchemaRequest message, length delimited. Does not implicitly {@link google.pubsub.v1.ValidateSchemaRequest.verify|verify} messages.
                 * @param message ValidateSchemaRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.pubsub.v1.IValidateSchemaRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a ValidateSchemaRequest message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns ValidateSchemaRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.pubsub.v1.ValidateSchemaRequest;

                /**
                 * Decodes a ValidateSchemaRequest message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns ValidateSchemaRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.pubsub.v1.ValidateSchemaRequest;

                /**
                 * Verifies a ValidateSchemaRequest message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a ValidateSchemaRequest message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns ValidateSchemaRequest
                 */
                public static fromObject(object: { [k: string]: any }): google.pubsub.v1.ValidateSchemaRequest;

                /**
                 * Creates a plain object from a ValidateSchemaRequest message. Also converts values to other types if specified.
                 * @param message ValidateSchemaRequest
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.pubsub.v1.ValidateSchemaRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this ValidateSchemaRequest to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a ValidateSchemaResponse. */
            interface IValidateSchemaResponse {
            }

            /** Represents a ValidateSchemaResponse. */
            class ValidateSchemaResponse implements IValidateSchemaResponse {

                /**
                 * Constructs a new ValidateSchemaResponse.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.pubsub.v1.IValidateSchemaResponse);

                /**
                 * Creates a new ValidateSchemaResponse instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns ValidateSchemaResponse instance
                 */
                public static create(properties?: google.pubsub.v1.IValidateSchemaResponse): google.pubsub.v1.ValidateSchemaResponse;

                /**
                 * Encodes the specified ValidateSchemaResponse message. Does not implicitly {@link google.pubsub.v1.ValidateSchemaResponse.verify|verify} messages.
                 * @param message ValidateSchemaResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.pubsub.v1.IValidateSchemaResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ValidateSchemaResponse message, length delimited. Does not implicitly {@link google.pubsub.v1.ValidateSchemaResponse.verify|verify} messages.
                 * @param message ValidateSchemaResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.pubsub.v1.IValidateSchemaResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a ValidateSchemaResponse message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns ValidateSchemaResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.pubsub.v1.ValidateSchemaResponse;

                /**
                 * Decodes a ValidateSchemaResponse message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns ValidateSchemaResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.pubsub.v1.ValidateSchemaResponse;

                /**
                 * Verifies a ValidateSchemaResponse message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a ValidateSchemaResponse message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns ValidateSchemaResponse
                 */
                public static fromObject(object: { [k: string]: any }): google.pubsub.v1.ValidateSchemaResponse;

                /**
                 * Creates a plain object from a ValidateSchemaResponse message. Also converts values to other types if specified.
                 * @param message ValidateSchemaResponse
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.pubsub.v1.ValidateSchemaResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this ValidateSchemaResponse to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a ValidateMessageRequest. */
            interface IValidateMessageRequest {

                /** ValidateMessageRequest parent */
                parent?: (string|null);

                /** ValidateMessageRequest name */
                name?: (string|null);

                /** ValidateMessageRequest schema */
                schema?: (google.pubsub.v1.ISchema|null);

                /** ValidateMessageRequest message */
                message?: (Uint8Array|string|null);

                /** ValidateMessageRequest encoding */
                encoding?: (google.pubsub.v1.Encoding|keyof typeof google.pubsub.v1.Encoding|null);
            }

            /** Represents a ValidateMessageRequest. */
            class ValidateMessageRequest implements IValidateMessageRequest {

                /**
                 * Constructs a new ValidateMessageRequest.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.pubsub.v1.IValidateMessageRequest);

                /** ValidateMessageRequest parent. */
                public parent: string;

                /** ValidateMessageRequest name. */
                public name?: (string|null);

                /** ValidateMessageRequest schema. */
                public schema?: (google.pubsub.v1.ISchema|null);

                /** ValidateMessageRequest message. */
                public message: (Uint8Array|string);

                /** ValidateMessageRequest encoding. */
                public encoding: (google.pubsub.v1.Encoding|keyof typeof google.pubsub.v1.Encoding);

                /** ValidateMessageRequest schemaSpec. */
                public schemaSpec?: ("name"|"schema");

                /**
                 * Creates a new ValidateMessageRequest instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns ValidateMessageRequest instance
                 */
                public static create(properties?: google.pubsub.v1.IValidateMessageRequest): google.pubsub.v1.ValidateMessageRequest;

                /**
                 * Encodes the specified ValidateMessageRequest message. Does not implicitly {@link google.pubsub.v1.ValidateMessageRequest.verify|verify} messages.
                 * @param message ValidateMessageRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.pubsub.v1.IValidateMessageRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ValidateMessageRequest message, length delimited. Does not implicitly {@link google.pubsub.v1.ValidateMessageRequest.verify|verify} messages.
                 * @param message ValidateMessageRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.pubsub.v1.IValidateMessageRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a ValidateMessageRequest message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns ValidateMessageRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.pubsub.v1.ValidateMessageRequest;

                /**
                 * Decodes a ValidateMessageRequest message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns ValidateMessageRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.pubsub.v1.ValidateMessageRequest;

                /**
                 * Verifies a ValidateMessageRequest message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a ValidateMessageRequest message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns ValidateMessageRequest
                 */
                public static fromObject(object: { [k: string]: any }): google.pubsub.v1.ValidateMessageRequest;

                /**
                 * Creates a plain object from a ValidateMessageRequest message. Also converts values to other types if specified.
                 * @param message ValidateMessageRequest
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.pubsub.v1.ValidateMessageRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this ValidateMessageRequest to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a ValidateMessageResponse. */
            interface IValidateMessageResponse {
            }

            /** Represents a ValidateMessageResponse. */
            class ValidateMessageResponse implements IValidateMessageResponse {

                /**
                 * Constructs a new ValidateMessageResponse.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.pubsub.v1.IValidateMessageResponse);

                /**
                 * Creates a new ValidateMessageResponse instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns ValidateMessageResponse instance
                 */
                public static create(properties?: google.pubsub.v1.IValidateMessageResponse): google.pubsub.v1.ValidateMessageResponse;

                /**
                 * Encodes the specified ValidateMessageResponse message. Does not implicitly {@link google.pubsub.v1.ValidateMessageResponse.verify|verify} messages.
                 * @param message ValidateMessageResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.pubsub.v1.IValidateMessageResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ValidateMessageResponse message, length delimited. Does not implicitly {@link google.pubsub.v1.ValidateMessageResponse.verify|verify} messages.
                 * @param message ValidateMessageResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.pubsub.v1.IValidateMessageResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a ValidateMessageResponse message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns ValidateMessageResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.pubsub.v1.ValidateMessageResponse;

                /**
                 * Decodes a ValidateMessageResponse message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns ValidateMessageResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.pubsub.v1.ValidateMessageResponse;

                /**
                 * Verifies a ValidateMessageResponse message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a ValidateMessageResponse message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns ValidateMessageResponse
                 */
                public static fromObject(object: { [k: string]: any }): google.pubsub.v1.ValidateMessageResponse;

                /**
                 * Creates a plain object from a ValidateMessageResponse message. Also converts values to other types if specified.
                 * @param message ValidateMessageResponse
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.pubsub.v1.ValidateMessageResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this ValidateMessageResponse to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Encoding enum. */
            enum Encoding {
                ENCODING_UNSPECIFIED = 0,
                JSON = 1,
                BINARY = 2
            }
        }
    }

    /** Namespace api. */
    namespace api {

        /** Properties of a Http. */
        interface IHttp {

            /** Http rules */
            rules?: (google.api.IHttpRule[]|null);

            /** Http fullyDecodeReservedExpansion */
            fullyDecodeReservedExpansion?: (boolean|null);
        }

        /** Represents a Http. */
        class Http implements IHttp {

            /**
             * Constructs a new Http.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.api.IHttp);

            /** Http rules. */
            public rules: google.api.IHttpRule[];

            /** Http fullyDecodeReservedExpansion. */
            public fullyDecodeReservedExpansion: boolean;

            /**
             * Creates a new Http instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Http instance
             */
            public static create(properties?: google.api.IHttp): google.api.Http;

            /**
             * Encodes the specified Http message. Does not implicitly {@link google.api.Http.verify|verify} messages.
             * @param message Http message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.api.IHttp, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Http message, length delimited. Does not implicitly {@link google.api.Http.verify|verify} messages.
             * @param message Http message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.api.IHttp, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Http message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Http
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.api.Http;

            /**
             * Decodes a Http message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Http
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.api.Http;

            /**
             * Verifies a Http message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Http message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Http
             */
            public static fromObject(object: { [k: string]: any }): google.api.Http;

            /**
             * Creates a plain object from a Http message. Also converts values to other types if specified.
             * @param message Http
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.api.Http, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Http to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a HttpRule. */
        interface IHttpRule {

            /** HttpRule selector */
            selector?: (string|null);

            /** HttpRule get */
            get?: (string|null);

            /** HttpRule put */
            put?: (string|null);

            /** HttpRule post */
            post?: (string|null);

            /** HttpRule delete */
            "delete"?: (string|null);

            /** HttpRule patch */
            patch?: (string|null);

            /** HttpRule custom */
            custom?: (google.api.ICustomHttpPattern|null);

            /** HttpRule body */
            body?: (string|null);

            /** HttpRule responseBody */
            responseBody?: (string|null);

            /** HttpRule additionalBindings */
            additionalBindings?: (google.api.IHttpRule[]|null);
        }

        /** Represents a HttpRule. */
        class HttpRule implements IHttpRule {

            /**
             * Constructs a new HttpRule.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.api.IHttpRule);

            /** HttpRule selector. */
            public selector: string;

            /** HttpRule get. */
            public get?: (string|null);

            /** HttpRule put. */
            public put?: (string|null);

            /** HttpRule post. */
            public post?: (string|null);

            /** HttpRule delete. */
            public delete?: (string|null);

            /** HttpRule patch. */
            public patch?: (string|null);

            /** HttpRule custom. */
            public custom?: (google.api.ICustomHttpPattern|null);

            /** HttpRule body. */
            public body: string;

            /** HttpRule responseBody. */
            public responseBody: string;

            /** HttpRule additionalBindings. */
            public additionalBindings: google.api.IHttpRule[];

            /** HttpRule pattern. */
            public pattern?: ("get"|"put"|"post"|"delete"|"patch"|"custom");

            /**
             * Creates a new HttpRule instance using the specified properties.
             * @param [properties] Properties to set
             * @returns HttpRule instance
             */
            public static create(properties?: google.api.IHttpRule): google.api.HttpRule;

            /**
             * Encodes the specified HttpRule message. Does not implicitly {@link google.api.HttpRule.verify|verify} messages.
             * @param message HttpRule message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.api.IHttpRule, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified HttpRule message, length delimited. Does not implicitly {@link google.api.HttpRule.verify|verify} messages.
             * @param message HttpRule message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.api.IHttpRule, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a HttpRule message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns HttpRule
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.api.HttpRule;

            /**
             * Decodes a HttpRule message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns HttpRule
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.api.HttpRule;

            /**
             * Verifies a HttpRule message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a HttpRule message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns HttpRule
             */
            public static fromObject(object: { [k: string]: any }): google.api.HttpRule;

            /**
             * Creates a plain object from a HttpRule message. Also converts values to other types if specified.
             * @param message HttpRule
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.api.HttpRule, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this HttpRule to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a CustomHttpPattern. */
        interface ICustomHttpPattern {

            /** CustomHttpPattern kind */
            kind?: (string|null);

            /** CustomHttpPattern path */
            path?: (string|null);
        }

        /** Represents a CustomHttpPattern. */
        class CustomHttpPattern implements ICustomHttpPattern {

            /**
             * Constructs a new CustomHttpPattern.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.api.ICustomHttpPattern);

            /** CustomHttpPattern kind. */
            public kind: string;

            /** CustomHttpPattern path. */
            public path: string;

            /**
             * Creates a new CustomHttpPattern instance using the specified properties.
             * @param [properties] Properties to set
             * @returns CustomHttpPattern instance
             */
            public static create(properties?: google.api.ICustomHttpPattern): google.api.CustomHttpPattern;

            /**
             * Encodes the specified CustomHttpPattern message. Does not implicitly {@link google.api.CustomHttpPattern.verify|verify} messages.
             * @param message CustomHttpPattern message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.api.ICustomHttpPattern, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified CustomHttpPattern message, length delimited. Does not implicitly {@link google.api.CustomHttpPattern.verify|verify} messages.
             * @param message CustomHttpPattern message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.api.ICustomHttpPattern, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a CustomHttpPattern message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns CustomHttpPattern
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.api.CustomHttpPattern;

            /**
             * Decodes a CustomHttpPattern message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns CustomHttpPattern
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.api.CustomHttpPattern;

            /**
             * Verifies a CustomHttpPattern message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a CustomHttpPattern message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns CustomHttpPattern
             */
            public static fromObject(object: { [k: string]: any }): google.api.CustomHttpPattern;

            /**
             * Creates a plain object from a CustomHttpPattern message. Also converts values to other types if specified.
             * @param message CustomHttpPattern
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.api.CustomHttpPattern, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this CustomHttpPattern to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** FieldBehavior enum. */
        enum FieldBehavior {
            FIELD_BEHAVIOR_UNSPECIFIED = 0,
            OPTIONAL = 1,
            REQUIRED = 2,
            OUTPUT_ONLY = 3,
            INPUT_ONLY = 4,
            IMMUTABLE = 5,
            UNORDERED_LIST = 6,
            NON_EMPTY_DEFAULT = 7
        }

        /** Properties of a ResourceDescriptor. */
        interface IResourceDescriptor {

            /** ResourceDescriptor type */
            type?: (string|null);

            /** ResourceDescriptor pattern */
            pattern?: (string[]|null);

            /** ResourceDescriptor nameField */
            nameField?: (string|null);

            /** ResourceDescriptor history */
            history?: (google.api.ResourceDescriptor.History|keyof typeof google.api.ResourceDescriptor.History|null);

            /** ResourceDescriptor plural */
            plural?: (string|null);

            /** ResourceDescriptor singular */
            singular?: (string|null);

            /** ResourceDescriptor style */
            style?: (google.api.ResourceDescriptor.Style[]|null);
        }

        /** Represents a ResourceDescriptor. */
        class ResourceDescriptor implements IResourceDescriptor {

            /**
             * Constructs a new ResourceDescriptor.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.api.IResourceDescriptor);

            /** ResourceDescriptor type. */
            public type: string;

            /** ResourceDescriptor pattern. */
            public pattern: string[];

            /** ResourceDescriptor nameField. */
            public nameField: string;

            /** ResourceDescriptor history. */
            public history: (google.api.ResourceDescriptor.History|keyof typeof google.api.ResourceDescriptor.History);

            /** ResourceDescriptor plural. */
            public plural: string;

            /** ResourceDescriptor singular. */
            public singular: string;

            /** ResourceDescriptor style. */
            public style: google.api.ResourceDescriptor.Style[];

            /**
             * Creates a new ResourceDescriptor instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ResourceDescriptor instance
             */
            public static create(properties?: google.api.IResourceDescriptor): google.api.ResourceDescriptor;

            /**
             * Encodes the specified ResourceDescriptor message. Does not implicitly {@link google.api.ResourceDescriptor.verify|verify} messages.
             * @param message ResourceDescriptor message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.api.IResourceDescriptor, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ResourceDescriptor message, length delimited. Does not implicitly {@link google.api.ResourceDescriptor.verify|verify} messages.
             * @param message ResourceDescriptor message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.api.IResourceDescriptor, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ResourceDescriptor message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ResourceDescriptor
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.api.ResourceDescriptor;

            /**
             * Decodes a ResourceDescriptor message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ResourceDescriptor
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.api.ResourceDescriptor;

            /**
             * Verifies a ResourceDescriptor message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a ResourceDescriptor message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ResourceDescriptor
             */
            public static fromObject(object: { [k: string]: any }): google.api.ResourceDescriptor;

            /**
             * Creates a plain object from a ResourceDescriptor message. Also converts values to other types if specified.
             * @param message ResourceDescriptor
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.api.ResourceDescriptor, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ResourceDescriptor to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        namespace ResourceDescriptor {

            /** History enum. */
            enum History {
                HISTORY_UNSPECIFIED = 0,
                ORIGINALLY_SINGLE_PATTERN = 1,
                FUTURE_MULTI_PATTERN = 2
            }

            /** Style enum. */
            enum Style {
                STYLE_UNSPECIFIED = 0,
                DECLARATIVE_FRIENDLY = 1
            }
        }

        /** Properties of a ResourceReference. */
        interface IResourceReference {

            /** ResourceReference type */
            type?: (string|null);

            /** ResourceReference childType */
            childType?: (string|null);
        }

        /** Represents a ResourceReference. */
        class ResourceReference implements IResourceReference {

            /**
             * Constructs a new ResourceReference.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.api.IResourceReference);

            /** ResourceReference type. */
            public type: string;

            /** ResourceReference childType. */
            public childType: string;

            /**
             * Creates a new ResourceReference instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ResourceReference instance
             */
            public static create(properties?: google.api.IResourceReference): google.api.ResourceReference;

            /**
             * Encodes the specified ResourceReference message. Does not implicitly {@link google.api.ResourceReference.verify|verify} messages.
             * @param message ResourceReference message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.api.IResourceReference, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ResourceReference message, length delimited. Does not implicitly {@link google.api.ResourceReference.verify|verify} messages.
             * @param message ResourceReference message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.api.IResourceReference, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ResourceReference message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ResourceReference
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.api.ResourceReference;

            /**
             * Decodes a ResourceReference message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ResourceReference
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.api.ResourceReference;

            /**
             * Verifies a ResourceReference message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a ResourceReference message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ResourceReference
             */
            public static fromObject(object: { [k: string]: any }): google.api.ResourceReference;

            /**
             * Creates a plain object from a ResourceReference message. Also converts values to other types if specified.
             * @param message ResourceReference
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.api.ResourceReference, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ResourceReference to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }
    }

    /** Namespace protobuf. */
    namespace protobuf {

        /** Properties of a FileDescriptorSet. */
        interface IFileDescriptorSet {

            /** FileDescriptorSet file */
            file?: (google.protobuf.IFileDescriptorProto[]|null);
        }

        /** Represents a FileDescriptorSet. */
        class FileDescriptorSet implements IFileDescriptorSet {

            /**
             * Constructs a new FileDescriptorSet.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IFileDescriptorSet);

            /** FileDescriptorSet file. */
            public file: google.protobuf.IFileDescriptorProto[];

            /**
             * Creates a new FileDescriptorSet instance using the specified properties.
             * @param [properties] Properties to set
             * @returns FileDescriptorSet instance
             */
            public static create(properties?: google.protobuf.IFileDescriptorSet): google.protobuf.FileDescriptorSet;

            /**
             * Encodes the specified FileDescriptorSet message. Does not implicitly {@link google.protobuf.FileDescriptorSet.verify|verify} messages.
             * @param message FileDescriptorSet message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IFileDescriptorSet, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified FileDescriptorSet message, length delimited. Does not implicitly {@link google.protobuf.FileDescriptorSet.verify|verify} messages.
             * @param message FileDescriptorSet message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IFileDescriptorSet, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a FileDescriptorSet message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns FileDescriptorSet
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.FileDescriptorSet;

            /**
             * Decodes a FileDescriptorSet message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns FileDescriptorSet
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.FileDescriptorSet;

            /**
             * Verifies a FileDescriptorSet message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a FileDescriptorSet message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns FileDescriptorSet
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.FileDescriptorSet;

            /**
             * Creates a plain object from a FileDescriptorSet message. Also converts values to other types if specified.
             * @param message FileDescriptorSet
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.FileDescriptorSet, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this FileDescriptorSet to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a FileDescriptorProto. */
        interface IFileDescriptorProto {

            /** FileDescriptorProto name */
            name?: (string|null);

            /** FileDescriptorProto package */
            "package"?: (string|null);

            /** FileDescriptorProto dependency */
            dependency?: (string[]|null);

            /** FileDescriptorProto publicDependency */
            publicDependency?: (number[]|null);

            /** FileDescriptorProto weakDependency */
            weakDependency?: (number[]|null);

            /** FileDescriptorProto messageType */
            messageType?: (google.protobuf.IDescriptorProto[]|null);

            /** FileDescriptorProto enumType */
            enumType?: (google.protobuf.IEnumDescriptorProto[]|null);

            /** FileDescriptorProto service */
            service?: (google.protobuf.IServiceDescriptorProto[]|null);

            /** FileDescriptorProto extension */
            extension?: (google.protobuf.IFieldDescriptorProto[]|null);

            /** FileDescriptorProto options */
            options?: (google.protobuf.IFileOptions|null);

            /** FileDescriptorProto sourceCodeInfo */
            sourceCodeInfo?: (google.protobuf.ISourceCodeInfo|null);

            /** FileDescriptorProto syntax */
            syntax?: (string|null);
        }

        /** Represents a FileDescriptorProto. */
        class FileDescriptorProto implements IFileDescriptorProto {

            /**
             * Constructs a new FileDescriptorProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IFileDescriptorProto);

            /** FileDescriptorProto name. */
            public name: string;

            /** FileDescriptorProto package. */
            public package: string;

            /** FileDescriptorProto dependency. */
            public dependency: string[];

            /** FileDescriptorProto publicDependency. */
            public publicDependency: number[];

            /** FileDescriptorProto weakDependency. */
            public weakDependency: number[];

            /** FileDescriptorProto messageType. */
            public messageType: google.protobuf.IDescriptorProto[];

            /** FileDescriptorProto enumType. */
            public enumType: google.protobuf.IEnumDescriptorProto[];

            /** FileDescriptorProto service. */
            public service: google.protobuf.IServiceDescriptorProto[];

            /** FileDescriptorProto extension. */
            public extension: google.protobuf.IFieldDescriptorProto[];

            /** FileDescriptorProto options. */
            public options?: (google.protobuf.IFileOptions|null);

            /** FileDescriptorProto sourceCodeInfo. */
            public sourceCodeInfo?: (google.protobuf.ISourceCodeInfo|null);

            /** FileDescriptorProto syntax. */
            public syntax: string;

            /**
             * Creates a new FileDescriptorProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns FileDescriptorProto instance
             */
            public static create(properties?: google.protobuf.IFileDescriptorProto): google.protobuf.FileDescriptorProto;

            /**
             * Encodes the specified FileDescriptorProto message. Does not implicitly {@link google.protobuf.FileDescriptorProto.verify|verify} messages.
             * @param message FileDescriptorProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IFileDescriptorProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified FileDescriptorProto message, length delimited. Does not implicitly {@link google.protobuf.FileDescriptorProto.verify|verify} messages.
             * @param message FileDescriptorProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IFileDescriptorProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a FileDescriptorProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns FileDescriptorProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.FileDescriptorProto;

            /**
             * Decodes a FileDescriptorProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns FileDescriptorProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.FileDescriptorProto;

            /**
             * Verifies a FileDescriptorProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a FileDescriptorProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns FileDescriptorProto
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.FileDescriptorProto;

            /**
             * Creates a plain object from a FileDescriptorProto message. Also converts values to other types if specified.
             * @param message FileDescriptorProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.FileDescriptorProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this FileDescriptorProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a DescriptorProto. */
        interface IDescriptorProto {

            /** DescriptorProto name */
            name?: (string|null);

            /** DescriptorProto field */
            field?: (google.protobuf.IFieldDescriptorProto[]|null);

            /** DescriptorProto extension */
            extension?: (google.protobuf.IFieldDescriptorProto[]|null);

            /** DescriptorProto nestedType */
            nestedType?: (google.protobuf.IDescriptorProto[]|null);

            /** DescriptorProto enumType */
            enumType?: (google.protobuf.IEnumDescriptorProto[]|null);

            /** DescriptorProto extensionRange */
            extensionRange?: (google.protobuf.DescriptorProto.IExtensionRange[]|null);

            /** DescriptorProto oneofDecl */
            oneofDecl?: (google.protobuf.IOneofDescriptorProto[]|null);

            /** DescriptorProto options */
            options?: (google.protobuf.IMessageOptions|null);

            /** DescriptorProto reservedRange */
            reservedRange?: (google.protobuf.DescriptorProto.IReservedRange[]|null);

            /** DescriptorProto reservedName */
            reservedName?: (string[]|null);
        }

        /** Represents a DescriptorProto. */
        class DescriptorProto implements IDescriptorProto {

            /**
             * Constructs a new DescriptorProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IDescriptorProto);

            /** DescriptorProto name. */
            public name: string;

            /** DescriptorProto field. */
            public field: google.protobuf.IFieldDescriptorProto[];

            /** DescriptorProto extension. */
            public extension: google.protobuf.IFieldDescriptorProto[];

            /** DescriptorProto nestedType. */
            public nestedType: google.protobuf.IDescriptorProto[];

            /** DescriptorProto enumType. */
            public enumType: google.protobuf.IEnumDescriptorProto[];

            /** DescriptorProto extensionRange. */
            public extensionRange: google.protobuf.DescriptorProto.IExtensionRange[];

            /** DescriptorProto oneofDecl. */
            public oneofDecl: google.protobuf.IOneofDescriptorProto[];

            /** DescriptorProto options. */
            public options?: (google.protobuf.IMessageOptions|null);

            /** DescriptorProto reservedRange. */
            public reservedRange: google.protobuf.DescriptorProto.IReservedRange[];

            /** DescriptorProto reservedName. */
            public reservedName: string[];

            /**
             * Creates a new DescriptorProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns DescriptorProto instance
             */
            public static create(properties?: google.protobuf.IDescriptorProto): google.protobuf.DescriptorProto;

            /**
             * Encodes the specified DescriptorProto message. Does not implicitly {@link google.protobuf.DescriptorProto.verify|verify} messages.
             * @param message DescriptorProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IDescriptorProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified DescriptorProto message, length delimited. Does not implicitly {@link google.protobuf.DescriptorProto.verify|verify} messages.
             * @param message DescriptorProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IDescriptorProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a DescriptorProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns DescriptorProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.DescriptorProto;

            /**
             * Decodes a DescriptorProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns DescriptorProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.DescriptorProto;

            /**
             * Verifies a DescriptorProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a DescriptorProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns DescriptorProto
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.DescriptorProto;

            /**
             * Creates a plain object from a DescriptorProto message. Also converts values to other types if specified.
             * @param message DescriptorProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.DescriptorProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this DescriptorProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        namespace DescriptorProto {

            /** Properties of an ExtensionRange. */
            interface IExtensionRange {

                /** ExtensionRange start */
                start?: (number|null);

                /** ExtensionRange end */
                end?: (number|null);

                /** ExtensionRange options */
                options?: (google.protobuf.IExtensionRangeOptions|null);
            }

            /** Represents an ExtensionRange. */
            class ExtensionRange implements IExtensionRange {

                /**
                 * Constructs a new ExtensionRange.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.protobuf.DescriptorProto.IExtensionRange);

                /** ExtensionRange start. */
                public start: number;

                /** ExtensionRange end. */
                public end: number;

                /** ExtensionRange options. */
                public options?: (google.protobuf.IExtensionRangeOptions|null);

                /**
                 * Creates a new ExtensionRange instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns ExtensionRange instance
                 */
                public static create(properties?: google.protobuf.DescriptorProto.IExtensionRange): google.protobuf.DescriptorProto.ExtensionRange;

                /**
                 * Encodes the specified ExtensionRange message. Does not implicitly {@link google.protobuf.DescriptorProto.ExtensionRange.verify|verify} messages.
                 * @param message ExtensionRange message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.protobuf.DescriptorProto.IExtensionRange, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ExtensionRange message, length delimited. Does not implicitly {@link google.protobuf.DescriptorProto.ExtensionRange.verify|verify} messages.
                 * @param message ExtensionRange message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.protobuf.DescriptorProto.IExtensionRange, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an ExtensionRange message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns ExtensionRange
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.DescriptorProto.ExtensionRange;

                /**
                 * Decodes an ExtensionRange message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns ExtensionRange
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.DescriptorProto.ExtensionRange;

                /**
                 * Verifies an ExtensionRange message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an ExtensionRange message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns ExtensionRange
                 */
                public static fromObject(object: { [k: string]: any }): google.protobuf.DescriptorProto.ExtensionRange;

                /**
                 * Creates a plain object from an ExtensionRange message. Also converts values to other types if specified.
                 * @param message ExtensionRange
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.protobuf.DescriptorProto.ExtensionRange, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this ExtensionRange to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a ReservedRange. */
            interface IReservedRange {

                /** ReservedRange start */
                start?: (number|null);

                /** ReservedRange end */
                end?: (number|null);
            }

            /** Represents a ReservedRange. */
            class ReservedRange implements IReservedRange {

                /**
                 * Constructs a new ReservedRange.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.protobuf.DescriptorProto.IReservedRange);

                /** ReservedRange start. */
                public start: number;

                /** ReservedRange end. */
                public end: number;

                /**
                 * Creates a new ReservedRange instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns ReservedRange instance
                 */
                public static create(properties?: google.protobuf.DescriptorProto.IReservedRange): google.protobuf.DescriptorProto.ReservedRange;

                /**
                 * Encodes the specified ReservedRange message. Does not implicitly {@link google.protobuf.DescriptorProto.ReservedRange.verify|verify} messages.
                 * @param message ReservedRange message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.protobuf.DescriptorProto.IReservedRange, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ReservedRange message, length delimited. Does not implicitly {@link google.protobuf.DescriptorProto.ReservedRange.verify|verify} messages.
                 * @param message ReservedRange message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.protobuf.DescriptorProto.IReservedRange, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a ReservedRange message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns ReservedRange
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.DescriptorProto.ReservedRange;

                /**
                 * Decodes a ReservedRange message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns ReservedRange
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.DescriptorProto.ReservedRange;

                /**
                 * Verifies a ReservedRange message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a ReservedRange message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns ReservedRange
                 */
                public static fromObject(object: { [k: string]: any }): google.protobuf.DescriptorProto.ReservedRange;

                /**
                 * Creates a plain object from a ReservedRange message. Also converts values to other types if specified.
                 * @param message ReservedRange
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.protobuf.DescriptorProto.ReservedRange, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this ReservedRange to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }
        }

        /** Properties of an ExtensionRangeOptions. */
        interface IExtensionRangeOptions {

            /** ExtensionRangeOptions uninterpretedOption */
            uninterpretedOption?: (google.protobuf.IUninterpretedOption[]|null);
        }

        /** Represents an ExtensionRangeOptions. */
        class ExtensionRangeOptions implements IExtensionRangeOptions {

            /**
             * Constructs a new ExtensionRangeOptions.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IExtensionRangeOptions);

            /** ExtensionRangeOptions uninterpretedOption. */
            public uninterpretedOption: google.protobuf.IUninterpretedOption[];

            /**
             * Creates a new ExtensionRangeOptions instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ExtensionRangeOptions instance
             */
            public static create(properties?: google.protobuf.IExtensionRangeOptions): google.protobuf.ExtensionRangeOptions;

            /**
             * Encodes the specified ExtensionRangeOptions message. Does not implicitly {@link google.protobuf.ExtensionRangeOptions.verify|verify} messages.
             * @param message ExtensionRangeOptions message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IExtensionRangeOptions, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ExtensionRangeOptions message, length delimited. Does not implicitly {@link google.protobuf.ExtensionRangeOptions.verify|verify} messages.
             * @param message ExtensionRangeOptions message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IExtensionRangeOptions, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an ExtensionRangeOptions message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ExtensionRangeOptions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.ExtensionRangeOptions;

            /**
             * Decodes an ExtensionRangeOptions message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ExtensionRangeOptions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.ExtensionRangeOptions;

            /**
             * Verifies an ExtensionRangeOptions message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an ExtensionRangeOptions message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ExtensionRangeOptions
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.ExtensionRangeOptions;

            /**
             * Creates a plain object from an ExtensionRangeOptions message. Also converts values to other types if specified.
             * @param message ExtensionRangeOptions
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.ExtensionRangeOptions, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ExtensionRangeOptions to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a FieldDescriptorProto. */
        interface IFieldDescriptorProto {

            /** FieldDescriptorProto name */
            name?: (string|null);

            /** FieldDescriptorProto number */
            number?: (number|null);

            /** FieldDescriptorProto label */
            label?: (google.protobuf.FieldDescriptorProto.Label|keyof typeof google.protobuf.FieldDescriptorProto.Label|null);

            /** FieldDescriptorProto type */
            type?: (google.protobuf.FieldDescriptorProto.Type|keyof typeof google.protobuf.FieldDescriptorProto.Type|null);

            /** FieldDescriptorProto typeName */
            typeName?: (string|null);

            /** FieldDescriptorProto extendee */
            extendee?: (string|null);

            /** FieldDescriptorProto defaultValue */
            defaultValue?: (string|null);

            /** FieldDescriptorProto oneofIndex */
            oneofIndex?: (number|null);

            /** FieldDescriptorProto jsonName */
            jsonName?: (string|null);

            /** FieldDescriptorProto options */
            options?: (google.protobuf.IFieldOptions|null);

            /** FieldDescriptorProto proto3Optional */
            proto3Optional?: (boolean|null);
        }

        /** Represents a FieldDescriptorProto. */
        class FieldDescriptorProto implements IFieldDescriptorProto {

            /**
             * Constructs a new FieldDescriptorProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IFieldDescriptorProto);

            /** FieldDescriptorProto name. */
            public name: string;

            /** FieldDescriptorProto number. */
            public number: number;

            /** FieldDescriptorProto label. */
            public label: (google.protobuf.FieldDescriptorProto.Label|keyof typeof google.protobuf.FieldDescriptorProto.Label);

            /** FieldDescriptorProto type. */
            public type: (google.protobuf.FieldDescriptorProto.Type|keyof typeof google.protobuf.FieldDescriptorProto.Type);

            /** FieldDescriptorProto typeName. */
            public typeName: string;

            /** FieldDescriptorProto extendee. */
            public extendee: string;

            /** FieldDescriptorProto defaultValue. */
            public defaultValue: string;

            /** FieldDescriptorProto oneofIndex. */
            public oneofIndex: number;

            /** FieldDescriptorProto jsonName. */
            public jsonName: string;

            /** FieldDescriptorProto options. */
            public options?: (google.protobuf.IFieldOptions|null);

            /** FieldDescriptorProto proto3Optional. */
            public proto3Optional: boolean;

            /**
             * Creates a new FieldDescriptorProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns FieldDescriptorProto instance
             */
            public static create(properties?: google.protobuf.IFieldDescriptorProto): google.protobuf.FieldDescriptorProto;

            /**
             * Encodes the specified FieldDescriptorProto message. Does not implicitly {@link google.protobuf.FieldDescriptorProto.verify|verify} messages.
             * @param message FieldDescriptorProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IFieldDescriptorProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified FieldDescriptorProto message, length delimited. Does not implicitly {@link google.protobuf.FieldDescriptorProto.verify|verify} messages.
             * @param message FieldDescriptorProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IFieldDescriptorProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a FieldDescriptorProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns FieldDescriptorProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.FieldDescriptorProto;

            /**
             * Decodes a FieldDescriptorProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns FieldDescriptorProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.FieldDescriptorProto;

            /**
             * Verifies a FieldDescriptorProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a FieldDescriptorProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns FieldDescriptorProto
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.FieldDescriptorProto;

            /**
             * Creates a plain object from a FieldDescriptorProto message. Also converts values to other types if specified.
             * @param message FieldDescriptorProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.FieldDescriptorProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this FieldDescriptorProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        namespace FieldDescriptorProto {

            /** Type enum. */
            enum Type {
                TYPE_DOUBLE = 1,
                TYPE_FLOAT = 2,
                TYPE_INT64 = 3,
                TYPE_UINT64 = 4,
                TYPE_INT32 = 5,
                TYPE_FIXED64 = 6,
                TYPE_FIXED32 = 7,
                TYPE_BOOL = 8,
                TYPE_STRING = 9,
                TYPE_GROUP = 10,
                TYPE_MESSAGE = 11,
                TYPE_BYTES = 12,
                TYPE_UINT32 = 13,
                TYPE_ENUM = 14,
                TYPE_SFIXED32 = 15,
                TYPE_SFIXED64 = 16,
                TYPE_SINT32 = 17,
                TYPE_SINT64 = 18
            }

            /** Label enum. */
            enum Label {
                LABEL_OPTIONAL = 1,
                LABEL_REQUIRED = 2,
                LABEL_REPEATED = 3
            }
        }

        /** Properties of an OneofDescriptorProto. */
        interface IOneofDescriptorProto {

            /** OneofDescriptorProto name */
            name?: (string|null);

            /** OneofDescriptorProto options */
            options?: (google.protobuf.IOneofOptions|null);
        }

        /** Represents an OneofDescriptorProto. */
        class OneofDescriptorProto implements IOneofDescriptorProto {

            /**
             * Constructs a new OneofDescriptorProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IOneofDescriptorProto);

            /** OneofDescriptorProto name. */
            public name: string;

            /** OneofDescriptorProto options. */
            public options?: (google.protobuf.IOneofOptions|null);

            /**
             * Creates a new OneofDescriptorProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns OneofDescriptorProto instance
             */
            public static create(properties?: google.protobuf.IOneofDescriptorProto): google.protobuf.OneofDescriptorProto;

            /**
             * Encodes the specified OneofDescriptorProto message. Does not implicitly {@link google.protobuf.OneofDescriptorProto.verify|verify} messages.
             * @param message OneofDescriptorProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IOneofDescriptorProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified OneofDescriptorProto message, length delimited. Does not implicitly {@link google.protobuf.OneofDescriptorProto.verify|verify} messages.
             * @param message OneofDescriptorProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IOneofDescriptorProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an OneofDescriptorProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns OneofDescriptorProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.OneofDescriptorProto;

            /**
             * Decodes an OneofDescriptorProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns OneofDescriptorProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.OneofDescriptorProto;

            /**
             * Verifies an OneofDescriptorProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an OneofDescriptorProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns OneofDescriptorProto
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.OneofDescriptorProto;

            /**
             * Creates a plain object from an OneofDescriptorProto message. Also converts values to other types if specified.
             * @param message OneofDescriptorProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.OneofDescriptorProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this OneofDescriptorProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of an EnumDescriptorProto. */
        interface IEnumDescriptorProto {

            /** EnumDescriptorProto name */
            name?: (string|null);

            /** EnumDescriptorProto value */
            value?: (google.protobuf.IEnumValueDescriptorProto[]|null);

            /** EnumDescriptorProto options */
            options?: (google.protobuf.IEnumOptions|null);

            /** EnumDescriptorProto reservedRange */
            reservedRange?: (google.protobuf.EnumDescriptorProto.IEnumReservedRange[]|null);

            /** EnumDescriptorProto reservedName */
            reservedName?: (string[]|null);
        }

        /** Represents an EnumDescriptorProto. */
        class EnumDescriptorProto implements IEnumDescriptorProto {

            /**
             * Constructs a new EnumDescriptorProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IEnumDescriptorProto);

            /** EnumDescriptorProto name. */
            public name: string;

            /** EnumDescriptorProto value. */
            public value: google.protobuf.IEnumValueDescriptorProto[];

            /** EnumDescriptorProto options. */
            public options?: (google.protobuf.IEnumOptions|null);

            /** EnumDescriptorProto reservedRange. */
            public reservedRange: google.protobuf.EnumDescriptorProto.IEnumReservedRange[];

            /** EnumDescriptorProto reservedName. */
            public reservedName: string[];

            /**
             * Creates a new EnumDescriptorProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns EnumDescriptorProto instance
             */
            public static create(properties?: google.protobuf.IEnumDescriptorProto): google.protobuf.EnumDescriptorProto;

            /**
             * Encodes the specified EnumDescriptorProto message. Does not implicitly {@link google.protobuf.EnumDescriptorProto.verify|verify} messages.
             * @param message EnumDescriptorProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IEnumDescriptorProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified EnumDescriptorProto message, length delimited. Does not implicitly {@link google.protobuf.EnumDescriptorProto.verify|verify} messages.
             * @param message EnumDescriptorProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IEnumDescriptorProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an EnumDescriptorProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns EnumDescriptorProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.EnumDescriptorProto;

            /**
             * Decodes an EnumDescriptorProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns EnumDescriptorProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.EnumDescriptorProto;

            /**
             * Verifies an EnumDescriptorProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an EnumDescriptorProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns EnumDescriptorProto
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.EnumDescriptorProto;

            /**
             * Creates a plain object from an EnumDescriptorProto message. Also converts values to other types if specified.
             * @param message EnumDescriptorProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.EnumDescriptorProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this EnumDescriptorProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        namespace EnumDescriptorProto {

            /** Properties of an EnumReservedRange. */
            interface IEnumReservedRange {

                /** EnumReservedRange start */
                start?: (number|null);

                /** EnumReservedRange end */
                end?: (number|null);
            }

            /** Represents an EnumReservedRange. */
            class EnumReservedRange implements IEnumReservedRange {

                /**
                 * Constructs a new EnumReservedRange.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.protobuf.EnumDescriptorProto.IEnumReservedRange);

                /** EnumReservedRange start. */
                public start: number;

                /** EnumReservedRange end. */
                public end: number;

                /**
                 * Creates a new EnumReservedRange instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns EnumReservedRange instance
                 */
                public static create(properties?: google.protobuf.EnumDescriptorProto.IEnumReservedRange): google.protobuf.EnumDescriptorProto.EnumReservedRange;

                /**
                 * Encodes the specified EnumReservedRange message. Does not implicitly {@link google.protobuf.EnumDescriptorProto.EnumReservedRange.verify|verify} messages.
                 * @param message EnumReservedRange message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.protobuf.EnumDescriptorProto.IEnumReservedRange, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified EnumReservedRange message, length delimited. Does not implicitly {@link google.protobuf.EnumDescriptorProto.EnumReservedRange.verify|verify} messages.
                 * @param message EnumReservedRange message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.protobuf.EnumDescriptorProto.IEnumReservedRange, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an EnumReservedRange message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns EnumReservedRange
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.EnumDescriptorProto.EnumReservedRange;

                /**
                 * Decodes an EnumReservedRange message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns EnumReservedRange
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.EnumDescriptorProto.EnumReservedRange;

                /**
                 * Verifies an EnumReservedRange message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an EnumReservedRange message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns EnumReservedRange
                 */
                public static fromObject(object: { [k: string]: any }): google.protobuf.EnumDescriptorProto.EnumReservedRange;

                /**
                 * Creates a plain object from an EnumReservedRange message. Also converts values to other types if specified.
                 * @param message EnumReservedRange
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.protobuf.EnumDescriptorProto.EnumReservedRange, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this EnumReservedRange to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }
        }

        /** Properties of an EnumValueDescriptorProto. */
        interface IEnumValueDescriptorProto {

            /** EnumValueDescriptorProto name */
            name?: (string|null);

            /** EnumValueDescriptorProto number */
            number?: (number|null);

            /** EnumValueDescriptorProto options */
            options?: (google.protobuf.IEnumValueOptions|null);
        }

        /** Represents an EnumValueDescriptorProto. */
        class EnumValueDescriptorProto implements IEnumValueDescriptorProto {

            /**
             * Constructs a new EnumValueDescriptorProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IEnumValueDescriptorProto);

            /** EnumValueDescriptorProto name. */
            public name: string;

            /** EnumValueDescriptorProto number. */
            public number: number;

            /** EnumValueDescriptorProto options. */
            public options?: (google.protobuf.IEnumValueOptions|null);

            /**
             * Creates a new EnumValueDescriptorProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns EnumValueDescriptorProto instance
             */
            public static create(properties?: google.protobuf.IEnumValueDescriptorProto): google.protobuf.EnumValueDescriptorProto;

            /**
             * Encodes the specified EnumValueDescriptorProto message. Does not implicitly {@link google.protobuf.EnumValueDescriptorProto.verify|verify} messages.
             * @param message EnumValueDescriptorProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IEnumValueDescriptorProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified EnumValueDescriptorProto message, length delimited. Does not implicitly {@link google.protobuf.EnumValueDescriptorProto.verify|verify} messages.
             * @param message EnumValueDescriptorProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IEnumValueDescriptorProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an EnumValueDescriptorProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns EnumValueDescriptorProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.EnumValueDescriptorProto;

            /**
             * Decodes an EnumValueDescriptorProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns EnumValueDescriptorProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.EnumValueDescriptorProto;

            /**
             * Verifies an EnumValueDescriptorProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an EnumValueDescriptorProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns EnumValueDescriptorProto
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.EnumValueDescriptorProto;

            /**
             * Creates a plain object from an EnumValueDescriptorProto message. Also converts values to other types if specified.
             * @param message EnumValueDescriptorProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.EnumValueDescriptorProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this EnumValueDescriptorProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a ServiceDescriptorProto. */
        interface IServiceDescriptorProto {

            /** ServiceDescriptorProto name */
            name?: (string|null);

            /** ServiceDescriptorProto method */
            method?: (google.protobuf.IMethodDescriptorProto[]|null);

            /** ServiceDescriptorProto options */
            options?: (google.protobuf.IServiceOptions|null);
        }

        /** Represents a ServiceDescriptorProto. */
        class ServiceDescriptorProto implements IServiceDescriptorProto {

            /**
             * Constructs a new ServiceDescriptorProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IServiceDescriptorProto);

            /** ServiceDescriptorProto name. */
            public name: string;

            /** ServiceDescriptorProto method. */
            public method: google.protobuf.IMethodDescriptorProto[];

            /** ServiceDescriptorProto options. */
            public options?: (google.protobuf.IServiceOptions|null);

            /**
             * Creates a new ServiceDescriptorProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ServiceDescriptorProto instance
             */
            public static create(properties?: google.protobuf.IServiceDescriptorProto): google.protobuf.ServiceDescriptorProto;

            /**
             * Encodes the specified ServiceDescriptorProto message. Does not implicitly {@link google.protobuf.ServiceDescriptorProto.verify|verify} messages.
             * @param message ServiceDescriptorProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IServiceDescriptorProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ServiceDescriptorProto message, length delimited. Does not implicitly {@link google.protobuf.ServiceDescriptorProto.verify|verify} messages.
             * @param message ServiceDescriptorProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IServiceDescriptorProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ServiceDescriptorProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ServiceDescriptorProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.ServiceDescriptorProto;

            /**
             * Decodes a ServiceDescriptorProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ServiceDescriptorProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.ServiceDescriptorProto;

            /**
             * Verifies a ServiceDescriptorProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a ServiceDescriptorProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ServiceDescriptorProto
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.ServiceDescriptorProto;

            /**
             * Creates a plain object from a ServiceDescriptorProto message. Also converts values to other types if specified.
             * @param message ServiceDescriptorProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.ServiceDescriptorProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ServiceDescriptorProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a MethodDescriptorProto. */
        interface IMethodDescriptorProto {

            /** MethodDescriptorProto name */
            name?: (string|null);

            /** MethodDescriptorProto inputType */
            inputType?: (string|null);

            /** MethodDescriptorProto outputType */
            outputType?: (string|null);

            /** MethodDescriptorProto options */
            options?: (google.protobuf.IMethodOptions|null);

            /** MethodDescriptorProto clientStreaming */
            clientStreaming?: (boolean|null);

            /** MethodDescriptorProto serverStreaming */
            serverStreaming?: (boolean|null);
        }

        /** Represents a MethodDescriptorProto. */
        class MethodDescriptorProto implements IMethodDescriptorProto {

            /**
             * Constructs a new MethodDescriptorProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IMethodDescriptorProto);

            /** MethodDescriptorProto name. */
            public name: string;

            /** MethodDescriptorProto inputType. */
            public inputType: string;

            /** MethodDescriptorProto outputType. */
            public outputType: string;

            /** MethodDescriptorProto options. */
            public options?: (google.protobuf.IMethodOptions|null);

            /** MethodDescriptorProto clientStreaming. */
            public clientStreaming: boolean;

            /** MethodDescriptorProto serverStreaming. */
            public serverStreaming: boolean;

            /**
             * Creates a new MethodDescriptorProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns MethodDescriptorProto instance
             */
            public static create(properties?: google.protobuf.IMethodDescriptorProto): google.protobuf.MethodDescriptorProto;

            /**
             * Encodes the specified MethodDescriptorProto message. Does not implicitly {@link google.protobuf.MethodDescriptorProto.verify|verify} messages.
             * @param message MethodDescriptorProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IMethodDescriptorProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified MethodDescriptorProto message, length delimited. Does not implicitly {@link google.protobuf.MethodDescriptorProto.verify|verify} messages.
             * @param message MethodDescriptorProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IMethodDescriptorProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a MethodDescriptorProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns MethodDescriptorProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.MethodDescriptorProto;

            /**
             * Decodes a MethodDescriptorProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns MethodDescriptorProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.MethodDescriptorProto;

            /**
             * Verifies a MethodDescriptorProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a MethodDescriptorProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns MethodDescriptorProto
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.MethodDescriptorProto;

            /**
             * Creates a plain object from a MethodDescriptorProto message. Also converts values to other types if specified.
             * @param message MethodDescriptorProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.MethodDescriptorProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this MethodDescriptorProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a FileOptions. */
        interface IFileOptions {

            /** FileOptions javaPackage */
            javaPackage?: (string|null);

            /** FileOptions javaOuterClassname */
            javaOuterClassname?: (string|null);

            /** FileOptions javaMultipleFiles */
            javaMultipleFiles?: (boolean|null);

            /** FileOptions javaGenerateEqualsAndHash */
            javaGenerateEqualsAndHash?: (boolean|null);

            /** FileOptions javaStringCheckUtf8 */
            javaStringCheckUtf8?: (boolean|null);

            /** FileOptions optimizeFor */
            optimizeFor?: (google.protobuf.FileOptions.OptimizeMode|keyof typeof google.protobuf.FileOptions.OptimizeMode|null);

            /** FileOptions goPackage */
            goPackage?: (string|null);

            /** FileOptions ccGenericServices */
            ccGenericServices?: (boolean|null);

            /** FileOptions javaGenericServices */
            javaGenericServices?: (boolean|null);

            /** FileOptions pyGenericServices */
            pyGenericServices?: (boolean|null);

            /** FileOptions phpGenericServices */
            phpGenericServices?: (boolean|null);

            /** FileOptions deprecated */
            deprecated?: (boolean|null);

            /** FileOptions ccEnableArenas */
            ccEnableArenas?: (boolean|null);

            /** FileOptions objcClassPrefix */
            objcClassPrefix?: (string|null);

            /** FileOptions csharpNamespace */
            csharpNamespace?: (string|null);

            /** FileOptions swiftPrefix */
            swiftPrefix?: (string|null);

            /** FileOptions phpClassPrefix */
            phpClassPrefix?: (string|null);

            /** FileOptions phpNamespace */
            phpNamespace?: (string|null);

            /** FileOptions phpMetadataNamespace */
            phpMetadataNamespace?: (string|null);

            /** FileOptions rubyPackage */
            rubyPackage?: (string|null);

            /** FileOptions uninterpretedOption */
            uninterpretedOption?: (google.protobuf.IUninterpretedOption[]|null);

            /** FileOptions .google.api.resourceDefinition */
            ".google.api.resourceDefinition"?: (google.api.IResourceDescriptor[]|null);
        }

        /** Represents a FileOptions. */
        class FileOptions implements IFileOptions {

            /**
             * Constructs a new FileOptions.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IFileOptions);

            /** FileOptions javaPackage. */
            public javaPackage: string;

            /** FileOptions javaOuterClassname. */
            public javaOuterClassname: string;

            /** FileOptions javaMultipleFiles. */
            public javaMultipleFiles: boolean;

            /** FileOptions javaGenerateEqualsAndHash. */
            public javaGenerateEqualsAndHash: boolean;

            /** FileOptions javaStringCheckUtf8. */
            public javaStringCheckUtf8: boolean;

            /** FileOptions optimizeFor. */
            public optimizeFor: (google.protobuf.FileOptions.OptimizeMode|keyof typeof google.protobuf.FileOptions.OptimizeMode);

            /** FileOptions goPackage. */
            public goPackage: string;

            /** FileOptions ccGenericServices. */
            public ccGenericServices: boolean;

            /** FileOptions javaGenericServices. */
            public javaGenericServices: boolean;

            /** FileOptions pyGenericServices. */
            public pyGenericServices: boolean;

            /** FileOptions phpGenericServices. */
            public phpGenericServices: boolean;

            /** FileOptions deprecated. */
            public deprecated: boolean;

            /** FileOptions ccEnableArenas. */
            public ccEnableArenas: boolean;

            /** FileOptions objcClassPrefix. */
            public objcClassPrefix: string;

            /** FileOptions csharpNamespace. */
            public csharpNamespace: string;

            /** FileOptions swiftPrefix. */
            public swiftPrefix: string;

            /** FileOptions phpClassPrefix. */
            public phpClassPrefix: string;

            /** FileOptions phpNamespace. */
            public phpNamespace: string;

            /** FileOptions phpMetadataNamespace. */
            public phpMetadataNamespace: string;

            /** FileOptions rubyPackage. */
            public rubyPackage: string;

            /** FileOptions uninterpretedOption. */
            public uninterpretedOption: google.protobuf.IUninterpretedOption[];

            /**
             * Creates a new FileOptions instance using the specified properties.
             * @param [properties] Properties to set
             * @returns FileOptions instance
             */
            public static create(properties?: google.protobuf.IFileOptions): google.protobuf.FileOptions;

            /**
             * Encodes the specified FileOptions message. Does not implicitly {@link google.protobuf.FileOptions.verify|verify} messages.
             * @param message FileOptions message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IFileOptions, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified FileOptions message, length delimited. Does not implicitly {@link google.protobuf.FileOptions.verify|verify} messages.
             * @param message FileOptions message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IFileOptions, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a FileOptions message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns FileOptions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.FileOptions;

            /**
             * Decodes a FileOptions message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns FileOptions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.FileOptions;

            /**
             * Verifies a FileOptions message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a FileOptions message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns FileOptions
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.FileOptions;

            /**
             * Creates a plain object from a FileOptions message. Also converts values to other types if specified.
             * @param message FileOptions
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.FileOptions, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this FileOptions to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        namespace FileOptions {

            /** OptimizeMode enum. */
            enum OptimizeMode {
                SPEED = 1,
                CODE_SIZE = 2,
                LITE_RUNTIME = 3
            }
        }

        /** Properties of a MessageOptions. */
        interface IMessageOptions {

            /** MessageOptions messageSetWireFormat */
            messageSetWireFormat?: (boolean|null);

            /** MessageOptions noStandardDescriptorAccessor */
            noStandardDescriptorAccessor?: (boolean|null);

            /** MessageOptions deprecated */
            deprecated?: (boolean|null);

            /** MessageOptions mapEntry */
            mapEntry?: (boolean|null);

            /** MessageOptions uninterpretedOption */
            uninterpretedOption?: (google.protobuf.IUninterpretedOption[]|null);

            /** MessageOptions .google.api.resource */
            ".google.api.resource"?: (google.api.IResourceDescriptor|null);
        }

        /** Represents a MessageOptions. */
        class MessageOptions implements IMessageOptions {

            /**
             * Constructs a new MessageOptions.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IMessageOptions);

            /** MessageOptions messageSetWireFormat. */
            public messageSetWireFormat: boolean;

            /** MessageOptions noStandardDescriptorAccessor. */
            public noStandardDescriptorAccessor: boolean;

            /** MessageOptions deprecated. */
            public deprecated: boolean;

            /** MessageOptions mapEntry. */
            public mapEntry: boolean;

            /** MessageOptions uninterpretedOption. */
            public uninterpretedOption: google.protobuf.IUninterpretedOption[];

            /**
             * Creates a new MessageOptions instance using the specified properties.
             * @param [properties] Properties to set
             * @returns MessageOptions instance
             */
            public static create(properties?: google.protobuf.IMessageOptions): google.protobuf.MessageOptions;

            /**
             * Encodes the specified MessageOptions message. Does not implicitly {@link google.protobuf.MessageOptions.verify|verify} messages.
             * @param message MessageOptions message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IMessageOptions, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified MessageOptions message, length delimited. Does not implicitly {@link google.protobuf.MessageOptions.verify|verify} messages.
             * @param message MessageOptions message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IMessageOptions, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a MessageOptions message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns MessageOptions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.MessageOptions;

            /**
             * Decodes a MessageOptions message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns MessageOptions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.MessageOptions;

            /**
             * Verifies a MessageOptions message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a MessageOptions message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns MessageOptions
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.MessageOptions;

            /**
             * Creates a plain object from a MessageOptions message. Also converts values to other types if specified.
             * @param message MessageOptions
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.MessageOptions, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this MessageOptions to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a FieldOptions. */
        interface IFieldOptions {

            /** FieldOptions ctype */
            ctype?: (google.protobuf.FieldOptions.CType|keyof typeof google.protobuf.FieldOptions.CType|null);

            /** FieldOptions packed */
            packed?: (boolean|null);

            /** FieldOptions jstype */
            jstype?: (google.protobuf.FieldOptions.JSType|keyof typeof google.protobuf.FieldOptions.JSType|null);

            /** FieldOptions lazy */
            lazy?: (boolean|null);

            /** FieldOptions deprecated */
            deprecated?: (boolean|null);

            /** FieldOptions weak */
            weak?: (boolean|null);

            /** FieldOptions uninterpretedOption */
            uninterpretedOption?: (google.protobuf.IUninterpretedOption[]|null);

            /** FieldOptions .google.api.fieldBehavior */
            ".google.api.fieldBehavior"?: (google.api.FieldBehavior[]|null);

            /** FieldOptions .google.api.resourceReference */
            ".google.api.resourceReference"?: (google.api.IResourceReference|null);
        }

        /** Represents a FieldOptions. */
        class FieldOptions implements IFieldOptions {

            /**
             * Constructs a new FieldOptions.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IFieldOptions);

            /** FieldOptions ctype. */
            public ctype: (google.protobuf.FieldOptions.CType|keyof typeof google.protobuf.FieldOptions.CType);

            /** FieldOptions packed. */
            public packed: boolean;

            /** FieldOptions jstype. */
            public jstype: (google.protobuf.FieldOptions.JSType|keyof typeof google.protobuf.FieldOptions.JSType);

            /** FieldOptions lazy. */
            public lazy: boolean;

            /** FieldOptions deprecated. */
            public deprecated: boolean;

            /** FieldOptions weak. */
            public weak: boolean;

            /** FieldOptions uninterpretedOption. */
            public uninterpretedOption: google.protobuf.IUninterpretedOption[];

            /**
             * Creates a new FieldOptions instance using the specified properties.
             * @param [properties] Properties to set
             * @returns FieldOptions instance
             */
            public static create(properties?: google.protobuf.IFieldOptions): google.protobuf.FieldOptions;

            /**
             * Encodes the specified FieldOptions message. Does not implicitly {@link google.protobuf.FieldOptions.verify|verify} messages.
             * @param message FieldOptions message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IFieldOptions, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified FieldOptions message, length delimited. Does not implicitly {@link google.protobuf.FieldOptions.verify|verify} messages.
             * @param message FieldOptions message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IFieldOptions, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a FieldOptions message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns FieldOptions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.FieldOptions;

            /**
             * Decodes a FieldOptions message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns FieldOptions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.FieldOptions;

            /**
             * Verifies a FieldOptions message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a FieldOptions message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns FieldOptions
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.FieldOptions;

            /**
             * Creates a plain object from a FieldOptions message. Also converts values to other types if specified.
             * @param message FieldOptions
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.FieldOptions, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this FieldOptions to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        namespace FieldOptions {

            /** CType enum. */
            enum CType {
                STRING = 0,
                CORD = 1,
                STRING_PIECE = 2
            }

            /** JSType enum. */
            enum JSType {
                JS_NORMAL = 0,
                JS_STRING = 1,
                JS_NUMBER = 2
            }
        }

        /** Properties of an OneofOptions. */
        interface IOneofOptions {

            /** OneofOptions uninterpretedOption */
            uninterpretedOption?: (google.protobuf.IUninterpretedOption[]|null);
        }

        /** Represents an OneofOptions. */
        class OneofOptions implements IOneofOptions {

            /**
             * Constructs a new OneofOptions.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IOneofOptions);

            /** OneofOptions uninterpretedOption. */
            public uninterpretedOption: google.protobuf.IUninterpretedOption[];

            /**
             * Creates a new OneofOptions instance using the specified properties.
             * @param [properties] Properties to set
             * @returns OneofOptions instance
             */
            public static create(properties?: google.protobuf.IOneofOptions): google.protobuf.OneofOptions;

            /**
             * Encodes the specified OneofOptions message. Does not implicitly {@link google.protobuf.OneofOptions.verify|verify} messages.
             * @param message OneofOptions message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IOneofOptions, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified OneofOptions message, length delimited. Does not implicitly {@link google.protobuf.OneofOptions.verify|verify} messages.
             * @param message OneofOptions message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IOneofOptions, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an OneofOptions message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns OneofOptions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.OneofOptions;

            /**
             * Decodes an OneofOptions message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns OneofOptions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.OneofOptions;

            /**
             * Verifies an OneofOptions message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an OneofOptions message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns OneofOptions
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.OneofOptions;

            /**
             * Creates a plain object from an OneofOptions message. Also converts values to other types if specified.
             * @param message OneofOptions
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.OneofOptions, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this OneofOptions to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of an EnumOptions. */
        interface IEnumOptions {

            /** EnumOptions allowAlias */
            allowAlias?: (boolean|null);

            /** EnumOptions deprecated */
            deprecated?: (boolean|null);

            /** EnumOptions uninterpretedOption */
            uninterpretedOption?: (google.protobuf.IUninterpretedOption[]|null);
        }

        /** Represents an EnumOptions. */
        class EnumOptions implements IEnumOptions {

            /**
             * Constructs a new EnumOptions.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IEnumOptions);

            /** EnumOptions allowAlias. */
            public allowAlias: boolean;

            /** EnumOptions deprecated. */
            public deprecated: boolean;

            /** EnumOptions uninterpretedOption. */
            public uninterpretedOption: google.protobuf.IUninterpretedOption[];

            /**
             * Creates a new EnumOptions instance using the specified properties.
             * @param [properties] Properties to set
             * @returns EnumOptions instance
             */
            public static create(properties?: google.protobuf.IEnumOptions): google.protobuf.EnumOptions;

            /**
             * Encodes the specified EnumOptions message. Does not implicitly {@link google.protobuf.EnumOptions.verify|verify} messages.
             * @param message EnumOptions message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IEnumOptions, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified EnumOptions message, length delimited. Does not implicitly {@link google.protobuf.EnumOptions.verify|verify} messages.
             * @param message EnumOptions message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IEnumOptions, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an EnumOptions message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns EnumOptions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.EnumOptions;

            /**
             * Decodes an EnumOptions message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns EnumOptions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.EnumOptions;

            /**
             * Verifies an EnumOptions message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an EnumOptions message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns EnumOptions
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.EnumOptions;

            /**
             * Creates a plain object from an EnumOptions message. Also converts values to other types if specified.
             * @param message EnumOptions
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.EnumOptions, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this EnumOptions to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of an EnumValueOptions. */
        interface IEnumValueOptions {

            /** EnumValueOptions deprecated */
            deprecated?: (boolean|null);

            /** EnumValueOptions uninterpretedOption */
            uninterpretedOption?: (google.protobuf.IUninterpretedOption[]|null);
        }

        /** Represents an EnumValueOptions. */
        class EnumValueOptions implements IEnumValueOptions {

            /**
             * Constructs a new EnumValueOptions.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IEnumValueOptions);

            /** EnumValueOptions deprecated. */
            public deprecated: boolean;

            /** EnumValueOptions uninterpretedOption. */
            public uninterpretedOption: google.protobuf.IUninterpretedOption[];

            /**
             * Creates a new EnumValueOptions instance using the specified properties.
             * @param [properties] Properties to set
             * @returns EnumValueOptions instance
             */
            public static create(properties?: google.protobuf.IEnumValueOptions): google.protobuf.EnumValueOptions;

            /**
             * Encodes the specified EnumValueOptions message. Does not implicitly {@link google.protobuf.EnumValueOptions.verify|verify} messages.
             * @param message EnumValueOptions message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IEnumValueOptions, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified EnumValueOptions message, length delimited. Does not implicitly {@link google.protobuf.EnumValueOptions.verify|verify} messages.
             * @param message EnumValueOptions message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IEnumValueOptions, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an EnumValueOptions message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns EnumValueOptions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.EnumValueOptions;

            /**
             * Decodes an EnumValueOptions message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns EnumValueOptions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.EnumValueOptions;

            /**
             * Verifies an EnumValueOptions message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an EnumValueOptions message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns EnumValueOptions
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.EnumValueOptions;

            /**
             * Creates a plain object from an EnumValueOptions message. Also converts values to other types if specified.
             * @param message EnumValueOptions
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.EnumValueOptions, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this EnumValueOptions to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a ServiceOptions. */
        interface IServiceOptions {

            /** ServiceOptions deprecated */
            deprecated?: (boolean|null);

            /** ServiceOptions uninterpretedOption */
            uninterpretedOption?: (google.protobuf.IUninterpretedOption[]|null);

            /** ServiceOptions .google.api.defaultHost */
            ".google.api.defaultHost"?: (string|null);

            /** ServiceOptions .google.api.oauthScopes */
            ".google.api.oauthScopes"?: (string|null);
        }

        /** Represents a ServiceOptions. */
        class ServiceOptions implements IServiceOptions {

            /**
             * Constructs a new ServiceOptions.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IServiceOptions);

            /** ServiceOptions deprecated. */
            public deprecated: boolean;

            /** ServiceOptions uninterpretedOption. */
            public uninterpretedOption: google.protobuf.IUninterpretedOption[];

            /**
             * Creates a new ServiceOptions instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ServiceOptions instance
             */
            public static create(properties?: google.protobuf.IServiceOptions): google.protobuf.ServiceOptions;

            /**
             * Encodes the specified ServiceOptions message. Does not implicitly {@link google.protobuf.ServiceOptions.verify|verify} messages.
             * @param message ServiceOptions message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IServiceOptions, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ServiceOptions message, length delimited. Does not implicitly {@link google.protobuf.ServiceOptions.verify|verify} messages.
             * @param message ServiceOptions message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IServiceOptions, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ServiceOptions message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ServiceOptions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.ServiceOptions;

            /**
             * Decodes a ServiceOptions message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ServiceOptions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.ServiceOptions;

            /**
             * Verifies a ServiceOptions message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a ServiceOptions message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ServiceOptions
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.ServiceOptions;

            /**
             * Creates a plain object from a ServiceOptions message. Also converts values to other types if specified.
             * @param message ServiceOptions
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.ServiceOptions, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ServiceOptions to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a MethodOptions. */
        interface IMethodOptions {

            /** MethodOptions deprecated */
            deprecated?: (boolean|null);

            /** MethodOptions idempotencyLevel */
            idempotencyLevel?: (google.protobuf.MethodOptions.IdempotencyLevel|keyof typeof google.protobuf.MethodOptions.IdempotencyLevel|null);

            /** MethodOptions uninterpretedOption */
            uninterpretedOption?: (google.protobuf.IUninterpretedOption[]|null);

            /** MethodOptions .google.api.http */
            ".google.api.http"?: (google.api.IHttpRule|null);

            /** MethodOptions .google.api.methodSignature */
            ".google.api.methodSignature"?: (string[]|null);
        }

        /** Represents a MethodOptions. */
        class MethodOptions implements IMethodOptions {

            /**
             * Constructs a new MethodOptions.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IMethodOptions);

            /** MethodOptions deprecated. */
            public deprecated: boolean;

            /** MethodOptions idempotencyLevel. */
            public idempotencyLevel: (google.protobuf.MethodOptions.IdempotencyLevel|keyof typeof google.protobuf.MethodOptions.IdempotencyLevel);

            /** MethodOptions uninterpretedOption. */
            public uninterpretedOption: google.protobuf.IUninterpretedOption[];

            /**
             * Creates a new MethodOptions instance using the specified properties.
             * @param [properties] Properties to set
             * @returns MethodOptions instance
             */
            public static create(properties?: google.protobuf.IMethodOptions): google.protobuf.MethodOptions;

            /**
             * Encodes the specified MethodOptions message. Does not implicitly {@link google.protobuf.MethodOptions.verify|verify} messages.
             * @param message MethodOptions message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IMethodOptions, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified MethodOptions message, length delimited. Does not implicitly {@link google.protobuf.MethodOptions.verify|verify} messages.
             * @param message MethodOptions message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IMethodOptions, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a MethodOptions message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns MethodOptions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.MethodOptions;

            /**
             * Decodes a MethodOptions message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns MethodOptions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.MethodOptions;

            /**
             * Verifies a MethodOptions message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a MethodOptions message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns MethodOptions
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.MethodOptions;

            /**
             * Creates a plain object from a MethodOptions message. Also converts values to other types if specified.
             * @param message MethodOptions
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.MethodOptions, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this MethodOptions to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        namespace MethodOptions {

            /** IdempotencyLevel enum. */
            enum IdempotencyLevel {
                IDEMPOTENCY_UNKNOWN = 0,
                NO_SIDE_EFFECTS = 1,
                IDEMPOTENT = 2
            }
        }

        /** Properties of an UninterpretedOption. */
        interface IUninterpretedOption {

            /** UninterpretedOption name */
            name?: (google.protobuf.UninterpretedOption.INamePart[]|null);

            /** UninterpretedOption identifierValue */
            identifierValue?: (string|null);

            /** UninterpretedOption positiveIntValue */
            positiveIntValue?: (number|Long|string|null);

            /** UninterpretedOption negativeIntValue */
            negativeIntValue?: (number|Long|string|null);

            /** UninterpretedOption doubleValue */
            doubleValue?: (number|null);

            /** UninterpretedOption stringValue */
            stringValue?: (Uint8Array|string|null);

            /** UninterpretedOption aggregateValue */
            aggregateValue?: (string|null);
        }

        /** Represents an UninterpretedOption. */
        class UninterpretedOption implements IUninterpretedOption {

            /**
             * Constructs a new UninterpretedOption.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IUninterpretedOption);

            /** UninterpretedOption name. */
            public name: google.protobuf.UninterpretedOption.INamePart[];

            /** UninterpretedOption identifierValue. */
            public identifierValue: string;

            /** UninterpretedOption positiveIntValue. */
            public positiveIntValue: (number|Long|string);

            /** UninterpretedOption negativeIntValue. */
            public negativeIntValue: (number|Long|string);

            /** UninterpretedOption doubleValue. */
            public doubleValue: number;

            /** UninterpretedOption stringValue. */
            public stringValue: (Uint8Array|string);

            /** UninterpretedOption aggregateValue. */
            public aggregateValue: string;

            /**
             * Creates a new UninterpretedOption instance using the specified properties.
             * @param [properties] Properties to set
             * @returns UninterpretedOption instance
             */
            public static create(properties?: google.protobuf.IUninterpretedOption): google.protobuf.UninterpretedOption;

            /**
             * Encodes the specified UninterpretedOption message. Does not implicitly {@link google.protobuf.UninterpretedOption.verify|verify} messages.
             * @param message UninterpretedOption message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IUninterpretedOption, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified UninterpretedOption message, length delimited. Does not implicitly {@link google.protobuf.UninterpretedOption.verify|verify} messages.
             * @param message UninterpretedOption message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IUninterpretedOption, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an UninterpretedOption message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns UninterpretedOption
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.UninterpretedOption;

            /**
             * Decodes an UninterpretedOption message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns UninterpretedOption
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.UninterpretedOption;

            /**
             * Verifies an UninterpretedOption message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an UninterpretedOption message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns UninterpretedOption
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.UninterpretedOption;

            /**
             * Creates a plain object from an UninterpretedOption message. Also converts values to other types if specified.
             * @param message UninterpretedOption
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.UninterpretedOption, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this UninterpretedOption to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        namespace UninterpretedOption {

            /** Properties of a NamePart. */
            interface INamePart {

                /** NamePart namePart */
                namePart: string;

                /** NamePart isExtension */
                isExtension: boolean;
            }

            /** Represents a NamePart. */
            class NamePart implements INamePart {

                /**
                 * Constructs a new NamePart.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.protobuf.UninterpretedOption.INamePart);

                /** NamePart namePart. */
                public namePart: string;

                /** NamePart isExtension. */
                public isExtension: boolean;

                /**
                 * Creates a new NamePart instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns NamePart instance
                 */
                public static create(properties?: google.protobuf.UninterpretedOption.INamePart): google.protobuf.UninterpretedOption.NamePart;

                /**
                 * Encodes the specified NamePart message. Does not implicitly {@link google.protobuf.UninterpretedOption.NamePart.verify|verify} messages.
                 * @param message NamePart message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.protobuf.UninterpretedOption.INamePart, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified NamePart message, length delimited. Does not implicitly {@link google.protobuf.UninterpretedOption.NamePart.verify|verify} messages.
                 * @param message NamePart message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.protobuf.UninterpretedOption.INamePart, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a NamePart message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns NamePart
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.UninterpretedOption.NamePart;

                /**
                 * Decodes a NamePart message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns NamePart
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.UninterpretedOption.NamePart;

                /**
                 * Verifies a NamePart message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a NamePart message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns NamePart
                 */
                public static fromObject(object: { [k: string]: any }): google.protobuf.UninterpretedOption.NamePart;

                /**
                 * Creates a plain object from a NamePart message. Also converts values to other types if specified.
                 * @param message NamePart
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.protobuf.UninterpretedOption.NamePart, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this NamePart to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }
        }

        /** Properties of a SourceCodeInfo. */
        interface ISourceCodeInfo {

            /** SourceCodeInfo location */
            location?: (google.protobuf.SourceCodeInfo.ILocation[]|null);
        }

        /** Represents a SourceCodeInfo. */
        class SourceCodeInfo implements ISourceCodeInfo {

            /**
             * Constructs a new SourceCodeInfo.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.ISourceCodeInfo);

            /** SourceCodeInfo location. */
            public location: google.protobuf.SourceCodeInfo.ILocation[];

            /**
             * Creates a new SourceCodeInfo instance using the specified properties.
             * @param [properties] Properties to set
             * @returns SourceCodeInfo instance
             */
            public static create(properties?: google.protobuf.ISourceCodeInfo): google.protobuf.SourceCodeInfo;

            /**
             * Encodes the specified SourceCodeInfo message. Does not implicitly {@link google.protobuf.SourceCodeInfo.verify|verify} messages.
             * @param message SourceCodeInfo message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.ISourceCodeInfo, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified SourceCodeInfo message, length delimited. Does not implicitly {@link google.protobuf.SourceCodeInfo.verify|verify} messages.
             * @param message SourceCodeInfo message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.ISourceCodeInfo, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a SourceCodeInfo message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns SourceCodeInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.SourceCodeInfo;

            /**
             * Decodes a SourceCodeInfo message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns SourceCodeInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.SourceCodeInfo;

            /**
             * Verifies a SourceCodeInfo message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a SourceCodeInfo message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns SourceCodeInfo
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.SourceCodeInfo;

            /**
             * Creates a plain object from a SourceCodeInfo message. Also converts values to other types if specified.
             * @param message SourceCodeInfo
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.SourceCodeInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this SourceCodeInfo to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        namespace SourceCodeInfo {

            /** Properties of a Location. */
            interface ILocation {

                /** Location path */
                path?: (number[]|null);

                /** Location span */
                span?: (number[]|null);

                /** Location leadingComments */
                leadingComments?: (string|null);

                /** Location trailingComments */
                trailingComments?: (string|null);

                /** Location leadingDetachedComments */
                leadingDetachedComments?: (string[]|null);
            }

            /** Represents a Location. */
            class Location implements ILocation {

                /**
                 * Constructs a new Location.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.protobuf.SourceCodeInfo.ILocation);

                /** Location path. */
                public path: number[];

                /** Location span. */
                public span: number[];

                /** Location leadingComments. */
                public leadingComments: string;

                /** Location trailingComments. */
                public trailingComments: string;

                /** Location leadingDetachedComments. */
                public leadingDetachedComments: string[];

                /**
                 * Creates a new Location instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Location instance
                 */
                public static create(properties?: google.protobuf.SourceCodeInfo.ILocation): google.protobuf.SourceCodeInfo.Location;

                /**
                 * Encodes the specified Location message. Does not implicitly {@link google.protobuf.SourceCodeInfo.Location.verify|verify} messages.
                 * @param message Location message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.protobuf.SourceCodeInfo.ILocation, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Location message, length delimited. Does not implicitly {@link google.protobuf.SourceCodeInfo.Location.verify|verify} messages.
                 * @param message Location message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.protobuf.SourceCodeInfo.ILocation, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Location message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Location
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.SourceCodeInfo.Location;

                /**
                 * Decodes a Location message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Location
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.SourceCodeInfo.Location;

                /**
                 * Verifies a Location message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Location message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Location
                 */
                public static fromObject(object: { [k: string]: any }): google.protobuf.SourceCodeInfo.Location;

                /**
                 * Creates a plain object from a Location message. Also converts values to other types if specified.
                 * @param message Location
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.protobuf.SourceCodeInfo.Location, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Location to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }
        }

        /** Properties of a GeneratedCodeInfo. */
        interface IGeneratedCodeInfo {

            /** GeneratedCodeInfo annotation */
            annotation?: (google.protobuf.GeneratedCodeInfo.IAnnotation[]|null);
        }

        /** Represents a GeneratedCodeInfo. */
        class GeneratedCodeInfo implements IGeneratedCodeInfo {

            /**
             * Constructs a new GeneratedCodeInfo.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IGeneratedCodeInfo);

            /** GeneratedCodeInfo annotation. */
            public annotation: google.protobuf.GeneratedCodeInfo.IAnnotation[];

            /**
             * Creates a new GeneratedCodeInfo instance using the specified properties.
             * @param [properties] Properties to set
             * @returns GeneratedCodeInfo instance
             */
            public static create(properties?: google.protobuf.IGeneratedCodeInfo): google.protobuf.GeneratedCodeInfo;

            /**
             * Encodes the specified GeneratedCodeInfo message. Does not implicitly {@link google.protobuf.GeneratedCodeInfo.verify|verify} messages.
             * @param message GeneratedCodeInfo message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IGeneratedCodeInfo, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified GeneratedCodeInfo message, length delimited. Does not implicitly {@link google.protobuf.GeneratedCodeInfo.verify|verify} messages.
             * @param message GeneratedCodeInfo message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IGeneratedCodeInfo, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a GeneratedCodeInfo message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns GeneratedCodeInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.GeneratedCodeInfo;

            /**
             * Decodes a GeneratedCodeInfo message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns GeneratedCodeInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.GeneratedCodeInfo;

            /**
             * Verifies a GeneratedCodeInfo message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a GeneratedCodeInfo message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns GeneratedCodeInfo
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.GeneratedCodeInfo;

            /**
             * Creates a plain object from a GeneratedCodeInfo message. Also converts values to other types if specified.
             * @param message GeneratedCodeInfo
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.GeneratedCodeInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this GeneratedCodeInfo to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        namespace GeneratedCodeInfo {

            /** Properties of an Annotation. */
            interface IAnnotation {

                /** Annotation path */
                path?: (number[]|null);

                /** Annotation sourceFile */
                sourceFile?: (string|null);

                /** Annotation begin */
                begin?: (number|null);

                /** Annotation end */
                end?: (number|null);
            }

            /** Represents an Annotation. */
            class Annotation implements IAnnotation {

                /**
                 * Constructs a new Annotation.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.protobuf.GeneratedCodeInfo.IAnnotation);

                /** Annotation path. */
                public path: number[];

                /** Annotation sourceFile. */
                public sourceFile: string;

                /** Annotation begin. */
                public begin: number;

                /** Annotation end. */
                public end: number;

                /**
                 * Creates a new Annotation instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Annotation instance
                 */
                public static create(properties?: google.protobuf.GeneratedCodeInfo.IAnnotation): google.protobuf.GeneratedCodeInfo.Annotation;

                /**
                 * Encodes the specified Annotation message. Does not implicitly {@link google.protobuf.GeneratedCodeInfo.Annotation.verify|verify} messages.
                 * @param message Annotation message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.protobuf.GeneratedCodeInfo.IAnnotation, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Annotation message, length delimited. Does not implicitly {@link google.protobuf.GeneratedCodeInfo.Annotation.verify|verify} messages.
                 * @param message Annotation message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.protobuf.GeneratedCodeInfo.IAnnotation, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an Annotation message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Annotation
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.GeneratedCodeInfo.Annotation;

                /**
                 * Decodes an Annotation message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Annotation
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.GeneratedCodeInfo.Annotation;

                /**
                 * Verifies an Annotation message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an Annotation message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Annotation
                 */
                public static fromObject(object: { [k: string]: any }): google.protobuf.GeneratedCodeInfo.Annotation;

                /**
                 * Creates a plain object from an Annotation message. Also converts values to other types if specified.
                 * @param message Annotation
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.protobuf.GeneratedCodeInfo.Annotation, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Annotation to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }
        }

        /** Properties of a Duration. */
        interface IDuration {

            /** Duration seconds */
            seconds?: (number|Long|string|null);

            /** Duration nanos */
            nanos?: (number|null);
        }

        /** Represents a Duration. */
        class Duration implements IDuration {

            /**
             * Constructs a new Duration.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IDuration);

            /** Duration seconds. */
            public seconds: (number|Long|string);

            /** Duration nanos. */
            public nanos: number;

            /**
             * Creates a new Duration instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Duration instance
             */
            public static create(properties?: google.protobuf.IDuration): google.protobuf.Duration;

            /**
             * Encodes the specified Duration message. Does not implicitly {@link google.protobuf.Duration.verify|verify} messages.
             * @param message Duration message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IDuration, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Duration message, length delimited. Does not implicitly {@link google.protobuf.Duration.verify|verify} messages.
             * @param message Duration message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IDuration, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Duration message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Duration
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.Duration;

            /**
             * Decodes a Duration message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Duration
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.Duration;

            /**
             * Verifies a Duration message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Duration message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Duration
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.Duration;

            /**
             * Creates a plain object from a Duration message. Also converts values to other types if specified.
             * @param message Duration
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.Duration, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Duration to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of an Empty. */
        interface IEmpty {
        }

        /** Represents an Empty. */
        class Empty implements IEmpty {

            /**
             * Constructs a new Empty.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IEmpty);

            /**
             * Creates a new Empty instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Empty instance
             */
            public static create(properties?: google.protobuf.IEmpty): google.protobuf.Empty;

            /**
             * Encodes the specified Empty message. Does not implicitly {@link google.protobuf.Empty.verify|verify} messages.
             * @param message Empty message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IEmpty, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Empty message, length delimited. Does not implicitly {@link google.protobuf.Empty.verify|verify} messages.
             * @param message Empty message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IEmpty, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an Empty message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Empty
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.Empty;

            /**
             * Decodes an Empty message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Empty
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.Empty;

            /**
             * Verifies an Empty message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an Empty message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Empty
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.Empty;

            /**
             * Creates a plain object from an Empty message. Also converts values to other types if specified.
             * @param message Empty
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.Empty, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Empty to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a FieldMask. */
        interface IFieldMask {

            /** FieldMask paths */
            paths?: (string[]|null);
        }

        /** Represents a FieldMask. */
        class FieldMask implements IFieldMask {

            /**
             * Constructs a new FieldMask.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IFieldMask);

            /** FieldMask paths. */
            public paths: string[];

            /**
             * Creates a new FieldMask instance using the specified properties.
             * @param [properties] Properties to set
             * @returns FieldMask instance
             */
            public static create(properties?: google.protobuf.IFieldMask): google.protobuf.FieldMask;

            /**
             * Encodes the specified FieldMask message. Does not implicitly {@link google.protobuf.FieldMask.verify|verify} messages.
             * @param message FieldMask message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IFieldMask, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified FieldMask message, length delimited. Does not implicitly {@link google.protobuf.FieldMask.verify|verify} messages.
             * @param message FieldMask message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IFieldMask, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a FieldMask message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns FieldMask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.FieldMask;

            /**
             * Decodes a FieldMask message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns FieldMask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.FieldMask;

            /**
             * Verifies a FieldMask message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a FieldMask message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns FieldMask
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.FieldMask;

            /**
             * Creates a plain object from a FieldMask message. Also converts values to other types if specified.
             * @param message FieldMask
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.FieldMask, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this FieldMask to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a Timestamp. */
        interface ITimestamp {

            /** Timestamp seconds */
            seconds?: (number|Long|string|null);

            /** Timestamp nanos */
            nanos?: (number|null);
        }

        /** Represents a Timestamp. */
        class Timestamp implements ITimestamp {

            /**
             * Constructs a new Timestamp.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.ITimestamp);

            /** Timestamp seconds. */
            public seconds: (number|Long|string);

            /** Timestamp nanos. */
            public nanos: number;

            /**
             * Creates a new Timestamp instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Timestamp instance
             */
            public static create(properties?: google.protobuf.ITimestamp): google.protobuf.Timestamp;

            /**
             * Encodes the specified Timestamp message. Does not implicitly {@link google.protobuf.Timestamp.verify|verify} messages.
             * @param message Timestamp message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.ITimestamp, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Timestamp message, length delimited. Does not implicitly {@link google.protobuf.Timestamp.verify|verify} messages.
             * @param message Timestamp message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.ITimestamp, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Timestamp message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Timestamp
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.Timestamp;

            /**
             * Decodes a Timestamp message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Timestamp
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.Timestamp;

            /**
             * Verifies a Timestamp message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Timestamp message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Timestamp
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.Timestamp;

            /**
             * Creates a plain object from a Timestamp message. Also converts values to other types if specified.
             * @param message Timestamp
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.Timestamp, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Timestamp to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }
    }
}
