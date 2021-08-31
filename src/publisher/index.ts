/*!
 * Copyright 2019 Google Inc. All Rights Reserved.
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

import {promisify} from '@google-cloud/promisify';
import * as extend from 'extend';
import {CallOptions, ServiceError} from 'google-gax';
import {SemanticAttributes} from '@opentelemetry/semantic-conventions';
import {isSpanContextValid, Span, SpanKind} from '@opentelemetry/api';
import * as defer from 'p-defer';

import {BatchPublishOptions} from './message-batch';
import {Queue, OrderedQueue} from './message-queues';
import {Topic, PublishWhenReadyOptions, PublishWhenReadyResult} from '../topic';
import {RequestCallback, EmptyCallback} from '../pubsub';
import {google} from '../../protos/protos';
import {defaultOptions} from '../default-options';
import {createSpan} from '../opentelemetry-tracing';

import {
  FlowControl,
  PublisherFlowControlOptions,
  PublisherFlowControlAction,
} from './flow-control';
import {deferredCatch, promisifySome} from '../util';

export type PubsubMessage = google.pubsub.v1.IPubsubMessage;

export interface Attributes {
  [key: string]: string;
}

export type PublishCallback = RequestCallback<string>;

export interface PublishOptions {
  batching?: BatchPublishOptions;
  publisherFlowControl?: PublisherFlowControlOptions;
  gaxOpts?: CallOptions;
  messageOrdering?: boolean;
  enableOpenTelemetryTracing?: boolean;
}

/**
 * @typedef PublishOptions
 * @property {BatchPublishOptions} [batching] The maximum number of bytes to
 *     buffer before sending a payload.
 * @property {FlowControlOptions} [publisherFlowControl] Publisher-side flow
 *     control settings. If this is undefined, Ignore will be the assumed action.
 * @property {object} [gaxOpts] Request configuration options, outlined
 *     {@link https://googleapis.github.io/gax-nodejs/interfaces/CallOptions.html|here.}
 * @property {boolean} [messageOrdering] If true, messages published with the
 * same order key in Message will be delivered to the subscribers in the order in which they
 *  are received by the Pub/Sub system. Otherwise, they may be delivered in
 * any order.
 */

export const BATCH_LIMITS: BatchPublishOptions = {
  maxBytes: Math.pow(1024, 2) * 9,
  maxMessages: 1000,
};

export const publisherFlowControlDefaults: PublisherFlowControlOptions = {
  maxOutstandingBytes: undefined,
  maxOutstandingMessages: undefined,
  action: PublisherFlowControlAction.Ignore,
};

/**
 * A Publisher object allows you to publish messages to a specific topic.
 *
 * @private
 * @class
 *
 * @see [Topics: publish API Documentation]{@link https://cloud.google.com/pubsub/docs/reference/rest/v1/projects.topics/publish}
 *
 * @param {Topic} topic The topic associated with this publisher.
 * @param {PublishOptions} [options] Configuration object.
 */
export class Publisher {
  topic: Topic;
  settings!: PublishOptions;
  queue: Queue;
  orderedQueues: Map<string, OrderedQueue>;
  flowControl: FlowControl;

  constructor(topic: Topic, options?: PublishOptions) {
    this.flowControl = new FlowControl(
      options?.publisherFlowControl ?? publisherFlowControlDefaults
    );
    this.setOptions(options);
    this.topic = topic;
    this.queue = new Queue(this);
    this.orderedQueues = new Map();
  }

