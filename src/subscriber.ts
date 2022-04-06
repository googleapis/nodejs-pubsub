/*!
 * Copyright 2018 Google Inc. All Rights Reserved.
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

import {DateStruct, PreciseDate} from '@google-cloud/precise-date';
import {replaceProjectIdToken} from '@google-cloud/projectify';
import {promisify} from '@google-cloud/promisify';
import {EventEmitter} from 'events';
import {SpanContext, Span, SpanKind} from '@opentelemetry/api';
import {SemanticAttributes} from '@opentelemetry/semantic-conventions';

import {google} from '../protos/protos';
import {Histogram} from './histogram';
import {FlowControlOptions, LeaseManager} from './lease-manager';
import {AckQueue, BatchOptions, ModAckQueue} from './message-queues';
import {MessageStream, MessageStreamOptions} from './message-stream';
import {Subscription} from './subscription';
import {defaultOptions} from './default-options';
import {SubscriberClient} from './v1';
import {createSpan} from './opentelemetry-tracing';

export type PullResponse = google.pubsub.v1.IPullResponse;

/**
 * Date object with nanosecond precision. Supports all standard Date arguments
 * in addition to several custom types.
 *
 * @external PreciseDate
 * @see {@link https://github.com/googleapis/nodejs-precise-date|PreciseDate}
 */
/**
 * Message objects provide a simple interface for users to get message data and
 * acknowledge the message.
 *
 * @example
 * ```
 * subscription.on('message', message => {
 *   // {
 *   //   ackId: 'RUFeQBJMJAxESVMrQwsqWBFOBCEhPjA',
 *   //   attributes: {key: 'value'},
 *   //   data: Buffer.from('Hello, world!'),
 *   //   id: '1551297743043',
 *   //   orderingKey: 'ordering-key',
 *   //   publishTime: new PreciseDate('2019-02-27T20:02:19.029534186Z'),
 *   //   received: 1551297743043,
 *   //   length: 13
 *   // }
 * });
 * ```
 */
export class Message {
  ackId: string;
  attributes: {[key: string]: string};
  data: Buffer;
  deliveryAttempt: number;
  id: string;
  orderingKey?: string;
  publishTime: PreciseDate;
  received: number;
  private _handled: boolean;
  private _length: number;
  private _subscriber: Subscriber;
  /**
   * @hideconstructor
   *
   * @param {Subscriber} sub The parent subscriber.
   * @param {object} message The raw message response.
   */
  constructor(
    sub: Subscriber,
    {ackId, message, deliveryAttempt}: google.pubsub.v1.IReceivedMessage
  ) {
    /**
     * This ID is used to acknowledge the message.
     *
     * @name Message#ackId
     * @type {string}
     */
    this.ackId = ackId!;
    /**
     * Optional attributes for this message.
     *
     * @name Message#attributes
     * @type {object}
     */
    this.attributes = message!.attributes || {};
    /**
     * The message data as a Buffer.
     *
     * @name Message#data
     * @type {Buffer}
     */
    this.data = message!.data as Buffer;
    /**
     * Delivery attempt counter is 1 + (the sum of number of NACKs and number of
     * ack_deadline exceeds) for this message.
     *
     * @name Message#deliveryAttempt
     * @type {number}
     */
    this.deliveryAttempt = Number(deliveryAttempt || 0);
    /**
     * ID of the message, assigned by the server when the message is published.
     * Guaranteed to be unique within the topic.
     *
     * @name Message#id
     * @type {string}
     */
    this.id = message!.messageId!;
    /**
     * Identifies related messages for which publish order should be respected.
     * If a `Subscription` has `enableMessageOrdering` set to `true`, messages
     * published with the same `orderingKey` value will be delivered to
     * subscribers in the order in which they are received by the Pub/Sub
     * system.
     *
     * **EXPERIMENTAL:** This feature is part of a closed alpha release. This
     * API might be changed in backward-incompatible ways and is not recommended
     * for production use. It is not subject to any SLA or deprecation policy.
     *
     * @name Message#orderingKey
     * @type {string}
     */
    this.orderingKey = message!.orderingKey!;
    /**
     * The time at which the message was published.
     *
     * @name Message#publishTime
     * @type {external:PreciseDate}
     */
    this.publishTime = new PreciseDate(message!.publishTime as DateStruct);
    /**
     * The time at which the message was recieved by the subscription.
     *
     * @name Message#received
     * @type {number}
     */
    this.received = Date.now();

    this._handled = false;
    this._length = this.data.length;
    this._subscriber = sub;
  }
  /**
   * The length of the message data.
   *
   * @type {number}
   */
  get length() {
    return this._length;
  }
  /**
   * Acknowledges the message.
   *
   * @example
   * ```
   * subscription.on('message', message => {
   *   message.ack();
   * });
   * ```
   */
  ack(): void {
    if (!this._handled) {
      this._handled = true;
      this._subscriber.ack(this);
    }
  }
  /**
   * Modifies the ack deadline.
   *
   * @param {number} deadline The number of seconds to extend the deadline.
   * @private
   */
  modAck(deadline: number): void {
    if (!this._handled) {
      this._subscriber.modAck(this, deadline);
    }
  }
  /**
   * Removes the message from our inventory and schedules it to be redelivered.
   *
   * @example
   * ```
   * subscription.on('message', message => {
   *   message.nack();
   * });
   * ```
   */
  nack(): void {
    if (!this._handled) {
      this._handled = true;
      this._subscriber.nack(this);
    }
  }
}

