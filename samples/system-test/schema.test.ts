// Copyright 2021 Google LLC
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

import {
  Encodings,
  PubSub,
  Schema,
  SchemaEncoding,
  SchemaTypes,
  Subscription,
  Topic,
} from '@google-cloud/pubsub';
import {assert} from 'chai';
import {describe, it, afterEach} from 'mocha';
import * as cp from 'child_process';
import * as uuid from 'uuid';
import * as path from 'path';
import * as fs from 'fs/promises';
import * as defer from 'p-defer';

const execSync = (cmd: string) => cp.execSync(cmd, {encoding: 'utf-8'});

describe('schema', () => {
  const projectId = process.env.GCLOUD_PROJECT;
  const pubsub = new PubSub({projectId});
  const runId = uuid.v4();
  console.log(`Topics runId: ${runId}`);
  const topicNameOne = `schema-top1-${runId}`;
  const subscriptionNameOne = `schema-sub1-${runId}`;
  //const fullTopicNameOne = `projects/${projectId}/topics/${topicNameOne}`;
  const schemaNameOne = `schema1-${runId}`;
  const fullSchemaNameOne = `projects/${projectId}/schemas/${schemaNameOne}`;

  const commandFor = (action: string) => `node ${action}.js`;

  async function cleanSchemas() {
    const schemas = [];
    for await (const s of pubsub.listSchemas()) {
      schemas.push(pubsub.schema(s.name!).delete());
    }
    await Promise.all(schemas);
  }

  async function cleanTopics() {
    const [topics] = await pubsub.getTopics();
    await Promise.all(
      topics.filter(x => x.name.endsWith(runId)).map(x => x.delete())
    );
  }

  async function cleanSubs() {
    const [subscriptions] = await pubsub.getSubscriptions();
    await Promise.all(
      subscriptions.filter(x => x.name.endsWith(runId)).map(x => x.delete())
    );
  }

  afterEach(async () => {
    await cleanSubs();
    await cleanTopics();
    await cleanSchemas();
  });

  function fixturePath(fixture: string): string {
    return path.join(__dirname, '..', '..', 'system-test', 'fixtures', fixture);
  }

  async function createSchema(type: 'avro' | 'proto'): Promise<Schema> {
    const suffix = type === 'avro' ? 'avsc' : 'proto';
    const encoding =
      type === 'avro' ? SchemaTypes.Avro : SchemaTypes.ProtocolBuffer;
    const def = (
      await fs.readFile(fixturePath(`provinces.${suffix}`))
    ).toString();
    const schema = await pubsub.createSchema(schemaNameOne, encoding, def);
    assert.ok(schema);

    return schema;
  }

  async function createTopicWithSchema(
    encodingType: SchemaEncoding
  ): Promise<Topic> {
    const [topic] = await pubsub.createTopic({
      name: topicNameOne,
      schemaSettings: {
        schema: fullSchemaNameOne,
        encoding: encodingType,
      },
    });
    assert.ok(topic);

    return topic;
  }

  async function createSub(): Promise<Subscription> {
    const [sub] = await pubsub.createSubscription(
      topicNameOne,
      subscriptionNameOne
    );
    assert.ok(sub);

    return sub;
  }

  it('should create an avro schema', async () => {
    const output = execSync(
      `${commandFor('createAvroSchema')} ${schemaNameOne} ${fixturePath(
        'provinces.avsc'
      )}`
    );
    assert.include(output, schemaNameOne);
    assert.include(output, 'created.');

    let found = false;
    for await (const s of pubsub.listSchemas()) {
      if (s.name?.endsWith(schemaNameOne)) {
        found = true;
        break;
      }
    }

    assert.ok(found, 'created schema was not found');
  });

  it('should create a proto schema', async () => {
    const output = execSync(
      `${commandFor('createProtoSchema')} ${schemaNameOne} ${fixturePath(
        'provinces.proto'
      )}`
    );
    assert.include(output, schemaNameOne);
    assert.include(output, 'created.');

    let found = false;
    for await (const s of pubsub.listSchemas()) {
      if (s.name?.endsWith(schemaNameOne)) {
        found = true;
        break;
      }
    }

    assert.ok(found, 'created schema was not found');
  });

  it('should create a topic with a schema', async () => {
    await createSchema('proto');
    const output = execSync(
      `${commandFor(
        'createTopicWithSchema'
      )} ${topicNameOne} ${schemaNameOne} BINARY`
    );
    assert.include(output, topicNameOne);
    assert.include(output, schemaNameOne);
    assert.include(output, 'created with');

    const [topic] = await pubsub.topic(topicNameOne).get();
    assert.include(topic.metadata?.schemaSettings?.schema, schemaNameOne);
  });

  it('should delete a schema', async () => {
    await createSchema('proto');

    const output = execSync(`${commandFor('deleteSchema')} ${schemaNameOne}`);
    assert.include(output, schemaNameOne);
    assert.include(output, 'deleted.');

    try {
      const got = await pubsub.schema(schemaNameOne).get();
      assert.isNotOk(got, "schema hadn't been deleted");
    } catch (e) {
      // This is expected.
    }
  });

  it('should get a schema', async () => {
    await createSchema('proto');

    const output = execSync(`${commandFor('getSchema')} ${schemaNameOne}`);
    assert.include(output, schemaNameOne);
    assert.include(output, 'info:');
    assert.include(output, 'PROTO');
  });

  it('should listen for avro records', async () => {
    await createSchema('avro');
    const topic = await createTopicWithSchema(Encodings.Json);
    await createSub();

    topic.publish(
      Buffer.from(
        JSON.stringify({
          name: 'Alberta',
          post_abbr: 'AB',
        })
      )
    );

    const output = execSync(
      `${commandFor('listenForAvroRecords')} ${subscriptionNameOne}`
    );
    assert.include(output, 'Received message');
    assert.include(output, 'Alberta');
    assert.include(output, 'AB');
  });

  it('should listen for protobuf messages', async () => {
    await createSchema('proto');
    const topic = await createTopicWithSchema('JSON');
    await createSub();

    topic.publish(
      Buffer.from(
        JSON.stringify({
          name: 'Quebec',
          post_abbr: 'QC',
        })
      )
    );

    const output = execSync(
      `${commandFor('listenForProtobufMessages')} ${subscriptionNameOne}`
    );
    assert.include(output, 'Received message');
    assert.include(output, 'Quebec');
    assert.include(output, 'QC');
  });

  it('should list schemas', async () => {
    await createSchema('avro');
    const output = execSync(
      `${commandFor('listenForProtobufMessages')} ${subscriptionNameOne}`
    );
    assert.include(output, 'Received message');
    assert.include(output, 'Quebec');
    assert.include(output, 'QC');
  });

  it('should publish avro records', async () => {
    await createSchema('avro');
    await createTopicWithSchema('BINARY');
    const sub = await createSub();
    const deferred = defer();
    sub.on('message', deferred.resolve);
    sub.on('error', deferred.reject);

    const output = execSync(
      `${commandFor('publishAvroRecords')} ${topicNameOne}`
    );
    assert.include(output, 'published.');

    const result = await deferred.promise;
    assert.include(result, 'Ontario');
  });

  it('should publish protobuf messages', async () => {
    await createSchema('proto');
    await createTopicWithSchema('BINARY');
    const sub = await createSub();
    const deferred = defer();
    sub.on('message', deferred.resolve);
    sub.on('error', deferred.reject);

    const output = execSync(
      `${commandFor('publishProtobufMessages')} ${topicNameOne}`
    );
    assert.include(output, 'published.');

    const result = await deferred.promise;
    assert.include(result, 'Ontario');
  });
});
