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

import {EventEmitter} from 'events';
import {AckError, Message, Subscriber} from './subscriber';
import {defaultOptions} from './default-options';

export interface FlowControlOptions {
  allowExcessMessages?: boolean;
  maxBytes?: number;
  maxMessages?: number;
  maxExtensionMinutes?: number;

  /** @deprecated Use maxExtensionMinutes. */
  maxExtension?: number;
}

/**
 * @typedef {object} FlowControlOptions
 * @property {boolean} [allowExcessMessages=true] PubSub delivers messages in
 *     batches with no way to configure the batch size. Sometimes this can be
 *     overwhelming if you only want to process a few messages at a time.
 *     Setting this option to false will make the client manage any excess
 *     messages until you're ready for them. This will prevent them from being
 *     redelivered and make the maxMessages option behave more predictably.
 * @property {number} [maxBytes=104857600] The desired amount of memory to
 *     allow message data to consume. (Default: 100MB) It's possible that this
 *     value will be exceeded, since messages are received in batches.
 * @property {number} [maxExtensionMinutes=60] The maximum duration (in minutes)
 *     to extend the message deadline before redelivering.
 * @property {number} [maxMessages=1000] The desired number of messages to allow
 *     in memory before pausing the message stream. Unless allowExcessMessages
 *     is set to false, it is very likely that this value will be exceeded since
 *     any given message batch could contain a greater number of messages than
 *     the desired amount of messages.
 */
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
export class LeaseManager extends EventEmitter {
  bytes: number;
  private _isLeasing: boolean;
  private _messages: Set<Message>;
  private _options!: FlowControlOptions;
  private _pending: Message[];
  private _subscriber: Subscriber;
  private _timer?: NodeJS.Timeout;
  constructor(sub: Subscriber, options = {}) {
    super();

    this.bytes = 0;
    this._isLeasing = false;
    this._messages = new Set();
    this._pending = [];
    this._subscriber = sub;

    this.setOptions(options);
  }
  /**
   * @type {number}
   * @private
   */
  get pending(): number {
    return this._pending.length;
  }
  /**
   * @type {number}
   * @private
   */
  get size(): number {
    return this._messages.size;
  }
  /**
   * Adds a message to the inventory, kicking off the deadline extender if it
   * isn't already running.
   *
   * @param {Message} message The message.
   * @private
   */
  add(message: Message): void {
    const {allowExcessMessages} = this._options;
    const wasFull = this.isFull();

    this._messages.add(message);
    this.bytes += message.length;

    if (allowExcessMessages! || !wasFull) {
      this._dispense(message);
    } else {
      this._pending.push(message);
    }

    if (!this._isLeasing) {
      this._isLeasing = true;
      this._scheduleExtension();
    }

    if (!wasFull && this.isFull()) {
      this.emit('full');
    }
  }
  /**
   * Removes ALL messages from inventory.
   * @private
   */
  clear(): void {
    const wasFull = this.isFull();

    this._pending = [];
    this._messages.clear();
    this.bytes = 0;

    if (wasFull) {
      process.nextTick(() => this.emit('free'));
    }

    this._cancelExtension();
  }
  /**
   * Indicates if we're at or over capacity.
   *
   * @returns {boolean}
   * @private
   */
  isFull(): boolean {
    const {maxBytes, maxMessages} = this._options;
    return this.size >= maxMessages! || this.bytes >= maxBytes!;
  }
  /**
   * Removes a message from the inventory. Stopping the deadline extender if no
   * messages are left over.
   *
   * @fires LeaseManager#free
   *
   * @param {Message} message The message to remove.
   * @private
   */
  remove(message: Message): void {
    if (!this._messages.has(message)) {
      return;
    }

    const wasFull = this.isFull();

    this._messages.delete(message);
    this.bytes -= message.length;

    if (wasFull && !this.isFull()) {
      process.nextTick(() => this.emit('free'));
    } else if (this._pending.includes(message)) {
      const index = this._pending.indexOf(message);
      this._pending.splice(index, 1);
    } else if (this.pending > 0) {
      this._dispense(this._pending.shift()!);
    }

    if (this.size === 0 && this._isLeasing) {
      this._cancelExtension();
    }
  }
  /**
   * Sets options for the LeaseManager.
   *
   * @param {FlowControlOptions} [options] The options.
   *
   * @throws {RangeError} If both maxExtension and maxExtensionMinutes are set.
   *
   * @private
   */
  setOptions(options: FlowControlOptions): void {
    // Convert the old deprecated maxExtension to avoid breaking clients,
    // but allow only one.
    if (
      options.maxExtension !== undefined &&
      options.maxExtensionMinutes !== undefined
    ) {
      throw new RangeError(
        'Only one of "maxExtension" or "maxExtensionMinutes" may be set for subscriber lease management options'
      );
    }
    if (
      options.maxExtension !== undefined &&
      options.maxExtensionMinutes === undefined
    ) {
      options.maxExtensionMinutes = options.maxExtension / 60;
      delete options.maxExtension;
    }

    const defaults: FlowControlOptions = {
      allowExcessMessages: true,
      maxBytes: defaultOptions.subscription.maxOutstandingBytes,
      maxExtensionMinutes: defaultOptions.subscription.maxExtensionMinutes,
      maxMessages: defaultOptions.subscription.maxOutstandingMessages,
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
    if (this._subscriber.isOpen) {
      process.nextTick(() => this._subscriber.emit('message', message));
    }
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
      // Lifespan here is in minutes.
      const lifespan = (Date.now() - message.received) / (60 * 1000);

      if (lifespan < this._options.maxExtensionMinutes!) {
        if (this._subscriber.isExactlyOnceDelivery) {
          message.modAckWithResponse(deadline).catch(e => {
            // In the case of a permanent failure (temporary failures are retried),
            // we need to stop trying to lease-manage the message.
            message.ackFailed(e as AckError);
            this.remove(message);
          });
        } else {
          message.modAck(deadline);
        }
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
  private _getNextExtensionTimeoutMs(): number {
    const jitter = Math.random();
    const deadline = this._subscriber.ackDeadline * 1000;
    const latency = this._subscriber.modAckLatency;

    return (deadline * 0.9 - latency) * jitter;
  }
  /**
   * Schedules an deadline extension for all messages.
   *
   * @private
   */
  private _scheduleExtension(): void {
    const timeout = this._getNextExtensionTimeoutMs();
    this._timer = setTimeout(() => this._extendDeadlines(), timeout);
  }
}
