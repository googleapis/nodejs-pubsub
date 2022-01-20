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
import {describe, it, before, beforeEach, afterEach} from 'mocha';
import {grpc} from 'google-gax';
import * as proxyquire from 'proxyquire';
import * as sinon from 'sinon';
import {Duplex, PassThrough} from 'stream';
import * as uuid from 'uuid';
import * as messageTypes from '../src/message-stream';
import {Subscriber} from '../src/subscriber';
import {defaultOptions} from '../src/default-options';

const FAKE_STREAMING_PULL_TIMEOUT = 123456789;
const FAKE_CLIENT_CONFIG = {
  interfaces: {
    'google.pubsub.v1.Subscriber': {
      methods: {
        StreamingPull: {
          timeout_millis: FAKE_STREAMING_PULL_TIMEOUT,
        },
      },
    },
  },
};

interface StreamState {
  highWaterMark: number;
}

interface StreamOptions {
  objectMode?: boolean;
  highWaterMark?: number;
}

interface StreamingPullOptions {
  deadline: number;
}

class FakePassThrough extends PassThrough {
  options: StreamOptions;
  constructor(options: StreamOptions) {
    super(options);
    this.options = options;
  }
}

class FakeGrpcStream extends Duplex {
  options: StreamingPullOptions;
  _readableState!: StreamState;
  constructor(options: StreamingPullOptions) {
    super({objectMode: true});
    this.options = options;
  }
  cancel(): void {
    const status = {
      code: 1,
      details: 'Canceled.',
      metadata: new grpc.Metadata(),
    };

    process.nextTick(() => {
      this.emit('status', status);
      this.end();
    });
  }
  _write(chunk: object, encoding: string, callback: Function): void {
    callback();
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _read(size: number): void {}
}

class FakeGaxClient {
  client: FakeGrpcClient;
  subscriberStub: Promise<FakeGrpcClient>;
  constructor() {
    this.client = new FakeGrpcClient();
    this.subscriberStub = this.getSubscriberStub();
  }
  initialize() {
    return this.subscriberStub;
  }
  async getSubscriberStub(): Promise<FakeGrpcClient> {
    return this.client;
  }
}

class FakeGrpcClient {
  deadline?: number;
  streams = [] as FakeGrpcStream[];
  streamingPull(options: StreamingPullOptions): FakeGrpcStream {
    const stream = new FakeGrpcStream(options);
    this.streams.push(stream);
    return stream;
  }
  waitForReady(deadline: number, callback: (err?: Error) => void): void {
    this.deadline = deadline;
    callback();
  }
}

class FakeSubscriber {
  name: string;
  ackDeadline: number;
  maxMessages: number;
  maxBytes: number;
  client: FakeGaxClient;
  constructor(client: FakeGaxClient) {
    this.name = uuid.v4();
    this.ackDeadline = Math.floor(Math.random() * 600);
    this.maxMessages = 20;
    this.maxBytes = 4000;
    this.client = client;
  }
  async getClient(): Promise<FakeGaxClient> {
    return this.client;
  }
}

describe('MessageStream', () => {
  const sandbox = sinon.createSandbox();

  let client: FakeGrpcClient;
  let subscriber: Subscriber;

  // tslint:disable-next-line variable-name
  let MessageStream: typeof messageTypes.MessageStream;
  let messageStream: messageTypes.MessageStream;

  let now: number;

  before(() => {
    MessageStream = proxyquire('../src/message-stream.js', {
      stream: {PassThrough: FakePassThrough},
      './v1/subscriber_client_config.json': FAKE_CLIENT_CONFIG,
    }).MessageStream;
  });

  beforeEach(() => {
    now = Date.now();
    sandbox.stub(global.Date, 'now').returns(now);

    const gaxClient = new FakeGaxClient();
    client = gaxClient.client; // we hit the grpc client directly
    subscriber = new FakeSubscriber(gaxClient) as {} as Subscriber;
    messageStream = new MessageStream(subscriber);
  });

  afterEach(() => {
    messageStream.destroy();
    sandbox.restore();
  });

  describe('initialization', () => {
    it('should create an object mode stream', () => {
      const expectedOptions = {
        objectMode: true,
        highWaterMark: 0,
      };
      assert.deepStrictEqual(
        (messageStream as {} as FakePassThrough).options,
        expectedOptions
      );
    });

    it('should respect the highWaterMark option', () => {
      const highWaterMark = 3;
      const ms = new MessageStream(subscriber, {highWaterMark});

      const expectedOptions = {
        objectMode: true,
        highWaterMark,
      };

      assert.deepStrictEqual(
        (ms as {} as FakePassThrough).options,
        expectedOptions
      );
    });

    it('should set destroyed to false', () => {
      assert.strictEqual(messageStream.destroyed, false);
    });

    describe('options', () => {
      describe('defaults', () => {
        it('should default highWaterMark to 0', () => {
          client.streams.forEach(stream => {
            assert.strictEqual(stream._readableState.highWaterMark, 0);
          });
        });

        it('should default maxStreams', () => {
          assert.strictEqual(
            client.streams.length,
            defaultOptions.subscription.maxStreams
          );
        });

        it('should pull pullTimeouts default from config file', () => {
          const expectedDeadline = now + FAKE_STREAMING_PULL_TIMEOUT;

          client.streams.forEach(stream => {
            const deadline = stream.options.deadline;
            assert.strictEqual(deadline, expectedDeadline);
          });
        });

        it('should default timeout to 5 minutes', () => {
          const expectedTimeout = now + 60000 * 5;
          assert.strictEqual(client.deadline, expectedTimeout);
        });
      });

      describe('user options', () => {
        beforeEach(() => {
          messageStream.destroy();
          client.streams.length = 0;
          delete client.deadline;
        });

        it('should respect the highWaterMark option', done => {
          const highWaterMark = 3;

          messageStream = new MessageStream(subscriber, {highWaterMark});

          setImmediate(() => {
            assert.strictEqual(
              client.streams.length,
              defaultOptions.subscription.maxStreams
            );
            client.streams.forEach(stream => {
              assert.strictEqual(
                stream._readableState.highWaterMark,
                highWaterMark
              );
            });
            done();
          });
        });

        it('should respect the maxStreams option', done => {
          const maxStreams = 3;

          messageStream = new MessageStream(subscriber, {maxStreams});

          setImmediate(() => {
            assert.strictEqual(client.streams.length, maxStreams);
            done();
          });
        });

        it('should respect the timeout option', done => {
          const timeout = 12345;
          messageStream = new MessageStream(subscriber, {timeout});
          setImmediate(() => {
            assert.strictEqual(client.deadline, now + timeout);
            done();
          });
        });
      });
    });
  });

  describe('destroy', () => {
    it('should noop if already destroyed', done => {
      messageStream.on('close', done);

      messageStream.destroy();
      messageStream.destroy();
    });

    it('should set destroyed to true', () => {
      messageStream.destroy();
      assert.strictEqual(messageStream.destroyed, true);
    });

    it('should stop keeping the streams alive', () => {
      const clock = sandbox.useFakeTimers();
      const frequency = 30000;
      const stubs = client.streams.map(stream => {
        return sandbox.stub(stream, 'write').throws();
      });

      messageStream.destroy();
      clock.tick(frequency * 2); // for good measure

      stubs.forEach(stub => {
        assert.strictEqual(stub.callCount, 0);
      });
    });

    it('should unpipe and cancel all underlying streams', () => {
      const stubs = [
        ...client.streams.map(stream => {
          return sandbox.stub(stream, 'unpipe').withArgs(messageStream);
        }),
        ...client.streams.map(stream => {
          return sandbox.stub(stream, 'cancel');
        }),
      ];

      messageStream.destroy();

      stubs.forEach(stub => {
        assert.strictEqual(stub.callCount, 1);
      });
    });
  });

  describe('pull stream lifecycle', () => {
    describe('initialization', () => {
      it('should pipe to the message stream', done => {
        const fakeResponses = [{}, {}, {}, {}, {}];
        const received: object[] = [];

        messageStream
          .on('data', (chunk: Buffer) => received.push(chunk))
          .on('end', () => {
            assert.deepStrictEqual(received, fakeResponses);
            done();
          });

        client.streams.forEach((stream, i) => stream.push(fakeResponses[i]));
        setImmediate(() => messageStream.end());
      });

      it('should not end the message stream', done => {
        messageStream
          .on('data', () => {})
          .on('end', () => {
            done(new Error('Should not be called.'));
          });

        client.streams.forEach(stream => stream.push(null));
        setImmediate(done);
      });
    });

    describe('on error', () => {
      it('should destroy the stream if unable to get client', done => {
        const fakeError = new Error('err');

        sandbox.stub(subscriber, 'getClient').rejects(fakeError);

        const ms = new MessageStream(subscriber);

        ms.on('error', err => {
          assert.strictEqual(err, fakeError);
          assert.strictEqual(ms.destroyed, true);
          done();
        });
      });

      it('should destroy the stream if unable to connect to channel', done => {
        const stub = sandbox.stub(client, 'waitForReady');
        const ms = new MessageStream(subscriber);
        const fakeError = new Error('err');
        const expectedMessage = 'Failed to connect to channel. Reason: err';

        ms.on('error', (err: grpc.ServiceError) => {
          assert.strictEqual(err.code, 2);
          assert.strictEqual(err.message, expectedMessage);
          assert.strictEqual(ms.destroyed, true);
          done();
        });

        setImmediate(() => {
          const [, callback] = stub.lastCall.args;
          callback(fakeError);
        });
      });

      it('should give a deadline error if waitForReady times out', done => {
        const stub = sandbox.stub(client, 'waitForReady');
        const ms = new MessageStream(subscriber);
        const fakeError = new Error('Failed to connect before the deadline');

        ms.on('error', (err: grpc.ServiceError) => {
          assert.strictEqual(err.code, 4);
          done();
        });

        setImmediate(() => {
          const [, callback] = stub.lastCall.args;
          callback(fakeError);
        });
      });

      it('should emit non-status errors', done => {
        const fakeError = new Error('err');

        messageStream.on('error', err => {
          assert.strictEqual(err, fakeError);
          done();
        });

        client.streams[0].emit('error', fakeError);
      });

      it('should ignore status errors', done => {
        const [stream] = client.streams;
        const status = {code: 0};

        messageStream.on('error', done);
        stream.emit('error', status);
        stream.emit('status', status);

        setImmediate(done);
      });

      it('should ignore errors that come in after the status', done => {
        const [stream] = client.streams;

        messageStream.on('error', done);
        stream.emit('status', {code: 0});
        stream.emit('error', {code: 2});

        setImmediate(done);
      });
    });

    describe('on status', () => {
      it('should wait for end to fire before creating a new stream', done => {
        const [stream] = client.streams;
        const expectedCount = stream.listenerCount('end') + 1;

        messageStream.on('error', done);

        stream.emit('status', {code: 2});
        assert.strictEqual(stream.listenerCount('end'), expectedCount);

        stream.push(null);
        setImmediate(() => {
          assert.strictEqual(client.streams.length, 5);
          done();
        });
      });

      it('should create a new stream if stream already ended', done => {
        const [stream] = client.streams;

        messageStream.on('error', done);
        stream.push(null);

        setImmediate(() => {
          const count = stream.listenerCount('end');

          stream.emit('status', {code: 2});
          assert.strictEqual(stream.listenerCount('end'), count);

          setImmediate(() => {
            assert.strictEqual(client.streams.length, 5);
            done();
          });
        });
      });

      it('should destroy the msg stream if status is not retryable', done => {
        const fakeStatus = {
          code: 5,
          details: 'Err',
        };

        messageStream.on('error', (err: grpc.ServiceError) => {
          assert(err instanceof Error);
          assert.strictEqual(err.code, fakeStatus.code);
          assert.strictEqual(err.message, fakeStatus.details);
          assert.strictEqual(messageStream.destroyed, true);
          done();
        });

        client.streams.forEach(stream => {
          stream.emit('status', fakeStatus);
          stream.push(null);
        });
      });
    });

    describe('keeping streams alive', () => {
      let clock: sinon.SinonFakeTimers;

      before(() => {
        clock = sandbox.useFakeTimers();
      });

      it('should keep the streams alive', () => {
        const frequency = 30000;
        const stubs = client.streams.map(stream => {
          return sandbox.stub(stream, 'write');
        });

        clock.tick(frequency * 1.5);

        stubs.forEach(stub => {
          const [data] = stub.lastCall.args;
          assert.deepStrictEqual(data, {});
        });
      });
    });
  });
});
