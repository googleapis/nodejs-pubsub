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

import * as assert from 'assert';
import {EventEmitter} from 'events';
import {common as protobuf} from 'protobufjs';
import * as proxyquire from 'proxyquire';
import * as sinon from 'sinon';
import {PassThrough} from 'stream';
import * as uuid from 'uuid';

import {HistogramOptions} from '../src/histogram';
import {FlowControlOptions} from '../src/lease-manager';
import {BatchOptions} from '../src/message-queues';
import {MessageStreamOptions} from '../src/message-stream';
import * as s from '../src/subscriber';
import {Subscription} from '../src/subscription';


const stubs = new Map();

class FakeClient {}

interface ClientOptions {
  client: string;
}

interface ClientCallback {
  (error: null|Error, client: FakeClient): void;
}

class FakePubSub {
  client = new FakeClient();
  getClient_(options: ClientOptions, callback: ClientCallback): void {
    callback(null, this.client);
  }
}

class FakeSubscription {
  name = uuid.v4();
  projectId = uuid.v4();
  pubsub = new FakePubSub();
}

class FakeHistogram {
  options?: HistogramOptions;
  constructor(options?: HistogramOptions) {
    this.options = options;

    const key = options ? 'histogram' : 'latencies';
    stubs.set(key, this);
  }
  add(seconds: number): void {}
  percentile(percentile: number): number {
    return 10;
  }
}

class FakeLeaseManager extends EventEmitter {
  options: FlowControlOptions;
  constructor(sub: s.Subscriber, options: FlowControlOptions) {
    super();
    this.options = options;
    stubs.set('inventory', this);
  }
  add(message: s.Message): void {}
  clear(): void {}
  remove(message: s.Message): void {}
}

class FakeQueue {
  options: BatchOptions;
  numPendingRequests = 0;
  maxMilliseconds = 100;
  constructor(sub: s.Subscriber, options: BatchOptions) {
    this.options = options;
  }
  add(message: s.Message, deadline?: number): void {}
  async flush(): Promise<void> {}
  async onFlush(): Promise<void> {}
}

class FakeAckQueue extends FakeQueue {
  constructor(sub: s.Subscriber, options: BatchOptions) {
    super(sub, options);
    stubs.set('ackQueue', this);
  }
}

class FakeModAckQueue extends FakeQueue {
  constructor(sub: s.Subscriber, options: BatchOptions) {
    super(sub, options);
    stubs.set('modAckQueue', this);
  }
}

class FakeMessageStream extends PassThrough {
  options: MessageStreamOptions;
  constructor(sub: s.Subscriber, options: MessageStreamOptions) {
    super({objectMode: true});
    this.options = options;
    stubs.set('messageStream', this);
  }
  destroy(error?: Error): void {}
}

class FakePreciseDate {
  value: protobuf.ITimestamp;
  constructor(date: protobuf.ITimestamp) {
    this.value = date;
  }
}

const RECEIVED_MESSAGE = {
  ackId: uuid.v4(),
  message: {
    attributes: {},
    data: Buffer.from('Hello, world!'),
    messageId: uuid.v4(),
    orderingKey: 'ordering-key',
    publishTime: {seconds: 12, nanos: 32}
  }
};

