// Copyright 2019-2021 Google LLC
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

import {Message, PubSub, Subscription} from '@google-cloud/pubsub';
import {assert} from 'chai';
import {describe, it, before, after} from 'mocha';
import {execSync, commandFor} from './common';
import * as uuid from 'uuid';

describe('topics', () => {
  const projectId = process.env.GCLOUD_PROJECT;
  const pubsub = new PubSub({projectId});
  const runId = uuid.v4();
  console.log(`Topics runId: ${runId}`);
  const topicNameOne = `top1-${runId}`;
  const topicNameTwo = `top2-${runId}`;
  const topicNameThree = `top3-${runId}`;
  const subscriptionNameOne = `sub1-${runId}`;
  const subscriptionNameTwo = `sub2-${runId}`;
  const subscriptionNameThree = `sub3-${runId}`;
  const subscriptionNameFour = `sub4-${runId}`;
  const subscriptionNameFive = `sub5-${runId}`;
  const fullTopicNameOne = `projects/${projectId}/topics/${topicNameOne}`;
  const fullTopicNameThree = `projects/${projectId}/topics/${topicNameThree}`;
  const expectedMessage = {data: 'Hello, world!'};

  before(async () => {
    // topicNameOne is created during the createTopic test.
    await pubsub.createTopic(topicNameTwo);
    await pubsub.createTopic(topicNameThree);
  });

  async function cleanSubs() {
    const [subscriptions] = await pubsub.getSubscriptions();
    await Promise.all(
      subscriptions.filter(x => x.name.endsWith(runId)).map(x => x.delete())
    );
  }

  after(async () => {
    await cleanSubs();
    const [topics] = await pubsub.getTopics();
    await Promise.all(
      topics.filter(x => x.name.endsWith(runId)).map(x => x.delete())
    );
  });

  // Helper function to pull one message.
  // Times out after 55 seconds.
  const _pullOneMessage = (subscriptionObj: Subscription): Promise<Message> => {
    return new Promise((resolve, reject) => {
      const timeoutHandler = setTimeout(() => {
        reject(new Error('_pullOneMessage timed out'));
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
    assert.include(output, 'Topics:');
    assert.include(output, fullTopicNameThree);
  });

  it('should publish a simple message', async () => {
    const [subscription] = await pubsub
      .topic(topicNameThree)
      .subscription(subscriptionNameOne)
      .get({autoCreate: true});
    execSync(
      `${commandFor('publishMessage')} ${topicNameThree} "${
        expectedMessage.data
      }"`
    );
    const receivedMessage = await _pullOneMessage(subscription);
    assert.strictEqual(receivedMessage.data.toString(), expectedMessage.data);
  });

  it('should publish with flow control', async () => {
    const [subscription] = await pubsub
      .topic(topicNameThree)
      .subscription(subscriptionNameOne)
      .get({autoCreate: true});
    const output = execSync(
      `${commandFor('publishWithFlowControl')} ${topicNameThree}`
    );
    const receivedMessage = await _pullOneMessage(subscription);
    assert.strictEqual(receivedMessage.data.toString(), 'test!');
    assert.ok(output.indexOf('Published 1000 with flow control settings') >= 0);
  });

  it('should publish a JSON message', async () => {
    const [subscription] = await pubsub
      .topic(topicNameThree)
      .subscription(subscriptionNameOne)
      .get({autoCreate: true});
    execSync(
      `${commandFor('publishMessage')} ${topicNameThree} "${
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
      .topic(topicNameThree)
      .subscription(subscriptionNameOne)
      .get({autoCreate: true});
    execSync(
      `${commandFor('publishMessageWithCustomAttributes')} ${topicNameThree} "${
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
    const [subscription] = await pubsub
      .topic(topicNameTwo)
      .subscription(subscriptionNameTwo)
      .get({autoCreate: true});

    execSync(
      `${commandFor('publishOrderedMessage')} ${topicNameTwo} "${
        expectedMessage.data
      }" my-key`
    );
    const message = await _pullOneMessage(subscription);
    assert.strictEqual(message.orderingKey, 'my-key');
    assert.strictEqual(message.data.toString(), expectedMessage.data);
  });

  it('should publish with specific batch settings', async () => {
    const maxMessages = 10;
    const waitTime = 1000;
    const [subscription] = await pubsub
      .topic(topicNameThree)
      .subscription(subscriptionNameThree)
      .get({autoCreate: true});
    const startTime = Date.now();
    execSync(
      `${commandFor('publishBatchedMessages')} ${topicNameThree} "${
        expectedMessage.data
      }" ${maxMessages} ${waitTime}`
    );

    const {data, publishTime} = await _pullOneMessage(subscription);
    const actualWait = publishTime.getTime() - startTime;
    const acceptableLatency = 300;

    assert.strictEqual(data.toString(), expectedMessage.data);
    assert.isAtMost(
      actualWait,
      waitTime + acceptableLatency,
      'read is within acceptable latency'
    );
  });

  it('should resume publish', async () => {
    const [subscription] = await pubsub
      .topic(topicNameTwo)
      .subscription(subscriptionNameFive)
      .get({autoCreate: true});

    execSync(
      `${commandFor('resumePublish')} ${topicNameTwo} "${
        expectedMessage.data
      }" my-key`
    );
    const message = await _pullOneMessage(subscription);
    assert.strictEqual(message.orderingKey, 'my-key');
    assert.strictEqual(message.data.toString(), expectedMessage.data);
  });

  it('should publish with retry settings', async () => {
    const [subscription] = await pubsub
      .topic(topicNameThree)
      .subscription(subscriptionNameFour)
      .get({autoCreate: true});
    execSync(
      `${commandFor(
        'publishWithRetrySettings'
      )} ${projectId} ${topicNameThree} "${expectedMessage.data}"`
    );
    const receivedMessage = await _pullOneMessage(subscription);
    assert.strictEqual(receivedMessage.data.toString(), expectedMessage.data);
  });

  it('should set the IAM policy for a topic', async () => {
    execSync(`${commandFor('setTopicPolicy')} ${topicNameThree}`);
    const results = await pubsub.topic(topicNameThree).iam.getPolicy();
    const [policy] = results;
    assert.deepStrictEqual(policy.bindings, [
      {
        role: 'roles/pubsub.editor',
        members: ['group:cloud-logs@google.com'],
        condition: null,
      },
      {
        role: 'roles/pubsub.viewer',
        members: ['allUsers'],
        condition: null,
      },
    ]);
  });

  it('should get the IAM policy for a topic', async () => {
    const [policy] = await pubsub.topic(topicNameThree).iam.getPolicy();
    const output = execSync(
      `${commandFor('getTopicPolicy')} ${topicNameThree}`
    );
    assert.include(
      output,
      `Policy for topic: ${JSON.stringify(policy.bindings)}.`
    );
  });

  it('should test permissions for a topic', async () => {
    const output = execSync(
      `${commandFor('testTopicPermissions')} ${topicNameThree}`
    );
    assert.match(output, /Tested permissions for topic/);
  });

  it('should delete a topic', async () => {
    const output = execSync(`${commandFor('deleteTopic')} ${topicNameThree}`);
    assert.include(output, `Topic ${topicNameThree} deleted.`);
    const [topics] = await pubsub.getTopics();
    assert(topics.every(s => s.name !== fullTopicNameThree));
  });
});
