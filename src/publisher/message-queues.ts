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

import {ServiceError} from 'google-gax';
import {EventEmitter} from 'events';

import {BatchPublishOptions, MessageBatch} from './message-batch';
import {PublishError} from './publish-error';
import {Publisher, PubsubMessage, PublishCallback} from './';
import {google} from '../../protos/protos';

export interface PublishDone {
  (err: ServiceError | null): void;
}

/**
 * Queues are used to manage publishing batches of messages.
 *
 * @private
 *
 * @param {Publisher} publisher The parent publisher.
 */
export abstract class MessageQueue extends EventEmitter {
  batchOptions: BatchPublishOptions;
  publisher: Publisher;
  pending?: NodeJS.Timer;
  constructor(publisher: Publisher) {
    super();
    this.publisher = publisher;
    this.batchOptions = publisher.settings.batching!;
  }
  /**
   * Adds a message to the queue.
   *
   * @abstract
   *
   * @param {object} message The message to publish.
   * @param {PublishCallback} callback The publish callback.
   */
  abstract add(message: PubsubMessage, callback: PublishCallback): void;
  /**
   * Method to initiate publishing.
   *
   * @abstract
   */
  abstract publish(): void;
  /**
   * Accepts a batch of messages and publishes them to the API.
   *
   * @param {object[]} messages The messages to publish.
   * @param {PublishCallback[]} callbacks The corresponding callback functions.
   * @param {function} [callback] Callback to be fired when publish is done.
   */
  _publish(
    messages: PubsubMessage[],
    callbacks: PublishCallback[],
    callback?: PublishDone
  ): void {
    const {topic, settings} = this.publisher;
    const reqOpts = {
      topic: topic.name,
      messages,
    };
    if (messages.length === 0) {
      if (typeof callback === 'function') {
        callback(null);
      }
      return;
    }

    topic.request<google.pubsub.v1.IPublishResponse>(
      {
        client: 'PublisherClient',
        method: 'publish',
        reqOpts,
        gaxOpts: settings.gaxOpts!,
      },
      (err, resp) => {
        const messageIds = (resp && resp.messageIds) || [];
        callbacks.forEach((callback, i) => callback(err, messageIds[i]));

        if (typeof callback === 'function') {
          callback(err);
        }
      }
    );
  }
}

/**
 * Standard message queue used for publishing messages.
 *
 * @private
 * @extends MessageQueue
 *
 * @param {Publisher} publisher The publisher.
 */
export class Queue extends MessageQueue {
  batch: MessageBatch;
  constructor(publisher: Publisher) {
    super(publisher);
    this.batch = new MessageBatch(this.batchOptions);
  }
  /**
   * Adds a message to the queue.
   *
   * @param {PubsubMessage} message The message to publish.
   * @param {PublishCallback} callback The publish callback.
   */
  add(message: PubsubMessage, callback: PublishCallback): void {
    if (!this.batch.canFit(message)) {
      this.publish();
    }

    this.batch.add(message, callback);

    if (this.batch.isFull()) {
      this.publish();
    } else if (!this.pending) {
      const {maxMilliseconds} = this.batchOptions;
      this.pending = setTimeout(() => this.publish(), maxMilliseconds!);
    }
  }
  /**
   * Cancels any pending publishes and calls _publish immediately.
   */
  publish(callback?: PublishDone): void {
    const {messages, callbacks} = this.batch;

    this.batch = new MessageBatch(this.batchOptions);

    if (this.pending) {
      clearTimeout(this.pending);
      delete this.pending;
    }

    this._publish(messages, callbacks, callback);
  }
}

/**
 * Queue for handling ordered messages. Unlike the standard queue, this
 * ensures that batches are published one at a time and throws an exception in
 * the event that any batch fails to publish.
 *
 * @private
 * @extends MessageQueue
 *
 * @param {Publisher} publisher The publisher.
 * @param {string} key The key used to order the messages.
 */
