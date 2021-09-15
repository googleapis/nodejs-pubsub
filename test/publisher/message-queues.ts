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

import {ServiceError} from 'google-gax';
import * as assert from 'assert';
import {describe, it, before, beforeEach, afterEach} from 'mocha';
import {EventEmitter} from 'events';
import * as proxyquire from 'proxyquire';
import * as sinon from 'sinon';

import {RequestConfig, RequestCallback} from '../../src/pubsub';
import * as p from '../../src/publisher';
import * as b from '../../src/publisher/message-batch';
import * as q from '../../src/publisher/message-queues';
import {PublishError} from '../../src/publisher/publish-error';

class FakeTopic {
  name = 'fake-topic';
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  request<T>(config: RequestConfig, callback: RequestCallback<T>): void {}
}

class FakeFlowControl {}

class FakePublisher {
  topic: FakeTopic;
  settings: p.PublishOptions;
  flowControl: FakeFlowControl;
  constructor(topic: FakeTopic) {
    this.topic = topic;
    this.settings = {
      batching: {},
    };
    this.flowControl = new FakeFlowControl();
  }
}

class FakeMessageBatch {
  callbacks: p.PublishCallback[];
  created: number;
  messages: p.PubsubMessage[];
  options: b.BatchPublishOptions;
  constructor(options = {} as b.BatchPublishOptions) {
    this.callbacks = [];
    this.created = Date.now();
    this.messages = [];
    this.options = options;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  add(message: p.PubsubMessage, callback: p.PublishCallback): void {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  canFit(message: p.PubsubMessage): boolean {
    return true;
  }
  isAtMax(): boolean {
    return false;
  }
  isFull(): boolean {
    return false;
  }
  setOptions(options: b.BatchPublishOptions) {
    this.options = options;
  }
}

class FakePublishError {
  orderingKey: string;
  error: ServiceError;
  constructor(key: string, error: ServiceError) {
    this.orderingKey = key;
    this.error = error;
  }
}

describe('Message Queues', () => {
  const sandbox = sinon.createSandbox();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let MessageQueue: any;
  let Queue: typeof q.Queue;
  let OrderedQueue: typeof q.OrderedQueue;

  let topic: FakeTopic;
  let publisher: p.Publisher;

  before(() => {
    const mocked = proxyquire('../../src/publisher/message-queues.js', {
      './message-batch': {MessageBatch: FakeMessageBatch},
      './publish-error': {PublishError: FakePublishError},
    });

    MessageQueue = mocked.MessageQueue;
    Queue = mocked.Queue;
    OrderedQueue = mocked.OrderedQueue;
  });

  beforeEach(() => {
    topic = new FakeTopic();
    publisher = new FakePublisher(topic) as unknown as p.Publisher;
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('MessageQueue', () => {
    let queue: q.Queue;

    beforeEach(() => {
      queue = new MessageQueue(publisher as p.Publisher);
    });

    describe('initialization', () => {
      it('should extend EventEmitter', () => {
        assert(queue instanceof EventEmitter);
      });

      it('should localize the publisher', () => {
        assert.strictEqual(queue.publisher, publisher);
      });

      it('should localize the batch options', () => {
        const batching = {maxMessages: 1001};
        publisher.settings = {batching};

        queue = new MessageQueue(publisher as p.Publisher);
        assert.strictEqual(queue.batchOptions, batching);
      });
    });

    describe('_publish', () => {
      const messages = [{}, {}, {}];
      const callbacks = messages.map(() => sandbox.spy());

      it('should make the correct request', () => {
        const stub = sandbox.stub(topic, 'request');

        queue._publish(messages, callbacks);

        const [{client, method, reqOpts}] = stub.lastCall.args;
        assert.strictEqual(client, 'PublisherClient');
        assert.strictEqual(method, 'publish');
        assert.deepStrictEqual(reqOpts, {topic: topic.name, messages});
      });

      it('should pass along any gax options', () => {
        const stub = sandbox.stub(topic, 'request');
        const callOptions = {};

        publisher.settings.gaxOpts = callOptions;
        queue._publish(messages, callbacks);

        const [{gaxOpts}] = stub.lastCall.args;
        assert.strictEqual(gaxOpts, callOptions);
      });

      it('should pass back any request errors', done => {
        const error = new Error('err') as ServiceError;

        sandbox.stub(topic, 'request').callsFake((config, callback) => {
          callback(error);
        });

        queue._publish(messages, callbacks, err => {
          assert.strictEqual(err, error);

          callbacks.forEach(callback => {
            const [err] = callback.lastCall.args;
            assert.strictEqual(err, error);
          });

          done();
        });
      });

      it('should pass back message ids', done => {
        const messageIds = messages.map((_, i) => `message${i}`);

        sandbox.stub(topic, 'request').callsFake((config, callback) => {
          callback(null, {messageIds});
        });

        queue._publish(messages, callbacks, err => {
          assert.ifError(err);

          callbacks.forEach((callback, i) => {
            const [, messageId] = callback.lastCall.args;
            const expectedId = `message${i}`;
            assert.strictEqual(messageId, expectedId);
          });

          done();
        });
      });
    });
  });

  describe('Queue', () => {
    let queue: q.Queue;

    beforeEach(() => {
      queue = new Queue(publisher as p.Publisher);
    });

    describe('initialization', () => {
      it('should create a message batch', () => {
        assert.ok(queue.batch instanceof FakeMessageBatch);
        assert.strictEqual(queue.batch.options, queue.batchOptions);
      });

      it('should propagate batch options to the message batch when updated', () => {
        const newConfig = {
          batching: {},
        };
        publisher.settings = newConfig;
        queue.updateOptions();
        assert.strictEqual(queue.batch.options, newConfig.batching);
      });
    });

    describe('add', () => {
      const spy = sandbox.spy();
      const fakeMessage: p.PubsubMessage = {};

      it('should publish immediately if unable to fit message', done => {
        const addStub = sandbox.stub(queue.batch, 'add');
        sandbox.stub(queue.batch, 'canFit').returns(false);

        sandbox
          .stub(queue, 'publish')
          .onCall(0)
          .callsFake(() => {
            assert.strictEqual(addStub.callCount, 0);
            done();
          });

        queue.add(fakeMessage, spy);
      });

      it('should add the message to the batch', () => {
        const stub = sandbox.stub(queue.batch, 'add');
        sandbox.stub(queue, 'publish');

        queue.add(fakeMessage, spy);

        const [message, callback] = stub.lastCall.args;
        assert.strictEqual(message, fakeMessage);
        assert.strictEqual(callback, spy);
      });

      it('should publish immediately if the batch became full', () => {
        const stub = sandbox.stub(queue, 'publish');
        sandbox.stub(queue.batch, 'isFull').returns(true);

        queue.add(fakeMessage, spy);

        assert.strictEqual(stub.callCount, 1);
      });

      it('should set a timeout to publish if need be', () => {
        const clock = sandbox.useFakeTimers();
        const stub = sandbox.stub(queue, 'publish');
        const maxMilliseconds = 1234;

        queue.batchOptions = {maxMilliseconds};
        queue.add(fakeMessage, spy);

        assert.strictEqual(stub.callCount, 0);
        clock.tick(maxMilliseconds);
        assert.strictEqual(stub.callCount, 1);
        clock.restore();
      });

      it('should noop if a timeout is already set', () => {
        const clock = sandbox.useFakeTimers();
        const stub = sandbox.stub(queue, 'publish');
        const maxMilliseconds = 1234;

        queue.batchOptions = {maxMilliseconds};
        queue.pending = 1234 as unknown as NodeJS.Timer;
        queue.add(fakeMessage, spy);

        clock.tick(maxMilliseconds);
        assert.strictEqual(stub.callCount, 0);
        clock.restore();
      });
    });

    describe('publish', () => {
      it('should create a new batch', () => {
        const oldBatch = queue.batch;

        queue.publish();

        assert.notStrictEqual(oldBatch, queue.batch);
        assert.ok(queue.batch instanceof FakeMessageBatch);
        assert.strictEqual(queue.batch.options, queue.batchOptions);
      });

      it('should cancel any pending publish calls', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const fakeHandle = 1234 as unknown as any;
        const stub = sandbox.stub(global, 'clearTimeout').withArgs(fakeHandle);

        queue.pending = fakeHandle;
        queue.publish();

        assert.strictEqual(stub.callCount, 1);
        assert.strictEqual(queue.pending, undefined);
      });

      it('should publish the messages', () => {
        const batch = queue.batch;
        const stub = sandbox.stub(queue, '_publish');

        queue.publish();

        const [messages, callbacks] = stub.lastCall.args;
        assert.strictEqual(messages, batch.messages);
        assert.strictEqual(callbacks, batch.callbacks);
      });
    });
  });

  describe('OrderedQueue', () => {
    const key = 'abcd';
    let queue: q.OrderedQueue;

    beforeEach(() => {
      queue = new OrderedQueue(publisher as p.Publisher, key);
    });

    describe('initialization', () => {
      it('should create an array of batches', () => {
        assert.deepStrictEqual(queue.batches, []);
      });

      it('should default inFlight ot false', () => {
        assert.strictEqual(queue.inFlight, false);
      });

      it('should localize the ordering key', () => {
        assert.strictEqual(queue.key, key);
      });

      it('should propagate batch options to all message batches when updated', () => {
        const firstBatch = queue.createBatch();
        const secondBatch = queue.createBatch();
        queue.batches.push(firstBatch, secondBatch);

        const newConfig = {
          batching: {},
        };
        publisher.settings = newConfig;
        queue.updateOptions();

        assert.strictEqual(firstBatch.options, newConfig.batching);
        assert.strictEqual(secondBatch.options, newConfig.batching);
      });
    });

    describe('currentBatch', () => {
      it('should return the oldest known batch', () => {
        const batches = [
          new FakeMessageBatch(),
          new FakeMessageBatch(),
        ] as b.MessageBatch[];
        queue.batches.push(...batches);
        assert.strictEqual(queue.currentBatch, batches[0]);
      });

      it('should create a new batch if one does not exist', () => {
        assert.strictEqual(queue.batches.length, 0);
        assert.ok(queue.currentBatch instanceof FakeMessageBatch);
        assert.strictEqual(queue.batches.length, 1);
      });
    });

    describe('add', () => {
      const fakeMessage: p.PubsubMessage = {};
      const spy = sandbox.spy();

      let batch: FakeMessageBatch;

      beforeEach(() => {
        batch = queue.currentBatch as FakeMessageBatch;
      });

      describe('with batch in flight', () => {
        beforeEach(() => {
          queue.inFlight = true;
        });

        it('should add the message to current batch', () => {
          const stub = sandbox.stub(batch, 'add');

          queue.add(fakeMessage, spy);

          const [message, callback] = stub.lastCall.args;
          assert.strictEqual(message, fakeMessage);
          assert.strictEqual(callback, spy);
        });

        it('should create a new batch if current one is at max', () => {
          const fakeBatch = new FakeMessageBatch() as b.MessageBatch;
          const stub = sandbox.stub(fakeBatch, 'add');

          sandbox.stub(batch, 'isAtMax').returns(true);
          sandbox.stub(queue, 'createBatch').returns(fakeBatch);

          queue.add(fakeMessage, spy);

          assert.deepStrictEqual(queue.batches, [fakeBatch, batch]);
          const [message, callback] = stub.lastCall.args;
          assert.strictEqual(message, fakeMessage);
          assert.strictEqual(callback, spy);
        });
      });

      describe('without a batch in flight', () => {
        it('should publish immediately if it cannot fit the message', done => {
          const addStub = sandbox.stub(batch, 'add');

          sandbox.stub(batch, 'canFit').withArgs(fakeMessage).returns(false);
          sandbox
            .stub(queue, 'publish')
            .onCall(0)
            .callsFake(() => {
              assert.strictEqual(addStub.callCount, 0);
              done();
            });

          queue.add(fakeMessage, spy);
        });

        it('should add the message to the current batch', () => {
          const stub = sandbox.stub(batch, 'add');

          queue.add(fakeMessage, spy);

          const [message, callback] = stub.lastCall.args;
          assert.strictEqual(message, fakeMessage);
          assert.strictEqual(callback, spy);
        });

        it('should noop after adding if a publish was triggered', () => {
          const publishStub = sandbox.stub(queue, 'publish');
          const beginPublishStub = sandbox.stub(queue, 'beginNextPublish');

          sandbox.stub(batch, 'canFit').returns(false);

          publishStub.onCall(0).callsFake(() => {
            queue.inFlight = true;
          });

          queue.add(fakeMessage, spy);

          assert.strictEqual(publishStub.callCount, 1);
          assert.strictEqual(beginPublishStub.callCount, 0);
        });

        it('should publish immediately if the batch is full', () => {
          const stub = sandbox.stub(queue, 'publish');

          sandbox.stub(batch, 'isFull').returns(true);
          queue.add(fakeMessage, spy);

          assert.strictEqual(stub.callCount, 1);
        });

        it('should schedule a publish if one is not pending', () => {
          const stub = sandbox.stub(queue, 'beginNextPublish');

          queue.add(fakeMessage, spy);

          assert.strictEqual(stub.callCount, 1);
        });

        it('should noop after adding if a publish is already pending', () => {
          const stub = sandbox.stub(queue, 'beginNextPublish');

          queue.pending = 1234 as unknown as NodeJS.Timer;
          queue.add(fakeMessage, spy);

          assert.strictEqual(stub.callCount, 0);
        });
      });
    });

    describe('beginNextPublish', () => {
      const maxMilliseconds = 10000;
      let clock: sinon.SinonFakeTimers;

      beforeEach(() => {
        queue.batchOptions = {maxMilliseconds};
        clock = sinon.useFakeTimers();
      });

      afterEach(() => {
        clock.restore();
      });

      it('should set a timeout that will call publish', done => {
        sandbox.stub(queue, 'publish').callsFake(done);
        queue.beginNextPublish();
        clock.tick(maxMilliseconds);
      });

      it('should factor in the time the batch has been sitting', done => {
        const halfway = maxMilliseconds / 2;
        sandbox.stub(queue, 'publish').callsFake(done);
        queue.currentBatch.created = Date.now() - halfway;
        queue.beginNextPublish();
        clock.tick(halfway);
      });

      it('should not set a timeout with a negative number', () => {
        const stub = sandbox.stub(global, 'setTimeout');

        queue.currentBatch.created = Date.now() - maxMilliseconds * 2;
        queue.beginNextPublish();

        const [, delay] = stub.lastCall.args;
        assert.strictEqual(delay, 0);
      });
    });

    describe('createBatch', () => {
      it('should create a batch with the correct options', () => {
        const batchOptions = {};
        queue.batchOptions = batchOptions;
        const batch = queue.createBatch();

        assert.ok(batch instanceof FakeMessageBatch);
        assert.strictEqual(batch.options, batchOptions);
      });
    });

    describe('handlePublishFailure', () => {
      const error = new Error('err') as ServiceError;

      it('should localize the publish error', () => {
        queue.handlePublishFailure(error);

        assert.ok(queue.error instanceof FakePublishError);
        assert.strictEqual(queue.error!.orderingKey, key);
        assert.strictEqual(queue.error!.error, error);
      });

      it('should pass the error to call pending callbacks', () => {
        const spies = [sandbox.spy(), sandbox.spy()];

        queue.currentBatch.callbacks = spies;
        queue.handlePublishFailure(error);

        assert.strictEqual(queue.batches.length, 0);

        spies.forEach(spy => {
          assert.ok(spy.calledWith(error));
        });
      });
    });

    describe('publish', () => {
      const fakeMessages = [{}, {}] as p.PubsubMessage[];
      const spies = [sandbox.spy(), sandbox.spy()] as p.PublishCallback[];

      beforeEach(() => {
        queue.currentBatch.messages = fakeMessages;
        queue.currentBatch.callbacks = spies;
      });

      it('should set inFlight to true', () => {
        queue.publish();
        assert.strictEqual(queue.inFlight, true);
      });

      it('should cancel any pending publishes', () => {
        const fakeHandle = 1234 as unknown as NodeJS.Timer;
        const stub = sandbox.stub(global, 'clearTimeout');

        queue.pending = fakeHandle;
        queue.publish();

        const [handle] = stub.lastCall.args;
        assert.strictEqual(handle, fakeHandle);
        assert.strictEqual(queue.pending, undefined);
      });

      it('should remove the oldest batch from the batch list', () => {
        const oldestBatch = queue.currentBatch;

        queue.publish();

        assert.notStrictEqual(queue.currentBatch, oldestBatch);
      });

      it('should publish the batch', () => {
        const stub = sandbox.stub(queue, '_publish');

        queue.publish();

        const [messages, callbacks] = stub.lastCall.args;
        assert.strictEqual(messages, fakeMessages);
        assert.strictEqual(callbacks, spies);
      });

      it('should set inFlight to false after publishing', () => {
        sandbox.stub(queue, '_publish').callsFake((m, c, done) => done!(null));

        queue.publish();

        assert.strictEqual(queue.inFlight, false);
      });

      it('should handle any publish failures', () => {
        const error = new Error('err') as ServiceError;
        const stub = sandbox.stub(queue, 'handlePublishFailure');

        sandbox.stub(queue, '_publish').callsFake((m, c, done) => done!(error));

        queue.publish();

        const [err] = stub.lastCall.args;
        assert.strictEqual(err, error);
      });

      it('should begin another publish if there are pending batches', () => {
        const stub = sandbox.stub(queue, 'beginNextPublish');
        sandbox.stub(queue, '_publish').callsFake((m, c, done) => done!(null));

        const secondBatch = new FakeMessageBatch();
        secondBatch.messages = fakeMessages;
        secondBatch.callbacks = spies;

        queue.batches.push(secondBatch as b.MessageBatch);
        queue.publish();

        assert.strictEqual(stub.callCount, 1);
      });

      it('should emit "drain" if there is nothing left to publish', () => {
        const spy = sandbox.spy();
        sandbox.stub(queue, '_publish').callsFake((m, c, done) => done!(null));

        queue.on('drain', spy);
        queue.publish();

        assert.strictEqual(spy.callCount, 1);
      });
    });

    describe('resumePublishing', () => {
      const error = new Error('err') as PublishError;

      beforeEach(() => {
        queue.error = error;
      });

      it('should delete the cached publish error', () => {
        queue.resumePublishing();
        assert.strictEqual(queue.error, undefined);
      });

      it('should emit the drain event if there are no more batches', done => {
        queue.on('drain', done);
        queue.resumePublishing();
      });

      it('should not emit the drain event if publishing continues', done => {
        queue.on('drain', () => done(new Error('Should not be called.')));
        queue.resumePublishing();

        assert.ok(queue.currentBatch);
        process.nextTick(() => done());
      });
    });
  });
});
