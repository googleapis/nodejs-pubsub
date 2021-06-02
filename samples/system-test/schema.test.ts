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

import {PubSub} from '@google-cloud/pubsub';
import {assert} from 'chai';
import {describe, it, before, after} from 'mocha';
import * as cp from 'child_process';
import * as uuid from 'uuid';
import * as path from 'path';

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

  const commandFor = (action: string) => `node ${action}.js`;

  before(async () => {
    const [topic] = await pubsub.createTopic(topicNameOne);
    await pubsub.createSubscription(topic, subscriptionNameOne);
  });

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

  after(async () => {
    await cleanSubs();
    await cleanTopics();
    await cleanSchemas();
  });

  function fixturePath(fixture: string): string {
    return path.join(__dirname, '..', '..', 'system-test', 'fixtures', fixture);
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
});
