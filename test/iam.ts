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
import * as extend from 'extend';
import * as proxyquire from 'proxyquire';
import * as util from '../src/util';
import * as promisify from '@google-cloud/promisify';

let promisified = false;
const fakePromisify = extend({}, promisify, {
  promisifyAll: function(Class) {
    if (Class.name === 'IAM') {
      promisified = true;
    }
  },
});

describe('IAM', function() {
  let IAM;
  let iam;

  const PUBSUB = {
    options: {},
    Promise: {},
    request: util.noop,
  };
  const ID = 'id';

  before(function() {
    IAM = proxyquire('../src/iam.js', {
      '@google-cloud/promisify': fakePromisify,
    }).IAM;
  });

  beforeEach(function() {
    iam = new IAM(PUBSUB, ID);
  });

  describe('initialization', function() {
    it('should localize pubsub.Promise', function() {
      assert.strictEqual(iam.Promise, PUBSUB.Promise);
    });

    it('should localize pubsub', function() {
      assert.strictEqual(iam.pubsub, PUBSUB);
    });

    it('should localize pubsub#request', function() {
      const fakeRequest = function() {};
      const fakePubsub = {
        request: {
          bind: function(context) {
            assert.strictEqual(context, fakePubsub);
            return fakeRequest;
          },
        },
      };
      const iam = new IAM(fakePubsub, ID);

      assert.strictEqual(iam.request, fakeRequest);
    });

    it('should localize the ID', function() {
      assert.strictEqual(iam.id, ID);
    });

    it('should promisify all the things', function() {
      assert(promisified);
    });
  });

  describe('getPolicy', function() {
    it('should make the correct API request', function(done) {
      iam.request = function(config, callback) {
        assert.strictEqual(config.client, 'SubscriberClient');
        assert.strictEqual(config.method, 'getIamPolicy');
        assert.strictEqual(config.reqOpts.resource, iam.id);

        callback(); // done()
      };

      iam.getPolicy(done);
    });

    it('should accept gax options', function(done) {
      const gaxOpts = {};

      iam.request = function(config) {
        assert.strictEqual(config.gaxOpts, gaxOpts);
        done();
      };

      iam.getPolicy(gaxOpts, assert.ifError);
    });
  });

  describe('setPolicy', function() {
    const policy = {etag: 'ACAB'};

    it('should throw an error if a policy is not supplied', function() {
      assert.throws(function() {
        iam.setPolicy(util.noop);
      }, /A policy object is required\./);
    });

    it('should make the correct API request', function(done) {
      iam.request = function(config, callback) {
        assert.strictEqual(config.client, 'SubscriberClient');
        assert.strictEqual(config.method, 'setIamPolicy');
        assert.strictEqual(config.reqOpts.resource, iam.id);
        assert.strictEqual(config.reqOpts.policy, policy);

        callback(); // done()
      };

      iam.setPolicy(policy, done);
    });

    it('should accept gax options', function(done) {
      const gaxOpts = {};

      iam.request = function(config) {
        assert.strictEqual(config.gaxOpts, gaxOpts);
        done();
      };

      iam.setPolicy(policy, gaxOpts, assert.ifError);
    });
  });

  describe('testPermissions', function() {
    it('should throw an error if permissions are missing', function() {
      assert.throws(function() {
        iam.testPermissions(util.noop);
      }, /Permissions are required\./);
    });

    it('should make the correct API request', function(done) {
      const permissions = 'storage.bucket.list';

      iam.request = function(config) {
        assert.strictEqual(config.client, 'SubscriberClient');
        assert.strictEqual(config.method, 'testIamPermissions');
        assert.strictEqual(config.reqOpts.resource, iam.id);
        assert.deepStrictEqual(config.reqOpts.permissions, [permissions]);

        done();
      };

      iam.testPermissions(permissions, assert.ifError);
    });

    it('should accept gax options', function(done) {
      const permissions = 'storage.bucket.list';
      const gaxOpts = {};

      iam.request = function(config) {
        assert.strictEqual(config.gaxOpts, gaxOpts);
        done();
      };

      iam.testPermissions(permissions, gaxOpts, assert.ifError);
    });

    it('should send an error back if the request fails', function(done) {
      const permissions = ['storage.bucket.list'];
      const error = new Error('Error.');
      const apiResponse = {};

      iam.request = function(config, callback) {
        callback(error, apiResponse);
      };

      iam.testPermissions(permissions, function(err, permissions, apiResp) {
        assert.strictEqual(err, error);
        assert.strictEqual(permissions, null);
        assert.strictEqual(apiResp, apiResponse);
        done();
      });
    });

    it('should pass back a hash of permissions the user has', function(done) {
      const permissions = ['storage.bucket.list', 'storage.bucket.consume'];
      const apiResponse = {
        permissions: ['storage.bucket.consume'],
      };

      iam.request = function(config, callback) {
        callback(null, apiResponse);
      };

      iam.testPermissions(permissions, function(err, permissions, apiResp) {
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
