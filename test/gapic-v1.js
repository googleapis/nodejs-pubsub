// Copyright 2019 Google LLC
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

'use strict';

const assert = require('assert');
const through2 = require('through2');

const pubsubModule = require('../src');

const FAKE_STATUS_CODE = 1;
const error = new Error();
error.code = FAKE_STATUS_CODE;

describe('PublisherClient', () => {
  it('has servicePath', () => {
    const servicePath = pubsubModule.v1.PublisherClient.servicePath;
    assert(servicePath);
  });

  it('has apiEndpoint', () => {
    const apiEndpoint = pubsubModule.v1.PublisherClient.apiEndpoint;
    assert(apiEndpoint);
  });

  it('has port', () => {
    const port = pubsubModule.v1.PublisherClient.port;
    assert(port);
    assert(typeof port === 'number');
  });

  it('should create a client with no options', () => {
    const client = new pubsubModule.v1.PublisherClient();
    assert(client);
  });

  describe('createTopic', () => {
    it('invokes createTopic without error', done => {
      const client = new pubsubModule.v1.PublisherClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      const formattedName = client.topicPath('[PROJECT]', '[TOPIC]');
      const request = {
        name: formattedName,
      };

      // Mock response
      const name2 = 'name2-1052831874';
      const kmsKeyName = 'kmsKeyName2094986649';
      const expectedResponse = {
        name: name2,
        kmsKeyName: kmsKeyName,
      };

      // Mock Grpc layer
      client._innerApiCalls.createTopic = mockSimpleGrpcMethod(
        request,
        expectedResponse
      );

      client.createTopic(request, (err, response) => {
        assert.ifError(err);
        assert.deepStrictEqual(response, expectedResponse);
        done();
      });
    });

    it('invokes createTopic with error', done => {
      const client = new pubsubModule.v1.PublisherClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      const formattedName = client.topicPath('[PROJECT]', '[TOPIC]');
      const request = {
        name: formattedName,
      };

      // Mock Grpc layer
      client._innerApiCalls.createTopic = mockSimpleGrpcMethod(
        request,
        null,
        error
      );

      client.createTopic(request, (err, response) => {
        assert(err instanceof Error);
        assert.strictEqual(err.code, FAKE_STATUS_CODE);
        assert(typeof response === 'undefined');
        done();
      });
    });
  });

  describe('updateTopic', () => {
    it('invokes updateTopic without error', done => {
      const client = new pubsubModule.v1.PublisherClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      const topic = {};
      const updateMask = {};
      const request = {
        topic: topic,
        updateMask: updateMask,
      };

      // Mock response
      const name = 'name3373707';
      const kmsKeyName = 'kmsKeyName2094986649';
      const expectedResponse = {
        name: name,
        kmsKeyName: kmsKeyName,
      };

      // Mock Grpc layer
      client._innerApiCalls.updateTopic = mockSimpleGrpcMethod(
        request,
        expectedResponse
      );

      client.updateTopic(request, (err, response) => {
        assert.ifError(err);
        assert.deepStrictEqual(response, expectedResponse);
        done();
      });
    });

    it('invokes updateTopic with error', done => {
      const client = new pubsubModule.v1.PublisherClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      const topic = {};
      const updateMask = {};
      const request = {
        topic: topic,
        updateMask: updateMask,
      };

      // Mock Grpc layer
      client._innerApiCalls.updateTopic = mockSimpleGrpcMethod(
        request,
        null,
        error
      );

      client.updateTopic(request, (err, response) => {
        assert(err instanceof Error);
        assert.strictEqual(err.code, FAKE_STATUS_CODE);
        assert(typeof response === 'undefined');
        done();
      });
    });
  });

  describe('publish', () => {
    it('invokes publish without error', done => {
      const client = new pubsubModule.v1.PublisherClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      const formattedTopic = client.topicPath('[PROJECT]', '[TOPIC]');
      const data = '-86';
      const messagesElement = {
        data: data,
      };
      const messages = [messagesElement];
      const request = {
        topic: formattedTopic,
        messages: messages,
      };

      // Mock response
      const messageIdsElement = 'messageIdsElement-744837059';
      const messageIds = [messageIdsElement];
      const expectedResponse = {
        messageIds: messageIds,
      };

      // Mock Grpc layer
      client._innerApiCalls.publish = mockSimpleGrpcMethod(
        request,
        expectedResponse
      );

      client.publish(request, (err, response) => {
        assert.ifError(err);
        assert.deepStrictEqual(response, expectedResponse);
        done();
      });
    });

    it('invokes publish with error', done => {
      const client = new pubsubModule.v1.PublisherClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      const formattedTopic = client.topicPath('[PROJECT]', '[TOPIC]');
      const data = '-86';
      const messagesElement = {
        data: data,
      };
      const messages = [messagesElement];
      const request = {
        topic: formattedTopic,
        messages: messages,
      };

      // Mock Grpc layer
      client._innerApiCalls.publish = mockSimpleGrpcMethod(
        request,
        null,
        error
      );

      client.publish(request, (err, response) => {
        assert(err instanceof Error);
        assert.strictEqual(err.code, FAKE_STATUS_CODE);
        assert(typeof response === 'undefined');
        done();
      });
    });
  });

  describe('getTopic', () => {
    it('invokes getTopic without error', done => {
      const client = new pubsubModule.v1.PublisherClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      const formattedTopic = client.topicPath('[PROJECT]', '[TOPIC]');
      const request = {
        topic: formattedTopic,
      };

      // Mock response
      const name = 'name3373707';
      const kmsKeyName = 'kmsKeyName2094986649';
      const expectedResponse = {
        name: name,
        kmsKeyName: kmsKeyName,
      };

      // Mock Grpc layer
      client._innerApiCalls.getTopic = mockSimpleGrpcMethod(
        request,
        expectedResponse
      );

      client.getTopic(request, (err, response) => {
        assert.ifError(err);
        assert.deepStrictEqual(response, expectedResponse);
        done();
      });
    });

    it('invokes getTopic with error', done => {
      const client = new pubsubModule.v1.PublisherClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      const formattedTopic = client.topicPath('[PROJECT]', '[TOPIC]');
      const request = {
        topic: formattedTopic,
      };

      // Mock Grpc layer
      client._innerApiCalls.getTopic = mockSimpleGrpcMethod(
        request,
        null,
        error
      );

      client.getTopic(request, (err, response) => {
        assert(err instanceof Error);
        assert.strictEqual(err.code, FAKE_STATUS_CODE);
        assert(typeof response === 'undefined');
        done();
      });
    });
  });

  describe('listTopics', () => {
    it('invokes listTopics without error', done => {
      const client = new pubsubModule.v1.PublisherClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      const formattedProject = client.projectPath('[PROJECT]');
      const request = {
        project: formattedProject,
      };

      // Mock response
      const nextPageToken = '';
      const topicsElement = {};
      const topics = [topicsElement];
      const expectedResponse = {
        nextPageToken: nextPageToken,
        topics: topics,
      };

      // Mock Grpc layer
      client._innerApiCalls.listTopics = (actualRequest, options, callback) => {
        assert.deepStrictEqual(actualRequest, request);
        callback(null, expectedResponse.topics);
      };

      client.listTopics(request, (err, response) => {
        assert.ifError(err);
        assert.deepStrictEqual(response, expectedResponse.topics);
        done();
      });
    });

    it('invokes listTopics with error', done => {
      const client = new pubsubModule.v1.PublisherClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      const formattedProject = client.projectPath('[PROJECT]');
      const request = {
        project: formattedProject,
      };

      // Mock Grpc layer
      client._innerApiCalls.listTopics = mockSimpleGrpcMethod(
        request,
        null,
        error
      );

      client.listTopics(request, (err, response) => {
        assert(err instanceof Error);
        assert.strictEqual(err.code, FAKE_STATUS_CODE);
        assert(typeof response === 'undefined');
        done();
      });
    });
  });

  describe('listTopicSubscriptions', () => {
    it('invokes listTopicSubscriptions without error', done => {
      const client = new pubsubModule.v1.PublisherClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      const formattedTopic = client.topicPath('[PROJECT]', '[TOPIC]');
      const request = {
        topic: formattedTopic,
      };

      // Mock response
      const nextPageToken = '';
      const subscriptionsElement = 'subscriptionsElement1698708147';
      const subscriptions = [subscriptionsElement];
      const expectedResponse = {
        nextPageToken: nextPageToken,
        subscriptions: subscriptions,
      };

      // Mock Grpc layer
      client._innerApiCalls.listTopicSubscriptions = (
        actualRequest,
        options,
        callback
      ) => {
        assert.deepStrictEqual(actualRequest, request);
        callback(null, expectedResponse.subscriptions);
      };

      client.listTopicSubscriptions(request, (err, response) => {
        assert.ifError(err);
        assert.deepStrictEqual(response, expectedResponse.subscriptions);
        done();
      });
    });

    it('invokes listTopicSubscriptions with error', done => {
      const client = new pubsubModule.v1.PublisherClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      const formattedTopic = client.topicPath('[PROJECT]', '[TOPIC]');
      const request = {
        topic: formattedTopic,
      };

      // Mock Grpc layer
      client._innerApiCalls.listTopicSubscriptions = mockSimpleGrpcMethod(
        request,
        null,
        error
      );

      client.listTopicSubscriptions(request, (err, response) => {
        assert(err instanceof Error);
        assert.strictEqual(err.code, FAKE_STATUS_CODE);
        assert(typeof response === 'undefined');
        done();
      });
    });
  });

  describe('deleteTopic', () => {
    it('invokes deleteTopic without error', done => {
      const client = new pubsubModule.v1.PublisherClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      const formattedTopic = client.topicPath('[PROJECT]', '[TOPIC]');
      const request = {
        topic: formattedTopic,
      };

      // Mock Grpc layer
      client._innerApiCalls.deleteTopic = mockSimpleGrpcMethod(request);

      client.deleteTopic(request, err => {
        assert.ifError(err);
        done();
      });
    });

    it('invokes deleteTopic with error', done => {
      const client = new pubsubModule.v1.PublisherClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      const formattedTopic = client.topicPath('[PROJECT]', '[TOPIC]');
      const request = {
        topic: formattedTopic,
      };

      // Mock Grpc layer
      client._innerApiCalls.deleteTopic = mockSimpleGrpcMethod(
        request,
        null,
        error
      );

      client.deleteTopic(request, err => {
        assert(err instanceof Error);
        assert.strictEqual(err.code, FAKE_STATUS_CODE);
        done();
      });
    });
  });

  describe('setIamPolicy', () => {
    it('invokes setIamPolicy without error', done => {
      const client = new pubsubModule.v1.PublisherClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      const formattedResource = client.topicPath('[PROJECT]', '[TOPIC]');
      const policy = {};
      const request = {
        resource: formattedResource,
        policy: policy,
      };

      // Mock response
      const version = 351608024;
      const etag = '21';
      const expectedResponse = {
        version: version,
        etag: etag,
      };

      // Mock Grpc layer
      client._innerApiCalls.setIamPolicy = mockSimpleGrpcMethod(
        request,
        expectedResponse
      );

      client.setIamPolicy(request, (err, response) => {
        assert.ifError(err);
        assert.deepStrictEqual(response, expectedResponse);
        done();
      });
    });

    it('invokes setIamPolicy with error', done => {
      const client = new pubsubModule.v1.PublisherClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      const formattedResource = client.topicPath('[PROJECT]', '[TOPIC]');
      const policy = {};
      const request = {
        resource: formattedResource,
        policy: policy,
      };

      // Mock Grpc layer
      client._innerApiCalls.setIamPolicy = mockSimpleGrpcMethod(
        request,
        null,
        error
      );

      client.setIamPolicy(request, (err, response) => {
        assert(err instanceof Error);
        assert.strictEqual(err.code, FAKE_STATUS_CODE);
        assert(typeof response === 'undefined');
        done();
      });
    });
  });

  describe('getIamPolicy', () => {
    it('invokes getIamPolicy without error', done => {
      const client = new pubsubModule.v1.PublisherClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      const formattedResource = client.topicPath('[PROJECT]', '[TOPIC]');
      const request = {
        resource: formattedResource,
      };

      // Mock response
      const version = 351608024;
      const etag = '21';
      const expectedResponse = {
        version: version,
        etag: etag,
      };

      // Mock Grpc layer
      client._innerApiCalls.getIamPolicy = mockSimpleGrpcMethod(
        request,
        expectedResponse
      );

      client.getIamPolicy(request, (err, response) => {
        assert.ifError(err);
        assert.deepStrictEqual(response, expectedResponse);
        done();
      });
    });

    it('invokes getIamPolicy with error', done => {
      const client = new pubsubModule.v1.PublisherClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      const formattedResource = client.topicPath('[PROJECT]', '[TOPIC]');
      const request = {
        resource: formattedResource,
      };

      // Mock Grpc layer
      client._innerApiCalls.getIamPolicy = mockSimpleGrpcMethod(
        request,
        null,
        error
      );

      client.getIamPolicy(request, (err, response) => {
        assert(err instanceof Error);
        assert.strictEqual(err.code, FAKE_STATUS_CODE);
        assert(typeof response === 'undefined');
        done();
      });
    });
  });

  describe('testIamPermissions', () => {
    it('invokes testIamPermissions without error', done => {
      const client = new pubsubModule.v1.PublisherClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      const formattedResource = client.topicPath('[PROJECT]', '[TOPIC]');
      const permissions = [];
      const request = {
        resource: formattedResource,
        permissions: permissions,
      };

      // Mock response
      const expectedResponse = {};

      // Mock Grpc layer
      client._innerApiCalls.testIamPermissions = mockSimpleGrpcMethod(
        request,
        expectedResponse
      );

      client.testIamPermissions(request, (err, response) => {
        assert.ifError(err);
        assert.deepStrictEqual(response, expectedResponse);
        done();
      });
    });

    it('invokes testIamPermissions with error', done => {
      const client = new pubsubModule.v1.PublisherClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      const formattedResource = client.topicPath('[PROJECT]', '[TOPIC]');
      const permissions = [];
      const request = {
        resource: formattedResource,
        permissions: permissions,
      };

      // Mock Grpc layer
      client._innerApiCalls.testIamPermissions = mockSimpleGrpcMethod(
        request,
        null,
        error
      );

      client.testIamPermissions(request, (err, response) => {
        assert(err instanceof Error);
        assert.strictEqual(err.code, FAKE_STATUS_CODE);
        assert(typeof response === 'undefined');
        done();
      });
    });
  });
});
describe('SubscriberClient', () => {
  it('has servicePath', () => {
    const servicePath = pubsubModule.v1.SubscriberClient.servicePath;
    assert(servicePath);
  });

  it('has apiEndpoint', () => {
    const apiEndpoint = pubsubModule.v1.SubscriberClient.apiEndpoint;
    assert(apiEndpoint);
  });

  it('has port', () => {
    const port = pubsubModule.v1.SubscriberClient.port;
    assert(port);
    assert(typeof port === 'number');
  });

  it('should create a client with no options', () => {
    const client = new pubsubModule.v1.SubscriberClient();
    assert(client);
  });

  describe('createSubscription', () => {
    it('invokes createSubscription without error', done => {
      const client = new pubsubModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      const formattedName = client.subscriptionPath(
        '[PROJECT]',
        '[SUBSCRIPTION]'
      );
      const formattedTopic = client.topicPath('[PROJECT]', '[TOPIC]');
      const request = {
        name: formattedName,
        topic: formattedTopic,
      };

      // Mock response
      const name2 = 'name2-1052831874';
      const topic2 = 'topic2-1139259102';
      const ackDeadlineSeconds = 2135351438;
      const retainAckedMessages = false;
      const enableMessageOrdering = true;
      const expectedResponse = {
        name: name2,
        topic: topic2,
        ackDeadlineSeconds: ackDeadlineSeconds,
        retainAckedMessages: retainAckedMessages,
        enableMessageOrdering: enableMessageOrdering,
      };

      // Mock Grpc layer
      client._innerApiCalls.createSubscription = mockSimpleGrpcMethod(
        request,
        expectedResponse
      );

      client.createSubscription(request, (err, response) => {
        assert.ifError(err);
        assert.deepStrictEqual(response, expectedResponse);
        done();
      });
    });

    it('invokes createSubscription with error', done => {
      const client = new pubsubModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      const formattedName = client.subscriptionPath(
        '[PROJECT]',
        '[SUBSCRIPTION]'
      );
      const formattedTopic = client.topicPath('[PROJECT]', '[TOPIC]');
      const request = {
        name: formattedName,
        topic: formattedTopic,
      };

      // Mock Grpc layer
      client._innerApiCalls.createSubscription = mockSimpleGrpcMethod(
        request,
        null,
        error
      );

      client.createSubscription(request, (err, response) => {
        assert(err instanceof Error);
        assert.strictEqual(err.code, FAKE_STATUS_CODE);
        assert(typeof response === 'undefined');
        done();
      });
    });
  });

  describe('getSubscription', () => {
    it('invokes getSubscription without error', done => {
      const client = new pubsubModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      const formattedSubscription = client.subscriptionPath(
        '[PROJECT]',
        '[SUBSCRIPTION]'
      );
      const request = {
        subscription: formattedSubscription,
      };

      // Mock response
      const name = 'name3373707';
      const topic = 'topic110546223';
      const ackDeadlineSeconds = 2135351438;
      const retainAckedMessages = false;
      const enableMessageOrdering = true;
      const expectedResponse = {
        name: name,
        topic: topic,
        ackDeadlineSeconds: ackDeadlineSeconds,
        retainAckedMessages: retainAckedMessages,
        enableMessageOrdering: enableMessageOrdering,
      };

      // Mock Grpc layer
      client._innerApiCalls.getSubscription = mockSimpleGrpcMethod(
        request,
        expectedResponse
      );

      client.getSubscription(request, (err, response) => {
        assert.ifError(err);
        assert.deepStrictEqual(response, expectedResponse);
        done();
      });
    });

    it('invokes getSubscription with error', done => {
      const client = new pubsubModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      const formattedSubscription = client.subscriptionPath(
        '[PROJECT]',
        '[SUBSCRIPTION]'
      );
      const request = {
        subscription: formattedSubscription,
      };

      // Mock Grpc layer
      client._innerApiCalls.getSubscription = mockSimpleGrpcMethod(
        request,
        null,
        error
      );

      client.getSubscription(request, (err, response) => {
        assert(err instanceof Error);
        assert.strictEqual(err.code, FAKE_STATUS_CODE);
        assert(typeof response === 'undefined');
        done();
      });
    });
  });

  describe('updateSubscription', () => {
    it('invokes updateSubscription without error', done => {
      const client = new pubsubModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      const ackDeadlineSeconds = 42;
      const subscription = {
        ackDeadlineSeconds: ackDeadlineSeconds,
      };
      const pathsElement = 'ack_deadline_seconds';
      const paths = [pathsElement];
      const updateMask = {
        paths: paths,
      };
      const request = {
        subscription: subscription,
        updateMask: updateMask,
      };

      // Mock response
      const name = 'name3373707';
      const topic = 'topic110546223';
      const ackDeadlineSeconds2 = 921632575;
      const retainAckedMessages = false;
      const enableMessageOrdering = true;
      const expectedResponse = {
        name: name,
        topic: topic,
        ackDeadlineSeconds: ackDeadlineSeconds2,
        retainAckedMessages: retainAckedMessages,
        enableMessageOrdering: enableMessageOrdering,
      };

      // Mock Grpc layer
      client._innerApiCalls.updateSubscription = mockSimpleGrpcMethod(
        request,
        expectedResponse
      );

      client.updateSubscription(request, (err, response) => {
        assert.ifError(err);
        assert.deepStrictEqual(response, expectedResponse);
        done();
      });
    });

    it('invokes updateSubscription with error', done => {
      const client = new pubsubModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      const ackDeadlineSeconds = 42;
      const subscription = {
        ackDeadlineSeconds: ackDeadlineSeconds,
      };
      const pathsElement = 'ack_deadline_seconds';
      const paths = [pathsElement];
      const updateMask = {
        paths: paths,
      };
      const request = {
        subscription: subscription,
        updateMask: updateMask,
      };

      // Mock Grpc layer
      client._innerApiCalls.updateSubscription = mockSimpleGrpcMethod(
        request,
        null,
        error
      );

      client.updateSubscription(request, (err, response) => {
        assert(err instanceof Error);
        assert.strictEqual(err.code, FAKE_STATUS_CODE);
        assert(typeof response === 'undefined');
        done();
      });
    });
  });

  describe('listSubscriptions', () => {
    it('invokes listSubscriptions without error', done => {
      const client = new pubsubModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      const formattedProject = client.projectPath('[PROJECT]');
      const request = {
        project: formattedProject,
      };

      // Mock response
      const nextPageToken = '';
      const subscriptionsElement = {};
      const subscriptions = [subscriptionsElement];
      const expectedResponse = {
        nextPageToken: nextPageToken,
        subscriptions: subscriptions,
      };

      // Mock Grpc layer
      client._innerApiCalls.listSubscriptions = (
        actualRequest,
        options,
        callback
      ) => {
        assert.deepStrictEqual(actualRequest, request);
        callback(null, expectedResponse.subscriptions);
      };

      client.listSubscriptions(request, (err, response) => {
        assert.ifError(err);
        assert.deepStrictEqual(response, expectedResponse.subscriptions);
        done();
      });
    });

    it('invokes listSubscriptions with error', done => {
      const client = new pubsubModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      const formattedProject = client.projectPath('[PROJECT]');
      const request = {
        project: formattedProject,
      };

      // Mock Grpc layer
      client._innerApiCalls.listSubscriptions = mockSimpleGrpcMethod(
        request,
        null,
        error
      );

      client.listSubscriptions(request, (err, response) => {
        assert(err instanceof Error);
        assert.strictEqual(err.code, FAKE_STATUS_CODE);
        assert(typeof response === 'undefined');
        done();
      });
    });
  });

  describe('deleteSubscription', () => {
    it('invokes deleteSubscription without error', done => {
      const client = new pubsubModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      const formattedSubscription = client.subscriptionPath(
        '[PROJECT]',
        '[SUBSCRIPTION]'
      );
      const request = {
        subscription: formattedSubscription,
      };

      // Mock Grpc layer
      client._innerApiCalls.deleteSubscription = mockSimpleGrpcMethod(request);

      client.deleteSubscription(request, err => {
        assert.ifError(err);
        done();
      });
    });

    it('invokes deleteSubscription with error', done => {
      const client = new pubsubModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      const formattedSubscription = client.subscriptionPath(
        '[PROJECT]',
        '[SUBSCRIPTION]'
      );
      const request = {
        subscription: formattedSubscription,
      };

      // Mock Grpc layer
      client._innerApiCalls.deleteSubscription = mockSimpleGrpcMethod(
        request,
        null,
        error
      );

      client.deleteSubscription(request, err => {
        assert(err instanceof Error);
        assert.strictEqual(err.code, FAKE_STATUS_CODE);
        done();
      });
    });
  });

  describe('modifyAckDeadline', () => {
    it('invokes modifyAckDeadline without error', done => {
      const client = new pubsubModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      const formattedSubscription = client.subscriptionPath(
        '[PROJECT]',
        '[SUBSCRIPTION]'
      );
      const ackIds = [];
      const ackDeadlineSeconds = 2135351438;
      const request = {
        subscription: formattedSubscription,
        ackIds: ackIds,
        ackDeadlineSeconds: ackDeadlineSeconds,
      };

      // Mock Grpc layer
      client._innerApiCalls.modifyAckDeadline = mockSimpleGrpcMethod(request);

      client.modifyAckDeadline(request, err => {
        assert.ifError(err);
        done();
      });
    });

    it('invokes modifyAckDeadline with error', done => {
      const client = new pubsubModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      const formattedSubscription = client.subscriptionPath(
        '[PROJECT]',
        '[SUBSCRIPTION]'
      );
      const ackIds = [];
      const ackDeadlineSeconds = 2135351438;
      const request = {
        subscription: formattedSubscription,
        ackIds: ackIds,
        ackDeadlineSeconds: ackDeadlineSeconds,
      };

      // Mock Grpc layer
      client._innerApiCalls.modifyAckDeadline = mockSimpleGrpcMethod(
        request,
        null,
        error
      );

      client.modifyAckDeadline(request, err => {
        assert(err instanceof Error);
        assert.strictEqual(err.code, FAKE_STATUS_CODE);
        done();
      });
    });
  });

  describe('acknowledge', () => {
    it('invokes acknowledge without error', done => {
      const client = new pubsubModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      const formattedSubscription = client.subscriptionPath(
        '[PROJECT]',
        '[SUBSCRIPTION]'
      );
      const ackIds = [];
      const request = {
        subscription: formattedSubscription,
        ackIds: ackIds,
      };

      // Mock Grpc layer
      client._innerApiCalls.acknowledge = mockSimpleGrpcMethod(request);

      client.acknowledge(request, err => {
        assert.ifError(err);
        done();
      });
    });

    it('invokes acknowledge with error', done => {
      const client = new pubsubModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      const formattedSubscription = client.subscriptionPath(
        '[PROJECT]',
        '[SUBSCRIPTION]'
      );
      const ackIds = [];
      const request = {
        subscription: formattedSubscription,
        ackIds: ackIds,
      };

      // Mock Grpc layer
      client._innerApiCalls.acknowledge = mockSimpleGrpcMethod(
        request,
        null,
        error
      );

      client.acknowledge(request, err => {
        assert(err instanceof Error);
        assert.strictEqual(err.code, FAKE_STATUS_CODE);
        done();
      });
    });
  });

  describe('pull', () => {
    it('invokes pull without error', done => {
      const client = new pubsubModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      const formattedSubscription = client.subscriptionPath(
        '[PROJECT]',
        '[SUBSCRIPTION]'
      );
      const maxMessages = 496131527;
      const request = {
        subscription: formattedSubscription,
        maxMessages: maxMessages,
      };

      // Mock response
      const expectedResponse = {};

      // Mock Grpc layer
      client._innerApiCalls.pull = mockSimpleGrpcMethod(
        request,
        expectedResponse
      );

      client.pull(request, (err, response) => {
        assert.ifError(err);
        assert.deepStrictEqual(response, expectedResponse);
        done();
      });
    });

    it('invokes pull with error', done => {
      const client = new pubsubModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      const formattedSubscription = client.subscriptionPath(
        '[PROJECT]',
        '[SUBSCRIPTION]'
      );
      const maxMessages = 496131527;
      const request = {
        subscription: formattedSubscription,
        maxMessages: maxMessages,
      };

      // Mock Grpc layer
      client._innerApiCalls.pull = mockSimpleGrpcMethod(request, null, error);

      client.pull(request, (err, response) => {
        assert(err instanceof Error);
        assert.strictEqual(err.code, FAKE_STATUS_CODE);
        assert(typeof response === 'undefined');
        done();
      });
    });
  });

  describe('streamingPull', () => {
    it('invokes streamingPull without error', done => {
      const client = new pubsubModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      const formattedSubscription = client.subscriptionPath(
        '[PROJECT]',
        '[SUBSCRIPTION]'
      );
      const streamAckDeadlineSeconds = 1875467245;
      const request = {
        subscription: formattedSubscription,
        streamAckDeadlineSeconds: streamAckDeadlineSeconds,
      };

      // Mock response
      const receivedMessagesElement = {};
      const receivedMessages = [receivedMessagesElement];
      const expectedResponse = {
        receivedMessages: receivedMessages,
      };

      // Mock Grpc layer
      client._innerApiCalls.streamingPull = mockBidiStreamingGrpcMethod(
        request,
        expectedResponse
      );

      const stream = client
        .streamingPull()
        .on('data', response => {
          assert.deepStrictEqual(response, expectedResponse);
          done();
        })
        .on('error', err => {
          done(err);
        });

      stream.write(request);
    });

    it('invokes streamingPull with error', done => {
      const client = new pubsubModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      const formattedSubscription = client.subscriptionPath(
        '[PROJECT]',
        '[SUBSCRIPTION]'
      );
      const streamAckDeadlineSeconds = 1875467245;
      const request = {
        subscription: formattedSubscription,
        streamAckDeadlineSeconds: streamAckDeadlineSeconds,
      };

      // Mock Grpc layer
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
        .on('error', err => {
          assert(err instanceof Error);
          assert.strictEqual(err.code, FAKE_STATUS_CODE);
          done();
        });

      stream.write(request);
    });
  });

  describe('modifyPushConfig', () => {
    it('invokes modifyPushConfig without error', done => {
      const client = new pubsubModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      const formattedSubscription = client.subscriptionPath(
        '[PROJECT]',
        '[SUBSCRIPTION]'
      );
      const pushConfig = {};
      const request = {
        subscription: formattedSubscription,
        pushConfig: pushConfig,
      };

      // Mock Grpc layer
      client._innerApiCalls.modifyPushConfig = mockSimpleGrpcMethod(request);

      client.modifyPushConfig(request, err => {
        assert.ifError(err);
        done();
      });
    });

    it('invokes modifyPushConfig with error', done => {
      const client = new pubsubModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      const formattedSubscription = client.subscriptionPath(
        '[PROJECT]',
        '[SUBSCRIPTION]'
      );
      const pushConfig = {};
      const request = {
        subscription: formattedSubscription,
        pushConfig: pushConfig,
      };

      // Mock Grpc layer
      client._innerApiCalls.modifyPushConfig = mockSimpleGrpcMethod(
        request,
        null,
        error
      );

      client.modifyPushConfig(request, err => {
        assert(err instanceof Error);
        assert.strictEqual(err.code, FAKE_STATUS_CODE);
        done();
      });
    });
  });

  describe('listSnapshots', () => {
    it('invokes listSnapshots without error', done => {
      const client = new pubsubModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      const formattedProject = client.projectPath('[PROJECT]');
      const request = {
        project: formattedProject,
      };

      // Mock response
      const nextPageToken = '';
      const snapshotsElement = {};
      const snapshots = [snapshotsElement];
      const expectedResponse = {
        nextPageToken: nextPageToken,
        snapshots: snapshots,
      };

      // Mock Grpc layer
      client._innerApiCalls.listSnapshots = (
        actualRequest,
        options,
        callback
      ) => {
        assert.deepStrictEqual(actualRequest, request);
        callback(null, expectedResponse.snapshots);
      };

      client.listSnapshots(request, (err, response) => {
        assert.ifError(err);
        assert.deepStrictEqual(response, expectedResponse.snapshots);
        done();
      });
    });

    it('invokes listSnapshots with error', done => {
      const client = new pubsubModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      const formattedProject = client.projectPath('[PROJECT]');
      const request = {
        project: formattedProject,
      };

      // Mock Grpc layer
      client._innerApiCalls.listSnapshots = mockSimpleGrpcMethod(
        request,
        null,
        error
      );

      client.listSnapshots(request, (err, response) => {
        assert(err instanceof Error);
        assert.strictEqual(err.code, FAKE_STATUS_CODE);
        assert(typeof response === 'undefined');
        done();
      });
    });
  });

  describe('createSnapshot', () => {
    it('invokes createSnapshot without error', done => {
      const client = new pubsubModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      const formattedName = client.snapshotPath('[PROJECT]', '[SNAPSHOT]');
      const formattedSubscription = client.subscriptionPath(
        '[PROJECT]',
        '[SUBSCRIPTION]'
      );
      const request = {
        name: formattedName,
        subscription: formattedSubscription,
      };

      // Mock response
      const name2 = 'name2-1052831874';
      const topic = 'topic110546223';
      const expectedResponse = {
        name: name2,
        topic: topic,
      };

      // Mock Grpc layer
      client._innerApiCalls.createSnapshot = mockSimpleGrpcMethod(
        request,
        expectedResponse
      );

      client.createSnapshot(request, (err, response) => {
        assert.ifError(err);
        assert.deepStrictEqual(response, expectedResponse);
        done();
      });
    });

    it('invokes createSnapshot with error', done => {
      const client = new pubsubModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      const formattedName = client.snapshotPath('[PROJECT]', '[SNAPSHOT]');
      const formattedSubscription = client.subscriptionPath(
        '[PROJECT]',
        '[SUBSCRIPTION]'
      );
      const request = {
        name: formattedName,
        subscription: formattedSubscription,
      };

      // Mock Grpc layer
      client._innerApiCalls.createSnapshot = mockSimpleGrpcMethod(
        request,
        null,
        error
      );

      client.createSnapshot(request, (err, response) => {
        assert(err instanceof Error);
        assert.strictEqual(err.code, FAKE_STATUS_CODE);
        assert(typeof response === 'undefined');
        done();
      });
    });
  });

  describe('updateSnapshot', () => {
    it('invokes updateSnapshot without error', done => {
      const client = new pubsubModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      const seconds = 123456;
      const expireTime = {
        seconds: seconds,
      };
      const snapshot = {
        expireTime: expireTime,
      };
      const pathsElement = 'expire_time';
      const paths = [pathsElement];
      const updateMask = {
        paths: paths,
      };
      const request = {
        snapshot: snapshot,
        updateMask: updateMask,
      };

      // Mock response
      const name = 'name3373707';
      const topic = 'topic110546223';
      const expectedResponse = {
        name: name,
        topic: topic,
      };

      // Mock Grpc layer
      client._innerApiCalls.updateSnapshot = mockSimpleGrpcMethod(
        request,
        expectedResponse
      );

      client.updateSnapshot(request, (err, response) => {
        assert.ifError(err);
        assert.deepStrictEqual(response, expectedResponse);
        done();
      });
    });

    it('invokes updateSnapshot with error', done => {
      const client = new pubsubModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      const seconds = 123456;
      const expireTime = {
        seconds: seconds,
      };
      const snapshot = {
        expireTime: expireTime,
      };
      const pathsElement = 'expire_time';
      const paths = [pathsElement];
      const updateMask = {
        paths: paths,
      };
      const request = {
        snapshot: snapshot,
        updateMask: updateMask,
      };

      // Mock Grpc layer
      client._innerApiCalls.updateSnapshot = mockSimpleGrpcMethod(
        request,
        null,
        error
      );

      client.updateSnapshot(request, (err, response) => {
        assert(err instanceof Error);
        assert.strictEqual(err.code, FAKE_STATUS_CODE);
        assert(typeof response === 'undefined');
        done();
      });
    });
  });

  describe('deleteSnapshot', () => {
    it('invokes deleteSnapshot without error', done => {
      const client = new pubsubModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      const formattedSnapshot = client.snapshotPath('[PROJECT]', '[SNAPSHOT]');
      const request = {
        snapshot: formattedSnapshot,
      };

      // Mock Grpc layer
      client._innerApiCalls.deleteSnapshot = mockSimpleGrpcMethod(request);

      client.deleteSnapshot(request, err => {
        assert.ifError(err);
        done();
      });
    });

    it('invokes deleteSnapshot with error', done => {
      const client = new pubsubModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      const formattedSnapshot = client.snapshotPath('[PROJECT]', '[SNAPSHOT]');
      const request = {
        snapshot: formattedSnapshot,
      };

      // Mock Grpc layer
      client._innerApiCalls.deleteSnapshot = mockSimpleGrpcMethod(
        request,
        null,
        error
      );

      client.deleteSnapshot(request, err => {
        assert(err instanceof Error);
        assert.strictEqual(err.code, FAKE_STATUS_CODE);
        done();
      });
    });
  });

  describe('seek', () => {
    it('invokes seek without error', done => {
      const client = new pubsubModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      const formattedSubscription = client.subscriptionPath(
        '[PROJECT]',
        '[SUBSCRIPTION]'
      );
      const request = {
        subscription: formattedSubscription,
      };

      // Mock response
      const expectedResponse = {};

      // Mock Grpc layer
      client._innerApiCalls.seek = mockSimpleGrpcMethod(
        request,
        expectedResponse
      );

      client.seek(request, (err, response) => {
        assert.ifError(err);
        assert.deepStrictEqual(response, expectedResponse);
        done();
      });
    });

    it('invokes seek with error', done => {
      const client = new pubsubModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      const formattedSubscription = client.subscriptionPath(
        '[PROJECT]',
        '[SUBSCRIPTION]'
      );
      const request = {
        subscription: formattedSubscription,
      };

      // Mock Grpc layer
      client._innerApiCalls.seek = mockSimpleGrpcMethod(request, null, error);

      client.seek(request, (err, response) => {
        assert(err instanceof Error);
        assert.strictEqual(err.code, FAKE_STATUS_CODE);
        assert(typeof response === 'undefined');
        done();
      });
    });
  });

  describe('setIamPolicy', () => {
    it('invokes setIamPolicy without error', done => {
      const client = new pubsubModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      const formattedResource = client.subscriptionPath(
        '[PROJECT]',
        '[SUBSCRIPTION]'
      );
      const policy = {};
      const request = {
        resource: formattedResource,
        policy: policy,
      };

      // Mock response
      const version = 351608024;
      const etag = '21';
      const expectedResponse = {
        version: version,
        etag: etag,
      };

      // Mock Grpc layer
      client._innerApiCalls.setIamPolicy = mockSimpleGrpcMethod(
        request,
        expectedResponse
      );

      client.setIamPolicy(request, (err, response) => {
        assert.ifError(err);
        assert.deepStrictEqual(response, expectedResponse);
        done();
      });
    });

    it('invokes setIamPolicy with error', done => {
      const client = new pubsubModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      const formattedResource = client.subscriptionPath(
        '[PROJECT]',
        '[SUBSCRIPTION]'
      );
      const policy = {};
      const request = {
        resource: formattedResource,
        policy: policy,
      };

      // Mock Grpc layer
      client._innerApiCalls.setIamPolicy = mockSimpleGrpcMethod(
        request,
        null,
        error
      );

      client.setIamPolicy(request, (err, response) => {
        assert(err instanceof Error);
        assert.strictEqual(err.code, FAKE_STATUS_CODE);
        assert(typeof response === 'undefined');
        done();
      });
    });
  });

  describe('getIamPolicy', () => {
    it('invokes getIamPolicy without error', done => {
      const client = new pubsubModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      const formattedResource = client.subscriptionPath(
        '[PROJECT]',
        '[SUBSCRIPTION]'
      );
      const request = {
        resource: formattedResource,
      };

      // Mock response
      const version = 351608024;
      const etag = '21';
      const expectedResponse = {
        version: version,
        etag: etag,
      };

      // Mock Grpc layer
      client._innerApiCalls.getIamPolicy = mockSimpleGrpcMethod(
        request,
        expectedResponse
      );

      client.getIamPolicy(request, (err, response) => {
        assert.ifError(err);
        assert.deepStrictEqual(response, expectedResponse);
        done();
      });
    });

    it('invokes getIamPolicy with error', done => {
      const client = new pubsubModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      const formattedResource = client.subscriptionPath(
        '[PROJECT]',
        '[SUBSCRIPTION]'
      );
      const request = {
        resource: formattedResource,
      };

      // Mock Grpc layer
      client._innerApiCalls.getIamPolicy = mockSimpleGrpcMethod(
        request,
        null,
        error
      );

      client.getIamPolicy(request, (err, response) => {
        assert(err instanceof Error);
        assert.strictEqual(err.code, FAKE_STATUS_CODE);
        assert(typeof response === 'undefined');
        done();
      });
    });
  });

  describe('testIamPermissions', () => {
    it('invokes testIamPermissions without error', done => {
      const client = new pubsubModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      const formattedResource = client.subscriptionPath(
        '[PROJECT]',
        '[SUBSCRIPTION]'
      );
      const permissions = [];
      const request = {
        resource: formattedResource,
        permissions: permissions,
      };

      // Mock response
      const expectedResponse = {};

      // Mock Grpc layer
      client._innerApiCalls.testIamPermissions = mockSimpleGrpcMethod(
        request,
        expectedResponse
      );

      client.testIamPermissions(request, (err, response) => {
        assert.ifError(err);
        assert.deepStrictEqual(response, expectedResponse);
        done();
      });
    });

    it('invokes testIamPermissions with error', done => {
      const client = new pubsubModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      const formattedResource = client.subscriptionPath(
        '[PROJECT]',
        '[SUBSCRIPTION]'
      );
      const permissions = [];
      const request = {
        resource: formattedResource,
        permissions: permissions,
      };

      // Mock Grpc layer
      client._innerApiCalls.testIamPermissions = mockSimpleGrpcMethod(
        request,
        null,
        error
      );

      client.testIamPermissions(request, (err, response) => {
        assert(err instanceof Error);
        assert.strictEqual(err.code, FAKE_STATUS_CODE);
        assert(typeof response === 'undefined');
        done();
      });
    });
  });
});

function mockSimpleGrpcMethod(expectedRequest, response, error) {
  return function(actualRequest, options, callback) {
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

function mockBidiStreamingGrpcMethod(expectedRequest, response, error) {
  return () => {
    const mockStream = through2.obj((chunk, enc, callback) => {
      assert.deepStrictEqual(chunk, expectedRequest);
      if (error) {
        callback(error);
      } else {
        callback(null, response);
      }
    });
    return mockStream;
  };
}
