/*!
 * Copyright 2017 Google Inc. All Rights Reserved.
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
import * as arrify from 'arrify';
import {CallOptions} from 'google-gax';
import {google} from '../proto/pubsub';

const each = require('async-each');
import * as extend from 'extend';
import is from '@sindresorhus/is';
import {Topic} from './topic';
import {RequestCallback} from './pubsub';

interface Inventory {
  callbacks: PublishCallback[];
  queued: google.pubsub.v1.IPubsubMessage[];
  bytes: number;
}

export type Attributes = {
  [key: string]: string
};
export type PublishCallback = RequestCallback<string>;

/**
 * @typedef BatchPublishOptions
 * @property {number} [maxBytes=1024^2 * 5] The maximum number of bytes to
 *     buffer before sending a payload.
 * @property {number} [maxMessages=1000] The maximum number of messages to
 *     buffer before sending a payload.
 * @property {number} [maxMilliseconds=100] The maximum duration to wait before
 *     sending a payload.
 */
export interface BatchPublishOptions {
  maxBytes?: number;
  maxMessages?: number;
  maxMilliseconds?: number;
}

/**
 * @typedef PublishOptions
 * @property {BatchPublishOptions} [batching] Batching settings.
 * @property {object} [gaxOpts] Request configuration options, outlined
 *     here: https://googleapis.github.io/gax-nodejs/CallSettings.html.
 */
export interface PublishOptions {
  batching?: BatchPublishOptions;
  gaxOpts?: CallOptions;
}

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
 *
 * @example
 * const {PubSub} = require('@google-cloud/pubsub');
 * const pubsub = new PubSub();
 *
 * const topic = pubsub.topic('my-topic');
 * const publisher = topic.publisher();
 */
