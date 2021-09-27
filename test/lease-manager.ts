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

import * as assert from 'assert';
import {describe, it, before, beforeEach, afterEach} from 'mocha';
import {EventEmitter} from 'events';
import * as proxyquire from 'proxyquire';
import * as sinon from 'sinon';

import * as leaseTypes from '../src/lease-manager';
import {Message, Subscriber} from '../src/subscriber';
import {defaultOptions} from '../src/default-options';

const FREE_MEM = 9376387072;
const fakeos = {
  freemem: () => FREE_MEM,
};

class FakeSubscriber extends EventEmitter {
  ackDeadline = 10;
  isOpen = true;
  modAckLatency = 2000;
  async modAck(): Promise<void> {}
}

class FakeMessage {
  length = 20;
  received: number;
  constructor() {
    this.received = Date.now();
  }
  modAck(): void {}
}

describe('LeaseManager', () => {
  const sandbox = sinon.createSandbox();

  let subscriber: Subscriber;

  // tslint:disable-next-line variable-name
  let LeaseManager: typeof leaseTypes.LeaseManager;
  let leaseManager: leaseTypes.LeaseManager;

  before(() => {
    LeaseManager = proxyquire('../src/lease-manager.js', {
      os: fakeos,
      '../src/subscriber': {Subscriber: FakeSubscriber, Message: FakeMessage},
    }).LeaseManager;
  });

  beforeEach(() => {
    subscriber = new FakeSubscriber() as {} as Subscriber;
    leaseManager = new LeaseManager(subscriber);
  });

  afterEach(() => {
    leaseManager.clear();
    sandbox.restore();
  });

  describe('instantiation', () => {
    it('should default the bytes value to 0', () => {
      assert.strictEqual(leaseManager.size, 0);
    });

    it('should capture any options passed in', () => {
      const fakeOptions = {};
      const stub = sandbox.stub(LeaseManager.prototype, 'setOptions');
      new LeaseManager(subscriber, fakeOptions);
      const [options] = stub.lastCall.args;
      assert.strictEqual(options, fakeOptions);
    });
  });

  describe('pending', () => {
    it('should return the number of pending messages', () => {
      leaseManager.setOptions({allowExcessMessages: false, maxMessages: 1});

      leaseManager.add(new FakeMessage() as {} as Message);
      leaseManager.add(new FakeMessage() as {} as Message);

      assert.strictEqual(leaseManager.pending, 1);
    });
  });

  describe('size', () => {
    it('should return the number of messages', () => {
      leaseManager.add(new FakeMessage() as {} as Message);
      leaseManager.add(new FakeMessage() as {} as Message);

      assert.strictEqual(leaseManager.size, 2);
    });
  });

  describe('add', () => {
    it('should update the bytes/size values', () => {
      const message = new FakeMessage() as {} as Message;

      leaseManager.add(message);

      assert.strictEqual(leaseManager.size, 1);
      assert.strictEqual(leaseManager.bytes, message.length);
    });

    it('should dispatch the message if allowExcessMessages is true', done => {
      const fakeMessage = new FakeMessage() as {} as Message;

      leaseManager.isFull = () => true;
      leaseManager.setOptions({allowExcessMessages: true});

      subscriber.on('message', message => {
        assert.strictEqual(message, fakeMessage);
        done();
      });

      leaseManager.add(fakeMessage);
    });

    it('should dispatch the message if the inventory is not full', done => {
      const fakeMessage = new FakeMessage() as {} as Message;

      leaseManager.isFull = () => false;
      leaseManager.setOptions({allowExcessMessages: false});

      subscriber.on('message', message => {
        assert.strictEqual(message, fakeMessage);
        done();
      });

      leaseManager.add(fakeMessage);
    });

    it('should not dispatch the message if the inventory is full', done => {
      const fakeMessage = new FakeMessage() as {} as Message;

      leaseManager.isFull = () => true;
      leaseManager.setOptions({allowExcessMessages: false});

      subscriber.on('message', () => {
        done(new Error('Test should not have dispatched message.'));
      });

      leaseManager.add(fakeMessage);
      setImmediate(done);
    });

    it('should not dispatch the message if the sub closes', done => {
      const fakeMessage = new FakeMessage() as {} as Message;

      leaseManager.isFull = () => false;

      subscriber.isOpen = false;
      subscriber.on('message', () => {
        done(new Error('Test should not have dispatched message.'));
      });

      leaseManager.add(fakeMessage);
      setImmediate(done);
    });

    it('should emit the full event if it becomes full', done => {
      leaseManager.setOptions({allowExcessMessages: false, maxMessages: 1});

      leaseManager.on('full', done);
      leaseManager.add(new FakeMessage() as {} as Message);
    });

    describe('extending deadlines', () => {
      let clock: sinon.SinonFakeTimers;
      let random: number;
      let expectedTimeout: number;
      let halfway: number;

      beforeEach(() => {
        // This random number was generated once to keep the test results stable.
        random = 0.5756015072052962;
        sandbox.stub(global.Math, 'random').returns(random);
        clock = sandbox.useFakeTimers();
        expectedTimeout =
          (subscriber.ackDeadline * 1000 * 0.9 - subscriber.modAckLatency) *
          random;
        halfway = expectedTimeout / 2;
      });

      it('should schedule a lease extension', () => {
        const message = new FakeMessage() as {} as Message;
        const stub = sandbox
          .stub(message, 'modAck')
          .withArgs(subscriber.ackDeadline);

        leaseManager.add(message);
        clock.tick(expectedTimeout);

        assert.strictEqual(stub.callCount, 1);
      });

      it('should not schedule a lease extension if already in progress', () => {
        const messages = [new FakeMessage(), new FakeMessage()];
        const stubs = messages.map(message => sandbox.stub(message, 'modAck'));

        // since only 1 timeout should be set, even if add messages at different
        // times, they should all get extended at the same time
        messages.forEach(message => {
          leaseManager.add(message as {} as Message);
          clock.tick(halfway);
        });

        messages.forEach((fakeMessage, i) => {
          const [deadline] = stubs[i].lastCall.args as {} as [number];
          assert.strictEqual(deadline, subscriber.ackDeadline);
        });
      });

      it('should properly convert any legacy maxExtension values', () => {
        const maxExtension = 60 * 1000;
        leaseManager.setOptions({maxExtension});
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const options = (leaseManager as any)._options;
        assert.strictEqual(options.maxExtensionMinutes, maxExtension / 60);
        assert.strictEqual(options.maxExtension, undefined);
      });

      it('should not allow both maxExtension and maxExtensionMinutes', () => {
        assert.throws(() => {
          leaseManager.setOptions({
            maxExtension: 10,
            maxExtensionMinutes: 10,
          });
        });
      });

      it('should remove any messages that pass the maxExtensionMinutes value', () => {
        const maxExtensionSeconds = (expectedTimeout - 100) / 1000;
        const badMessages = [new FakeMessage(), new FakeMessage()];

        leaseManager.setOptions({
          maxExtensionMinutes: maxExtensionSeconds / 60,
        });
        badMessages.forEach(message =>
          leaseManager.add(message as {} as Message)
        );
        clock.tick(halfway);

        // only message that shouldn't be forgotten
        const goodMessage = new FakeMessage();
        const removeStub = sandbox.stub(leaseManager, 'remove');
        const modAckStub = sandbox.stub(goodMessage, 'modAck');

        leaseManager.add(goodMessage as {} as Message);
        clock.tick(halfway);

        // make sure the expired messages were forgotten
        assert.strictEqual(removeStub.callCount, badMessages.length);

        badMessages.forEach((fakeMessage, i) => {
          const [message] = removeStub.getCall(i).args;
          assert.strictEqual(message, fakeMessage);
        });

        const [deadline] = modAckStub.lastCall.args as {} as [number];
        assert.strictEqual(deadline, subscriber.ackDeadline);
      });

      it('should continuously extend the deadlines', () => {
        const message = new FakeMessage();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const stub = (sandbox as any)
          .stub(message, 'modAck')
          .withArgs(subscriber.ackDeadline);

        leaseManager.add(message as {} as Message);
        clock.tick(expectedTimeout);

        assert.strictEqual(stub.callCount, 1);
        clock.tick(expectedTimeout);
        assert.strictEqual(stub.callCount, 2);
      });
    });
  });

  describe('clear', () => {
    it('should completely clear out the inventory', () => {
      leaseManager.add(new FakeMessage() as {} as Message);
      leaseManager.add(new FakeMessage() as {} as Message);
      leaseManager.clear();

      assert.strictEqual(leaseManager.bytes, 0);
      assert.strictEqual(leaseManager.size, 0);
    });

    it('should emit the free event if it was full', done => {
      leaseManager.setOptions({maxMessages: 1});
      leaseManager.add(new FakeMessage() as {} as Message);
      leaseManager.on('free', done);

      setImmediate(() => leaseManager.clear());
    });

    it('should cancel any lease extensions', () => {
      const clock = sandbox.useFakeTimers();
      const stub = sandbox.stub(subscriber, 'modAck').resolves();

      leaseManager.add(new FakeMessage() as {} as Message);
      leaseManager.clear();

      // this would otherwise trigger a minimum of 2 modAcks
      clock.tick(subscriber.ackDeadline * 1000 * 2);

      assert.strictEqual(stub.callCount, 0);
    });
  });

  describe('isFull', () => {
    it('should return true if the maxMessages threshold is hit', () => {
      const maxMessages = 1;

      leaseManager.setOptions({maxMessages});
      leaseManager.add(new FakeMessage() as {} as Message);
      leaseManager.add(new FakeMessage() as {} as Message);

      assert.strictEqual(leaseManager.isFull(), true);
    });

    it('should return true if the maxBytes threshold is hit', () => {
      const message = new FakeMessage();
      const maxBytes = message.length - 1;

      leaseManager.setOptions({maxBytes});
      leaseManager.add(message as {} as Message);

      assert.strictEqual(leaseManager.isFull(), true);
    });

    it('should return false if no thresholds are hit', () => {
      const message = new FakeMessage();
      const maxMessages = 2;
      const maxBytes = message.length + 1;

      leaseManager.setOptions({maxMessages, maxBytes});
      leaseManager.add(message as {} as Message);

      assert.strictEqual(leaseManager.isFull(), false);
    });
  });

  describe('remove', () => {
    it('should noop for unknown messages', () => {
      const message = new FakeMessage();

      leaseManager.add(message as {} as Message);
      leaseManager.remove(new FakeMessage() as {} as Message);

      assert.strictEqual(leaseManager.size, 1);
      assert.strictEqual(leaseManager.bytes, message.length);
    });

    it('should update the bytes/size values', () => {
      const message = new FakeMessage() as {} as Message;

      leaseManager.add(message);
      leaseManager.remove(message);

      assert.strictEqual(leaseManager.size, 0);
      assert.strictEqual(leaseManager.bytes, 0);
    });

    it('should emit the free event if there is free space', done => {
      const message = new FakeMessage() as {} as Message;

      leaseManager.setOptions({maxMessages: 1});
      leaseManager.add(message);
      setImmediate(() => leaseManager.remove(message));

      leaseManager.on('free', () => {
        assert.strictEqual(leaseManager.size, 0);
        done();
      });
    });

    it('should remove a message from the pending state', done => {
      const pending = new FakeMessage() as {} as Message;

      leaseManager.setOptions({allowExcessMessages: false, maxMessages: 1});

      subscriber.on('message', message => {
        if (message === pending) {
          done(new Error('Pending messages should not be emitted.'));
        }
      });

      leaseManager.add(new FakeMessage() as {} as Message);
      leaseManager.add(pending);
      leaseManager.remove(pending);

      assert.strictEqual(leaseManager.pending, 0);
      setImmediate(done);
    });

    it('should dispense a pending messages', done => {
      const temp = new FakeMessage() as {} as Message;
      const pending = new FakeMessage() as {} as Message;

      leaseManager.setOptions({allowExcessMessages: false, maxMessages: 1});

      subscriber.on('message', message => {
        if (message === temp) {
          return;
        }

        assert.strictEqual(leaseManager.size, 1);
        assert.strictEqual(message, pending);
        done();
      });

      leaseManager.add(temp);
      leaseManager.add(pending);
      leaseManager.remove(temp);
    });

    it('should cancel any extensions if no messages are left', () => {
      const clock = sandbox.useFakeTimers();
      const message = new FakeMessage() as {} as Message;
      const stub = sandbox.stub(subscriber, 'modAck').resolves();

      leaseManager.add(message);
      leaseManager.remove(message);

      clock.tick(subscriber.ackDeadline * 1000 * 2);

      assert.strictEqual(stub.callCount, 0);
    });
  });

  describe('setOptions', () => {
    it('should allow excess messages by default', () => {});

    it('should default maxBytes', () => {
      const littleMessage = new FakeMessage() as {} as Message;
      const bigMessage = new FakeMessage();

      leaseManager.add(littleMessage);
      assert.strictEqual(leaseManager.isFull(), false);

      leaseManager.remove(littleMessage);
      bigMessage.length = defaultOptions.subscription.maxOutstandingBytes * 2;
      leaseManager.add(bigMessage as {} as Message);
      assert.strictEqual(leaseManager.isFull(), true);
    });

    it('should cap maxMessages', () => {
      for (
        let i = 0;
        i < defaultOptions.subscription.maxOutstandingMessages;
        i++
      ) {
        assert.strictEqual(leaseManager.isFull(), false);
        leaseManager.add(new FakeMessage() as {} as Message);
      }

      assert.strictEqual(leaseManager.isFull(), true);
    });
  });
});
