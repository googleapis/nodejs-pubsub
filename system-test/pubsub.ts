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
import * as uuid from 'uuid';
import {PubSub, Subscription, Topic} from '../src';

const pubsub = new PubSub();

describe('pubsub', function() {
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

  function generateSnapshotName() {
    return 'test-snapshot-' + uuid.v4();
  }

  function generateSubName() {
    return 'test-subscription-' + uuid.v4();
  }

  function generateTopicName() {
    return 'test-topic-' + uuid.v4();
  }

  function getTopicName(topic: Topic) {
    return topic.name.split('/').pop();
  }

  async function publishPop(message, options = {}) {
    const topic = pubsub.topic(generateTopicName());
    const publisher = topic.publisher();
    const subscription = topic.subscription(generateSubName());
    await topic.create();
    await subscription.create();
    for (let i=0; i<6; i++) {
      await publisher.publish(Buffer.from(message), options);
    }
    return new Promise((resolve, reject) => {
      subscription.on('error', reject);
      subscription.once('message', resolve);
    });
  }

  before(() => {
    // create all needed topics
    return Promise.all(TOPICS.map(t => t.create()));
  });

  after(() => {
    // Delete topics
    return Promise.all(TOPICS.map(t => t.delete()));
  });

  describe('Topic', function() {
    it('should be listed', function(done) {
      pubsub.getTopics(function(err, topics) {
        assert.ifError(err);

        const results = topics.filter(function(topic) {
          const name = getTopicName(topic);
          return TOPIC_FULL_NAMES.indexOf(name) !== -1;
        });

        // get all topics in list of known names
        assert.strictEqual(results.length, TOPIC_NAMES.length);
        done();
      });
    });

    it('should list topics in a stream', function(done) {
      // tslint:disable-next-line no-any
      const topicsEmitted: any[] = [];

      // tslint:disable-next-line no-any
      (pubsub as any)
        .getTopicsStream()
        .on('error', done)
        .on('data', function(topic) {
          topicsEmitted.push(topic);
        })
        .on('end', function() {
          const results = topicsEmitted.filter(function(topic) {
            const name = getTopicName(topic);
            return TOPIC_FULL_NAMES.indexOf(name) !== -1;
          });

          assert.strictEqual(results.length, TOPIC_NAMES.length);
          done();
        });
    });

    it('should allow manual paging', function(done) {
      pubsub.getTopics(
        {
          pageSize: TOPIC_NAMES.length - 1,
          gaxOpts: {autoPaginate: false},
        },
        function(err, topics) {
          assert.ifError(err);
          assert.strictEqual(topics.length, TOPIC_NAMES.length - 1);
          done();
        }
      );
    });

    it('should be created and deleted', function(done) {
      const TOPIC_NAME = generateTopicName();
      pubsub.createTopic(TOPIC_NAME, function(err) {
        assert.ifError(err);
        pubsub.topic(TOPIC_NAME).delete(done);
      });
    });

    it('should honor the autoCreate option', function(done) {
      const topic = pubsub.topic(generateTopicName());

      topic.get({autoCreate: true}, done);
    });

    it('should confirm if a topic exists', function(done) {
      const topic = pubsub.topic(TOPIC_NAMES[0]);

      topic.exists(function(err, exists) {
        assert.ifError(err);
        assert.strictEqual(exists, true);
        done();
      });
    });

    it('should confirm if a topic does not exist', function(done) {
      const topic = pubsub.topic('should-not-exist');

      topic.exists(function(err, exists) {
        assert.ifError(err);
        assert.strictEqual(exists, false);
        done();
      });
    });

    it('should publish a message', function(done) {
      const topic = pubsub.topic(TOPIC_NAMES[0]);
      const publisher = topic.publisher();
      const message = Buffer.from('message from me');

      publisher.publish(message, function(err, messageId) {
        assert.ifError(err);
        assert.strictEqual(typeof messageId, 'string');
        done();
      });
    });

    it('should publish a message with attributes', async () => {
      const data = Buffer.from('raw message data');
      const attrs = {
        customAttribute: 'value',
      };
      // tslint:disable-next-line no-any
      const message: any = await publishPop(data, attrs);
      assert.deepStrictEqual(message.data, data);
      assert.deepStrictEqual(message.attributes, attrs);
    });

    it('should get the metadata of a topic', function(done) {
      const topic = pubsub.topic(TOPIC_NAMES[0]);
      topic.getMetadata(function(err, metadata) {
        assert.ifError(err);
        assert.strictEqual(metadata.name, topic.name);
        done();
      });
    });
  });

  describe('Subscription', function() {
    const TOPIC_NAME = generateTopicName();
    const topic = pubsub.topic(TOPIC_NAME);
    const publisher = topic.publisher();

    const SUB_NAMES = [generateSubName(), generateSubName()];

    const SUBSCRIPTIONS = [
      topic.subscription(SUB_NAMES[0], {ackDeadline: 30000}),
      topic.subscription(SUB_NAMES[1], {ackDeadline: 60000}),
    ];

    before(async () => {
      await topic.create();
      await Promise.all(SUBSCRIPTIONS.map(s => s.create()));
      for (let i=0; i<10; i++) {
        await publisher.publish(Buffer.from('hello'));
      }
      await new Promise(r => setTimeout(r, 2500));
    });

    after(() => {
      // Delete subscriptions
      return Promise.all(SUBSCRIPTIONS.map(async s => {
        try {
          await s.delete();
        } catch (e) {
          await topic.delete();
        }
      }));
    });

    it('should return error if creating an existing subscription', function(done) {
      // Use a new topic name...
      const topic = pubsub.topic(generateTopicName());

      // ...but with the same subscription name that we already created...
      const subscription = topic.subscription(SUB_NAMES[0]);

      subscription.create(function(err) {
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

    it('should list all subscriptions registered to the topic', function(done) {
      topic.getSubscriptions(function(err, subs) {
        assert.ifError(err);
        assert.strictEqual(subs.length, SUBSCRIPTIONS.length);
        assert(subs[0] instanceof Subscription);
        done();
      });
    });

    it('should list all topic subscriptions as a stream', function(done) {
      const subscriptionsEmitted: {}[] = [];
      topic
        .getSubscriptionsStream()
        .on('error', done)
        .on('data', function(subscription) {
          subscriptionsEmitted.push(subscription);
        })
        .on('end', function() {
          assert.strictEqual(subscriptionsEmitted.length, SUBSCRIPTIONS.length);
          done();
        });
    });

    it('should list all subscriptions regardless of topic', function(done) {
      pubsub.getSubscriptions(function(err, subscriptions) {
        assert.ifError(err);
        assert(subscriptions instanceof Array);
        done();
      });
    });

    it('should list all subscriptions as a stream', function(done) {
      let subscriptionEmitted = false;

      pubsub
        .getSubscriptionsStream()
        .on('error', done)
        .on('data', function(subscription) {
          subscriptionEmitted = subscription instanceof Subscription;
        })
        .on('end', function() {
          assert.strictEqual(subscriptionEmitted, true);
          done();
        });
    });

    it('should allow creation and deletion of a subscription', function(done) {
      const subName = generateSubName();
      topic.createSubscription(subName, function(err, sub) {
        assert.ifError(err);
        assert(sub instanceof Subscription);
        sub.delete(done);
      });
    });

    it('should honor the autoCreate option', function(done) {
      const sub = topic.subscription(generateSubName());

      sub.get({autoCreate: true}, done);
    });

    it('should confirm if a sub exists', function(done) {
      const sub = topic.subscription(SUB_NAMES[0]);

      sub.exists(function(err, exists) {
        assert.ifError(err);
        assert.strictEqual(exists, true);
        done();
      });
    });

    it('should confirm if a sub does not exist', function(done) {
      const sub = topic.subscription('should-not-exist');

      sub.exists(function(err, exists) {
        assert.ifError(err);
        assert.strictEqual(exists, false);
        done();
      });
    });

    it('should create a subscription with message retention', function(done) {
      const subName = generateSubName();
      const threeDaysInSeconds = 3 * 24 * 60 * 60;

      topic.createSubscription(
        subName,
        {
          messageRetentionDuration: threeDaysInSeconds,
        },
        function(err, sub) {
          assert.ifError(err);

          sub.getMetadata(function(err, metadata) {
            assert.ifError(err);

            assert.strictEqual(metadata.retainAckedMessages, true);
            assert.strictEqual(
              parseInt(metadata.messageRetentionDuration.seconds, 10),
              threeDaysInSeconds
            );
            assert.strictEqual(
              parseInt(metadata.messageRetentionDuration.nanos, 10),
              0
            );

            sub.delete(done);
          });
        }
      );
    });

    it('should set metadata for a subscription', function() {
      const subscription = topic.subscription(generateSubName());
      const threeDaysInSeconds = 3 * 24 * 60 * 60;

      return subscription
        .create()
        .then(function() {
          return subscription.setMetadata({
            messageRetentionDuration: threeDaysInSeconds,
          });
        })
        .then(function() {
          return subscription.getMetadata();
        })
        .then(function(data) {
          const metadata = data[0];

          assert.strictEqual(metadata.retainAckedMessages, true);
          assert.strictEqual(
            parseInt(metadata.messageRetentionDuration.seconds, 10),
            threeDaysInSeconds
          );
          assert.strictEqual(
            parseInt(metadata.messageRetentionDuration.nanos, 10),
            0
          );
        });
    });

    it('should error when using a non-existent subscription', function(done) {
      const subscription = topic.subscription(generateSubName(), {
        maxConnections: 1,
      });

      subscription.on('error', function(err) {
        assert.strictEqual(err.code, 5);
        subscription.close(done);
      });

      subscription.on('message', function() {
        done(new Error('Should not have been called.'));
      });
    });

    it('should receive the published messages', function(done) {
      let messageCount = 0;
      const subscription = topic.subscription(SUB_NAMES[1]);

      subscription.on('error', done);

      subscription.on('message', function(message) {
        assert.deepStrictEqual(message.data, Buffer.from('hello'));

        if (++messageCount === 10) {
          subscription.close(done);
        }
      });
    });

    it('should ack the message', function(done) {
      const subscription = topic.subscription(SUB_NAMES[1]);

      subscription.on('error', done);
      subscription.on('message', ack);

      function ack(message) {
        // remove listener to we only ack first message
        subscription.removeListener('message', ack);

        message.ack();
        setTimeout(() => subscription.close(done), 2500);
      }
    });

    it('should nack the message', function(done) {
      const subscription = topic.subscription(SUB_NAMES[1]);

      subscription.on('error', done);
      subscription.on('message', nack);

      function nack(message) {
        // remove listener to we only ack first message
        subscription.removeListener('message', nack);

        message.nack();
        setTimeout(() => subscription.close(done), 2500);
      }
    });

    it('should respect flow control limits', function(done) {
      const maxMessages = 3;
      let messageCount = 0;

      const subscription = topic.subscription(SUB_NAMES[0], {
        flowControl: {
          maxMessages: maxMessages,
        },
      });

      subscription.on('error', done);
      subscription.on('message', onMessage);

      function onMessage() {
        if (++messageCount < maxMessages) {
          return;
        }

        setImmediate(function() {
          subscription.close(done);
        });
      }
    });
  });

  describe('IAM', function() {
    it('should get a policy', function(done) {
      const topic = pubsub.topic(TOPIC_NAMES[0]);

      topic.iam.getPolicy(function(err, policy) {
        assert.ifError(err);

        assert.deepStrictEqual(policy.bindings, []);
        assert.strictEqual(policy.version, 0);

        done();
      });
    });

    it('should set a policy', function(done) {
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

      topic.iam.setPolicy(policy, function(err, newPolicy) {
        assert.ifError(err);
        assert.deepStrictEqual(newPolicy.bindings, policy.bindings);
        done();
      });
    });

    it('should test the iam permissions', function(done) {
      const topic = pubsub.topic(TOPIC_NAMES[0]);
      const testPermissions = ['pubsub.topics.get', 'pubsub.topics.update'];

      topic.iam.testPermissions(testPermissions, function(err, permissions) {
        assert.ifError(err);
        assert.deepStrictEqual(permissions, {
          'pubsub.topics.get': true,
          'pubsub.topics.update': true,
        });
        done();
      });
    });
  });

  describe('Snapshot', function() {
    const SNAPSHOT_NAME = generateSnapshotName();

    let topic;
    let publisher;
    let subscription;
    let snapshot;

    function deleteAllSnapshots() {
      // tslint:disable-next-line no-any
      return (pubsub.getSnapshots() as any).then(function(data) {
        return Promise.all(
          data[0].map(function(snapshot) {
            return snapshot.delete();
          })
        );
      });
    }

    function wait(milliseconds) {
      return function() {
        return new Promise(function(resolve) {
          setTimeout(resolve, milliseconds);
        });
      };
    }

    before(function() {
      topic = pubsub.topic(TOPIC_NAMES[0]);
      publisher = topic.publisher();
      subscription = topic.subscription(generateSubName());
      snapshot = subscription.snapshot(SNAPSHOT_NAME);

      return deleteAllSnapshots()
        .then(wait(2500))
        .then(subscription.create.bind(subscription))
        .then(wait(2500))
        .then(snapshot.create.bind(snapshot))
        .then(wait(2500));
    });

    after(function() {
      return deleteAllSnapshots();
    });

    it('should get a list of snapshots', function(done) {
      pubsub.getSnapshots(function(err, snapshots) {
        assert.ifError(err);
        assert.strictEqual(snapshots.length, 1);
        assert.strictEqual(snapshots[0].name.split('/').pop(), SNAPSHOT_NAME);
        done();
      });
    });

    it('should get a list of snapshots as a stream', function(done) {
      const snapshots: any[] = [];

      pubsub
        .getSnapshotsStream()
        .on('error', done)
        .on('data', function(snapshot) {
          snapshots.push(snapshot);
        })
        .on('end', function() {
          assert.strictEqual(snapshots.length, 1);
          assert.strictEqual(snapshots[0].name.split('/').pop(), SNAPSHOT_NAME);
          done();
        });
    });

    describe('seeking', function() {
      let subscription;
      let messageId;

      beforeEach(function() {
        subscription = topic.subscription(generateSubName());

        return subscription
          .create()
          .then(function() {
            return publisher.publish(Buffer.from('Hello, world!'));
          })
          .then(function(_messageId) {
            messageId = _messageId;
          });
      });

      it('should seek to a snapshot', function(done) {
        const snapshotName = generateSnapshotName();

        subscription.createSnapshot(snapshotName, function(err, snapshot) {
          assert.ifError(err);

          let messageCount = 0;

          subscription.on('error', done);
          subscription.on('message', function(message) {
            if (message.id !== messageId) {
              return;
            }

            message.ack();

            if (++messageCount === 1) {
              snapshot.seek(function(err) {
                assert.ifError(err);
              });
              return;
            }

            assert.strictEqual(messageCount, 2);
            subscription.close(done);
          });
        });
      });

      it('should seek to a date', function(done) {
        let messageCount = 0;

        subscription.on('error', done);
        subscription.on('message', function(message) {
          if (message.id !== messageId) {
            return;
          }

          message.ack();

          if (++messageCount === 1) {
            subscription.seek(message.publishTime, function(err) {
              assert.ifError(err);
            });
            return;
          }

          assert.strictEqual(messageCount, 2);
          subscription.close(done);
        });
      });
    });
  });
});
