// Copyright 2019 Google LLC
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

'use strict';

// Publishes messages to a topic using custom batching settings.
function main(
  topicName = 'YOUR_TOPIC_NAME',
  data = JSON.stringify({foo: 'bar'}),
  maxMessages = 10,
  maxWaitTime = 10000
) {
  // [START pubsub_publisher_batch_settings]
  /**
   * TODO(developer): Uncomment these variables before running the sample.
   */
  // const topicName = 'YOUR_TOPIC_NAME';
  // const data = JSON.stringify({foo: 'bar'});
  // const maxMessages = 10;
  // const maxWaitTime = 10000;

  // Imports the Google Cloud client library
  const {PubSub} = require('@google-cloud/pubsub');

  // Creates a client; cache this for further use
  const pubSubClient = new PubSub();

  async function publishBatchedMessages() {
    // Publishes the message as a string, e.g. "Hello, world!" or JSON.stringify(someObject)
    const dataBuffer = Buffer.from(data);

    const batchPublisher = pubSubClient.topic(topicName, {
      batching: {
        maxMessages: maxMessages,
        maxMilliseconds: maxWaitTime,
      },
    });

    for (let i = 0; i < 10; i++) {
      (async () => {
        const messageId = await batchPublisher.publish(dataBuffer);
        console.log(`Message ${messageId} published.`);
      })();
    }
  }

  publishBatchedMessages();
  // [END pubsub_publisher_batch_settings]
}

const {sampleMain} = require('../common');
sampleMain()
  .commandName('publish-batch')
  .args('<topicName> <message>', {
    maxWaitTime: {
      alias: 'w',
      type: 'number',
      default: 10000,
    },
    maxMessages: {
      alias: 'm',
      type: 'number',
      default: 10,
    },
  })
  .help('Publishes messages to a topic using custom batching settings.')
  .example('my-topic "Hello, world!" -w 1000')
  .execute(module, opts => {
    main(opts.topicName, opts.message, opts.maxMessages, opts.maxWaitTime);
  });