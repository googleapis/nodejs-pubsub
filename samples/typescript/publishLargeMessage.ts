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

/**
 * This sample demonstrates how to perform basic operations on topics with
 * the Google Cloud Pub/Sub API.
 *
 * For more information, see the README.md under /pubsub and the documentation
 * at https://cloud.google.com/pubsub/docs.
 */

// sample-metadata:
//   title: Publish Large Messages to a Topic
//   description: Publishes a large message to a topic.
//   usage: node publishLargeMessages.js <topic-name> <source-file>

// [START pubsub_publish_large_message]
/**
 * TODO(developer): Uncomment these variables before running the sample.
 */
// const topicName = 'YOUR_TOPIC_NAME';
// const sourceFile = 'YOUR_FILENAME';

// Imports the Google Cloud client library
import {PubSub} from '@google-cloud/pubsub';

// Node FS library, to read files
import * as fs from 'fs';

// Creates a client; cache this for further use
const pubSubClient = new PubSub();

async function publishLargeMessage(topicName: string, sourceFile: string) {
  const topic = pubSubClient.topic(topicName);
  const messageContents = fs.readFileSync(sourceFile);

  const messageId = await topic.publish(messageContents);
  console.log(
    `Large message ${messageId} (size: ${messageContents.length}) published.`
  );
}
// [END pubsub_publish_large_message]

function main(topicName = 'YOUR_TOPIC_NAME', sourceFile = 'YOUR_FILENAME') {
  publishLargeMessage(topicName, sourceFile).catch(err => {
    console.error(err.message);
    process.exitCode = 1;
  });
}

main(...process.argv.slice(2));
