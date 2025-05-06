// Copyright 2024 Google LLC
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

'use strict';

/**
 * This sample demonstrates how to use the `timeout` option when closing a Pub/Sub
 * subscription using the Node.js client library. The timeout allows for graceful
 * shutdown, attempting to nack any buffered messages before closing.
 */

// sample-metadata:
//   title: Close Subscription with Timeout
//   description: Demonstrates closing a subscription with a specified timeout for graceful shutdown.
//   usage: node closeSubscriptionWithTimeout.js <topic-name> <subscription-name>

// [START pubsub_close_subscription_with_timeout]
async function main(
  topicName = 'your-topic', // Name of the topic to use
  subscriptionName = 'your-subscription' // Name of the subscription to use
) {
  // Imports the Google Cloud client library
  const {PubSub, Duration} = require('@google-cloud/pubsub');

  // Creates a client; cache this for further use
  const pubsub = new PubSub();

  // References an existing topic
  const topic = pubsub.topic(topicName);

  // References an existing subscription, creating it if necessary
  const [subscription] = await topic.subscription(subscriptionName).get({
    autoCreate: true, // Auto-create subscription if it doesn't exist
  });
  console.log(`Using subscription: ${subscription.name}`);

  let messageCount = 0;
  const messagesToProcess = 10; // Number of messages to receive before demonstrating close
  const messagesToAck = 5; // Number of messages to explicitly ack

  // Helper function to simulate processing
  const simulateProcessing = (message: any) => {
    console.log(
      `[${new Date().toISOString()}] Received message #${
        message.id
      }, Attributes: ${JSON.stringify(message.attributes)}`
    );
    messageCount++;

    // Simulate asynchronous work with a timeout
    const processingTime = Math.random() * 500; // 0-500ms delay
    return new Promise<void>(resolve => {
      setTimeout(() => {
        console.log(
          `[${new Date().toISOString()}] Finished processing message #${
            message.id
          }`
        );
        resolve();
      }, processingTime);
    });
  };

  // --- Demonstrate close with zero timeout ---
  console.log('\n--- Demonstrating close() with Zero Timeout ---');
  let receivedForZeroTimeout = 0;
  const zeroTimeoutClosePromise = new Promise<void>(resolve => {
    const messageHandler = async (message: any) => {
      receivedForZeroTimeout++;
      await simulateProcessing(message);

      // Ack only the first few messages
      if (receivedForZeroTimeout <= messagesToAck) {
        console.log(
          `[${new Date().toISOString()}] Acking message #${message.id}`
        );
        message.ack();
      } else {
        console.log(
          `[${new Date().toISOString()}] Not acking message #${
            message.id
          } (will be buffered)`
        );
        // Don't ack - these will be buffered by the client library
      }

      // Check if we've received enough messages to trigger the close
      if (receivedForZeroTimeout >= messagesToProcess) {
        // Remove the handler to stop receiving new messages
        subscription.removeListener('message', messageHandler);
        console.log(
          `\n[${new Date().toISOString()}] Received ${messagesToProcess} messages. Closing subscription with zero timeout...`
        );
        // Close with a zero timeout. This should be fast but won't nack buffered messages.
        await subscription.close({timeout: Duration.from({seconds: 0})});
        console.log(
          `[${new Date().toISOString()}] Subscription closed with zero timeout.`
        );
        resolve(); // Resolve the promise for this section
      }
    };

    // Attach the message handler
    subscription.on('message', messageHandler);
    console.log(
      'Listening for messages to demonstrate zero-timeout close...'
    );
  });

  await zeroTimeoutClosePromise;

  // --- Demonstrate close with non-zero timeout ---
  console.log('\n--- Demonstrating close() with Non-Zero Timeout ---');

  // Re-open the subscription implicitly by adding a new listener
  // Note: In a real application, you might need more robust logic
  // if the subscription was deleted or if errors occurred during close.
  console.log('Re-attaching listener to receive more messages...');
  messageCount = 0; // Reset message count for the next phase
  let receivedForNonZeroTimeout = 0;

  const nonZeroTimeoutClosePromise = new Promise<void>(resolve => {
    const messageHandler = async (message: any) => {
      receivedForNonZeroTimeout++;
      await simulateProcessing(message);

      // Ack only the first few messages again
      if (receivedForNonZeroTimeout <= messagesToAck) {
        console.log(
          `[${new Date().toISOString()}] Acking message #${message.id}`
        );
        message.ack();
      } else {
        console.log(
          `[${new Date().toISOString()}] Not acking message #${
            message.id
          } (will be buffered)`
        );
        // Don't ack
      }

      // Check if we've received enough messages for this part
      if (receivedForNonZeroTimeout >= messagesToProcess) {
        subscription.removeListener('message', messageHandler);
        console.log(
          `\n[${new Date().toISOString()}] Received ${messagesToProcess} more messages. Closing subscription with 5s timeout...`
        );
        // Close with a non-zero timeout. This attempts to nack buffered messages
        // and waits up to 5 seconds for pending acks/nacks.
        await subscription.close({timeout: Duration.from({seconds: 5})});
        console.log(
          `[${new Date().toISOString()}] Subscription closed with 5s timeout.`
        );
        resolve();
      }
    };

    subscription.on('message', messageHandler);
    console.log(
      'Listening for messages to demonstrate non-zero-timeout close...'
    );
  });

  await nonZeroTimeoutClosePromise;

  console.log('\nSample finished.');

  // Optional: Clean up resources
  // console.log('Deleting subscription...');
  // await subscription.delete();
  // console.log('Deleting topic...');
  // await topic.delete();
}
// [END pubsub_close_subscription_with_timeout]

process.on('unhandledRejection', err => {
  console.error(err.message);
  process.exitCode = 1;
});

// Presumes topic and subscription have been created prior to running the sample.
// If you uncomment the cleanup code above, the sample will delete them afterwards.
main(...process.argv.slice(2)).catch(err => {
  console.error(err.message);
  process.exitCode = 1;
});
