// Copyright 2021 Google LLC
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

/**
 * This sample demonstrates how to perform basic operations on topics with
 * the Google Cloud Pub/Sub API.
 *
 * For more information, see the README.md under /pubsub and the documentation
 * at https://cloud.google.com/pubsub/docs.
 */

// sample-metadata:
//   title: Publish with flow control
//   description: Publishes to a topic using publisher-side flow control.
//   usage: node publishWithFlowControl.js <topic-name>

// [START pubsub_publisher_flow_control]
/**
 * TODO(developer): Uncomment this variable before running the sample.
 */
// const topicName = 'YOUR_TOPIC_NAME';

// Imports the Google Cloud client library
import {
  PubSub,
  PublishOptions,
  PublisherFlowControlAction,
} from '@google-cloud/pubsub';

// Creates a client; cache this for further use
const pubSubClient = new PubSub();

async function publishWithFlowControl(topicName: string) {
  // Create publisher flow control settings
  const options: PublishOptions = {
    publisherFlowControl: {
      maxOutstandingMessages: 50,
      maxOutstandingBytes: 10 * 1024 * 1024, // 10 MB
      action: PublisherFlowControlAction.Pause,
    },
  };

  // Get a publisher.
  const topic = pubSubClient.topic(topicName, options);

  // Publish messages, waiting for queue space.
  const messageIdPromises: Promise<string>[] = [];
  for (let i = 0; i < 1000; i++) {
    const [messageIdPromise] = await topic.publishWithFlowControl(
      Buffer.from('test!')
    );
    messageIdPromises.push(messageIdPromise);
  }

  // Wait on any pending publish requests.
  const messageIds = await Promise.all(messageIdPromises);
  console.log(`Published ${messageIds.length} with flow control settings.`);

  console.log(topic.publisher.flowControl);
}
// [END pubsub_publisher_flow_control]

function main(topicName = 'YOUR_TOPIC_NAME') {
  publishWithFlowControl(topicName)
    .then(() => {
      console.log('hooha');
    })
    .catch(err => {
      console.error(err.message);
      process.exitCode = 1;
    });
}

main(...process.argv.slice(2));
