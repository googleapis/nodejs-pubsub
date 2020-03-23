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
<<<<<<< HEAD
/* eslint-disable @typescript-eslint/no-var-requires */
=======
>>>>>>> feat: convert client to typescript
const publisherModule = require('../src');

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
describe('v1.PublisherClient', () => {
  it('has servicePath', () => {
    const servicePath = publisherModule.v1.PublisherClient.servicePath;
    assert(servicePath);
  });
  it('has apiEndpoint', () => {
    const apiEndpoint = publisherModule.v1.PublisherClient.apiEndpoint;
    assert(apiEndpoint);
  });
  it('has port', () => {
    const port = publisherModule.v1.PublisherClient.port;
    assert(port);
    assert(typeof port === 'number');
  });
  it('should create a client with no option', () => {
    const client = new publisherModule.v1.PublisherClient();
    assert(client);
  });
  it('should create a client with gRPC fallback', () => {
    const client = new publisherModule.v1.PublisherClient({
      fallback: true,
    });
    assert(client);
  });
  it('has initialize method and supports deferred initialization', async () => {
    const client = new publisherModule.v1.PublisherClient({
      credentials: {client_email: 'bogus', private_key: 'bogus'},
      projectId: 'bogus',
    });
    assert.strictEqual(client.publisherStub, undefined);
    await client.initialize();
    assert(client.publisherStub);
  });
  it('has close method', () => {
    const client = new publisherModule.v1.PublisherClient({
      credentials: {client_email: 'bogus', private_key: 'bogus'},
      projectId: 'bogus',
    });
    client.close();
  });
  describe('createTopic', () => {
    it('invokes createTopic without error', done => {
      const client = new publisherModule.v1.PublisherClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });
      // Initialize client before mocking
      client.initialize();
      // Mock request
      const request: protosTypes.google.pubsub.v1.ITopic = {};
      request.name = '';
      // Mock response
      const expectedResponse = {};
      // Mock gRPC layer
      client._innerApiCalls.createTopic = mockSimpleGrpcMethod(
        request,
        expectedResponse,
        null
      );
      client.createTopic(request, (err: {}, response: {}) => {
        assert.ifError(err);
        assert.deepStrictEqual(response, expectedResponse);
        done();
      });
    });

    it('invokes createTopic with error', done => {
      const client = new publisherModule.v1.PublisherClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });
      // Initialize client before mocking
      client.initialize();
      // Mock request
      const request: protosTypes.google.pubsub.v1.ITopic = {};
      request.name = '';
<<<<<<< HEAD
=======
      // Mock response
      const expectedResponse = {};
>>>>>>> feat: convert client to typescript
      // Mock gRPC layer
      client._innerApiCalls.createTopic = mockSimpleGrpcMethod(
        request,
        null,
        error
      );
      client.createTopic(request, (err: FakeError, response: {}) => {
        assert(err instanceof FakeError);
        assert.strictEqual(err.code, FAKE_STATUS_CODE);
        assert(typeof response === 'undefined');
        done();
      });
    });
  });
  describe('updateTopic', () => {
    it('invokes updateTopic without error', done => {
      const client = new publisherModule.v1.PublisherClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });
      // Initialize client before mocking
      client.initialize();
      // Mock request
      const request: protosTypes.google.pubsub.v1.IUpdateTopicRequest = {};
      request.topic = {};
      request.topic.name = '';
      // Mock response
      const expectedResponse = {};
      // Mock gRPC layer
      client._innerApiCalls.updateTopic = mockSimpleGrpcMethod(
        request,
        expectedResponse,
        null
      );
      client.updateTopic(request, (err: {}, response: {}) => {
        assert.ifError(err);
        assert.deepStrictEqual(response, expectedResponse);
        done();
      });
    });

    it('invokes updateTopic with error', done => {
      const client = new publisherModule.v1.PublisherClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });
      // Initialize client before mocking
      client.initialize();
      // Mock request
      const request: protosTypes.google.pubsub.v1.IUpdateTopicRequest = {};
      request.topic = {};
      request.topic.name = '';
<<<<<<< HEAD
=======
      // Mock response
      const expectedResponse = {};
