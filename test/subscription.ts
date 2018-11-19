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

import * as assert from 'assert';
import * as util from '../src/util';
import * as proxyquire from 'proxyquire';
import * as pfy from '@google-cloud/promisify';
import * as sinon from 'sinon';

let promisified = false;
const fakePromisify = Object.assign({}, pfy, {
  promisifyAll: (klass, options) => {
    if (klass.name !== 'Subscription') {
      return;
    }
    promisified = true;
    assert.deepStrictEqual(options.exclude, ['snapshot']);
  },
});

class FakeIAM {
  calledWith_: IArguments;
  constructor() {
    this.calledWith_ = [].slice.call(arguments);
  }
}

class FakeSnapshot {
  calledWith_: IArguments;
  static formatName_?: Function;
  constructor() {
    this.calledWith_ = [].slice.call(arguments);
  }
}

class FakeSubscriber {
  calledWith_: IArguments;
  constructor() {
    this.calledWith_ = [].slice.call(arguments);
  }
}

describe('Subscription', function() {
  // tslint:disable-next-line no-any variable-name
  let Subscription: any;
  // tslint:disable-next-line no-any
  let subscription: any;

  const PROJECT_ID = 'test-project';
  const SUB_NAME = 'test-subscription';
  const SUB_FULL_NAME = 'projects/' + PROJECT_ID + '/subscriptions/' + SUB_NAME;

  // tslint:disable-next-line no-any
  const PUBSUB: any = {
    projectId: PROJECT_ID,
    Promise: {},
    request: util.noop,
  };

  before(function() {
    Subscription = proxyquire('../src/subscription.js', {
      '@google-cloud/promisify': fakePromisify,
      './iam.js': {IAM: FakeIAM},
      './snapshot.js': {Snapshot: FakeSnapshot},
      './subscriber.js': {Subscriber: FakeSubscriber},
    }).Subscription;
  });

  const sandbox = sinon.createSandbox();
  beforeEach(function() {
    PUBSUB.request = util.noop;
    subscription = new Subscription(PUBSUB, SUB_NAME);
  });

  afterEach(() => sandbox.restore());

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

      const subscription = new Subscription(PUBSUB, SUB_NAME);
      subscription.request(done);
    });

    it('should format the sub name', function() {
      const formattedName = 'a/b/c/d';
      const formatName = Subscription.formatName_;

      Subscription.formatName_ = function(projectId, name) {
        assert.strictEqual(projectId, PROJECT_ID);
        assert.strictEqual(name, SUB_NAME);

        Subscription.formatName_ = formatName;

        return formattedName;
      };

      const subscription = new Subscription(PUBSUB, SUB_NAME);
      assert.strictEqual(subscription.name, formattedName);
    });

    it('should make a create method if a topic is found', function(done) {
      const TOPIC_NAME = 'test-topic';

      PUBSUB.createSubscription = function(topic, subName, callback) {
        assert.strictEqual(topic, TOPIC_NAME);
        assert.strictEqual(subName, SUB_NAME);
        callback(); // the done function
      };

      const subscription = new Subscription(PUBSUB, SUB_NAME, {
        topic: TOPIC_NAME,
      });

      subscription.create(done);
    });

    it('should create an IAM object', function() {
      assert(subscription.iam instanceof FakeIAM);

      const args = subscription.iam.calledWith_;

      assert.strictEqual(args[0], PUBSUB);
      assert.strictEqual(args[1], subscription.name);
    });

    it('should inherit from Subscriber', function() {
      const options = {};
      const subscription = new Subscription(PUBSUB, SUB_NAME, options);

      assert(subscription instanceof FakeSubscriber);
      assert.strictEqual(subscription.calledWith_[0], options);
    });
  });

  describe('formatMetadata_', function() {
    it('should make a copy of the metadata', function() {
      const metadata = {a: 'a'};
      const formatted = Subscription.formatMetadata_(metadata);

      assert.deepStrictEqual(metadata, formatted);
      assert.notStrictEqual(metadata, formatted);
    });

    it('should format messageRetentionDuration', function() {
      const threeDaysInSeconds = 3 * 24 * 60 * 60;

      const metadata = {
        messageRetentionDuration: threeDaysInSeconds,
      };

      const formatted = Subscription.formatMetadata_(metadata);

      assert.strictEqual(formatted.retainAckedMessages, true);
      assert.strictEqual(formatted.messageRetentionDuration.nanos, 0);

      assert.strictEqual(
        formatted.messageRetentionDuration.seconds,
        threeDaysInSeconds
      );
    });

    it('should format pushEndpoint', function() {
      const pushEndpoint = 'http://noop.com/push';

      const metadata = {
        pushEndpoint: pushEndpoint,
      };

      const formatted = Subscription.formatMetadata_(metadata);

      assert.strictEqual(formatted.pushConfig.pushEndpoint, pushEndpoint);
      assert.strictEqual(formatted.pushEndpoint, undefined);
    });
  });

  describe('formatName_', function() {
    it('should format name', function() {
      const formattedName = Subscription.formatName_(PROJECT_ID, SUB_NAME);
      assert.strictEqual(formattedName, SUB_FULL_NAME);
    });

    it('should format name when given a complete name', function() {
      const formattedName = Subscription.formatName_(PROJECT_ID, SUB_FULL_NAME);
      assert.strictEqual(formattedName, SUB_FULL_NAME);
    });
  });

  describe('createSnapshot', function() {
    const SNAPSHOT_NAME = 'test-snapshot';

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
        assert.deepStrictEqual(config.reqOpts, {
          name: SNAPSHOT_NAME,
          subscription: subscription.name,
        });
        done();
      };

      subscription.createSnapshot(SNAPSHOT_NAME, assert.ifError);
    });

    it('should optionally accept gax options', function(done) {
      const gaxOpts = {};

      subscription.request = function(config) {
        assert.strictEqual(config.gaxOpts, gaxOpts);
        done();
      };

      subscription.createSnapshot(SNAPSHOT_NAME, gaxOpts, assert.ifError);
    });

    it('should pass back any errors to the callback', function(done) {
      const error = new Error('err');
      const apiResponse = {};

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
      const apiResponse = {};
      const fakeSnapshot = {};

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
      subscription.removeAllListeners = util.noop;
      subscription.close = util.noop;
    });

    it('should make the correct request', function(done) {
      subscription.request = function(config) {
        assert.strictEqual(config.client, 'SubscriberClient');
        assert.strictEqual(config.method, 'deleteSubscription');
        assert.deepStrictEqual(config.reqOpts, {
          subscription: subscription.name,
        });
        done();
      };

      subscription.delete(assert.ifError);
    });

    it('should optionally accept gax options', function(done) {
      const gaxOpts = {};

      subscription.request = function(config) {
        assert.strictEqual(config.gaxOpts, gaxOpts);
        done();
      };

      subscription.delete(gaxOpts, assert.ifError);
    });

    describe('success', function() {
      const apiResponse = {};

      beforeEach(function() {
        subscription.request = function(config, callback) {
          callback(null, apiResponse);
        };
      });

      it('should optionally accept a callback', function(done) {
        // @ts-ignore TS2345: Argument of type '(err: any, resp: any) => void' is not assignable to parameter of type '() => void'.
        sandbox.stub(util, 'noop').callsFake((err, resp) => {
          assert.ifError(err);
          assert.strictEqual(resp, apiResponse);
          done();
        });
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
        let called = false;

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
        let called = false;

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
      const error = new Error('err');

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
      const error = {code: 4};

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
      subscription.create = util.noop;
    });

    it('should delete the autoCreate option', function(done) {
      const options = {
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
      const fakeMetadata = {};

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
        const options = {};

        subscription.getMetadata = function(gaxOpts, callback) {
          assert.strictEqual(gaxOpts, options);
          callback(); // the done fn
        };

        subscription.get(options, done);
      });
    });

    describe('error', function() {
      it('should pass back errors when not auto-creating', function(done) {
        const error = {code: 4};
        const apiResponse = {};

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
        const error = {code: 5};
        const apiResponse = {};

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
        const error = {code: 5};
        const apiResponse = {};

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
        const error = {code: 5};
        const apiResponse = {};

        const fakeOptions = {
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
        assert.deepStrictEqual(config.reqOpts, {
          subscription: subscription.name,
        });
        done();
      };

      subscription.getMetadata(assert.ifError);
    });

    it('should optionally accept gax options', function(done) {
      const gaxOpts = {};

      subscription.request = function(config) {
        assert.strictEqual(config.gaxOpts, gaxOpts);
        done();
      };

      subscription.getMetadata(gaxOpts, assert.ifError);
    });

    it('should pass back any errors that occur', function(done) {
      const error = new Error('err');
      const apiResponse = {};

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
      const apiResponse = {};

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
    const fakeConfig = {};

    it('should make the correct request', function(done) {
      subscription.request = function(config, callback) {
        assert.strictEqual(config.client, 'SubscriberClient');
        assert.strictEqual(config.method, 'modifyPushConfig');
        assert.deepStrictEqual(config.reqOpts, {
          subscription: subscription.name,
          pushConfig: fakeConfig,
        });
        callback(); // the done fn
      };

      subscription.modifyPushConfig(fakeConfig, done);
    });

    it('should optionally accept gaxOpts', function(done) {
      const gaxOpts = {};

      subscription.request = function(config, callback) {
        assert.strictEqual(config.gaxOpts, gaxOpts);
        callback(); // the done fn
      };

      subscription.modifyPushConfig(fakeConfig, gaxOpts, done);
    });
  });

  describe('seek', function() {
    const FAKE_SNAPSHOT_NAME = 'a';
    const FAKE_FULL_SNAPSHOT_NAME = 'a/b/c/d';

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
        assert.deepStrictEqual(config.reqOpts, {
          subscription: subscription.name,
          snapshot: FAKE_FULL_SNAPSHOT_NAME,
        });
        callback(); // the done fn
      };

      subscription.seek(FAKE_SNAPSHOT_NAME, done);
    });

    it('should optionally accept a Date object', function(done) {
      const date = new Date();

      subscription.request = function(config, callback) {
        assert.strictEqual(config.reqOpts.time, date);
        callback(); // the done fn
      };

      subscription.seek(date, done);
    });

    it('should optionally accept gax options', function(done) {
      const gaxOpts = {};

      subscription.request = function(config, callback) {
        assert.strictEqual(config.gaxOpts, gaxOpts);
        callback(); // the done fn
      };

      subscription.seek(FAKE_SNAPSHOT_NAME, gaxOpts, done);
    });
  });

  describe('setMetadata', function() {
    const METADATA = {
      pushEndpoint: 'http://noop.com/push',
    };

    beforeEach(function() {
      Subscription.formatMetadata_ = function(metadata) {
        return Object.assign({}, metadata);
      };
    });

    it('should make the correct request', function(done) {
      const formattedMetadata = {
        pushConfig: {
          pushEndpoint: METADATA.pushEndpoint,
        },
      };

      const expectedBody = Object.assign(
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
        assert.deepStrictEqual(config.reqOpts.subscription, expectedBody);
        assert.deepStrictEqual(config.reqOpts.updateMask, {
          paths: ['push_config'],
        });
        callback(); // the done fn
      };

      subscription.setMetadata(METADATA, done);
    });

    it('should optionally accept gax options', function(done) {
      const gaxOpts = {};

      subscription.request = function(config, callback) {
        assert.strictEqual(config.gaxOpts, gaxOpts);
        callback(); // the done fn
      };

      subscription.setMetadata(METADATA, gaxOpts, done);
    });
  });

  describe('snapshot', function() {
    const SNAPSHOT_NAME = 'a';

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
