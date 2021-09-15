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

// This will let us dig into the innards of the flow controller in peace.
/* eslint-disable @typescript-eslint/no-explicit-any */

import * as assert from 'assert';
import {describe, it} from 'mocha';

import * as fc from '../../src/publisher/flow-control';

describe('Flow Controller', () => {
  const optionsDefault: fc.FlowControlOptions = {
    maxOutstandingMessages: 5,
    maxOutstandingBytes: 100,
  };

  it('does basic bookkeeping correctly', async () => {
    const flowPause = new fc.FlowControl(optionsDefault);
    await flowPause.willSend(10, 1);
    assert.strictEqual((flowPause as any).bytes, 10);
    assert.strictEqual((flowPause as any).messages, 1);
  });

  it('queues up a promise when bytes are exceeded', async () => {
    const flowPause = new fc.FlowControl(optionsDefault);
    const promise = flowPause.willSend(1000, 1);
    assert.strictEqual((flowPause as any).requests.length, 1);
    (flowPause as any).requests[0].resolve();
    await promise;
  });

  it('queues up a promise when messages are exceeded', async () => {
    const flowPause = new fc.FlowControl(optionsDefault);
    const promise = flowPause.willSend(10, 100);
    assert.strictEqual((flowPause as any).requests.length, 1);
    (flowPause as any).requests[0].resolve();
    await promise;
  });

  it('releases a publisher when space is freed', async () => {
    const flowPause = new fc.FlowControl(optionsDefault);
    const promise = flowPause.willSend(1000, 1);
    assert.strictEqual((flowPause as any).requests.length, 1);
    flowPause.sent(990, 1);
    assert.strictEqual((flowPause as any).requests.length, 0);
    await promise;
  });

  it('releases a publisher only when enough space is freed', async () => {
    const flowPause = new fc.FlowControl(optionsDefault);
    const promise = flowPause.willSend(1000, 2);
    assert.strictEqual((flowPause as any).requests.length, 1);
    flowPause.sent(800, 1);
    assert.strictEqual((flowPause as any).requests.length, 1);
    flowPause.sent(150, 1);
    assert.strictEqual((flowPause as any).requests.length, 0);
    await promise;
  });

  it('calculates with wouldExceed correctly', () => {
    const flowPause = new fc.FlowControl(optionsDefault);
    assert.strictEqual(flowPause.wouldExceed(10000, 1), true);
    assert.strictEqual(flowPause.wouldExceed(1, 1000), true);
    assert.strictEqual(flowPause.wouldExceed(10000, 1000), true);
    assert.strictEqual(flowPause.wouldExceed(5, 1), false);
  });

  it('sets options after the fact', () => {
    const flowPause = new fc.FlowControl(optionsDefault);
    const newOptions = {
      maxOutstandingMessages: 100,
    };
    flowPause.setOptions(newOptions);
    assert.strictEqual(flowPause.options.maxOutstandingMessages, 100);
  });

  it('does not allow nonsensical option values', () => {
    const flowPause = new fc.FlowControl(optionsDefault);
    const newOptions = {
      maxOutstandingBytes: 0,
      maxOutstandingMessages: 0,
    };
    assert.throws(() => flowPause.setOptions(newOptions));
  });
});
