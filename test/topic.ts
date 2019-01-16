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

import * as pfy from '@google-cloud/promisify';
import * as assert from 'assert';
import * as proxyquire from 'proxyquire';
import * as sinon from 'sinon';

import * as util from '../src/util';

let promisified = false;
const fakePromisify = Object.assign({}, pfy, {
  promisifyAll: (klass, options) => {
    if (klass.name !== 'Topic') {
      return;
    }
    promisified = true;
    assert.deepStrictEqual(
        options.exclude,
        ['publish', 'publishJSON', 'setPublishOptions', 'subscription']);
  },
});

class FakeIAM {
  // tslint:disable-next-line no-any
  calledWith_: any[];
  // tslint:disable-next-line no-any
  constructor(...args: any[]) {
    this.calledWith_ = args;
  }
}

class FakePublisher {
  // tslint:disable-next-line no-any
  calledWith_: any[];
  // tslint:disable-next-line no-any
  published_!: any[];
  options_!: object;
  // tslint:disable-next-line no-any
  constructor(...args: any[]) {
    this.calledWith_ = args;
  }
  // tslint:disable-next-line no-any
  publish(...args: any[]) {
    this.published_ = args;
  }
  setOptions(options: object) {
    this.options_ = options;
  }
}

let extended = false;
const fakePaginator = {
  // tslint:disable-next-line variable-name
  extend(Class, methods) {
    if (Class.name !== 'Topic') {
      return;
    }

    assert.deepStrictEqual(methods, ['getSubscriptions']);
    extended = true;
  },
  streamify(methodName) {
    return methodName;
  },
};

