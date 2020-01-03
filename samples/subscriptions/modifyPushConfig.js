// Copyright 2019-2020 Google LLC
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

// Modifies the configuration of an existing push subscription.
function main(
  topicName = 'YOUR_TOPIC_NAME',
  subscriptionName = 'YOUR_SUBSCRIPTION_NAME'
) {
  // [START pubsub_update_push_configuration]
  /**
   * TODO(developer): Uncomment these variables before running the sample.
   */
  // const topicName = 'YOUR_TOPIC_NAME';
  // const subscriptionName = 'YOUR_SUBSCRIPTION_NAME';

  // Imports the Google Cloud client library
  const {PubSub} = require('@google-cloud/pubsub');

  // Creates a client; cache this for further use
  const pubSubClient = new PubSub();

  async function modifyPushConfig() {
    const options = {
      // Set to an HTTPS endpoint of your choice. If necessary, register
      // (authorize) the domain on which the server is hosted.
      pushEndpoint: `https://${pubSubClient.projectId}.appspot.com/push`,
    };

    await pubSubClient
      .topic(topicName)
      .subscription(subscriptionName)
      .modifyPushConfig(options);
    console.log(`Modified push config for subscription ${subscriptionName}.`);
  }

  modifyPushConfig();
  // [END pubsub_update_push_configuration]
}

const {sampleMain} = require('../common');
sampleMain()
  .commandName('modify-config')
  .args('<topicName> <subscriptionName>')
  .help('Modifies the configuration of an existing push subscription.')
  .example('my-topic worker-1')
  .execute(module, opts => main(opts.topicName, opts.subscriptionName));
