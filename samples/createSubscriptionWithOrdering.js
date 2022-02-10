// Copyright 2020 Google LLC
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

// sample-metadata:
//   title: Create Subscription with ordering enabled
//   description: Creates a new subscription with ordering enabled.
//   usage: node createSubscriptionWithOrdering.js <topic-name-or-id> <subscription-name-or-id>

function main(
  topicNameOrId = 'YOUR_TOPIC_NAME_OR_ID',
  subscriptionNameOrId = 'YOUR_SUBSCRIPTION_NAME_OR_ID'
) {
  // [START pubsub_enable_subscription_ordering]
  /**
   * TODO(developer): Uncomment these variables before running the sample.
   */
  // const topicNameOrId = 'YOUR_TOPIC_NAME_OR_ID';
  // const subscriptionNameOrId = 'YOUR_SUBSCRIPTION_NAME_OR_ID';

  // Imports the Google Cloud client library
  const {PubSub} = require('@google-cloud/pubsub');

  // Creates a client; cache this for further use
  const pubSubClient = new PubSub();

  async function createSubscriptionWithOrdering() {
    // Creates a new subscription
    await pubSubClient
      .topic(topicNameOrId)
      .createSubscription(subscriptionNameOrId, {
        enableMessageOrdering: true,
      });
    console.log(
      `Created subscription ${subscriptionNameOrId} with ordering enabled.`
    );
    console.log(
      'To process messages in order, remember to add an ordering key to your messages.'
    );
  }

  createSubscriptionWithOrdering().catch(console.error);
  // [END pubsub_enable_subscription_ordering]
}

process.on('unhandledRejection', err => {
  console.error(err.message);
  process.exitCode = 1;
});
main(...process.argv.slice(2));
