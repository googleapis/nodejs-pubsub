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
 * This application demonstrates how to perform basic operations on
 * subscriptions with the Google Cloud Pub/Sub API.
 *
 * For more information, see the README.md under /pubsub and the documentation
 * at https://cloud.google.com/pubsub/docs.
 */

// This is a generated sample. Please see typescript/README.md for more info.

'use strict';

// sample-metadata:
//   title: Listen For Large Messages
//   description: Listens for messages from a subscription and writes them to files.
//   usage: node listenForLargeMessages.js <subscription-name> <file-stem> [timeout-in-seconds]

// [START pubsub_subscribe_large_messages]
/**
 * TODO(developer): Uncomment these variables before running the sample.
 */
// const subscriptionName = 'YOUR_SUBSCRIPTION_NAME';
// const fileStem = 'message_';
// const timeout = 60;

// Imports the Google Cloud client library
const {PubSub} = require('@google-cloud/pubsub');

// Node FS library, to write files
const fs = require('fs');
const util = require('util');

// Creates a client; cache this for further use
const pubSubClient = new PubSub();

function listenForLargeMessages(subscriptionName, fileStem, timeout) {
  // References an existing subscription
  const subscription = pubSubClient.subscription(subscriptionName);

  // Use the async API for files.
  const writeFile = util.promisify(fs.writeFile);

  // Create an event handler to handle messages
  let messageCount = 0;
  const messageHandler = async message => {
    // "Ack" (acknowledge receipt of) the message
    message.ack();

    // Make a filename for the next message, and write it out.
    const filename = `${fileStem}${messageCount}.msg`;
    await writeFile(filename, message.data);

    console.log(`Received message ${message.id} -> ${filename}`);
    console.log(`\tData size: ${message.length} bytes`);
    console.log(`\tAttributes: ${JSON.stringify(message.attributes)}`);
    messageCount += 1;
  };

  // Listen for new messages until timeout is hit
  subscription.on('message', messageHandler);

  setTimeout(() => {
    subscription.removeListener('message', messageHandler);
    console.log(`${messageCount} message(s) received.`);
  }, timeout * 1000);
}
// [END pubsub_subscribe_large_messages]

function main(
  subscriptionName = 'YOUR_SUBSCRIPTION_NAME',
  fileStem = 'message_',
  timeout = 60
) {
  timeout = Number(timeout);

  try {
    listenForLargeMessages(subscriptionName, fileStem, timeout);
  } catch (err) {
    console.error(err.message);
    process.exitCode = 1;
  }
}

main(...process.argv.slice(2));
