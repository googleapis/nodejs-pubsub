// Copyright 2020 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// ** This file is automatically generated by gapic-generator-typescript. **
// ** https://github.com/googleapis/gapic-generator-typescript **
// ** All changes to this file may be overwritten. **

import * as protosTypes from '../protos/protos';
import * as assert from 'assert';
import {describe, it} from 'mocha';
/* eslint-disable @typescript-eslint/no-var-requires */
const subscriberModule = require('../src');

import {PassThrough} from 'stream';

const FAKE_STATUS_CODE = 1;
class FakeError {
  name: string;
  message: string;
  code: number;
  constructor(n: number) {
    this.name = 'fakeName';
    this.message = 'fake message';
    this.code = n;
  }
}
const error = new FakeError(FAKE_STATUS_CODE);
export interface Callback {
  (err: FakeError | null, response?: {} | null): void;
}

export class Operation {
  constructor() {}
  promise() {}
}
function mockSimpleGrpcMethod(
  expectedRequest: {},
  response: {} | null,
  error: FakeError | null
) {
  return (actualRequest: {}, options: {}, callback: Callback) => {
    assert.deepStrictEqual(actualRequest, expectedRequest);
    if (error) {
      callback(error);
    } else if (response) {
      callback(null, response);
    } else {
      callback(null);
    }
  };
}
function mockBidiStreamingGrpcMethod(
  expectedRequest: {},
  response: {} | null,
  error: FakeError | null
) {
  return () => {
    const mockStream = new PassThrough({
      objectMode: true,
      transform: (chunk: {}, enc: {}, callback: Callback) => {
        assert.deepStrictEqual(chunk, expectedRequest);
        if (error) {
          callback(error);
        } else {
          callback(null, response);
        }
      },
    });
    return mockStream;
  };
}
describe('v1.SubscriberClient', () => {
  it('has servicePath', () => {
    const servicePath = subscriberModule.v1.SubscriberClient.servicePath;
    assert(servicePath);
  });
  it('has apiEndpoint', () => {
    const apiEndpoint = subscriberModule.v1.SubscriberClient.apiEndpoint;
    assert(apiEndpoint);
  });
  it('has port', () => {
    const port = subscriberModule.v1.SubscriberClient.port;
    assert(port);
    assert(typeof port === 'number');
  });
  it('should create a client with no option', () => {
    const client = new subscriberModule.v1.SubscriberClient();
    assert(client);
  });
  it('should create a client with gRPC fallback', () => {
    const client = new subscriberModule.v1.SubscriberClient({
      fallback: true,
    });
    assert(client);
  });
  it('has initialize method and supports deferred initialization', async () => {
    const client = new subscriberModule.v1.SubscriberClient({
      credentials: {client_email: 'bogus', private_key: 'bogus'},
      projectId: 'bogus',
    });
    assert.strictEqual(client.subscriberStub, undefined);
    await client.initialize();
    assert(client.subscriberStub);
  });
  it('has close method', () => {
    const client = new subscriberModule.v1.SubscriberClient({
      credentials: {client_email: 'bogus', private_key: 'bogus'},
      projectId: 'bogus',
    });
    client.close();
  });
  describe('createSubscription', () => {
    it('invokes createSubscription without error', done => {
      const client = new subscriberModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });
      // Initialize client before mocking
      client.initialize();
      // Mock request
      const request: protosTypes.google.pubsub.v1.ISubscription = {};
      request.name = '';
      // Mock response
      const expectedResponse = {};
      // Mock gRPC layer
      client._innerApiCalls.createSubscription = mockSimpleGrpcMethod(
        request,
        expectedResponse,
        null
      );
      client.createSubscription(request, (err: {}, response: {}) => {
        assert.ifError(err);
        assert.deepStrictEqual(response, expectedResponse);
        done();
      });
    });

    it('invokes createSubscription with error', done => {
      const client = new subscriberModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });
      // Initialize client before mocking
      client.initialize();
      // Mock request
      const request: protosTypes.google.pubsub.v1.ISubscription = {};
      request.name = '';
      // Mock gRPC layer
      client._innerApiCalls.createSubscription = mockSimpleGrpcMethod(
        request,
        null,
        error
      );
      client.createSubscription(request, (err: FakeError, response: {}) => {
        assert(err instanceof FakeError);
        assert.strictEqual(err.code, FAKE_STATUS_CODE);
        assert(typeof response === 'undefined');
        done();
      });
    });
  });
  describe('getSubscription', () => {
    it('invokes getSubscription without error', done => {
      const client = new subscriberModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });
      // Initialize client before mocking
      client.initialize();
      // Mock request
      const request: protosTypes.google.pubsub.v1.IGetSubscriptionRequest = {};
      request.subscription = '';
      // Mock response
      const expectedResponse = {};
      // Mock gRPC layer
      client._innerApiCalls.getSubscription = mockSimpleGrpcMethod(
        request,
        expectedResponse,
        null
      );
      client.getSubscription(request, (err: {}, response: {}) => {
        assert.ifError(err);
        assert.deepStrictEqual(response, expectedResponse);
        done();
      });
    });

    it('invokes getSubscription with error', done => {
      const client = new subscriberModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });
      // Initialize client before mocking
      client.initialize();
      // Mock request
      const request: protosTypes.google.pubsub.v1.IGetSubscriptionRequest = {};
      request.subscription = '';
      // Mock gRPC layer
      client._innerApiCalls.getSubscription = mockSimpleGrpcMethod(
        request,
        null,
        error
      );
      client.getSubscription(request, (err: FakeError, response: {}) => {
        assert(err instanceof FakeError);
        assert.strictEqual(err.code, FAKE_STATUS_CODE);
        assert(typeof response === 'undefined');
        done();
      });
    });
  });
  describe('updateSubscription', () => {
    it('invokes updateSubscription without error', done => {
      const client = new subscriberModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });
      // Initialize client before mocking
      client.initialize();
      // Mock request
      const request: protosTypes.google.pubsub.v1.IUpdateSubscriptionRequest = {};
      request.subscription = {};
      request.subscription.name = '';
      // Mock response
      const expectedResponse = {};
      // Mock gRPC layer
      client._innerApiCalls.updateSubscription = mockSimpleGrpcMethod(
        request,
        expectedResponse,
        null
      );
      client.updateSubscription(request, (err: {}, response: {}) => {
        assert.ifError(err);
        assert.deepStrictEqual(response, expectedResponse);
        done();
      });
    });

    it('invokes updateSubscription with error', done => {
      const client = new subscriberModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });
      // Initialize client before mocking
      client.initialize();
      // Mock request
      const request: protosTypes.google.pubsub.v1.IUpdateSubscriptionRequest = {};
      request.subscription = {};
      request.subscription.name = '';
      // Mock gRPC layer
      client._innerApiCalls.updateSubscription = mockSimpleGrpcMethod(
        request,
        null,
        error
      );
      client.updateSubscription(request, (err: FakeError, response: {}) => {
        assert(err instanceof FakeError);
        assert.strictEqual(err.code, FAKE_STATUS_CODE);
        assert(typeof response === 'undefined');
        done();
      });
    });
  });
  describe('deleteSubscription', () => {
    it('invokes deleteSubscription without error', done => {
      const client = new subscriberModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });
      // Initialize client before mocking
      client.initialize();
      // Mock request
      const request: protosTypes.google.pubsub.v1.IDeleteSubscriptionRequest = {};
      request.subscription = '';
      // Mock response
      const expectedResponse = {};
      // Mock gRPC layer
      client._innerApiCalls.deleteSubscription = mockSimpleGrpcMethod(
        request,
        expectedResponse,
        null
      );
      client.deleteSubscription(request, (err: {}, response: {}) => {
        assert.ifError(err);
        assert.deepStrictEqual(response, expectedResponse);
        done();
      });
    });

    it('invokes deleteSubscription with error', done => {
      const client = new subscriberModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });
      // Initialize client before mocking
      client.initialize();
      // Mock request
      const request: protosTypes.google.pubsub.v1.IDeleteSubscriptionRequest = {};
      request.subscription = '';
      // Mock gRPC layer
      client._innerApiCalls.deleteSubscription = mockSimpleGrpcMethod(
        request,
        null,
        error
      );
      client.deleteSubscription(request, (err: FakeError, response: {}) => {
        assert(err instanceof FakeError);
        assert.strictEqual(err.code, FAKE_STATUS_CODE);
        assert(typeof response === 'undefined');
        done();
      });
    });
  });
  describe('modifyAckDeadline', () => {
    it('invokes modifyAckDeadline without error', done => {
      const client = new subscriberModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });
      // Initialize client before mocking
      client.initialize();
      // Mock request
      const request: protosTypes.google.pubsub.v1.IModifyAckDeadlineRequest = {};
      request.subscription = '';
      // Mock response
      const expectedResponse = {};
      // Mock gRPC layer
      client._innerApiCalls.modifyAckDeadline = mockSimpleGrpcMethod(
        request,
        expectedResponse,
        null
      );
      client.modifyAckDeadline(request, (err: {}, response: {}) => {
        assert.ifError(err);
        assert.deepStrictEqual(response, expectedResponse);
        done();
      });
    });

    it('invokes modifyAckDeadline with error', done => {
      const client = new subscriberModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });
      // Initialize client before mocking
      client.initialize();
      // Mock request
      const request: protosTypes.google.pubsub.v1.IModifyAckDeadlineRequest = {};
      request.subscription = '';
      // Mock gRPC layer
      client._innerApiCalls.modifyAckDeadline = mockSimpleGrpcMethod(
        request,
        null,
        error
      );
      client.modifyAckDeadline(request, (err: FakeError, response: {}) => {
        assert(err instanceof FakeError);
        assert.strictEqual(err.code, FAKE_STATUS_CODE);
        assert(typeof response === 'undefined');
        done();
      });
    });
  });
  describe('acknowledge', () => {
    it('invokes acknowledge without error', done => {
      const client = new subscriberModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });
      // Initialize client before mocking
      client.initialize();
      // Mock request
      const request: protosTypes.google.pubsub.v1.IAcknowledgeRequest = {};
      request.subscription = '';
      // Mock response
      const expectedResponse = {};
      // Mock gRPC layer
      client._innerApiCalls.acknowledge = mockSimpleGrpcMethod(
        request,
        expectedResponse,
        null
      );
      client.acknowledge(request, (err: {}, response: {}) => {
        assert.ifError(err);
        assert.deepStrictEqual(response, expectedResponse);
        done();
      });
    });

    it('invokes acknowledge with error', done => {
      const client = new subscriberModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });
      // Initialize client before mocking
      client.initialize();
      // Mock request
      const request: protosTypes.google.pubsub.v1.IAcknowledgeRequest = {};
      request.subscription = '';
      // Mock gRPC layer
      client._innerApiCalls.acknowledge = mockSimpleGrpcMethod(
        request,
        null,
        error
      );
      client.acknowledge(request, (err: FakeError, response: {}) => {
        assert(err instanceof FakeError);
        assert.strictEqual(err.code, FAKE_STATUS_CODE);
        assert(typeof response === 'undefined');
        done();
      });
    });
  });
  describe('pull', () => {
    it('invokes pull without error', done => {
      const client = new subscriberModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });
      // Initialize client before mocking
      client.initialize();
      // Mock request
      const request: protosTypes.google.pubsub.v1.IPullRequest = {};
      request.subscription = '';
      // Mock response
      const expectedResponse = {};
      // Mock gRPC layer
      client._innerApiCalls.pull = mockSimpleGrpcMethod(
        request,
        expectedResponse,
        null
      );
      client.pull(request, (err: {}, response: {}) => {
        assert.ifError(err);
        assert.deepStrictEqual(response, expectedResponse);
        done();
      });
    });

    it('invokes pull with error', done => {
      const client = new subscriberModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });
      // Initialize client before mocking
      client.initialize();
      // Mock request
      const request: protosTypes.google.pubsub.v1.IPullRequest = {};
      request.subscription = '';
      // Mock gRPC layer
      client._innerApiCalls.pull = mockSimpleGrpcMethod(request, null, error);
      client.pull(request, (err: FakeError, response: {}) => {
        assert(err instanceof FakeError);
        assert.strictEqual(err.code, FAKE_STATUS_CODE);
        assert(typeof response === 'undefined');
        done();
      });
    });
  });
  describe('modifyPushConfig', () => {
    it('invokes modifyPushConfig without error', done => {
      const client = new subscriberModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });
      // Initialize client before mocking
      client.initialize();
      // Mock request
      const request: protosTypes.google.pubsub.v1.IModifyPushConfigRequest = {};
      request.subscription = '';
      // Mock response
      const expectedResponse = {};
      // Mock gRPC layer
      client._innerApiCalls.modifyPushConfig = mockSimpleGrpcMethod(
        request,
        expectedResponse,
        null
      );
      client.modifyPushConfig(request, (err: {}, response: {}) => {
        assert.ifError(err);
        assert.deepStrictEqual(response, expectedResponse);
        done();
      });
    });

    it('invokes modifyPushConfig with error', done => {
      const client = new subscriberModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });
      // Initialize client before mocking
      client.initialize();
      // Mock request
      const request: protosTypes.google.pubsub.v1.IModifyPushConfigRequest = {};
      request.subscription = '';
      // Mock gRPC layer
      client._innerApiCalls.modifyPushConfig = mockSimpleGrpcMethod(
        request,
        null,
        error
      );
      client.modifyPushConfig(request, (err: FakeError, response: {}) => {
        assert(err instanceof FakeError);
        assert.strictEqual(err.code, FAKE_STATUS_CODE);
        assert(typeof response === 'undefined');
        done();
      });
    });
  });
  describe('getSnapshot', () => {
    it('invokes getSnapshot without error', done => {
      const client = new subscriberModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });
      // Initialize client before mocking
      client.initialize();
      // Mock request
      const request: protosTypes.google.pubsub.v1.IGetSnapshotRequest = {};
      request.snapshot = '';
      // Mock response
      const expectedResponse = {};
      // Mock gRPC layer
      client._innerApiCalls.getSnapshot = mockSimpleGrpcMethod(
        request,
        expectedResponse,
        null
      );
      client.getSnapshot(request, (err: {}, response: {}) => {
        assert.ifError(err);
        assert.deepStrictEqual(response, expectedResponse);
        done();
      });
    });

    it('invokes getSnapshot with error', done => {
      const client = new subscriberModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });
      // Initialize client before mocking
      client.initialize();
      // Mock request
      const request: protosTypes.google.pubsub.v1.IGetSnapshotRequest = {};
      request.snapshot = '';
      // Mock gRPC layer
      client._innerApiCalls.getSnapshot = mockSimpleGrpcMethod(
        request,
        null,
        error
      );
      client.getSnapshot(request, (err: FakeError, response: {}) => {
        assert(err instanceof FakeError);
        assert.strictEqual(err.code, FAKE_STATUS_CODE);
        assert(typeof response === 'undefined');
        done();
      });
    });
  });
  describe('createSnapshot', () => {
    it('invokes createSnapshot without error', done => {
      const client = new subscriberModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });
      // Initialize client before mocking
      client.initialize();
      // Mock request
      const request: protosTypes.google.pubsub.v1.ICreateSnapshotRequest = {};
      request.name = '';
      // Mock response
      const expectedResponse = {};
      // Mock gRPC layer
      client._innerApiCalls.createSnapshot = mockSimpleGrpcMethod(
        request,
        expectedResponse,
        null
      );
      client.createSnapshot(request, (err: {}, response: {}) => {
        assert.ifError(err);
        assert.deepStrictEqual(response, expectedResponse);
        done();
      });
    });

    it('invokes createSnapshot with error', done => {
      const client = new subscriberModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });
      // Initialize client before mocking
      client.initialize();
      // Mock request
      const request: protosTypes.google.pubsub.v1.ICreateSnapshotRequest = {};
      request.name = '';
      // Mock gRPC layer
      client._innerApiCalls.createSnapshot = mockSimpleGrpcMethod(
        request,
        null,
        error
      );
      client.createSnapshot(request, (err: FakeError, response: {}) => {
        assert(err instanceof FakeError);
        assert.strictEqual(err.code, FAKE_STATUS_CODE);
        assert(typeof response === 'undefined');
        done();
      });
    });
  });
  describe('updateSnapshot', () => {
    it('invokes updateSnapshot without error', done => {
      const client = new subscriberModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });
      // Initialize client before mocking
      client.initialize();
      // Mock request
      const request: protosTypes.google.pubsub.v1.IUpdateSnapshotRequest = {};
      request.snapshot = {};
      request.snapshot.name = '';
      // Mock response
      const expectedResponse = {};
      // Mock gRPC layer
      client._innerApiCalls.updateSnapshot = mockSimpleGrpcMethod(
        request,
        expectedResponse,
        null
      );
      client.updateSnapshot(request, (err: {}, response: {}) => {
        assert.ifError(err);
        assert.deepStrictEqual(response, expectedResponse);
        done();
      });
    });

    it('invokes updateSnapshot with error', done => {
      const client = new subscriberModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });
      // Initialize client before mocking
      client.initialize();
      // Mock request
      const request: protosTypes.google.pubsub.v1.IUpdateSnapshotRequest = {};
      request.snapshot = {};
      request.snapshot.name = '';
      // Mock gRPC layer
      client._innerApiCalls.updateSnapshot = mockSimpleGrpcMethod(
        request,
        null,
        error
      );
      client.updateSnapshot(request, (err: FakeError, response: {}) => {
        assert(err instanceof FakeError);
        assert.strictEqual(err.code, FAKE_STATUS_CODE);
        assert(typeof response === 'undefined');
        done();
      });
    });
  });
  describe('deleteSnapshot', () => {
    it('invokes deleteSnapshot without error', done => {
      const client = new subscriberModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });
      // Initialize client before mocking
      client.initialize();
      // Mock request
      const request: protosTypes.google.pubsub.v1.IDeleteSnapshotRequest = {};
      request.snapshot = '';
      // Mock response
      const expectedResponse = {};
      // Mock gRPC layer
      client._innerApiCalls.deleteSnapshot = mockSimpleGrpcMethod(
        request,
        expectedResponse,
        null
      );
      client.deleteSnapshot(request, (err: {}, response: {}) => {
        assert.ifError(err);
        assert.deepStrictEqual(response, expectedResponse);
        done();
      });
    });

    it('invokes deleteSnapshot with error', done => {
      const client = new subscriberModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });
      // Initialize client before mocking
      client.initialize();
      // Mock request
      const request: protosTypes.google.pubsub.v1.IDeleteSnapshotRequest = {};
      request.snapshot = '';
      // Mock gRPC layer
      client._innerApiCalls.deleteSnapshot = mockSimpleGrpcMethod(
        request,
        null,
        error
      );
      client.deleteSnapshot(request, (err: FakeError, response: {}) => {
        assert(err instanceof FakeError);
        assert.strictEqual(err.code, FAKE_STATUS_CODE);
        assert(typeof response === 'undefined');
        done();
      });
    });
  });
  describe('seek', () => {
    it('invokes seek without error', done => {
      const client = new subscriberModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });
      // Initialize client before mocking
      client.initialize();
      // Mock request
      const request: protosTypes.google.pubsub.v1.ISeekRequest = {};
      request.subscription = '';
      // Mock response
      const expectedResponse = {};
      // Mock gRPC layer
      client._innerApiCalls.seek = mockSimpleGrpcMethod(
        request,
        expectedResponse,
        null
      );
      client.seek(request, (err: {}, response: {}) => {
        assert.ifError(err);
        assert.deepStrictEqual(response, expectedResponse);
        done();
      });
    });

    it('invokes seek with error', done => {
      const client = new subscriberModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });
      // Initialize client before mocking
      client.initialize();
      // Mock request
      const request: protosTypes.google.pubsub.v1.ISeekRequest = {};
      request.subscription = '';
      // Mock gRPC layer
      client._innerApiCalls.seek = mockSimpleGrpcMethod(request, null, error);
      client.seek(request, (err: FakeError, response: {}) => {
        assert(err instanceof FakeError);
        assert.strictEqual(err.code, FAKE_STATUS_CODE);
        assert(typeof response === 'undefined');
        done();
      });
    });
  });
  describe('streamingPull', () => {
    it('invokes streamingPull without error', done => {
      const client = new subscriberModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });
      // Initialize client before mocking
      client.initialize();
      // Mock request
      const request: protosTypes.google.pubsub.v1.IStreamingPullRequest = {};
      // Mock response
      const expectedResponse = {};
      // Mock gRPC layer
      client._innerApiCalls.streamingPull = mockBidiStreamingGrpcMethod(
        request,
        expectedResponse,
        null
      );
      const stream = client
        .streamingPull()
        .on('data', (response: {}) => {
          assert.deepStrictEqual(response, expectedResponse);
          done();
        })
        .on('error', (err: FakeError) => {
          done(err);
        });
      stream.write(request);
    });
    it('invokes streamingPull with error', done => {
      const client = new subscriberModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });
      // Initialize client before mocking
      client.initialize();
      // Mock request
      const request: protosTypes.google.pubsub.v1.IStreamingPullRequest = {};
      // Mock gRPC layer
      client._innerApiCalls.streamingPull = mockBidiStreamingGrpcMethod(
        request,
        null,
        error
      );
      const stream = client
        .streamingPull()
        .on('data', () => {
          assert.fail();
        })
        .on('error', (err: FakeError) => {
          assert(err instanceof FakeError);
          assert.strictEqual(err.code, FAKE_STATUS_CODE);
          done();
        });
      stream.write(request);
    });
  });
  describe('listSubscriptions', () => {
    it('invokes listSubscriptions without error', done => {
      const client = new subscriberModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });
      // Initialize client before mocking
      client.initialize();
      // Mock request
      const request: protosTypes.google.pubsub.v1.IListSubscriptionsRequest = {};
      request.project = '';
      // Mock response
      const expectedResponse = {};
      // Mock Grpc layer
      client._innerApiCalls.listSubscriptions = (
        actualRequest: {},
        options: {},
        callback: Callback
      ) => {
        assert.deepStrictEqual(actualRequest, request);
        callback(null, expectedResponse);
      };
      client.listSubscriptions(request, (err: FakeError, response: {}) => {
        assert.ifError(err);
        assert.deepStrictEqual(response, expectedResponse);
        done();
      });
    });
  });
  describe('listSubscriptionsStream', () => {
    it('invokes listSubscriptionsStream without error', done => {
      const client = new subscriberModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });
      // Initialize client before mocking
      client.initialize();
      // Mock request
      const request: protosTypes.google.pubsub.v1.IListSubscriptionsRequest = {};
      request.project = '';
      // Mock response
      const expectedResponse = {response: 'data'};
      // Mock Grpc layer
      client._innerApiCalls.listSubscriptions = (
        actualRequest: {},
        options: {},
        callback: Callback
      ) => {
        assert.deepStrictEqual(actualRequest, request);
        callback(null, expectedResponse);
      };
      const stream = client
        .listSubscriptionsStream(request, {})
        .on('data', (response: {}) => {
          assert.deepStrictEqual(response, expectedResponse);
          done();
        })
        .on('error', (err: FakeError) => {
          done(err);
        });
      stream.write(expectedResponse);
    });
  });
  describe('listSnapshots', () => {
    it('invokes listSnapshots without error', done => {
      const client = new subscriberModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });
      // Initialize client before mocking
      client.initialize();
      // Mock request
      const request: protosTypes.google.pubsub.v1.IListSnapshotsRequest = {};
      request.project = '';
      // Mock response
      const expectedResponse = {};
      // Mock Grpc layer
      client._innerApiCalls.listSnapshots = (
        actualRequest: {},
        options: {},
        callback: Callback
      ) => {
        assert.deepStrictEqual(actualRequest, request);
        callback(null, expectedResponse);
      };
      client.listSnapshots(request, (err: FakeError, response: {}) => {
        assert.ifError(err);
        assert.deepStrictEqual(response, expectedResponse);
        done();
      });
    });
  });
  describe('listSnapshotsStream', () => {
    it('invokes listSnapshotsStream without error', done => {
      const client = new subscriberModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });
      // Initialize client before mocking
      client.initialize();
      // Mock request
      const request: protosTypes.google.pubsub.v1.IListSnapshotsRequest = {};
      request.project = '';
      // Mock response
      const expectedResponse = {response: 'data'};
      // Mock Grpc layer
      client._innerApiCalls.listSnapshots = (
        actualRequest: {},
        options: {},
        callback: Callback
      ) => {
        assert.deepStrictEqual(actualRequest, request);
        callback(null, expectedResponse);
      };
      const stream = client
        .listSnapshotsStream(request, {})
        .on('data', (response: {}) => {
          assert.deepStrictEqual(response, expectedResponse);
          done();
        })
        .on('error', (err: FakeError) => {
          done(err);
        });
      stream.write(expectedResponse);
    });
  });
});
