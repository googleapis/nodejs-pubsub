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

import * as arrify from 'arrify';
import * as assert from 'assert';
import * as gax from 'google-gax';
import * as proxyquire from 'proxyquire';
import * as util from '../src/util';
import * as pjy from '@google-cloud/projectify';
import * as promisify from '@google-cloud/promisify';
import * as subby from '../src/subscription';

const PKG = require('../../package.json');

const fakeCreds = {};
const fakeGoogleGax = {
  GrpcClient: class extends gax.GrpcClient {
    constructor(opts) {
      super(opts);
      this.grpc = {
        credentials: {
          createInsecure() {
            return fakeCreds;
          },
        },
      } as gax.GrpcModule;
    }
  },
};

const SubscriptionCached = subby.Subscription;
let SubscriptionOverride;

function Subscription(a, b, c) {
  const OverrideFn = SubscriptionOverride || SubscriptionCached;
  return new OverrideFn(a, b, c);
}

let promisified = false;
const fakePromisify = Object.assign({}, promisify, {
  promisifyAll: function(Class, options) {
    if (Class.name !== 'PubSub') {
      return;
    }

    promisified = true;
    assert.deepStrictEqual(options.exclude, [
      'request',
      'snapshot',
      'subscription',
      'topic',
    ]);
  },
});

let pjyOverride;
function fakePjy() {
  return (pjyOverride || pjy.replaceProjectIdToken).apply(null, arguments);
}

class FakeSnapshot {
  calledWith_: IArguments;
  constructor() {
    this.calledWith_ = arguments;
  }
}

class FakeTopic {
  calledWith_: IArguments;
  getSubscriptions?: Function;
  constructor() {
    this.calledWith_ = arguments;
  }
}

let extended = false;
const fakePaginator = {
  extend: function(Class, methods) {
    if (Class.name !== 'PubSub') {
      return;
    }

    methods = arrify(methods);
    assert.strictEqual(Class.name, 'PubSub');
    assert.deepStrictEqual(methods, [
      'getSnapshots',
      'getSubscriptions',
      'getTopics',
    ]);

    extended = true;
  },
  streamify: function(methodName) {
    return methodName;
  },
};

let googleAuthOverride;
function fakeGoogleAuth() {
  return (googleAuthOverride || util.noop).apply(null, arguments);
}

const v1Override = {};
let v1ClientOverrides: any = {};

function defineOverridableClient(clientName) {
  function DefaultClient() {}
  DefaultClient.scopes = [];

  Object.defineProperty(v1Override, clientName, {
    get: function() {
      return v1ClientOverrides[clientName] || DefaultClient;
    },
  });
}

defineOverridableClient('FakeClient');
defineOverridableClient('PublisherClient');
defineOverridableClient('SubscriberClient');