describe('Subscriber', () => {
  const sandbox = sinon.createSandbox();

  const fakeProjectify = {replaceProjectIdToken: sandbox.stub()};


  let subscription: Subscription;

  // tslint:disable-next-line variable-name
  let Message: typeof s.Message;
  let message: s.Message;
  // tslint:disable-next-line variable-name
  let Subscriber: typeof s.Subscriber;
  let subscriber: s.Subscriber;

  before(() => {
    const s = proxyquire('../src/subscriber.js', {
      '@google-cloud/precise-date': {PreciseDate: FakePreciseDate},
      '@google-cloud/projectify': fakeProjectify,
      './histogram': {Histogram: FakeHistogram},
      './lease-manager': {LeaseManager: FakeLeaseManager},
      './message-queues':
          {AckQueue: FakeAckQueue, ModAckQueue: FakeModAckQueue},
      './message-stream': {MessageStream: FakeMessageStream},
    });

    Message = s.Message;
    Subscriber = s.Subscriber;
  });

  beforeEach(() => {
    subscription = new FakeSubscription() as {} as Subscription;
    subscriber = new Subscriber(subscription);
    message = new Message(subscriber, RECEIVED_MESSAGE);
    subscriber.open();
  });

  afterEach(() => {
    sandbox.restore();
    subscriber.close();
  });

  describe('initialization', () => {
    it('should default ackDeadline to 10', () => {
      assert.strictEqual(subscriber.ackDeadline, 10);
    });

    it('should set isOpen to false', () => {
      const s = new Subscriber(subscription);
      assert.strictEqual(s.isOpen, false);
    });

    it('should set any options passed in', () => {
      const stub = sandbox.stub(Subscriber.prototype, 'setOptions');
      const fakeOptions = {};
      const sub = new Subscriber(subscription, fakeOptions);

      const [options] = stub.lastCall.args;
      assert.strictEqual(options, fakeOptions);
    });
  });

  describe('modAckLatency', () => {
    it('should get the 99th percentile latency', () => {
      const latencies: FakeHistogram = stubs.get('latencies');
      const fakeLatency = 234;

      sandbox.stub(latencies, 'percentile').withArgs(99).returns(fakeLatency);

      const maxMilliseconds = stubs.get('modAckQueue').maxMilliseconds;
      const expectedLatency = fakeLatency * 1000 + maxMilliseconds;

      assert.strictEqual(subscriber.modAckLatency, expectedLatency);
    });
  });

  describe('name', () => {
    it('should replace the project id token', () => {
      const fakeName = 'abcd';

      fakeProjectify.replaceProjectIdToken
          .withArgs(subscription.name, subscription.projectId)
          .returns(fakeName);

      const name = subscriber.name;
      assert.strictEqual(name, fakeName);
    });

    it('should cache the name', () => {
      const fakeName = 'abcd';
      const stub = fakeProjectify.replaceProjectIdToken
                       .withArgs(subscription.name, subscription.projectId)
                       .returns(fakeName);

      const name = subscriber.name;
      assert.strictEqual(name, fakeName);

      const name2 = subscriber.name;
      assert.strictEqual(name, name2);
      assert.strictEqual(stub.callCount, 1);
    });
  });

  describe('ack', () => {
    it('should update the ack histogram/deadline', () => {
      const histogram: FakeHistogram = stubs.get('histogram');
      const now = Date.now();

      message.received = 23842328;
      sandbox.stub(global.Date, 'now').returns(now);

      const expectedSeconds = (now - message.received) / 1000;
      const addStub = sandbox.stub(histogram, 'add').withArgs(expectedSeconds);

      const fakeDeadline = 312123;

      sandbox.stub(histogram, 'percentile').withArgs(99).returns(fakeDeadline);

      subscriber.ack(message);

      assert.strictEqual(addStub.callCount, 1);
      assert.strictEqual(subscriber.ackDeadline, fakeDeadline);
    });

    it('should not update the deadline if user specified', () => {
      const histogram: FakeHistogram = stubs.get('histogram');
      const ackDeadline = 543;

      sandbox.stub(histogram, 'add').throws();
      sandbox.stub(histogram, 'percentile').throws();

      subscriber.setOptions({ackDeadline});
      subscriber.ack(message);

      assert.strictEqual(subscriber.ackDeadline, ackDeadline);
    });

    it('should add the message to the ack queue', () => {
      const ackQueue: FakeAckQueue = stubs.get('ackQueue');
      const stub = sandbox.stub(ackQueue, 'add').withArgs(message);

      subscriber.ack(message);

      assert.strictEqual(stub.callCount, 1);
    });

    it('should remove the message from inv. after queue flushes', done => {
      const ackQueue: FakeAckQueue = stubs.get('ackQueue');
      const inventory: FakeLeaseManager = stubs.get('inventory');

      const onFlushStub = sandbox.stub(ackQueue, 'onFlush').resolves();

      sandbox.stub(inventory, 'remove').withArgs(message).callsFake(() => {
        assert.strictEqual(onFlushStub.callCount, 1);
        done();
      });

      subscriber.ack(message);
    });
  });

  describe('close', () => {
    it('should noop if not open', () => {
      const s = new Subscriber(subscription);
      const stream: FakeMessageStream = stubs.get('messageStream');

      sandbox.stub(stream, 'destroy')
          .rejects(new Error('should not be called.'));

      return s.close();
    });

    it('should set isOpen to false', () => {
      subscriber.close();
      assert.strictEqual(subscriber.isOpen, false);
    });

    it('should destroy the message stream', () => {
      const stream: FakeMessageStream = stubs.get('messageStream');
      const stub = sandbox.stub(stream, 'destroy');

      subscriber.close();
      assert.strictEqual(stub.callCount, 1);
    });

    it('should clear the inventory', () => {
      const inventory: FakeLeaseManager = stubs.get('inventory');
      const stub = sandbox.stub(inventory, 'clear');

      subscriber.close();
      assert.strictEqual(stub.callCount, 1);
    });

    it('should emit a close event', done => {
      subscriber.on('close', done);
      subscriber.close();
    });

    it('should nack any messages that come in after', () => {
      const stream: FakeMessageStream = stubs.get('messageStream');
      const stub = sandbox.stub(subscriber, 'nack');
      const pullResponse = {receivedMessages: [RECEIVED_MESSAGE]};

      subscriber.close();
      stream.emit('data', pullResponse);

      const [{ackId}] = stub.lastCall.args;
      assert.strictEqual(ackId, RECEIVED_MESSAGE.ackId);
    });

    describe('flushing the queues', () => {
      it('should wait for any pending acks', async () => {
        const ackQueue: FakeAckQueue = stubs.get('ackQueue');
        const ackOnFlush = sandbox.stub(ackQueue, 'onFlush').resolves();
        const acksFlush = sandbox.stub(ackQueue, 'flush').resolves();

        ackQueue.numPendingRequests = 1;
        await subscriber.close();

        assert.strictEqual(ackOnFlush.callCount, 1);
        assert.strictEqual(acksFlush.callCount, 1);
      });

      it('should wait for any pending modAcks', async () => {
        const modAckQueue: FakeModAckQueue = stubs.get('modAckQueue');
        const modAckOnFlush = sandbox.stub(modAckQueue, 'onFlush').resolves();
        const modAckFlush = sandbox.stub(modAckQueue, 'flush').resolves();

        modAckQueue.numPendingRequests = 1;
        await subscriber.close();

        assert.strictEqual(modAckOnFlush.callCount, 1);
        assert.strictEqual(modAckFlush.callCount, 1);
      });

      it('should resolve if no messages are pending', () => {
        const ackQueue: FakeAckQueue = stubs.get('ackQueue');

        sandbox.stub(ackQueue, 'flush').rejects();
        sandbox.stub(ackQueue, 'onFlush').rejects();

        const modAckQueue: FakeModAckQueue = stubs.get('modAckQueue');

        sandbox.stub(modAckQueue, 'flush').rejects();
        sandbox.stub(modAckQueue, 'onFlush').rejects();

        return subscriber.close();
      });
    });
  });

  describe('getClient', () => {
    it('should get a subscriber client', async () => {
      const pubsub = subscription.pubsub as {} as FakePubSub;
      const spy = sandbox.spy(pubsub, 'getClient_');
      const client = await subscriber.getClient();
      const [options] = spy.lastCall.args;
      assert.deepStrictEqual(options, {client: 'SubscriberClient'});
      assert.strictEqual(client, pubsub.client);
    });
  });

  describe('modAck', () => {
    const deadline = 600;

    it('should add the message/deadline to the modAck queue', () => {
      const modAckQueue: FakeModAckQueue = stubs.get('modAckQueue');
      const stub = sandbox.stub(modAckQueue, 'add').withArgs(message, deadline);

      subscriber.modAck(message, deadline);

      assert.strictEqual(stub.callCount, 1);
    });

    it('should capture latency after queue flush', async () => {
      const modAckQueue: FakeModAckQueue = stubs.get('modAckQueue');
      const latencies: FakeHistogram = stubs.get('latencies');

      const start = 1232123;
      const end = 34838243;
      const expectedSeconds = (end - start) / 1000;

      const dateStub = sandbox.stub(global.Date, 'now');

      dateStub.onCall(0).returns(start);
      dateStub.onCall(1).returns(end);

      sandbox.stub(modAckQueue, 'onFlush').resolves();
      const addStub = sandbox.stub(latencies, 'add').withArgs(expectedSeconds);

      await subscriber.modAck(message, deadline);

      assert.strictEqual(addStub.callCount, 1);
    });
  });

  describe('nack', () => {
    it('should modAck the message with a 0 deadline', async () => {
      const stub = sandbox.stub(subscriber, 'modAck');

      await subscriber.nack(message);

      const [msg, deadline] = stub.lastCall.args;

      assert.strictEqual(msg, message);
      assert.strictEqual(deadline, 0);
    });

    it('should remove the message from the inventory', async () => {
      const inventory: FakeLeaseManager = stubs.get('inventory');
      const stub = sandbox.stub(inventory, 'remove').withArgs(message);

      await subscriber.nack(message);

      assert.strictEqual(stub.callCount, 1);
    });
  });

  describe('open', () => {
    beforeEach(() => subscriber.close());

    it('should pass in batching options', () => {
      const batching = {maxMessages: 100};

      subscriber.setOptions({batching});
      subscriber.open();

      const ackQueue: FakeAckQueue = stubs.get('ackQueue');
      const modAckQueue: FakeAckQueue = stubs.get('modAckQueue');

      assert.strictEqual(ackQueue.options, batching);
      assert.strictEqual(modAckQueue.options, batching);
    });

    it('should pass in flow control options', () => {
      const flowControl = {maxMessages: 100};

      subscriber.setOptions({flowControl});
      subscriber.open();

      const inventory: FakeLeaseManager = stubs.get('inventory');

      assert.strictEqual(inventory.options, flowControl);
    });

    it('should pass in streaming options', () => {
      const streamingOptions = {maxStreams: 3};

      subscriber.setOptions({streamingOptions});
      subscriber.open();

      const stream: FakeMessageStream = stubs.get('messageStream');

      assert.strictEqual(stream.options, streamingOptions);
    });

    it('should emit stream errors', done => {
      subscriber.open();

      const stream: FakeMessageStream = stubs.get('messageStream');
      const fakeError = new Error('err');

      subscriber.on('error', err => {
        assert.strictEqual(err, fakeError);
        done();
      });

      stream.emit('error', fakeError);
    });

    it('should close the subscriber if stream closes unexpectedly', () => {
      const stub = sandbox.stub(subscriber, 'close');
      const stream: FakeMessageStream = stubs.get('messageStream');

      stream.emit('close');

      assert.strictEqual(stub.callCount, 1);
    });

    it('should add messages to the inventory', done => {
      subscriber.open();

      const modAckStub = sandbox.stub(subscriber, 'modAck');

      const stream: FakeMessageStream = stubs.get('messageStream');
      const pullResponse = {receivedMessages: [RECEIVED_MESSAGE]};

      const inventory: FakeLeaseManager = stubs.get('inventory');
      const addStub = sandbox.stub(inventory, 'add').callsFake(() => {
        const [addMsg] = addStub.lastCall.args;
        assert.deepStrictEqual(addMsg, message);

        // test for receipt
        const [modAckMsg, deadline] = modAckStub.lastCall.args;
        assert.strictEqual(addMsg, modAckMsg);
        assert.strictEqual(deadline, subscriber.ackDeadline);

        done();
      });

      sandbox.stub(global.Date, 'now').returns(message.received);
      stream.emit('data', pullResponse);
    });

    it('should pause the stream when full', () => {
      const inventory: FakeLeaseManager = stubs.get('inventory');
      const stream: FakeMessageStream = stubs.get('messageStream');

      const pauseStub = sandbox.stub(stream, 'pause');

      inventory.emit('full');

      assert.strictEqual(pauseStub.callCount, 1);
    });

    it('should resume the stream when not full', () => {
      const inventory: FakeLeaseManager = stubs.get('inventory');
      const stream: FakeMessageStream = stubs.get('messageStream');

      const resumeStub = sandbox.stub(stream, 'resume');

      inventory.emit('free');

      assert.strictEqual(resumeStub.callCount, 1);
    });

    it('should set isOpen to false', () => {
      subscriber.open();
      assert.strictEqual(subscriber.isOpen, true);
    });
  });

  describe('setOptions', () => {
    beforeEach(() => subscriber.close());

    it('should capture the ackDeadline', () => {
      const ackDeadline = 1232;

      subscriber.setOptions({ackDeadline});
      assert.strictEqual(subscriber.ackDeadline, ackDeadline);
    });

    it('should not set maxStreams higher than maxMessages', () => {
      const maxMessages = 3;
      const flowControl = {maxMessages};

      subscriber.setOptions({flowControl});
      subscriber.open();

      const stream: FakeMessageStream = stubs.get('messageStream');

      assert.strictEqual(stream.options.maxStreams, maxMessages);
    });
  });

  describe('Message', () => {
    describe('initialization', () => {
      it('should localize ackId', () => {
        assert.strictEqual(message.ackId, RECEIVED_MESSAGE.ackId);
      });

      it('should localize attributes', () => {
        assert.strictEqual(
            message.attributes, RECEIVED_MESSAGE.message.attributes);
      });

      it('should localize data', () => {
        assert.strictEqual(message.data, RECEIVED_MESSAGE.message.data);
      });

      it('should localize id', () => {
        assert.strictEqual(message.id, RECEIVED_MESSAGE.message.messageId);
      });

      it('should localize orderingKey', () => {
        assert.strictEqual(
            message.orderingKey, RECEIVED_MESSAGE.message.orderingKey);
      });

      it('should localize publishTime', () => {
        const m = new Message(subscriber, RECEIVED_MESSAGE);
        const timestamp = m.publishTime as unknown as FakePreciseDate;

        assert(timestamp instanceof FakePreciseDate);
        assert.strictEqual(
            timestamp.value, RECEIVED_MESSAGE.message.publishTime);
      });

      it('should localize received time', () => {
        const now = Date.now();

        sandbox.stub(global.Date, 'now').returns(now);

        const m = new Message(subscriber, RECEIVED_MESSAGE);

        assert.strictEqual(m.received, now);
      });
    });

    describe('length', () => {
      it('should return the data length', () => {
        assert.strictEqual(message.length, message.data.length);
      });

      it('should preserve the original data lenght', () => {
        const originalLength = message.data.length;

        message.data = Buffer.from('ohno');
        assert.notStrictEqual(message.length, message.data.length);
        assert.strictEqual(message.length, originalLength);
      });
    });

    describe('ack', () => {
      it('should ack the message', () => {
        const stub = sandbox.stub(subscriber, 'ack');

        message.ack();

        const [msg] = stub.lastCall.args;
        assert.strictEqual(msg, message);
      });

      it('should not ack the message if its been handled', () => {
        const stub = sandbox.stub(subscriber, 'ack');

        message.nack();
        message.ack();

        assert.strictEqual(stub.callCount, 0);
      });
    });

    describe('modAck', () => {
      it('should modAck the message', () => {
        const fakeDeadline = 10;
        const stub = sandbox.stub(subscriber, 'modAck');

        message.modAck(fakeDeadline);

        const [msg, deadline] = stub.lastCall.args;
        assert.strictEqual(msg, message);
        assert.strictEqual(deadline, fakeDeadline);
      });

      it('should not modAck the message if its been handled', () => {
        const deadline = 10;
        const stub = sandbox.stub(subscriber, 'modAck');

        message.ack();
        message.modAck(deadline);

        assert.strictEqual(stub.callCount, 0);
      });
    });

    describe('nack', () => {
      it('should nack the message', () => {
        const fakeDelay = 10;
        const stub = sandbox.stub(subscriber, 'modAck');

        message.nack(fakeDelay);

        const [msg, delay] = stub.lastCall.args;
        assert.strictEqual(msg, message);
        assert.strictEqual(delay, fakeDelay);
      });

      it('should not nack the message if its been handled', () => {
        const delay = 10;
        const stub = sandbox.stub(subscriber, 'modAck');

        message.ack();
        message.nack(delay);

        assert.strictEqual(stub.callCount, 0);
      });
    });
  });
});
