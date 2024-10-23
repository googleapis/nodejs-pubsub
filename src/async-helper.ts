// Copyright 2024 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {Message} from './subscriber';

/**
 * Represents an async function that can process a message and return
 * a Promise for the function's completion.
 */
export interface UserHandler {
  (message: Message): Promise<void>;
}

/**
 * A handler for sub.on('message', x) that can be passed to .on() to do
 * the async processing in this class.
 */
export interface StreamHandler {
  (message: Message): void;
}

/**
 * When executing an async function, the Node runtime is really getting
 * a Promise; these are guaranteed not to complete until another cycle of
 * the event loop (at least the micro-loop). This can be problematic for
 * ordered queue receipts, since the library doesn't take special pains to
 * deliver the messages one at a time to async functions (they all push
 * through in one go, which just results in a bunch of outstanding Promises).
 *
 * This helper acts as a funnel for the subscriber so that it can do the
 * normal "push all the messages" as before, but each message will be
 * allowed to process fully before the next message is delivered to user code.
 *
 * This should not be used for non-async handlers. It's not being built
 * into the library itself, because it's difficult for us to second-guess
 * what users might want in a given situation. This lets you decide explicitly.
 * (Also, event handlers for on() are not something we have direct access
 * to, so guessing whether it's a Promise and waiting on it would be difficult.)
 *
 * @example
 * ```
 * const {PubSub, AsyncHelper} = require('@google-cloud/pubsub');
 * const pubsub = new PubSub();
 *
 * const sub = pubsub.subscription('my-sub');
 * const helper = new AsyncHelper(async (m) => console.log(m));
 * sub.on('message', helper.handler);
 * ```
 */
export class AsyncHelper {
  // The queue of messages we need to process in order.
  queue: Message[] = [];

  // The "tail" Promise, i.e. the previous processing step (or resolve()).
  tailPromise: Promise<void> = Promise.resolve();

  // The user's handler that will be called to take a message and get back a Promise.
  userHandler: UserHandler;

  /**
   * @param userHandler The async function we'll call for each message.
   */
  constructor(userHandler: UserHandler) {
    this.userHandler = userHandler;
  }

  /**
   * A handler function that you can pass to .on('message').
   */
  get handler(): StreamHandler {
    return this.streamHandler.bind(this);
  }

  // Pushes new messages on the queue and starts (or chains) a
  // processing step.
  private streamHandler(message: Message): void {
    this.queue.push(message);

    // This should be either Promise.resolve() (instant callback)
    // or the previous work item the user's function returned.
    this.tailPromise.then(() => {
      const message = this.queue.shift();
      if (!message) {
        // No message -> go back to resolve() to signal ready.
        this.tailPromise = Promise.resolve();
      } else {
        // Message -> chain to the previous tail and replace it.
        this.tailPromise = this.userHandler(message);
      }
    });
  }
}
