/*!
 * Copyright 2021 Google LLC
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

/**
 * @typedef PublisherFlowControlAction Options for flow control actions
 *
 * @property {number} Ignore Ignore all flow control; don't take any action
 *     based on outstanding requests.
 * @property {number} Pause When flow control limits are exceeded, clients
 *     should call {@link Topic##readyForPublish} and wait for that Promise
 *     to resolve.
 * @property {number} Error When flow control limits would be exceeded, calls
 *     to {@link Topic##publish} will throw an exception.
 */
export enum PublisherFlowControlAction {
  Ignore = 0,
  Pause = 1,
  Error = 2,
}

/**
 * @typedef PublisherFlowControlOptions
 * @property {number} [maxOutstandingMessage] The maximum number of messages to
 *     buffer before publisher flow control kicks in.
 * @property {number} [maxOutstandingBytes] The maximum number of bytes to buffer
 *     before publisher flow control kicks in.
 * @property {number} [action=0] What action should be taken if either
 *     of the maximum values are exceeded. This may be Ignore/0 (do nothing),
 *     Pause/1 (make a Promise available for when publishing can continue), or
 *     Error/2 (throw an Error when maximum values are exceeded. These constants
 *     are also available in the FlowControlActions object.
 */
export interface PublisherFlowControlOptions {
  maxOutstandingMessages?: number;
  maxOutstandingBytes?: number;
  action?: PublisherFlowControlAction;
}

// Represents a publish request. This details how big the request is, and
// how to let it proceed.
interface QueuedPromise {
  promise: Promise<void>;
  resolve: () => void;
  reject: () => void;

  bytes: number;
  messageCount: number;
}

/**
 * Manages flow control handling for max bytes and messages.
 *
 * Do not use this class externally, it may change without warning.
 * @private
 *
 */
export class FlowControl {
  options: PublisherFlowControlOptions = {};
  private bytes: number;
  private messages: number;
  private requests: QueuedPromise[];

  constructor(options: PublisherFlowControlOptions) {
    this.setOptions(options);
    this.bytes = this.messages = 0;
    this.requests = [];
  }

  /**
   * Update our options after the fact.
   *
   * Do not use externally, it may change without warning.
   * @private
   */
  setOptions(options: PublisherFlowControlOptions) {
    this.options = options;

    if (
      this.options.maxOutstandingBytes === 0 ||
      this.options.maxOutstandingMessages === 0
    ) {
      // Undefined is okay, but if either is zero, no publishes ever happen.
      throw new Error(
        'When using publisher flow control, maxOutstandingBytes and maxOutstandingMessages must not be zero'
      );
    }
  }

  /**
   * Attempts to queue the specified number of bytes and messages. If
   * there are too many things in the publisher flow control queue
   * already, we will defer and come back to it.
   *
   * Do not use externally, it may change without warning.
   * @private
   */
  async willSend(bytes: number, messages: number): Promise<void> {
    // Double check our settings.
    if (this.options.action !== PublisherFlowControlAction.Pause) {
      return;
    }

    // Add this to our queue size.
    this.bytes += bytes;
    this.messages += messages;

    // If this request won't fit, we have to put it in the queue.
    if (this.exceeded()) {
      const promise = defer<void>();
      this.requests.push({
        promise: promise.promise,
        resolve: promise.resolve,
        reject: promise.reject,
        bytes,
        messageCount: messages,
      });

      // This will pass through when someone else's this.remove() completes.
      await promise.promise;
    }
  }

  /**
   * Removes the specified number of bytes and messages from our queued
   * counts, after a deferred request was released. If there is enough
   * space.
   *
   * Do not use externally, it may change without warning.
   * @private
   */
  sent(bytes: number, messages: number) {
    this.bytes -= bytes;
    this.messages -= messages;

    // This shouldn't happen, but just be sure.
    if (this.bytes < 0) this.bytes = 0;
    if (this.messages < 0) this.messages = 0;

    // Let things waiting on willSend() have a go, if there's space.
    if (this.requests.length > 0 && !this.exceeded()) {
      const next = this.requests.shift()!;
      next.resolve();
    }
  }

  // Just uses wouldExceed() to see if we've already exceeded the limits.
  private exceeded(): boolean {
    return this.wouldExceed(0, 0);
  }

  /**
   * Returns true if adding the specified number of bytes or messages
   * would exceed limits imposed by configuration.
   *
   * Do not use externally, it may change without warning.
   * @private
   */
  wouldExceed(bytes: number, messages: number): boolean {
    if (this.options.action === PublisherFlowControlAction.Ignore) {
      return false;
    }

    const totalBytes = this.bytes + bytes;
    const totalMessages = this.messages + messages;

    if (
      this.options.maxOutstandingBytes !== undefined &&
      totalBytes > this.options.maxOutstandingBytes
    ) {
      return true;
    }

    if (
      this.options.maxOutstandingMessages !== undefined &&
      totalMessages > this.options.maxOutstandingMessages
    ) {
      return true;
    }

    return false;
  }
}
