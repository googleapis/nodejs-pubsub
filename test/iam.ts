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

import * as promisify from '@google-cloud/promisify';
import * as assert from 'assert';
import * as proxyquire from 'proxyquire';

import {PubSub, RequestConfig} from '../src';
import * as iamTypes from '../src/iam';
import * as util from '../src/util';

let promisified = false;
const fakePromisify = Object.assign({}, promisify, {
  // tslint:disable-next-line variable-name
  promisifyAll(Class: typeof iamTypes.IAM) {
    if (Class.name === 'IAM') {
      promisified = true;
    }
  },
});

describe('IAM', () => {
  let IAM: typeof iamTypes.IAM;
  let iam: iamTypes.IAM;

  const PUBSUB = {
    options: {},
    Promise: {},
    request: util.noop,
  } as {} as PubSub;
  const ID = 'id';

  before(() => {
    IAM = proxyquire('../src/iam.js', {
            '@google-cloud/promisify': fakePromisify,
          }).IAM;
  });

  beforeEach(() => {
    iam = new IAM(PUBSUB, ID);
  });

  describe('initialization', () => {
    it('should localize pubsub.Promise', () => {
      assert.strictEqual(iam.Promise, PUBSUB.Promise);
    });

    it('should localize pubsub', () => {
      assert.strictEqual(iam.pubsub, PUBSUB);
    });

    it('should localize pubsub#request', () => {
      const fakeRequest = () => {};
      const fakePubsub = {
        request: {
          bind(context: PubSub) {
            assert.strictEqual(context, fakePubsub);
            return fakeRequest;
          },
        },
      } as {} as PubSub;
      const iam = new IAM(fakePubsub, ID);

      assert.strictEqual(iam.request, fakeRequest);
    });

    it('should localize the ID', () => {
      assert.strictEqual(iam.id, ID);
    });

    it('should promisify all the things', () => {
      assert(promisified);
    });
  });

  describe('getPolicy', () => {
    it('should make the correct API request', done => {
      iam.request = (config, callback) => {
        const reqOpts = {resource: iam.id};
        assert.strictEqual(config.client, 'SubscriberClient');
        assert.strictEqual(config.method, 'getIamPolicy');
        assert.deepStrictEqual(config.reqOpts, reqOpts);

        callback();  // done()
      };

      iam.getPolicy(done);
    });

    it('should accept gax options', done => {
      const gaxOpts = {};

      iam.request = config => {
        assert.strictEqual(config.gaxOpts, gaxOpts);
        done();
      };

      iam.getPolicy(gaxOpts, assert.ifError);
    });
  });

  describe('setPolicy', () => {
    const policy = {etag: 'ACAB', bindings: []} as iamTypes.Policy;

    it('should throw an error if a policy is not supplied', () => {
      assert.throws(() => {
        // tslint:disable-next-line no-any
        (iam as any).setPolicy(util.noop);
      }, /A policy object is required\./);
    });

    it('should make the correct API request', done => {
      iam.request = (config, callback) => {
        const reqOpts = {resource: iam.id, policy};
        assert.strictEqual(config.client, 'SubscriberClient');
        assert.strictEqual(config.method, 'setIamPolicy');
        assert.deepStrictEqual(config.reqOpts, reqOpts);

        callback();  // done()
      };

      iam.setPolicy(policy, done);
    });

    it('should accept gax options', done => {
      const gaxOpts = {};

      iam.request = (config: RequestConfig) => {
        assert.strictEqual(config.gaxOpts, gaxOpts);
        done();
      };

      iam.setPolicy(policy, gaxOpts, assert.ifError);
    });
  });

  describe('testPermissions', () => {
    it('should throw an error if permissions are missing', () => {
      assert.throws(() => {
        // tslint:disable-next-line no-any
        (iam as any).testPermissions(util.noop);
      }, /Permissions are required\./);
    });

    it('should make the correct API request', done => {
      const permissions = 'storage.bucket.list';
      const reqOpts = {resource: iam.id, permissions: [permissions]};

      iam.request = config => {
        assert.strictEqual(config.client, 'SubscriberClient');
        assert.strictEqual(config.method, 'testIamPermissions');
        assert.deepStrictEqual(config.reqOpts, reqOpts);

        done();
      };

      iam.testPermissions(permissions, assert.ifError);
    });

    it('should accept gax options', done => {
      const permissions = 'storage.bucket.list';
      const gaxOpts = {};

      iam.request = config => {
        assert.strictEqual(config.gaxOpts, gaxOpts);
        done();
      };

      iam.testPermissions(permissions, gaxOpts, assert.ifError);
    });

    it('should send an error back if the request fails', done => {
      const permissions = ['storage.bucket.list'];
      const error = new Error('Error.');
      const apiResponse = {};

      iam.request = (config, callback: Function) => {
        callback(error, apiResponse);
      };

      iam.testPermissions(permissions, (err, permissions, apiResp) => {
        assert.strictEqual(err, error);
        assert.strictEqual(permissions, null);
        assert.strictEqual(apiResp, apiResponse);
        done();
      });
    });

    it('should pass back a hash of permissions the user has', done => {
      const permissions = ['storage.bucket.list', 'storage.bucket.consume'];
      const apiResponse = {
        permissions: ['storage.bucket.consume'],
      };

      iam.request = (config, callback: Function) => {
        callback(null, apiResponse);
      };

      iam.testPermissions(permissions, (err, permissions, apiResp) => {
        assert.ifError(err);
        assert.deepStrictEqual(permissions, {
          'storage.bucket.list': false,
          'storage.bucket.consume': true,
        });
        assert.strictEqual(apiResp, apiResponse);

        done();
      });
    });
  });
});
