/*!
 * Copyright 2019 Google Inc. All Rights Reserved.
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

import {StatusObject, status} from 'grpc';

export interface PullRetryOptions {
  maxTimeout: number;
}

/*!
 * retryable status codes
 */
const RETRY_CODES: status[] = [
  status.OK,
  status.CANCELLED,
  status.UNKNOWN,
  status.DEADLINE_EXCEEDED,
  status.RESOURCE_EXHAUSTED,
  status.ABORTED,
  status.INTERNAL,
  status.UNAVAILABLE,
  status.DATA_LOSS,
];

/**
 * Used to track pull requests and determine if additional requests should be
 * made, etc.
 *
 * @class
 * @private
 */
export class PullRetry {
  private failures = 0;
  private lastSuccess = Date.now();
  private maxTimeout: number;
  constructor(options = {} as PullRetryOptions) {
    this.maxTimeout = options.maxTimeout;
  }
  /**
   * Generates a timeout that can be used for applying a backoff based on the
   * current number of failed requests.
   *
   * @private
   * @returns {number}
   */
  createTimeout(): number {
    if (this.failures === 0) {
      return 0;
    }
    return Math.pow(2, this.failures) * 1000 + Math.floor(Math.random() * 1000);
  }
  /**
   * Determines if a request status should be retried.
   *
   * Deadlines behave kind of unexpectedly on streams, rather than using it as
   * an indicator of when to give up trying to connect, it actually dictates
   * how long the stream should stay open. Because of this, it is virtually
   * impossible to determine whether or not a deadline error is the result of
   * the server closing the stream or if we timed out waiting for a connection.
   * Typically we might use something like grpc's waitForReady, but there is an
   * open issue that prevents this from working with channel pooling.
   *
   * @private
   * @param {object} status The request status.
   * @returns {boolean}
   */
  retry(s: StatusObject): boolean {
    if (s.code === status.OK || s.code === status.DEADLINE_EXCEEDED) {
      this.lastSuccess = Date.now();
      this.failures = 0;
    } else {
      this.failures += 1;
    }

    if (!RETRY_CODES.includes(s.code)) {
      return false;
    }

    return Date.now() - this.lastSuccess < this.maxTimeout;
  }
}
