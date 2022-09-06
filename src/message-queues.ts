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

import {CallOptions, GoogleError, grpc} from 'google-gax';
import defer = require('p-defer');
import {
  AckErrorInfo,
  AckErrorCodes,
  processAckErrorInfo,
  processAckRpcError,
} from './ack-metadata';
import {
  AckError,
  AckResponse,
  AckResponses,
  Message,
  Subscriber,
} from './subscriber';
import {addToBucket} from './util';

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
 * Now that we have exactly once subscriptions, we'll only throw one
 * of these if there was an unknown error.
 *
 * @class
 *
 * @param {string} message The error message.
 * @param {GoogleError} err The grpc error.
 */
export class BatchError extends Error {
  ackIds: string[];
  code: grpc.status;
  details: string;
  constructor(err: GoogleError, ackIds: string[], rpc: string) {
    super(
      `Failed to "${rpc}" for ${ackIds.length} message(s). Reason: ${
        process.env.DEBUG_GRPC ? err.stack : err.message
      }`
    );

    this.ackIds = ackIds;
    this.code = err.code!;
    this.details = err.message;
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
  protected abstract _sendBatch(batch: QueuedMessages): Promise<QueuedMessages>;

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
      const newBatch = await this._sendBatch(batch);

      // We'll get back anything that needs a retry for transient errors.
      this._requests = newBatch;
      this.numPendingRequests += newBatch.length;
      this.numInFlightRequests += newBatch.length;
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

  /**
   * Succeed a whole batch of Acks/Modacks for an OK RPC response.
   *
   * @private
   */
  handleAckSuccesses(batch: QueuedMessages) {
    // Everyone gets a resolve!
    batch.forEach(({responsePromise}) => {
      responsePromise?.resolve(AckResponses.Success);
    });
  }

  /**
   * If we get an RPC failure of any kind, this will sort out the mess
   * and follow up on any Promises. If some need to be retried, those
   * will be returned as a new batch.
   *
   * @private
   */
  handleAckFailures(
    operation: string,
    batch: QueuedMessages,
    rpcError: GoogleError
  ) {
    const toSucceed: QueuedMessages = [];
    const toRetry: QueuedMessages = [];
    const toError = new Map<AckResponse, QueuedMessages>([
      [AckResponses.PermissionDenied, []],
      [AckResponses.FailedPrecondition, []],
      [AckResponses.Other, []],
    ]);

    // Parse any error codes, both for the RPC call and the ErrorInfo.
    const error: AckErrorInfo | undefined = rpcError.code
      ? processAckRpcError(rpcError.code)
      : undefined;
    const codes: AckErrorCodes = processAckErrorInfo(rpcError);

    for (const m of batch) {
      if (codes.has(m.ackId)) {
        // This ack has an ErrorInfo entry, so use that to route it.
        const code = codes.get(m.ackId)!;
        if (code.transient) {
          // Transient errors get retried.
          toRetry.push(m);
        } else {
          // It's a permanent error.
          addToBucket(toError, code.response!, m);
        }
      } else if (error !== undefined) {
        // This ack doesn't have an ErrorInfo entry, but we do have an RPC
        // error, so use that to route it.
        if (error.transient) {
          toRetry.push(m);
        } else {
          addToBucket(toError, error.response!, m);
        }
      } else {
        // Looks like this one worked out.
        toSucceed.push(m);
      }
    }

    // To remain consistent with previous behaviour, we will push a debug
    // stream message if an unknown error happens during ack.
    const others = toError.get(AckResponses.Other);
    if (others?.length) {
      const otherIds = others.map(e => e.ackId);
      this._subscriber.emit(
        'debug',
        new BatchError(rpcError, otherIds, operation)
      );
    }

    // Take care of following up on all the Promises.
    toSucceed.forEach(m => {
      m.responsePromise?.resolve(AckResponses.Success);
    });
    for (const e of toError.entries()) {
      e[1].forEach(m => {
        const exc = new AckError(e[0], rpcError.message);
        m.responsePromise?.reject(exc);
      });
    }
    return {
      toError,
      toRetry,
    };
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
  protected async _sendBatch(batch: QueuedMessages): Promise<QueuedMessages> {
    const client = await this._subscriber.getClient();
    const ackIds = batch.map(({ackId}) => ackId);
    const reqOpts = {subscription: this._subscriber.name, ackIds};

    try {
      await client.acknowledge(reqOpts, this._options.callOptions!);

      // It's okay if these pass through since they're successful anyway.
      this.handleAckSuccesses(batch);
      return [];
    } catch (e) {
      // If exactly-once isn't enabled, don't do error processing.
      if (!this._subscriber.isExactlyOnce) {
        batch.forEach(m => {
          m.responsePromise?.resolve(AckResponses.Success);
        });
        return [];
      } else {
        const grpcError = e as GoogleError;
        try {
          const results = this.handleAckFailures('ack', batch, grpcError);
          return results.toRetry;
        } catch (e) {
          // This should only ever happen if there's a code failure.
          this._subscriber.emit('debug', e);
          const exc = new AckError(AckResponses.Other, 'Code error');
          batch.forEach(m => {
            m.responsePromise?.reject(exc);
          });
          return [];
        }
      }
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
  protected async _sendBatch(batch: QueuedMessages): Promise<QueuedMessages> {
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
        await client.modifyAckDeadline(reqOpts, this._options.callOptions!);

        // It's okay if these pass through since they're successful anyway.
        this.handleAckSuccesses(messages);
        return [];
      } catch (e) {
        // If exactly-once isn't enabled, don't do error processing.
        if (!this._subscriber.isExactlyOnce) {
          batch.forEach(m => {
            m.responsePromise?.resolve(AckResponses.Success);
          });
          return [];
        } else {
          const grpcError = e as GoogleError;

          const newBatch = this.handleAckFailures(
            'modAck',
            messages,
            grpcError
          );
          return newBatch.toRetry;
        }
      }
    });

    try {
      const allNewBatches: QueuedMessages[] = await Promise.all(modAckRequests);
      return allNewBatches.reduce((p: QueuedMessage[], c: QueuedMessage[]) => [
        ...(p ?? []),
        ...c,
      ]);
    } catch (e) {
      // This should only ever happen if there's a code failure.
      this._subscriber.emit('debug', e);
      const exc = new AckError(AckResponses.Other, 'Code error');
      batch.forEach(m => {
        m.responsePromise?.reject(exc);
      });
      return [];
    }
  }
}
