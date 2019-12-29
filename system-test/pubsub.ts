// Copyright 2014 Google LLC
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
import {describe, it} from 'mocha';
import * as crypto from 'crypto';
import defer = require('p-defer');
import * as uuid from 'uuid';

import {
  Message,
  PubSub,
  ServiceError,
  Snapshot,
  Subscription,
  Topic,
} from '../src';
import {Policy} from '../src/iam';
import {MessageOptions} from '../src/topic';

type Resource = Topic | Subscription | Snapshot;

const PREFIX = 'gcloud-tests';
const CURRENT_TIME = Date.now();

const pubsub = new PubSub();

function shortUUID() {
  return uuid
    .v1()
    .split('-')
    .shift();
}

describe('pubsub', () => {
  const TOPIC_NAMES = [
    generateTopicName(),
    generateTopicName(),
    generateTopicName(),
  ];

  const TOPICS = [
    pubsub.topic(TOPIC_NAMES[0]),
    pubsub.topic(TOPIC_NAMES[1]),
    pubsub.topic(TOPIC_NAMES[2]),
  ];

  const TOPIC_FULL_NAMES = TOPICS.map(getTopicName);

  function generateName(name: string) {
    return [PREFIX, name, shortUUID(), CURRENT_TIME].join('-');
  }

  function generateSnapshotName() {
    return generateName('snapshot');
  }

  function generateSubName() {
    return generateName('subscription');
  }

  function generateTopicName() {
    return generateName('topic');
  }

  function getTopicName(topic: Topic) {
    return topic.name.split('/').pop();
  }

  function deleteTestResource(resource: Resource) {
    // Delete resource from current test run.
    if (resource.name.includes(CURRENT_TIME.toString())) {
      resource.delete();
      return;
    }

    // Delete left over resources which is older then 1 hour.
    if (!resource.name.includes(PREFIX)) {
      return;
    }

    const createdAt = Number(resource.name.split('-').pop());
    const timeDiff = (Date.now() - createdAt) / (1000 * 60 * 60);

    if (timeDiff > 1) {
      resource.delete();
    }
  }

  async function deleteTestResources(): Promise<Resource[]> {
    const topicStream = pubsub.getTopicsStream().on('data', deleteTestResource);
    const subscriptionStream = pubsub
      .getSubscriptionsStream()
      .on('data', deleteTestResource);
    const snapshotStream = pubsub
      .getSnapshotsStream()
      .on('data', deleteTestResource);

    const streams = [topicStream, subscriptionStream, snapshotStream].map(
      stream => {
        return new Promise<Resource>((resolve, reject) => {
          stream.on('error', reject);
          stream.on('end', resolve);
        });
      }
    );

    return Promise.all(streams);
  }

  async function publishPop(message: MessageOptions) {
    const topic = pubsub.topic(generateTopicName());
    const subscription = topic.subscription(generateSubName());
    await topic.create();
    await subscription.create();
    for (let i = 0; i < 6; i++) {
      await topic.publishMessage(message);
    }
    return new Promise<Message>((resolve, reject) => {
      subscription.on('error', reject);
      subscription.once('message', resolve);
    });
  }

  before(async () => {
    await deleteTestResources();

    // create all needed topics with metadata
    await Promise.all(TOPICS.map(t => t.create()));
  });

  after(() => {
    // Delete all created test resources
    return deleteTestResources();
  });

  describe('Topic', () => {
    it('should be listed', async () => {
      const [topics] = await pubsub.getTopics();
      const results = topics.filter(topic => {
        const name = getTopicName(topic);
        return TOPIC_FULL_NAMES.indexOf(name) !== -1;
      });
      // get all topics in list of known names
      assert.strictEqual(results.length, TOPIC_NAMES.length);
    });

    it('should list topics in a stream', done => {
      const topicsEmitted = new Array<Topic>();
      pubsub
        .getTopicsStream()
        .on('error', done)
        .on('data', topic => {
          topicsEmitted.push(topic);
        })
        .on('end', () => {
          const results = topicsEmitted.filter(topic => {
            const name = getTopicName(topic);
            return TOPIC_FULL_NAMES.indexOf(name) !== -1;
          });

          assert.strictEqual(results.length, TOPIC_NAMES.length);
          done();
        });
    });

    it('should allow manual paging', async () => {
      const [topics] = await pubsub.getTopics({
        pageSize: TOPIC_NAMES.length - 1,
        gaxOpts: {autoPaginate: false},
      });
      assert.strictEqual(topics.length, TOPIC_NAMES.length - 1);
    });

    it('should be created and deleted', done => {
      const TOPIC_NAME = generateTopicName();
      pubsub.createTopic(TOPIC_NAME, err => {
        assert.ifError(err);
        pubsub.topic(TOPIC_NAME).delete(done);
      });
    });

    it('should honor the autoCreate option', done => {
      const topic = pubsub.topic(generateTopicName());

      topic.get({autoCreate: true}, done);
    });

    it('should confirm if a topic exists', done => {
      const topic = pubsub.topic(TOPIC_NAMES[0]);

      topic.exists((err, exists) => {
        assert.ifError(err);
        assert.strictEqual(exists, true);
        done();
      });
    });

    it('should confirm if a topic does not exist', done => {
      const topic = pubsub.topic('should-not-exist');

      topic.exists((err, exists) => {
        assert.ifError(err);
        assert.strictEqual(exists, false);
        done();
      });
    });

    it('should publish a message', done => {
      const topic = pubsub.topic(TOPIC_NAMES[0]);
      const message = {
        data: Buffer.from('message from me'),
        orderingKey: 'a',
      };

      topic.publishMessage(message, (err, messageId) => {
        assert.ifError(err);
        assert.strictEqual(typeof messageId, 'string');
        done();
      });
    });

    it('should publish a message with attributes', async () => {
      const data = Buffer.from('raw message data');
      const attributes = {
        customAttribute: 'value',
      };
      const message = await publishPop({data, attributes});
      assert.deepStrictEqual(message.data, data);
      assert.deepStrictEqual(message.attributes, attributes);
    });

    it('should get the metadata of a topic', done => {
      const topic = pubsub.topic(TOPIC_NAMES[0]);
      topic.getMetadata((err, metadata) => {
        assert.ifError(err);
        assert.strictEqual(metadata!.name, topic.name);
        done();
      });
    });

    describe('ordered messages', () => {
      interface Expected {
        key: string;
        messages: string[];
      }

      interface Input {
        key: string;
        message: string;
      }

      interface Pending {
        [key: string]: string[];
      }

      it('should pass the acceptance tests', async () => {
        const [topic] = await pubsub.createTopic(generateName('orderedtopic'));
        const [subscription] = await topic.createSubscription(
          generateName('orderedsub'),
          {
            enableMessageOrdering: true,
          }
        );
        const {
          input,
          expected,
        } = require('../../system-test/fixtures/ordered-messages.json');

        const publishes = input.map(({key, message}: Input) => {
          const options: MessageOptions = {
            data: Buffer.from(message),
          };

          if (key) {
            options.orderingKey = key;
          }

          return topic.publishMessage(options);
        });

        await Promise.all(publishes);

        const pending: Pending = {};

        expected.forEach(({key, messages}: Expected) => {
          pending[key] = messages;
        });

        const deferred = defer();

        subscription
          .on('error', deferred.reject)
          .on('message', (message: Message) => {
            const key = message.orderingKey || '';
            const data = message.data.toString();
            const messages = pending[key];
            const expected = messages[0];

            if (key && data !== expected) {
              deferred.reject(
                new Error(
                  `Expected "${expected}" but received "${data}" for key "${key}"`
                )
              );
              subscription.close();
              return;
            }

            message.ack();
            messages.splice(messages.indexOf(data), 1);

            if (!pending[key].length) delete pending[key];
            if (!Object.keys(pending).length) {
              deferred.resolve();
            }
          });

        await deferred.promise;
        await Promise.all([topic.delete(), subscription.delete()]);
      });
    });
  });

  describe('Subscription', () => {
    const TOPIC_NAME = generateTopicName();
    const topic = pubsub.topic(TOPIC_NAME);

    const SUB_NAMES = [generateSubName(), generateSubName()];

    const SUBSCRIPTIONS = [
      topic.subscription(SUB_NAMES[0], {ackDeadline: 30}),
      topic.subscription(SUB_NAMES[1], {ackDeadline: 60}),
    ];

    before(async () => {
      await topic.create();
      await Promise.all(SUBSCRIPTIONS.map(s => s.create()));
      for (let i = 0; i < 10; i++) {
        const data = Buffer.from('hello');
        await topic.publishMessage({data});
      }
      await new Promise(r => setTimeout(r, 2500));
    });

    after(() => {
      // Delete subscriptions
      return Promise.all(
        SUBSCRIPTIONS.map(async s => {
          try {
            await s.delete();
          } catch (e) {
            await topic.delete();
          }
        })
      );
    });

    it('should return error if creating an existing subscription', done => {
      // Use a new topic name...
      const topic = pubsub.topic(generateTopicName());

      // ...but with the same subscription name that we already created...
      const subscription = topic.subscription(SUB_NAMES[0]);

      subscription.create(err => {
        if (!err) {
          assert.fail('Should not have created subscription successfully.');
          return;
        }

        // ...and it should fail, because the subscription name is unique to the
        // project, and not the topic.
        assert.strictEqual(err.code, 6);
        done();
      });
    });

    it('should list all subscriptions registered to the topic', done => {
      topic.getSubscriptions((err, subs) => {
        assert.ifError(err);
        assert.strictEqual(subs!.length, SUBSCRIPTIONS.length);
        assert(subs![0] instanceof Subscription);
        done();
      });
    });

    it('should list all topic subscriptions as a stream', done => {
      const subscriptionsEmitted: Array<{}> = [];
      topic
        .getSubscriptionsStream()
        .on('error', done)
        .on('data', subscription => {
          subscriptionsEmitted.push(subscription);
        })
        .on('end', () => {
          assert.strictEqual(subscriptionsEmitted.length, SUBSCRIPTIONS.length);
          done();
        });
    });

    it('should list all subscriptions regardless of topic', done => {
      pubsub.getSubscriptions(
        (err: ServiceError | null, subscriptions?: Subscription[] | null) => {
          assert.ifError(err);
          assert(subscriptions instanceof Array);
          done();
        }
      );
    });

    it('should list all subscriptions as a stream', done => {
      let subscriptionEmitted = false;

      pubsub
        .getSubscriptionsStream()
        .on('error', done)
        .on('data', subscription => {
          subscriptionEmitted = subscription instanceof Subscription;
        })
        .on('end', () => {
          assert.strictEqual(subscriptionEmitted, true);
          done();
        });
    });

    it('should allow creation and deletion of a subscription', done => {
      const subName = generateSubName();
      topic.createSubscription(subName, (err, sub) => {
        assert.ifError(err);
        assert(sub instanceof Subscription);
        sub!.delete(done);
      });
    });

    it('should honor the autoCreate option', done => {
      const sub = topic.subscription(generateSubName());

      sub.get({autoCreate: true}, done);
    });

    it('should confirm if a sub exists', done => {
      const sub = topic.subscription(SUB_NAMES[0]);

      sub.exists((err, exists) => {
        assert.ifError(err);
        assert.strictEqual(exists, true);
        done();
      });
    });

    it('should confirm if a sub does not exist', done => {
      const sub = topic.subscription('should-not-exist');

      sub.exists((err, exists) => {
        assert.ifError(err);
        assert.strictEqual(exists, false);
        done();
      });
    });

    it('should create a subscription with message retention', done => {
      const subName = generateSubName();
      const threeDaysInSeconds = 3 * 24 * 60 * 60;
      const callOptions = {
        messageRetentionDuration: threeDaysInSeconds,
        topic: '',
        name: '',
      };

      topic.createSubscription(subName, callOptions, (err, sub) => {
        assert.ifError(err);

        sub!.getMetadata((err, metadata) => {
          assert.ifError(err);

          assert.strictEqual(
            Number(metadata!.messageRetentionDuration!.seconds),
            threeDaysInSeconds
          );
          assert.strictEqual(
            Number(metadata!.messageRetentionDuration!.nanos),
            0
          );

          sub!.delete(done);
        });
      });
    });

    it('should set metadata for a subscription', () => {
      const subscription = topic.subscription(generateSubName());
      const threeDaysInSeconds = 3 * 24 * 60 * 60;

      return subscription
        .create()
        .then(() => {
          return subscription.setMetadata({
            messageRetentionDuration: threeDaysInSeconds,
          });
        })
        .then(() => {
          return subscription.getMetadata();
        })
        .then(([metadata]) => {
          const {seconds, nanos} = metadata.messageRetentionDuration!;

          assert.strictEqual(Number(seconds), threeDaysInSeconds);
          assert.strictEqual(Number(nanos), 0);
        });
    });

    it('should error when using a non-existent subscription', done => {
      const subscription = topic.subscription(generateSubName());

      subscription.on('error', err => {
        assert.strictEqual(err.code, 5);
        subscription.close(done);
      });

      subscription.on('message', () => {
        done(new Error('Should not have been called.'));
      });
    });

    it('should receive the published messages', done => {
      let messageCount = 0;
      const subscription = topic.subscription(SUB_NAMES[1]);

      subscription.on('error', done);

      subscription.on('message', message => {
        assert.deepStrictEqual(message.data, Buffer.from('hello'));

        if (++messageCount === 10) {
          subscription.close(done);
        }
      });
    });

    it('should ack the message', done => {
      const subscription = topic.subscription(SUB_NAMES[1]);

      subscription.on('error', done);
      subscription.on('message', ack);

      function ack(message: Message) {
        message.ack();
        subscription.close(done);
      }
    });

    it('should nack the message', done => {
      const subscription = topic.subscription(SUB_NAMES[1]);

      subscription.on('error', done);
      subscription.on('message', nack);

      function nack(message: Message) {
        message.nack();
        subscription.close(done);
      }
    });

    it('should respect flow control limits', done => {
      const maxMessages = 3;
      let messageCount = 0;

      const subscription = topic.subscription(SUB_NAMES[0], {
        flowControl: {maxMessages, allowExcessMessages: false},
      });

      subscription.on('error', done);
      subscription.on('message', onMessage);

      function onMessage() {
        if (++messageCount < maxMessages) {
          return;
        }

        subscription.close(done);
      }
    });

    it('should send and receive large messages', done => {
      const subscription = topic.subscription(SUB_NAMES[0]);
      const data = crypto.randomBytes(9000000); // 9mb

      topic.publishMessage({data}, (err, messageId) => {
        assert.ifError(err);

        subscription.on('error', done).on('message', (message: Message) => {
          if (message.id !== messageId) {
            return;
          }

          assert.deepStrictEqual(data, message.data);
          subscription.close(done);
        });
      });
    });

    // can be ran manually to test options/memory usage/etc.
    // tslint:disable-next-line ban
    it.skip('should handle a large volume of messages', async function() {
      const MESSAGES = 200000;

      const deferred = defer();
      const messages = new Set();

      let duplicates = 0;

      this.timeout(0);

      const subscription = topic.subscription(SUB_NAMES[0]);

      topic.setPublishOptions({batching: {maxMessages: 999}});
      await publish(MESSAGES);

      const startTime = Date.now();
      subscription.on('error', deferred.reject).on('message', onmessage);

      return deferred.promise;

      function onmessage(message: Message) {
        // tslint:disable-next-line no-any
        const testid = (message.attributes as any).testid;

        if (!testid) {
          return;
        }

        message.ack();

        if (messages.has(testid)) {
          messages.delete(testid);
        } else {
          duplicates += 1;
        }

        if (messages.size > 0) {
          return;
        }

        const total = MESSAGES + duplicates;
        const duration = (Date.now() - startTime) / 1000 / 60;
        const acksPerMin = Math.floor(total / duration);

        console.log(`${total} messages processed.`);
        console.log(`${duplicates} messages redelivered.`);
        console.log(`${acksPerMin} acks/m on average.`);

        subscription.close(err => {
          if (err) {
            deferred.reject(err);
          } else {
            deferred.resolve();
          }
        });
      }

      function publish(messageCount: number) {
        const data = Buffer.from('Hello, world!');
        const promises: Array<Promise<[string]>> = [];

        let id = 0;

        for (let i = 0; i < messageCount; i++) {
          const testid = String(++id);
          const attributes = {testid};
          messages.add(testid);
          promises.push(topic.publishMessage({data, attributes}));
        }

        return Promise.all(promises);
      }
    });
  });

  describe('IAM', () => {
    it('should get a policy', done => {
      const topic = pubsub.topic(TOPIC_NAMES[0]);

      topic.iam.getPolicy((err, policy) => {
        assert.ifError(err);

        assert.deepStrictEqual(policy!.bindings, []);
        assert.strictEqual(policy!.version, 0);

        done();
      });
    });

    it('should set a policy', done => {
      const topic = pubsub.topic(TOPIC_NAMES[0]);
      const policy = {
        bindings: [
          {
            role: 'roles/pubsub.publisher',
            members: [
              'serviceAccount:gmail-api-push@system.gserviceaccount.com',
            ],
          },
        ],
      };

      topic.iam.setPolicy(
        policy,
        (err: ServiceError | null, newPolicy?: Policy | null) => {
          assert.ifError(err);
          const expectedBindings = policy.bindings.map(binding =>
            Object.assign({condition: null}, binding)
          );
          assert.deepStrictEqual(newPolicy!.bindings, expectedBindings);
          done();
        }
      );
    });

    it('should test the iam permissions', done => {
      const topic = pubsub.topic(TOPIC_NAMES[0]);
      const testPermissions = ['pubsub.topics.get', 'pubsub.topics.update'];

      topic.iam.testPermissions(testPermissions, (err, permissions) => {
        assert.ifError(err);
        assert.deepStrictEqual(permissions, {
          'pubsub.topics.get': true,
          'pubsub.topics.update': true,
        });
        done();
      });
    });
  });

  describe('Snapshot', () => {
    const SNAPSHOT_NAME = generateSnapshotName();

    let topic: Topic;
    let subscription: Subscription;
    let snapshot: Snapshot;

    function getSnapshotName({name}: {name: string}) {
      return name.split('/').pop();
    }

    before(async () => {
      topic = pubsub.topic(generateTopicName());
      subscription = topic.subscription(generateSubName());
      snapshot = subscription.snapshot(SNAPSHOT_NAME);

      await topic.create();
      await subscription.create();
      await snapshot.create();
    });

    after(async () => {
      await snapshot.delete();
      await subscription.delete();
      await topic.delete();
    });

    it('should get a list of snapshots', done => {
      pubsub.getSnapshots((err, snapshots) => {
        assert.ifError(err);
        assert(snapshots!.length > 0);
        const names = snapshots!.map(getSnapshotName);
        assert(names.includes(SNAPSHOT_NAME));
        done();
      });
    });

    it('should get a list of snapshots as a stream', done => {
      const snapshots = new Array<Snapshot>();
      pubsub
        .getSnapshotsStream()
        .on('error', done)
        .on('data', snapshot => snapshots.push(snapshot))
        .on('end', () => {
          assert(snapshots.length > 0);
          const names = snapshots.map(getSnapshotName);
          assert(names.includes(SNAPSHOT_NAME));
          done();
        });
    });

    describe('seeking', () => {
      let subscription: Subscription;
      let snapshot: Snapshot;
      let messageId: string;
      const snapshotName = generateSnapshotName();

      beforeEach(async () => {
        subscription = topic.subscription(generateSubName());
        snapshot = subscription.snapshot(generateSnapshotName());

        return subscription
          .create()
          .then(() => {
            return snapshot.create();
          })
          .then(() => {
            return topic.publish(Buffer.from('Hello, world!'));
          })
          .then(_messageId => {
            messageId = _messageId;
          });
      });

      it('should seek to a snapshot', done => {
        let messageCount = 0;

        subscription.on('error', done);
        subscription.on('message', message => {
          if (message.id !== messageId) {
            return;
          }
          message.ack();

          if (++messageCount === 1) {
            snapshot!.seek(assert.ifError);
            return;
          }

          assert.strictEqual(messageCount, 2);
          subscription.close(done);
        });
      });

      it('should seek to a date', done => {
        let messageCount = 0;

        subscription.on('error', done);
        subscription.on('message', message => {
          if (message.id !== messageId) {
            return;
          }

          message.ack();

          if (++messageCount === 1) {
            subscription.seek(
              message.publishTime,
              (err: ServiceError | null) => {
                assert.ifError(err);
              }
            );
            return;
          }

          assert.strictEqual(messageCount, 2);
          subscription.close(done);
        });
      });
    });
  });
});
