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

import * as defer from 'p-defer';

import {Message} from './message-stream';
import {Subscriber} from './subscriber';

/**
 * @typedef {object} BatchOptions
 * @property {number} [maxMessages=3000] Maximum number of messages allowed in
 *     each batch sent.
 * @property {number} [maxMilliseconds=100] Maximum duration to wait before
 *     sending a batch.
 */
export interface BatchOptions {
  maxMessages?: number;
  maxMilliseconds?: number;
}

/**
 * Base class for buffering subscriber requests.
 *
 * @private
 * @class
 *
 * @param {Subscriber} sub The subscriber we're queueing requests for.
 * @param {BatchOptions} options Batching options.
 */
export abstract class Queue {
  pending: number;
  _onflush?: defer.DeferredPromise<void>;
  _options!: BatchOptions;
  // tslint:disable-next-line:no-any
  _requests: any[];
  _subscriber: Subscriber;
  _timer?: NodeJS.Timer;
  abstract add(message: Message, deadline?: number): void;
  // tslint:disable-next-line:no-any
  abstract _sendBatch(batch: any[]): Promise<void>;
  constructor(sub: Subscriber, options = {}) {
    this.pending = 0;
    this._requests = [];
    this._subscriber = sub;

    this.setOptions(options);
  }
  /**
   * Returns a promise that resolves after the next flush occurs.
   *
   * @returns {Promise}
   */
  onFlush(): Promise<void> {
    if (!this._onflush) {
      this._onflush = defer();
    }
    return this._onflush.promise;
  }
  /**
   * Set the batching options.
   *
   * @param {BatchOptions} options Batching options.
   */
  setOptions(options): void {
    const defaults: BatchOptions = {maxMessages: 3000, maxMilliseconds: 100};

    this._options = Object.assign(defaults, options);
  }
  /**
   * This sends a batch of requests.
   *
   * @private
   *
   * @fires AckQueue#error
   * @fires AckQueue#flush
   *
   * @returns {Promise}
   */
  async _flush(): Promise<void> {
    if (this._timer) {
      clearTimeout(this._timer);
      delete this._timer;
    }

    const batch = this._requests;
    const batchSize = batch.length;
    const deferred = this._onflush;

    this._requests = [];
    delete this._onflush;

    try {
      await this._sendBatch(batch);
    } catch (e) {
      this._subscriber.emit('error', e);
    }

    this.pending -= batchSize;

    if (deferred) {
      deferred.resolve();
    }
  }
  /**
   * Increments the number of pending messages and schedules a batch to be
   * sent if need be.
   *
   * @private
   */
  _onadd(): void {
    const {maxMessages, maxMilliseconds} = this._options;

    this.pending += 1;

    if (this._requests.length >= maxMessages!) {
      this._flush();
    } else if (!this._timer) {
      this._timer = setTimeout(() => this._flush(), maxMilliseconds!);
    }
  }
}

/**
 * Queues up Acknowledge requests and sends them out in batches.
 *
 * @private
 * @class
 */
export class AckQueue extends Queue {
  /**
   * Adds a message to the queue.
   *
   * @param {Message} message The message to add.
   */
  add({ackId}: Message): void {
    this._requests.push(ackId);
    this._onadd();
  }
  /**
   * Makes an Acknowledge request.
   *
   * @private
   *
   * @param {string[]} ackIds The ackIds to acknowledge.
   * @return {Promise}
   */
  async _sendBatch(ackIds: string[]): Promise<void> {
    const client = await this._subscriber.getClient();
    const reqOpts = {subscription: this._subscriber.name, ackIds};

    await client.acknowledge(reqOpts);
  }
}

/**
 * Queues up ModifyAckDeadline requests and sends them out in batches.
 *
 * @private
 * @class
 */
export class ModAckQueue extends Queue {
  /**
   * Adds a message to the queue.
   *
   * @param {Message} message The message to add.
   * @param {number} deadline The deadline.
   */
  add({ackId}: Message, deadline: number): void {
    this._requests.push([ackId, deadline]);
    this._onadd();
  }
  /**
   * Makes an ModifyAckDeadline request. Unlike the Acknowledge rpc, each
   * deadline requires its own request, so we have to group all the ackIds by
   * deadline and send multiple requests out.
   *
   * @private
   *
   * @param {Array.<[string, number]>} modAcks Array of ackIds and deadlines.
   * @return {Promise}
   */
  async _sendBatch(modAcks: Array<[string, number]>): Promise<void> {
    const client = await this._subscriber.getClient();
    const subscription = this._subscriber.name;
    const modAckTable = modAcks.reduce((table, [ackId, deadline]) => {
      if (!table[deadline]) {
        table[deadline] = [];
      }

      table[deadline].push(ackId);
      return table;
    }, {});

    const modAckRequests = Object.keys(modAckTable).map(ackDeadlineSeconds => {
      const ackIds = modAckTable[ackDeadlineSeconds];
      const reqOpts = {subscription, ackIds, ackDeadlineSeconds};
      return client.modifyAckDeadline(reqOpts);
    });

    await Promise.all(modAckRequests);
  }
}