export class OrderedQueue extends MessageQueue {
  batches: MessageBatch[];
  inFlight: boolean;
  error?: null | PublishError;
  key: string;
  constructor(publisher: Publisher, key: string) {
    super(publisher);
    this.batches = [];
    this.inFlight = false;
    this.key = key;
  }
  /**
   * Reference to the batch we're currently filling.
   * @returns {MessageBatch}
   */
  get currentBatch(): MessageBatch {
    if (!this.batches.length) {
      this.batches.push(this.createBatch());
    }
    return this.batches[0];
  }
  /**
   * Adds a message to a batch, creating a new batch if need be.
   *
   * @param {object} message The message to publish.
   * @param {PublishCallback} callback The publish callback.
   */
  add(message: PubsubMessage, callback: PublishCallback): void {
    if (this.error) {
      callback(this.error);
      return;
    }

    if (this.inFlight) {
      // in the event that a batch is currently in flight, we can overfill
      // the next batch as long as it hasn't hit the API limit
      if (this.currentBatch.isAtMax()) {
        this.batches.unshift(this.createBatch());
      }

      this.currentBatch.add(message, callback);
      return;
    }

    if (!this.currentBatch.canFit(message)) {
      this.publish();
    }

    this.currentBatch.add(message, callback);

    // it is possible that we triggered a publish earlier, so we'll need to
    // check again here
    if (!this.inFlight) {
      if (this.currentBatch.isFull()) {
        this.publish();
      } else if (!this.pending) {
        this.beginNextPublish();
      }
    }
  }
  /**
   * Starts a timeout to publish any pending messages.
   */
  beginNextPublish(): void {
    const maxMilliseconds = this.batchOptions.maxMilliseconds!;
    const timeWaiting = Date.now() - this.currentBatch.created;
    const delay = Math.max(0, maxMilliseconds - timeWaiting);

    this.pending = setTimeout(() => this.publish(), delay);
  }
  /**
   * Creates a new {@link MessageBatch} instance.
   *
   * @returns {MessageBatch}
   */
  createBatch() {
    return new MessageBatch(this.batchOptions);
  }
  /**
   * In the event of a publish failure, we need to cache the error in question
   * and reject all pending publish calls, prompting the user to call
   * {@link OrderedQueue#resumePublishing}.
   *
   * @param {Error} err The publishing error.
   */
  handlePublishFailure(err: ServiceError): void {
    this.error = new PublishError(this.key, err);

    // reject all pending publishes
    while (this.batches.length) {
      const {callbacks} = this.batches.pop()!;
      callbacks.forEach(callback => callback(err));
    }
  }
  /**
   * Publishes the messages. If successful it will prepare the next batch to be
   * published immediately after. If an error occurs, it will reject all
   * pending messages. In the event that no pending messages/batches are left,
   * a "drain" event will be fired, indicating to the publisher that it is
   * safe to delete this queue.
   *
   * @fires OrderedQueue#drain
   */
  publish(callback?: PublishDone): void {
    const definedCallback = callback || (() => {});
    this.inFlight = true;

    if (this.pending) {
      clearTimeout(this.pending);
      delete this.pending;
    }

    const {messages, callbacks} = this.batches.pop()!;

    this._publish(messages, callbacks, (err: null | ServiceError) => {
      this.inFlight = false;

      if (err) {
        this.handlePublishFailure(err);
        definedCallback(err);
      } else if (this.batches.length) {
        this.beginNextPublish();
      } else {
        this.emit('drain');
        definedCallback(null);
      }
    });
  }

  /**
   * Tells the queue it is ok to continue publishing messages.
   */
  resumePublishing(): void {
    delete this.error;

    // once this is called, we'll make this object eligible for garbage
    // collection. by wrapping in nextTick() we'll give users an opportunity
    // to use it again instead of deleting instantly and then creating a new
    // instance.
    process.nextTick(() => {
      if (!this.batches.length) {
        this.emit('drain');
      }
    });
  }
}