>>>>>>> feat: convert client to typescript
      // Mock gRPC layer
      client._innerApiCalls.updateTopic = mockSimpleGrpcMethod(
        request,
        null,
        error
      );
      client.updateTopic(request, (err: FakeError, response: {}) => {
        assert(err instanceof FakeError);
        assert.strictEqual(err.code, FAKE_STATUS_CODE);
        assert(typeof response === 'undefined');
        done();
      });
    });
  });
  describe('publish', () => {
    it('invokes publish without error', done => {
      const client = new publisherModule.v1.PublisherClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });
      // Initialize client before mocking
      client.initialize();
      // Mock request
      const request: protosTypes.google.pubsub.v1.IPublishRequest = {};
      request.topic = '';
      // Mock response
      const expectedResponse = {};
      // Mock gRPC layer
      client._innerApiCalls.publish = mockSimpleGrpcMethod(
        request,
        expectedResponse,
        null
      );
      client.publish(request, (err: {}, response: {}) => {
        assert.ifError(err);
        assert.deepStrictEqual(response, expectedResponse);
        done();
      });
    });

    it('invokes publish with error', done => {
      const client = new publisherModule.v1.PublisherClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });
      // Initialize client before mocking
      client.initialize();
      // Mock request
      const request: protosTypes.google.pubsub.v1.IPublishRequest = {};
      request.topic = '';
<<<<<<< HEAD
=======
      // Mock response
      const expectedResponse = {};
>>>>>>> feat: convert client to typescript
      // Mock gRPC layer
      client._innerApiCalls.publish = mockSimpleGrpcMethod(
        request,
        null,
        error
      );
      client.publish(request, (err: FakeError, response: {}) => {
        assert(err instanceof FakeError);
        assert.strictEqual(err.code, FAKE_STATUS_CODE);
        assert(typeof response === 'undefined');
        done();
      });
    });
  });
  describe('getTopic', () => {
    it('invokes getTopic without error', done => {
      const client = new publisherModule.v1.PublisherClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });
      // Initialize client before mocking
      client.initialize();
      // Mock request
      const request: protosTypes.google.pubsub.v1.IGetTopicRequest = {};
      request.topic = '';
      // Mock response
      const expectedResponse = {};
      // Mock gRPC layer
      client._innerApiCalls.getTopic = mockSimpleGrpcMethod(
        request,
        expectedResponse,
        null
      );
      client.getTopic(request, (err: {}, response: {}) => {
        assert.ifError(err);
        assert.deepStrictEqual(response, expectedResponse);
        done();
      });
    });

    it('invokes getTopic with error', done => {
      const client = new publisherModule.v1.PublisherClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });
      // Initialize client before mocking
      client.initialize();
      // Mock request
      const request: protosTypes.google.pubsub.v1.IGetTopicRequest = {};
      request.topic = '';
<<<<<<< HEAD
=======
      // Mock response
      const expectedResponse = {};
>>>>>>> feat: convert client to typescript
      // Mock gRPC layer
      client._innerApiCalls.getTopic = mockSimpleGrpcMethod(
        request,
        null,
        error
      );
      client.getTopic(request, (err: FakeError, response: {}) => {
        assert(err instanceof FakeError);
        assert.strictEqual(err.code, FAKE_STATUS_CODE);
        assert(typeof response === 'undefined');
        done();
      });
    });
  });
  describe('deleteTopic', () => {
    it('invokes deleteTopic without error', done => {
      const client = new publisherModule.v1.PublisherClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });
      // Initialize client before mocking
      client.initialize();
      // Mock request
      const request: protosTypes.google.pubsub.v1.IDeleteTopicRequest = {};
      request.topic = '';
      // Mock response
      const expectedResponse = {};
      // Mock gRPC layer
      client._innerApiCalls.deleteTopic = mockSimpleGrpcMethod(
        request,
        expectedResponse,
        null
      );
      client.deleteTopic(request, (err: {}, response: {}) => {
        assert.ifError(err);
        assert.deepStrictEqual(response, expectedResponse);
        done();
      });
    });

    it('invokes deleteTopic with error', done => {
      const client = new publisherModule.v1.PublisherClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });
      // Initialize client before mocking
      client.initialize();
      // Mock request
      const request: protosTypes.google.pubsub.v1.IDeleteTopicRequest = {};
      request.topic = '';
<<<<<<< HEAD
=======
      // Mock response
      const expectedResponse = {};
