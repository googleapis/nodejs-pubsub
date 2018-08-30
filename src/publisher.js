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

'use strict';

const arrify = require('arrify');
const {promisifyAll} = require('@google-cloud/promisify');
const each = require('async-each');
const extend = require('extend');
const is = require('is');

/**
 * A Publisher object allows you to publish messages to a specific topic.
 *
 * @class
 *
 * @see [Topics: publish API Documentation]{@link https://cloud.google.com/pubsub/docs/reference/rest/v1/projects.topics/publish}
 *
 * @param {Topic} topic The topic associated with this publisher.
 * @param {object} [options] Configuration object.
 * @param {object} [options.batching] Batching settings.
 * @param {number} [options.batching.maxBytes] The maximum number of bytes to
 *     buffer before sending a payload.
 * @param {number} [options.batching.maxMessages] The maximum number of messages
 *     to buffer before sending a payload.
 * @param {number} [options.batching.maxMilliseconds] The maximum duration to
 *     wait before sending a payload. Defaults to 100 milliseconds.
 * @param {object} [options.gaxOpts] Request configuration options, outlined
 *     here: https://googleapis.github.io/gax-nodejs/CallSettings.html.
 *
 * @example
 * const PubSub = require('@google-cloud/pubsub');
 * const pubsub = new PubSub();
 *
 * const topic = pubsub.topic('my-topic');
 * const publisher = topic.publisher();
 */
class Publisher {
  constructor(topic, options) {
    if (topic.Promise) {
      this.Promise = topic.Promise;
    }
    options = extend(
      true,
      {
        batching: {
          maxBytes: Math.pow(1024, 2) * 5,
          maxMessages: 1000,
          maxMilliseconds: 100,
        },
      },
      options
    );
    /**
     * The topic of this publisher.
     *
     * @name Publisher#topic
     * @type {Topic} topic
     */
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
    this.settings = {
      batching: {
        maxBytes: Math.min(options.batching.maxBytes, Math.pow(1024, 2) * 9),
        maxMessages: Math.min(options.batching.maxMessages, 1000),
        maxMilliseconds: options.batching.maxMilliseconds,
      },
      gaxOpts: options.gaxOpts,
    };
    this.timeoutHandle_ = null;
  }
  /**
   * @typedef {array} PublisherPublishResponse
   * @property {string} 0 The id for the message.
   */
  /**
   * @callback PublisherPublishCallback
   * @param {?Error} err Request error, if any.
   * @param {string} messageId The id for the message.
   */
  /**
   * Publish the provided message.
   *
   * @throws {TypeError} If data is not a Buffer object.
   * @throws {TypeError} If any value in `attributes` object is not a string.
   *
   * @param {buffer} data The message data. This must come in the form of a
   *     Buffer object.
   * @param {object.<string, string>} [attributes] Attributes for this message.
   * @param {PublisherPublishCallback} [callback] Callback function.
   * @returns {Promise<PublisherPublishResponse>}
   *
   * @example
   * const PubSub = require('@google-cloud/pubsub');
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
  publish(data, attributes, callback) {
    if (!(data instanceof Buffer)) {
      throw new TypeError('Data must be in the form of a Buffer.');
    }
    if (is.fn(attributes)) {
      callback = attributes;
      attributes = {};
    }
    // Ensure the `attributes` object only has string values
    for (const key in attributes) {
      const value = attributes[key];
      if (!is.string(value)) {
        throw new TypeError(`All attributes must be in the form of a string.
\nInvalid value of type "${typeof value}" provided for "${key}".`);
      }
    }
    const opts = this.settings.batching;
    // if this message puts us over the maxBytes option, then let's ship
    // what we have and add it to the next batch
    if (this.inventory_.bytes + data.length > opts.maxBytes) {
      this.publish_();
    }
    // add it to the queue!
    this.queue_(data, attributes, callback);
    // next lets check if this message brings us to the message cap or if we
    // magically hit the max byte limit
    const hasMaxMessages = this.inventory_.queued.length === opts.maxMessages;
    if (this.inventory_.bytes === opts.maxBytes || hasMaxMessages) {
      this.publish_();
      return;
    }
    // otherwise let's set a timeout to send the next batch
    if (!this.timeoutHandle_) {
      this.timeoutHandle_ = setTimeout(
        this.publish_.bind(this),
        opts.maxMilliseconds
      );
    }
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
    clearTimeout(this.timeoutHandle_);
    this.timeoutHandle_ = null;
    const reqOpts = {
      topic: this.topic.name,
      messages: messages,
    };
    this.topic.request(
      {
        client: 'PublisherClient',
        method: 'publish',
        reqOpts: reqOpts,
        gaxOpts: this.settings.gaxOpts,
      },
      (err, resp) => {
        const messageIds = arrify(resp && resp.messageIds);
        each(callbacks, (callback, next) => {
          const messageId = messageIds[callbacks.indexOf(callback)];
          callback(err, messageId);
          next();
        });
      }
    );
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
  queue_(data, attrs, callback) {
    this.inventory_.queued.push({
      data: data,
      attributes: attrs,
    });
    this.inventory_.bytes += data.length;
    this.inventory_.callbacks.push(callback);
  }
}

/*! Developer Documentation
 *
 * All async methods (except for streams) will return a Promise in the event
 * that a callback is omitted.
 */
promisifyAll(Publisher, {
  singular: true,
});

module.exports = Publisher;
