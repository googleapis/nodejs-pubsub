/**
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

import * as pfy from '@google-cloud/promisify';
import * as assert from 'assert';
import * as proxyquire from 'proxyquire';
import * as sinon from 'sinon';
import * as publishTypes from '../src/publisher';
import {RequestConfig} from '../src/pubsub';
import {Topic} from '../src/topic';
import * as util from '../src/util';

let promisified = false;
const fakePromisify = Object.assign({}, pfy, {
  promisifyAll(
      // tslint:disable-next-line variable-name
      Class: typeof publishTypes.Publisher, options: pfy.PromisifyAllOptions) {
    if (Class.name === 'Publisher') {
      assert.deepStrictEqual(
          options, {singular: true, exclude: ['setOptions']});
      promisified = true;
    }
  },
});

describe('Publisher', () => {
  const sandbox = sinon.createSandbox();

  // tslint:disable-next-line variable-name
  let Publisher: typeof publishTypes.Publisher;
  let publisher: publishTypes.Publisher;
  let batchOpts: publishTypes.BatchPublishOptions;

  const TOPIC_NAME = 'test-topic';

  const TOPIC = {
    name: TOPIC_NAME,
    Promise: {},
    request: util.noop,
  } as {} as Topic;

  before(() => {
    Publisher = proxyquire('../src/publisher.js', {
                  '@google-cloud/promisify': fakePromisify,
                }).Publisher;
  });

  beforeEach(() => {
    TOPIC.request = util.noop;
    publisher = new Publisher(TOPIC);
    batchOpts = publisher.settings.batching!;
  });

  afterEach(() => sandbox.restore());

  describe('initialization', () => {
    it('should promisify all the things', () => {
      assert(promisified);
    });

    it('should pass any options to setOptions', () => {
      const stub = sandbox.stub(Publisher.prototype, 'setOptions');

      const fakeOptions = {};
      const p = new Publisher(TOPIC, fakeOptions);

      const [options] = stub.lastCall.args;
      assert.strictEqual(options, fakeOptions);
    });

    it('should localize topic.Promise', () => {
      assert.strictEqual(publisher.Promise, TOPIC.Promise);
    });

    it('should localize the topic object', () => {
      assert.strictEqual(publisher.topic, TOPIC);
    });

    it('should create an inventory object', () => {
      assert.deepStrictEqual(publisher.inventory_, {
        callbacks: [],
        queued: [],
        bytes: 0,
      });
    });
  });

  describe('publish', () => {
    const sandbox = sinon.createSandbox();
    const DATA = Buffer.from('hello');
    const ATTRS = {a: 'a'};

    let globalSetTimeout: Function;

    before(() => {
      globalSetTimeout = global.setTimeout;
    });

    beforeEach(() => {
      publisher.publish_ = util.noop;
      // tslint:disable-next-line no-any
      (global as any).setTimeout = util.noop;
    });

    afterEach(() => sandbox.restore());

    after(() => {
      // tslint:disable-next-line no-any
      (global as any).setTimeout = globalSetTimeout;
    });

    it('should throw an error when data is not a buffer', () => {
      assert.throws(() => {
        // tslint:disable-next-line no-any
        (publisher as any).publish('hello', {}, assert.ifError);
      }, /Data must be in the form of a Buffer\./);
    });

    it('should throw when an attribute value is not a string', () => {
      const brokenAttrs = {
        key1: 'value',
        key2: true,
      };

      const expectedErrorMessage = `
    All attributes must be in the form of a string.
    \nInvalid value of type "${typeof true}" provided for "key2".
          `.trim();

      assert.throws(() => {
        // tslint:disable-next-line no-any
        (publisher as any).publish(DATA, brokenAttrs, assert.ifError);
      }, expectedErrorMessage);
    });

    it('should queue the data', done => {
      sandbox.stub(publisher, 'queue_')
          .callsFake((data, attrs, callback: Function) => {
            assert.strictEqual(data, DATA);
            assert.strictEqual(attrs, ATTRS);
            callback();  // the done fn
          });

      publisher.publish(DATA, ATTRS, done);
    });

    it('should optionally accept attributes', done => {
      sandbox.stub(publisher, 'queue_')
          .callsFake((data, attrs, callback: Function) => {
            assert.strictEqual(data, DATA);
            assert.deepStrictEqual(attrs, {});
            callback();  // the done fn
          });
      publisher.publish(DATA, done);
    });

    it('should publish if data puts payload size over cap', done => {
      let queueCalled = false;

      publisher.publish_ = () => {
        assert.strictEqual(queueCalled, false);
        publisher.inventory_.bytes = 0;
      };

      sandbox.stub(publisher, 'queue_')
          .callsFake((data, attrs, callback: Function) => {
            assert.strictEqual(publisher.inventory_.bytes, 0);
            queueCalled = true;
            callback();  // the done fn
          });

      publisher.inventory_.bytes = batchOpts.maxBytes! - 1;
      publisher.publish(DATA, done);
    });

    it('should not attempt to publish empty payload if data puts payload above size cap',
       done => {
         const pushRequests: Array<{}> = [];
         publisher.settings.batching!.maxBytes = 2;
         publisher.inventory_.bytes = 0;

         publisher.publish_ = () => {
           assert.notStrictEqual(publisher.inventory_.queued.length, 0);
           pushRequests.push(publisher.inventory_.queued);
           publisher.inventory_.callbacks.forEach((callback: Function) => {
             callback();
           });
         };

         publisher.publish(DATA, () => {
           assert.deepStrictEqual(pushRequests, [
             [
               {
                 data: DATA,
                 attributes: {},
               },
             ],
           ]);
           done();
         });
       });

    it('should publish if data puts payload at size cap', done => {
      sandbox.stub(publisher, 'queue_').callsFake(() => {
        publisher.inventory_.bytes += DATA.length;
      });

      publisher.publish_ = done;
      publisher.inventory_.bytes = batchOpts.maxBytes! - DATA.length;
      publisher.publish(DATA, util.noop);
    });

    it('should publish if data puts payload at message cap', done => {
      let queueCalled = false;

      sandbox.stub(publisher, 'queue_').callsFake(() => {
        queueCalled = true;
      });

      publisher.publish_ = () => {
        assert(queueCalled);
        done();
      };

      publisher.inventory_.queued = new Array(batchOpts.maxMessages).fill({});
      publisher.publish(DATA, util.noop);
    });

    it('should set a timeout if a publish did not occur', done => {
      const globalSetTimeout = global.setTimeout;
      const fakeTimeoutHandle = 12345;

      // tslint:disable-next-line no-any
      (global as any).setTimeout =
          // tslint:disable-next-line no-any
          (callback: (...args: any[]) => void, duration: number) => {
            assert.strictEqual(duration, batchOpts.maxMilliseconds);
            global.setTimeout = globalSetTimeout;
            setImmediate(callback);
            return fakeTimeoutHandle;
          };

      publisher.publish_ = done;
      publisher.publish(DATA, util.noop);

      assert.strictEqual(publisher.timeoutHandle_, fakeTimeoutHandle);
    });

    // it('should not set a timeout if one exists', () => {
    //   const fakeTimeoutHandle = 'not-a-real-handle';

    //   publisher.timeoutHandle_ = 'not-a-real-handle';
    //   publisher.publish(DATA, util.noop);
    //   assert.strictEqual(publisher.timeoutHandle_, fakeTimeoutHandle);
    // });
  });

  describe('setOptions', () => {
    beforeEach(() => {
      delete publisher.settings;
    });

    it('should provide default values for batching', () => {
      publisher.setOptions({});

      assert.deepStrictEqual(publisher.settings.batching, {
        maxBytes: Math.pow(1024, 2) * 5,
        maxMessages: 1000,
        maxMilliseconds: 100,
      });
    });

    it('should capture user specified options', () => {
      const options = {
        batching: {
          maxBytes: 10,
          maxMessages: 11,
          maxMilliseconds: 12,
        },
        gaxOpts: {},
      };
      const optionsCopy = Object.assign({}, options);

      publisher.setOptions(options);

      assert.deepStrictEqual(publisher.settings, options);
      assert.deepStrictEqual(options, optionsCopy);
    });

    it('should cap maxBytes', () => {
      const expected = Math.pow(1024, 2) * 9;

      publisher.setOptions({
        batching: {maxBytes: expected + 1024},
      });

      assert.strictEqual(publisher.settings.batching!.maxBytes, expected);
    });

    it('should cap maxMessages', () => {
      publisher.setOptions({
        batching: {maxMessages: 2000},
      });

      assert.strictEqual(publisher.settings.batching!.maxMessages, 1000);
    });

    it('should capture gaxOptions', () => {
      const fakeGaxOpts = {a: 'a'};

      publisher.setOptions({
        gaxOpts: fakeGaxOpts,
      } as publishTypes.PublishOptions);

      assert.deepStrictEqual(publisher.settings.gaxOpts, fakeGaxOpts);
    });
  });

  describe('publish_', () => {
    it('should cancel any publish timeouts', done => {
      publisher.timeoutHandle_ = setTimeout(done, 1);
      publisher.publish_();
      assert.strictEqual(publisher.timeoutHandle_, undefined);
      done();
    });

    it('should reset the inventory object', () => {
      publisher.inventory_.callbacks.push(util.noop);
      publisher.inventory_.queued.push({});
      publisher.inventory_.bytes = 5;

      publisher.publish_();

      assert.deepStrictEqual(publisher.inventory_.callbacks, []);
      assert.deepStrictEqual(publisher.inventory_.queued, []);
      assert.strictEqual(publisher.inventory_.bytes, 0);
    });

    it('should make the correct request', done => {
      const FAKE_MESSAGE = {};
      const FAKE_GAX_OPTS = {timeout: 10, maxRetries: 4};

      TOPIC.request = config => {
        assert.strictEqual(config.client, 'PublisherClient');
        assert.strictEqual(config.method, 'publish');
        assert.deepStrictEqual(config.reqOpts, {
          topic: TOPIC_NAME,
          messages: [FAKE_MESSAGE],
        });
        assert.strictEqual(config.gaxOpts, FAKE_GAX_OPTS);
        done();
      };

      publisher.inventory_.queued.push(FAKE_MESSAGE);
      publisher.settings.gaxOpts = FAKE_GAX_OPTS;
      publisher.publish_();
    });

    it('should pass back the err/msg id to correct callback', done => {
      const error = new Error('err');
      const FAKE_IDS = ['abc', 'def'];
      let callbackCalls = 0;

      publisher.inventory_.callbacks = [
        (err, messageId) => {
          assert.strictEqual(err, error);
          assert.strictEqual(messageId, FAKE_IDS[0]);
          callbackCalls += 1;
        },
        (err, messageId) => {
          assert.strictEqual(err, error);
          assert.strictEqual(messageId, FAKE_IDS[1]);
          callbackCalls += 1;
        },
        (err, messageId) => {
          assert.strictEqual(err, error);
          assert.strictEqual(messageId, undefined);
          assert.strictEqual(callbackCalls, 2);
          done();
        },
      ];

      TOPIC.request = (config: RequestConfig, callback: Function) => {
        callback(error, {messageIds: FAKE_IDS});
      };

      publisher.publish_();
    });
  });

  describe('queue_', () => {
    const DATA = Buffer.from('hello');
    const ATTRS = {a: 'a'};

    it('should add the data and attrs to the inventory', () => {
      publisher.queue_(DATA, ATTRS, util.noop);

      assert.deepStrictEqual(publisher.inventory_.queued, [
        {
          data: DATA,
          attributes: ATTRS,
        },
      ]);
    });

    it('should update the inventory size', () => {
      publisher.queue_(DATA, ATTRS, util.noop);

      assert.strictEqual(publisher.inventory_.bytes, DATA.length);
    });

    it('should capture the callback', () => {
      publisher.queue_(DATA, ATTRS, util.noop);

      assert.deepStrictEqual(publisher.inventory_.callbacks, [util.noop]);
    });
  });
});
