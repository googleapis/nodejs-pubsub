// Copyright 2022 Google LLC
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

import Heap from 'heap-js';
import {Duration} from './temporal';

export interface RetriedItem<T> {
  retryInfo?: RetryInfo<T>;
}

export interface RetryInfo<T> {
  firstRetry: number;
  nextRetry: number;
  multiplier: number;
  callback: RetryCallback<T>;
}

function comparator<T>(a: RetriedItem<T>, b: RetriedItem<T>) {
  return a.retryInfo!.nextRetry - b.retryInfo!.nextRetry;
}

export interface RetryCallback<T> {
  // Return true to continue retrying.
  (item: T, totalTime: Duration): void;
}

/**
 * Provides a helper that will manage your retries using the "truncated
 * exponential backoff" strategy.
 *
 * Most of the pieces of this library are doing retries via gax, but for
 * exactly-once we have some things where gRPC failures won't take care
 * of it.
 *
 * @private
 */
export class ExponentialRetry<T> {
  private _items = new Heap<RetriedItem<T>>(comparator<T>);
  private _backoffMs: number;
  private _maxBackoffMs: number;
  private _timer?: NodeJS.Timeout;

  constructor(backoff: Duration, maxBackoff: Duration) {
    this._backoffMs = backoff.totalOf('millisecond');
    this._maxBackoffMs = maxBackoff.totalOf('millisecond');
  }

  close(): RetriedItem<T>[] {
    if (this._timer) {
      clearTimeout(this._timer);
    }

    const leftovers = this._items.toArray();
    this._items.clear();
    return leftovers;
  }

  retryLater(item: T, callback: RetryCallback<T>) {
    const retried = item as RetriedItem<T>;
    const retryInfo = retried.retryInfo;

    if (!retryInfo) {
      // This item's first time through.
      retried.retryInfo = {
        firstRetry: Date.now(),
        nextRetry: Date.now() + this.randomizeDelta(this._backoffMs),
        multiplier: 1,
        callback,
      };
    } else {
      // Not the first time - handle backoff.
      const nextMultiplier = retryInfo.multiplier * 2;
      let delta = this.randomizeDelta(nextMultiplier * this._backoffMs);
      if (delta > this._maxBackoffMs) {
        delta = this.randomizeDelta(this._maxBackoffMs);
      } else {
        retryInfo.multiplier = nextMultiplier;
      }
      retryInfo.nextRetry = Date.now() + delta;
    }

    // Re-sort it into the heap with the correct position.
    // It's my assumption here that any item that is being retried is
    // very likely near or at the top.
    this._items.remove(retried);
    this._items.push(retried);

    // Schedule the next retry.
    this.scheduleRetry();
  }

  private randomizeDelta(durationMs: number): number {
    // The fuzz distance should never exceed one second, but in the
    // case of smaller things, don't end up with a negative delta.
    const magnitude = durationMs < 1000 ? durationMs : 1000;
    const offset = Math.random() * magnitude - magnitude / 2.0;
    return durationMs + offset;
  }

  private doRetries() {
    const now = Date.now();
    while (!this._items.isEmpty()) {
      const next = this._items.peek()!;

      // Within 10msec is close enough.
      if (next.retryInfo!.nextRetry - now < 10) {
        this._items.pop();

        next.retryInfo!.callback(
          next as unknown as T,
          Duration.from({millis: now - next.retryInfo!.firstRetry})
        );
      } else {
        break;
      }
    }
  }

  private scheduleRetry() {
    // What's next?
    const next = this._items.peek();
    if (next) {
      let delta = next.retryInfo!.nextRetry - Date.now();
      if (delta < 0) {
        delta = 0;
      }

      if (this._timer) {
        clearTimeout(this._timer);
      }
      this._timer = setTimeout(() => {
        this.doRetries();
      }, delta);
    }
  }
}
