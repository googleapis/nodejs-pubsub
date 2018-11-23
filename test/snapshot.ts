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
  // tslint:disable-next-line variable-name
  promisifyAll(Class) {
    if (Class.name === 'Snapshot') {
      promisified = true;
    }
  },
});

describe('Snapshot', () => {
  // tslint:disable-next-line variable-name
  let Snapshot;
  let snapshot;

  const SNAPSHOT_NAME = 'a';
  const PROJECT_ID = 'grape-spaceship-123';

  const PUBSUB = {
    projectId: PROJECT_ID,
  };

  // tslint:disable-next-line no-any
  const SUBSCRIPTION: any = {
    Promise: {},
    projectId: PROJECT_ID,
    pubsub: PUBSUB,
    api: {},
    createSnapshot() {},
    seek() {},
  };

  before(() => {
    Snapshot = proxyquire('../src/snapshot', {
                 '@google-cloud/promisify': fakePromisify,
               }).Snapshot;
  });

  const sandbox = sinon.createSandbox();
  beforeEach(() => {
    snapshot = new Snapshot(SUBSCRIPTION, SNAPSHOT_NAME);
  });
  afterEach(() => sandbox.restore());

  describe('initialization', () => {
    const FULL_SNAPSHOT_NAME = 'a/b/c/d';
    let formatName_;

    before(() => {
      formatName_ = Snapshot.formatName_;
      Snapshot.formatName_ = () => {
        return FULL_SNAPSHOT_NAME;
      };
    });

    after(() => {
      Snapshot.formatName_ = formatName_;
    });

    it('should promisify all the things', () => {
      assert(promisified);
    });

    it('should localize parent.Promise', () => {
      assert.strictEqual(snapshot.Promise, SUBSCRIPTION.Promise);
    });

    it('should localize the parent', () => {
      assert.strictEqual(snapshot.parent, SUBSCRIPTION);
    });

    describe('name', () => {
      it('should create and cache the full name', () => {
        Snapshot.formatName_ = (projectId, name) => {
          assert.strictEqual(projectId, PROJECT_ID);
          assert.strictEqual(name, SNAPSHOT_NAME);
          return FULL_SNAPSHOT_NAME;
        };

        const snapshot = new Snapshot(SUBSCRIPTION, SNAPSHOT_NAME);
        assert.strictEqual(snapshot.name, FULL_SNAPSHOT_NAME);
      });

      it('should pull the projectId from parent object', () => {
        Snapshot.formatName_ = (projectId, name) => {
          assert.strictEqual(projectId, PROJECT_ID);
          assert.strictEqual(name, SNAPSHOT_NAME);
          return FULL_SNAPSHOT_NAME;
        };

        const snapshot = new Snapshot(SUBSCRIPTION, SNAPSHOT_NAME);
        assert.strictEqual(snapshot.name, FULL_SNAPSHOT_NAME);
      });
    });

    describe('with Subscription parent', () => {
      it('should include the create method', done => {
        SUBSCRIPTION.createSnapshot = (name, callback) => {
          assert.strictEqual(name, SNAPSHOT_NAME);
          callback();  // The done function
        };

        const snapshot = new Snapshot(SUBSCRIPTION, SNAPSHOT_NAME);
        snapshot.create(done);
      });

      it('should create a seek method', done => {
        SUBSCRIPTION.seek = (name, callback) => {
          assert.strictEqual(name, SNAPSHOT_NAME);
          callback();  // The done function
        };

        const snapshot = new Snapshot(SUBSCRIPTION, SNAPSHOT_NAME);
        snapshot.seek(done);
      });
    });

    describe('with PubSub parent', () => {
      let snapshot;

      beforeEach(() => {
        snapshot = new Snapshot(PUBSUB, SNAPSHOT_NAME);
      });

      it('should not include the create method', () => {
        assert.strictEqual(snapshot.create, undefined);
      });

      it('should not include a seek method', () => {
        assert.strictEqual(snapshot.seek, undefined);
      });
    });
  });

  describe('formatName_', () => {
    const EXPECTED = 'projects/' + PROJECT_ID + '/snapshots/' + SNAPSHOT_NAME;

    it('should format the name', () => {
      const name = Snapshot.formatName_(PROJECT_ID, SNAPSHOT_NAME);
      assert.strictEqual(name, EXPECTED);
    });

    it('should not re-format the name', () => {
      const name = Snapshot.formatName_(PROJECT_ID, EXPECTED);
      assert.strictEqual(name, EXPECTED);
    });
  });

  describe('delete', () => {
    it('should make the correct request', done => {
      snapshot.parent.request = (config, callback) => {
        assert.strictEqual(config.client, 'SubscriberClient');
        assert.strictEqual(config.method, 'deleteSnapshot');
        assert.deepStrictEqual(config.reqOpts, {snapshot: snapshot.name});
        callback();  // the done fn
      };

      snapshot.delete(done);
    });

    it('should optionally accept a callback', done => {
      sandbox.stub(util, 'noop').callsFake(done);
      snapshot.parent.request = (config, callback) => {
        callback();  // the done fn
      };
      snapshot.delete();
    });
  });
});
