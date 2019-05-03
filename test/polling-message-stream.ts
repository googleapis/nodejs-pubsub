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
import {CancellablePromise} from 'google-gax';
import * as proxyquire from 'proxyquire';
import * as sinon from 'sinon';
import {Readable} from 'stream';

import {google} from '../proto/pubsub';
import * as pms from '../src/polling-message-stream';
import {Subscriber} from '../src/subscriber';

type PullRequest = google.pubsub.v1.IPullRequest;
type PullResponse = google.pubsub.v1.IPullResponse;

// tslint:disable-next-line no-any
function cancelify(promise: Promise<any>): CancellablePromise<[PullResponse]> {
  const p = promise as CancellablePromise<[PullResponse]>;
  p.cancel = () => {};
  return p;
}

interface StreamOptions {
  highWaterMark?: number;
  objectMode?: boolean;
}

class FakeReadable extends Readable {
  destroyed = false;
  options: StreamOptions;
  constructor(options) {
    super(options);
    this.options = options;
  }
}

class FakeClient {
  pull(request: PullRequest): CancellablePromise<[PullResponse]> {
    const promise = Promise.resolve([{}]);
    return cancelify(promise) as CancellablePromise<[PullResponse]>;
  }
}

class FakeSubscriber {
  client: FakeClient;
  constructor(client: FakeClient) {
    this.client = client;
  }
  async getClient(): Promise<FakeClient> {
    return this.client;
  }
}

describe('PollingMessageStream', () => {
  const sandbox = sinon.createSandbox();

  const OPTIONS = {batchSize: 44};

  let subscriber: Subscriber;
  let client: FakeClient;

  // tslint:disable-next-line variable-name
  let PollingMessageStream: typeof pms.PollingMessageStream;
  let stream: pms.PollingMessageStream;

  before(() => {
    PollingMessageStream = proxyquire('../src/polling-message-stream.js', {
      stream: {Readable: FakeReadable},
    }).PollingMessageStream;
  });

  beforeEach(() => {
    client = new FakeClient();
    subscriber = (new FakeSubscriber(client) as {}) as Subscriber;
    stream = new PollingMessageStream(subscriber, OPTIONS);
  });

  afterEach(() => {
    stream.destroy();
    sandbox.restore();
  });

  describe('instantiation', () => {
    it('should pass the correct options to the Readable ctor', () => {
      const {
        highWaterMark,
        objectMode,
      } = ((stream as {}) as FakeReadable).options;

      assert.strictEqual(highWaterMark, 0);
      assert.strictEqual(objectMode, true);
    });

    it('should accept a highWaterMark value', () => {
      stream = new PollingMessageStream(subscriber, {highWaterMark: 10});
      const {highWaterMark} = ((stream as {}) as FakeReadable).options;
      assert.strictEqual(highWaterMark, 10);
    });

    it('should set destroyed to false', () => {
      assert.strictEqual(stream.destroyed, false);
    });
  });

  describe('_destroy', () => {
    it('should cancel any pending requests', done => {
      const promise = cancelify(new Promise(() => {}));
      const stub = sandbox.stub(promise, 'cancel');

      sandbox.stub(client, 'pull').returns(promise);
      stream._read();

      setImmediate(() => {
        stream.destroy();
        assert.strictEqual(stub.callCount, 1);
        done();
      });
    });

    it('should call through to Readable#_destroy', () => {
      const fakeError = new Error('err');
      const fakeCallback = () => {};

      const stub = sandbox
        .stub(FakeReadable.prototype, '_destroy')
        .withArgs(fakeError, fakeCallback);

      stream._destroy(fakeError, fakeCallback);

      assert.strictEqual(stub.callCount, 1);
    });
  });

  describe('_read', () => {
    it('should make the correct pull request', done => {
      // tslint:disable-next-line no-any
      const name = ((subscriber as any).name = 'sub-name');
      const spy = sandbox.spy(client, 'pull');

      stream.on('error', done).on('data', () => {
        stream.pause();
        const {subscription, maxMessages} = spy.lastCall.args[0];
        assert.strictEqual(subscription, name);
        assert.strictEqual(maxMessages, OPTIONS.batchSize);
        done();
      });
    });

    it('should push the pull response into the stream', done => {
      const fakeResponse = {};
      const promise = Promise.resolve([fakeResponse]);

      sandbox.stub(client, 'pull').returns(cancelify(promise));

      stream.on('error', done).on('data', response => {
        stream.pause();
        assert.strictEqual(response, fakeResponse);
        done();
      });
    });

    it('should ignore retryable request failures', done => {
      const failure = Promise.reject({code: 4});
      const success = Promise.resolve([{}]);
      const stub = sandbox.stub(client, 'pull');

      stub.returns(cancelify(success));
      stub.onCall(0).returns(cancelify(failure));

      stream.on('error', done).on('data', () => {
        stream.pause();

        assert(stub.callCount > 1);
        done();
      });
    });

    it('should call destroy on non-recoverable request failures', done => {
      const fakeStatus = {code: 5};
      const promise = Promise.reject(fakeStatus);
      sandbox.stub(client, 'pull').returns(cancelify(promise));

      stream
        .on('error', err => {
          assert.strictEqual(err, fakeStatus);
          done();
        })
        .on('data', () => {
          done(new Error('Should not have recieved data.'));
        });
    });

    it('should stop making requests if the stream is full', done => {
      const spy = sandbox.spy(client, 'pull');

      stream.on('error', done);
      stream._read();

      // using setTimeout to give it a chance to make multiple requests
      setTimeout(() => {
        assert.strictEqual(spy.callCount, 1);
        done();
      }, 1000);
    });

    it('should stop making requests when destroyed', done => {
      const spy = sandbox.spy(client, 'pull');

      stream.destroy();
      stream._read();

      setImmediate(() => {
        assert.strictEqual(spy.callCount, 0);
        done();
      });
    });

    it('should noop if already reading', () => {
      const spy = sandbox.spy(subscriber, 'getClient');

      stream._read();
      stream._read();

      assert.strictEqual(spy.callCount, 1);
    });
  });
});
