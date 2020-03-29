// Copyright 2019-2020 Google LLC
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

const {PubSub} = require('@google-cloud/pubsub');
const {assert} = require('chai');
const {describe, it, before, after} = require('mocha');
const cp = require('child_process');
const uuid = require('uuid');

const execSync = cmd => cp.execSync(cmd, {encoding: 'utf-8'});

describe('topics', () => {
  const projectId = process.env.GCLOUD_PROJECT;
  const pubsub = new PubSub({projectId});
  const runId = uuid.v4();
  console.log(`Topics runId: ${runId}`);
  const topicNameOne = `top1-${runId}`;
  const topicNameTwo = `top2-${runId}`;
  const subscriptionNameOne = `sub1-${runId}`;
  const subscriptionNameTwo = `sub2-${runId}`;
  const subscriptionNameThree = `sub3-${runId}`;
  const subscriptionNameFour = `sub4-${runId}`;
  const fullTopicNameOne = `projects/${projectId}/topics/${topicNameOne}`;
  const expectedMessage = {data: 'Hello, world!'};

  function commandFor(action) {
    return `node ${action}.js`;
  }

  before(async () => {
    await pubsub.createTopic(topicNameTwo);
  });

  after(async () => {
    const [subscriptions] = await pubsub.getSubscriptions();
    await Promise.all(
      subscriptions.filter(x => x.name.endsWith(runId)).map(x => x.delete())
    );
    const [topics] = await pubsub.getTopics();
    await Promise.all(
      topics.filter(x => x.name.endsWith(runId)).map(x => x.delete())
    );
  });

  // Helper function to pull one message.
  // Times out after 55 seconds.
  const _pullOneMessage = subscriptionObj => {
    return new Promise((resolve, reject) => {
      const timeoutHandler = setTimeout(() => {
        reject(new Error(`_pullOneMessage timed out`));
      }, 55000);

      subscriptionObj.once('error', reject).once('message', message => {
        message.ack();
        clearTimeout(timeoutHandler);
        resolve(message);
      });
    });
  };

  it('should create a topic', async () => {
    const output = execSync(`${commandFor('createTopic')} ${topicNameOne}`);
    assert.include(output, `Topic ${topicNameOne} created.`);
    const [topics] = await pubsub.getTopics();
    const exists = topics.some(t => t.name === fullTopicNameOne);
    assert.ok(exists, 'Topic was created');
  });

  it('should list topics', async () => {
    const output = execSync(`${commandFor('listAllTopics')}`);
    assert.match(output, /Topics:/);
    assert.match(output, new RegExp(fullTopicNameOne));
  });

  it('should publish a simple message', async () => {
    const [subscription] = await pubsub
      .topic(topicNameOne)
      .subscription(subscriptionNameOne)
      .get({autoCreate: true});
    execSync(
      `${commandFor('publishMessage')} ${topicNameOne} "${
        expectedMessage.data
      }"`
    );
    const receivedMessage = await _pullOneMessage(subscription);
    assert.strictEqual(receivedMessage.data.toString(), expectedMessage.data);
  });

  it('should publish a JSON message', async () => {
    const [subscription] = await pubsub
      .topic(topicNameOne)
      .subscription(subscriptionNameOne)
      .get({autoCreate: true});
    execSync(
      `${commandFor('publishMessage')} ${topicNameOne} "${
        expectedMessage.data
      }"`
    );
    const receivedMessage = await _pullOneMessage(subscription);
    assert.deepStrictEqual(
      receivedMessage.data.toString(),
      expectedMessage.data
    );
  });

  it('should publish a message with custom attributes', async () => {
    const [subscription] = await pubsub
      .topic(topicNameOne)
      .subscription(subscriptionNameOne)
      .get({autoCreate: true});
    execSync(
      `${commandFor('publishMessageWithCustomAttributes')} ${topicNameOne} "${
        expectedMessage.data
      }"`
    );
    const receivedMessage = await _pullOneMessage(subscription);
    assert.strictEqual(receivedMessage.data.toString(), expectedMessage.data);
    assert.deepStrictEqual(receivedMessage.attributes, {
      origin: 'nodejs-sample',
      username: 'gcp',
    });
  });

  it('should publish ordered messages', async () => {
    const topics = require('../publishOrderedMessage');

    const [subscription] = await pubsub
      .topic(topicNameTwo)
      .subscription(subscriptionNameTwo)
      .get({autoCreate: true});

    let messageId = await topics.publishOrderedMessage(
      topicNameTwo,
      expectedMessage.data
    );
    let message = await _pullOneMessage(subscription);
    assert.strictEqual(message.id, messageId);
    assert.strictEqual(message.data.toString(), expectedMessage.data);
    assert.strictEqual(message.attributes.counterId, '1');

    messageId = await topics.publishOrderedMessage(
      topicNameTwo,
      expectedMessage.data
    );
    message = await _pullOneMessage(subscription);
    assert.strictEqual(message.id, messageId);
    assert.strictEqual(message.data.toString(), expectedMessage.data);
    assert.strictEqual(message.attributes.counterId, '2');
    await topics.publishOrderedMessage(topicNameTwo, expectedMessage.data);
  });

  it('should publish with specific batch settings', async () => {
    const maxMessages = 10;
    const waitTime = 1000;
    const [subscription] = await pubsub
      .topic(topicNameOne)
      .subscription(subscriptionNameThree)
      .get({autoCreate: true});
    const startTime = Date.now();
    execSync(
      `${commandFor('publishBatchedMessages')} ${topicNameOne} "${
        expectedMessage.data
      }" ${maxMessages} ${waitTime}`
    );

    const {data, publishTime} = await _pullOneMessage(subscription);
    const actualWait = publishTime.getTime() - startTime;
    const acceptableLatency = 150;

    assert.strictEqual(data.toString(), expectedMessage.data);
    assert.isAtMost(
      actualWait,
      waitTime + acceptableLatency,
      'read is within acceptable latency'
    );
  });

  it('should publish with retry settings', async () => {
    const [subscription] = await pubsub
      .topic(topicNameOne)
      .subscription(subscriptionNameFour)
      .get({autoCreate: true});
    execSync(
      `${commandFor(
        'publishWithRetrySettings'
      )} ${projectId} ${topicNameOne} "${expectedMessage.data}"`
    );
    const receivedMessage = await _pullOneMessage(subscription);
    assert.strictEqual(receivedMessage.data.toString(), expectedMessage.data);
  });

  it('should set the IAM policy for a topic', async () => {
    execSync(`${commandFor('setTopicPolicy')} ${topicNameOne}`);
    const results = await pubsub.topic(topicNameOne).iam.getPolicy();
    const [policy] = results;
    assert.deepStrictEqual(policy.bindings, [
      {
        role: `roles/pubsub.editor`,
        members: [`group:cloud-logs@google.com`],
        condition: null,
      },
      {
        role: `roles/pubsub.viewer`,
        members: [`allUsers`],
        condition: null,
      },
    ]);
  });

  it('should get the IAM policy for a topic', async () => {
    const [policy] = await pubsub.topic(topicNameOne).iam.getPolicy();
    const output = execSync(`${commandFor('getTopicPolicy')} ${topicNameOne}`);
    assert.include(
      output,
      `Policy for topic: ${JSON.stringify(policy.bindings)}.`
    );
  });

  it('should test permissions for a topic', async () => {
    const output = execSync(
      `${commandFor('testTopicPermissions')} ${topicNameOne}`
    );
    assert.match(output, /Tested permissions for topic/);
  });

  it('should delete a topic', async () => {
    const output = execSync(`${commandFor('deleteTopic')} ${topicNameOne}`);
    assert.include(output, `Topic ${topicNameOne} deleted.`);
    const [topics] = await pubsub.getTopics();
    assert(topics.every(s => s.name !== fullTopicNameOne));
  });
});
