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

import {freemem} from 'os';
import * as defer from 'p-defer';

import {Message} from './message-stream';
import {Subscriber} from './subscriber';

/**
 * @typedef {object} FlowControlOptions
 * @property {number} [maxBytes] The maximum amount of memory to allow message
 *     data to consume. Defaults to 20% of available memory.
 * @property {number} [maxExtension=Infinity] The maximum duration to extend
 *     the message deadline before re-delivering.
 * @property {number} [maxMessages=100] The maximum number of messages to allow
 *     in memory before pausing the message stream.
 */
export interface FlowControlOptions {
  maxBytes?: number;
  maxExtension?: number;
  maxMessages?: number;
}

/**
 * Manages a Subscribers inventory while auto-magically extending the message
 * deadlines.
 *
 * @private
 * @class
 *
 * @param {Subscriber} sub The subscriber to manage leases for.
 * @param {FlowControlOptions} options Flow control options.
 */
export class LeaseManager {
  bytes: number;
  _isLeasing: boolean;
  _messages: Set<Message>;
  _onfree?: defer.DeferredPromise<void>;
  _options!: FlowControlOptions;
  _subscriber: Subscriber;
  _timer?: NodeJS.Timer;
  constructor(sub: Subscriber, options = {}) {
    this.bytes = 0;
    this._isLeasing = false;
    this._messages = new Set();
    this._subscriber = sub;

    this.setOptions(options);
  }
  /**
   * @type {number}
   */
  get size(): number {
    return this._messages.size;
  }
  /**
   * Adds a message to the inventory, kicking off the auto-extender if need be.
   *
   * @param {Message} message The message.
   */
  add(message: Message): void {
    this._messages.add(message);
    this.bytes += message.length;

    if (!this._isLeasing) {
      this._isLeasing = true;
      this._scheduleExtension();
    }
  }
  /**
   * Removes ALL messages from inventory.
   */
  clear(): void {
    this._cancelExtension();
    this._messages.clear();
    this.bytes = 0;
  }
  /**
   * Indicates if we're at/over capacity or not.
   *
   * @returns {boolean}
   */
  isFull(): boolean {
    const {maxBytes, maxMessages} = this._options;
    return this.size >= maxMessages! || this.bytes >= maxBytes!;
  }
  /**
   *
   */
  onFree(): Promise<void> {
    if (!this._onfree) {
      this._onfree = defer();
    }
    return this._onfree.promise;
  }
  /**
   * Removes a message from the inventory. Stopping the auto-extender if no
   * messages remain.
   *
   * @fires LeaseManager#free
   *
   * @param {Message} message The message to remove.
   */
  remove(message: Message): void {
    if (!this._messages.has(message)) {
      return;
    }

    this._messages.delete(message);
    this.bytes -= message.length;

    if (this._onfree && !this.isFull()) {
      this._onfree.resolve();
      delete this._onfree;
    }

    if (!this.size && this._isLeasing) {
      this._cancelExtension();
    }
  }
  /**
   * Sets options for the LeaseManager.
   *
   * @param {FlowControlOptions} [options] The options.
   */
  setOptions(options): void {
    const defaults: FlowControlOptions = {
      maxBytes: freemem() * 0.2,
      maxExtension: Infinity,
      maxMessages: 100
    };

    this._options = Object.assign(defaults, options);
  }
  /**
   * Stops extending messages.
   *
   * @private
   */
  _cancelExtension(): void {
    this._isLeasing = false;

    if (this._timer) {
      clearTimeout(this._timer);
      delete this._timer;
    }
  }
  /**
   * Loops through inventory and extends the deadlines for any messages that
   * have not hit the max extension option.
   *
   * @private
   */
  _extendDeadlines(): void {
    const deadline = this._subscriber.ackDeadline;

    for (const message of this._messages) {
      const lifespan = Date.now() - message.received;

      if (lifespan < this._options.maxExtension!) {
        this._subscriber.modAck(message, deadline);
      } else {
        this.remove(message);
      }
    }

    if (this._isLeasing) {
      this._scheduleExtension();
    }
  }
  /**
   * Creates a timeout(ms) that should allow us to extend any message deadlines
   * without them being re-delivered.
   *
   * @private
   *
   * @returns {number}
   */
  _getNextExtensionTimeout(): number {
    const jitter = Math.random();
    const deadline = this._subscriber.ackDeadline * 1000;
    const latency = this._subscriber.latency * 1000;

    return deadline * 0.9 * jitter - latency;
  }
  /**
   * Schedules an extension for all messages within the inventory.
   *
   * @private
   */
  _scheduleExtension(): void {
    const timeout = this._getNextExtensionTimeout();
    this._timer = setTimeout(() => this._extendDeadlines(), timeout);
  }
}
