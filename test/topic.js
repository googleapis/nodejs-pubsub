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
var extend = require('extend');
var proxyquire = require('proxyquire');
var {util} = require('@google-cloud/common');
const pfy = require('@google-cloud/promisify');

var promisified = false;
var fakePromisify = extend({}, pfy, {
  promisifyAll: function(Class, options) {
    if (Class.name !== 'Topic') {
      return;
    }
    promisified = true;
    assert.deepStrictEqual(options.exclude, ['publisher', 'subscription']);
  },
});

function FakeIAM() {
  this.calledWith_ = [].slice.call(arguments);
}

function FakePublisher() {
  this.calledWith_ = [].slice.call(arguments);
}

var extended = false;
var fakePaginator = {
  extend: function(Class, methods) {
    if (Class.name !== 'Topic') {
      return;
    }

    assert.deepStrictEqual(methods, ['getSubscriptions']);
    extended = true;
  },
  streamify: function(methodName) {
    return methodName;
  },
};

describe('Topic', function() {
  var Topic;
  var topic;

  var PROJECT_ID = 'test-project';
  var TOPIC_NAME = 'projects/' + PROJECT_ID + '/topics/test-topic';
  var TOPIC_UNFORMATTED_NAME = TOPIC_NAME.split('/').pop();

  var PUBSUB = {
    Promise: {},
    projectId: PROJECT_ID,
    createTopic: util.noop,
    request: util.noop,
  };

  before(function() {
    Topic = proxyquire('../src/topic.js', {
      '@google-cloud/promisify': fakePromisify,
      '@google-cloud/paginator': {
        paginator: fakePaginator,
      },
      './iam.js': FakeIAM,
      './publisher.js': FakePublisher,
    });
  });

  beforeEach(function() {
    topic = new Topic(PUBSUB, TOPIC_NAME);
    topic.parent = PUBSUB;
  });

  describe('initialization', function() {
    it('should extend the correct methods', function() {
      assert(extended); // See `fakePaginator.extend`
    });

    it('should streamify the correct methods', function() {
      assert.strictEqual(topic.getSubscriptionsStream, 'getSubscriptions');
    });

    it('should promisify all the things', function() {
      assert(promisified);
    });

    it('should localize pubsub.Promise', function() {
      assert.strictEqual(topic.Promise, PUBSUB.Promise);
    });

    it('should format the name', function() {
      var formattedName = 'a/b/c/d';

      var formatName_ = Topic.formatName_;
      Topic.formatName_ = function(projectId, name) {
        assert.strictEqual(projectId, PROJECT_ID);
        assert.strictEqual(name, TOPIC_NAME);

        Topic.formatName_ = formatName_;

        return formattedName;
      };

      var topic = new Topic(PUBSUB, TOPIC_NAME);
      assert.strictEqual(topic.name, formattedName);
    });

    it('should localize the parent object', function() {
      assert.strictEqual(topic.parent, PUBSUB);
      assert.strictEqual(topic.pubsub, PUBSUB);
    });

    it('should localize the request function', function(done) {
      PUBSUB.request = function(callback) {
        callback(); // the done fn
      };

      var topic = new Topic(PUBSUB, TOPIC_NAME);
      topic.request(done);
    });

    it('should create an iam object', function() {
      assert.deepStrictEqual(topic.iam.calledWith_, [PUBSUB, TOPIC_NAME]);
    });
  });

  describe('formatName_', function() {
    it('should format name', function() {
      var formattedName = Topic.formatName_(PROJECT_ID, TOPIC_UNFORMATTED_NAME);
      assert.strictEqual(formattedName, TOPIC_NAME);
    });

    it('should format name when given a complete name', function() {
      var formattedName = Topic.formatName_(PROJECT_ID, TOPIC_NAME);
      assert.strictEqual(formattedName, TOPIC_NAME);
    });
  });

  describe('create', function() {
    it('should call the parent createTopic method', function(done) {
      var options_ = {};

      PUBSUB.createTopic = function(name, options, callback) {
        assert.strictEqual(name, topic.name);
        assert.strictEqual(options, options_);
        callback(); // the done fn
      };

      topic.create(options_, done);
    });
  });

  describe('createSubscription', function() {
    it('should call the parent createSubscription method', function(done) {
      var NAME = 'sub-name';
      var OPTIONS = {a: 'a'};

      PUBSUB.createSubscription = function(topic_, name, options, callback) {
        assert.strictEqual(topic_, topic);
        assert.strictEqual(name, NAME);
        assert.strictEqual(options, OPTIONS);
        callback(); // the done fn
      };

      topic.createSubscription(NAME, OPTIONS, done);
    });
  });

  describe('delete', function() {
    it('should make the proper request', function(done) {
      topic.request = function(config, callback) {
        assert.strictEqual(config.client, 'PublisherClient');
        assert.strictEqual(config.method, 'deleteTopic');
        assert.deepStrictEqual(config.reqOpts, {topic: topic.name});
        callback(); // the done fn
      };

      topic.delete(done);
    });

    it('should optionally accept gax options', function(done) {
      var options = {};

      topic.request = function(config, callback) {
        assert.strictEqual(config.gaxOpts, options);
        callback(); // the done fn
      };

      topic.delete(options, done);
    });

    it('should optionally accept a callback', function(done) {
      util.noop = done;

      topic.request = function(config, callback) {
        callback(); // the done fn
      };

      topic.delete();
    });
  });

  describe('get', function() {
    it('should delete the autoCreate option', function(done) {
      var options = {
        autoCreate: true,
        a: 'a',
      };

      topic.getMetadata = function(gaxOpts) {
        assert.strictEqual(gaxOpts, options);
        assert.strictEqual(gaxOpts.autoCreate, undefined);
        done();
      };

      topic.get(options, assert.ifError);
    });

    describe('success', function() {
      var fakeMetadata = {};

      beforeEach(function() {
        topic.getMetadata = function(gaxOpts, callback) {
          callback(null, fakeMetadata);
        };
      });

      it('should call through to getMetadata', function(done) {
        topic.get(function(err, _topic, resp) {
          assert.ifError(err);
          assert.strictEqual(_topic, topic);
          assert.strictEqual(resp, fakeMetadata);
          done();
        });
      });

      it('should optionally accept options', function(done) {
        var options = {};

        topic.getMetadata = function(gaxOpts, callback) {
          assert.strictEqual(gaxOpts, options);
          callback(); // the done fn
        };

        topic.get(options, done);
      });
    });

    describe('error', function() {
      it('should pass back errors when not auto-creating', function(done) {
        var error = {code: 4};
        var apiResponse = {};

        topic.getMetadata = function(gaxOpts, callback) {
          callback(error, apiResponse);
        };

        topic.get(function(err, _topic, resp) {
          assert.strictEqual(err, error);
          assert.strictEqual(_topic, null);
          assert.strictEqual(resp, apiResponse);
          done();
        });
      });

      it('should pass back 404 errors if autoCreate is false', function(done) {
        var error = {code: 5};
        var apiResponse = {};

        topic.getMetadata = function(gaxOpts, callback) {
          callback(error, apiResponse);
        };

        topic.get(function(err, _topic, resp) {
          assert.strictEqual(err, error);
          assert.strictEqual(_topic, null);
          assert.strictEqual(resp, apiResponse);
          done();
        });
      });

      it('should create the topic if 404 + autoCreate is true', function(done) {
        var error = {code: 5};
        var apiResponse = {};

        var fakeOptions = {
          autoCreate: true,
        };

        topic.getMetadata = function(gaxOpts, callback) {
          callback(error, apiResponse);
        };

        topic.create = function(options, callback) {
          assert.strictEqual(options, fakeOptions);
          callback(); // the done fn
        };

        topic.get(fakeOptions, done);
      });
    });
  });

  describe('exists', function() {
    it('should return true if it finds metadata', function(done) {
      topic.getMetadata = function(callback) {
        callback(null, {});
      };

      topic.exists(function(err, exists) {
        assert.ifError(err);
        assert(exists);
        done();
      });
    });

    it('should return false if a not found error occurs', function(done) {
      topic.getMetadata = function(callback) {
        callback({code: 5});
      };

      topic.exists(function(err, exists) {
        assert.ifError(err);
        assert.strictEqual(exists, false);
        done();
      });
    });

    it('should pass back any other type of error', function(done) {
      var error = {code: 4};

      topic.getMetadata = function(callback) {
        callback(error);
      };

      topic.exists(function(err, exists) {
        assert.strictEqual(err, error);
        assert.strictEqual(exists, undefined);
        done();
      });
    });
  });

  describe('getMetadata', function() {
    it('should make the proper request', function(done) {
      topic.request = function(config) {
        assert.strictEqual(config.client, 'PublisherClient');
        assert.strictEqual(config.method, 'getTopic');
        assert.deepStrictEqual(config.reqOpts, {topic: topic.name});
        done();
      };

      topic.getMetadata(assert.ifError);
    });

    it('should optionally accept gax options', function(done) {
      var options = {};

      topic.request = function(config) {
        assert.strictEqual(config.gaxOpts, options);
        done();
      };

      topic.getMetadata(options, assert.ifError);
    });

    it('should pass back any errors that occur', function(done) {
      var error = new Error('err');
      var apiResponse = {};

      topic.request = function(config, callback) {
        callback(error, apiResponse);
      };

      topic.getMetadata(function(err, metadata) {
        assert.strictEqual(err, error);
        assert.strictEqual(metadata, apiResponse);
        done();
      });
    });

    it('should set the metadata if no error occurs', function(done) {
      var apiResponse = {};

      topic.request = function(config, callback) {
        callback(null, apiResponse);
      };

      topic.getMetadata(function(err, metadata) {
        assert.ifError(err);
        assert.strictEqual(metadata, apiResponse);
        assert.strictEqual(topic.metadata, apiResponse);
        done();
      });
    });
  });

  describe('getSubscriptions', function() {
    it('should make the correct request', function(done) {
      var options = {
        a: 'a',
        b: 'b',
        gaxOpts: {
          e: 'f',
        },
        autoPaginate: false,
      };

      var expectedOptions = extend(
        {
          topic: topic.name,
        },
        options
      );

      var expectedGaxOpts = extend(
        {
          autoPaginate: options.autoPaginate,
        },
        options.gaxOpts
      );

      delete expectedOptions.gaxOpts;
      delete expectedOptions.autoPaginate;

      topic.request = function(config) {
        assert.strictEqual(config.client, 'PublisherClient');
        assert.strictEqual(config.method, 'listTopicSubscriptions');
        assert.deepStrictEqual(config.reqOpts, expectedOptions);
        assert.deepStrictEqual(config.gaxOpts, expectedGaxOpts);
        done();
      };

      topic.getSubscriptions(options, assert.ifError);
    });

    it('should accept only a callback', function(done) {
      topic.request = function(config) {
        assert.deepStrictEqual(config.reqOpts, {topic: topic.name});
        assert.deepStrictEqual(config.gaxOpts, {autoPaginate: undefined});
        done();
      };

      topic.getSubscriptions(assert.ifError);
    });

    it('should create subscription objects', function(done) {
      var fakeSubs = ['a', 'b', 'c'];

      topic.subscription = function(name) {
        return {
          name: name,
        };
      };

      topic.request = function(config, callback) {
        callback(null, fakeSubs);
      };

      topic.getSubscriptions(function(err, subscriptions) {
        assert.ifError(err);
        assert.deepStrictEqual(subscriptions, [
          {name: 'a'},
          {name: 'b'},
          {name: 'c'},
        ]);
        done();
      });
    });

    it('should pass all params to the callback', function(done) {
      var err_ = new Error('err');
      var subs_ = false;
      var nextQuery_ = {};
      var apiResponse_ = {};

      topic.request = function(config, callback) {
        callback(err_, subs_, nextQuery_, apiResponse_);
      };

      topic.getSubscriptions(function(err, subs, nextQuery, apiResponse) {
        assert.strictEqual(err, err_);
        assert.deepStrictEqual(subs, subs_);
        assert.strictEqual(nextQuery, nextQuery_);
        assert.strictEqual(apiResponse, apiResponse_);
        done();
      });
    });
  });

  describe('publisher', function() {
    it('should return a Publisher instance', function() {
      var options = {};

      var publisher = topic.publisher(options);
      var args = publisher.calledWith_;

      assert(publisher instanceof FakePublisher);
      assert.strictEqual(args[0], topic);
      assert.strictEqual(args[1], options);
    });
  });

  describe('subscription', function() {
    it('should pass correct arguments to pubsub#subscription', function(done) {
      var subscriptionName = 'subName';
      var opts = {};

      topic.parent.subscription = function(name, options) {
        assert.strictEqual(name, subscriptionName);
        assert.deepStrictEqual(options, opts);
        done();
      };

      topic.subscription(subscriptionName, opts);
    });

    it('should attach the topic instance to the options', function(done) {
      topic.parent.subscription = function(name, options) {
        assert.strictEqual(options.topic, topic);
        done();
      };

      topic.subscription();
    });

    it('should return the result', function(done) {
      topic.parent.subscription = function() {
        return done;
      };

      var doneFn = topic.subscription();
      doneFn();
    });
  });
});
