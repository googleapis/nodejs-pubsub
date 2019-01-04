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

import {Message, Subscriber} from './subscriber';

/**
 * @typedef {object} FlowControlOptions
 * @property {boolean} [allowExcessMessages=true] PubSub delivers messages in
 *     batches with no way to configure the batch size. Sometimes this can be
 *     overwhelming if you only want to process a few messages at a time.
 *     Setting this option to false will make the client manage any excess
 *     messages until you're ready for them. This will prevent them from being
 *     redelivered and make the maxMessages option behave more predictably.
 * @property {number} [maxBytes] The desired amount of memory to allow message
 *     data to consume, defaults to 20% of available memory. Its possible that
 *     this value will be exceeded since messages are received in batches.
 * @property {number} [maxExtension=Infinity] The maximum duration (in seconds)
 *      to extend the message deadline before redelivering.
 * @property {number} [maxMessages=100] The desired number of messages to allow
 *     in memory before pausing the message stream. Unless allowExcessMessages
 *     is set to false, it is very likely that this value will be exceeded since
 *     any given message batch could contain a greater number of messages than
 *     the desired amount of messages.
 */
export interface FlowControlOptions {
  allowExcessMessages?: boolean;
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
  private _isLeasing: boolean;
  private _messages: Set<Message>;
  private _onfree?: defer.DeferredPromise<void>;
  private _options!: FlowControlOptions;
  private _pending: Message[];
  private _subscriber: Subscriber;
  private _timer?: NodeJS.Timer;
  constructor(sub: Subscriber, options = {}) {
    this.bytes = 0;
    this._isLeasing = false;
    this._messages = new Set();
    this._pending = [];
    this._subscriber = sub;

    this.setOptions(options);
  }
  /**
   * @type {number}
   */
  get pending(): number {
    return this._pending.length;
  }
  /**
   * @type {number}
   */
  get size(): number {
    return this._messages.size;
  }
  /**
   * Adds a message to the inventory, kicking off the deadline extender if it
   * isn't already running.
   *
   * @param {Message} message The message.
   */
  add(message: Message): void {
    const {allowExcessMessages} = this._options;

    if (allowExcessMessages! || !this.isFull()) {
      this._dispense(message);
    } else {
      this._pending.push(message);
    }

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
    this._pending = [];
    this._messages.clear();
    this.bytes = 0;

    if (this._onfree) {
      this._onfree.resolve();
      delete this._onfree;
    }

    this._cancelExtension();
  }
  /**
   * Indicates if we're at or over capacity.
   *
   * @returns {boolean}
   */
  isFull(): boolean {
    const {maxBytes, maxMessages} = this._options;
    return this.size >= maxMessages! || this.bytes >= maxBytes!;
  }
  /**
   * Returns a promise that will resolve once space has been freed up for new
   * messages to be introduced.
   *
   * @returns {Promise}
   */
  onFree(): Promise<void> {
    if (!this._onfree) {
      this._onfree = defer();
    }
    return this._onfree.promise;
  }
  /**
   * Removes a message from the inventory. Stopping the deadline extender if no
   * messages are left over.
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
    } else if (this._pending.includes(message)) {
      const index = this._pending.indexOf(message);
      this._pending.splice(index, 1);
    } else if (this.pending > 0) {
      this._dispense(this._pending.shift()!);
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
  setOptions(options: FlowControlOptions): void {
    const defaults: FlowControlOptions = {
      allowExcessMessages: true,
      maxBytes: freemem() * 0.2,
      maxExtension: Infinity,
      maxMessages: 100
    };

    this._options = Object.assign(defaults, options);
  }
  /**
   * Stops extending message deadlines.
   *
   * @private
   */
  private _cancelExtension(): void {
    this._isLeasing = false;

    if (this._timer) {
      clearTimeout(this._timer);
      delete this._timer;
    }
  }
  /**
   * Emits the message. Emitting messages is very slow, so to avoid it acting
   * as a bottleneck, we're wrapping it in nextTick.
   *
   * @private
   *
   * @fires Subscriber#message
   *
   * @param {Message} message The message to emit.
   */
  private _dispense(message: Message): void {
    process.nextTick(() => this._subscriber.emit('message', message));
  }
  /**
   * Loops through inventory and extends the deadlines for any messages that
   * have not hit the max extension option.
   *
   * @private
   */
  private _extendDeadlines(): void {
    const deadline = this._subscriber.ackDeadline;

    for (const message of this._messages) {
      const lifespan = (Date.now() - message.received) / 1000;

      if (lifespan < this._options.maxExtension!) {
        message.modAck(deadline);
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
   * before they would be redelivered.
   *
   * @private
   *
   * @returns {number}
   */
  private _getNextExtensionTimeout(): number {
    const jitter = Math.random();
    const deadline = this._subscriber.ackDeadline * 1000;
    const latency = this._subscriber.latency * 1000;

    return (deadline * 0.9 - latency) * jitter;
  }
  /**
   * Schedules an deadline extension for all messages.
   *
   * @private
   */
  private _scheduleExtension(): void {
    const timeout = this._getNextExtensionTimeout();
    this._timer = setTimeout(() => this._extendDeadlines(), timeout);
  }
}