  flush(): Promise<void>;
  flush(callback: EmptyCallback): void;
  /**
   * Immediately sends all remaining queued data. This is mostly useful
   * if you are planning to call close() on the PubSub object that holds
   * the server connections.
   *
   * @private
   *
   * @param {EmptyCallback} [callback] Callback function.
   * @returns {Promise<EmptyResponse>}
   */
  flush(callback?: EmptyCallback): Promise<void> | void {
    const definedCallback = callback ? callback : () => {};

    const publishes = [promisify(this.queue.publish).bind(this.queue)()];
    Array.from(this.orderedQueues.values()).forEach(q =>
      publishes.push(promisify(q.publish).bind(q)())
    );
    const allPublishes = Promise.all(publishes);

    allPublishes
      .then(() => {
        definedCallback(null);
      })
      .catch(definedCallback);
  }
  publish(data: Buffer, attributes?: Attributes): Promise<string>;
  publish(data: Buffer, callback: PublishCallback): void;
  publish(
    data: Buffer,
    attributes: Attributes,
    callback: PublishCallback
  ): void;
  /**
   * Publish the provided message.
   *
   * @deprecated use {@link Publisher#publishMessage} instead.
   *
   * @private
   * @see Publisher#publishMessage
   *
   * @param {buffer} data The message data. This must come in the form of a
   *     Buffer object.
   * @param {object.<string, string>} [attributes] Attributes for this message.
   * @param {PublishCallback} [callback] Callback function.
   * @returns {Promise<PublishResponse>}
   */
  publish(
    data: Buffer,
    attrsOrCb?: Attributes | PublishCallback,
    callback?: PublishCallback
  ): Promise<string> | void {
    const attributes = typeof attrsOrCb === 'object' ? attrsOrCb : {};
    callback = typeof attrsOrCb === 'function' ? attrsOrCb : callback;
    return this.publishMessage({data, attributes}, callback!);
  }
  /**
   * Publish the provided message, ignoring `Pause` flow control.
   *
   * @private
   *
   * @throws {TypeError} If data is not a Buffer object.
   * @throws {TypeError} If any value in `attributes` object is not a string.
   * @throws {RangeError} If publisher flow control is set to `Error` and the message won't fit.
   *
   * @param {PubsubMessage} [message] Options for this message.
   * @param {PublishCallback} [callback] Callback function for when the message is published.
   */
  publishMessage(message: PubsubMessage, callback: PublishCallback): void {
    this.prePublishMessage(message);
    this.doPublishMessage(message, {}).then(idPromiseObject => {
      const {idPromise} = idPromiseObject;
      idPromise.then(id => callback(null, id)).catch(err => callback(err));
    });
  }

  /**
   * Publish the provided message, making use of all enabled flow control.
   *
   * Do not use externally, it may change without warning.
   * @private
   *
   * @throws {TypeError} Rejects, if data is not a Buffer object.
   * @throws {TypeError} Rejects, if any value in `attributes` object is not a string.
   * @throws {RangeError} Rejects, if publisher flow control is set to `Error` and the message won't fit.
   *
   * @param {PubsubMessage} message Parameters for this message.
   * @param {PublishWhenReadyOptions} options Options for publishing.
   *
   * @returns {Promise<PublishWhenReadyResult>} A Promise that resolves when the next publish call is
   *  clear to go, with a Promise (in an object) that resolves to the sent message ID, or rejects when
   *  one of the above errors is thrown.
   */
  async publishWhenReady(
    message: PubsubMessage,
    options: PublishWhenReadyOptions
  ): Promise<PublishWhenReadyResult> {
    this.prePublishMessage(message);
    return this.doPublishMessage(message, options);
  }

