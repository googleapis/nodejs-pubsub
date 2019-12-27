// Copyright 2019 Google LLC
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

'use strict';

function main(subscriptionName = 'YOUR_SUBSCRIPTION_NAME', timeout = 1000) {
  // [START pubsub_listen_ordered_messages]
  /**
   * TODO(developer): Uncomment these variables before running the sample.
   */
  // const subscriptionName = 'YOUR_SUBSCRIPTION_NAME';
  // const timeout = 1000;

  // Imports the Google Cloud client library
  const {PubSub} = require('@google-cloud/pubsub');

  // Creates a client; cache this for further use
  const pubSubClient = new PubSub();

  let subscribeCounterValue = 1;

  function getSubscribeCounterValue() {
    return subscribeCounterValue;
  }

  function setSubscribeCounterValue(value) {
    subscribeCounterValue = value;
  }

  const outstandingMessages = {};

  async function listenForOrderedMessages() {
    // References an existing subscription, e.g. "my-subscription"
    const subscription = pubSubClient.subscription(subscriptionName);

    // Create an event handler to handle messages
    const messageHandler = function(message) {
      // Buffer the message in an object (for later ordering)
      outstandingMessages[message.attributes.counterId] = message;

      // "Ack" (acknowledge receipt of) the message
      message.ack();
    };

    // Listen for new messages until timeout is hit
    subscription.on('message', messageHandler);
    await new Promise(r => setTimeout(r, timeout * 1000));
    subscription.removeListener('message', messageHandler);

    // Pub/Sub messages are unordered, so here we manually order messages by
    // their "counterId" attribute which was set when they were published.
    const outstandingIds = Object.keys(outstandingMessages).map(counterId =>
      Number(counterId, 10)
    );
    outstandingIds.sort();

    outstandingIds.forEach(counterId => {
      const counter = getSubscribeCounterValue();
      const message = outstandingMessages[counterId];

      if (counterId < counter) {
        // The message has already been processed
        message.ack();
        delete outstandingMessages[counterId];
      } else if (counterId === counter) {
        // Process the message
        console.log(
          '* %d %j %j',
          message.id,
          message.data.toString(),
          message.attributes
        );
        setSubscribeCounterValue(counterId + 1);
        message.ack();
        delete outstandingMessages[counterId];
      } else {
        // Have not yet processed the message on which this message is dependent
        return false;
      }
    });
  }

  listenForOrderedMessages();
  // [END pubsub_listen_ordered_messages]
}

// This needs to be exported directly so that the system tests can find it.
module.exports = {
  listenForOrderedMessages: main,
};

const {sampleMain} = require('../common');
sampleMain()
  .commandName('listen-ordered')
  .args('<subscriptionName>', {
    timeout: {
      alias: 't',
      type: 'number',
      default: 10,
    },
  })
  .help('Listens to messages for a subscription with ordering metadata.')
  .example('my-subscription')
  .execute(module, opts => main(opts.subscriptionName, opts.timeout));
