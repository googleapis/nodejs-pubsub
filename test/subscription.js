/**
 * Copyright 2014 Google Inc. All Rights Reserved.
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
var extend = require('extend');
var proxyquire = require('proxyquire');

var promisified = false;
var fakeUtil = extend({}, common.util, {
  promisifyAll: function(Class, options) {
    if (Class.name !== 'Subscription') {
      return;
    }

    promisified = true;
    assert.deepEqual(options.exclude, ['snapshot']);
  },
});

function FakeIAM() {
  this.calledWith_ = [].slice.call(arguments);
}

function FakeSnapshot() {
  this.calledWith_ = [].slice.call(arguments);
}

function FakeSubscriber() {
  this.calledWith_ = [].slice.call(arguments);
}

describe('Subscription', function() {
  var Subscription;
  var subscription;

  var PROJECT_ID = 'test-project';
  var SUB_NAME = 'test-subscription';
  var SUB_FULL_NAME = 'projects/' + PROJECT_ID + '/subscriptions/' + SUB_NAME;

  var PUBSUB = {
    projectId: PROJECT_ID,
    Promise: {},
    request: fakeUtil.noop,
  };

  before(function() {
    Subscription = proxyquire('../src/subscription.js', {
      '@google-cloud/common': {
        util: fakeUtil,
      },
      './iam.js': FakeIAM,
      './snapshot.js': FakeSnapshot,
      './subscriber.js': FakeSubscriber,
    });
  });

  beforeEach(function() {
    PUBSUB.request = fakeUtil.noop = function() {};
    subscription = new Subscription(PUBSUB, SUB_NAME);
  });

  describe('initialization', function() {
    it('should promisify all the things', function() {
      assert(promisified);
    });

    it('should localize pubsub.Promise', function() {
      assert.strictEqual(subscription.Promise, PUBSUB.Promise);
    });

    it('should localize the pubsub object', function() {
      assert.strictEqual(subscription.pubsub, PUBSUB);
    });

    it('should localize the project id', function() {
      assert.strictEqual(subscription.projectId, PROJECT_ID);
    });

    it('should localize pubsub request method', function(done) {
      PUBSUB.request = function(callback) {
        callback(); // the done fn
      };

      var subscription = new Subscription(PUBSUB, SUB_NAME);
      subscription.request(done);
    });

    it('should format the sub name', function() {
      var formattedName = 'a/b/c/d';
      var formatName = Subscription.formatName_;

      Subscription.formatName_ = function(projectId, name) {
        assert.strictEqual(projectId, PROJECT_ID);
        assert.strictEqual(name, SUB_NAME);

        Subscription.formatName_ = formatName;

        return formattedName;
      };

      var subscription = new Subscription(PUBSUB, SUB_NAME);
      assert.strictEqual(subscription.name, formattedName);
    });

    it('should make a create method if a topic is found', function(done) {
      var TOPIC_NAME = 'test-topic';

      PUBSUB.createSubscription = function(topic, subName, callback) {
        assert.strictEqual(topic, TOPIC_NAME);
        assert.strictEqual(subName, SUB_NAME);
        callback(); // the done function
      };

      var subscription = new Subscription(PUBSUB, SUB_NAME, {
        topic: TOPIC_NAME,
      });

      subscription.create(done);
    });

    it('should create an IAM object', function() {
      assert(subscription.iam instanceof FakeIAM);

      var args = subscription.iam.calledWith_;

      assert.strictEqual(args[0], PUBSUB);
      assert.strictEqual(args[1], subscription.name);
    });

    it('should inherit from Subscriber', function() {
      var options = {};
      var subscription = new Subscription(PUBSUB, SUB_NAME, options);

      assert(subscription instanceof FakeSubscriber);
      assert(subscription.calledWith_[0], options);
    });
  });

  describe('formatMetadata_', function() {
    it('should make a copy of the metadata', function() {
      var metadata = {a: 'a'};
      var formatted = Subscription.formatMetadata_(metadata);

      assert.deepEqual(metadata, formatted);
      assert.notStrictEqual(metadata, formatted);
    });

    it('should format messageRetentionDuration', function() {
      var threeDaysInSeconds = 3 * 24 * 60 * 60;

      var metadata = {
        messageRetentionDuration: threeDaysInSeconds,
      };

      var formatted = Subscription.formatMetadata_(metadata);

      assert.strictEqual(formatted.retainAckedMessages, true);
      assert.strictEqual(formatted.messageRetentionDuration.nanos, 0);

      assert.strictEqual(
        formatted.messageRetentionDuration.seconds,
        threeDaysInSeconds
      );
    });

    it('should format pushEndpoint', function() {
      var pushEndpoint = 'http://noop.com/push';

      var metadata = {
        pushEndpoint: pushEndpoint,
      };

      var formatted = Subscription.formatMetadata_(metadata);

      assert.strictEqual(formatted.pushConfig.pushEndpoint, pushEndpoint);
      assert.strictEqual(formatted.pushEndpoint, undefined);
    });
  });

  describe('formatName_', function() {
    it('should format name', function() {
      var formattedName = Subscription.formatName_(PROJECT_ID, SUB_NAME);
      assert.equal(formattedName, SUB_FULL_NAME);
    });

    it('should format name when given a complete name', function() {
      var formattedName = Subscription.formatName_(PROJECT_ID, SUB_FULL_NAME);
      assert.equal(formattedName, SUB_FULL_NAME);
    });
  });

  describe('createSnapshot', function() {
    var SNAPSHOT_NAME = 'test-snapshot';

    beforeEach(function() {
      subscription.snapshot = function(name) {
        return {
          name: name,
        };
      };
    });

    it('should throw an error if a snapshot name is not found', function() {
      assert.throws(function() {
        subscription.createSnapshot();
      }, /A name is required to create a snapshot\./);
    });

    it('should make the correct request', function(done) {
      subscription.request = function(config) {
        assert.strictEqual(config.client, 'SubscriberClient');
        assert.strictEqual(config.method, 'createSnapshot');
        assert.deepEqual(config.reqOpts, {
          name: SNAPSHOT_NAME,
          subscription: subscription.name,
        });
        done();
      };

      subscription.createSnapshot(SNAPSHOT_NAME, assert.ifError);
    });

    it('should optionally accept gax options', function(done) {
      var gaxOpts = {};

      subscription.request = function(config) {
        assert.strictEqual(config.gaxOpts, gaxOpts);
        done();
      };

      subscription.createSnapshot(SNAPSHOT_NAME, gaxOpts, assert.ifError);
    });

    it('should pass back any errors to the callback', function(done) {
      var error = new Error('err');
      var apiResponse = {};

      subscription.request = function(config, callback) {
        callback(error, apiResponse);
      };

      subscription.createSnapshot(SNAPSHOT_NAME, function(err, snapshot, resp) {
        assert.strictEqual(err, error);
        assert.strictEqual(snapshot, null);
        assert.strictEqual(resp, apiResponse);
        done();
      });
    });

    it('should return a snapshot object with metadata', function(done) {
      var apiResponse = {};
      var fakeSnapshot = {};

      subscription.snapshot = function() {
        return fakeSnapshot;
      };

      subscription.request = function(config, callback) {
        callback(null, apiResponse);
      };

      subscription.createSnapshot(SNAPSHOT_NAME, function(err, snapshot, resp) {
        assert.ifError(err);
        assert.strictEqual(snapshot, fakeSnapshot);
        assert.strictEqual(snapshot.metadata, apiResponse);
        assert.strictEqual(resp, apiResponse);
        done();
      });
    });
  });

  describe('delete', function() {
    beforeEach(function() {
      subscription.removeAllListeners = fakeUtil.noop;
      subscription.close = fakeUtil.noop;
    });

    it('should make the correct request', function(done) {
      subscription.request = function(config) {
        assert.strictEqual(config.client, 'SubscriberClient');
        assert.strictEqual(config.method, 'deleteSubscription');
        assert.deepEqual(config.reqOpts, {subscription: subscription.name});
        done();
      };

      subscription.delete(assert.ifError);
    });

    it('should optionally accept gax options', function(done) {
      var gaxOpts = {};

      subscription.request = function(config) {
        assert.strictEqual(config.gaxOpts, gaxOpts);
        done();
      };

      subscription.delete(gaxOpts, assert.ifError);
    });

    describe('success', function() {
      var apiResponse = {};

      beforeEach(function() {
        subscription.request = function(config, callback) {
          callback(null, apiResponse);
        };
      });

      it('should optionally accept a callback', function(done) {
        fakeUtil.noop = function(err, resp) {
          assert.ifError(err);
          assert.strictEqual(resp, apiResponse);
          done();
        };

        subscription.delete();
      });

      it('should return the api response', function(done) {
        subscription.delete(function(err, resp) {
          assert.ifError(err);
          assert.strictEqual(resp, apiResponse);
          done();
        });
      });

      it('should remove all message listeners', function(done) {
        var called = false;

        subscription.removeAllListeners = function() {
          called = true;
        };

        subscription.delete(function(err) {
          assert.ifError(err);
          assert(called);
          done();
        });
      });

      it('should close the subscription', function(done) {
        var called = false;

        subscription.close = function() {
          called = true;
        };

        subscription.delete(function(err) {
          assert.ifError(err);
          assert(called);
          done();
        });
      });
    });

    describe('error', function() {
      var error = new Error('err');

      beforeEach(function() {
        subscription.request = function(config, callback) {
          callback(error);
        };
      });

      it('should return the error to the callback', function(done) {
        subscription.delete(function(err) {
          assert.strictEqual(err, error);
          done();
        });
      });

      it('should not remove all the listeners', function(done) {
        subscription.removeAllListeners = function() {
          done(new Error('Should not be called.'));
        };

        subscription.delete(function() {
          done();
        });
      });

      it('should not close the subscription', function(done) {
        subscription.close = function() {
          done(new Error('Should not be called.'));
        };

        subscription.delete(function() {
          done();
        });
      });
    });
  });

  describe('exists', function() {
    it('should return true if it finds metadata', function(done) {
      subscription.getMetadata = function(callback) {
        callback(null, {});
      };

      subscription.exists(function(err, exists) {
        assert.ifError(err);
        assert(exists);
        done();
      });
    });

    it('should return false if a not found error occurs', function(done) {
      subscription.getMetadata = function(callback) {
        callback({code: 5});
      };

      subscription.exists(function(err, exists) {
        assert.ifError(err);
        assert.strictEqual(exists, false);
        done();
      });
    });

    it('should pass back any other type of error', function(done) {
      var error = {code: 4};

      subscription.getMetadata = function(callback) {
        callback(error);
      };

      subscription.exists(function(err, exists) {
        assert.strictEqual(err, error);
        assert.strictEqual(exists, undefined);
        done();
      });
    });
  });

  describe('get', function() {
    beforeEach(function() {
      subscription.create = fakeUtil.noop;
    });

    it('should delete the autoCreate option', function(done) {
      var options = {
        autoCreate: true,
        a: 'a',
      };

      subscription.getMetadata = function(gaxOpts) {
        assert.strictEqual(gaxOpts, options);
        assert.strictEqual(gaxOpts.autoCreate, undefined);
        done();
      };

      subscription.get(options, assert.ifError);
    });

    describe('success', function() {
      var fakeMetadata = {};

      beforeEach(function() {
        subscription.getMetadata = function(gaxOpts, callback) {
          callback(null, fakeMetadata);
        };
      });

      it('should call through to getMetadata', function(done) {
        subscription.get(function(err, sub, resp) {
          assert.ifError(err);
          assert.strictEqual(sub, subscription);
          assert.strictEqual(resp, fakeMetadata);
          done();
        });
      });

      it('should optionally accept options', function(done) {
        var options = {};

        subscription.getMetadata = function(gaxOpts, callback) {
          assert.strictEqual(gaxOpts, options);
          callback(); // the done fn
        };

        subscription.get(options, done);
      });
    });

    describe('error', function() {
      it('should pass back errors when not auto-creating', function(done) {
        var error = {code: 4};
        var apiResponse = {};

        subscription.getMetadata = function(gaxOpts, callback) {
          callback(error, apiResponse);
        };

        subscription.get(function(err, sub, resp) {
          assert.strictEqual(err, error);
          assert.strictEqual(sub, null);
          assert.strictEqual(resp, apiResponse);
          done();
        });
      });

      it('should pass back 404 errors if autoCreate is false', function(done) {
        var error = {code: 5};
        var apiResponse = {};

        subscription.getMetadata = function(gaxOpts, callback) {
          callback(error, apiResponse);
        };

        subscription.get(function(err, sub, resp) {
          assert.strictEqual(err, error);
          assert.strictEqual(sub, null);
          assert.strictEqual(resp, apiResponse);
          done();
        });
      });

      it('should pass back 404 errors if create doesnt exist', function(done) {
        var error = {code: 5};
        var apiResponse = {};

        subscription.getMetadata = function(gaxOpts, callback) {
          callback(error, apiResponse);
        };

        delete subscription.create;

        subscription.get(function(err, sub, resp) {
          assert.strictEqual(err, error);
          assert.strictEqual(sub, null);
          assert.strictEqual(resp, apiResponse);
          done();
        });
      });

      it('should create the sub if 404 + autoCreate is true', function(done) {
        var error = {code: 5};
        var apiResponse = {};

        var fakeOptions = {
          autoCreate: true,
        };

        subscription.getMetadata = function(gaxOpts, callback) {
          callback(error, apiResponse);
        };

        subscription.create = function(options, callback) {
          assert.strictEqual(options, fakeOptions);
          callback(); // the done fn
        };

        subscription.get(fakeOptions, done);
      });
    });
  });

  describe('getMetadata', function() {
    it('should make the correct request', function(done) {
      subscription.request = function(config) {
        assert.strictEqual(config.client, 'SubscriberClient');
        assert.strictEqual(config.method, 'getSubscription');
        assert.deepEqual(config.reqOpts, {subscription: subscription.name});
        done();
      };

      subscription.getMetadata(assert.ifError);
    });

    it('should optionally accept gax options', function(done) {
      var gaxOpts = {};

      subscription.request = function(config) {
        assert.strictEqual(config.gaxOpts, gaxOpts);
        done();
      };

      subscription.getMetadata(gaxOpts, assert.ifError);
    });

    it('should pass back any errors that occur', function(done) {
      var error = new Error('err');
      var apiResponse = {};

      subscription.request = function(config, callback) {
        callback(error, apiResponse);
      };

      subscription.getMetadata(function(err, metadata) {
        assert.strictEqual(err, error);
        assert.strictEqual(metadata, apiResponse);
        done();
      });
    });

    it('should set the metadata if no error occurs', function(done) {
      var apiResponse = {};

      subscription.request = function(config, callback) {
        callback(null, apiResponse);
      };

      subscription.getMetadata(function(err, metadata) {
        assert.ifError(err);
        assert.strictEqual(metadata, apiResponse);
        assert.strictEqual(subscription.metadata, apiResponse);
        done();
      });
    });
  });

  describe('modifyPushConfig', function() {
    var fakeConfig = {};

    it('should make the correct request', function(done) {
      subscription.request = function(config, callback) {
        assert.strictEqual(config.client, 'SubscriberClient');
        assert.strictEqual(config.method, 'modifyPushConfig');
        assert.deepEqual(config.reqOpts, {
          subscription: subscription.name,
          pushConfig: fakeConfig,
        });
        callback(); // the done fn
      };

      subscription.modifyPushConfig(fakeConfig, done);
    });

    it('should optionally accept gaxOpts', function(done) {
      var gaxOpts = {};

      subscription.request = function(config, callback) {
        assert.strictEqual(config.gaxOpts, gaxOpts);
        callback(); // the done fn
      };

      subscription.modifyPushConfig(fakeConfig, gaxOpts, done);
    });
  });

  describe('seek', function() {
    var FAKE_SNAPSHOT_NAME = 'a';
    var FAKE_FULL_SNAPSHOT_NAME = 'a/b/c/d';

    beforeEach(function() {
      FakeSnapshot.formatName_ = function() {
        return FAKE_FULL_SNAPSHOT_NAME;
      };
    });

    it('should throw if a name or date is not provided', function() {
      assert.throws(function() {
        subscription.seek();
      }, /Either a snapshot name or Date is needed to seek to\./);
    });

    it('should make the correct api request', function(done) {
      FakeSnapshot.formatName_ = function(projectId, name) {
        assert.strictEqual(projectId, PROJECT_ID);
        assert.strictEqual(name, FAKE_SNAPSHOT_NAME);
        return FAKE_FULL_SNAPSHOT_NAME;
      };

      subscription.request = function(config, callback) {
        assert.strictEqual(config.client, 'SubscriberClient');
        assert.strictEqual(config.method, 'seek');
        assert.deepEqual(config.reqOpts, {
          subscription: subscription.name,
          snapshot: FAKE_FULL_SNAPSHOT_NAME,
        });
        callback(); // the done fn
      };

      subscription.seek(FAKE_SNAPSHOT_NAME, done);
    });

    it('should optionally accept a Date object', function(done) {
      var date = new Date();

      subscription.request = function(config, callback) {
        assert.strictEqual(config.reqOpts.time, date);
        callback(); // the done fn
      };

      subscription.seek(date, done);
    });

    it('should optionally accept gax options', function(done) {
      var gaxOpts = {};

      subscription.request = function(config, callback) {
        assert.strictEqual(config.gaxOpts, gaxOpts);
        callback(); // the done fn
      };

      subscription.seek(FAKE_SNAPSHOT_NAME, gaxOpts, done);
    });
  });

  describe('setMetadata', function() {
    var METADATA = {
      pushEndpoint: 'http://noop.com/push',
    };

    beforeEach(function() {
      Subscription.formatMetadata_ = function(metadata) {
        return extend({}, metadata);
      };
    });

    it('should make the correct request', function(done) {
      var formattedMetadata = {
        pushConfig: {
          pushEndpoint: METADATA.pushEndpoint,
        },
      };

      var expectedBody = extend(
        {
          name: SUB_FULL_NAME,
        },
        formattedMetadata
      );

      Subscription.formatMetadata_ = function(metadata) {
        assert.strictEqual(metadata, METADATA);
        return formattedMetadata;
      };

      subscription.request = function(config, callback) {
        assert.strictEqual(config.client, 'SubscriberClient');
        assert.strictEqual(config.method, 'updateSubscription');
        assert.deepEqual(config.reqOpts.subscription, expectedBody);
        assert.deepEqual(config.reqOpts.updateMask, {paths: ['push_config']});
        callback(); // the done fn
      };

      subscription.setMetadata(METADATA, done);
    });

    it('should optionally accept gax options', function(done) {
      var gaxOpts = {};

      subscription.request = function(config, callback) {
        assert.strictEqual(config.gaxOpts, gaxOpts);
        callback(); // the done fn
      };

      subscription.setMetadata(METADATA, gaxOpts, done);
    });
  });

  describe('snapshot', function() {
    var SNAPSHOT_NAME = 'a';

    it('should call through to pubsub.snapshot', function(done) {
      PUBSUB.snapshot = function(name) {
        assert.strictEqual(this, subscription);
        assert.strictEqual(name, SNAPSHOT_NAME);
        done();
      };

      subscription.snapshot(SNAPSHOT_NAME);
    });
  });
});