  /**
   * Does common pre-publishing validation for a message. This is separated
   * out from the potentially async part which waits for queue space and then
   * publishes the message.
   *
   * Do not use externally, it may change without warning.
   * @private
   *
   * @throws {TypeError} If data is not a Buffer object.
   * @throws {TypeError} If any value in `attributes` object is not a string.
   * @throws {RangeError} If publisher flow control is set to `Error` and the message won't fit.
   */
  private prePublishMessage(message: PubsubMessage): void {
    const {data, attributes = {}} = message;

    // We must have at least one of:
    //   - `data` as a Buffer
    //   - `attributes` that are not empty
    if (data && !(data instanceof Buffer)) {
      throw new TypeError('Data must be in the form of a Buffer.');
    }

    const keys = Object.keys(attributes!);
    if (!data && keys.length === 0) {
      throw new TypeError(
        'If data is undefined, at least one attribute must be present.'
      );
    }

    for (const key of keys) {
      const value = attributes![key];
      if (typeof value !== 'string') {
        throw new TypeError(`All attributes must be in the form of a string.
\nInvalid value of type "${typeof value}" provided for "${key}".`);
      }
    }

    // Will it pass publisher flow control handling?
    if (
      this.settings.publisherFlowControl!.action ===
        PublisherFlowControlAction.Error &&
      data
    ) {
      // For error handling, we just want to throw if it would exceed.
      if (this.flowControl.wouldExceed(data.length, 1)) {
        throw new RangeError(
          `Flow control exceeded for ${data.length} bytes and 1 message`
        );
      }
    }
  }

  /**
   * Publish the provided pre-checked message, pausing for flow control if needed.
   *
   * Do not use externally, it may change without warning.
   * @private
   *
   * @param {PubsubMessage} message Parameters for this message.
   * @param {PublishWhenReadyOptions} options Publishing options.
   *
   * @returns {Promise<PublishWhenReadyResult>} A Promise that resolves when there is more
   *   queue space for publishing messages. This will always resolve immediately if flow
   *   control is set to any action besides `Block`.
   */
  private async doPublishMessage(
    message: PubsubMessage,
    options: PublishWhenReadyOptions
  ): Promise<PublishWhenReadyResult> {
    const data = message.data as Buffer | undefined;
    const span: Span | undefined = this.constructSpan(message);

    const deferred = defer<string>();
    if (options.deferRejections) {
      deferred.promise = deferredCatch(deferred.promise);
    }

    let finalCallback = (
      err: ServiceError | null,
      value: string | null | undefined
    ) => {
      if (err) {
        deferred.reject(err);
      } else {
        // In practice, the service will only ever return an array
        // of message IDs, or a null array + error. The individual IDs
        // won't be null, so this ! simplifies our types a lot.
        deferred.resolve(value!);
      }
    };

    // If blocking flow control is enabled, we also need to tag onto
    // the callback to release the queue space for other callers.
    if (
      this.settings.publisherFlowControl!.action ===
      PublisherFlowControlAction.Block
    ) {
      const oldCallback = finalCallback;
      finalCallback = (
        err: ServiceError | null,
        res?: string | null | undefined
      ) => {
        if (data) {
          this.flowControl.sent(data.length, 1);
        }
        oldCallback(err, res);
      };

      // For pausing, we want to wait until space is available.
      await this.flowControl.willSend(data?.length ?? 0, 1);
    }

    if (!message.orderingKey) {
      this.queue.add(message, finalCallback);
    } else {
      const key = message.orderingKey;

      if (!this.orderedQueues.has(key)) {
        const queue = new OrderedQueue(this, key);
        this.orderedQueues.set(key, queue);
        queue.once('drain', () => this.orderedQueues.delete(key));
      }

      const queue = this.orderedQueues.get(key)!;
      queue.add(message, finalCallback);
    }

    if (span) {
      span.end();
    }

    return {idPromise: deferred.promise};
  }
  /**
   * Indicates to the publisher that it is safe to continue publishing for the
   * supplied ordering key.
   *
   * @private
   *
   * @param {string} key The ordering key to continue publishing for.
   */
  resumePublishing(key: string) {
    const queue = this.orderedQueues.get(key);

    if (queue) {
      queue.resumePublishing();
    }
  }