export interface SubscriberOptions {
  ackDeadline?: number;
  batching?: BatchOptions;
  flowControl?: FlowControlOptions;
  useLegacyFlowControl?: boolean;
  streamingOptions?: MessageStreamOptions;
  enableOpenTelemetryTracing?: boolean;
}

/**
 * @typedef {object} SubscriberOptions
 * @property {number} [ackDeadline=10] Acknowledge deadline in seconds. If left
 *     unset the initial value will be 10 seconds, but it will evolve into the
 *     99th percentile time it takes to acknowledge a message.
 * @property {BatchOptions} [batching] Request batching options.
 * @property {FlowControlOptions} [flowControl] Flow control options.
 * @property {boolean} [useLegacyFlowControl] Disables enforcing flow control
 *     settings at the Cloud PubSub server and uses the less accurate method
 *     of only enforcing flow control at the client side.
 * @property {MessageStreamOptions} [streamingOptions] Streaming options.
 */
/**
 * Subscriber class is used to manage all message related functionality.
 *
 * @private
 * @class
 *
 * @param {Subscription} subscription The corresponding subscription.
 * @param {SubscriberOptions} options The subscriber options.
 */
export class Subscriber extends EventEmitter {
  ackDeadline: number;
  maxMessages: number;
  maxBytes: number;
  useLegacyFlowControl: boolean;
  isOpen: boolean;
  private _acks!: AckQueue;
  private _histogram: Histogram;
  private _inventory!: LeaseManager;
  private _isUserSetDeadline: boolean;
  private _useOpentelemetry: boolean;
  private _latencies: Histogram;
  private _modAcks!: ModAckQueue;
  private _name!: string;
  private _options!: SubscriberOptions;
  private _stream!: MessageStream;
  private _subscription: Subscription;
  constructor(subscription: Subscription, options = {}) {
    super();

    this.ackDeadline = 10;
    this.maxMessages = defaultOptions.subscription.maxOutstandingMessages;
    this.maxBytes = defaultOptions.subscription.maxOutstandingBytes;
    this.useLegacyFlowControl = false;
    this.isOpen = false;
    this._isUserSetDeadline = false;
    this._useOpentelemetry = false;
    this._histogram = new Histogram({min: 10, max: 600});
    this._latencies = new Histogram();
    this._subscription = subscription;
    this.setOptions(options);
  }
  /**
   * The 99th percentile of request latencies.
   *
   * @type {number}
   * @private
   */
  get modAckLatency() {
    const latency = this._latencies.percentile(99);
    let bufferTime = 0;

    if (this._modAcks) {
      bufferTime = this._modAcks.maxMilliseconds;
    }

    return latency * 1000 + bufferTime;
  }
  /**
   * The full name of the Subscription.
   *
   * @type {string}
   * @private
   */
  get name(): string {
    if (!this._name) {
      const {name, projectId} = this._subscription;
      this._name = replaceProjectIdToken(name, projectId);
    }

    return this._name;
  }
  /**
   * Acknowledges the supplied message.
   *
   * @param {Message} message The message to acknowledge.
   * @returns {Promise}
   * @private
   */
  async ack(message: Message): Promise<void> {
    if (!this._isUserSetDeadline) {
      const ackTimeSeconds = (Date.now() - message.received) / 1000;
      this._histogram.add(ackTimeSeconds);
      this.ackDeadline = this._histogram.percentile(99);
    }

    this._acks.add(message);
    await this._acks.onFlush();
    this._inventory.remove(message);
  }
  /**
   * Closes the subscriber. The returned promise will resolve once any pending
   * acks/modAcks are finished.
   *
   * @returns {Promise}
   * @private
   */
  async close(): Promise<void> {
    if (!this.isOpen) {
      return;
    }

    this.isOpen = false;
    this._stream.destroy();
    this._inventory.clear();

    await this._waitForFlush();

    this.emit('close');
  }
  /**
   * Gets the subscriber client instance.
   *
   * @returns {Promise<object>}
   * @private
   */
  async getClient(): Promise<SubscriberClient> {
    const pubsub = this._subscription.pubsub;
    const [client] = await promisify(pubsub.getClient_).call(pubsub, {
      client: 'SubscriberClient',
    });

    return client;
  }
  /**
   * Modifies the acknowledge deadline for the provided message.
   *
   * @param {Message} message The message to modify.
   * @param {number} deadline The deadline.
   * @returns {Promise}
   * @private
   */
  async modAck(message: Message, deadline: number): Promise<void> {
    const startTime = Date.now();

    this._modAcks.add(message, deadline);
    await this._modAcks.onFlush();

    const latency = (Date.now() - startTime) / 1000;
    this._latencies.add(latency);
  }
  /**
   * Modfies the acknowledge deadline for the provided message and then removes
   * it from our inventory.
   *
   * @param {Message} message The message.
   * @return {Promise}
   * @private
   */
  async nack(message: Message): Promise<void> {
    await this.modAck(message, 0);
    this._inventory.remove(message);
  }
  /**
   * Starts pulling messages.
   * @private
   */
  open(): void {
    const {batching, flowControl, streamingOptions} = this._options;

    this._acks = new AckQueue(this, batching);
    this._modAcks = new ModAckQueue(this, batching);
    this._inventory = new LeaseManager(this, flowControl);
    this._stream = new MessageStream(this, streamingOptions);

    this._stream
      .on('error', err => this.emit('error', err))
      .on('debug', err => this.emit('debug', err))
      .on('data', (data: PullResponse) => this._onData(data))
      .once('close', () => this.close());

    this._inventory
      .on('full', () => this._stream.pause())
      .on('free', () => this._stream.resume());

    this.isOpen = true;
  }
  /**
   * Sets subscriber options.
   *
   * @param {SubscriberOptions} options The options.
   * @private
   */
  setOptions(options: SubscriberOptions): void {
    this._options = options;

    this._useOpentelemetry = options.enableOpenTelemetryTracing || false;

    if (options.ackDeadline) {
      this.ackDeadline = options.ackDeadline;
      this._isUserSetDeadline = true;
    }

    this.useLegacyFlowControl = options.useLegacyFlowControl || false;
    if (options.flowControl) {
      this.maxMessages =
        options.flowControl!.maxMessages ||
        defaultOptions.subscription.maxOutstandingMessages;
      this.maxBytes =
        options.flowControl!.maxBytes ||
        defaultOptions.subscription.maxOutstandingBytes;

      // In the event that the user has specified the maxMessages option, we
      // want to make sure that the maxStreams option isn't higher.
      // It doesn't really make sense to open 5 streams if the user only wants
      // 1 message at a time.
      if (!options.streamingOptions) {
        options.streamingOptions = {} as MessageStreamOptions;
      }

      const {maxStreams = defaultOptions.subscription.maxStreams} =
        options.streamingOptions;
      options.streamingOptions.maxStreams = Math.min(
        maxStreams,
        this.maxMessages
      );
    }
  }

