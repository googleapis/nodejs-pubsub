// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import assert = require('assert');
import sinon = require('sinon');
import {StatusObject, status} from '@grpc/grpc-js';
import {PullRetry} from '../src/pull-retry';

describe('PullRetry', () => {
  const sandbox = sinon.createSandbox();

  let retrier: PullRetry;

  beforeEach(() => {
    retrier = new PullRetry();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('createTimeout', () => {
    it('should return 0 when no failures have occurred', () => {
      assert.strictEqual(retrier.createTimeout(), 0);
    });

    it('should use a backoff factoring in the failure count', () => {
      const random = Math.random();
      const expected = Math.pow(2, 1) * 1000 + Math.floor(random * 1000);

      sandbox.stub(global.Math, 'random').returns(random);

      retrier.retry({code: status.CANCELLED} as StatusObject);
      assert.strictEqual(retrier.createTimeout(), expected);
    });
  });

  describe('retry', () => {
    it('should return true for retryable errors', () => {
      [
        status.OK,
        status.CANCELLED,
        status.UNKNOWN,
        status.DEADLINE_EXCEEDED,
        status.RESOURCE_EXHAUSTED,
        status.ABORTED,
        status.INTERNAL,
        status.UNAVAILABLE,
        status.DATA_LOSS,
      ].forEach((code: status) => {
        const shouldRetry = retrier.retry({code} as StatusObject);
        assert.strictEqual(shouldRetry, true);
      });
    });

    it('should return false for non-retryable errors', () => {
      [
        status.INVALID_ARGUMENT,
        status.NOT_FOUND,
        status.PERMISSION_DENIED,
        status.FAILED_PRECONDITION,
        status.OUT_OF_RANGE,
        status.UNIMPLEMENTED,
      ].forEach((code: status) => {
        const shouldRetry = retrier.retry({code} as StatusObject);
        assert.strictEqual(shouldRetry, false);
      });
    });

    it('should reset the failure count on OK', () => {
      retrier.retry({code: status.CANCELLED} as StatusObject);
      retrier.retry({code: status.OK} as StatusObject);

      assert.strictEqual(retrier.createTimeout(), 0);
    });

    it('should reset the failure count on DEADLINE_EXCEEDED', () => {
      retrier.retry({code: status.CANCELLED} as StatusObject);
      retrier.retry({code: status.DEADLINE_EXCEEDED} as StatusObject);

      assert.strictEqual(retrier.createTimeout(), 0);
    });
  });
});