describe('PubSub', function() {
  let PubSub;
  const PROJECT_ID = 'test-project';
  let pubsub;
  const OPTIONS = {
    projectId: PROJECT_ID,
    promise: {},
  };

  const PUBSUB_EMULATOR_HOST = process.env.PUBSUB_EMULATOR_HOST;

  before(function() {
    delete process.env.PUBSUB_EMULATOR_HOST;
    PubSub = proxyquire('../src', {
      '@google-cloud/paginator': {
        paginator: fakePaginator,
      },
      '@google-cloud/promisify': fakePromisify,
      '@google-cloud/projectify': {
        replaceProjectIdToken: fakePjy,
      },
      'google-auth-library': {
        GoogleAuth: fakeGoogleAuth,
      },
      'google-gax': fakeGoogleGax,
      './snapshot': {Snapshot: FakeSnapshot},
      './subscription': {Subscription: Subscription},
      './topic': {Topic: FakeTopic},
      './v1': v1Override,
    }).PubSub;
  });

  after(function() {
    if (PUBSUB_EMULATOR_HOST) {
      process.env.PUBSUB_EMULATOR_HOST = PUBSUB_EMULATOR_HOST;
    }
  });

  beforeEach(function() {
    v1ClientOverrides = {};
    googleAuthOverride = null;
    SubscriptionOverride = null;
    pubsub = new PubSub(OPTIONS);
    pubsub.projectId = PROJECT_ID;
  });

  describe('instantiation', function() {
    it('should extend the correct methods', function() {
      assert(extended); // See `fakePaginator.extend`
    });

    it('should streamify the correct methods', function() {
      assert.strictEqual(pubsub.getSnapshotsStream, 'getSnapshots');
      assert.strictEqual(pubsub.getSubscriptionsStream, 'getSubscriptions');
      assert.strictEqual(pubsub.getTopicsStream, 'getTopics');
    });

    it('should promisify all the things', function() {
      assert(promisified);
    });

    it('should return an instance', function() {
      assert(new PubSub() instanceof PubSub);
    });

    it('should combine all required scopes', function() {
      v1ClientOverrides.SubscriberClient = {};
      v1ClientOverrides.SubscriberClient.scopes = ['a', 'b', 'c'];

      v1ClientOverrides.PublisherClient = {};
      v1ClientOverrides.PublisherClient.scopes = ['b', 'c', 'd', 'e'];

      const pubsub = new PubSub({});
      assert.deepStrictEqual(pubsub.options.scopes, ['a', 'b', 'c', 'd', 'e']);
    });

    it('should attempt to determine the service path and port', function() {
      const determineBaseUrl_ = PubSub.prototype.determineBaseUrl_;
      let called = false;

      PubSub.prototype.determineBaseUrl_ = function() {
        PubSub.prototype.determineBaseUrl_ = determineBaseUrl_;
        called = true;
      };

      new PubSub({});
      assert(called);
    });

    it('should initialize the API object', function() {
      assert.deepStrictEqual(pubsub.api, {});
    });

    it('should cache a local google-auth-library instance', function() {
      const fakeGoogleAuthInstance = {};
      const options = {
        a: 'b',
        c: 'd',
      };

      googleAuthOverride = function(options_) {
        assert.deepStrictEqual(
          options_,
          Object.assign(
            {
              'grpc.max_receive_message_length': 20000001,
              'grpc.keepalive_time_ms': 300000,
              libName: 'gccl',
              libVersion: PKG.version,
              scopes: [],
            },
            options
          )
        );
        return fakeGoogleAuthInstance;
      };

      const pubsub = new PubSub(options);
      assert.strictEqual(pubsub.auth, fakeGoogleAuthInstance);
    });

    it('should localize the options provided', function() {
      assert.deepStrictEqual(
        pubsub.options,
        Object.assign(
          {
            'grpc.max_receive_message_length': 20000001,
            'grpc.keepalive_time_ms': 300000,
            libName: 'gccl',
            libVersion: PKG.version,
            scopes: [],
          },
          OPTIONS
        )
      );
    });

    it('should set the projectId', function() {
      assert.strictEqual(pubsub.projectId, PROJECT_ID);
    });

    it('should default the projectId to the token', function() {
      const pubsub = new PubSub({});
      assert.strictEqual(pubsub.projectId, '{{projectId}}');
    });

    it('should set isEmulator to false by default', function() {
      assert.strictEqual(pubsub.isEmulator, false);
    });

    it('should localize a Promise override', function() {
      assert.strictEqual(pubsub.Promise, OPTIONS.promise);
    });
  });

  describe('createSubscription', function() {
    const TOPIC_NAME = 'topic';
    const TOPIC = Object.assign(new FakeTopic(), {
      name: 'projects/' + PROJECT_ID + '/topics/' + TOPIC_NAME,
    });

    const SUB_NAME = 'subscription';
    const SUBSCRIPTION = {
      name: 'projects/' + PROJECT_ID + '/subscriptions/' + SUB_NAME,
    };

    const apiResponse = {
      name: 'subscription-name',
    };

    beforeEach(function() {
      (Subscription as any).formatMetadata_ = function(metadata) {
        return Object.assign({}, metadata);
      };
    });

    it('should throw if no Topic is provided', function() {
      assert.throws(function() {
        pubsub.createSubscription();
      }, /A Topic is required for a new subscription\./);
    });

    it('should throw if no subscription name is provided', function() {
      assert.throws(function() {
        pubsub.createSubscription(TOPIC_NAME);
      }, /A subscription name is required./);
    });

    it('should not require configuration options', function(done) {
      pubsub.request = function(config, callback) {
        callback(null, apiResponse);
      };

      pubsub.createSubscription(TOPIC, SUB_NAME, done);
    });

    it('should allow undefined/optional configuration options', function(done) {
      pubsub.request = function(config, callback) {
        callback(null, apiResponse);
      };

      pubsub.createSubscription(TOPIC, SUB_NAME, undefined, done);
    });

    it('should create a Subscription', function(done) {
      const opts = {a: 'b', c: 'd'};

      pubsub.request = util.noop;

      pubsub.subscription = function(subName, options) {
        assert.strictEqual(subName, SUB_NAME);
        assert.deepStrictEqual(options, opts);
        setImmediate(done);
        return SUBSCRIPTION;
      };

      pubsub.createSubscription(TOPIC, SUB_NAME, opts, assert.ifError);
    });

    it('should create a Topic object from a string', function(done) {
      pubsub.request = util.noop;

      pubsub.topic = function(topicName) {
        assert.strictEqual(topicName, TOPIC_NAME);
        setImmediate(done);
        return TOPIC;
      };

      pubsub.createSubscription(TOPIC_NAME, SUB_NAME, assert.ifError);
    });

    it('should send correct request', function(done) {
      const options = {
        gaxOpts: {},
      };

      pubsub.topic = function(topicName) {
        return {
          name: topicName,
        };
      };

      pubsub.subscription = function(subName) {
        return {
          name: subName,
        };
      };

      pubsub.request = function(config) {
        assert.strictEqual(config.client, 'SubscriberClient');
        assert.strictEqual(config.method, 'createSubscription');
        assert.strictEqual(config.reqOpts.topic, TOPIC.name);
        assert.strictEqual(config.reqOpts.name, SUB_NAME);
        assert.strictEqual(config.gaxOpts, options.gaxOpts);
        done();
      };

      pubsub.createSubscription(TOPIC, SUB_NAME, options, assert.ifError);
    });

    it('should pass options to the api request', function(done) {
      const options = {
        retainAckedMessages: true,
        pushEndpoint: 'https://domain/push',
      };

      const expectedBody = Object.assign(
        {
          topic: TOPIC.name,
          name: SUB_NAME,
        },
        options
      );

      pubsub.topic = function() {
        return {
          name: TOPIC_NAME,
        };
      };

      pubsub.subscription = function() {
        return {
          name: SUB_NAME,
        };
      };

      pubsub.request = function(config) {
        assert.notStrictEqual(config.reqOpts, options);
        assert.deepStrictEqual(config.reqOpts, expectedBody);
        done();
      };

      pubsub.createSubscription(TOPIC, SUB_NAME, options, assert.ifError);
    });

    it('should discard flow control options', function(done) {
      const options = {
        flowControl: {},
      };

      const expectedBody = {
        topic: TOPIC.name,
        name: SUB_NAME,
      };

      pubsub.topic = function() {
        return {
          name: TOPIC_NAME,
        };
      };

      pubsub.subscription = function() {
        return {
          name: SUB_NAME,
        };
      };

      pubsub.request = function(config) {
        assert.notStrictEqual(config.reqOpts, options);
        assert.deepStrictEqual(config.reqOpts, expectedBody);
        done();
      };

      pubsub.createSubscription(TOPIC, SUB_NAME, options, assert.ifError);
    });

    it('should format the metadata', function(done) {
      const fakeMetadata = {};
      const formatted = {
        a: 'a',
      };

      (Subscription as any).formatMetadata_ = function(metadata) {
        assert.strictEqual(metadata, fakeMetadata);
        return formatted;
      };

      pubsub.request = function(config) {
        assert.strictEqual(config.reqOpts, formatted);
        done();
      };

      pubsub.createSubscription(TOPIC, SUB_NAME, fakeMetadata, assert.ifError);
    });

    describe('error', function() {
      const error = new Error('Error.');
      const apiResponse = {name: SUB_NAME};

      beforeEach(function() {
        pubsub.request = function(config, callback) {
          callback(error, apiResponse);
        };
      });

      it('should return error & API response to the callback', function(done) {
        pubsub.request = function(config, callback) {
          callback(error, apiResponse);
        };

        function callback(err, sub, resp) {
          assert.strictEqual(err, error);
          assert.strictEqual(sub, null);
          assert.strictEqual(resp, apiResponse);
          done();
        }

        pubsub.createSubscription(TOPIC_NAME, SUB_NAME, callback);
      });
    });

    describe('success', function() {
      const apiResponse = {name: SUB_NAME};

      beforeEach(function() {
        pubsub.request = function(config, callback) {
          callback(null, apiResponse);
        };
      });

      it('should return Subscription & resp to the callback', function(done) {
        const subscription = {};

        pubsub.subscription = function() {
          return subscription;
        };

        pubsub.request = function(config, callback) {
          callback(null, apiResponse);
        };

        function callback(err, sub, resp) {
          assert.ifError(err);
          assert.strictEqual(sub, subscription);
          assert.strictEqual(resp, apiResponse);
          done();
        }

        pubsub.createSubscription(TOPIC_NAME, SUB_NAME, callback);
      });
    });
  });

  describe('createTopic', function() {
    it('should make the correct API request', function(done) {
      const topicName = 'new-topic-name';
      const formattedName = 'formatted-name';
      const gaxOpts = {};

      pubsub.topic = function(name) {
        assert.strictEqual(name, topicName);

        return {
          name: formattedName,
        };
      };

      pubsub.request = function(config) {
        assert.strictEqual(config.client, 'PublisherClient');
        assert.strictEqual(config.method, 'createTopic');
        assert.deepStrictEqual(config.reqOpts, {name: formattedName});
        assert.deepStrictEqual(config.gaxOpts, gaxOpts);
        done();
      };

      pubsub.createTopic(topicName, gaxOpts, function() {});
    });

    describe('error', function() {
      const error = new Error('Error.');
      const apiResponse = {};

      beforeEach(function() {
        pubsub.request = function(config, callback) {
          callback(error, apiResponse);
        };
      });

      it('should return an error & API response', function(done) {
        pubsub.createTopic('new-topic', function(err, topic, apiResponse_) {
          assert.strictEqual(err, error);
          assert.strictEqual(topic, null);
          assert.strictEqual(apiResponse_, apiResponse);
          done();
        });
      });
    });

    describe('success', function() {
      const apiResponse = {};

      beforeEach(function() {
        pubsub.request = function(config, callback) {
          callback(null, apiResponse);
        };
      });

      it('should return a Topic object', function(done) {
        const topicName = 'new-topic';
        const topicInstance = {};

        pubsub.topic = function(name) {
          assert.strictEqual(name, topicName);
          return topicInstance;
        };

        pubsub.createTopic(topicName, function(err, topic) {
          assert.ifError(err);
          assert.strictEqual(topic, topicInstance);
          done();
        });
      });

      it('should pass apiResponse to callback', function(done) {
        pubsub.createTopic('new-topic', function(err, topic, apiResponse_) {
          assert.ifError(err);
          assert.strictEqual(apiResponse_, apiResponse);
          done();
        });
      });
    });
  });

  describe('determineBaseUrl_', function() {
    function setHost(host) {
      process.env.PUBSUB_EMULATOR_HOST = host;
    }

    beforeEach(function() {
      delete process.env.PUBSUB_EMULATOR_HOST;
    });

    it('should do nothing if correct options are not set', function() {
      pubsub.determineBaseUrl_();

      assert.strictEqual(pubsub.options.servicePath, undefined);
      assert.strictEqual(pubsub.options.port, undefined);
    });

    it('should use the apiEndpoint option', function() {
      const defaultBaseUrl_ = 'defaulturl';
      const testingUrl = 'localhost:8085';

      setHost(defaultBaseUrl_);
      pubsub.options.apiEndpoint = testingUrl;
      pubsub.determineBaseUrl_();

      assert.strictEqual(pubsub.options.servicePath, 'localhost');
      assert.strictEqual(pubsub.options.port, '8085');
      assert.strictEqual(pubsub.options.sslCreds, fakeCreds);
      assert.strictEqual(pubsub.isEmulator, true);
    });

    it('should remove slashes from the baseUrl', function() {
      setHost('localhost:8080/');
      pubsub.determineBaseUrl_();
      assert.strictEqual(pubsub.options.servicePath, 'localhost');
      assert.strictEqual(pubsub.options.port, '8080');

      setHost('localhost:8081//');
      pubsub.determineBaseUrl_();
      assert.strictEqual(pubsub.options.servicePath, 'localhost');
      assert.strictEqual(pubsub.options.port, '8081');
    });

    it('should set the port to undefined if not set', function() {
      setHost('localhost');
      pubsub.determineBaseUrl_();
      assert.strictEqual(pubsub.options.servicePath, 'localhost');
      assert.strictEqual(pubsub.options.port, undefined);
    });

    describe('with PUBSUB_EMULATOR_HOST environment variable', function() {
      const PUBSUB_EMULATOR_HOST = 'localhost:9090';

      beforeEach(function() {
        setHost(PUBSUB_EMULATOR_HOST);
      });

      after(function() {
        delete process.env.PUBSUB_EMULATOR_HOST;
      });

      it('should use the PUBSUB_EMULATOR_HOST env var', function() {
        pubsub.determineBaseUrl_();
        assert.strictEqual(pubsub.options.servicePath, 'localhost');
        assert.strictEqual(pubsub.options.port, '9090');
        assert.strictEqual(pubsub.isEmulator, true);
      });
    });
  });

  describe('getSnapshots', function() {
    const SNAPSHOT_NAME = 'fake-snapshot';
    const apiResponse = {snapshots: [{name: SNAPSHOT_NAME}]};

    beforeEach(function() {
      pubsub.request = function(config, callback) {
        callback(null, apiResponse.snapshots, {}, apiResponse);
      };
    });

    it('should accept a query and a callback', function(done) {
      pubsub.getSnapshots({}, done);
    });

    it('should accept just a callback', function(done) {
      pubsub.getSnapshots(done);
    });

    it('should build the right request', function(done) {
      const options = {
        a: 'b',
        c: 'd',
        gaxOpts: {
          e: 'f',
        },
        autoPaginate: false,
      };

      const expectedOptions = Object.assign({}, options, {
        project: 'projects/' + pubsub.projectId,
      });

      const expectedGaxOpts = Object.assign(
        {
          autoPaginate: options.autoPaginate,
        },
        options.gaxOpts
      );

      delete expectedOptions.gaxOpts;
      delete expectedOptions.autoPaginate;

      pubsub.request = function(config) {
        assert.strictEqual(config.client, 'SubscriberClient');
        assert.strictEqual(config.method, 'listSnapshots');
        assert.deepStrictEqual(config.reqOpts, expectedOptions);
        assert.deepStrictEqual(config.gaxOpts, expectedGaxOpts);
        done();
      };

      pubsub.getSnapshots(options, assert.ifError);
    });

    it('should return Snapshot instances with metadata', function(done) {
      const snapshot = {};

      pubsub.snapshot = function(name) {
        assert.strictEqual(name, SNAPSHOT_NAME);
        return snapshot;
      };

      pubsub.getSnapshots(function(err, snapshots) {
        assert.ifError(err);
        assert.strictEqual(snapshots[0], snapshot);
        assert.strictEqual(snapshots[0].metadata, apiResponse.snapshots[0]);
        done();
      });
    });

    it('should pass back all parameters', function(done) {
      const err_ = new Error('abc');
      const snapshots_ = null;
      const nextQuery_ = {};
      const apiResponse_ = {};

      pubsub.request = function(config, callback) {
        callback(err_, snapshots_, nextQuery_, apiResponse_);
      };

      pubsub.getSnapshots(function(err, snapshots, nextQuery, apiResponse) {
        assert.strictEqual(err, err_);
        assert.deepStrictEqual(snapshots, snapshots_);
        assert.strictEqual(nextQuery, nextQuery_);
        assert.strictEqual(apiResponse, apiResponse_);
        done();
      });
    });
  });

  describe('getSubscriptions', function() {
    const apiResponse = {subscriptions: [{name: 'fake-subscription'}]};

    beforeEach(function() {
      pubsub.request = function(config, callback) {
        callback(null, apiResponse.subscriptions, {}, apiResponse);
      };
    });

    it('should accept a query and a callback', function(done) {
      pubsub.getSubscriptions({}, done);
    });

    it('should accept just a callback', function(done) {
      pubsub.getSubscriptions(done);
    });

    it('should pass the correct arguments to the API', function(done) {
      const options = {
        gaxOpts: {
          a: 'b',
        },
        autoPaginate: false,
      };

      const expectedGaxOpts = Object.assign(
        {
          autoPaginate: options.autoPaginate,
        },
        options.gaxOpts
      );

      const project = 'projects/' + pubsub.projectId;

      pubsub.request = function(config) {
        assert.strictEqual(config.client, 'SubscriberClient');
        assert.strictEqual(config.method, 'listSubscriptions');
        assert.deepStrictEqual(config.reqOpts, {project: project});
        assert.deepStrictEqual(config.gaxOpts, expectedGaxOpts);
        done();
      };

      pubsub.getSubscriptions(options, assert.ifError);
    });

    it('should pass options to API request', function(done) {
      const opts = {pageSize: 10, pageToken: 'abc'};

      pubsub.request = function(config) {
        const reqOpts = config.reqOpts;
        assert.strictEqual(reqOpts.pageSize, opts.pageSize);
        assert.strictEqual(reqOpts.pageToken, opts.pageToken);
        done();
      };

      pubsub.getSubscriptions(opts, assert.ifError);
    });

    it('should return Subscription instances', function(done) {
      pubsub.getSubscriptions(function(err, subscriptions) {
        assert.ifError(err);
        assert(subscriptions[0] instanceof SubscriptionCached);
        done();
      });
    });

    it('should pass back all params', function(done) {
      const err_ = new Error('err');
      const subs_ = false;
      const nextQuery_ = {};
      const apiResponse_ = {};

      pubsub.request = function(config, callback) {
        callback(err_, subs_, nextQuery_, apiResponse_);
      };

      pubsub.getSubscriptions(function(err, subs, nextQuery, apiResponse) {
        assert.strictEqual(err, err_);
        assert.deepStrictEqual(subs, subs_);
        assert.strictEqual(nextQuery, nextQuery_);
        assert.strictEqual(apiResponse, apiResponse_);
        done();
      });
    });

    describe('with topic', function() {
      const TOPIC_NAME = 'topic-name';

      it('should call topic.getSubscriptions', function(done) {
        const topic = new FakeTopic();

        const opts = {
          topic: topic,
        };

        topic.getSubscriptions = function(options, callback) {
          assert.strictEqual(options, opts);
          callback(); // the done fn
        };

        pubsub.getSubscriptions(opts, done);
      });

      it('should create a topic instance from a name', function(done) {
        const opts = {
          topic: TOPIC_NAME,
        };

        const fakeTopic = {
          getSubscriptions: function(options, callback) {
            assert.strictEqual(options, opts);
            callback(); // the done fn
          },
        };

        pubsub.topic = function(name) {
          assert.strictEqual(name, TOPIC_NAME);
          return fakeTopic;
        };

        pubsub.getSubscriptions(opts, done);
      });
    });
  });

  describe('getTopics', function() {
    const topicName = 'fake-topic';
    const apiResponse = {topics: [{name: topicName}]};

    beforeEach(function() {
      pubsub.request = function(config, callback) {
        callback(null, apiResponse.topics, {}, apiResponse);
      };
    });

    it('should accept a query and a callback', function(done) {
      pubsub.getTopics({}, done);
    });

    it('should accept just a callback', function(done) {
      pubsub.getTopics(done);
    });

    it('should build the right request', function(done) {
      const options = {
        a: 'b',
        c: 'd',
        gaxOpts: {
          e: 'f',
        },
        autoPaginate: false,
      };

      const expectedOptions = Object.assign({}, options, {
        project: 'projects/' + pubsub.projectId,
      });

      const expectedGaxOpts = Object.assign(
        {
          autoPaginate: options.autoPaginate,
        },
        options.gaxOpts
      );

      delete expectedOptions.gaxOpts;
      delete expectedOptions.autoPaginate;

      pubsub.request = function(config) {
        assert.strictEqual(config.client, 'PublisherClient');
        assert.strictEqual(config.method, 'listTopics');
        assert.deepStrictEqual(config.reqOpts, expectedOptions);
        assert.deepStrictEqual(config.gaxOpts, expectedGaxOpts);
        done();
      };

      pubsub.getTopics(options, assert.ifError);
    });

    it('should return Topic instances with metadata', function(done) {
      const topic = {};

      pubsub.topic = function(name) {
        assert.strictEqual(name, topicName);
        return topic;
      };

      pubsub.getTopics(function(err, topics) {
        assert.ifError(err);
        assert.strictEqual(topics[0], topic);
        assert.strictEqual(topics[0].metadata, apiResponse.topics[0]);
        done();
      });
    });

    it('should pass back all params', function(done) {
      const err_ = new Error('err');
      const topics_ = false;
      const nextQuery_ = {};
      const apiResponse_ = {};

      pubsub.request = function(config, callback) {
        callback(err_, topics_, nextQuery_, apiResponse_);
      };

      pubsub.getTopics(function(err, topics, nextQuery, apiResponse) {
        assert.strictEqual(err, err_);
        assert.deepStrictEqual(topics, topics_);
        assert.strictEqual(nextQuery, nextQuery_);
        assert.strictEqual(apiResponse, apiResponse_);
        done();
      });
    });
  });

  describe('request', function() {
    const CONFIG = {
      client: 'PublisherClient',
      method: 'fakeMethod',
      reqOpts: {a: 'a'},
      gaxOpts: {b: 'b'},
    };

    beforeEach(function() {
      delete pubsub.projectId;

      pubsub.auth = {
        getProjectId: function(callback) {
          callback(null, PROJECT_ID);
        },
      };

      pjyOverride = function(reqOpts) {
        return reqOpts;
      };

      pubsub.config = CONFIG;
    });

    it('should call getClient_ with the correct config', function(done) {
      pubsub.getClient_ = function(config) {
        assert.strictEqual(config, CONFIG);
        done();
      };

      pubsub.request(CONFIG, assert.ifError);
    });

    it('should return error from getClient_', function(done) {
      const expectedError = new Error('some error');
      pubsub.getClient_ = function(config, callback) {
        callback(expectedError);
      };

      pubsub.request(CONFIG, function(err) {
        assert.strictEqual(expectedError, err);
        done();
      });
    });

    it('should call client method with correct options', function(done) {
      const fakeClient = {};
      (fakeClient as any).fakeMethod = function(reqOpts, gaxOpts) {
        assert.deepStrictEqual(CONFIG.reqOpts, reqOpts);
        assert.deepStrictEqual(CONFIG.gaxOpts, gaxOpts);
        done();
      };
      pubsub.getClient_ = function(config, callback) {
        callback(null, fakeClient);
      };
      pubsub.request(CONFIG, assert.ifError);
    });

    it('should replace the project id token on reqOpts', function(done) {
      pjyOverride = function(reqOpts, projectId) {
        assert.deepStrictEqual(reqOpts, CONFIG.reqOpts);
        assert.strictEqual(projectId, PROJECT_ID);
        done();
      };
      pubsub.request(CONFIG, assert.ifError);
    });
  });

  describe('getClient_', function() {
    const FAKE_CLIENT_INSTANCE = class {};
    const CONFIG = {
      client: 'FakeClient',
    };

    beforeEach(function() {
      pubsub.auth = {
        getProjectId: util.noop,
      };

      v1ClientOverrides.FakeClient = FAKE_CLIENT_INSTANCE;
    });

    describe('project ID', function() {
      beforeEach(function() {
        delete pubsub.projectId;
        pubsub.isEmulator = false;
      });

      it('should get and cache the project ID', function(done) {
        pubsub.auth.getProjectId = function(callback) {
          assert.strictEqual(typeof callback, 'function');
          callback(null, PROJECT_ID);
        };

        pubsub.getClient_(CONFIG, function(err) {
          assert.ifError(err);
          assert.strictEqual(pubsub.projectId, PROJECT_ID);
          done();
        });
      });

      it('should get the project ID if placeholder', function(done) {
        pubsub.projectId = '{{projectId}}';

        pubsub.auth.getProjectId = function() {
          done();
        };

        pubsub.getClient_(CONFIG, assert.ifError);
      });

      it('should return errors to the callback', function(done) {
        const error = new Error('err');

        pubsub.auth.getProjectId = function(callback) {
          callback(error);
        };

        pubsub.getClient_(CONFIG, function(err) {
          assert.strictEqual(err, error);
          done();
        });
      });

      it('should not get the project ID if already known', function() {
        pubsub.projectId = PROJECT_ID;

        pubsub.auth.getProjectId = function() {
          throw new Error('getProjectId should not be called.');
        };

        pubsub.getClient_(CONFIG, assert.ifError);
      });

      it('should not get the project ID if inside emulator', function() {
        pubsub.isEmulator = true;

        pubsub.auth.getProjectId = function() {
          throw new Error('getProjectId should not be called.');
        };

        pubsub.getClient_(CONFIG, assert.ifError);
      });
    });

    it('should cache the client', function(done) {
      delete pubsub.api.fakeClient;

      let numTimesFakeClientInstantiated = 0;

      v1ClientOverrides.FakeClient = function() {
        numTimesFakeClientInstantiated++;
        return FAKE_CLIENT_INSTANCE;
      };

      pubsub.getClient_(CONFIG, function(err) {
        assert.ifError(err);
        assert.strictEqual(pubsub.api.FakeClient, FAKE_CLIENT_INSTANCE);

        pubsub.getClient_(CONFIG, function(err) {
          assert.ifError(err);
          assert.strictEqual(numTimesFakeClientInstantiated, 1);
          done();
        });
      });
    });

    it('should return the correct client', function(done) {
      v1ClientOverrides.FakeClient = function(options) {
        assert.strictEqual(options, pubsub.options);
        return FAKE_CLIENT_INSTANCE;
      };

      pubsub.getClient_(CONFIG, function(err, client) {
        assert.ifError(err);
        assert.strictEqual(client, FAKE_CLIENT_INSTANCE);
        done();
      });
    });
  });

  describe('request', function() {
    const CONFIG = {
      client: 'SubscriberClient',
      method: 'fakeMethod',
      reqOpts: {a: 'a'},
      gaxOpts: {},
    };

    const FAKE_CLIENT_INSTANCE = {
      [CONFIG.method]: util.noop,
    };

    beforeEach(function() {
      pjyOverride = function(reqOpts) {
        return reqOpts;
      };

      pubsub.getClient_ = function(config, callback) {
        callback(null, FAKE_CLIENT_INSTANCE);
      };
    });

    it('should get the client', function(done) {
      pubsub.getClient_ = function(config) {
        assert.strictEqual(config, CONFIG);
        done();
      };

      pubsub.request(CONFIG, assert.ifError);
    });

    it('should return error from getting the client', function(done) {
      const error = new Error('Error.');

      pubsub.getClient_ = function(config, callback) {
        callback(error);
      };

      pubsub.request(CONFIG, function(err) {
        assert.strictEqual(err, error);
        done();
      });
    });

    it('should replace the project id token on reqOpts', function(done) {
      pjyOverride = function(reqOpts, projectId) {
        assert.deepStrictEqual(reqOpts, CONFIG.reqOpts);
        assert.strictEqual(projectId, PROJECT_ID);
        done();
      };

      pubsub.request(CONFIG, assert.ifError);
    });

    it('should call the client method correctly', function(done) {
      const CONFIG = {
        client: 'FakeClient',
        method: 'fakeMethod',
        reqOpts: {a: 'a'},
        gaxOpts: {},
      };

      const replacedReqOpts = {};

      pjyOverride = function() {
        return replacedReqOpts;
      };

      const fakeClient = {
        fakeMethod: function(reqOpts, gaxOpts, callback) {
          assert.strictEqual(reqOpts, replacedReqOpts);
          assert.strictEqual(gaxOpts, CONFIG.gaxOpts);
          callback(); // done()
        },
      };

      pubsub.getClient_ = function(config, callback) {
        callback(null, fakeClient);
      };

      pubsub.request(CONFIG, done);
    });
  });

  describe('snapshot', function() {
    it('should throw if a name is not provided', function() {
      assert.throws(function() {
        pubsub.snapshot();
      }, /You must supply a valid name for the snapshot\./);
    });

    it('should return a Snapshot object', function() {
      const SNAPSHOT_NAME = 'new-snapshot';
      const snapshot = pubsub.snapshot(SNAPSHOT_NAME);
      const args = snapshot.calledWith_;

      assert(snapshot instanceof FakeSnapshot);
      assert.strictEqual(args[0], pubsub);
      assert.strictEqual(args[1], SNAPSHOT_NAME);
    });
  });

  describe('subscription', function() {
    const SUB_NAME = 'new-sub-name';
    const CONFIG = {};

    it('should return a Subscription object', function() {
      SubscriptionOverride = function() {};
      const subscription = pubsub.subscription(SUB_NAME, {});
      assert(subscription instanceof SubscriptionOverride);
    });

    it('should pass specified name to the Subscription', function(done) {
      SubscriptionOverride = function(pubsub, name) {
        assert.strictEqual(name, SUB_NAME);
        done();
      };
      pubsub.subscription(SUB_NAME);
    });

    it('should honor settings', function(done) {
      SubscriptionOverride = function(pubsub, name, options) {
        assert.strictEqual(options, CONFIG);
        done();
      };
      pubsub.subscription(SUB_NAME, CONFIG);
    });

    it('should throw if a name is not provided', function() {
      assert.throws(function() {
        return pubsub.subscription();
      }, /A name must be specified for a subscription\./);
    });
  });

  describe('topic', function() {
    it('should throw if a name is not provided', function() {
      assert.throws(function() {
        pubsub.topic();
      }, /A name must be specified for a topic\./);
    });

    it('should return a Topic object', function() {
      assert(pubsub.topic('new-topic') instanceof FakeTopic);
    });
  });
});
