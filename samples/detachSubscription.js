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
 * This sample demonstrates how to detach subscriptions with the
 * Google Cloud Pub/Sub API.
 *
 * For more information, see the README.md under /pubsub and the documentation
 * at https://cloud.google.com/pubsub/docs.
 */

'use strict';

// sample-metadata:
//   title: Detach Subscription
//   description: Detaches a subscription from a topic.
//   usage: node detachSubscription.js <subscription-name>

function main(subscriptionName = 'YOUR_SUBSCRIPTION_NAME') {
  // [START pubsub_detach_subscription]
  /**
   * TODO(developer): Uncomment these variables before running the sample.
   */
  // const subscriptionName = 'YOUR_SUBSCRIPTION_NAME';

  // Imports the Google Cloud client library
  const {PubSub} = require('@google-cloud/pubsub');

  // Creates a client; cache this for further use
  const pubSubClient = new PubSub();

  async function detachSubscription() {
    // Gets the status of the existing subscription
    const sub = pubSubClient.subscription(subscriptionName);
    const metadata = await sub.getMetadata()[1];
    console.log(
      `Subscription ${subscriptionName} detached status: ${metadata.detached}`
    );

    await sub.detach();
    console.log(`Subscription ${subscriptionName} detached.`);

    const updatedMetadata = await sub.getMetadata()[1];
    console.log(
      `Subscription ${subscriptionName} detached status: ${updatedMetadata.detached}`
    );
  }

  detachSubscription().catch(console.error);
  // [END pubsub_detach_subscription]
}

main(...process.argv.slice(2));