  /**
   * Constructs an OpenTelemetry span from the incoming message.
   *
   * @param {Message} message One of the received messages
   * @private
   */
  private _constructSpan(message: Message): Span | undefined {
    // Handle cases where OpenTelemetry is disabled or no span context was sent through message
    if (
      !this._useOpentelemetry ||
      !message.attributes ||
      !message.attributes['googclient_OpenTelemetrySpanContext']
    ) {
      return undefined;
    }

    const spanValue = message.attributes['googclient_OpenTelemetrySpanContext'];
    const parentSpanContext: SpanContext | undefined = spanValue
      ? JSON.parse(spanValue)
      : undefined;
    const spanAttributes = {
      // Original span attributes
      ackId: message.ackId,
      deliveryAttempt: message.deliveryAttempt,
      //
      // based on https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/trace/semantic_conventions/messaging.md#topic-with-multiple-consumers
      [SemanticAttributes.MESSAGING_SYSTEM]: 'pubsub',
      [SemanticAttributes.MESSAGING_OPERATION]: 'process',
      [SemanticAttributes.MESSAGING_DESTINATION]: this.name,
      [SemanticAttributes.MESSAGING_DESTINATION_KIND]: 'topic',
      [SemanticAttributes.MESSAGING_MESSAGE_ID]: message.id,
      [SemanticAttributes.MESSAGING_PROTOCOL]: 'pubsub',
      [SemanticAttributes.MESSAGING_MESSAGE_PAYLOAD_SIZE_BYTES]: (
        message.data as Buffer
      ).length,
      // Not in Opentelemetry semantic convention but mimics naming
      'messaging.pubsub.received_at': message.received,
      'messaging.pubsub.acknowlege_id': message.ackId,
      'messaging.pubsub.delivery_attempt': message.deliveryAttempt,
    };

    // Subscriber spans should always have a publisher span as a parent.
    // Return undefined if no parent is provided
    const spanName = `${this.name} process`;
    const span = parentSpanContext
      ? createSpan(
          spanName.trim(),
          SpanKind.CONSUMER,
          spanAttributes,
          parentSpanContext
        )
      : undefined;
    return span;
  }

