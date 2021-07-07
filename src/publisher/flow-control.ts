/*!
 * Copyright 2021 Google Inc. All Rights Reserved.
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
 * TypeScript enum for flow control actions
 */
export enum FlowControlAction {
  Ignore = 0,
  Pause = 1,
  Error = 2,
}

/**
 * @typedef FlowControlActions Exported for JavaScript usage.
 *
 * @property {number} Ignore Ignore all flow control; don't take any action
 *     based on outstanding requests.
 * @property {number} Pause When flow control limits are exceeded, clients
 *     should call {@link Topic##readyForPublish} and wait for that Promise
 *     to resolve.
 * @property {number} Error When flow control limits would be exceeded, calls
 *     to {@link Topic##publish} will throw an exception.
 */
export const FlowControlActions = {
  Ignore: FlowControlAction.Ignore,
  Pause: FlowControlAction.Pause,
  Error: FlowControlAction.Error,
};

/**
 * @typedef FlowControlOptions
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
export interface FlowControlOptions {
  maxOutstandingMessages?: number;
  maxOutstandingBytes?: number;
  action?: FlowControlAction;
}

/**
 * Manages flow control handling for max bytes and messages.
 *
 * @private This is for Publisher to use.
 */
export class FlowControl {
  options: FlowControlOptions;
  bytes: number;
  messages: number;
  promises: defer.DeferredPromise<void>[];

  constructor(options: FlowControlOptions) {
    this.options = options;
    this.bytes = this.messages = 0;
    this.promises = [];
  }

  setOptions(options: FlowControlOptions) {
    this.options = options;
  }

  /**
   * Adds the specified number of bytes and messages to our queued
   * counts. These should be things actually queued to send.
   * 
   * @private For internal use.
   */
  add(bytes: number, messages: number) {
    this.bytes += bytes;
    this.messages += messages;
  }

  /**
   * Removes the specified number of bytes and messages from our queued
   * counts. These should be things that were actually dequeued for sending.
   *
   * @private For internal use.
   */
  remove(bytes: number, messages: number) {
    this.bytes -= bytes;
    this.messages -= messages;

    // This shouldn't happen, but just be sure.
    if (this.bytes < 0) this.bytes = 0;
    if (this.messages < 0) this.messages = 0;

    // Let things waiting on publishReady have a go.
    this.processPromises();
  }

  /**
   * Returns true if adding the specified number of bytes or messages
   * would exceed limits imposed by configuration.
   *
   * @private For internal use.
   */
  wouldExceed(bytes: number, messages: number): boolean {
    const totalBytes = this.bytes + bytes;
    const totalMessages = this.messages + messages;

    if (this.options.action === FlowControlAction.Ignore) {
      return false;
    }

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

  /*!
   * Process any promises we might have queued up for clients
   * waiting to publish. We'll re-check the limits after each resolve
   * to make sure the limits haven't been exceeded by the callback.
   */
  private processPromises(): void {
    while (!this.needsWait() && this.promises.length > 0) {
      const nextPromise = this.promises.shift();
      nextPromise?.resolve();
    }
  }

  /*!
   * Returns true if any further additions would exceed the limits. Always
   * returns false if we're not in Pause mode.
   */
  private needsWait(): boolean {
    if (this.options.action !== FlowControlAction.Pause) {
      return false;
    }

    return this.wouldExceed(0, 0);
  }

  /**
   * Returns a Promise that will resolve when the client is clear to publish
   * some more messages. This is only meaningful in Pause mode, so any other
   * mode will result in an immediately-resolving Promise.
   *
   * @private For internal use.
   */
  wait(): Promise<void> {
    const needsWait = this.needsWait();
    if (needsWait) {
      const promise = defer<void>();
      this.promises.push(promise);
      return promise.promise;
    } else {
      return Promise.resolve();
    }
  }
}
