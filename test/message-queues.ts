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
import {EventEmitter} from 'events';
import {CallOptions} from 'google-gax';
import {Metadata, ServiceError} from 'grpc';
import * as proxyquire from 'proxyquire';
import * as sinon from 'sinon';
import * as uuid from 'uuid';

import * as messageTypes from '../src/message-queues';
import {BatchError} from '../src/message-queues';
import {Message, Subscriber} from '../src/subscriber';

class FakeClient {
  async acknowledge(
      reqOpts: {subscription: string, ackIds: string[]},
      callOptions: CallOptions): Promise<void> {}
  async modifyAckDeadline(
      reqOpts:
          {subscription: string, ackIds: string[], ackDeadlineSeconds: number},
      callOptions: CallOptions): Promise<void> {}
}

class FakeSubscriber extends EventEmitter {
  name: string;
  client: FakeClient;
  constructor() {
    super();

    this.name = uuid.v4();
    this.client = new FakeClient();
  }
  async getClient(): Promise<FakeClient> {
    return this.client;
  }
}

class FakeMessage {
  ackId: string;
  constructor() {
    this.ackId = uuid.v4();
  }
}

describe('MessageQueues', () => {
  const sandbox = sinon.createSandbox();

  let subscriber: FakeSubscriber;

  // tslint:disable-next-line variable-name no-any
  let MessageQueue: any;
  // tslint:disable-next-line variable-name
  let AckQueue: typeof messageTypes.AckQueue;
  // tslint:disable-next-line variable-name
  let ModAckQueue: typeof messageTypes.ModAckQueue;

  before(() => {
    const queues = proxyquire('../src/message-queues.js', {});

    AckQueue = queues.AckQueue;
    ModAckQueue = queues.ModAckQueue;

    type QueuedMessages = Array<[string, number?]>;

    MessageQueue = class MessageQueue extends queues.MessageQueue {
      batches = ([] as QueuedMessages[]);
      protected async _sendBatch(batch: QueuedMessages): Promise<void> {
        this.batches.push(batch);
      }
    };
  });

  beforeEach(() => {
    subscriber = new FakeSubscriber();
  });

  afterEach(() => sandbox.restore());

  describe('MessageQueue', () => {
    let messageQueue: typeof MessageQueue;

    beforeEach(() => {
      messageQueue = new MessageQueue(subscriber);
    });

    describe('initialization', () => {
      it('should default numPendingRequests', () => {
        assert.strictEqual(messageQueue.numPendingRequests, 0);
      });

      it('should set any provided options', () => {
        const fakeOptions = {};
        const stub = sandbox.stub(MessageQueue.prototype, 'setOptions');
        const mq = new MessageQueue(subscriber, fakeOptions);

        const [options] = stub.lastCall.args;
        assert.strictEqual(options, fakeOptions);
      });
    });

    describe('maxMilliseconds', () => {
      it('should return the maxMilliseconds option', () => {
        const maxMilliseconds = 101;

        messageQueue.setOptions({maxMilliseconds});
        assert.strictEqual(messageQueue.maxMilliseconds, maxMilliseconds);
      });
    });

    describe('add', () => {
      it('should increase the number of pending requests', () => {
        messageQueue.add(new FakeMessage() as Message);
        assert.strictEqual(messageQueue.numPendingRequests, 1);
      });

      it('should flush the queue if at capacity', () => {
        const stub = sandbox.stub(messageQueue, 'flush');

        messageQueue.setOptions({maxMessages: 1});
        messageQueue.add(new FakeMessage() as Message);

        assert.strictEqual(stub.callCount, 1);
      });

      it('should schedule a flush if needed', () => {
        const clock = sandbox.useFakeTimers();
        const stub = sandbox.stub(messageQueue, 'flush');
        const delay = 1000;

        messageQueue.setOptions({maxMilliseconds: delay});
        messageQueue.add(new FakeMessage() as Message);

        assert.strictEqual(stub.callCount, 0);
        clock.tick(delay);
        assert.strictEqual(stub.callCount, 1);
      });
    });

    describe('flush', () => {
      it('should cancel scheduled flushes', () => {
        const clock = sandbox.useFakeTimers();
        const spy = sandbox.spy(messageQueue, 'flush');
        const delay = 1000;

        messageQueue.setOptions({maxMilliseconds: delay});
        messageQueue.add(new FakeMessage() as Message);
        messageQueue.flush();
        clock.tick(delay);

        assert.strictEqual(spy.callCount, 1);
      });

      it('should remove the messages from the queue', () => {
        messageQueue.add(new FakeMessage() as Message);
        messageQueue.flush();

        assert.strictEqual(messageQueue.numPendingRequests, 0);
      });

      it('should send the batch', () => {
        const message = new FakeMessage();
        const deadline = 10;

        messageQueue.add(message as Message, deadline);
        messageQueue.flush();

        const expectedBatch = [[message.ackId, deadline]];
        const [batch] = messageQueue.batches;

        assert.deepStrictEqual(batch, expectedBatch);
      });

      it('should emit any errors', done => {
        const fakeError = new Error('err');

        sandbox.stub(messageQueue.batches, 'push').throws(fakeError);

        subscriber.on('error', err => {
          assert.strictEqual(err, fakeError);
          done();
        });

        messageQueue.flush();
      });

      it('should resolve any pending promises', () => {
        const promise = messageQueue.onFlush();
        setImmediate(() => messageQueue.flush());
        return promise;
      });
    });

    describe('onFlush', () => {
      it('should create a promise', () => {
        const promise = messageQueue.onFlush();

        assert(promise instanceof Promise);
      });

      it('should re-use existing promises', () => {
        const promise1 = messageQueue.onFlush();
        const promise2 = messageQueue.onFlush();

        assert.strictEqual(promise1, promise2);
      });
    });

    describe('setOptions', () => {
      it('should default maxMessages to 3000', () => {
        const stub = sandbox.stub(messageQueue, 'flush');

        for (let i = 0; i < 3000; i++) {
          assert.strictEqual(stub.callCount, 0);
          messageQueue.add(new FakeMessage());
        }

        assert.strictEqual(stub.callCount, 1);
      });

      it('should respect user supplied maxMessages', () => {
        const stub = sandbox.stub(messageQueue, 'flush');
        const maxMessages = 100;

        messageQueue.setOptions({maxMessages});

        for (let i = 0; i < maxMessages; i++) {
          assert.strictEqual(stub.callCount, 0);
          messageQueue.add(new FakeMessage());
        }

        assert.strictEqual(stub.callCount, 1);
      });

      it('should default maxMilliseconds to 100', () => {
        const clock = sandbox.useFakeTimers();
        const stub = sandbox.stub(messageQueue, 'flush');

        messageQueue.add(new FakeMessage());
        clock.tick(100);

        assert.strictEqual(stub.callCount, 1);
      });

      it('should respect user supplied maxMilliseconds', () => {
        const clock = sandbox.useFakeTimers();
        const stub = sandbox.stub(messageQueue, 'flush');
        const maxMilliseconds = 10000;

        messageQueue.setOptions({maxMilliseconds});
        messageQueue.add(new FakeMessage());
        clock.tick(maxMilliseconds);

        assert.strictEqual(stub.callCount, 1);
      });
    });
  });

  describe('AckQueue', () => {
    let ackQueue: messageTypes.AckQueue;

    beforeEach(() => {
      ackQueue = new AckQueue(subscriber as {} as Subscriber);
    });

    it('should send batches via Client#acknowledge', async () => {
      const messages = [
        new FakeMessage(),
        new FakeMessage(),
        new FakeMessage(),
      ];

      const stub = sandbox.stub(subscriber.client, 'acknowledge').resolves();
      const expectedReqOpts = {
        subscription: subscriber.name,
        ackIds: messages.map(({ackId}) => ackId),
      };

      messages.forEach(message => ackQueue.add(message as Message));
      await ackQueue.flush();

      const [reqOpts] = stub.lastCall.args;
      assert.deepStrictEqual(reqOpts, expectedReqOpts);
    });

    it('should send call options', async () => {
      const fakeCallOptions = {timeout: 10000};
      const stub = sandbox.stub(subscriber.client, 'acknowledge').resolves();

      ackQueue.setOptions({callOptions: fakeCallOptions});
      await ackQueue.flush();

      const [, callOptions] = stub.lastCall.args;
      assert.strictEqual(callOptions, fakeCallOptions);
    });

    it('should throw a BatchError if unable to ack', done => {
      const messages = [
        new FakeMessage(),
        new FakeMessage(),
        new FakeMessage(),
      ];

      const ackIds = messages.map(message => message.ackId);

      const fakeError: ServiceError = new Error('Err.');
      fakeError.code = 2;
      fakeError.metadata = new Metadata();

      const expectedMessage =
          `Failed to "acknowledge" for 3 message(s). Reason: Err.`;

      sandbox.stub(subscriber.client, 'acknowledge').rejects(fakeError);

      subscriber.on('error', (err: BatchError) => {
        assert.strictEqual(err.message, expectedMessage);
        assert.deepStrictEqual(err.ackIds, ackIds);
        assert.strictEqual(err.code, fakeError.code);
        assert.strictEqual(err.metadata, fakeError.metadata);
        done();
      });

      messages.forEach(message => ackQueue.add(message as Message));
      ackQueue.flush();
    });
  });

  describe('ModAckQueue', () => {
    let modAckQueue: messageTypes.ModAckQueue;

    beforeEach(() => {
      modAckQueue = new ModAckQueue(subscriber as {} as Subscriber);
    });

    it('should send batches via Client#modifyAckDeadline', async () => {
      const deadline = 600;
      const messages = [
        new FakeMessage(),
        new FakeMessage(),
        new FakeMessage(),
      ];

      const stub =
          sandbox.stub(subscriber.client, 'modifyAckDeadline').resolves();

      const expectedReqOpts = {
        subscription: subscriber.name,
        ackDeadlineSeconds: deadline,
        ackIds: messages.map(({ackId}) => ackId),
      };

      messages.forEach(
          message => modAckQueue.add(message as Message, deadline));
      await modAckQueue.flush();

      const [reqOpts] = stub.lastCall.args;
      assert.deepStrictEqual(reqOpts, expectedReqOpts);
    });

    it('should group ackIds by deadline', async () => {
      const deadline1 = 600;
      const deadline2 = 1000;

      const messages1 =
          [new FakeMessage(), new FakeMessage(), new FakeMessage()];
      const messages2 =
          [new FakeMessage(), new FakeMessage(), new FakeMessage()];

      const stub =
          sandbox.stub(subscriber.client, 'modifyAckDeadline').resolves();

      const expectedReqOpts1 = {
        subscription: subscriber.name,
        ackDeadlineSeconds: deadline1,
        ackIds: messages1.map(({ackId}) => ackId),
      };

      const expectedReqOpts2 = {
        subscription: subscriber.name,
        ackDeadlineSeconds: deadline2,
        ackIds: messages2.map(({ackId}) => ackId),
      };

      messages1.forEach(
          message => modAckQueue.add(message as Message, deadline1));
      messages2.forEach(
          message => modAckQueue.add(message as Message, deadline2));
      await modAckQueue.flush();

      const [reqOpts1] = stub.getCall(0).args;
      assert.deepStrictEqual(reqOpts1, expectedReqOpts1);

      const [reqOpts2] = stub.getCall(1).args;
      assert.deepStrictEqual(reqOpts2, expectedReqOpts2);
    });

    it('should send call options', async () => {
      const fakeCallOptions = {timeout: 10000};
      const stub =
          sandbox.stub(subscriber.client, 'modifyAckDeadline').resolves();

      modAckQueue.setOptions({callOptions: fakeCallOptions});
      modAckQueue.add(new FakeMessage() as Message, 10);
      await modAckQueue.flush();

      const [, callOptions] = stub.lastCall.args;
      assert.strictEqual(callOptions, fakeCallOptions);
    });

    it('should throw a BatchError if unable to modAck', done => {
      const messages = [
        new FakeMessage(),
        new FakeMessage(),
        new FakeMessage(),
      ];

      const ackIds = messages.map(message => message.ackId);

      const fakeError: ServiceError = new Error('Err.');
      fakeError.code = 2;
      fakeError.metadata = new Metadata();

      const expectedMessage =
          `Failed to "modifyAckDeadline" for 3 message(s). Reason: Err.`;

      sandbox.stub(subscriber.client, 'modifyAckDeadline').rejects(fakeError);

      subscriber.on('error', (err: BatchError) => {
        assert.strictEqual(err.message, expectedMessage);
        assert.deepStrictEqual(err.ackIds, ackIds);
        assert.strictEqual(err.code, fakeError.code);
        assert.strictEqual(err.metadata, fakeError.metadata);
        done();
      });

      messages.forEach(message => modAckQueue.add(message as Message));
      modAckQueue.flush();
    });
  });
});
