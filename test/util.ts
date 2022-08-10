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

import {describe, it} from 'mocha';
import {addToBucket, Throttler} from '../src/util';
import * as assert from 'assert';

describe('utils', () => {
  describe('Throttler', () => {
    it('does not allow too many calls through at once', () => {
      const throttler = new Throttler(300);
      let totalCalls = '';

      // This one should succeed.
      throttler.doMaybe(() => {
        totalCalls += 'FIRST';
      });

      // This one should fail.
      throttler.doMaybe(() => {
        totalCalls += 'SECOND';
      });

      // Simulate time passing.
      throttler.lastTime! -= 1000;

      // This one should succeed.
      throttler.doMaybe(() => {
        totalCalls += 'THIRD';
      });

      assert.strictEqual(totalCalls, 'FIRSTTHIRD');
    });
  });

  describe('addToBucket', () => {
    it('adds to a non-existent bucket', () => {
      const map = new Map<string, string[]>();
      addToBucket(map, 'a', 'b');
      assert.deepStrictEqual(map.get('a'), ['b']);
    });

    it('adds to an existent bucket', () => {
      const map = new Map<string, string[]>();
      map.set('a', ['c']);
      addToBucket(map, 'a', 'b');
      assert.deepStrictEqual(map.get('a'), ['c', 'b']);
    });
  });
});
