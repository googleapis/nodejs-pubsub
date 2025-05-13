// Copyright 2025 Google LLC
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

// This is a generated sample, using the typeless sample bot. Please
// look for the source TypeScript sample (.ts) for modifications.
'use strict';

/**
 * This sample demonstrates how to use the `timeout` option when closing a Pub/Sub
 * subscription using the Node.js client library. The timeout allows for graceful
 * shutdown, attempting to nack any buffered messages before closing.
 *
 * For more information, see the README.md under /pubsub and the documentation
 * at https://cloud.google.com/pubsub/docs.
 */

// sample-metadata:
//   title: Close Subscription with Timeout
//   description: Demonstrates closing a subscription with a specified timeout for graceful shutdown.
//   usage: node closeSubscriptionWithTimeout.js <topic-name> <subscription-name>

// This sample is currently speculative.
// -START pubsub_close_subscription_with_timeout]

// Imports the Google Cloud client library
const {PubSub, Duration} = require('@google-cloud/pubsub');

// Creates a client; cache this for further use
const pubsub = new PubSub();

async function closeSubscriptionWithTimeout(
  topicNameOrId,
  subscriptionNameOrId,
) {
  const topic = pubsub.topic(topicNameOrId);

  const timeout = Duration.from({seconds: 10});
  const zeroTimeout = Duration.from({seconds: 0});

  // Closes the subscription immediately, not waiting for anything.
  let subscription = topic.subscription(subscriptionNameOrId);
  await subscription.close({timeout: zeroTimeout});

  // Shuts down the gRPC connection, sends nacks for buffered messages,
  // and closes the subscription after a set timeout.
  subscription = topic.subscription(subscriptionNameOrId);
  await subscription.close({timeout});
}
// -END pubsub_close_subscription_with_timeout]

// Presumes topic and subscription have been created prior to running the sample.
// If you uncomment the cleanup code above, the sample will delete them afterwards.
function main(
  topicNameOrId = 'YOUR_TOPIC_NAME_OR_ID',
  subscriptionNameOrId = 'YOUR_SUBSCRIPTION_NAME_OR_ID',
) {
  closeSubscriptionWithTimeout(topicNameOrId, subscriptionNameOrId).catch(
    err => {
      console.error(err.message);
      process.exitCode = 1;
    },
  );
}

main(...process.argv.slice(2));
