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

// Publishes a message with custom attributes to a Topic.
function main(
  topicName = 'YOUR_TOPIC_NAME',
  data = JSON.stringify({foo: 'bar'})
) {
  // [START pubsub_publish_custom_attributes]
  /**
   * TODO(developer): Uncomment these variables before running the sample.
   */
  // const topicName = 'YOUR_TOPIC_NAME';
  // const data = JSON.stringify({foo: 'bar'});

  // Imports the Google Cloud client library
  const {PubSub} = require('@google-cloud/pubsub');

  // Creates a client; cache this for further use
  const pubSubClient = new PubSub();

  async function publishMessageWithCustomAttributes() {
    // Publishes the message as a string, e.g. "Hello, world!" or JSON.stringify(someObject)
    const dataBuffer = Buffer.from(data);

    // Add two custom attributes, origin and username, to the message
    const customAttributes = {
      origin: 'nodejs-sample',
      username: 'gcp',
    };

    const messageId = await pubSubClient
      .topic(topicName)
      .publish(dataBuffer, customAttributes);
    console.log(`Message ${messageId} published.`);
  }

  publishMessageWithCustomAttributes();
  // [END pubsub_publish_custom_attributes]
}

const {sampleMain} = require('../common');
sampleMain()
  .commandName('publish-attributes')
  .args('<topicName> <message>')
  .help('Publishes a message with custom attributes to a Topic.')
  .example('my-topic "Hello, world!"')
  .execute(module, opts => main(opts.topicName, opts.message));