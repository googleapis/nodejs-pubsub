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

'use strict';

const extend = require('extend');

/*!
 * The Histogram class is used to capture the lifespan of messages within the
 * the client. These durations are then used to calculate the 99th percentile
 * of ack deadlines for future messages.
 *
 * @private
 * @class
 */
class Histogram {
  constructor(options) {
    this.options = extend(
      {
        min: 10000,
        max: 600000,
      },
      options
    );
    this.data = new Map();
    this.length = 0;
  }
  /*!
   * Adds a value to the histogram.
   *
   * @private
   * @param {numnber} value - The value in milliseconds.
   */
  add(value) {
    value = Math.max(value, this.options.min);
    value = Math.min(value, this.options.max);
    value = Math.ceil(value / 1000) * 1000;
    if (!this.data.has(value)) {
      this.data.set(value, 0);
    }
    const count = this.data.get(value);
    this.data.set(value, count + 1);
    this.length += 1;
  }
  /*!
   * Retrieves the nth percentile of recorded values.
   *
   * @private
   * @param {number} percent The requested percentage.
   * @return {number}
   */
  percentile(percent) {
    percent = Math.min(percent, 100);
    let target = this.length - this.length * (percent / 100);
    const keys = Array.from(this.data.keys());
    let key;
    for (let i = keys.length - 1; i > -1; i--) {
      key = keys[i];
      target -= this.data.get(key);
      if (target <= 0) {
        return key;
      }
    }
    return this.options.min;
  }
}

module.exports = Histogram;
