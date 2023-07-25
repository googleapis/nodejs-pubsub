/*!
 * Copyright 2017 Google Inc. All Rights Reserved.
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

import {promisify, PromisifyOptions} from '@google-cloud/promisify';

/**
 * This replaces usage of promisifyAll(), going forward. Instead of opting
 * some methods out, you will need to opt methods in. Additionally, this
 * function validates method names against the class using TypeScript,
 * to generate compile-time failures for misspellings and changes.
 *
 * Future work in the library should all be Promise-first.
 *
 * @private
 */
export function promisifySome<T>(
  class_: Function,
  classProto: T,
  methods: (keyof T)[],
  options?: PromisifyOptions
): void {
  methods.forEach(methodName => {
    // Do the same stream checks as promisifyAll().
    const m = classProto[methodName] as unknown as Function;
    classProto[methodName] = promisify(m, options);
  });
}

export function noop() {}

/**
 * Provides a very simple throttling capability for tasks like error logs.
 * This ensures that no task is actually completed unless N millis have passed
 * since the last one.
 *
 * @private
 */
export class Throttler {
  minMillis: number;
  lastTime?: number;

  constructor(minMillis: number) {
    this.minMillis = minMillis;
  }

  /**
   * Performs the task requested, if enough time has passed since the
   * last successful call.
   */
  doMaybe(task: Function) {
    const now = Date.now();
    const doTask =
      !this.lastTime ||
      (this.lastTime && now - this.lastTime >= this.minMillis);

    if (doTask) {
      task();
      this.lastTime = now;
    }
  }
}

/**
 * Takes care of managing a Map of buckets to the bucket arrays themselves.
 *
 * @private
 */
export function addToBucket<T, U>(map: Map<T, U[]>, bucket: T, item: U) {
  const items = map.get(bucket) ?? [];
  items.push(item);
  map.set(bucket, items);
}
