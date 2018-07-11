// Copyright 2018 Google LLC
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

var FAKE_STATUS_CODE = 1;
var error = new Error();
error.code = FAKE_STATUS_CODE;

describe('PublisherClient', () => {
  describe('createTopic', () => {
    it('invokes createTopic without error', done => {
      var client = new pubsubModule.v1.PublisherClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      var formattedName = client.topicPath('[PROJECT]', '[TOPIC]');
      var request = {
        name: formattedName,
      };

      // Mock response
      var name2 = 'name2-1052831874';
      var expectedResponse = {
        name: name2,
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
      var client = new pubsubModule.v1.PublisherClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      var formattedName = client.topicPath('[PROJECT]', '[TOPIC]');
      var request = {
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
        assert.equal(err.code, FAKE_STATUS_CODE);
        assert(typeof response === 'undefined');
        done();
      });
    });
  });

  describe('updateTopic', () => {
    it('invokes updateTopic without error', done => {
      var client = new pubsubModule.v1.PublisherClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      var topic = {};
      var updateMask = {};
      var request = {
        topic: topic,
        updateMask: updateMask,
      };

      // Mock response
      var name = 'name3373707';
      var expectedResponse = {
        name: name,
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
      var client = new pubsubModule.v1.PublisherClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      var topic = {};
      var updateMask = {};
      var request = {
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
        assert.equal(err.code, FAKE_STATUS_CODE);
        assert(typeof response === 'undefined');
        done();
      });
    });
  });

  describe('publish', () => {
    it('invokes publish without error', done => {
      var client = new pubsubModule.v1.PublisherClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      var formattedTopic = client.topicPath('[PROJECT]', '[TOPIC]');
      var data = '-86';
      var messagesElement = {
        data: data,
      };
      var messages = [messagesElement];
      var request = {
        topic: formattedTopic,
        messages: messages,
      };

      // Mock response
      var messageIdsElement = 'messageIdsElement-744837059';
      var messageIds = [messageIdsElement];
      var expectedResponse = {
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
      var client = new pubsubModule.v1.PublisherClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      var formattedTopic = client.topicPath('[PROJECT]', '[TOPIC]');
      var data = '-86';
      var messagesElement = {
        data: data,
      };
      var messages = [messagesElement];
      var request = {
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
        assert.equal(err.code, FAKE_STATUS_CODE);
        assert(typeof response === 'undefined');
        done();
      });
    });
  });

  describe('getTopic', () => {
    it('invokes getTopic without error', done => {
      var client = new pubsubModule.v1.PublisherClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      var formattedTopic = client.topicPath('[PROJECT]', '[TOPIC]');
      var request = {
        topic: formattedTopic,
      };

      // Mock response
      var name = 'name3373707';
      var expectedResponse = {
        name: name,
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
      var client = new pubsubModule.v1.PublisherClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      var formattedTopic = client.topicPath('[PROJECT]', '[TOPIC]');
      var request = {
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
        assert.equal(err.code, FAKE_STATUS_CODE);
        assert(typeof response === 'undefined');
        done();
      });
    });
  });

  describe('listTopics', () => {
    it('invokes listTopics without error', done => {
      var client = new pubsubModule.v1.PublisherClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      var formattedProject = client.projectPath('[PROJECT]');
      var request = {
        project: formattedProject,
      };

      // Mock response
      var nextPageToken = '';
      var topicsElement = {};
      var topics = [topicsElement];
      var expectedResponse = {
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
      var client = new pubsubModule.v1.PublisherClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      var formattedProject = client.projectPath('[PROJECT]');
      var request = {
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
        assert.equal(err.code, FAKE_STATUS_CODE);
        assert(typeof response === 'undefined');
        done();
      });
    });
  });

  describe('listTopicSubscriptions', () => {
    it('invokes listTopicSubscriptions without error', done => {
      var client = new pubsubModule.v1.PublisherClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      var formattedTopic = client.topicPath('[PROJECT]', '[TOPIC]');
      var request = {
        topic: formattedTopic,
      };

      // Mock response
      var nextPageToken = '';
      var subscriptionsElement = 'subscriptionsElement1698708147';
      var subscriptions = [subscriptionsElement];
      var expectedResponse = {
        nextPageToken: nextPageToken,
        subscriptions: subscriptions,
      };

      // Mock Grpc layer
      client._innerApiCalls.listTopicSubscriptions = (actualRequest, options, callback) => {
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
      var client = new pubsubModule.v1.PublisherClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      var formattedTopic = client.topicPath('[PROJECT]', '[TOPIC]');
      var request = {
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
        assert.equal(err.code, FAKE_STATUS_CODE);
        assert(typeof response === 'undefined');
        done();
      });
    });
  });

  describe('deleteTopic', () => {
    it('invokes deleteTopic without error', done => {
      var client = new pubsubModule.v1.PublisherClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      var formattedTopic = client.topicPath('[PROJECT]', '[TOPIC]');
      var request = {
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
      var client = new pubsubModule.v1.PublisherClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      var formattedTopic = client.topicPath('[PROJECT]', '[TOPIC]');
      var request = {
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
        assert.equal(err.code, FAKE_STATUS_CODE);
        done();
      });
    });
  });

  describe('setIamPolicy', () => {
    it('invokes setIamPolicy without error', done => {
      var client = new pubsubModule.v1.PublisherClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      var formattedResource = client.topicPath('[PROJECT]', '[TOPIC]');
      var policy = {};
      var request = {
        resource: formattedResource,
        policy: policy,
      };

      // Mock response
      var version = 351608024;
      var etag = '21';
      var expectedResponse = {
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
      var client = new pubsubModule.v1.PublisherClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      var formattedResource = client.topicPath('[PROJECT]', '[TOPIC]');
      var policy = {};
      var request = {
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
        assert.equal(err.code, FAKE_STATUS_CODE);
        assert(typeof response === 'undefined');
        done();
      });
    });
  });

  describe('getIamPolicy', () => {
    it('invokes getIamPolicy without error', done => {
      var client = new pubsubModule.v1.PublisherClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      var formattedResource = client.topicPath('[PROJECT]', '[TOPIC]');
      var request = {
        resource: formattedResource,
      };

      // Mock response
      var version = 351608024;
      var etag = '21';
      var expectedResponse = {
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
      var client = new pubsubModule.v1.PublisherClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      var formattedResource = client.topicPath('[PROJECT]', '[TOPIC]');
      var request = {
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
        assert.equal(err.code, FAKE_STATUS_CODE);
        assert(typeof response === 'undefined');
        done();
      });
    });
  });

  describe('testIamPermissions', () => {
    it('invokes testIamPermissions without error', done => {
      var client = new pubsubModule.v1.PublisherClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      var formattedResource = client.topicPath('[PROJECT]', '[TOPIC]');
      var permissions = [];
      var request = {
        resource: formattedResource,
        permissions: permissions,
      };

      // Mock response
      var expectedResponse = {};

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
      var client = new pubsubModule.v1.PublisherClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      var formattedResource = client.topicPath('[PROJECT]', '[TOPIC]');
      var permissions = [];
      var request = {
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
        assert.equal(err.code, FAKE_STATUS_CODE);
        assert(typeof response === 'undefined');
        done();
      });
    });
  });

});
describe('SubscriberClient', () => {
  describe('createSubscription', () => {
    it('invokes createSubscription without error', done => {
      var client = new pubsubModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      var formattedName = client.subscriptionPath('[PROJECT]', '[SUBSCRIPTION]');
      var formattedTopic = client.topicPath('[PROJECT]', '[TOPIC]');
      var request = {
        name: formattedName,
        topic: formattedTopic,
      };

      // Mock response
      var name2 = 'name2-1052831874';
      var topic2 = 'topic2-1139259102';
      var ackDeadlineSeconds = 2135351438;
      var retainAckedMessages = false;
      var expectedResponse = {
        name: name2,
        topic: topic2,
        ackDeadlineSeconds: ackDeadlineSeconds,
        retainAckedMessages: retainAckedMessages,
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
      var client = new pubsubModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      var formattedName = client.subscriptionPath('[PROJECT]', '[SUBSCRIPTION]');
      var formattedTopic = client.topicPath('[PROJECT]', '[TOPIC]');
      var request = {
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
        assert.equal(err.code, FAKE_STATUS_CODE);
        assert(typeof response === 'undefined');
        done();
      });
    });
  });

  describe('getSubscription', () => {
    it('invokes getSubscription without error', done => {
      var client = new pubsubModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      var formattedSubscription = client.subscriptionPath('[PROJECT]', '[SUBSCRIPTION]');
      var request = {
        subscription: formattedSubscription,
      };

      // Mock response
      var name = 'name3373707';
      var topic = 'topic110546223';
      var ackDeadlineSeconds = 2135351438;
      var retainAckedMessages = false;
      var expectedResponse = {
        name: name,
        topic: topic,
        ackDeadlineSeconds: ackDeadlineSeconds,
        retainAckedMessages: retainAckedMessages,
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
      var client = new pubsubModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      var formattedSubscription = client.subscriptionPath('[PROJECT]', '[SUBSCRIPTION]');
      var request = {
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
        assert.equal(err.code, FAKE_STATUS_CODE);
        assert(typeof response === 'undefined');
        done();
      });
    });
  });

  describe('updateSubscription', () => {
    it('invokes updateSubscription without error', done => {
      var client = new pubsubModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      var ackDeadlineSeconds = 42;
      var subscription = {
        ackDeadlineSeconds: ackDeadlineSeconds,
      };
      var pathsElement = 'ack_deadline_seconds';
      var paths = [pathsElement];
      var updateMask = {
        paths: paths,
      };
      var request = {
        subscription: subscription,
        updateMask: updateMask,
      };

      // Mock response
      var name = 'name3373707';
      var topic = 'topic110546223';
      var ackDeadlineSeconds2 = 921632575;
      var retainAckedMessages = false;
      var expectedResponse = {
        name: name,
        topic: topic,
        ackDeadlineSeconds: ackDeadlineSeconds2,
        retainAckedMessages: retainAckedMessages,
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
      var client = new pubsubModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      var ackDeadlineSeconds = 42;
      var subscription = {
        ackDeadlineSeconds: ackDeadlineSeconds,
      };
      var pathsElement = 'ack_deadline_seconds';
      var paths = [pathsElement];
      var updateMask = {
        paths: paths,
      };
      var request = {
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
        assert.equal(err.code, FAKE_STATUS_CODE);
        assert(typeof response === 'undefined');
        done();
      });
    });
  });

  describe('listSubscriptions', () => {
    it('invokes listSubscriptions without error', done => {
      var client = new pubsubModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      var formattedProject = client.projectPath('[PROJECT]');
      var request = {
        project: formattedProject,
      };

      // Mock response
      var nextPageToken = '';
      var subscriptionsElement = {};
      var subscriptions = [subscriptionsElement];
      var expectedResponse = {
        nextPageToken: nextPageToken,
        subscriptions: subscriptions,
      };

      // Mock Grpc layer
      client._innerApiCalls.listSubscriptions = (actualRequest, options, callback) => {
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
      var client = new pubsubModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      var formattedProject = client.projectPath('[PROJECT]');
      var request = {
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
        assert.equal(err.code, FAKE_STATUS_CODE);
        assert(typeof response === 'undefined');
        done();
      });
    });
  });

  describe('deleteSubscription', () => {
    it('invokes deleteSubscription without error', done => {
      var client = new pubsubModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      var formattedSubscription = client.subscriptionPath('[PROJECT]', '[SUBSCRIPTION]');
      var request = {
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
      var client = new pubsubModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      var formattedSubscription = client.subscriptionPath('[PROJECT]', '[SUBSCRIPTION]');
      var request = {
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
        assert.equal(err.code, FAKE_STATUS_CODE);
        done();
      });
    });
  });

  describe('modifyAckDeadline', () => {
    it('invokes modifyAckDeadline without error', done => {
      var client = new pubsubModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      var formattedSubscription = client.subscriptionPath('[PROJECT]', '[SUBSCRIPTION]');
      var ackIds = [];
      var ackDeadlineSeconds = 2135351438;
      var request = {
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
      var client = new pubsubModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      var formattedSubscription = client.subscriptionPath('[PROJECT]', '[SUBSCRIPTION]');
      var ackIds = [];
      var ackDeadlineSeconds = 2135351438;
      var request = {
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
        assert.equal(err.code, FAKE_STATUS_CODE);
        done();
      });
    });
  });

  describe('acknowledge', () => {
    it('invokes acknowledge without error', done => {
      var client = new pubsubModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      var formattedSubscription = client.subscriptionPath('[PROJECT]', '[SUBSCRIPTION]');
      var ackIds = [];
      var request = {
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
      var client = new pubsubModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      var formattedSubscription = client.subscriptionPath('[PROJECT]', '[SUBSCRIPTION]');
      var ackIds = [];
      var request = {
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
        assert.equal(err.code, FAKE_STATUS_CODE);
        done();
      });
    });
  });

  describe('pull', () => {
    it('invokes pull without error', done => {
      var client = new pubsubModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      var formattedSubscription = client.subscriptionPath('[PROJECT]', '[SUBSCRIPTION]');
      var maxMessages = 496131527;
      var request = {
        subscription: formattedSubscription,
        maxMessages: maxMessages,
      };

      // Mock response
      var expectedResponse = {};

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
      var client = new pubsubModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      var formattedSubscription = client.subscriptionPath('[PROJECT]', '[SUBSCRIPTION]');
      var maxMessages = 496131527;
      var request = {
        subscription: formattedSubscription,
        maxMessages: maxMessages,
      };

      // Mock Grpc layer
      client._innerApiCalls.pull = mockSimpleGrpcMethod(
        request,
        null,
        error
      );

      client.pull(request, (err, response) => {
        assert(err instanceof Error);
        assert.equal(err.code, FAKE_STATUS_CODE);
        assert(typeof response === 'undefined');
        done();
      });
    });
  });

  describe('streamingPull', () => {
    it('invokes streamingPull without error', done => {
      var client = new pubsubModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      var formattedSubscription = client.subscriptionPath('[PROJECT]', '[SUBSCRIPTION]');
      var streamAckDeadlineSeconds = 1875467245;
      var request = {
        subscription: formattedSubscription,
        streamAckDeadlineSeconds: streamAckDeadlineSeconds,
      };

      // Mock response
      var receivedMessagesElement = {};
      var receivedMessages = [receivedMessagesElement];
      var expectedResponse = {
        receivedMessages: receivedMessages,
      };

      // Mock Grpc layer
      client._innerApiCalls.streamingPull = mockBidiStreamingGrpcMethod(request, expectedResponse);

      var stream = client.streamingPull().on('data', response => {
        assert.deepStrictEqual(response, expectedResponse);
        done();
      }).on('error', err => {
        done(err);
      });

      stream.write(request);
    });

    it('invokes streamingPull with error', done => {
      var client = new pubsubModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      var formattedSubscription = client.subscriptionPath('[PROJECT]', '[SUBSCRIPTION]');
      var streamAckDeadlineSeconds = 1875467245;
      var request = {
        subscription: formattedSubscription,
        streamAckDeadlineSeconds: streamAckDeadlineSeconds,
      };

      // Mock Grpc layer
      client._innerApiCalls.streamingPull = mockBidiStreamingGrpcMethod(request, null, error);

      var stream = client.streamingPull().on('data', () => {
        assert.fail();
      }).on('error', err => {
        assert(err instanceof Error);
        assert.equal(err.code, FAKE_STATUS_CODE);
        done();
      });

      stream.write(request);
    });
  });

  describe('modifyPushConfig', () => {
    it('invokes modifyPushConfig without error', done => {
      var client = new pubsubModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      var formattedSubscription = client.subscriptionPath('[PROJECT]', '[SUBSCRIPTION]');
      var pushConfig = {};
      var request = {
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
      var client = new pubsubModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      var formattedSubscription = client.subscriptionPath('[PROJECT]', '[SUBSCRIPTION]');
      var pushConfig = {};
      var request = {
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
        assert.equal(err.code, FAKE_STATUS_CODE);
        done();
      });
    });
  });

  describe('listSnapshots', () => {
    it('invokes listSnapshots without error', done => {
      var client = new pubsubModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      var formattedProject = client.projectPath('[PROJECT]');
      var request = {
        project: formattedProject,
      };

      // Mock response
      var nextPageToken = '';
      var snapshotsElement = {};
      var snapshots = [snapshotsElement];
      var expectedResponse = {
        nextPageToken: nextPageToken,
        snapshots: snapshots,
      };

      // Mock Grpc layer
      client._innerApiCalls.listSnapshots = (actualRequest, options, callback) => {
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
      var client = new pubsubModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      var formattedProject = client.projectPath('[PROJECT]');
      var request = {
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
        assert.equal(err.code, FAKE_STATUS_CODE);
        assert(typeof response === 'undefined');
        done();
      });
    });
  });

  describe('createSnapshot', () => {
    it('invokes createSnapshot without error', done => {
      var client = new pubsubModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      var formattedName = client.snapshotPath('[PROJECT]', '[SNAPSHOT]');
      var formattedSubscription = client.subscriptionPath('[PROJECT]', '[SUBSCRIPTION]');
      var request = {
        name: formattedName,
        subscription: formattedSubscription,
      };

      // Mock response
      var name2 = 'name2-1052831874';
      var topic = 'topic110546223';
      var expectedResponse = {
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
      var client = new pubsubModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      var formattedName = client.snapshotPath('[PROJECT]', '[SNAPSHOT]');
      var formattedSubscription = client.subscriptionPath('[PROJECT]', '[SUBSCRIPTION]');
      var request = {
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
        assert.equal(err.code, FAKE_STATUS_CODE);
        assert(typeof response === 'undefined');
        done();
      });
    });
  });

  describe('updateSnapshot', () => {
    it('invokes updateSnapshot without error', done => {
      var client = new pubsubModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      var seconds = 123456;
      var expireTime = {
        seconds: seconds,
      };
      var snapshot = {
        expireTime: expireTime,
      };
      var pathsElement = 'expire_time';
      var paths = [pathsElement];
      var updateMask = {
        paths: paths,
      };
      var request = {
        snapshot: snapshot,
        updateMask: updateMask,
      };

      // Mock response
      var name = 'name3373707';
      var topic = 'topic110546223';
      var expectedResponse = {
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
      var client = new pubsubModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      var seconds = 123456;
      var expireTime = {
        seconds: seconds,
      };
      var snapshot = {
        expireTime: expireTime,
      };
      var pathsElement = 'expire_time';
      var paths = [pathsElement];
      var updateMask = {
        paths: paths,
      };
      var request = {
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
        assert.equal(err.code, FAKE_STATUS_CODE);
        assert(typeof response === 'undefined');
        done();
      });
    });
  });

  describe('deleteSnapshot', () => {
    it('invokes deleteSnapshot without error', done => {
      var client = new pubsubModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      var formattedSnapshot = client.snapshotPath('[PROJECT]', '[SNAPSHOT]');
      var request = {
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
      var client = new pubsubModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      var formattedSnapshot = client.snapshotPath('[PROJECT]', '[SNAPSHOT]');
      var request = {
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
        assert.equal(err.code, FAKE_STATUS_CODE);
        done();
      });
    });
  });

  describe('seek', () => {
    it('invokes seek without error', done => {
      var client = new pubsubModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      var formattedSubscription = client.subscriptionPath('[PROJECT]', '[SUBSCRIPTION]');
      var request = {
        subscription: formattedSubscription,
      };

      // Mock response
      var expectedResponse = {};

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
      var client = new pubsubModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      var formattedSubscription = client.subscriptionPath('[PROJECT]', '[SUBSCRIPTION]');
      var request = {
        subscription: formattedSubscription,
      };

      // Mock Grpc layer
      client._innerApiCalls.seek = mockSimpleGrpcMethod(
        request,
        null,
        error
      );

      client.seek(request, (err, response) => {
        assert(err instanceof Error);
        assert.equal(err.code, FAKE_STATUS_CODE);
        assert(typeof response === 'undefined');
        done();
      });
    });
  });

  describe('setIamPolicy', () => {
    it('invokes setIamPolicy without error', done => {
      var client = new pubsubModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      var formattedResource = client.subscriptionPath('[PROJECT]', '[SUBSCRIPTION]');
      var policy = {};
      var request = {
        resource: formattedResource,
        policy: policy,
      };

      // Mock response
      var version = 351608024;
      var etag = '21';
      var expectedResponse = {
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
      var client = new pubsubModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      var formattedResource = client.subscriptionPath('[PROJECT]', '[SUBSCRIPTION]');
      var policy = {};
      var request = {
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
        assert.equal(err.code, FAKE_STATUS_CODE);
        assert(typeof response === 'undefined');
        done();
      });
    });
  });

  describe('getIamPolicy', () => {
    it('invokes getIamPolicy without error', done => {
      var client = new pubsubModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      var formattedResource = client.subscriptionPath('[PROJECT]', '[SUBSCRIPTION]');
      var request = {
        resource: formattedResource,
      };

      // Mock response
      var version = 351608024;
      var etag = '21';
      var expectedResponse = {
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
      var client = new pubsubModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      var formattedResource = client.subscriptionPath('[PROJECT]', '[SUBSCRIPTION]');
      var request = {
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
        assert.equal(err.code, FAKE_STATUS_CODE);
        assert(typeof response === 'undefined');
        done();
      });
    });
  });

  describe('testIamPermissions', () => {
    it('invokes testIamPermissions without error', done => {
      var client = new pubsubModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      var formattedResource = client.subscriptionPath('[PROJECT]', '[SUBSCRIPTION]');
      var permissions = [];
      var request = {
        resource: formattedResource,
        permissions: permissions,
      };

      // Mock response
      var expectedResponse = {};

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
      var client = new pubsubModule.v1.SubscriberClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      var formattedResource = client.subscriptionPath('[PROJECT]', '[SUBSCRIPTION]');
      var permissions = [];
      var request = {
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
        assert.equal(err.code, FAKE_STATUS_CODE);
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
    var mockStream = through2.obj((chunk, enc, callback) => {
      assert.deepStrictEqual(chunk, expectedRequest);
      if (error) {
        callback(error);
      }
      else {
        callback(null, response);
      }
    });
    return mockStream;
  }
}
