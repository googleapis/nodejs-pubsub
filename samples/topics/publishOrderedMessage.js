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

// Publishes an ordered message to a topic.
// TODO(feywind): This sample doesn't make any sense by itself, because it's
// only sending one message. Need to look at this more re: subscriptions.js.
function main(
  topicName = 'YOUR_TOPIC_NAME',
  data = JSON.stringify({foo: 'bar'})
) {
  // [START pubsub_publish_ordered_message]
  /**
   * TODO(developer): Uncomment these variables before running the sample.
   */
  // const topicName = 'YOUR_TOPIC_NAME';
  // const data = JSON.stringify({foo: 'bar'});

  // Imports the Google Cloud client library
  const {PubSub} = require('@google-cloud/pubsub');

  // Creates a client; cache this for further use
  const pubSubClient = new PubSub();

  let publishCounterValue = 1;

  function getPublishCounterValue() {
    return publishCounterValue;
  }

  function setPublishCounterValue(value) {
    publishCounterValue = value;
  }

  async function publishOrderedMessage() {
    // Publishes the message as a string, e.g. "Hello, world!" or JSON.stringify(someObject)
    const dataBuffer = Buffer.from(data);

    const attributes = {
      // Pub/Sub messages are unordered, so assign an order ID and manually order messages
      counterId: `${getPublishCounterValue()}`,
    };

    // Publishes the message
    const messageId = await pubSubClient
      .topic(topicName)
      .publish(dataBuffer, attributes);

    // Update the counter value
    setPublishCounterValue(parseInt(attributes.counterId, 10) + 1);
    console.log(`Message ${messageId} published.`);

    return messageId;
  }

  // [END pubsub_publish_ordered_message]
  publishOrderedMessage();
}

const {sampleMain} = require('../common');
sampleMain()
  .commandName('publish-ordered')
  .args('<topicName> <message>')
  .help('Publishes an ordered message to a topic.')
  .example('my-topic "Hello, world!"')
  .execute(module, opts => {
    try {
      opts.message = JSON.parse(opts.message);
    } catch (err) {
      // Ignore error
    }
    main(opts.topicName, opts.message);
  });
