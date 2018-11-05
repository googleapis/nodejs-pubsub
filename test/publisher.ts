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

'use strict';

import * as assert from 'assert';
import * as util from '../src/util';
const pfy = require('@google-cloud/promisify');
import * as extend from 'extend';
const proxyquire = require('proxyquire');

let promisified = false;
const fakePromisify = extend({}, pfy, {
  promisifyAll: function(Class, options) {
    if (Class.name === 'Publisher') {
      assert.deepStrictEqual(options, {singular: true});
      promisified = true;
    }
  },
});

describe('Publisher', function() {
  let Publisher;
  let publisher;
  let batchOpts;

  const TOPIC_NAME = 'test-topic';
  const TOPIC: any = {
    name: TOPIC_NAME,
    Promise: {},
    request: util.noop,
  };

  before(function() {
    Publisher = proxyquire('../src/publisher.js', {
      '@google-cloud/promisify': fakePromisify,
    });
  });

  beforeEach(function() {
    TOPIC.request = util.noop;
    publisher = new Publisher(TOPIC);
    batchOpts = publisher.settings.batching;
  });

  describe('initialization', function() {
    it('should promisify all the things', function() {
      assert(promisified);
    });

    it('should localize topic.Promise', function() {
      assert.strictEqual(publisher.Promise, TOPIC.Promise);
    });

    it('should localize the topic object', function() {
      assert.strictEqual(publisher.topic, TOPIC);
    });

    it('should create an inventory object', function() {
      assert.deepStrictEqual(publisher.inventory_, {
        callbacks: [],
        queued: [],
        bytes: 0,
      });
    });

    describe('options', function() {
      it('should provide default values for batching', function() {
        assert.deepStrictEqual(publisher.settings.batching, {
          maxBytes: Math.pow(1024, 2) * 5,
          maxMessages: 1000,
          maxMilliseconds: 100,
        });
      });

      it('should capture user specified options', function() {
        const options = {
          maxBytes: 10,
          maxMessages: 11,
          maxMilliseconds: 12,
        };
        const optionsCopy = extend({}, options);

        const publisher = new Publisher(TOPIC, {
          batching: options,
        });

        assert.deepStrictEqual(publisher.settings.batching, options);
        assert.deepStrictEqual(options, optionsCopy);
      });

      it('should cap maxBytes', function() {
        const expected = Math.pow(1024, 2) * 9;

        const publisher = new Publisher(TOPIC, {
          batching: {maxBytes: expected + 1024},
        });

        assert.strictEqual(publisher.settings.batching.maxBytes, expected);
      });

      it('should cap maxMessages', function() {
        const publisher = new Publisher(TOPIC, {
          batching: {maxMessages: 2000},
        });

        assert.strictEqual(publisher.settings.batching.maxMessages, 1000);
      });

      it('should capture gaxOptions', function() {
        const fakeGaxOpts = {a: 'a'};
        const publisher = new Publisher(TOPIC, {
          gaxOpts: fakeGaxOpts,
        });

        assert.deepStrictEqual(publisher.settings.gaxOpts, fakeGaxOpts);
      });
    });
  });

  describe('publish', function() {
    const DATA = Buffer.from('hello');
    const ATTRS = {a: 'a'};

    let globalSetTimeout;

    before(function() {
      globalSetTimeout = global.setTimeout;
    });

    beforeEach(function() {
      publisher.publish_ = util.noop;
      (global as any).setTimeout = util.noop;
    });

    after(function() {
      global.setTimeout = globalSetTimeout;
    });

    it('should throw an error when data is not a buffer', function() {
      assert.throws(function() {
        publisher.publish('hello', {}, assert.ifError);
      }, /Data must be in the form of a Buffer\./);
    });

    it('should throw when an attribute value is not a string', function() {
      const brokenAttrs = {
        key1: 'value',
        key2: true,
      };

      const expectedErrorMessage = `
All attributes must be in the form of a string.
\nInvalid value of type "${typeof true}" provided for "key2".
      `.trim();

      assert.throws(function() {
        publisher.publish(DATA, brokenAttrs, assert.ifError);
      }, new RegExp(expectedErrorMessage));
    });

    it('should queue the data', function(done) {
      publisher.queue_ = function(data, attrs, callback) {
        assert.strictEqual(data, DATA);
        assert.strictEqual(attrs, ATTRS);
        callback(); // the done fn
      };

      publisher.publish(DATA, ATTRS, done);
    });

    it('should optionally accept attributes', function(done) {
      publisher.queue_ = function(data, attrs, callback) {
        assert.strictEqual(data, DATA);
        assert.deepStrictEqual(attrs, {});
        callback(); // the done fn
      };

      publisher.publish(DATA, done);
    });

    it('should publish if data puts payload size over cap', function(done) {
      let queueCalled = false;

      publisher.publish_ = function() {
        assert.strictEqual(queueCalled, false);
        publisher.inventory_.bytes = 0;
      };

      publisher.queue_ = function(data, attrs, callback) {
        assert.strictEqual(publisher.inventory_.bytes, 0);
        queueCalled = true;
        callback(); // the done fn
      };

      publisher.inventory_.bytes = batchOpts.maxBytes - 1;
      publisher.publish(DATA, done);
    });

    it('should not attempt to publish empty payload if data puts payload above size cap', function(done) {
      const pushRequests: {}[] = [];
      publisher.settings.batching.maxBytes = 2;
      publisher.inventory_.bytes = 0;

      publisher.publish_ = function() {
        assert.notStrictEqual(publisher.inventory_.queued.length, 0);
        pushRequests.push(publisher.inventory_.queued);
        publisher.inventory_.callbacks.forEach(function(callback) {
          callback();
        });
      };

      publisher.publish(DATA, function() {
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

    it('should publish if data puts payload at size cap', function(done) {
      publisher.queue_ = function() {
        publisher.inventory_.bytes += DATA.length;
      };

      publisher.publish_ = done;
      publisher.inventory_.bytes = batchOpts.maxBytes - DATA.length;
      publisher.publish(DATA, util.noop);
    });

    it('should publish if data puts payload at message cap', function(done) {
      let queueCalled = false;

      publisher.queue_ = function() {
        queueCalled = true;
      };

      publisher.publish_ = function() {
        assert(queueCalled);
        done();
      };

      publisher.inventory_.queued = Array(batchOpts.maxMessages).fill({});
      publisher.publish(DATA, util.noop);
    });

    it('should set a timeout if a publish did not occur', function(done) {
      const globalSetTimeout = global.setTimeout;
      const fakeTimeoutHandle = 12345;

      (global as any).setTimeout = function(callback, duration) {
        assert.strictEqual(duration, batchOpts.maxMilliseconds);
        global.setTimeout = globalSetTimeout;
        setImmediate(callback);
        return fakeTimeoutHandle;
      };

      publisher.publish_ = done;
      publisher.publish(DATA, util.noop);

      assert.strictEqual(publisher.timeoutHandle_, fakeTimeoutHandle);
    });

    it('should not set a timeout if one exists', function() {
      const fakeTimeoutHandle = 'not-a-real-handle';

      publisher.timeoutHandle_ = 'not-a-real-handle';
      publisher.publish(DATA, util.noop);
      assert.strictEqual(publisher.timeoutHandle_, fakeTimeoutHandle);
    });
  });

  describe('publish_', function() {
    it('should cancel any publish timeouts', function(done) {
      publisher.timeoutHandle_ = setTimeout(done, 1);
      publisher.publish_();
      assert.strictEqual(publisher.timeoutHandle_, null);
      done();
    });

    it('should reset the inventory object', function() {
      publisher.inventory_.callbacks.push(util.noop);
      publisher.inventory_.queued.push({});
      publisher.inventory_.bytes = 5;

      publisher.publish_();

      assert.deepStrictEqual(publisher.inventory_.callbacks, []);
      assert.deepStrictEqual(publisher.inventory_.queued, []);
      assert.strictEqual(publisher.inventory_.bytes, 0);
    });

    it('should make the correct request', function(done) {
      const FAKE_MESSAGE = {};
      const FAKE_GAX_OPTS = {a: 'b'};

      TOPIC.request = function(config) {
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

    it('should pass back the err/msg id to correct callback', function(done) {
      const error = new Error('err');
      const FAKE_IDS = ['abc', 'def'];
      let callbackCalls = 0;

      publisher.inventory_.callbacks = [
        function(err, messageId) {
          assert.strictEqual(err, error);
          assert.strictEqual(messageId, FAKE_IDS[0]);
          callbackCalls += 1;
        },
        function(err, messageId) {
          assert.strictEqual(err, error);
          assert.strictEqual(messageId, FAKE_IDS[1]);
          callbackCalls += 1;
        },
        function(err, messageId) {
          assert.strictEqual(err, error);
          assert.strictEqual(messageId, undefined);
          assert.strictEqual(callbackCalls, 2);
          done();
        },
      ];

      TOPIC.request = function(config, callback) {
        callback(error, {messageIds: FAKE_IDS});
      };

      publisher.publish_();
    });
  });

  describe('queue_', function() {
    const DATA = Buffer.from('hello');
    const ATTRS = {a: 'a'};

    it('should add the data and attrs to the inventory', function() {
      publisher.queue_(DATA, ATTRS, util.noop);

      assert.deepStrictEqual(publisher.inventory_.queued, [
        {
          data: DATA,
          attributes: ATTRS,
        },
      ]);
    });

    it('should update the inventory size', function() {
      publisher.queue_(DATA, ATTRS, util.noop);

      assert.strictEqual(publisher.inventory_.bytes, DATA.length);
    });

    it('should capture the callback', function() {
      publisher.queue_(DATA, ATTRS, util.noop);

      assert.deepStrictEqual(publisher.inventory_.callbacks, [util.noop]);
    });
  });
});
