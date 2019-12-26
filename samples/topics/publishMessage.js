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

// Publishes a message to a topic.
function main(
  topicName = 'YOUR_TOPIC_NAME',
  data = JSON.stringify({foo: 'bar'})
) {
  // [START pubsub_publish]
  // [START pubsub_quickstart_publisher]
  /**
   * TODO(developer): Uncomment these variables before running the sample.
   */
  // const topicName = 'YOUR_TOPIC_NAME';
  // const data = JSON.stringify({foo: 'bar'});

  // Imports the Google Cloud client library
  const {PubSub} = require('@google-cloud/pubsub');

  // Creates a client; cache this for further use
  const pubSubClient = new PubSub();

  async function publishMessage() {
    /**
     * TODO(developer): Uncomment the following lines to run the sample.
     */
    // const topicName = 'my-topic';

    // Publishes the message as a string, e.g. "Hello, world!" or JSON.stringify(someObject)
    const dataBuffer = Buffer.from(data);

    const messageId = await pubSubClient.topic(topicName).publish(dataBuffer);
    console.log(`Message ${messageId} published.`);
  }

  publishMessage();
  // [END pubsub_publish]
  // [END pubsub_quickstart_publisher]
}

const {sampleMain} = require('../common');
sampleMain()
  .commandName('publish')
  .args('<topicName> <message>')
  .help('Publishes a message to a topic.')
  .example('my-topic "Hello, world!"')
  .example(`my-topic '{"data":"Hello, world!"}'`)
  .execute(module, opts => main(opts.topicName, opts.message));