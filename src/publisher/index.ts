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

import {promisifyAll} from '@google-cloud/promisify';
import * as extend from 'extend';
import {CallOptions} from 'google-gax';

import {MessageBatch, BatchPublishOptions} from './message-batch';
import {Queue, OrderedQueue} from './message-queues';
import {Topic} from '../topic';
import {RequestCallback} from '../pubsub';
import {google} from '../../proto/pubsub';

export type PubsubMessage = google.pubsub.v1.IPubsubMessage;

export interface Attributes {
  [key: string]: string;
}

export type PublishCallback = RequestCallback<string>;

export interface PublishOptions {
  batching?: BatchPublishOptions;
  gaxOpts?: CallOptions;
  messageOrdering?: boolean;
}

export const BATCH_LIMITS: BatchPublishOptions = {
  maxBytes: Math.pow(1024, 2) * 9,
  maxMessages: 1000,
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
  // tslint:disable-next-line variable-name
  Promise?: PromiseConstructor;
  topic: Topic;
  settings!: PublishOptions;
  queue: Queue;
  orderedQueues: Map<string, OrderedQueue>;
  constructor(topic: Topic, options?: PublishOptions) {
    if (topic.Promise) {
      this.Promise = topic.Promise;
    }

    this.setOptions(options);
    this.topic = topic;
    this.queue = new Queue(this);
    this.orderedQueues = new Map();
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
   * Publish the provided message.
   *
   * @private
   *
   * @throws {TypeError} If data is not a Buffer object.
   * @throws {TypeError} If any value in `attributes` object is not a string.
   *
   * @param {PubsubMessage} [message] Options for this message.
   * @param {PublishCallback} [callback] Callback function.
   */
  publishMessage(message: PubsubMessage, callback: PublishCallback): void {
    const {data, attributes = {}} = message;

    if (!(data instanceof Buffer)) {
      throw new TypeError('Data must be in the form of a Buffer.');
    }

    for (const key of Object.keys(attributes!)) {
      const value = attributes![key];
      if (typeof value !== 'string') {
        throw new TypeError(`All attributes must be in the form of a string.
\nInvalid value of type "${typeof value}" provided for "${key}".`);
      }
    }

    if (!message.orderingKey) {
      this.queue.add(message, callback);
      return;
    }

    const key = message.orderingKey;

    if (!this.orderedQueues.has(key)) {
      const queue = new OrderedQueue(this, key);
      this.orderedQueues.set(key, queue);
      queue.once('drain', () => this.orderedQueues.delete(key));
    }

    const queue = this.orderedQueues.get(key)!;
    queue.add(message, callback);
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
   * Sets the Publisher options.
   *
   * @private
   *
   * @param {PublishOptions} options The publisher options.
   */
  setOptions(options = {} as PublishOptions): void {
    const defaults = {
      batching: {
        maxBytes: Math.pow(1024, 2) * 5,
        maxMessages: 1000,
        maxMilliseconds: 100,
      },
      messageOrdering: false,
      gaxOpts: {
        isBundling: false,
      },
    };

    const {batching, gaxOpts, messageOrdering} = extend(
      true,
      defaults,
      options
    );

    this.settings = {
      batching: {
        maxBytes: Math.min(batching.maxBytes, BATCH_LIMITS.maxBytes!),
        maxMessages: Math.min(batching.maxMessages, BATCH_LIMITS.maxMessages!),
        maxMilliseconds: batching.maxMilliseconds,
      },
      gaxOpts,
      messageOrdering,
    };
  }
}

promisifyAll(Publisher, {
  singular: true,
  exclude: ['publish', 'setOptions'],
});
