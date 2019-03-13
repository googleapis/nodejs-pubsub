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

import * as pjy from '@google-cloud/projectify';
import * as promisify from '@google-cloud/promisify';
import * as arrify from 'arrify';
import * as assert from 'assert';
import * as gax from 'google-gax';
import {CallOptions, ServiceError} from 'grpc';
import * as proxyquire from 'proxyquire';
import * as sinon from 'sinon';

import {google} from '../proto/pubsub';
import * as pubsubTypes from '../src/pubsub';
import {Snapshot} from '../src/snapshot';
import * as subby from '../src/subscription';
import {Topic} from '../src/topic';
import * as util from '../src/util';


const PKG = require('../../package.json');
const sandbox = sinon.createSandbox();
const fakeCreds = {};
const fakeGoogleGax = {
  GrpcClient: class extends gax.GrpcClient{
    constructor(opts: gax.GrpcClientOptions) {
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

const subscriptionCached = subby.Subscription;

// tslint:disable-next-line no-any
let subscriptionOverride: any;

function Subscription(
    pubsub: pubsubTypes.PubSub, name: string,
    options: subby.SubscriptionOptions) {
  const overrideFn = subscriptionOverride || subscriptionCached;
  return new overrideFn(pubsub, name, options);
}

let promisified = false;
const fakePromisify = Object.assign({}, promisify, {
  promisifyAll(
      // tslint:disable-next-line variable-name
      Class: typeof pubsubTypes.PubSub,
      options: promisify.PromisifyAllOptions) {
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

let pjyOverride: Function;
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
  // tslint:disable-next-line variable-name
  extend(Class: typeof pubsubTypes.PubSub, methods: string[]) {
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
  streamify(methodName: string) {
    return methodName;
  },
};

let googleAuthOverride: Function|null;
function fakeGoogleAuth() {
  return (googleAuthOverride || util.noop).apply(null, arguments);
}

const v1Override = {};
// tslint:disable-next-line no-any
let v1ClientOverrides: any = {};

function defineOverridableClient(clientName: string) {
  function DefaultClient() {}
  // tslint:disable-next-line no-any
  (DefaultClient as any).scopes = [];

  Object.defineProperty(v1Override, clientName, {
    get() {
      return v1ClientOverrides[clientName] || DefaultClient;
    },
  });
}

defineOverridableClient('FakeClient');
defineOverridableClient('PublisherClient');
defineOverridableClient('SubscriberClient');

describe('PubSub', () => {
  // tslint:disable-next-line variable-name
  let PubSub: typeof pubsubTypes.PubSub;
  const PROJECT_ID = 'test-project';

  let pubsub: pubsubTypes.PubSub;
  const OPTIONS = {
    projectId: PROJECT_ID,
    promise: {},
  } as pubsubTypes.ClientConfig;

  const PUBSUB_EMULATOR_HOST = process.env.PUBSUB_EMULATOR_HOST;

  before(() => {
    delete process.env.PUBSUB_EMULATOR_HOST;
    PubSub = proxyquire('../src/pubsub', {
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
               './subscription': {Subscription},
               './topic': {Topic: FakeTopic},
               './v1': v1Override,
             }).PubSub;
  });

  after(() => {
    if (PUBSUB_EMULATOR_HOST) {
      process.env.PUBSUB_EMULATOR_HOST = PUBSUB_EMULATOR_HOST;
    }
  });

  beforeEach(() => {
    v1ClientOverrides = {};
    googleAuthOverride = null;
    pubsub = new PubSub(OPTIONS);
    pubsub.projectId = PROJECT_ID;
  });

  describe('instantiation', () => {
    const DEFAULT_OPTIONS = {
      'grpc.keepalive_time_ms': 300000,
      'grpc.max_send_message_length': -1,
      'grpc.max_receive_message_length': 20000001,
      libName: 'gccl',
      libVersion: PKG.version,
      scopes: [],
    };

    it('should extend the correct methods', () => {
      assert(extended);  // See `fakePaginator.extend`
    });

    it('should streamify the correct methods', () => {
      assert.strictEqual(pubsub.getSnapshotsStream, 'getSnapshots');
      assert.strictEqual(pubsub.getSubscriptionsStream, 'getSubscriptions');
      assert.strictEqual(pubsub.getTopicsStream, 'getTopics');
    });

    it('should promisify all the things', () => {
      assert(promisified);
    });

    it('should return an instance', () => {
      assert(new PubSub() instanceof PubSub);
    });

    it('should combine all required scopes', () => {
      v1ClientOverrides.SubscriberClient = {};
      v1ClientOverrides.SubscriberClient.scopes = ['a', 'b', 'c'];

      v1ClientOverrides.PublisherClient = {};
      v1ClientOverrides.PublisherClient.scopes = ['b', 'c', 'd', 'e'];

      const pubsub = new PubSub({});
      const options = {scopes: ['a', 'b', 'c', 'd', 'e']};
      const expectedOptions = Object.assign({}, DEFAULT_OPTIONS, options);
      assert.deepStrictEqual(pubsub.options, expectedOptions);
    });

    it('should attempt to determine the service path and port', () => {
      const determineBaseUrl_ = PubSub.prototype.determineBaseUrl_;
      let called = false;

      PubSub.prototype.determineBaseUrl_ = () => {
        PubSub.prototype.determineBaseUrl_ = determineBaseUrl_;
        called = true;
      };

      // tslint:disable-next-line no-unused-expression
      new PubSub({});
      assert(called);
    });

    it('should initialize the API object', () => {
      assert.deepStrictEqual(pubsub.api, {});
    });

    it('should cache a local google-auth-library instance', () => {
      const fakeGoogleAuthInstance = {};
      const options = {
        a: 'b',
        c: 'd',
      } as pubsubTypes.ClientConfig;
      const expectedOptions = Object.assign({}, DEFAULT_OPTIONS, options);

      googleAuthOverride = (options_: pubsubTypes.ClientConfig) => {
        assert.deepStrictEqual(options_, expectedOptions);
        return fakeGoogleAuthInstance;
      };

      const pubsub = new PubSub(options);
      assert.strictEqual(pubsub.auth, fakeGoogleAuthInstance);
    });

    it('should localize the options provided', () => {
      const expectedOptions = Object.assign({}, DEFAULT_OPTIONS, OPTIONS);

      assert.deepStrictEqual(pubsub.options, expectedOptions);
    });

    it('should set the projectId', () => {
      assert.strictEqual(pubsub.projectId, PROJECT_ID);
    });

    it('should default the projectId to the token', () => {
      const pubsub = new PubSub({});
      assert.strictEqual(pubsub.projectId, '{{projectId}}');
    });

    it('should set isEmulator to false by default', () => {
      assert.strictEqual(pubsub.isEmulator, false);
    });

    it('should localize a Promise override', () => {
      assert.strictEqual(pubsub.Promise, OPTIONS.promise);
    });
  });

  describe('createSubscription', () => {
    const TOPIC_NAME = 'topic';
    pubsub = new pubsubTypes.PubSub({});
    const TOPIC = Object.assign(new FakeTopic(), {
      name: 'projects/' + PROJECT_ID + '/topics/' + TOPIC_NAME,
    }) as {} as Topic;

    const SUB_NAME = 'subscription';
    const SUBSCRIPTION = {
      name: 'projects/' + PROJECT_ID + '/subscriptions/' + SUB_NAME,
    };

    const apiResponse = {
      name: 'subscription-name',
    };



    beforeEach(() => {
      (Subscription as {} as typeof subby.Subscription).formatMetadata_ =
          (metadata: subby.SubscriptionMetadata) => {
            return Object.assign({}, metadata) as subby.SubscriptionMetadata;
          };
    });

    it('should throw if no Topic is provided', () => {
      assert.throws(() => {
        // tslint:disable-next-line no-any
        (pubsub as any).createSubscription();
      }, /A Topic is required for a new subscription\./);
    });

    it('should throw if no subscription name is provided', () => {
      assert.throws(() => {
        // tslint:disable-next-line no-any
        (pubsub as any).createSubscription(TOPIC_NAME);
      }, /A subscription name is required./);
    });

    it('should not require configuration options', done => {
      pubsub.request = (config, callback: Function) => {
        callback(null, apiResponse);
      };

      pubsub.createSubscription(TOPIC, SUB_NAME, done);
    });

    it('should allow undefined/optional configuration options', done => {
      pubsub.request = (config, callback: Function) => {
        callback(null, apiResponse);
      };
      // tslint:disable-next-line no-any
      (pubsub as any).createSubscription(TOPIC, SUB_NAME, undefined, done);
    });

    it('should create a Subscription', done => {
      const opts = {a: 'b', c: 'd'} as subby.CreateSubscriptionOptions;

      pubsub.request = util.noop;

      pubsub.subscription = (subName, options) => {
        assert.strictEqual(subName, SUB_NAME);
        assert.deepStrictEqual(options, opts);
        setImmediate(done);
        return SUBSCRIPTION as subby.Subscription;
      };
      pubsub.createSubscription(TOPIC, SUB_NAME, opts, assert.ifError);
    });

    it('should create a Topic object from a string', done => {
      pubsub.request = util.noop;

      pubsub.topic = topicName => {
        assert.strictEqual(topicName, TOPIC_NAME);
        setImmediate(done);
        return TOPIC;
      };

      pubsub.createSubscription(TOPIC_NAME, SUB_NAME, assert.ifError);
    });

    it('should send correct request', done => {
      const options = {
        gaxOpts: {},
      };

      pubsub.topic = topicName => {
        return {
          name: topicName,
        } as Topic;
      };
      pubsub.subscription = subName => {
        return {
          name: subName,
        } as subby.Subscription;
      };


      const reqOpts = {topic: TOPIC.name, name: SUB_NAME};

      pubsub.request = config => {
        assert.strictEqual(config.client, 'SubscriberClient');
        assert.strictEqual(config.method, 'createSubscription');
        assert.deepStrictEqual(config.reqOpts, reqOpts);
        assert.deepStrictEqual(config.gaxOpts, options.gaxOpts);
        done();
      };

      pubsub.createSubscription(TOPIC, SUB_NAME, options, assert.ifError);
    });

    it('should pass options to the api request', done => {
      const options = {
        retainAckedMessages: true,
        pushEndpoint: 'https://domain/push',
      };

      const expectedBody =
          Object.assign({topic: TOPIC.name, name: SUB_NAME}, options);

      pubsub.topic = () => {
        return {
          name: TOPIC_NAME,
        } as Topic;
      };

      pubsub.subscription = () => {
        return {
          name: SUB_NAME,
        } as subby.Subscription;
      };


      pubsub.request = config => {
        assert.notStrictEqual(config.reqOpts, options);
        assert.deepStrictEqual(config.reqOpts, expectedBody);
        done();
      };

      pubsub.createSubscription(TOPIC, SUB_NAME, options, assert.ifError);
    });

    it('should discard flow control options', done => {
      const options = {
        flowControl: {},
      };

      const expectedBody = {
        topic: TOPIC.name,
        name: SUB_NAME,
      };

      pubsub.topic = () => {
        return {
          name: TOPIC_NAME,
        } as Topic;
      };

      pubsub.subscription = () => {
        return {
          name: SUB_NAME,
        } as subby.Subscription;
      };

      pubsub.request = config => {
        assert.notStrictEqual(config.reqOpts, options);
        assert.deepStrictEqual(config.reqOpts, expectedBody);
        done();
      };

      pubsub.createSubscription(TOPIC, SUB_NAME, options, assert.ifError);
    });

    it('should format the metadata', done => {
      const fakeMetadata = {};
      const formatted = {
        a: 'a',
      };

      (Subscription as {} as typeof subby.Subscription).formatMetadata_ =
          (metadata: subby.SubscriptionMetadata) => {
            assert.deepStrictEqual(metadata, fakeMetadata);
            return formatted as {} as subby.SubscriptionMetadata;
          };

      pubsub.request = (config: pubsubTypes.RequestConfig) => {
        assert.strictEqual(config.reqOpts, formatted);
        done();
      };

      pubsub.createSubscription(TOPIC, SUB_NAME, fakeMetadata, assert.ifError);
    });

    describe('error', () => {
      const error = new Error('Error.');
      const apiResponse = {name: SUB_NAME};

      beforeEach(() => {
        pubsub.request = (config, callback: Function) => {
          callback(error, apiResponse);
        };
      });

      it('should return error & API response to the callback', done => {
        pubsub.request = (config, callback: Function) => {
          callback(error, apiResponse);
        };

        function callback(
            err?: Error|null, sub?: subby.Subscription|null,
            resp?: google.pubsub.v1.ISubscription|null) {
          assert.strictEqual(err, error);
          assert.strictEqual(sub, null);
          assert.strictEqual(resp, apiResponse);
          done();
        }

        pubsub.createSubscription(TOPIC_NAME, SUB_NAME, callback);
      });
    });

    describe('success', () => {
      const apiResponse = {name: SUB_NAME};

      beforeEach(() => {
        pubsub.request = (config, callback: Function) => {
          callback(null, apiResponse);
        };
      });

      it('should return Subscription & resp to the callback', done => {
        const subscription = {};
        pubsub.subscription = () => {
          return subscription as subby.Subscription;
        };

        pubsub.request = (config, callback: Function) => {
          callback(null, apiResponse);
        };

        function callback(
            err?: Error|null, sub?: subby.Subscription|null,
            resp?: google.pubsub.v1.ISubscription|null) {
          assert.ifError(err);
          assert.strictEqual(sub, subscription);
          assert.strictEqual(resp, apiResponse);
          done();
        }

        pubsub.createSubscription(TOPIC_NAME, SUB_NAME, callback);
      });
    });
  });

  describe('createTopic', () => {
    it('should make the correct API request', done => {
      const pubsub = new pubsubTypes.PubSub();
      const topicName = 'new-topic-name';
      const formattedName = 'formatted-name';
      const gaxOpts = {};

      pubsub.topic = name => {
        assert.strictEqual(name, topicName);

        return {
          name: formattedName,
        } as Topic;
      };



      pubsub.request = config => {
        assert.strictEqual(config.client, 'PublisherClient');
        assert.strictEqual(config.method, 'createTopic');
        assert.deepStrictEqual(config.reqOpts, {name: formattedName});
        assert.deepStrictEqual(config.gaxOpts, gaxOpts);
        done();
      };

      pubsub.createTopic(topicName, gaxOpts, () => {});
    });

    describe('error', () => {
      const error = new Error('Error.');
      const apiResponse = {};

      beforeEach(() => {
        pubsub.request = (config, callback: Function) => {
          callback(error, apiResponse);
        };
      });

      it('should return an error & API response', done => {
        pubsub.createTopic('new-topic', (err, topic, apiResponse_) => {
          assert.strictEqual(err, error);
          assert.strictEqual(topic, null);
          assert.strictEqual(apiResponse_, apiResponse);
          done();
        });
      });
    });

    describe('success', () => {
      const apiResponse = {};

      beforeEach(() => {
        pubsub.request = (config, callback: Function) => {
          callback(null, apiResponse);
        };
      });

      it('should return a Topic object', done => {
        const topicName = 'new-topic';
        const topicInstance = {};

        pubsub.topic = name => {
          assert.strictEqual(name, topicName);
          return topicInstance as Topic;
        };

        pubsub.createTopic(topicName, (err, topic) => {
          assert.ifError(err);
          assert.strictEqual(topic, topicInstance);
          done();
        });
      });

      it('should pass apiResponse to callback', done => {
        pubsub.createTopic('new-topic', (err, topic, apiResponse_) => {
          assert.ifError(err);
          assert.strictEqual(apiResponse_, apiResponse);
          done();
        });
      });
    });
  });

  describe('determineBaseUrl_', () => {
    function setHost(host: string) {
      process.env.PUBSUB_EMULATOR_HOST = host;
    }

    beforeEach(() => {
      delete process.env.PUBSUB_EMULATOR_HOST;
    });

    it('should do nothing if correct options are not set', () => {
      pubsub.determineBaseUrl_();

      assert.strictEqual(pubsub.options.servicePath, undefined);
      assert.strictEqual(pubsub.options.port, undefined);
    });

    it('should use the apiEndpoint option', () => {
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

    it('should remove slashes from the baseUrl', () => {
      setHost('localhost:8080/');
      pubsub.determineBaseUrl_();
      assert.strictEqual(pubsub.options.servicePath, 'localhost');
      assert.strictEqual(pubsub.options.port, '8080');

      setHost('localhost:8081//');
      pubsub.determineBaseUrl_();
      assert.strictEqual(pubsub.options.servicePath, 'localhost');
      assert.strictEqual(pubsub.options.port, '8081');
    });

    it('should set the port to undefined if not set', () => {
      setHost('localhost');
      pubsub.determineBaseUrl_();
      assert.strictEqual(pubsub.options.servicePath, 'localhost');
      assert.strictEqual(pubsub.options.port, undefined);
    });

    describe('with PUBSUB_EMULATOR_HOST environment variable', () => {
      const PUBSUB_EMULATOR_HOST = 'localhost:9090';

      beforeEach(() => {
        setHost(PUBSUB_EMULATOR_HOST);
      });

      after(() => {
        delete process.env.PUBSUB_EMULATOR_HOST;
      });

      it('should use the PUBSUB_EMULATOR_HOST env var', () => {
        pubsub.determineBaseUrl_();
        assert.strictEqual(pubsub.options.servicePath, 'localhost');
        assert.strictEqual(pubsub.options.port, '9090');
        assert.strictEqual(pubsub.isEmulator, true);
      });
    });
  });

  describe('getSnapshots', () => {
    const SNAPSHOT_NAME = 'fake-snapshot';
    const apiResponse = {snapshots: [{name: SNAPSHOT_NAME}]};

    beforeEach(() => {
      pubsub.request = (config, callback: Function) => {
        callback(null, apiResponse.snapshots, {}, apiResponse);
      };
    });

    it('should accept a query and a callback', done => {
      pubsub.getSnapshots({}, done);
    });

    it('should accept just a callback', done => {
      pubsub.getSnapshots(done);
    });

    it('should build the right request', done => {
      const options = {
        a: 'b',
        c: 'd',
        gaxOpts: {
          e: 'f',
        },
        autoPaginate: false,
      } as {} as pubsubTypes.PageOptions;

      const expectedOptions = Object.assign({}, options, {
        project: 'projects/' + pubsub.projectId,
      });

      const expectedGaxOpts = Object.assign(
          {
            autoPaginate: options.autoPaginate,
          },
          options.gaxOpts);

      delete expectedOptions.gaxOpts;
      delete expectedOptions.autoPaginate;

      pubsub.request = config => {
        assert.strictEqual(config.client, 'SubscriberClient');
        assert.strictEqual(config.method, 'listSnapshots');
        assert.deepStrictEqual(config.reqOpts, expectedOptions);
        assert.deepStrictEqual(config.gaxOpts, expectedGaxOpts);
        done();
      };

      pubsub.getSnapshots(options, assert.ifError);
    });

    it('should return Snapshot instances with metadata', done => {
      const snapshot = {};

      sandbox.stub(pubsub, 'snapshot').callsFake(name => {
        assert.strictEqual(name, SNAPSHOT_NAME);
        return snapshot as Snapshot;
      });

      pubsub.getSnapshots((err, snapshots) => {
        assert.ifError(err);
        assert.strictEqual(snapshots![0], snapshot);
        assert.strictEqual(snapshots![0].metadata, apiResponse.snapshots[0]);
        done();
      });
    });

    it('should pass back all parameters', done => {
      const err_ = new Error('abc');
      const snapshots_ = undefined;
      const nextQuery_ = {};
      const apiResponse_ = {};

      pubsub.request = (config, callback: Function) => {
        callback(err_, snapshots_, nextQuery_, apiResponse_);
      };

      pubsub.getSnapshots((err, snapshots, apiResponse) => {
        assert.strictEqual(err, err_);
        assert.deepStrictEqual(snapshots, snapshots_);
        assert.strictEqual(apiResponse, nextQuery_);
        done();
      });
    });
  });

  describe('getSubscriptions', () => {
    const apiResponse = {subscriptions: [{name: 'fake-subscription'}]};

    beforeEach(() => {
      pubsub.request = (config, callback: Function) => {
        callback(null, apiResponse.subscriptions, {}, apiResponse);
      };
    });

    it('should accept a query and a callback', done => {
      pubsub.getSubscriptions({}, done);
    });

    it('should accept just a callback', done => {
      pubsub.getSubscriptions(done);
    });

    it('should pass the correct arguments to the API', done => {
      const options = {
        gaxOpts: {
          a: 'b',
        },
        autoPaginate: false,
      } as {} as pubsubTypes.GetSubscriptionsOptions;

      const expectedGaxOpts = Object.assign(
          {
            autoPaginate: options.autoPaginate,
          },
          options.gaxOpts);

      const project = 'projects/' + pubsub.projectId;

      pubsub.request = config => {
        assert.strictEqual(config.client, 'SubscriberClient');
        assert.strictEqual(config.method, 'listSubscriptions');
        assert.deepStrictEqual(config.reqOpts, {project});
        assert.deepStrictEqual(config.gaxOpts, expectedGaxOpts);
        done();
      };

      pubsub.getSubscriptions(options, assert.ifError);
    });

    it('should pass options to API request', done => {
      const opts = {pageSize: 10, pageToken: 'abc'};

      pubsub.request = config => {
        const reqOpts = config.reqOpts;
        const expectedOptions = Object.assign({}, opts, {
          project: 'projects/' + pubsub.projectId,
        });
        assert.deepStrictEqual(reqOpts, expectedOptions);
        done();
      };

      pubsub.getSubscriptions(opts, assert.ifError);
    });

    it('should return Subscription instances', done => {
      pubsub.getSubscriptions(
          (err: ServiceError|null,
           subscriptions?: subby.Subscription[]|null) => {
            assert.ifError(err);
            assert(subscriptions![0] instanceof subscriptionCached);
            done();
          });
    });

    it('should pass back all params', done => {
      const err_ = new Error('err');
      const subs_ = undefined;
      const nextQuery_ = {};
      const apiResponse_ = {};


      pubsub.request = (config, callback: Function) => {
        callback(err_, subs_, nextQuery_, apiResponse_);
      };

      pubsub.getSubscriptions(
          (err: ServiceError|null, subs?: subby.Subscription[]|null,
           apiResponse?: google.pubsub.v1.IListSubscriptionsResponse|null) => {
            assert.strictEqual(err, err_);
            assert.deepStrictEqual(subs, subs_);
            assert.strictEqual(apiResponse, nextQuery_);
            done();
          });
    });

    describe('with topic', () => {
      const TOPIC_NAME = 'topic-name';

      it('should call topic.getSubscriptions', done => {
        const topic = new FakeTopic();

        const opts = {
          topic,
        } as {} as pubsubTypes.GetSubscriptionsOptions;

        topic.getSubscriptions = (options: pubsubTypes.PageOptions) => {
          assert.strictEqual(options, opts);
          done();
        };

        pubsub.getSubscriptions(opts, assert.ifError);
      });

      it('should create a topic instance from a name', done => {
        const opts = {
          topic: TOPIC_NAME,
        } as {} as pubsubTypes.GetSubscriptionsOptions;

        const fakeTopic = {
          getSubscriptions(options: pubsubTypes.PageOptions) {
            assert.strictEqual(options, opts);
            done();
          },
        };

        pubsub.topic = (name: string) => {
          assert.strictEqual(name, TOPIC_NAME);
          return fakeTopic as Topic;
        };

        pubsub.getSubscriptions(opts, assert.ifError);
      });
    });
  });

  describe('getTopics', () => {
    const topicName = 'fake-topic';
    const apiResponse = {topics: [{name: topicName}]};

    beforeEach(() => {
      pubsub.request = (config, callback: Function) => {
        callback(null, apiResponse.topics, {}, apiResponse);
      };
    });

    it('should accept a query and a callback', done => {
      pubsub.getTopics({}, done);
    });

    it('should accept just a callback', done => {
      pubsub.getTopics(done);
    });

    it('should build the right request', done => {
      const options = {
        a: 'b',
        c: 'd',
        gaxOpts: {
          e: 'f',
        },
        autoPaginate: false,
      } as {} as pubsubTypes.PageOptions;

      const expectedOptions = Object.assign({}, options, {
        project: 'projects/' + pubsub.projectId,
      });

      const expectedGaxOpts = Object.assign(
          {
            autoPaginate: options.autoPaginate,
          },
          options.gaxOpts);

      delete expectedOptions.gaxOpts;
      delete expectedOptions.autoPaginate;

      pubsub.request = config => {
        assert.strictEqual(config.client, 'PublisherClient');
        assert.strictEqual(config.method, 'listTopics');
        assert.deepStrictEqual(config.reqOpts, expectedOptions);
        assert.deepStrictEqual(config.gaxOpts, expectedGaxOpts);
        done();
      };

      pubsub.getTopics(options, assert.ifError);
    });

    it('should return Topic instances with metadata', done => {
      const topic = {};

      pubsub.topic = name => {
        assert.strictEqual(name, topicName);
        return topic as Topic;
      };


      pubsub.getTopics((err, topics) => {
        assert.ifError(err);
        assert.strictEqual(topics![0], topic);
        assert.strictEqual(topics![0].metadata, apiResponse.topics[0]);
        done();
      });
    });

    it('should pass back all params', done => {
      const err_ = new Error('err');
      const topics_ = undefined;
      const nextQuery_ = {};
      const apiResponse_ = {};

      pubsub.request = (config, callback: Function) => {
        callback(err_, topics_, nextQuery_, apiResponse_);
      };

      pubsub.getTopics((err, topics, apiResponse) => {
        assert.strictEqual(err, err_);
        assert.deepStrictEqual(topics, topics_);
        assert.strictEqual(apiResponse, nextQuery_);
        done();
      });
    });
  });

  describe('request', () => {
    const CONFIG = {
      client: 'PublisherClient',
      method: 'fakeMethod',
      reqOpts: {a: 'a'},
      gaxOpts: {b: 'b'},
    } as pubsubTypes.RequestConfig;

    beforeEach(() => {
      delete pubsub.projectId;
      afterEach(() => sandbox.restore());

      sandbox.stub(pubsub, 'auth').value({
        getProjectId: (callback: Function) => {
          callback(null, PROJECT_ID);
        }
      });

      // tslint:disable-next-line no-any
      pjyOverride = (reqOpts: any) => {
        return reqOpts;
      };
    });

    it('should call getClient_ with the correct config', done => {
      pubsub.getClient_ = config => {
        assert.strictEqual(config, CONFIG);
        done();
      };

      pubsub.request(CONFIG, assert.ifError);
    });

    it('should return error from getClient_', done => {
      const expectedError = new Error('some error');
      pubsub.getClient_ = (config, callback: Function) => {
        callback(expectedError);
      };

      pubsub.request(CONFIG, (err: ServiceError|null) => {
        assert.strictEqual(expectedError, err);
        done();
      });
    });

    it('should call client method with correct options', done => {
      const fakeClient = {};
      // tslint:disable-next-line no-any
      (fakeClient as any).fakeMethod = (reqOpts: any, gaxOpts: CallOptions) => {
        assert.deepStrictEqual(CONFIG.reqOpts, reqOpts);
        assert.deepStrictEqual(CONFIG.gaxOpts, gaxOpts);
        done();
      };
      pubsub.getClient_ = (config, callback: Function) => {
        callback(null, fakeClient);
      };
      pubsub.request(CONFIG, assert.ifError);
    });

    it('should replace the project id token on reqOpts', done => {
      // tslint:disable-next-line no-any
      pjyOverride = (reqOpts: any, projectId: string) => {
        assert.deepStrictEqual(reqOpts, CONFIG.reqOpts);
        assert.strictEqual(projectId, PROJECT_ID);
        done();
      };
      pubsub.request(CONFIG, assert.ifError);
    });
  });

  describe('getClient_', () => {
    const FAKE_CLIENT_INSTANCE = class {};
    const CONFIG = {
      client: 'FakeClient',
    } as {} as pubsubTypes.GetClientConfig;

    beforeEach(() => {
      sandbox.stub(pubsub, 'auth').value({getProjectId: () => util.noop});

      v1ClientOverrides.FakeClient = FAKE_CLIENT_INSTANCE;
    });
    afterEach(() => sandbox.restore());
    describe('project ID', () => {
      beforeEach(() => {
        delete pubsub.projectId;
        pubsub.isEmulator = false;
      });

      it('should get and cache the project ID', done => {
        sandbox.stub(pubsub, 'auth').value({
          getProjectId: (callback: Function) => {
            assert.strictEqual(typeof callback, 'function');
            callback(null, PROJECT_ID);
          }
        });


        pubsub.getClient_(CONFIG, err => {
          assert.ifError(err);
          assert.strictEqual(pubsub.projectId, PROJECT_ID);
          assert.strictEqual(pubsub.options.projectId, PROJECT_ID);
          done();
        });
      });

      it('should get the project ID if placeholder', done => {
        pubsub.projectId = '{{projectId}}';

        sandbox.stub(pubsub, 'auth').value({
          getProjectId: () => {
            done();
          }
        });

        pubsub.getClient_(CONFIG, assert.ifError);
      });

      it('should return errors to the callback', done => {
        const error = new Error('err');
        sandbox.stub(pubsub.auth, 'getProjectId').callsFake(callback => {
          callback(error);
        });

        pubsub.getClient_(CONFIG, err => {
          assert.strictEqual(err, error);
          done();
        });
      });

      it('should not get the project ID if already known', () => {
        pubsub.projectId = PROJECT_ID;

        pubsub.auth.getProjectId = () => {
          throw new Error('getProjectId should not be called.');
        };

        pubsub.getClient_(CONFIG, assert.ifError);
      });

      it('should not get the project ID if inside emulator', () => {
        pubsub.isEmulator = true;

        pubsub.auth.getProjectId = () => {
          throw new Error('getProjectId should not be called.');
        };

        pubsub.getClient_(CONFIG, assert.ifError);
      });
    });

    it('should cache the client', done => {
      delete pubsub.api.fakeClient;

      let numTimesFakeClientInstantiated = 0;

      // tslint:disable-next-line only-arrow-functions
      v1ClientOverrides.FakeClient = function() {
        numTimesFakeClientInstantiated++;
        return FAKE_CLIENT_INSTANCE;
      };

      pubsub.getClient_(CONFIG, err => {
        assert.ifError(err);
        assert.strictEqual(pubsub.api.FakeClient, FAKE_CLIENT_INSTANCE);

        pubsub.getClient_(CONFIG, err => {
          assert.ifError(err);
          assert.strictEqual(numTimesFakeClientInstantiated, 1);
          done();
        });
      });
    });

    it('should return the correct client', done => {
      // tslint:disable-next-line only-arrow-functions no-any
      v1ClientOverrides.FakeClient = function(
          options: pubsubTypes.ClientConfig) {
        assert.strictEqual(options, pubsub.options);
        return FAKE_CLIENT_INSTANCE;
      };

      pubsub.getClient_(CONFIG, (err, client) => {
        assert.ifError(err);
        assert.strictEqual(client, FAKE_CLIENT_INSTANCE);
        done();
      });
    });
  });

  describe('request', () => {
    const CONFIG = {
      client: 'SubscriberClient',
      method: 'fakeMethod',
      reqOpts: {a: 'a'},
      gaxOpts: {},
    } as pubsubTypes.RequestConfig;

    const FAKE_CLIENT_INSTANCE = {
      [CONFIG.method]: util.noop,
    };

    beforeEach(() => {
      // tslint:disable-next-line no-any
      pjyOverride = (reqOpts: any) => {
        return reqOpts;
      };

      pubsub.getClient_ = (config, callback: Function) => {
        callback(null, FAKE_CLIENT_INSTANCE);
      };
    });
    afterEach(() => sandbox.restore());
    it('should get the client', done => {
      pubsub.getClient_ = config => {
        assert.strictEqual(config, CONFIG);
        done();
      };

      pubsub.request(CONFIG, assert.ifError);
    });

    it('should return error from getting the client', done => {
      const error = new Error('Error.');

      pubsub.getClient_ = (config, callback) => {
        callback(error);
      };

      pubsub.request(CONFIG, (err: ServiceError|null) => {
        assert.strictEqual(err, error);
        done();
      });
    });

    it('should replace the project id token on reqOpts', done => {
      // tslint:disable-next-line no-any
      pjyOverride = (reqOpts: any, projectId: string) => {
        assert.deepStrictEqual(reqOpts, CONFIG.reqOpts);
        assert.strictEqual(projectId, PROJECT_ID);
        done();
      };

      pubsub.request(CONFIG, assert.ifError);
    });

    it('should call the client method correctly', done => {
      const CONFIG = {
        client: 'FakeClient',
        method: 'fakeMethod',
        reqOpts: {a: 'a'},
        gaxOpts: {},
      } as {} as pubsubTypes.RequestConfig;

      const replacedReqOpts = {};

      pjyOverride = () => {
        return replacedReqOpts;
      };

      const fakeClient = {
        // tslint:disable-next-line no-any
        fakeMethod(reqOpts: any, gaxOpts: CallOptions) {
          assert.strictEqual(reqOpts, replacedReqOpts);
          assert.strictEqual(gaxOpts, CONFIG.gaxOpts);
          done();
        },
      };

      pubsub.getClient_ = (config, callback: Function) => {
        callback(null, fakeClient);
      };

      pubsub.request(CONFIG, assert.ifError);
    });
  });

  describe('snapshot', () => {
    it('should throw if a name is not provided', () => {
      assert.throws(() => {
        // tslint:disable-next-line no-any
        (pubsub as any).snapshot();
      }, /You must supply a valid name for the snapshot\./);
    });

    it('should return a Snapshot object', () => {
      const SNAPSHOT_NAME = 'new-snapshot';
      const snapshot = pubsub.snapshot(SNAPSHOT_NAME);
      const args = (snapshot as {} as FakeSnapshot).calledWith_;

      assert(snapshot instanceof FakeSnapshot);
      assert.strictEqual(args[0], pubsub);
      assert.strictEqual(args[1], SNAPSHOT_NAME);
    });
  });

  describe('subscription', () => {
    const SUB_NAME = 'new-sub-name';
    const CONFIG = {};

    it('should return a Subscription object', () => {
      // tslint:disable-next-line only-arrow-functions
      subscriptionOverride = function() {};
      const subscription = pubsub.subscription(SUB_NAME, {});
      assert(subscription instanceof subscriptionOverride);
    });

    it('should pass specified name to the Subscription', done => {
      // tslint:disable-next-line only-arrow-functions
      subscriptionOverride = function(
          pubsub: pubsubTypes.PubSub, name: string) {
        assert.strictEqual(name, SUB_NAME);
        done();
      };
      pubsub.subscription(SUB_NAME);
    });

    it('should honor settings', done => {
      // tslint:disable-next-line only-arrow-functions
      subscriptionOverride = function(
          pubsub: pubsubTypes.PubSub, name: string,
          options: subby.SubscriptionOptions) {
        assert.strictEqual(options, CONFIG);
        done();
      };
      pubsub.subscription(SUB_NAME, CONFIG);
    });

    it('should throw if a name is not provided', () => {
      assert.throws(() => {
        // tslint:disable-next-line no-any
        return (pubsub as any).subscription();
      }, /A name must be specified for a subscription\./);
    });
  });

  describe('topic', () => {
    it('should throw if a name is not provided', () => {
      assert.throws(() => {
        // tslint:disable-next-line no-any
        (pubsub as any).topic();
      }, /A name must be specified for a topic\./);
    });

    it('should return a Topic object', () => {
      assert(pubsub.topic('new-topic') instanceof FakeTopic);
    });

    it('should pass the correct args', () => {
      const fakeName = 'with-options';
      const fakeOptions = {};
      const topic = pubsub.topic(fakeName, fakeOptions);

      const [ps, name, options] = (topic as {} as FakeTopic).calledWith_;

      assert.strictEqual(ps, pubsub);
      assert.strictEqual(name, fakeName);
      assert.strictEqual(options, fakeOptions);
    });
  });
});
