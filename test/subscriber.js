/**
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

'use strict';

var assert = require('assert');
var common = require('@google-cloud/common');
var delay = require('delay');
var events = require('events');
var extend = require('extend');
var is = require('is');
var proxyquire = require('proxyquire');
var util = require('util');

var fakeUtil = extend({}, common.util);

var FAKE_FREE_MEM = 168222720;
var fakeOs = {
  freemem: function() {
    return FAKE_FREE_MEM;
  },
};

function FakeConnectionPool() {
  this.calledWith_ = [].slice.call(arguments);
  events.EventEmitter.call(this);
}

util.inherits(FakeConnectionPool, events.EventEmitter);

function FakeHistogram() {
  this.calledWith_ = [].slice.call(arguments);
}

var delayOverride = null;

function fakeDelay(timeout) {
  return (delayOverride || delay)(timeout);
}

describe('Subscriber', function() {
  var Subscriber;
  var subscriber;

  before(function() {
    Subscriber = proxyquire('../src/subscriber.js', {
      '@google-cloud/common': {
        util: fakeUtil,
      },
      delay: fakeDelay,
      os: fakeOs,
      './connection-pool.js': FakeConnectionPool,
      './histogram.js': FakeHistogram,
    });
  });

  beforeEach(function() {
    subscriber = new Subscriber();
  });

  afterEach(function() {
    extend(fakeUtil, common.util);
  });

  describe('initialization', function() {
    it('should create a histogram instance', function() {
      assert(subscriber.histogram instanceof FakeHistogram);
    });

    it('should create a latency histogram', function() {
      assert(subscriber.latency_ instanceof FakeHistogram);
    });

    it('should honor configuration settings', function() {
      var options = {
        maxConnections: 2,
        flowControl: {
          maxBytes: 5,
          maxMessages: 10,
        },
      };

      var subscriber = new Subscriber(options);

      assert.strictEqual(subscriber.maxConnections, options.maxConnections);

      assert.deepEqual(subscriber.flowControl, {
        maxBytes: options.flowControl.maxBytes,
        maxMessages: options.flowControl.maxMessages,
      });
    });

    it('should set sensible defaults', function() {
      assert.strictEqual(subscriber.ackDeadline, 10000);
      assert.strictEqual(subscriber.maxConnections, 5);
      assert.strictEqual(subscriber.userClosed_, false);
      assert.strictEqual(subscriber.messageListeners, 0);
      assert.strictEqual(subscriber.isOpen, false);

      assert.deepEqual(subscriber.flowControl, {
        maxBytes: FAKE_FREE_MEM * 0.2,
        maxMessages: 100,
      });
    });

    it('should create an inventory object', function() {
      assert(is.object(subscriber.inventory_));
      assert(is.array(subscriber.inventory_.lease));
      assert(is.array(subscriber.inventory_.ack));
      assert(is.array(subscriber.inventory_.nack));
      assert.strictEqual(subscriber.inventory_.bytes, 0);
    });

    it('should inherit from EventEmitter', function() {
      assert(subscriber instanceof events.EventEmitter);
    });

    it('should listen for events', function() {
      var called = false;
      var listenForEvents = Subscriber.prototype.listenForEvents_;

      Subscriber.prototype.listenForEvents_ = function() {
        Subscriber.prototype.listenForEvents_ = listenForEvents;
        called = true;
      };

      new Subscriber();
      assert(called);
    });
  });

  describe('ack_', function() {
    var MESSAGE = {
      ackId: 'abc',
      received: 12345,
      connectionId: 'def',
    };

    beforeEach(function() {
      subscriber.breakLease_ = fakeUtil.noop;
      subscriber.histogram.add = fakeUtil.noop;
      subscriber.acknowledge_ = function() {
        return Promise.resolve();
      };
      subscriber.setFlushTimeout_ = function() {
        return Promise.resolve();
      };
    });

    it('should add the time it took to ack to the histogram', function(done) {
      var fakeNow = 12381832;
      var now = global.Date.now;

      global.Date.now = function() {
        global.Date.now = now;
        return fakeNow;
      };

      subscriber.histogram.add = function(time) {
        assert.strictEqual(time, fakeNow - MESSAGE.received);
        done();
      };

      subscriber.ack_(MESSAGE);
    });

    it('should queue the message to be acked if no connection', function(done) {
      subscriber.setFlushTimeout_ = function() {
        assert(subscriber.inventory_.ack.indexOf(MESSAGE.ackId) > -1);
        done();
      };

      subscriber.ack_(MESSAGE);
    });

    it('should break the lease on the message', function(done) {
      subscriber.breakLease_ = function(message) {
        assert.strictEqual(message, MESSAGE);
        done();
      };

      subscriber.ack_(MESSAGE);
    });
  });

  describe('acknowledge_', function() {
    var fakeAckIds = ['a', 'b', 'c'];

    var batchSize = 3000;
    var tooManyFakeAckIds = Array(batchSize * 2.5)
      .fill('a')
      .map(function(x, i) {
        return x + i;
      });
    var expectedCalls = Math.ceil(tooManyFakeAckIds.length / batchSize);

    it('should make the correct request', function(done) {
      subscriber.makeAckModAckRequest_ = function(config) {
        assert.strictEqual(config.client, 'SubscriberClient');
        assert.strictEqual(config.method, 'acknowledge');
        assert.strictEqual(config.reqOpts.subscriber, subscriber.name);
        assert.deepEqual(config.reqOpts.ackIds, fakeAckIds);

        setImmediate(done);

        return Promise.resolve();
      };

      subscriber.on('error', done);
      subscriber.acknowledge_(fakeAckIds);
    });

    it('should batch requests if there are too many ackIds', function(done) {
      var receivedCalls = 0;

      subscriber.makeAckModAckRequest_ = function(config) {
        var offset = receivedCalls * batchSize;
        var expectedAckIds = tooManyFakeAckIds.slice(
          offset,
          offset + batchSize
        );

        assert.deepEqual(config.reqOpts.ackIds, expectedAckIds);

        receivedCalls += 1;
        if (receivedCalls === expectedCalls) {
          setImmediate(done);
        }

        return Promise.resolve();
      };

      subscriber.on('error', done);
      subscriber.acknowledge_(tooManyFakeAckIds);
    });

    it('should emit any request errors', function(done) {
      var fakeError = new Error('err');

      subscriber.makeAckModAckRequest_ = function() {
        return Promise.reject(fakeError);
      };

      subscriber.on('error', function(err) {
        assert.strictEqual(err, fakeError);
        done();
      });

      subscriber.acknowledge_(fakeAckIds);
    });
  });

  describe('breakLease_', function() {
    var MESSAGE = {
      ackId: 'abc',
      data: Buffer.from('hello'),
      length: 5,
    };

    beforeEach(function() {
      subscriber.inventory_.lease.push(MESSAGE.ackId);
      subscriber.inventory_.bytes += MESSAGE.length;
    });

    it('should remove the message from the lease array', function() {
      assert.strictEqual(subscriber.inventory_.lease.length, 1);
      assert.strictEqual(subscriber.inventory_.bytes, MESSAGE.length);

      subscriber.breakLease_(MESSAGE);

      assert.strictEqual(subscriber.inventory_.lease.length, 0);
      assert.strictEqual(subscriber.inventory_.bytes, 0);
    });

    it('should noop for unknown messages', function() {
      var message = {
        ackId: 'def',
        data: Buffer.from('world'),
        length: 5,
      };

      subscriber.breakLease_(message);

      assert.strictEqual(subscriber.inventory_.lease.length, 1);
      assert.strictEqual(subscriber.inventory_.bytes, 5);
    });

    it('should resume receiving messages if paused', function(done) {
      subscriber.connectionPool = {
        isPaused: true,
        resume: done,
      };

      subscriber.hasMaxMessages_ = function() {
        return false;
      };

      subscriber.breakLease_(MESSAGE);
    });

    it('should not resume if it is not paused', function() {
      subscriber.connectionPool = {
        isPaused: false,
        resume: function() {
          throw new Error('Should not be called.');
        },
      };

      subscriber.hasMaxMessages_ = function() {
        return false;
      };

      subscriber.breakLease_(MESSAGE);
    });

    it('should not resume if the max message limit is hit', function() {
      subscriber.connectionPool = {
        isPaused: true,
        resume: function() {
          throw new Error('Should not be called.');
        },
      };

      subscriber.hasMaxMessages_ = function() {
        return true;
      };

      subscriber.breakLease_(MESSAGE);
    });

    it('should quit auto-leasing if all leases are gone', function(done) {
      subscriber.leaseTimeoutHandle_ = setTimeout(done, 1);
      subscriber.breakLease_(MESSAGE);

      assert.strictEqual(subscriber.leaseTimeoutHandle_, null);
      setImmediate(done);
    });

    it('should continue to auto-lease if leases exist', function(done) {
      subscriber.inventory_.lease.push(MESSAGE.ackId);
      subscriber.inventory_.lease.push('abcd');

      subscriber.leaseTimeoutHandle_ = setTimeout(done, 1);
      subscriber.breakLease_(MESSAGE);
    });
  });

  describe('close', function() {
    beforeEach(function() {
      subscriber.flushQueues_ = function() {
        return Promise.resolve();
      };

      subscriber.closeConnection_ = fakeUtil.noop;
    });

    it('should set the userClosed_ flag', function() {
      subscriber.close();

      assert.strictEqual(subscriber.userClosed_, true);
    });

    it('should dump the inventory', function() {
      subscriber.inventory_ = {
        lease: [0, 1, 2],
        bytes: 123,
      };

      subscriber.close();

      assert.deepEqual(subscriber.inventory_, {
        lease: [],
        bytes: 0,
      });
    });

    it('should stop auto-leasing', function(done) {
      subscriber.leaseTimeoutHandle_ = setTimeout(done, 1);
      subscriber.close();

      assert.strictEqual(subscriber.leaseTimeoutHandle_, null);
      setImmediate(done);
    });

    it('should flush immediately', function(done) {
      subscriber.flushQueues_ = function() {
        setImmediate(done);
        return Promise.resolve();
      };

      subscriber.close();
    });

    it('should call closeConnection_', function(done) {
      subscriber.closeConnection_ = function(callback) {
        callback(); // the done fn
      };

      subscriber.close(done);
    });
  });

  describe('closeConnection_', function() {
    afterEach(function() {
      fakeUtil.noop = function() {};
    });

    it('should set isOpen to false', function() {
      subscriber.closeConnection_();
      assert.strictEqual(subscriber.isOpen, false);
    });

    describe('with connection pool', function() {
      beforeEach(function() {
        subscriber.connectionPool = {
          close: function(callback) {
            setImmediate(callback); // the done fn
          },
        };
      });

      it('should call close on the connection pool', function(done) {
        subscriber.closeConnection_(done);
        assert.strictEqual(subscriber.connectionPool, null);
      });

      it('should use a noop when callback is absent', function(done) {
        fakeUtil.noop = done;
        subscriber.closeConnection_();
        assert.strictEqual(subscriber.connectionPool, null);
      });
    });

    describe('without connection pool', function() {
      beforeEach(function() {
        subscriber.connectionPool = null;
      });

      it('should exec the callback if one is passed in', function(done) {
        subscriber.closeConnection_(done);
      });

      it('should optionally accept a callback', function() {
        subscriber.closeConnection_();
      });
    });
  });

  describe('flushQueues_', function() {
    it('should cancel any pending flushes', function() {
      var canceled = false;
      var fakeHandle = {
        cancel: function() {
          canceled = true;
        },
      };

      subscriber.flushTimeoutHandle_ = fakeHandle;
      subscriber.flushQueues_();

      assert.strictEqual(subscriber.flushTimeoutHandle_, null);
      assert.strictEqual(canceled, true);
    });

    it('should do nothing if theres nothing to ack/nack', function() {
      subscriber.acknowledge_ = subscriber.modifyAckDeadline_ = function() {
        throw new Error('Should not be called.');
      };

      return subscriber.flushQueues_();
    });

    it('should send any pending acks', function() {
      var fakeAckIds = (subscriber.inventory_.ack = ['abc', 'def']);

      subscriber.acknowledge_ = function(ackIds) {
        assert.strictEqual(ackIds, fakeAckIds);
        return Promise.resolve();
      };

      return subscriber.flushQueues_().then(function() {
        assert.strictEqual(subscriber.inventory_.ack.length, 0);
      });
    });

    it('should send any pending nacks', function() {
      var fakeAckIds = (subscriber.inventory_.nack = ['ghi', 'jkl']);

      subscriber.modifyAckDeadline_ = function(ackIds, deadline) {
        assert.strictEqual(ackIds, fakeAckIds);
        assert.strictEqual(deadline, 0);
        return Promise.resolve();
      };

      return subscriber.flushQueues_().then(function() {
        assert.strictEqual(subscriber.inventory_.nack.length, 0);
      });
    });
  });

  describe('hasMaxMessages_', function() {
    it('should return true if the number of leases >= maxMessages', function() {
      subscriber.inventory_.lease = ['a', 'b', 'c'];
      subscriber.flowControl.maxMessages = 3;

      assert(subscriber.hasMaxMessages_());
    });

    it('should return true if bytes == maxBytes', function() {
      subscriber.inventory_.bytes = 1000;
      subscriber.flowControl.maxBytes = 1000;

      assert(subscriber.hasMaxMessages_());
    });

    it('should return false if neither condition is met', function() {
      subscriber.inventory_.lease = ['a', 'b'];
      subscriber.flowControl.maxMessages = 3;

      subscriber.inventory_.bytes = 900;
      subscriber.flowControl.maxBytes = 1000;

      assert.strictEqual(subscriber.hasMaxMessages_(), false);
    });
  });

  describe('leaseMessage_', function() {
    var MESSAGE = {
      ackId: 'abc',
      connectionId: 'def',
      data: Buffer.from('hello'),
      length: 5,
    };

    beforeEach(function() {
      subscriber.setLeaseTimeout_ = fakeUtil.noop;
      subscriber.modifyAckDeadline_ = fakeUtil.noop;
    });

    it('should immediately modAck the message', function(done) {
      subscriber.modifyAckDeadline_ = function(ackId, deadline, connId) {
        assert.strictEqual(ackId, MESSAGE.ackId);
        assert.strictEqual(deadline, subscriber.ackDeadline / 1000);
        assert.strictEqual(connId, MESSAGE.connectionId);
        done();
      };

      subscriber.leaseMessage_(MESSAGE);
    });

    it('should add the ackId to the inventory', function() {
      subscriber.leaseMessage_(MESSAGE);
      assert.deepEqual(subscriber.inventory_.lease, [MESSAGE.ackId]);
    });

    it('should update the byte count', function() {
      assert.strictEqual(subscriber.inventory_.bytes, 0);
      subscriber.leaseMessage_(MESSAGE);
      assert.strictEqual(subscriber.inventory_.bytes, MESSAGE.length);
    });

    it('should begin auto-leasing', function(done) {
      subscriber.setLeaseTimeout_ = done;
      subscriber.leaseMessage_(MESSAGE);
    });

    it('should return the message', function() {
      var message = subscriber.leaseMessage_(MESSAGE);
      assert.strictEqual(message, MESSAGE);
    });
  });

  describe('listenForEvents_', function() {
    beforeEach(function() {
      subscriber.openConnection_ = fakeUtil.noop;
      subscriber.closeConnection_ = fakeUtil.noop;
    });

    describe('on new listener', function() {
      it('should increment messageListeners', function() {
        assert.strictEqual(subscriber.messageListeners, 0);
        subscriber.on('message', fakeUtil.noop);
        assert.strictEqual(subscriber.messageListeners, 1);
      });

      it('should ignore non-message events', function() {
        subscriber.on('data', fakeUtil.noop);
        assert.strictEqual(subscriber.messageListeners, 0);
      });

      it('should open a connection', function(done) {
        subscriber.openConnection_ = done;
        subscriber.on('message', fakeUtil.noop);
      });

      it('should set the userClosed_ flag to false', function() {
        subscriber.userClosed_ = true;
        subscriber.on('message', fakeUtil.noop);
        assert.strictEqual(subscriber.userClosed_, false);
      });

      it('should not open a connection when one exists', function() {
        subscriber.connectionPool = {};

        subscriber.openConnection_ = function() {
          throw new Error('Should not be called.');
        };

        subscriber.on('message', fakeUtil.noop);
      });
    });

    describe('on remove listener', function() {
      var noop = function() {};

      it('should decrement messageListeners', function() {
        subscriber.on('message', fakeUtil.noop);
        subscriber.on('message', noop);
        assert.strictEqual(subscriber.messageListeners, 2);

        subscriber.removeListener('message', noop);
        assert.strictEqual(subscriber.messageListeners, 1);
      });

      it('should ignore non-message events', function() {
        subscriber.on('message', fakeUtil.noop);
        subscriber.on('message', noop);
        assert.strictEqual(subscriber.messageListeners, 2);

        subscriber.removeListener('data', noop);
        assert.strictEqual(subscriber.messageListeners, 2);
      });

      it('should close the connection when no listeners', function(done) {
        subscriber.closeConnection_ = done;

        subscriber.on('message', noop);
        subscriber.removeListener('message', noop);
      });
    });
  });

  describe('makeAckModAckRequest_', function() {
    beforeEach(function() {
      subscriber.latency_.add = common.util.noop;
    });

    it('should promisify the request', function() {
      var fakeConfig = {};
      var fakeResponse = {};

      function fakePromisified(config) {
        assert.strictEqual(this, subscriber);
        assert.strictEqual(config, fakeConfig);
        return Promise.resolve(fakeResponse);
      }

      fakeUtil.promisify = function(fn) {
        assert.strictEqual(fn, subscriber.request);
        return fakePromisified;
      };

      return subscriber
        .makeAckModAckRequest_(fakeConfig)
        .then(response => assert.strictEqual(response, fakeResponse));
    });

    it('should capture the request latency', function() {
      var expectedDelay = 500;
      var actualDelay;

      subscriber.latency_.add = function(latency) {
        actualDelay = latency;
      };

      fakeUtil.promisify = function() {
        return {
          call: function() {
            return delay(expectedDelay);
          },
        };
      };

      return subscriber
        .makeAckModAckRequest_()
        .then(() => assert(actualDelay > 500 && actualDelay < 600));
    });
  });

  describe('modifyAckDeadline_', function() {
    var fakeAckIds = ['a', 'b', 'c'];
    var fakeDeadline = 123;

    var batchSize = 3000;
    var tooManyFakeAckIds = Array(batchSize * 2.5)
      .fill('a')
      .map(function(x, i) {
        return x + i;
      });
    var expectedCalls = Math.ceil(tooManyFakeAckIds.length / batchSize);

    beforeEach(function() {
      subscriber.isConnected_ = function() {
        return false;
      };
    });

    it('should make the correct request', function(done) {
      subscriber.makeAckModAckRequest_ = function(config) {
        assert.strictEqual(config.client, 'SubscriberClient');
        assert.strictEqual(config.method, 'modifyAckDeadline');
        assert.strictEqual(config.reqOpts.subscriber, subscriber.name);
        assert.strictEqual(config.reqOpts.ackDeadlineSeconds, fakeDeadline);
        assert.deepEqual(config.reqOpts.ackIds, fakeAckIds);

        setImmediate(done);

        return Promise.resolve();
      };

      subscriber.on('error', done);
      subscriber.modifyAckDeadline_(fakeAckIds, fakeDeadline);
    });

    it('should batch requests if there are too many ackIds', function(done) {
      var receivedCalls = 0;

      subscriber.makeAckModAckRequest_ = function(config) {
        var offset = receivedCalls * batchSize;
        var expectedAckIds = tooManyFakeAckIds.slice(
          offset,
          offset + batchSize
        );

        assert.strictEqual(config.reqOpts.ackDeadlineSeconds, fakeDeadline);
        assert.deepEqual(config.reqOpts.ackIds, expectedAckIds);

        receivedCalls += 1;
        if (receivedCalls === expectedCalls) {
          setImmediate(done);
        }

        return Promise.resolve();
      };

      subscriber.on('error', done);
      subscriber.modifyAckDeadline_(tooManyFakeAckIds, fakeDeadline);
    });

    it('should emit any request errors', function(done) {
      var fakeError = new Error('err');

      subscriber.makeAckModAckRequest_ = function() {
        return Promise.reject(fakeError);
      };

      subscriber.on('error', function(err) {
        assert.strictEqual(err, fakeError);
        done();
      });

      subscriber.modifyAckDeadline_(fakeAckIds, fakeDeadline);
    });
  });

  describe('nack_', function() {
    var MESSAGE = {
      ackId: 'abc',
      connectionId: 'def',
    };

    beforeEach(function() {
      subscriber.breakLease_ = fakeUtil.noop;
      subscriber.modifyAckDeadline_ = function() {
        return Promise.resolve();
      };
      subscriber.setFlushTimeout_ = function() {
        return Promise.resolve();
      };
    });

    it('should queue the message to be nacked if no conn', function(done) {
      subscriber.setFlushTimeout_ = function() {
        assert(subscriber.inventory_.nack.indexOf(MESSAGE.ackId) > -1);
        setImmediate(done);
        return Promise.resolve();
      };

      subscriber.nack_(MESSAGE);
    });

    it('should break the lease on the message', function(done) {
      subscriber.breakLease_ = function(message) {
        assert.strictEqual(message, MESSAGE);
        done();
      };

      subscriber.nack_(MESSAGE);
    });
  });

  describe('openConnection_', function() {
    it('should create a ConnectionPool instance', function() {
      subscriber.openConnection_();
      assert(subscriber.connectionPool instanceof FakeConnectionPool);

      var args = subscriber.connectionPool.calledWith_;
      assert.strictEqual(args[0], subscriber);
    });

    it('should emit pool errors', function(done) {
      var error = new Error('err');

      subscriber.on('error', function(err) {
        assert.strictEqual(err, error);
        done();
      });

      subscriber.openConnection_();
      subscriber.connectionPool.emit('error', error);
    });

    it('should set isOpen to true', function() {
      subscriber.openConnection_();
      assert.strictEqual(subscriber.isOpen, true);
    });

    it('should lease & emit messages from pool', function(done) {
      var message = {};
      var leasedMessage = {};

      subscriber.leaseMessage_ = function(message_) {
        assert.strictEqual(message_, message);
        return leasedMessage;
      };

      subscriber.on('message', function(message) {
        assert.strictEqual(message, leasedMessage);
        done();
      });

      subscriber.openConnection_();
      subscriber.connectionPool.emit('message', message);
    });

    it('should pause the pool if sub is at max messages', function(done) {
      var message = {nack: fakeUtil.noop};
      var leasedMessage = {};

      subscriber.leaseMessage_ = function() {
        return leasedMessage;
      };

      subscriber.hasMaxMessages_ = function() {
        return true;
      };

      subscriber.openConnection_();
      subscriber.connectionPool.isPaused = false;
      subscriber.connectionPool.pause = done;
      subscriber.connectionPool.emit('message', message);
    });

    it('should not re-pause the pool', function(done) {
      var message = {nack: fakeUtil.noop};
      var leasedMessage = {};

      subscriber.leaseMessage_ = function() {
        return leasedMessage;
      };

      subscriber.hasMaxMessages_ = function() {
        return true;
      };

      subscriber.openConnection_();
      subscriber.connectionPool.isPaused = true;

      subscriber.connectionPool.pause = function() {
        done(new Error('Should not have been called.'));
      };

      subscriber.connectionPool.emit('message', message);
      done();
    });
  });

  describe('renewLeases_', function() {
    beforeEach(function() {
      subscriber.modifyAckDeadline_ = function() {
        return Promise.resolve();
      };
    });

    var fakeDeadline = 9999;
    var fakeAckIds = ['abc', 'def'];

    beforeEach(function() {
      subscriber.inventory_.lease = fakeAckIds;
      subscriber.setLeaseTimeout_ = fakeUtil.noop;

      subscriber.histogram.percentile = function() {
        return fakeDeadline;
      };
    });

    it('should clean up the old timeout handle', function() {
      var fakeHandle = 123;
      var clearTimeoutCalled = false;
      var _clearTimeout = global.clearTimeout;

      global.clearTimeout = function(handle) {
        assert.strictEqual(handle, fakeHandle);
        clearTimeoutCalled = true;
      };

      subscriber.leaseTimeoutHandle_ = fakeHandle;
      subscriber.renewLeases_();

      assert.strictEqual(subscriber.leaseTimeoutHandle_, null);
      assert.strictEqual(clearTimeoutCalled, true);

      global.clearTimeout = _clearTimeout;
    });

    it('should update the ackDeadline', function() {
      subscriber.request = subscriber.setLeaseTimeout_ = fakeUtil.noop;

      subscriber.histogram.percentile = function(percent) {
        assert.strictEqual(percent, 99);
        return fakeDeadline;
      };

      subscriber.renewLeases_();
      assert.strictEqual(subscriber.ackDeadline, fakeDeadline);
    });

    it('should set the auto-lease timeout', function(done) {
      subscriber.request = fakeUtil.noop;
      subscriber.setLeaseTimeout_ = done;
      subscriber.renewLeases_();
    });

    it('should not renew leases if inventory is empty', function() {
      subscriber.modifyAckDeadline_ = function() {
        throw new Error('Should not have been called.');
      };

      subscriber.inventory_.lease = [];
      subscriber.renewLeases_();
    });

    it('should modAck the leased messages', function(done) {
      subscriber.modifyAckDeadline_ = function(ackIds, deadline) {
        assert.deepEqual(ackIds, fakeAckIds);
        assert.strictEqual(deadline, subscriber.ackDeadline / 1000);

        setImmediate(done);

        return Promise.resolve();
      };

      subscriber.renewLeases_();
    });

    it('should re-set the lease timeout', function(done) {
      subscriber.setLeaseTimeout_ = done;
      subscriber.renewLeases_();
    });
  });

  describe('setFlushTimeout_', function() {
    it('should set a flush timeout', function(done) {
      var flushed = false;

      subscriber.flushQueues_ = function() {
        flushed = true;
      };

      var delayPromise = delay(0);
      var fakeBoundDelay = function() {};

      delayPromise.cancel.bind = function(context) {
        assert.strictEqual(context, delayPromise);
        return fakeBoundDelay;
      };

      delayOverride = function(timeout) {
        assert.strictEqual(timeout, 100);
        return delayPromise;
      };

      var promise = subscriber.setFlushTimeout_();

      promise.then(function() {
        assert.strictEqual(subscriber.flushTimeoutHandle_, promise);
        assert.strictEqual(promise.cancel, fakeBoundDelay);
        assert.strictEqual(flushed, true);
        done();
      });
    });

    it('should swallow cancel errors', function() {
      var promise = subscriber.setFlushTimeout_();
      promise.cancel();
      return promise;
    });

    it('should return the cached timeout', function() {
      var fakeHandle = {};

      subscriber.flushTimeoutHandle_ = fakeHandle;

      var promise = subscriber.setFlushTimeout_();
      assert.strictEqual(fakeHandle, promise);
    });
  });

  describe('setLeaseTimeout_', function() {
    var fakeTimeoutHandle = 1234;
    var fakeRandom = 2;

    var globalSetTimeout;
    var globalMathRandom;

    before(function() {
      globalSetTimeout = global.setTimeout;
      globalMathRandom = global.Math.random;
    });

    beforeEach(function() {
      subscriber.isOpen = true;
      subscriber.latency_ = {
        percentile: function() {
          return 0;
        },
      };
    });

    after(function() {
      global.setTimeout = globalSetTimeout;
      global.Math.random = globalMathRandom;
    });

    it('should set a timeout to call renewLeases_', function(done) {
      var ackDeadline = (subscriber.ackDeadline = 1000);

      global.Math.random = function() {
        return fakeRandom;
      };

      global.setTimeout = function(callback, duration) {
        assert.strictEqual(duration, fakeRandom * ackDeadline * 0.9);
        setImmediate(callback); // the done fn
        return fakeTimeoutHandle;
      };

      subscriber.renewLeases_ = done;
      subscriber.setLeaseTimeout_();
      assert.strictEqual(subscriber.leaseTimeoutHandle_, fakeTimeoutHandle);
    });

    it('should subtract the estimated latency', function(done) {
      var latency = 1;

      subscriber.latency_.percentile = function(percentile) {
        assert.strictEqual(percentile, 99);
        return latency;
      };

      var ackDeadline = (subscriber.ackDeadline = 1000);

      global.Math.random = function() {
        return fakeRandom;
      };

      global.setTimeout = function(callback, duration) {
        assert.strictEqual(duration, fakeRandom * ackDeadline * 0.9 - latency);
        done();
      };

      subscriber.setLeaseTimeout_();
    });

    it('should not set a timeout if one already exists', function() {
      subscriber.renewLeases_ = function() {
        throw new Error('Should not be called.');
      };

      global.Math.random = function() {
        throw new Error('Should not be called.');
      };

      global.setTimeout = function() {
        throw new Error('Should not be called.');
      };

      subscriber.leaseTimeoutHandle_ = fakeTimeoutHandle;
      subscriber.setLeaseTimeout_();
    });

    it('should not set a timeout if the sub is closed', function() {
      subscriber.renewLeases_ = function() {
        throw new Error('Should not be called.');
      };

      global.Math.random = function() {
        throw new Error('Should not be called.');
      };

      global.setTimeout = function() {
        throw new Error('Should not be called.');
      };

      subscriber.isOpen = false;
      subscriber.setLeaseTimeout_();
    });
  });
});
