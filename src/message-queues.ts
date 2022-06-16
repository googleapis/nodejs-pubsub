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

import {CallOptions, grpc, ServiceError} from 'google-gax';
import defer = require('p-defer');

import {AckResponse, AckResponses, Message, Subscriber} from './subscriber';

/**
 * @private
 */
export interface QueuedMessage {
  ackId: string;
  deadline?: number;
  responsePromise?: defer.DeferredPromise<AckResponse>;
}

/**
 * @private
 */
export type QueuedMessages = Array<QueuedMessage>;

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
export class BatchError extends Error implements grpc.ServiceError {
  ackIds: string[];
  code: grpc.status;
  details: string;
  metadata: grpc.Metadata;
  constructor(err: grpc.ServiceError, ackIds: string[], rpc: string) {
    super(
      `Failed to "${rpc}" for ${ackIds.length} message(s). Reason: ${
        process.env.DEBUG_GRPC ? err.stack : err.message
      }`
    );

    this.ackIds = ackIds;
    this.code = err.code;
    this.details = err.details;
    this.metadata = err.metadata;
  }
}

/**
 * @typedef {object} BatchOptions
 * @property {object} [callOptions] Request configuration option, outlined
 *     here: {@link https://googleapis.github.io/gax-nodejs/interfaces/CallOptions.html}.
 * @property {number} [maxMessages=3000] Maximum number of messages allowed in
 *     each batch sent.
 * @property {number} [maxMilliseconds=100] Maximum duration to wait before
 *     sending a batch. Batches can be sent earlier if the maxMessages option
 *     is met before the configured duration has passed.
 */
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
  numInFlightRequests: number;
  protected _onFlush?: defer.DeferredPromise<void>;
  protected _onDrain?: defer.DeferredPromise<void>;
  protected _options!: BatchOptions;
  protected _requests: QueuedMessages;
  protected _subscriber: Subscriber;
  protected _timer?: NodeJS.Timer;
  protected abstract _sendBatch(batch: QueuedMessages): Promise<void>;
  constructor(sub: Subscriber, options = {} as BatchOptions) {
    this.numPendingRequests = 0;
    this.numInFlightRequests = 0;
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
  add({ackId}: Message, deadline?: number): Promise<AckResponse> {
    const {maxMessages, maxMilliseconds} = this._options;

    const responsePromise = defer<AckResponse>();
    this._requests.push({
      ackId,
      deadline,
      responsePromise,
    });
    this.numPendingRequests += 1;
    this.numInFlightRequests += 1;

    if (this._requests.length >= maxMessages!) {
      this.flush();
    } else if (!this._timer) {
      this._timer = setTimeout(() => this.flush(), maxMilliseconds!);
    }

    return responsePromise.promise;
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
      // These queues are used for ack and modAck messages, which should
      // never surface an error to the user level. However, we'll emit
      // them onto this debug channel in case debug info is needed.
      this._subscriber.emit('debug', e);
    }

    this.numInFlightRequests -= batchSize;
    if (deferred) {
      deferred.resolve();
    }

    if (this.numInFlightRequests <= 0 && this._onDrain) {
      this._onDrain.resolve();
      delete this._onDrain;
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
   * Returns a promise that resolves when all in-flight messages have settled.
   */
  onDrain(): Promise<void> {
    if (!this._onDrain) {
      this._onDrain = defer();
    }
    return this._onDrain.promise;
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
    const ackIds = batch.map(({ackId}) => ackId);
    const reqOpts = {subscription: this._subscriber.name, ackIds};

    try {
      // TODO: Deal with errors from exactly once.
      await client.acknowledge(reqOpts, this._options.callOptions!);
      batch.forEach(({responsePromise}) => {
        responsePromise?.resolve(AckResponses.Success);
      });
    } catch (e) {
      throw new BatchError(e as ServiceError, ackIds, 'acknowledge');
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
    const modAckTable: {[index: string]: QueuedMessages} = batch.reduce(
      (table: {[index: string]: QueuedMessages}, message) => {
        if (!table[message.deadline!]) {
          table[message.deadline!] = [];
        }

        table[message.deadline!].push(message);
        return table;
      },
      {}
    );

    const modAckRequests = Object.keys(modAckTable).map(async deadline => {
      const messages = modAckTable[deadline];
      const ackIds = messages.map(m => m.ackId);
      const ackDeadlineSeconds = Number(deadline);
      const reqOpts = {subscription, ackIds, ackDeadlineSeconds};

      try {
        // TODO: Deal with errors from exactly once.
        await client.modifyAckDeadline(reqOpts, this._options.callOptions!);
        messages.forEach(({responsePromise}) => {
          responsePromise?.resolve(AckResponses.Success);
        });
      } catch (e) {
        throw new BatchError(e as ServiceError, ackIds, 'modifyAckDeadline');
      }
    });

    await Promise.all(modAckRequests);
  }
}
