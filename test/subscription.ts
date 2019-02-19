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
import {EventEmitter} from 'events';
import {ServiceError} from 'grpc';
import * as proxyquire from 'proxyquire';
import * as sinon from 'sinon';

import {google} from '../proto/pubsub';
import {CreateSubscriptionCallback, ExistsCallback, GetCallOptions, GetSubscriptionMetadataCallback, RequestCallback, RequestConfig, SeekCallback, Subscription} from '../src';
import {Snapshot} from '../src/snapshot';
import {Message, SubscriberOptions} from '../src/subscriber';
import {SubscriptionMetadataRaw} from '../src/subscription';
import * as util from '../src/util';

let promisified = false;
const fakePromisify = Object.assign({}, pfy, {
  promisifyAll: (klass: Function, options: pfy.PromisifyAllOptions) => {
    if (klass.name !== 'Subscription') {
      return;
    }
    promisified = true;
    assert.deepStrictEqual(options.exclude, ['open', 'snapshot']);
  },
});

class FakeIAM {
  calledWith_: IArguments;
  constructor() {
    this.calledWith_ = arguments;
  }
}

class FakeSnapshot {
  calledWith_: IArguments;
  static formatName_?: Function;
  constructor() {
    this.calledWith_ = arguments;
  }
}

let subscriber: FakeSubscriber;

class FakeSubscriber extends EventEmitter {
  calledWith_: IArguments;
  isOpen = false;
  constructor() {
    super();
    this.calledWith_ = arguments;
    subscriber = this;
  }
  open(): void {
    this.isOpen = true;
  }
  async close(): Promise<void> {
    this.isOpen = false;
  }
  setOptions(options: SubscriberOptions): void {}
}

