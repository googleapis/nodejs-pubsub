// Copyright 2019-2021 Google LLC
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

// sample-metadata:
//   title: Publish Avro Records to a Topic
//   description: Publishes a message in Avro to a topic.
//   usage: node publishAvroRecords.js <topic-name> <data>

function main(topicName = 'YOUR_TOPIC_NAME') {
  // [START pubsub_publish_avro_records]
  /**
   * TODO(developer): Uncomment these variables before running the sample.
   */
  // const topicName = 'YOUR_TOPIC_NAME';
  // const data = JSON.stringify({foo: 'bar'});

  // Imports the Google Cloud client library
  const {PubSub, Encoding} = require('@google-cloud/pubsub');

  // And the Apache Avro library
  const avro = require('avro-js');

  // Creates a client; cache this for further use
  const pubSubClient = new PubSub();

  async function publishAvroRecords() {
    // Get the topic metadata to learn about its schema.
    const topic = pubSubClient.topic(topicName);
    const [topicMetadata] = await topic.getMetadata();
    const topicSchemaMetadata = topicMetadata.schemaSettings;
    const schemaEncoding = topicSchemaMetadata.encoding;

    // Retrieve the definition so we can make an encoder.
    const schema = pubSubClient.schema(schemaMetadata.schema);
    const schemaMetadata = await schema.get();
    const schemaDefinition = schemaMetadata.definition;

    // Make an encoder using the official avro-js library.
    const type = avro.parse(schemaDefinition);

    // Encode the message.
    const province = {
      name: 'Ontario',
      post_abbr: 'ON',
    };
    let dataBuffer;
    switch (schemaEncoding) {
      case Encoding.Binary:
        dataBuffer = type.toBuffer(province);
        break;
      case Encoding.Json:
        dataBuffer = Buffer.from(type.toString(province));
        break;
    }

    const messageId = await topic.publish(dataBuffer);
    console.log(`Avro message ${messageId} published.`);
  }

  publishAvroRecords().catch(console.error);
  // [END pubsub_publish_avro_records]
}

process.on('unhandledRejection', err => {
  console.error(err.message);
  process.exitCode = 1;
});
main(...process.argv.slice(2));