>>>>>>> feat: convert client to typescript
      // Mock gRPC layer
      client._innerApiCalls.deleteTopic = mockSimpleGrpcMethod(
        request,
        null,
        error
      );
      client.deleteTopic(request, (err: FakeError, response: {}) => {
        assert(err instanceof FakeError);
        assert.strictEqual(err.code, FAKE_STATUS_CODE);
        assert(typeof response === 'undefined');
        done();
      });
    });
  });
  describe('listTopics', () => {
    it('invokes listTopics without error', done => {
      const client = new publisherModule.v1.PublisherClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });
      // Initialize client before mocking
      client.initialize();
      // Mock request
      const request: protosTypes.google.pubsub.v1.IListTopicsRequest = {};
      request.project = '';
      // Mock response
      const expectedResponse = {};
      // Mock Grpc layer
      client._innerApiCalls.listTopics = (
        actualRequest: {},
        options: {},
        callback: Callback
      ) => {
        assert.deepStrictEqual(actualRequest, request);
        callback(null, expectedResponse);
      };
      client.listTopics(request, (err: FakeError, response: {}) => {
        assert.ifError(err);
        assert.deepStrictEqual(response, expectedResponse);
        done();
      });
    });
  });
  describe('listTopicsStream', () => {
    it('invokes listTopicsStream without error', done => {
      const client = new publisherModule.v1.PublisherClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });
      // Initialize client before mocking
      client.initialize();
      // Mock request
      const request: protosTypes.google.pubsub.v1.IListTopicsRequest = {};
      request.project = '';
      // Mock response
      const expectedResponse = {response: 'data'};
      // Mock Grpc layer
      client._innerApiCalls.listTopics = (
        actualRequest: {},
        options: {},
        callback: Callback
      ) => {
        assert.deepStrictEqual(actualRequest, request);
        callback(null, expectedResponse);
      };
      const stream = client
        .listTopicsStream(request, {})
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
  describe('listTopicSubscriptions', () => {
    it('invokes listTopicSubscriptions without error', done => {
      const client = new publisherModule.v1.PublisherClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });
      // Initialize client before mocking
      client.initialize();
      // Mock request
      const request: protosTypes.google.pubsub.v1.IListTopicSubscriptionsRequest = {};
      request.topic = '';
      // Mock response
      const expectedResponse = {};
      // Mock Grpc layer
      client._innerApiCalls.listTopicSubscriptions = (
        actualRequest: {},
        options: {},
        callback: Callback
      ) => {
        assert.deepStrictEqual(actualRequest, request);
        callback(null, expectedResponse);
      };
      client.listTopicSubscriptions(request, (err: FakeError, response: {}) => {
        assert.ifError(err);
        assert.deepStrictEqual(response, expectedResponse);
        done();
      });
    });
  });
  describe('listTopicSubscriptionsStream', () => {
    it('invokes listTopicSubscriptionsStream without error', done => {
      const client = new publisherModule.v1.PublisherClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });
      // Initialize client before mocking
      client.initialize();
      // Mock request
      const request: protosTypes.google.pubsub.v1.IListTopicSubscriptionsRequest = {};
      request.topic = '';
      // Mock response
      const expectedResponse = {response: 'data'};
      // Mock Grpc layer
      client._innerApiCalls.listTopicSubscriptions = (
        actualRequest: {},
        options: {},
        callback: Callback
      ) => {
        assert.deepStrictEqual(actualRequest, request);
        callback(null, expectedResponse);
      };
      const stream = client
        .listTopicSubscriptionsStream(request, {})
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
  describe('listTopicSnapshots', () => {
    it('invokes listTopicSnapshots without error', done => {
      const client = new publisherModule.v1.PublisherClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });
      // Initialize client before mocking
      client.initialize();
      // Mock request
      const request: protosTypes.google.pubsub.v1.IListTopicSnapshotsRequest = {};
      request.topic = '';
      // Mock response
      const expectedResponse = {};
      // Mock Grpc layer
      client._innerApiCalls.listTopicSnapshots = (
        actualRequest: {},
        options: {},
        callback: Callback
      ) => {
        assert.deepStrictEqual(actualRequest, request);
        callback(null, expectedResponse);
      };
      client.listTopicSnapshots(request, (err: FakeError, response: {}) => {
        assert.ifError(err);
        assert.deepStrictEqual(response, expectedResponse);
        done();
      });
    });
  });
  describe('listTopicSnapshotsStream', () => {
    it('invokes listTopicSnapshotsStream without error', done => {
      const client = new publisherModule.v1.PublisherClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });
      // Initialize client before mocking
      client.initialize();
      // Mock request
      const request: protosTypes.google.pubsub.v1.IListTopicSnapshotsRequest = {};
      request.topic = '';
      // Mock response
      const expectedResponse = {response: 'data'};
      // Mock Grpc layer
      client._innerApiCalls.listTopicSnapshots = (
        actualRequest: {},
        options: {},
        callback: Callback
      ) => {
        assert.deepStrictEqual(actualRequest, request);
        callback(null, expectedResponse);
      };
      const stream = client
        .listTopicSnapshotsStream(request, {})
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