  /**
   * Returns the set of default options used for {@link Publisher}. The
   * returned value is a copy, and editing it will have no effect elsehwere.
   *
   * This is a non-static method to make it easier to access/stub.
   *
   * @private
   *
   * @returns {PublishOptions}
   */
  getOptionDefaults(): PublishOptions {
    // Return a unique copy to avoid shenanigans.
    const defaults = {
      batching: {
        maxBytes: defaultOptions.publish.maxOutstandingBytes,
        maxMessages: defaultOptions.publish.maxOutstandingMessages,
        maxMilliseconds: defaultOptions.publish.maxDelayMillis,
      },
      messageOrdering: false,
      gaxOpts: {
        isBundling: false,
      },
      enableOpenTelemetryTracing: false,
      publisherFlowControl: Object.assign(
        {},
        publisherFlowControlDefaults
      ) as PublisherFlowControlOptions,
    };

    return defaults;
  }

  /**
   * Sets the Publisher options.
   *
   * @private
   *
   * @param {PublishOptions} options The publisher options.
   */
  setOptions(options = {} as PublishOptions): void {
    const defaults = this.getOptionDefaults();

    const {
      batching,
      gaxOpts,
      messageOrdering,
      enableOpenTelemetryTracing,
      publisherFlowControl,
    } = extend(true, defaults, options);

    this.settings = {
      batching: {
        maxBytes: Math.min(batching!.maxBytes!, BATCH_LIMITS.maxBytes!),
        maxMessages: Math.min(
          batching!.maxMessages!,
          BATCH_LIMITS.maxMessages!
        ),
        maxMilliseconds: batching!.maxMilliseconds,
      },
      gaxOpts,
      messageOrdering,
      enableOpenTelemetryTracing,
      publisherFlowControl,
    };

    // We also need to let all of our queues know that they need to update their options.
    // Note that these might be undefined, because setOptions() is called in the constructor.
    if (this.queue) {
      this.queue.updateOptions();
    }
    if (this.orderedQueues) {
      for (const q of this.orderedQueues.values()) {
        q.updateOptions();
      }
    }

    // This will always be filled in by our defaults if nothing else.
    this.flowControl.setOptions(this.settings.publisherFlowControl!);
  }

  /**
   * Constructs an OpenTelemetry span
   *
   * @private
   *
   * @param {PubsubMessage} message The message to create a span for
   */
  constructSpan(message: PubsubMessage): Span | undefined {
    if (!this.settings.enableOpenTelemetryTracing) {
      return undefined;
    }

    const spanAttributes = {
      // Add Opentelemetry semantic convention attributes to the span, based on:
      // https://github.com/open-telemetry/opentelemetry-specification/blob/v1.1.0/specification/trace/semantic_conventions/messaging.md
      [SemanticAttributes.MESSAGING_TEMP_DESTINATION]: false,
      [SemanticAttributes.MESSAGING_SYSTEM]: 'pubsub',
      [SemanticAttributes.MESSAGING_OPERATION]: 'send',
      [SemanticAttributes.MESSAGING_DESTINATION]: this.topic.name,
      [SemanticAttributes.MESSAGING_DESTINATION_KIND]: 'topic',
      [SemanticAttributes.MESSAGING_MESSAGE_ID]: message.messageId,
      [SemanticAttributes.MESSAGING_PROTOCOL]: 'pubsub',
      [SemanticAttributes.MESSAGING_MESSAGE_PAYLOAD_SIZE_BYTES]:
        message.data?.length,
      'messaging.pubsub.ordering_key': message.orderingKey,
    } as Attributes;

    const span: Span = createSpan(
      `${this.topic.name} send`,
      SpanKind.PRODUCER,
      spanAttributes
    );

    // If the span's context is valid we should pass the span context special attribute
    if (isSpanContextValid(span.spanContext())) {
      if (
        message.attributes &&
        message.attributes['googclient_OpenTelemetrySpanContext']
      ) {
        console.warn(
          'googclient_OpenTelemetrySpanContext key set as message attribute, but will be overridden.'
        );
      }
      if (!message.attributes) {
        message.attributes = {};
      }

      message.attributes['googclient_OpenTelemetrySpanContext'] =
        JSON.stringify(span.spanContext());
    }

    return span;
  }
}

promisifySome(Publisher, Publisher.prototype, ['flush', 'publishMessage'], {
  singular: true,
});
