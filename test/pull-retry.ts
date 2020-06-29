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

import * as assert from 'assert';
import * as sinon from 'sinon';
import {describe, it, beforeEach, afterEach} from 'mocha';
import {grpc} from 'google-gax';
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

      retrier.retry({code: grpc.status.CANCELLED} as grpc.StatusObject);
      assert.strictEqual(retrier.createTimeout(), expected);
    });
  });

  describe('retry', () => {
    it('should return true for retryable errors', () => {
      [
        grpc.status.DEADLINE_EXCEEDED,
        grpc.status.RESOURCE_EXHAUSTED,
        grpc.status.ABORTED,
        grpc.status.INTERNAL,
        grpc.status.UNAVAILABLE,
      ].forEach((code: grpc.status) => {
        const shouldRetry = retrier.retry({code} as grpc.StatusObject);
        assert.strictEqual(shouldRetry, true);
      });

      const serverShutdown = retrier.retry({
        code: grpc.status.UNAVAILABLE,
        details: 'Server shutdownNow invoked',
      } as grpc.StatusObject);
      assert.strictEqual(serverShutdown, true);
    });

    it('should return false for non-retryable errors', () => {
      [
        grpc.status.INVALID_ARGUMENT,
        grpc.status.NOT_FOUND,
        grpc.status.PERMISSION_DENIED,
        grpc.status.FAILED_PRECONDITION,
        grpc.status.OUT_OF_RANGE,
        grpc.status.UNIMPLEMENTED,
      ].forEach((code: grpc.status) => {
        const shouldRetry = retrier.retry({code} as grpc.StatusObject);
        assert.strictEqual(shouldRetry, false);
      });
    });

    it('should reset the failure count on OK', () => {
      retrier.retry({code: grpc.status.CANCELLED} as grpc.StatusObject);
      retrier.retry({code: grpc.status.OK} as grpc.StatusObject);

      assert.strictEqual(retrier.createTimeout(), 0);
    });

    it('should reset the failure count on DEADLINE_EXCEEDED', () => {
      retrier.retry({code: grpc.status.CANCELLED} as grpc.StatusObject);
      retrier.retry({code: grpc.status.DEADLINE_EXCEEDED} as grpc.StatusObject);

      assert.strictEqual(retrier.createTimeout(), 0);
    });
  });
});
