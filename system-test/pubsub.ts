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
import {describe, it, before, after, beforeEach} from 'mocha';
import * as crypto from 'crypto';
import defer = require('p-defer');
import * as uuid from 'uuid';

// This is only in Node 10.17+, but it's used for system tests, should be okay.
// eslint-disable-next-line node/no-unsupported-features/node-builtins
import {promises as fs} from 'fs';

import {
  Message,
  PubSub,
  ServiceError,
  Snapshot,
  Subscription,
  Topic,
  SchemaTypes,
  SchemaViews,
  ISchema,
} from '../src';
import {Policy, IamPermissionsMap} from '../src/iam';
import {MessageOptions} from '../src/topic';
import {google} from '../protos/protos';

type Resource = Topic | Subscription | Snapshot;

const PREFIX = 'gcloud-tests';
const CURRENT_TIME = Date.now();

const pubsub = new PubSub();

function shortUUID() {
  return uuid.v1().split('-').shift();
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

  function generateSchemaName() {
    return generateName('schema');
  }

  function generateSubForDetach() {
    return generateSubName();
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
    const timeDiff = (Date.now() - createdAt) / (2 * 1000 * 60 * 60);

    if (timeDiff > 1) {
      resource.delete();
    }
  }

  async function deleteTestResources(): Promise<void> {
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

    // Schemas might be dependencies on topics, so wait for these first.
    await Promise.all(streams);

    const allSchemas: Promise<void>[] = [];
    for await (const s of pubsub.listSchemas()) {
      let deleteSchema = false;
      const name = s.name;
      if (!name) {
        continue;
      }

      // Delete resource from current test run.
      if (name.includes(CURRENT_TIME.toString())) {
        deleteSchema = true;
      } else if (name.includes(PREFIX)) {
        // Delete left over resources which are older then 1 hour.
        const createdAt = Number(s.name?.split('-').pop());
        const timeDiff = (Date.now() - createdAt) / (2 * 1000 * 60 * 60);

        if (timeDiff > 1) {
          deleteSchema = true;
        }
      }

      if (deleteSchema) {
        const wrapped = pubsub.schema(name);
        allSchemas.push(wrapped.delete());
      }
    }
    await Promise.all(allSchemas);
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
        .on('data', (topic: Topic) => {
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

      topic.exists(
        (err: Error | null | undefined, exists: boolean | null | undefined) => {
          assert.ifError(err);
          assert.strictEqual(exists, true);
          done();
        }
      );
    });

    it('should confirm if a topic does not exist', done => {
      const topic = pubsub.topic('should-not-exist');

      topic.exists(
        (err: Error | null | undefined, exists: boolean | null | undefined) => {
          assert.ifError(err);
          assert.strictEqual(exists, false);
          done();
        }
      );
    });

    it('should publish a message', done => {
      const topic = pubsub.topic(TOPIC_NAMES[0]);
      const message = {
        data: Buffer.from('message from me'),
        orderingKey: 'a',
      };

      topic.publishMessage(
        message,
        (
          err: Error | null | undefined,
          messageId: string | null | undefined
        ) => {
          assert.ifError(err);
          assert.strictEqual(typeof messageId, 'string');
          done();
        }
      );
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
      topic.getMetadata(
        (
          err: ServiceError | null | undefined,
          metadata: google.pubsub.v1.ITopic | null | undefined
        ) => {
          assert.ifError(err);
          assert.strictEqual(metadata!.name, topic.name);
          done();
        }
      );
    });

    it('should set metadata for a topic', async () => {
      const threeDaysInSeconds = 3 * 24 * 60 * 60;

      const topic = pubsub.topic(TOPIC_NAMES[0]);
      await topic.setMetadata({
        messageRetentionDuration: {
          seconds: threeDaysInSeconds,
        },
      });
      const [metadata] = await topic.getMetadata();
      const {seconds, nanos} = metadata.messageRetentionDuration!;

      assert.strictEqual(Number(seconds), threeDaysInSeconds);
      assert.strictEqual(Number(nanos), 0);
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
          // eslint-disable-next-line @typescript-eslint/no-var-requires
        } = require('../../system-test/fixtures/ordered-messages.json');

        const pending: Pending = {};

        expected.forEach(({key, messages}: Expected) => {
          pending[key] = messages;
        });

        const deferred = defer();

        // Make sure we're listening when the lease manager throws the messages at us.
        subscription
          .on('error', deferred.reject)
          .on('message', (message: Message) => {
            const key = message.orderingKey || '';
            const data = message.data.toString();
            const messages = pending[key];

            if (!messages) {
              deferred.reject(
                new Error(
                  `Unknown key "${key}" for test data: ${JSON.stringify(
                    pending,
                    null,
                    4
                  )}`
                )
              );
              subscription.close();
              return;
            }

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

        await deferred.promise;
        await Promise.all([topic.delete(), subscription.delete()]);
      });
    });
  });

  describe('Subscription', () => {
    const TOPIC_NAME = generateTopicName();
    const topic = pubsub.topic(TOPIC_NAME);

    const SUB_NAMES = [generateSubName(), generateSubName()];
    const SUB_DETACH_NAME = generateSubForDetach();

    const SUBSCRIPTIONS = [
      topic.subscription(SUB_NAMES[0], {ackDeadline: 30}),
      topic.subscription(SUB_NAMES[1], {ackDeadline: 60}),
      topic.subscription(SUB_DETACH_NAME, {ackDeadline: 30}),
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
        }

        // ...and it should fail, because the subscription name is unique to the
        // project, and not the topic.
        assert.strictEqual(err!.code, 6);
        done();
      });
    });

    it('should list all subscriptions registered to the topic', done => {
      topic.getSubscriptions(
        (
          err: Error | null | undefined,
          subs: Subscription[] | null | undefined
        ) => {
          assert.ifError(err);
          assert.strictEqual(subs!.length, SUBSCRIPTIONS.length);
          assert(subs![0] instanceof Subscription);
          done();
        }
      );
    });

    it('should list all topic subscriptions as a stream', done => {
      const subscriptionsEmitted: Array<{}> = [];
      topic
        .getSubscriptionsStream()
        .on('error', done)
        .on('data', (subscription: {}) => {
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
        .on('data', (subscription: Subscription) => {
          subscriptionEmitted = subscription instanceof Subscription;
        })
        .on('end', () => {
          assert.strictEqual(subscriptionEmitted, true);
          done();
        });
    });

    it('should allow creation and deletion of a subscription', done => {
      const subName = generateSubName();
      topic.createSubscription(
        subName,
        (
          err: Error | null | undefined,
          sub: Subscription | null | undefined
        ) => {
          assert.ifError(err);
          assert(sub instanceof Subscription);
          sub!.delete(done);
        }
      );
    });

    it('should honor the autoCreate option', done => {
      const sub = topic.subscription(generateSubName());

      sub.get({autoCreate: true}, done);
    });

    it('should confirm if a sub exists', done => {
      const sub = topic.subscription(SUB_NAMES[0]);

      sub.exists(
        (err: Error | null | undefined, exists: boolean | null | undefined) => {
          assert.ifError(err);
          assert.strictEqual(exists, true);
          done();
        }
      );
    });

    it('should confirm if a sub does not exist', done => {
      const sub = topic.subscription('should-not-exist');

      sub.exists(
        (err: Error | null | undefined, exists: boolean | null | undefined) => {
          assert.ifError(err);
          assert.strictEqual(exists, false);
          done();
        }
      );
    });

    it('should create a subscription with message retention', done => {
      const subName = generateSubName();
      const threeDaysInSeconds = 3 * 24 * 60 * 60;
      const callOptions = {
        messageRetentionDuration: threeDaysInSeconds,
        topic: '',
        name: '',
      };

      topic.createSubscription(
        subName,
        callOptions,
        (
          err: Error | null | undefined,
          sub: Subscription | null | undefined
        ) => {
          assert.ifError(err);

          sub!.getMetadata(
            (
              err: Error | null | undefined,
              metadata: google.pubsub.v1.ISubscription | null | undefined
            ) => {
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
            }
          );
        }
      );
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

      subscription.on('error', (err: {code: number}) => {
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

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      subscription.on('message', (message: {data: any}) => {
        assert.deepStrictEqual(message.data, Buffer.from('hello'));

        if (++messageCount === 10) {
          subscription.close(done);
        }
      });
    });

    it('should ack the message', done => {
      const subscription = topic.subscription(SUB_NAMES[1]);

      let finished = false;
      subscription.on('error', () => {
        if (!finished) {
          finished = true;
          subscription.close(done);
        }
      });
      subscription.on('message', ack);

      function ack(message: Message) {
        if (!finished) {
          finished = true;
          message.ack();
          subscription.close(done);
        }
      }
    });

    it('should nack the message', done => {
      const subscription = topic.subscription(SUB_NAMES[1]);

      let finished = false;
      subscription.on('error', () => {
        if (!finished) {
          finished = true;
          subscription.close(done);
        }
      });
      subscription.on('message', nack);

      function nack(message: Message) {
        if (!finished) {
          finished = true;
          message.nack();
          subscription.close(done);
        }
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

      topic.publishMessage(
        {data},
        (err: ServiceError | null, messageId: string | null | undefined) => {
          assert.ifError(err);

          subscription.on('error', done).on('message', (message: Message) => {
            if (message.id !== messageId) {
              return;
            }

            assert.deepStrictEqual(data, message.data);
            subscription.close(done);
          });
        }
      );
    });

    it('should detach subscriptions', async () => {
      const subscription = topic.subscription(SUB_DETACH_NAME);
      const [before] = await subscription.detached();
      assert.strictEqual(before, false);
      await pubsub.detachSubscription(SUB_DETACH_NAME);
      const [after] = await subscription.detached();
      assert.strictEqual(after, true);
    });

    // can be ran manually to test options/memory usage/etc.
    // tslint:disable-next-line ban
    it.skip('should handle a large volume of messages', async function () {
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

        subscription.close((err: unknown) => {
          if (err) {
            deferred.reject(err);
          } else {
            deferred.resolve();
          }
        });
      }

      function publish(messageCount: number) {
        const data = Buffer.from('Hello, world!');
        const promises: Array<Promise<string>> = [];

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

      topic.iam.getPolicy(
        (err: ServiceError | null, policy: Policy | null | undefined) => {
          assert.ifError(err);

          assert.deepStrictEqual(policy!.bindings, []);
          assert.strictEqual(policy!.version, 0);

          done();
        }
      );
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

      topic.iam.testPermissions(
        testPermissions,
        (
          err: ServiceError | null,
          permissions: IamPermissionsMap | null | undefined
        ) => {
          assert.ifError(err);
          assert.deepStrictEqual(permissions, {
            'pubsub.topics.get': true,
            'pubsub.topics.update': true,
          });
          done();
        }
      );
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
      pubsub.getSnapshots(
        (
          err: Error | null | undefined,
          snapshots: Snapshot[] | null | undefined
        ) => {
          assert.ifError(err);
          assert(snapshots!.length > 0);
          const names = snapshots!.map(getSnapshotName);
          assert(names.includes(SNAPSHOT_NAME));
          done();
        }
      );
    });

    it('should get a list of snapshots as a stream', done => {
      const snapshots = new Array<Snapshot>();
      pubsub
        .getSnapshotsStream()
        .on('error', done)
        .on('data', (snapshot: Snapshot) => snapshots.push(snapshot))
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
      let errorPromise: Promise<{}>;

      beforeEach(async () => {
        subscription = topic.subscription(generateSubName());
        snapshot = subscription.snapshot(generateSnapshotName());

        await subscription.create();
        await snapshot.create();

        errorPromise = new Promise((_, reject) =>
          subscription.on('error', reject)
        );
      });

      // This creates a Promise that hooks the 'message' callback of the
      // subscription above, and resolves when that callback calls `resolve`.
      type WorkCallback = (arg: Message, resolve: Function) => void;
      function makeMessagePromise(workCallback: WorkCallback): Promise<void> {
        return new Promise(resolve => {
          subscription.on('message', (arg: Message) => {
            workCallback(arg, resolve);
          });
        });
      }

      async function publishTestMessage() {
        messageId = await topic.publish(Buffer.from('Hello, world!'));
      }

      it('should seek to a snapshot', async () => {
        let messageCount = 0;

        type EventParameter = {id: string; ack: () => void};
        const messagePromise = makeMessagePromise(
          async (message: EventParameter, resolve) => {
            if (message.id !== messageId) {
              return;
            }
            message.ack();

            if (++messageCount === 1) {
              await snapshot!.seek();
              return;
            }

            assert.strictEqual(messageCount, 2);
            await subscription.close();

            resolve();
          }
        );

        await publishTestMessage();
        await Promise.race([errorPromise, messagePromise]);
      });

      it('should seek to a date', async () => {
        let messageCount = 0;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        type EventParameter = {id: string; ack: () => void; publishTime: any};
        const messagePromise = makeMessagePromise(
          async (message: EventParameter, resolve) => {
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
            await subscription.close();

            resolve();
          }
        );

        await publishTestMessage();
        await Promise.race([errorPromise, messagePromise]);
      });

      it('should seek to a future date (purge)', async () => {
        const testText = 'Oh no!';

        await publishTestMessage();

        // Forward-seek to remove any messages from the queue (those were
        // placed there in before()).
        //
        // We... probably won't be using this in 3000?
        await subscription.seek(new Date('3000-01-01'));

        // Drop a second message and make sure it's the right ID.
        await topic.publish(Buffer.from(testText));

        type EventParameter = {data: {toString: () => string}; ack: () => void};
        const messagePromise = makeMessagePromise(
          async (message: EventParameter, resolve) => {
            // If we get the default message from before() then this fails.
            assert.equal(message.data.toString(), testText);
            message.ack();
            await subscription.close();

            resolve();
          }
        );

        await Promise.race([errorPromise, messagePromise]);
      });
    });
  });

  describe('schema', () => {
    // This should really be handled by a standard method of Array(), imo, but it's not.
    async function aiToArray(
      iterator: AsyncIterable<ISchema>,
      nameFilter?: string
    ): Promise<ISchema[]> {
      const result = [] as ISchema[];
      for await (const i of iterator) {
        if (!nameFilter || (nameFilter && i.name?.endsWith(nameFilter))) {
          result.push(i);
        }
      }

      return result;
    }

    const getSchemaDef = async () => {
      const schemaDef = (
        await fs.readFile('system-test/fixtures/provinces.avsc')
      ).toString();

      return schemaDef;
    };

    const setupTestSchema = async () => {
      const schemaDef = await getSchemaDef();
      const schemaId = generateSchemaName();
      await pubsub.createSchema(schemaId, SchemaTypes.Avro, schemaDef);
      return schemaId;
    };

    it('should create a schema', async () => {
      const schemaId = await setupTestSchema();
      const schemaList = await aiToArray(pubsub.listSchemas(), schemaId);
      assert.strictEqual(schemaList.length, 1);
    });

    it('should delete a schema', async () => {
      const schemaId = await setupTestSchema();

      // Validate that we created one, because delete() doesn't throw, and we
      // might end up causing a false negative.
      const preSchemaList = await aiToArray(pubsub.listSchemas(), schemaId);
      assert.strictEqual(preSchemaList.length, 1);

      await pubsub.schema(schemaId).delete();

      const postSchemaList = await aiToArray(pubsub.listSchemas(), schemaId);
      assert.strictEqual(postSchemaList.length, 0);
    });

    it('should list schemas', async () => {
      const schemaId = await setupTestSchema();

      const basicList = await aiToArray(
        pubsub.listSchemas(SchemaViews.Basic),
        schemaId
      );
      assert.strictEqual(basicList.length, 1);
      assert.strictEqual(basicList[0].definition, '');

      const fullList = await aiToArray(
        pubsub.listSchemas(SchemaViews.Full),
        schemaId
      );
      assert.strictEqual(fullList.length, 1);
      assert.ok(fullList[0].definition);
    });

    it('should get a schema', async () => {
      const schemaId = await setupTestSchema();
      const schema = pubsub.schema(schemaId);
      const info = await schema.get(SchemaViews.Basic);
      assert.strictEqual(info.definition, '');

      const fullInfo = await schema.get(SchemaViews.Full);
      assert.ok(fullInfo.definition);
    });

    it('should validate a schema', async () => {
      const schemaDef = await getSchemaDef();

      try {
        await pubsub.validateSchema({
          type: SchemaTypes.Avro,
          definition: schemaDef,
        });
      } catch (e) {
        assert.strictEqual(e, undefined, 'Error thrown by validateSchema');
      }

      const badSchemaDef = '{"not_actually":"avro"}';
      try {
        await pubsub.validateSchema({
          type: SchemaTypes.Avro,
          definition: badSchemaDef,
        });
      } catch (e) {
        assert.ok(e);
      }

      const fakeSchemaDef = 'woohoo i am a schema, no really';

      try {
        await pubsub.validateSchema({
          type: SchemaTypes.Avro,
          definition: fakeSchemaDef,
        });
      } catch (e) {
        assert.ok(e);
      }
    });

    // The server doesn't seem to be returning proper responses for this.
    // Commenting out for now, until it can be discussed.
    // TODO(feywind): Uncomment this later. May be solved by b/188927641.
    /* it('should validate a message', async () => {
      const schemaId = await setupTestSchema();
      const schema = pubsub.schema(schemaId);
      const testMessage = (
        await fs.readFile('system-test/fixtures/province.json')
      ).toString();

      try {
        await schema.validateMessage(testMessage, Encodings.Json);
      } catch (e) {
        console.log(e, e.message, e.toString());
        assert.strictEqual(e, undefined, 'Error thrown by validateSchema');
      }

      const badMessage = '{"foo":"bar"}';

      try {
        await schema.validateMessage(badMessage, Encodings.Json);
      } catch (e) {
        assert.ok(e);
      }

      const fakeMessage = 'woohoo i am a message, no really';

      try {
        await schema.validateMessage(fakeMessage, Encodings.Json);
      } catch (e) {
        assert.ok(e);
      }
    }); */
  });

  it('should allow closing of publisher clients', async () => {
    // The full call stack of close() is tested in unit tests; this is mostly
    // to verify that the close() method is actually there and doesn't error.
    const localPubsub = new PubSub();

    // Just use the client object to make sure it has opened a connection.
    await pubsub.getTopics();

    // Tell it to close, and validate that it's marked closed.
    await localPubsub.close();
    assert.strictEqual(localPubsub.isOpen, false);
  });
});
