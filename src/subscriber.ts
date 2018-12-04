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

import {replaceProjectIdToken} from '@google-cloud/projectify';
import {promisify} from '@google-cloud/promisify';
import {EventEmitter} from 'events';
import {ClientStub} from 'google-gax';

import {Histogram} from './histogram';
import {FlowControlOptions, LeaseManager} from './lease-manager';
import {AckQueue, BatchOptions, ModAckQueue} from './message-queues';
import {Message, MessageStream, MessageStreamOptions} from './message-stream';
import {Subscription} from './subscription';


/**
 * @typedef {object} SubscriberOptions
 * @property {number} [ackDeadline=10] Acknowledge deadline in seconds. If left
 *     unset the initial value will be 10 seconds, but it will evolve into the
 *     99th percentile of acknowledge times.
 * @property {BatchingOptions} [batching] Message batching options.
 * @property {FlowControlOptions} [flowControl] Flow control options.
 * @property {MessageStreamOptions} [streamingOptions] Message stream options.
 */
export interface SubscriberOptions {
  ackDeadline?: number;
  batching?: BatchOptions;
  flowControl?: FlowControlOptions;
  streamingOptions?: MessageStreamOptions;
}

/**
 * Subscriber class is used to manage all message related functionality.
 *
 * @private
 * @class
 *
 * @param {Subscription} subscription The corresponding subscription.
 * @param {SubscriberOptions} options The subscriber options.
 */
export class Subscriber extends EventEmitter {
  ackDeadline: number;
  isOpen: boolean;
  _acks!: AckQueue;
  _client!: ClientStub;
  _histogram: Histogram;
  _inventory!: LeaseManager;
  _isUserSetDeadline: boolean;
  _latencies: Histogram;
  _modAcks!: ModAckQueue;
  _name!: string;
  _options!: SubscriberOptions;
  _stream!: MessageStream;
  _subscription: Subscription;
  constructor(subscription: Subscription, options = {}) {
    super();

    this.ackDeadline = 10;
    this.isOpen = false;
    this._isUserSetDeadline = false;
    this._histogram = new Histogram({min: 10, max: 600});
    this._latencies = new Histogram();
    this._subscription = subscription;

    this.setOptions(options);
  }
  /**
   * Get the 99th percentile latency.
   *
   * @type {number}
   */
  get latency() {
    return this._latencies.percentile(99);
  }
  /**
   * Get the name of the Subscription.
   *
   * @type {string}
   */
  get name(): string {
    if (!this._name) {
      const {name, projectId} = this._subscription;
      this._name = replaceProjectIdToken(name, projectId);
    }

    return this._name;
  }
  /**
   * Acknowledges the provided message.
   *
   * @param {Message} message The message to acknowledge.
   * @returns {Promise}
   */
  async ack(message: Message): Promise<void> {
    const startTime = Date.now();

    if (!this._isUserSetDeadline) {
      const ackTimeSeconds = (startTime - message.received) / 1000;
      this._histogram.add(ackTimeSeconds);
      this.ackDeadline = this._histogram.percentile(99);
    }

    this._acks.add(message);
    await this._acks.onFlush();
    this._inventory.remove(message);

    const latency = (Date.now() - startTime) / 1000;
    this._latencies.add(latency);
  }
  /*!
   * @TODO look at grpc to figure out if we need to close this._client
   */
  /**
   * Closes the subscriber. The returned promise will resolve once any pending
   * acks/modAcks are flushed.
   *
   * @returns {Promise}
   */
  async close(): Promise<void> {
    if (!this.isOpen) {
      return;
    }

    this.isOpen = false;
    this._stream.destroy();
    this._inventory.clear();

    const flushes: Array<Promise<void>> = [];

    if (this._acks.pending) {
      flushes.push(this._acks.onFlush());
    }

    if (this._modAcks.pending) {
      flushes.push(this._modAcks.onFlush());
    }

    await Promise.all(flushes);

    const client = await this.getClient();
    client.close();
  }
  /**
   * Gets the subscriber client instance.
   *
   * @returns {Promise<object>}
   */
  async getClient(): Promise<ClientStub> {
    if (!this._client) {
      const pubsub = this._subscription.pubsub;
      const opts = {client: 'SubscriberClient'};
      const [client] = await promisify(pubsub.getClient_).call(pubsub, opts);
      this._client = client;
    }

    return this._client;
  }
  /**
   * Modifies the acknowledge deadline for the provided message.
   *
   * @param {Message} message The message to modify.
   * @param {number} deadline The deadline.
   * @returns {Promise}
   */
  async modAck(message: Message, deadline: number): Promise<void> {
    const startTime = Date.now();

    this._modAcks.add(message, deadline);
    await this._modAcks.onFlush();

    const latency = (Date.now() - startTime) / 1000;
    this._latencies.add(latency);
  }
  /**
   * Modfies the acknowledge deadline for the provided message and then removes
   * said message from our inventory, allowing it to be re-delivered.
   *
   * @param {Message} message The message.
   * @param {number} [delay=0] Delay to wait before re-delivery.
   * @return {Promise}
   */
  async nack(message: Message, delay = 0): Promise<void> {
    await this.modAck(message, delay);
    this._inventory.remove(message);
  }
  /**
   * Starts pulling messages.
   */
  open(): void {
    const {batching, flowControl, streamingOptions} = this._options;

    this._acks = new AckQueue(this, batching);
    this._modAcks = new ModAckQueue(this, batching);
    this._inventory = new LeaseManager(this, flowControl);
    this._stream = new MessageStream(this, streamingOptions);

    this._stream.on('error', err => this.emit('error', err))
        .on('data', (message: Message) => this._onmessage(message));

    this.isOpen = true;
  }
  /**
   * Sets subscriber options.
   *
   * @param {SubscriberOptions} options The options.
   */
  setOptions(options: SubscriberOptions): void {
    this._options = options;

    if (options.ackDeadline) {
      this.ackDeadline = options.ackDeadline;
      this._isUserSetDeadline = true;
    }
  }
  /**
   * Callback to be invoked when a new message is available.
   *
   * New messages will be added to the subscribers inventory, which in turn will
   * automatically extend said messages ack deadline until either:
   *   a. the user acks/nacks said message
   *   b. the maxExtension option is hit
   *
   * If the message puts us at/over capacity, then we'll pause our message
   * stream until we've freed up some inventory space.
   *
   * New messages must immediately issue a ModifyAckDeadline request
   * (aka receipt) to confirm with the backend that we did infact receive the
   * message and its ok to start ticking down to the deadline.
   *
   * @private
   */
  _onmessage(message: Message): void {
    this._inventory.add(message);

    if (this._inventory.isFull()) {
      this._stream.pause();
      this._inventory.onFree().then(() => this._stream.resume());
    }

    // pubsub requires a "receipt" to confirm message was received
    this.modAck(message, this.ackDeadline);
    this.emit('message', message);
  }
}
