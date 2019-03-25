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

import {CallOptions} from 'google-gax';
import {Metadata, ServiceError, status} from 'grpc';
import defer, {DeferredPromise} from 'p-defer';

import {Message, Subscriber} from './subscriber';

type QueuedMessages = Array<[string, number?]>;

/**
 * @typedef {object} BatchOptions
 * @property {object} [callOptions] Request configuration option, outlined
 *     here: {@link https://googleapis.github.io/gax-nodejs/CallSettings.html}.
 * @property {number} [maxMessages=3000] Maximum number of messages allowed in
 *     each batch sent.
 * @property {number} [maxMilliseconds=100] Maximum duration to wait before
 *     sending a batch. Batches can be sent earlier if the maxMessages option
 *     is met before the configured duration has passed.
 */
export interface BatchOptions {
  callOptions?: CallOptions;
  maxMessages?: number;
  maxMilliseconds?: number;
}

/**
 * Error class used to signal a batch failure.
 *
 * @class
 *
 * @param {string} message The error message.
 * @param {ServiceError} err The grpc service error.
 */
export class BatchError extends Error implements ServiceError {
  ackIds: string[];
  code?: status;
  metadata?: Metadata;
  constructor(err: ServiceError, ackIds: string[], rpc: string) {
    super(`Failed to "${rpc}" for ${ackIds.length} message(s). Reason: ${
        err.message}`);

    this.ackIds = ackIds;
    this.code = err.code;
    this.metadata = err.metadata;
  }
}

/**
 * Class for buffering ack/modAck requests.
 *
 * @private
 * @class
 *
 * @param {Subscriber} sub The subscriber we're queueing requests for.
 * @param {BatchOptions} options Batching options.
 */
export abstract class MessageQueue {
  numPendingRequests: number;
  protected _onFlush?: DeferredPromise<void>;
  protected _options!: BatchOptions;
  protected _requests: QueuedMessages;
  protected _subscriber: Subscriber;
  protected _timer?: NodeJS.Timer;
  protected abstract _sendBatch(batch: QueuedMessages): Promise<void>;
  constructor(sub: Subscriber, options = {} as BatchOptions) {
    this.numPendingRequests = 0;
    this._requests = [];
    this._subscriber = sub;

    this.setOptions(options);
  }
  /**
   * Gets the default buffer time in ms.
   *
   * @returns {number}
   * @private
   */
  get maxMilliseconds(): number {
    return this._options!.maxMilliseconds!;
  }
  /**
   * Adds a message to the queue.
   *
   * @param {Message} message The message to add.
   * @param {number} [deadline] The deadline.
   * @private
   */
  add({ackId}: Message, deadline?: number): void {
    const {maxMessages, maxMilliseconds} = this._options;

    this._requests.push([ackId, deadline]);
    this.numPendingRequests += 1;

    if (this._requests.length >= maxMessages!) {
      this.flush();
    } else if (!this._timer) {
      this._timer = setTimeout(() => this.flush(), maxMilliseconds!);
    }
  }
  /**
   * Sends a batch of messages.
   * @private
   */
  async flush(): Promise<void> {
    if (this._timer) {
      clearTimeout(this._timer);
      delete this._timer;
    }

    const batch = this._requests;
    const batchSize = batch.length;
    const deferred = this._onFlush;

    this._requests = [];
    this.numPendingRequests -= batchSize;
    delete this._onFlush;

    try {
      await this._sendBatch(batch);
    } catch (e) {
      this._subscriber.emit('error', e);
    }

    if (deferred) {
      deferred.resolve();
    }
  }
  /**
   * Returns a promise that resolves after the next flush occurs.
   *
   * @returns {Promise}
   * @private
   */
  onFlush(): Promise<void> {
    if (!this._onFlush) {
      this._onFlush = defer();
    }
    return this._onFlush.promise;
  }
  /**
   * Set the batching options.
   *
   * @param {BatchOptions} options Batching options.
   * @private
   */
  setOptions(options: BatchOptions): void {
    const defaults: BatchOptions = {maxMessages: 3000, maxMilliseconds: 100};

    this._options = Object.assign(defaults, options);
  }
}

/**
 * Queues up Acknowledge (ack) requests.
 *
 * @private
 * @class
 */
export class AckQueue extends MessageQueue {
  /**
   * Sends a batch of ack requests.
   *
   * @private
   *
   * @param {Array.<Array.<string|number>>} batch Array of ackIds and deadlines.
   * @return {Promise}
   */
  protected async _sendBatch(batch: QueuedMessages): Promise<void> {
    const client = await this._subscriber.getClient();
    const ackIds = batch.map(([ackId]) => ackId);
    const reqOpts = {subscription: this._subscriber.name, ackIds};

    try {
      await client.acknowledge(reqOpts, this._options.callOptions!);
    } catch (e) {
      throw new BatchError(e, ackIds, 'acknowledge');
    }
  }
}

/**
 * Queues up ModifyAckDeadline requests and sends them out in batches.
 *
 * @private
 * @class
 */
export class ModAckQueue extends MessageQueue {
  /**
   * Sends a batch of modAck requests. Each deadline requires its own request,
   * so we have to group all the ackIds by deadline and send multiple requests.
   *
   * @private
   *
   * @param {Array.<Array.<string|number>>} batch Array of ackIds and deadlines.
   * @return {Promise}
   */
  protected async _sendBatch(batch: QueuedMessages): Promise<void> {
    const client = await this._subscriber.getClient();
    const subscription = this._subscriber.name;
    const modAckTable: {[index: string]: string[]} = batch.reduce(
        (table: {[index: string]: string[]}, [ackId, deadline]) => {
          if (!table[deadline!]) {
            table[deadline!] = [];
          }

          table[deadline!].push(ackId);
          return table;
        },
        {});

    const modAckRequests = Object.keys(modAckTable).map(async (deadline) => {
      const ackIds = modAckTable[deadline];
      const ackDeadlineSeconds = Number(deadline);
      const reqOpts = {subscription, ackIds, ackDeadlineSeconds};

      try {
        await client.modifyAckDeadline(reqOpts, this._options.callOptions!);
      } catch (e) {
        throw new BatchError(e, ackIds, 'modifyAckDeadline');
      }
    });

    await Promise.all(modAckRequests);
  }
}