  /**
   * Callback to be invoked when a new message is available.
   *
   * New messages will be added to the subscribers inventory, which in turn will
   * automatically extend the messages ack deadline until either:
   *   a. the user acks/nacks it
   *   b. the maxExtension option is hit
   *
   * If the message puts us at/over capacity, then we'll pause our message
   * stream until we've freed up some inventory space.
   *
   * New messages must immediately issue a ModifyAckDeadline request
   * (aka receipt) to confirm with the backend that we did infact receive the
   * message and its ok to start ticking down on the deadline.
   *
   * @private
   */
  private _onData({receivedMessages}: PullResponse): void {
    for (const data of receivedMessages!) {
      const message = new Message(this, data);

      const span: Span | undefined = this._constructSpan(message);

      if (this.isOpen) {
        message.modAck(this.ackDeadline);
        this._inventory.add(message);
      } else {
        message.nack();
      }
      if (span) {
        span.end();
      }
    }
  }

  /**
   * Returns a promise that will resolve once all pending requests have settled.
   *
   * @private
   *
   * @returns {Promise}
   */
  private async _waitForFlush(): Promise<void> {
    const promises: Array<Promise<void>> = [];

    if (this._acks.numPendingRequests) {
      promises.push(this._acks.onFlush());
      this._acks.flush();
    }

    if (this._modAcks.numPendingRequests) {
      promises.push(this._modAcks.onFlush());
      this._modAcks.flush();
    }

    if (this._acks.numInFlightRequests) {
      promises.push(this._acks.onDrain());
    }

    if (this._modAcks.numInFlightRequests) {
      promises.push(this._modAcks.onDrain());
    }

    await Promise.all(promises);
  }
}