describe('Subscription', () => {
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

  before(() => {
    Subscription = proxyquire('../src/subscription.js', {
                     '@google-cloud/promisify': fakePromisify,
                     './iam.js': {IAM: FakeIAM},
                     './snapshot.js': {Snapshot: FakeSnapshot},
                     './subscriber.js': {Subscriber: FakeSubscriber},
                   }).Subscription;
  });

  const sandbox = sinon.createSandbox();
  beforeEach(() => {
    PUBSUB.request = util.noop;
    subscription = new Subscription(PUBSUB, SUB_NAME);
  });

  afterEach(() => sandbox.restore());

  describe('initialization', () => {
    it('should promisify all the things', () => {
      assert(promisified);
    });

    it('should localize the pubsub object', () => {
      assert.strictEqual(subscription.pubsub, PUBSUB);
    });

    it('should localize the project id', () => {
      assert.strictEqual(subscription.projectId, PROJECT_ID);
    });

    it('should localize pubsub request method', done => {
      PUBSUB.request = (callback: CreateSubscriptionCallback) => {
        callback();  // the done fn
      };

      const subscription = new Subscription(PUBSUB, SUB_NAME);
      subscription.request(done);
    });

    it('should format the sub name', () => {
      const formattedName = 'a/b/c/d';
      const formatName = Subscription.formatName_;

      Subscription.formatName_ = (projectId: string, name: string) => {
        assert.strictEqual(projectId, PROJECT_ID);
        assert.strictEqual(name, SUB_NAME);

        Subscription.formatName_ = formatName;

        return formattedName;
      };

      const subscription = new Subscription(PUBSUB, SUB_NAME);
      assert.strictEqual(subscription.name, formattedName);
    });

    it('should make a create method if a topic is found', done => {
      const TOPIC_NAME = 'test-topic';

      PUBSUB.createSubscription =
          (topic: string, subName: string,
           callback: CreateSubscriptionCallback) => {
            assert.strictEqual(topic, TOPIC_NAME);
            assert.strictEqual(subName, SUB_NAME);
            callback();  // the done function
          };

      const subscription = new Subscription(PUBSUB, SUB_NAME, {
        topic: TOPIC_NAME,
      });

      subscription.create(done);
    });

    it('should create an IAM object', () => {
      assert(subscription.iam instanceof FakeIAM);
      const args = subscription.iam.calledWith_;
      assert.strictEqual(args[0], PUBSUB);
      assert.strictEqual(args[1], subscription.name);
    });

    it('should create a Subscriber', () => {
      const options = {};
      const subscription = new Subscription(PUBSUB, SUB_NAME, options);

      const [sub, opts] = subscriber.calledWith_;
      assert.strictEqual(sub, subscription);
      assert.strictEqual(opts, options);
    });

    it('should open the subscriber when a listener is attached', () => {
      const stub = sandbox.stub(subscriber, 'open');

      subscription.on('message', () => {});
      assert.strictEqual(stub.callCount, 1);
    });

    it('should close the subscriber when no listeners are attached', () => {
      const stub = sandbox.stub(subscriber, 'close');
      const cb = () => {};

      subscription.on('message', cb);
      subscription.removeListener('message', cb);

      assert.strictEqual(stub.callCount, 1);
    });

    it('should emit messages', done => {
      const message = {};

      subscription.on('message', (msg: Message) => {
        assert.strictEqual(msg, message);
        done();
      });

      subscriber.emit('message', message);
    });

    it('should emit errors', done => {
      const error = new Error('err');

      subscription.on('error', (err: Error) => {
        assert.strictEqual(err, error);
        done();
      });

      subscriber.emit('error', error);
    });

    it('should emit close events', done => {
      subscription.on('close', done);
      subscriber.emit('close');
    });
  });

  describe('formatMetadata_', () => {
    it('should make a copy of the metadata', () => {
      const metadata = {a: 'a'};
      const formatted = Subscription.formatMetadata_(metadata);

      assert.deepStrictEqual(metadata, formatted);
      assert.notStrictEqual(metadata, formatted);
    });

    it('should format messageRetentionDuration', () => {
      const threeDaysInSeconds = 3 * 24 * 60 * 60;

      const metadata = {
        messageRetentionDuration: threeDaysInSeconds,
      };

      const formatted = Subscription.formatMetadata_(metadata);

      assert.strictEqual(formatted.retainAckedMessages, true);
      assert.strictEqual(formatted.messageRetentionDuration.nanos, 0);

      assert.strictEqual(
          formatted.messageRetentionDuration.seconds, threeDaysInSeconds);
    });

    it('should format pushEndpoint', () => {
      const pushEndpoint = 'http://noop.com/push';

      const metadata = {
        pushEndpoint,
      };

      const formatted = Subscription.formatMetadata_(metadata);

      assert.strictEqual(formatted.pushConfig.pushEndpoint, pushEndpoint);
      assert.strictEqual(formatted.pushEndpoint, undefined);
    });
  });

  describe('formatName_', () => {
    it('should format name', () => {
      const formattedName = Subscription.formatName_(PROJECT_ID, SUB_NAME);
      assert.strictEqual(formattedName, SUB_FULL_NAME);
    });

    it('should format name when given a complete name', () => {
      const formattedName = Subscription.formatName_(PROJECT_ID, SUB_FULL_NAME);
      assert.strictEqual(formattedName, SUB_FULL_NAME);
    });
  });

  describe('close', () => {
    it('should call the success callback', done => {
      sandbox.stub(subscriber, 'close').resolves();
      subscription.close(done);
    });

    it('should pass back any errors that occurs', done => {
      const fakeErr = new Error('err');

      sandbox.stub(subscriber, 'close').rejects(fakeErr);

      subscription.close((err: Error) => {
        assert.strictEqual(err, fakeErr);
        done();
      });
    });
  });

  describe('createSnapshot', () => {
    const SNAPSHOT_NAME = 'test-snapshot';

    beforeEach(() => {
      subscription.snapshot = (name: string) => {
        return {
          name,
        };
      };
    });

    it('should throw an error if a snapshot name is not found', () => {
      assert.throws(() => {
        subscription.createSnapshot();
      }, /A name is required to create a snapshot\./);
    });

    it('should make the correct request', done => {
      subscription.request = (config: RequestConfig) => {
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

    it('should optionally accept gax options', done => {
      const gaxOpts = {};

      subscription.request = (config: RequestConfig) => {
        assert.strictEqual(config.gaxOpts, gaxOpts);
        done();
      };

      subscription.createSnapshot(SNAPSHOT_NAME, gaxOpts, assert.ifError);
    });

    it('should pass back any errors to the callback', done => {
      const error = new Error('err');
      const apiResponse = {};

      subscription.request =
          (config: RequestConfig,
           callback: RequestCallback<google.pubsub.v1.ISnapshot>) => {
            callback(error, apiResponse);
          };

      subscription.createSnapshot(
          SNAPSHOT_NAME,
          (err: Error, snapshot: Snapshot,
           resp: google.pubsub.v1.ISnapshot) => {
            assert.strictEqual(err, error);
            assert.strictEqual(snapshot, null);
            assert.strictEqual(resp, apiResponse);
            done();
          });
    });

    it('should return a snapshot object with metadata', done => {
      const apiResponse = {};
      const fakeSnapshot = {};

      subscription.snapshot = () => {
        return fakeSnapshot;
      };

      subscription.request =
          (config: RequestConfig,
           callback: RequestCallback<google.pubsub.v1.ISnapshot>) => {
            callback(null, apiResponse);
          };

      subscription.createSnapshot(
          SNAPSHOT_NAME,
          (err: Error, snapshot: Snapshot, resp: google.pubsub.v1.Snapshot) => {
            assert.ifError(err);
            assert.strictEqual(snapshot, fakeSnapshot);
            assert.strictEqual(snapshot.metadata, apiResponse);
            assert.strictEqual(resp, apiResponse);
            done();
          });
    });
  });

  describe('delete', () => {
    beforeEach(() => {
      subscription.removeAllListeners = util.noop;
      subscription.close = util.noop;
    });

    it('should make the correct request', done => {
      subscription.request = (config: RequestConfig) => {
        assert.strictEqual(config.client, 'SubscriberClient');
        assert.strictEqual(config.method, 'deleteSubscription');
        assert.deepStrictEqual(config.reqOpts, {
          subscription: subscription.name,
        });
        done();
      };

      subscription.delete(assert.ifError);
    });

    it('should optionally accept gax options', done => {
      const gaxOpts = {};

      subscription.request = (config: RequestConfig) => {
        assert.strictEqual(config.gaxOpts, gaxOpts);
        done();
      };

      subscription.delete(gaxOpts, assert.ifError);
    });

    describe('success', () => {
      const apiResponse = {};

      beforeEach(() => {
        subscription.request =
            (config: RequestConfig,
             callback: RequestCallback<google.pubsub.v1.ISubscription>) => {
              callback(null, apiResponse);
            };
      });

      it('should optionally accept a callback', done => {
        sandbox.stub(util, 'noop').callsFake((err?, resp?) => {
          assert.ifError(err);
          assert.strictEqual(resp, apiResponse);
          done();
        });
        subscription.delete();
      });

      it('should return the api response', done => {
        subscription.delete((err: Error, resp: google.protobuf.Empty) => {
          assert.ifError(err);
          assert.strictEqual(resp, apiResponse);
          done();
        });
      });

      it('should close the subscriber if open', done => {
        const stub = sandbox.stub(subscriber, 'close');

        subscription.open();

        subscription.delete((err: Error) => {
          assert.ifError(err);
          assert.strictEqual(stub.callCount, 1);
          done();
        });
      });
    });

    describe('error', () => {
      const error = new Error('err');

      beforeEach(() => {
        subscription.request =
            (config: RequestConfig, callback: ExistsCallback) => {
              callback(error);
            };
      });

      it('should return the error to the callback', done => {
        subscription.delete((err: Error) => {
          assert.strictEqual(err, error);
          done();
        });
      });

      it('should not remove all the listeners', done => {
        subscription.removeAllListeners = () => {
          done(new Error('Should not be called.'));
        };

        subscription.delete(() => {
          done();
        });
      });

      it('should not close the subscription', done => {
        subscription.close = () => {
          done(new Error('Should not be called.'));
        };

        subscription.delete(() => {
          done();
        });
      });
    });
  });

  describe('exists', () => {
    it('should return true if it finds metadata', done => {
      subscription.getMetadata =
          (callback: GetSubscriptionMetadataCallback) => {
            callback(null, {});
          };

      subscription.exists((err: Error, exists: boolean) => {
        assert.ifError(err);
        assert(exists);
        done();
      });
    });

    it('should return false if a not found error occurs', done => {
      const error = {code: 5} as ServiceError;
      subscription.getMetadata =
          (callback: GetSubscriptionMetadataCallback) => {
            callback(error);
          };

      subscription.exists((err: Error, exists: boolean) => {
        assert.ifError(err);
        assert.strictEqual(exists, false);
        done();
      });
    });

    it('should pass back any other type of error', done => {
      const error = {code: 4} as ServiceError;

      subscription.getMetadata =
          (callback: GetSubscriptionMetadataCallback) => {
            callback(error);
          };

      subscription.exists((err: Error, exists: boolean) => {
        assert.strictEqual(err, error);
        assert.strictEqual(exists, undefined);
        done();
      });
    });
  });

  describe('get', () => {
    beforeEach(() => {
      subscription.create = util.noop;
    });

    it('should delete the autoCreate option', done => {
      const options = {
        autoCreate: true,
        a: 'a',
      };

      subscription.getMetadata = (gaxOpts: GetCallOptions) => {
        assert.strictEqual(gaxOpts, options);
        assert.strictEqual(gaxOpts.autoCreate, undefined);
        done();
      };

      subscription.get(options, assert.ifError);
    });

    describe('success', () => {
      const fakeMetadata = {};

      beforeEach(() => {
        subscription.getMetadata =
            (gaxOpts: GetCallOptions,
             callback: GetSubscriptionMetadataCallback) => {
              callback(null, fakeMetadata);
            };
      });

      it('should call through to getMetadata', done => {
        subscription.get(
            (err: Error, sub: Subscription,
             resp: google.pubsub.v1.ISubscription) => {
              assert.ifError(err);
              assert.strictEqual(sub, subscription);
              assert.strictEqual(resp, fakeMetadata);
              done();
            });
      });

      it('should optionally accept options', done => {
        const options = {};

        subscription.getMetadata =
            (gaxOpts: GetCallOptions,
             callback: GetSubscriptionMetadataCallback) => {
              assert.strictEqual(gaxOpts, options);
              callback(null);  // the done fn
            };

        subscription.get(options, done);
      });
    });

    describe('error', () => {
      it('should pass back errors when not auto-creating', done => {
        const error = {code: 4} as ServiceError;
        const apiResponse = {};

        subscription.getMetadata =
            (gaxOpts: GetCallOptions,
             callback: GetSubscriptionMetadataCallback) => {
              callback(error, apiResponse);
            };

        subscription.get(
            (err: Error, sub: Subscription,
             resp: google.pubsub.v1.ISubscription) => {
              assert.strictEqual(err, error);
              assert.strictEqual(sub, null);
              assert.strictEqual(resp, apiResponse);
              done();
            });
      });

      it('should pass back 404 errors if autoCreate is false', done => {
        const error = {code: 5} as ServiceError;
        const apiResponse = {};

        subscription.getMetadata =
            (gaxOpts: GetCallOptions,
             callback: GetSubscriptionMetadataCallback) => {
              callback(error, apiResponse);
            };

        subscription.get(
            (err: Error, sub: Subscription,
             resp: google.pubsub.v1.ISubscription) => {
              assert.strictEqual(err, error);
              assert.strictEqual(sub, null);
              assert.strictEqual(resp, apiResponse);
              done();
            });
      });

      it('should pass back 404 errors if create doesnt exist', done => {
        const error = {code: 5} as ServiceError;
        const apiResponse = {};

        subscription.getMetadata =
            (gaxOpts: GetCallOptions,
             callback: GetSubscriptionMetadataCallback) => {
              callback(error, apiResponse);
            };

        delete subscription.create;

        subscription.get(
            (err: Error, sub: Subscription,
             resp: google.pubsub.v1.ISubscription) => {
              assert.strictEqual(err, error);
              assert.strictEqual(sub, null);
              assert.strictEqual(resp, apiResponse);
              done();
            });
      });

      it('should create the sub if 404 + autoCreate is true', done => {
        const error = {code: 5} as ServiceError;
        const apiResponse = {};

        const fakeOptions = {
          autoCreate: true,
        };

        subscription.getMetadata =
            (gaxOpts: GetCallOptions,
             callback: GetSubscriptionMetadataCallback) => {
              callback(error, apiResponse);
            };

        subscription.create =
            (options: GetCallOptions, callback: CreateSubscriptionCallback) => {
              assert.strictEqual(options, fakeOptions);
              callback();  // the done fn
            };

        subscription.get(fakeOptions, done);
      });
    });
  });

  describe('getMetadata', () => {
    it('should make the correct request', done => {
      subscription.request = (config: RequestConfig) => {
        assert.strictEqual(config.client, 'SubscriberClient');
        assert.strictEqual(config.method, 'getSubscription');
        assert.deepStrictEqual(config.reqOpts, {
          subscription: subscription.name,
        });
        done();
      };

      subscription.getMetadata(assert.ifError);
    });

    it('should optionally accept gax options', done => {
      const gaxOpts = {};

      subscription.request = (config: RequestConfig) => {
        assert.strictEqual(config.gaxOpts, gaxOpts);
        done();
      };

      subscription.getMetadata(gaxOpts, assert.ifError);
    });

    it('should pass back any errors that occur', done => {
      const error = new Error('err');
      const apiResponse = {};

      subscription.request =
          (config: RequestConfig,
           callback: GetSubscriptionMetadataCallback) => {
            callback(error, apiResponse);
          };

      subscription.getMetadata(
          (err: ServiceError, metadata: google.pubsub.v1.ISubscription) => {
            assert.strictEqual(err, error);
            assert.strictEqual(metadata, apiResponse);
            done();
          });
    });

    it('should set the metadata if no error occurs', done => {
      const apiResponse = {};

      subscription.request =
          (config: RequestConfig,
           callback: GetSubscriptionMetadataCallback) => {
            callback(null, apiResponse);
          };

      subscription.getMetadata(
          (err: ServiceError, metadata: google.pubsub.v1.ISubscription) => {
            assert.ifError(err);
            assert.strictEqual(metadata, apiResponse);
            assert.strictEqual(subscription.metadata, apiResponse);
            done();
          });
    });
  });

  describe('modifyPushConfig', () => {
    const fakeConfig = {};

    it('should make the correct request', done => {
      subscription.request =
          (config: RequestConfig,
           callback: RequestCallback<google.protobuf.Empty>) => {
            assert.strictEqual(config.client, 'SubscriberClient');
            assert.strictEqual(config.method, 'modifyPushConfig');
            assert.deepStrictEqual(config.reqOpts, {
              subscription: subscription.name,
              pushConfig: fakeConfig,
            });
            callback();  // the done fn
          };

      subscription.modifyPushConfig(fakeConfig, done);
    });

    it('should optionally accept gaxOpts', done => {
      const gaxOpts = {};

      subscription.request =
          (config: RequestConfig,
           callback: RequestCallback<google.protobuf.Empty>) => {
            assert.strictEqual(config.gaxOpts, gaxOpts);
            callback();  // the done fn
          };

      subscription.modifyPushConfig(fakeConfig, gaxOpts, done);
    });
  });

  describe('open', () => {
    it('should open the subscriber', () => {
      const stub = sandbox.stub(subscriber, 'open');

      subscription.open();

      assert.strictEqual(stub.callCount, 1);
    });

    it('should noop if already open', () => {
      const spy = sandbox.spy(subscriber, 'open');

      subscription.open();
      subscription.open();

      assert.strictEqual(spy.callCount, 1);
    });
  });

  describe('seek', () => {
    const FAKE_SNAPSHOT_NAME = 'a';
    const FAKE_FULL_SNAPSHOT_NAME = 'a/b/c/d';

    beforeEach(() => {
      FakeSnapshot.formatName_ = () => {
        return FAKE_FULL_SNAPSHOT_NAME;
      };
    });

    it('should throw if a name or date is not provided', () => {
      assert.throws(() => {
        subscription.seek();
      }, /Either a snapshot name or Date is needed to seek to\./);
    });

    it('should make the correct api request', done => {
      FakeSnapshot.formatName_ = (projectId: string, name: string) => {
        assert.strictEqual(projectId, PROJECT_ID);
        assert.strictEqual(name, FAKE_SNAPSHOT_NAME);
        return FAKE_FULL_SNAPSHOT_NAME;
      };

      subscription.request =
          (config: RequestConfig, callback: SeekCallback) => {
            assert.strictEqual(config.client, 'SubscriberClient');
            assert.strictEqual(config.method, 'seek');
            assert.deepStrictEqual(config.reqOpts, {
              subscription: subscription.name,
              snapshot: FAKE_FULL_SNAPSHOT_NAME,
            });
            callback();  // the done fn
          };

      subscription.seek(FAKE_SNAPSHOT_NAME, done);
    });

    it('should optionally accept a Date object', done => {
      const date = new Date();
      const reqOpts = {subscription: SUB_FULL_NAME, time: date};
      subscription.request =
          (config: RequestConfig, callback: SeekCallback) => {
            assert.deepStrictEqual(config.reqOpts, reqOpts);
            callback();  // the done fn
          };

      subscription.seek(date, done);
    });

    it('should optionally accept gax options', done => {
      const gaxOpts = {};

      subscription.request =
          (config: RequestConfig, callback: SeekCallback) => {
            assert.strictEqual(config.gaxOpts, gaxOpts);
            callback();  // the done fn
          };

      subscription.seek(FAKE_SNAPSHOT_NAME, gaxOpts, done);
    });
  });

  describe('setMetadata', () => {
    const METADATA = {
      pushEndpoint: 'http://noop.com/push',
    };

    beforeEach(() => {
      Subscription.formatMetadata_ = (metadata: SubscriptionMetadataRaw) => {
        return Object.assign({}, metadata);
      };
    });

    it('should make the correct request', done => {
      const formattedMetadata = {
        pushConfig: {
          pushEndpoint: METADATA.pushEndpoint,
        },
      };

      const expectedBody = Object.assign(
          {
            name: SUB_FULL_NAME,
          },
          formattedMetadata);

      Subscription.formatMetadata_ = (metadata: SubscriptionMetadataRaw) => {
        assert.strictEqual(metadata, METADATA);
        return formattedMetadata;
      };

      const reqOpts = {
        subscription: expectedBody,
        updateMask: {
          paths: ['push_config'],
        }
      };

      subscription.request =
          (config: RequestConfig,
           callback: RequestCallback<google.pubsub.v1.ISubscription>) => {
            assert.strictEqual(config.client, 'SubscriberClient');
            assert.strictEqual(config.method, 'updateSubscription');
            assert.deepStrictEqual(config.reqOpts, reqOpts);
            callback();  // the done fn
          };

      subscription.setMetadata(METADATA, done);
    });

    it('should optionally accept gax options', done => {
      const gaxOpts = {};

      subscription.request =
          (config: RequestConfig,
           callback: RequestCallback<google.pubsub.v1.ISubscription>) => {
            assert.strictEqual(config.gaxOpts, gaxOpts);
            callback();  // the done fn
          };

      subscription.setMetadata(METADATA, gaxOpts, done);
    });
  });

  describe('setOptions', () => {
    it('should pass the options to the subscriber', () => {
      const options = {};
      const stub = sandbox.stub(subscriber, 'setOptions').withArgs(options);

      subscription.setOptions(options);

      assert.strictEqual(stub.callCount, 1);
    });
  });

  describe('snapshot', () => {
    const SNAPSHOT_NAME = 'a';

    it('should call through to pubsub.snapshot', done => {
      PUBSUB.snapshot = function(name: string) {
        assert.strictEqual(this, subscription);
        assert.strictEqual(name, SNAPSHOT_NAME);
        done();
      };

      subscription.snapshot(SNAPSHOT_NAME);
    });
  });
});
