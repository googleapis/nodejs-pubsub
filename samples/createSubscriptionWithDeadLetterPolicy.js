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
//   title: Create Subscription With Dead Letter Policy
//   description: Creates a new subscription With Dead Letter Policy.
//   usage: node createSubscriptionWithDeadLetterPolicy.js <topic-name-or-id> <subscription-name-or-id> <dead-letter-topic-name-or-id>

function main(
  topicNameOrId = 'YOUR_TOPIC_NAME_OR_ID',
  subscriptionNameOrId = 'YOUR_SUBSCRIPTION_NAME_OR_ID',
  deadLetterTopicNameOrId = 'YOUR_DEAD_LETTER_TOPIC_NAME_OR_ID'
) {
  // [START pubsub_dead_letter_create_subscription]
  /**
   * TODO(developer): Uncomment these variables before running the sample.
   */
  // const topicNameOrId = 'YOUR_TOPIC_NAME_OR_ID';
  // const subscriptionNameOrId = 'YOUR_SUBSCRIPTION_NAME_OR_ID';
  // const deadLetterTopicNameOrId = 'YOUR_DEAD_LETTER_TOPIC_NAME_OR_ID';

  // Imports the Google Cloud client library
  const {PubSub} = require('@google-cloud/pubsub');

  // Creates a client; cache this for further use
  const pubSubClient = new PubSub();

  async function createSubscriptionWithDeadLetterPolicy() {
    // Creates a new subscription
    await pubSubClient
      .topic(topicNameOrId)
      .createSubscription(subscriptionNameOrId, {
        deadLetterPolicy: {
          deadLetterTopic: pubSubClient.topic(deadLetterTopicNameOrId).name,
          maxDeliveryAttempts: 10,
        },
      });
    console.log(
      `Created subscription ${subscriptionNameOrId} with dead letter topic ${deadLetterTopicNameOrId}.`
    );
    console.log(
      'To process dead letter messages, remember to add a subscription to your dead letter topic.'
    );
  }

  createSubscriptionWithDeadLetterPolicy().catch(console.error);
  // [END pubsub_dead_letter_create_subscription]
}

main(...process.argv.slice(2));
