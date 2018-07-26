declare namespace PubSub {

  interface Credentials {
    client_email: string;
    private_key: string;
  }

  type PromiseConstructor = <T>() => PromiseLike<T>; // TODO: Is this correct?

  interface ClientConfig {
    projectId: string;
    keyFilename?: string;
    apiEndpoint?: string;
    email?: string;
    credentials?: Credentials;
    autoRetry?: boolean;
    maxRetries?: number;
    promise?: PromiseConstructor;
  }

  interface GaxOptions {
    timeout: number;
    retry: any;
    autoPaginate: boolean;
    pageToken: number;
    otherArgs: object;
    promise?: PromiseConstructor;
  }

  interface TopicOptions {
    pubsub?: PubSub;
  }

  type TopicCreateCallback = (error: Error, topic: Topic, apiResponse: object) => void;
  type TopicCreateResponse = (Topic | object)[];

  type TopicDeleteCallback = (error: Error, apiResponse: object) => void;
  type TopicDeleteResponse = object[];

  type TopicExistsCallback = (error: Error, exists: boolean) => void;
  type TopicExistsResponse = boolean[];

  type GetTopicCallback = (error: Error, topic: Topic, apiResponse: object) => void;
  type GetTopicResponse = (Topic | object)[];

  type GetTopicMetadataCallback = (error: Error, apiResponse: object) => void;
  type GetTopicMetadataResponse = object[];

  type GetTopicSubscriptionsCallback = (error: Error, subscriptions: Subscription[]) => void;
  type GetTopicSubscriptionsResponse = Subscription[];

  class Topic {
    constructor(topic: string, options?: TopicOptions);

    create(gaxOpts?: GaxOptions): Promise<TopicCreateResponse>;
    create(gaxOpts?: GaxOptions, callback?: TopicCreateCallback): void;

    createSubscription(name: string, options?: CreateSubscriptionRequest): Promise<CreateSubscriptionResponse>;
    createSubscription(name: string, callback: CreateSubscriptionCallback): void;
    createSubscription(name: string, options: CreateSubscriptionRequest, callback: CreateSubscriptionCallback): void;

    delete(gaxOpts?: GaxOptions): Promise<TopicDeleteResponse>
    delete(callback: TopicDeleteCallback): void;
    delete(gaxOpts: GaxOptions, callback: TopicDeleteCallback): void;

    exists(gaxOpts?: GaxOptions): Promise<TopicExistsResponse>;
    exists(callback: TopicExistsCallback): void;
    exists(gaxOpts: GaxOptions, callback: TopicExistsCallback): void;

    get(gaxOpts?: GaxOptions): Promise<GetTopicResponse>;
    get(callback: GetTopicCallback): void;
    get(gaxOpts: GaxOptions, callback: GetTopicCallback): void;

    getMetadata(gaxOpts?: GaxOptions): Promise<GetTopicMetadataResponse>;
    getMetadata(callback: GetTopicMetadataCallback): void;
    getMetadata(gaxOpts: GaxOptions, callback: GetTopicMetadataCallback): void;

    getSubscriptions(query?: object): Promise<GetTopicSubscriptionsResponse>;
    getSubscriptions(callback: GetTopicSubscriptionsCallback): void;

    getSubscriptionsStream(query?: object): ReadableStream;

    publisher(options?: PublisherOptions): Publisher;

    subscription(name: string, options?: SubscriptionOptions): Subscription;
  }

  interface BatchingOptions {
    maxBytes: number;
    maxMessages: number;
    maxMilliseconds: number;
  }

  interface PublisherOptions {
    batching?: BatchingOptions;
    gaxOpts?: GaxOptions;
  }

  type PublishCallback = (error: Error, messageId: string) => void;

  class Publisher {
    constructor(options?: PublisherOptions);

    publish(data: Buffer, attrs?: any): Promise<string>;
    publish(data: Buffer, callback: PublishCallback): void;
    publish(data: Buffer, attrs: any, callback: PublishCallback): void;
  }

  interface FlowControl {
    maxBytes: number;
    maxMessages?: number;
  }

  interface CreateSubscriptionRequest {
    flowControl?: FlowControl;
    gaxOpts?: GaxOptions;
    messageRetentionDuration?: number | Date;
    pushEndpoint?: string;
    retainAckedMessages?: boolean;
  }

  interface SubscriptionOptions {
    batching?: BatchingOptions;
    flowControl?: FlowControl;
    maxConnections: number;
  }

  type CreateSnapshotCallback = (error: Error, snapshot: Snapshot, apiResponse: object) => void;
  type CreateSnapshotResponse = (Snapshot | object)[];

  type APICallback = (error: Error, apiResponse: object) => void;

  type SubscriptionExistsCallback = (error: Error, exists: boolean) => void;
  type SubscriptionExistsResponse = boolean[];

  type GetSubscriptionCallback = (error: Error, subscription: Subscription, apiResponse: object) => void;
  type GetSubscriptionResponse = (Subscription | object)[];

  type GetSubscriptionMetadataCallback = APICallback;
  type GetSubscriptionMetadataResponse = object[];

  type ModifyPushConfigCallback = (error: Error, apiResponse: object) => void;
  type ModifyPushConfigResponse = object[];

  interface ModifyPushConfig {
    pushEndpoint?: string;
    attributes?: any; // TODO: fill this out?
  }

  type SeekCallback = (error: Error, apiResponse: object) => void;
  type SeekResponse = object[];

  type SetSubscriptionMetadataCallback = (error: Error, apiResponse: object) => void;
  type SetSubscriptionMetadataResponse = object[];

  class Subscription {
    constructor(pubsub: PubSub, name: string, options?: SubscriptionOptions);

    createSnapshot(name: string, gaxOpts: GaxOptions, callback: CreateSnapshotCallback): void;
    createSnapshot(name: string, callback: CreateSnapshotCallback): void;
    createSnapshot(name: string, gaxOpts?: GaxOptions): Promise<any>; // TODO Snapshot object

    delete(gaxOpts?: GaxOptions): Promise<object>;
    delete(callback: APICallback): void;
    delete(gaxOpts: GaxOptions, callback: APICallback): void;

    exists(): Promise<SubscriptionExistsResponse>;
    exists(callback: SubscriptionExistsCallback): void;

    get(gaxOpts?: GaxOptions): Promise<GetSubscriptionResponse>;
    get(callback: GetSubscriptionCallback): void;
    get(gaxOpts: GaxOptions, callback: GetSubscriptionCallback): void;

    getMetadata(gaxOpts?: GaxOptions): Promise<GetSubscriptionMetadataResponse>;
    getMetadata(callback: GetSubscriptionMetadataCallback): void;
    getMetadata(gaxOpts: GaxOptions, callback: GetSubscriptionMetadataCallback): void;

    modifyPushConfig(config: ModifyPushConfig, gaxOpts?: GaxOptions): Promise<ModifyPushConfigResponse>;
    modifyPushConfig(config: ModifyPushConfig, callback: ModifyPushConfigCallback): void;
    modifyPushConfig(config: ModifyPushConfig, gaxOpts: GaxOptions, callback: ModifyPushConfigCallback): void;

    seek(snapshot: string | Date, gaxOpts?: GaxOptions): Promise<SeekResponse>;
    seek(snapshot: string | Date, callback: SeekCallback): void;
    seek(snapshot: string | Date, gaxOpts: GaxOptions, callback: SeekCallback): void;

    setMetadata(metadata: any, gaxOpts?: GaxOptions): Promise<SetSubscriptionMetadataResponse>;
    setMetadata(metadata: any, callback: SetSubscriptionMetadataCallback): void;
    setMetadata(metadata: any, gaxOpts: GaxOptions, callback: SetSubscriptionMetadataCallback): void;

    snapshot(name: string): Snapshot;
  }

  type DeleteSnapshotCallback = (error: Error, apiResponse: object) => void;
  type DeleteSnapshotResponse = object[];

  class Snapshot {
    // TODO: fill out parent, I think it should be an abstract of all a bunch of classes with createSnapshot
    constructor(parent: object, name: string);

    delete(): Promise<DeleteSnapshotResponse>;
    delete(callback: DeleteSnapshotCallback): void;
  }

  type CreateSubscriptionResponse = (Subscription | object)[];
  type CreateSubscriptionCallback = (error: Error, subscription: Subscription, apiResponse: object) => void;
}

declare class PubSub {
  constructor(options: PubSub.ClientConfig);

  createSubscription(topic: PubSub.Topic | string, name: string, options?: PubSub.CreateSubscriptionRequest): Promise<any>;
  createSubscription(topic: PubSub.Topic | string, name: string, options: PubSub.CreateSubscriptionRequest, callback: PubSub.CreateSubscriptionCallback): void;
  createSubscription(topic: PubSub.Topic | string, name: string, callback: PubSub.CreateSubscriptionCallback): void;

  topic(topicName: string): PubSub.Topic;
}

export = PubSub;