describe('Topic', () => {
  // tslint:disable-next-line no-any variable-name
  let Topic: any;
  // tslint:disable-next-line no-any
  let topic: any;

  const PROJECT_ID = 'test-project';
  const TOPIC_NAME = 'projects/' + PROJECT_ID + '/topics/test-topic';
  const TOPIC_UNFORMATTED_NAME = TOPIC_NAME.split('/').pop();

  // tslint:disable-next-line no-any
  const PUBSUB: any = {
    Promise: {},
    projectId: PROJECT_ID,
    createTopic: util.noop,
    request: util.noop,
  };

  before(() => {
    Topic = proxyquire('../src/topic.js', {
              '@google-cloud/promisify': fakePromisify,
              '@google-cloud/paginator': {
                paginator: fakePaginator,
              },
              './iam': {IAM: FakeIAM},
              './publisher': {Publisher: FakePublisher},
            }).Topic;
  });

  const sandbox = sinon.createSandbox();
  beforeEach(() => {
    topic = new Topic(PUBSUB, TOPIC_NAME);
    topic.parent = PUBSUB;
  });
  afterEach(() => sandbox.restore());

  describe('initialization', () => {
    it('should extend the correct methods', () => {
      assert(extended);  // See `fakePaginator.extend`
    });

    it('should streamify the correct methods', () => {
      assert.strictEqual(topic.getSubscriptionsStream, 'getSubscriptions');
    });

    it('should promisify all the things', () => {
      assert(promisified);
    });

    it('should localize pubsub.Promise', () => {
      assert.strictEqual(topic.Promise, PUBSUB.Promise);
    });

    it('should format the name', () => {
      const formattedName = 'a/b/c/d';

      const formatName_ = Topic.formatName_;
      Topic.formatName_ = (projectId, name) => {
        assert.strictEqual(projectId, PROJECT_ID);
        assert.strictEqual(name, TOPIC_NAME);

        Topic.formatName_ = formatName_;

        return formattedName;
      };

      const topic = new Topic(PUBSUB, TOPIC_NAME);
      assert.strictEqual(topic.name, formattedName);
    });

    it('should create a publisher', () => {
      const fakeOptions = {};
      const topic = new Topic(PUBSUB, TOPIC_NAME, fakeOptions);

      const [t, options] = topic.publisher.calledWith_;

      assert.strictEqual(t, topic);
      assert.strictEqual(options, fakeOptions);
    });

    it('should localize the parent object', () => {
      assert.strictEqual(topic.parent, PUBSUB);
      assert.strictEqual(topic.pubsub, PUBSUB);
    });

    it('should localize the request function', done => {
      PUBSUB.request = callback => {
        callback();  // the done fn
      };

      const topic = new Topic(PUBSUB, TOPIC_NAME);
      topic.request(done);
    });

    it('should create an iam object', () => {
      assert.deepStrictEqual(topic.iam.calledWith_, [PUBSUB, TOPIC_NAME]);
    });
  });

  describe('formatName_', () => {
    it('should format name', () => {
      const formattedName =
          Topic.formatName_(PROJECT_ID, TOPIC_UNFORMATTED_NAME);
      assert.strictEqual(formattedName, TOPIC_NAME);
    });

    it('should format name when given a complete name', () => {
      const formattedName = Topic.formatName_(PROJECT_ID, TOPIC_NAME);
      assert.strictEqual(formattedName, TOPIC_NAME);
    });
  });

  describe('create', () => {
    it('should call the parent createTopic method', done => {
      const options_ = {};

      PUBSUB.createTopic = (name, options, callback) => {
        assert.strictEqual(name, topic.name);
        assert.strictEqual(options, options_);
        callback();  // the done fn
      };

      topic.create(options_, done);
    });
  });

  describe('createSubscription', () => {
    it('should call the parent createSubscription method', done => {
      const NAME = 'sub-name';
      const OPTIONS = {a: 'a'};

      PUBSUB.createSubscription = (topic_, name, options, callback) => {
        assert.strictEqual(topic_, topic);
        assert.strictEqual(name, NAME);
        assert.strictEqual(options, OPTIONS);
        callback();  // the done fn
      };

      topic.createSubscription(NAME, OPTIONS, done);
    });
  });

  describe('delete', () => {
    it('should make the proper request', done => {
      topic.request = (config, callback) => {
        assert.strictEqual(config.client, 'PublisherClient');
        assert.strictEqual(config.method, 'deleteTopic');
        assert.deepStrictEqual(config.reqOpts, {topic: topic.name});
        callback();  // the done fn
      };

      topic.delete(done);
    });

    it('should optionally accept gax options', done => {
      const options = {};

      topic.request = (config, callback) => {
        assert.strictEqual(config.gaxOpts, options);
        callback();  // the done fn
      };

      topic.delete(options, done);
    });

    it('should optionally accept a callback', done => {
      sandbox.stub(util, 'noop').callsFake(done);
      topic.request = (config, callback) => {
        callback();  // the done fn
      };
      topic.delete();
    });
  });

  describe('get', () => {
    it('should delete the autoCreate option', done => {
      const options = {
        autoCreate: true,
        a: 'a',
      };

      topic.getMetadata = gaxOpts => {
        assert.strictEqual(gaxOpts, options);
        assert.strictEqual(gaxOpts.autoCreate, undefined);
        done();
      };

      topic.get(options, assert.ifError);
    });

    describe('success', () => {
      const fakeMetadata = {};

      beforeEach(() => {
        topic.getMetadata = (gaxOpts, callback) => {
          callback(null, fakeMetadata);
        };
      });

      it('should call through to getMetadata', done => {
        topic.get((err, _topic, resp) => {
          assert.ifError(err);
          assert.strictEqual(_topic, topic);
          assert.strictEqual(resp, fakeMetadata);
          done();
        });
      });

      it('should optionally accept options', done => {
        const options = {};

        topic.getMetadata = (gaxOpts, callback) => {
          assert.strictEqual(gaxOpts, options);
          callback();  // the done fn
        };

        topic.get(options, done);
      });
    });

    describe('error', () => {
      it('should pass back errors when not auto-creating', done => {
        const error = {code: 4};
        const apiResponse = {};

        topic.getMetadata = (gaxOpts, callback) => {
          callback(error, apiResponse);
        };

        topic.get((err, _topic, resp) => {
          assert.strictEqual(err, error);
          assert.strictEqual(_topic, null);
          assert.strictEqual(resp, apiResponse);
          done();
        });
      });

      it('should pass back 404 errors if autoCreate is false', done => {
        const error = {code: 5};
        const apiResponse = {};

        topic.getMetadata = (gaxOpts, callback) => {
          callback(error, apiResponse);
        };

        topic.get((err, _topic, resp) => {
          assert.strictEqual(err, error);
          assert.strictEqual(_topic, null);
          assert.strictEqual(resp, apiResponse);
          done();
        });
      });

      it('should create the topic if 404 + autoCreate is true', done => {
        const error = {code: 5};
        const apiResponse = {};

        const fakeOptions = {
          autoCreate: true,
        };

        topic.getMetadata = (gaxOpts, callback) => {
          callback(error, apiResponse);
        };

        topic.create = (options, callback) => {
          assert.strictEqual(options, fakeOptions);
          callback();  // the done fn
        };

        topic.get(fakeOptions, done);
      });
    });
  });

  describe('exists', () => {
    it('should return true if it finds metadata', done => {
      topic.getMetadata = callback => {
        callback(null, {});
      };

      topic.exists((err, exists) => {
        assert.ifError(err);
        assert(exists);
        done();
      });
    });

    it('should return false if a not found error occurs', done => {
      topic.getMetadata = callback => {
        callback({code: 5});
      };

      topic.exists((err, exists) => {
        assert.ifError(err);
        assert.strictEqual(exists, false);
        done();
      });
    });

    it('should pass back any other type of error', done => {
      const error = {code: 4};

      topic.getMetadata = callback => {
        callback(error);
      };

      topic.exists((err, exists) => {
        assert.strictEqual(err, error);
        assert.strictEqual(exists, undefined);
        done();
      });
    });
  });

  describe('getMetadata', () => {
    it('should make the proper request', done => {
      topic.request = config => {
        assert.strictEqual(config.client, 'PublisherClient');
        assert.strictEqual(config.method, 'getTopic');
        assert.deepStrictEqual(config.reqOpts, {topic: topic.name});
        done();
      };

      topic.getMetadata(assert.ifError);
    });

    it('should optionally accept gax options', done => {
      const options = {};

      topic.request = config => {
        assert.strictEqual(config.gaxOpts, options);
        done();
      };

      topic.getMetadata(options, assert.ifError);
    });

    it('should pass back any errors that occur', done => {
      const error = new Error('err');
      const apiResponse = {};

      topic.request = (config, callback) => {
        callback(error, apiResponse);
      };

      topic.getMetadata((err, metadata) => {
        assert.strictEqual(err, error);
        assert.strictEqual(metadata, apiResponse);
        done();
      });
    });

    it('should set the metadata if no error occurs', done => {
      const apiResponse = {};

      topic.request = (config, callback) => {
        callback(null, apiResponse);
      };

      topic.getMetadata((err, metadata) => {
        assert.ifError(err);
        assert.strictEqual(metadata, apiResponse);
        assert.strictEqual(topic.metadata, apiResponse);
        done();
      });
    });
  });

  describe('getSubscriptions', () => {
    it('should make the correct request', done => {
      const options = {
        a: 'a',
        b: 'b',
        gaxOpts: {
          e: 'f',
        },
        autoPaginate: false,
      };

      const expectedOptions = Object.assign(
          {
            topic: topic.name,
          },
          options);

      const expectedGaxOpts = Object.assign(
          {
            autoPaginate: options.autoPaginate,
          },
          options.gaxOpts);

      delete expectedOptions.gaxOpts;
      delete expectedOptions.autoPaginate;

      topic.request = config => {
        assert.strictEqual(config.client, 'PublisherClient');
        assert.strictEqual(config.method, 'listTopicSubscriptions');
        assert.deepStrictEqual(config.reqOpts, expectedOptions);
        assert.deepStrictEqual(config.gaxOpts, expectedGaxOpts);
        done();
      };

      topic.getSubscriptions(options, assert.ifError);
    });

    it('should accept only a callback', done => {
      topic.request = config => {
        assert.deepStrictEqual(config.reqOpts, {topic: topic.name});
        assert.deepStrictEqual(config.gaxOpts, {autoPaginate: undefined});
        done();
      };

      topic.getSubscriptions(assert.ifError);
    });

    it('should create subscription objects', done => {
      const fakeSubs = ['a', 'b', 'c'];

      topic.subscription = name => {
        return {
          name,
        };
      };

      topic.request = (config, callback) => {
        callback(null, fakeSubs);
      };

      topic.getSubscriptions((err, subscriptions) => {
        assert.ifError(err);
        assert.deepStrictEqual(subscriptions, [
          {name: 'a'},
          {name: 'b'},
          {name: 'c'},
        ]);
        done();
      });
    });

    it('should pass all params to the callback', done => {
      const err_ = new Error('err');
      const subs_ = false;
      const nextQuery_ = {};
      const apiResponse_ = {};

      topic.request = (config, callback) => {
        callback(err_, subs_, nextQuery_, apiResponse_);
      };

      topic.getSubscriptions((err, subs, nextQuery, apiResponse) => {
        assert.strictEqual(err, err_);
        assert.deepStrictEqual(subs, subs_);
        assert.strictEqual(nextQuery, nextQuery_);
        assert.strictEqual(apiResponse, apiResponse_);
        done();
      });
    });
  });

  describe('publish', () => {
    it('should call through to Publisher#publish', () => {
      const data = Buffer.from('Hello, world!');
      const attributes = {};
      const callback = () => {};

      const fakePromise = Promise.resolve();
      const stub = sandbox.stub(topic.publisher, 'publish')
                       .withArgs(data, attributes, callback)
                       .returns(fakePromise);

      const promise = topic.publish(data, attributes, callback);
      assert.strictEqual(promise, fakePromise);
    });
  });

  describe('publishJSON', () => {
    it('should throw an error for non-object types', () => {
      const expectedError = /First parameter should be an object\./;

      assert.throws(() => topic.publishJSON('hi'), expectedError);
    });

    it('should transform JSON into a Buffer', () => {
      const stub = sandbox.stub(topic, 'publish');
      const json = {foo: 'bar'};
      const expectedBuffer = Buffer.from(JSON.stringify(json));

      topic.publishJSON(json);

      const [buffer] = stub.lastCall.args;
      assert.deepStrictEqual(buffer, expectedBuffer);
    });

    it('should pass along the attributes and callback', () => {
      const stub = sandbox.stub(topic, 'publish');
      const fakeAttributes = {};
      const fakeCallback = () => {};

      topic.publishJSON({}, fakeAttributes, fakeCallback);

      const [, attributes, callback] = stub.lastCall.args;
      assert.strictEqual(attributes, fakeAttributes);
      assert.strictEqual(callback, fakeCallback);
    });
  });

  describe('setPublishOptions', () => {
    it('should call through to Publisher#setOptions', () => {
      const fakeOptions = {};
      const stub =
          sandbox.stub(topic.publisher, 'setOptions').withArgs(fakeOptions);

      topic.setPublishOptions(fakeOptions);

      assert.strictEqual(stub.callCount, 1);
    });
  });

  describe('subscription', () => {
    it('should pass correct arguments to pubsub#subscription', done => {
      const subscriptionName = 'subName';
      const opts = {};

      topic.parent.subscription = (name, options) => {
        assert.strictEqual(name, subscriptionName);
        assert.deepStrictEqual(options, opts);
        done();
      };

      topic.subscription(subscriptionName, opts);
    });

    it('should attach the topic instance to the options', done => {
      topic.parent.subscription = (name, options) => {
        assert.strictEqual(options.topic, topic);
        done();
      };

      topic.subscription();
    });

    it('should return the result', done => {
      topic.parent.subscription = () => {
        return done;
      };

      const doneFn = topic.subscription();
      doneFn();
    });
  });
});
