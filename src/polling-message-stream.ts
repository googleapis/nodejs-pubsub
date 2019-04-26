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

import {CancellablePromise} from 'google-gax';
import {Readable} from 'stream';

import {google} from '../proto/pubsub';

import {RETRY_CODES} from './message-stream';
import {Subscriber} from './subscriber';

type PullRequest = google.pubsub.v1.IPullRequest;

/**
 * @typedef {object} MessagePollingOptions
 * @property {number} [batchSize=100] Desired number of messages per batch.
 *     Defaults to {@link FlowControlOptions} `maxMessages` value (100).
 * @property {number} [highWaterMark=0] Configures the Buffer level. See
 *     {@link https://nodejs.org/en/docs/guides/backpressuring-in-streams/} for
 *     more details.
 */
export interface MessagePollingOptions {
  batchSize?: number;
  highWaterMark?: number;
}

/**
 * Streaming class used to manually pull messages. This should only be preferred
 * to the {@link MessageStream} when high throughput is not needed and the
 * client is expected to process messages slowly.
 *
 * @private
 * @class
 *
 * @param {Subscriber} sub The parent subscriber.
 * @param {MessagePollingOptions} [options] The message stream options.
 */
export class PollingMessageStream extends Readable {
  destroyed: boolean;
  private _activeRequest?: CancellablePromise;
  private _options: MessagePollingOptions;
  private _subscriber: Subscriber;
  private _reading: boolean;
  constructor(subscriber: Subscriber, options: MessagePollingOptions) {
    const {highWaterMark = 0} = options;
    super({highWaterMark, objectMode: true});

    this.destroyed = false;
    this._options = options;
    this._subscriber = subscriber;
    this._reading = false;
  }
  /**
   * Cancels any active requests once the stream is destroyed.
   *
   * @private
   */
  _destroy(err: null|Error, callback: (err?: null|Error) => void) {
    this.destroyed = true;

    if (this._activeRequest) {
      this._activeRequest.cancel();
    }

    super._destroy(err, callback);
  }
  /**
   * Pulls messages and pushes them into the stream.
   *
   * @private
   */
  async _read() {
    if (this._reading) {
      return;
    }

    this._reading = true;

    const client = await this._subscriber.getClient();
    const request: PullRequest = {
      subscription: this._subscriber.name,
      maxMessages: this._options.batchSize,
    };

    let more = true;

    while (more) {
      if (this.destroyed) {
        break;
      }

      try {
        this._activeRequest = client.pull(request);
        const [resp] = await this._activeRequest;
        more = this.push(resp);
      } catch (e) {
        if (!RETRY_CODES.includes(e.code)) {
          this.destroy(e);
        }
      }
    }

    this._reading = false;
  }
}