export class Publisher {
  // tslint:disable-next-line variable-name
  Promise?: PromiseConstructor;
  topic: Topic;
  inventory_: Inventory;
  settings!: PublishOptions;
  timeoutHandle_?: NodeJS.Timer;
  constructor(topic: Topic, options?: PublishOptions) {
    if (topic.Promise) {
      this.Promise = topic.Promise;
    }

    this.setOptions(options);

    this.topic = topic;
    // this object keeps track of all messages scheduled to be published
    // queued is essentially the `messages` field for the publish rpc req opts
    // bytes is used to track the size of the combined payload
    // callbacks is an array of callbacks - each callback is associated with a
    // specific message.
    this.inventory_ = {
      callbacks: [],
      queued: [],
      bytes: 0,
    };
  }
  /**
   * @typedef {array} PublishResponse
   * @property {string} 0 The id for the message.
   */
  /**
   * @callback PublishCallback
   * @param {?Error} err Request error, if any.
   * @param {string} messageId The id for the message.
   */
  /**
   * Publish the provided message.
   *
   * @private
   *
   * @throws {TypeError} If data is not a Buffer object.
   * @throws {TypeError} If any value in `attributes` object is not a string.
   *
   * @param {buffer} data The message data. This must come in the form of a
   *     Buffer object.
   * @param {object.<string, string>} [attributes] Attributes for this message.
   * @param {PublishCallback} [callback] Callback function.
   * @returns {Promise<PublishResponse>}
   *
   * @example
   * const {PubSub} = require('@google-cloud/pubsub');
   * const pubsub = new PubSub();
   *
   * const topic = pubsub.topic('my-topic');
   * const publisher = topic.publisher();
   *
   * const data = Buffer.from('Hello, world!');
   *
   * const callback = (err, messageId) => {
   *   if (err) {
   *     // Error handling omitted.
   *   }
   * };
   *
   * publisher.publish(data, callback);
   *
   * //-
   * // Optionally you can provide an object containing attributes for the
   * // message. Note that all values in the object must be strings.
   * //-
   * const attributes = {
   *   key: 'value'
   * };
   *
   * publisher.publish(data, attributes, callback);
   *
   * //-
   * // If the callback is omitted, we'll return a Promise.
   * //-
   * publisher.publish(data).then((messageId) => {});
   */
  publish(data: Buffer, attributes?: Attributes): Promise<string>;
  publish(data: Buffer, callback: PublishCallback): void;
  publish(data: Buffer, attributes: Attributes, callback: PublishCallback):
      void;
  publish(
      data: Buffer, attributesOrCallback?: Attributes|PublishCallback,
      callback?: PublishCallback): Promise<string>|void {
    if (!(data instanceof Buffer)) {
      throw new TypeError('Data must be in the form of a Buffer.');
    }

    const attributes =
        typeof attributesOrCallback === 'object' ? attributesOrCallback : {};
    callback = typeof attributesOrCallback === 'function' ?
        attributesOrCallback :
        callback;
    // Ensure the `attributes` object only has string values
    for (const key of Object.keys(attributes)) {
      const value = attributes[key];
      if (!is.string(value)) {
        throw new TypeError(`All attributes must be in the form of a string.
\nInvalid value of type "${typeof value}" provided for "${key}".`);
      }
    }

    const opts = this.settings!.batching!;
    // if this message puts us over the maxBytes option, then let's ship
    // what we have and add it to the next batch
    if (this.inventory_.bytes > 0 &&
        this.inventory_.bytes + data.length > opts.maxBytes!) {
      this.publish_();
    }
    // add it to the queue!
    this.queue_(data, attributes, callback!);
    // next lets check if this message brings us to the message cap or if we
    // hit the max byte limit
    const hasMaxMessages = this.inventory_.queued.length === opts.maxMessages;
    if (this.inventory_.bytes >= opts.maxBytes! || hasMaxMessages) {
      this.publish_();
      return;
    }
    // otherwise let's set a timeout to send the next batch
    if (!this.timeoutHandle_) {
      this.timeoutHandle_ =
          setTimeout(this.publish_.bind(this), opts.maxMilliseconds!);
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
    };

    const {batching, gaxOpts} = extend(true, defaults, options);

    this.settings = {
      batching: {
        maxBytes: Math.min(batching.maxBytes, Math.pow(1024, 2) * 9),
        maxMessages: Math.min(batching.maxMessages, 1000),
        maxMilliseconds: batching.maxMilliseconds,
      },
      gaxOpts,
    };
  }
  /**
   * This publishes a batch of messages and should never be called directly.
   *
   * @private
   */
  publish_() {
    const callbacks = this.inventory_.callbacks;
    const messages = this.inventory_.queued;
    this.inventory_.callbacks = [];
    this.inventory_.queued = [];
    this.inventory_.bytes = 0;

    if (this.timeoutHandle_) {
      clearTimeout(this.timeoutHandle_);
      delete this.timeoutHandle_;
    }

    const reqOpts = {
      topic: this.topic.name,
      messages,
    };
    this.topic.request<google.pubsub.v1.IPublishResponse>(
        {
          client: 'PublisherClient',
          method: 'publish',
          reqOpts,
          gaxOpts: this.settings!.gaxOpts!,
        },
        (err, resp) => {
          const messageIds = arrify(resp && resp.messageIds);
          each(callbacks, (callback: PublishCallback, next: Function) => {
            const messageId = messageIds[callbacks.indexOf(callback)];
            callback(err, messageId);
            next();
          });
        });
  }
  /**
   * Queues message to be sent to the server.
   *
   * @private
   *
   * @param {buffer} data The message data.
   * @param {object} attributes The message attributes.
   * @param {function} callback The callback function.
   */
  queue_(data: Buffer, attrs: Attributes): Promise<string>;
  queue_(data: Buffer, attrs: Attributes, callback: PublishCallback): void;
  queue_(data: Buffer, attrs: Attributes, callback?: PublishCallback):
      void|Promise<string> {
    this.inventory_.queued.push({
      data,
      attributes: attrs,
    });
    this.inventory_.bytes += data.length;
    this.inventory_.callbacks.push(callback!);
  }
}

/*! Developer Documentation
 *
 * All async methods (except for streams) will return a Promise in the event
 * that a callback is omitted.
 */
promisifyAll(Publisher, {
  singular: true,
  exclude: ['setOptions'],
});
