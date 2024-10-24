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

import {describe, it} from 'mocha';
import * as assert from 'assert';
import * as ah from '../src/async-helper';
import {Message} from '../src/subscriber';

class FakeMessage {
  constructor(public id: string) {}
}

function fakeMessage(id: string) {
  return new FakeMessage(id) as unknown as Message;
}

describe('async-helper', () => {
  it('processes new messages', async () => {
    const helper = new ah.AsyncHelper(async (m: Message) => {
      assert.strictEqual(m.id, '1');
    });
    const handler = helper.handler;
    const msg = fakeMessage('1');
    handler(msg);
  });

  it('processes multiple messages in order', async () => {
    const items = ['1', '2', '3'];
    const helper = new ah.AsyncHelper(async (m: Message) => {
      assert.strictEqual(m.id, items.shift());
    });
    const handler = helper.handler;
    handler(fakeMessage('1'));
    handler(fakeMessage('2'));
    handler(fakeMessage('3'));
  });

  it('processes unevenly timed messages in order', async () => {
    const items = ['1', '2', '3'];
    const helper = new ah.AsyncHelper(async (m: Message) => {
      if (m.id === '2') {
        await new Promise(r => setTimeout(r, 100));
      }
      assert.strictEqual(m.id, items.shift());
    });
    const handler = helper.handler;
    handler(fakeMessage('1'));
    handler(fakeMessage('2'));
    handler(fakeMessage('3'));
  });
});
