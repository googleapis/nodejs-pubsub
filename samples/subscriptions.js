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
 * subscriptions with the Google Cloud Pub/Sub API. The individual samples
 * may be run on their own, or you can use this aggregate application.
 *
 * For more information, see the README.md under /pubsub and the documentation
 * at https://cloud.google.com/pubsub/docs.
 */

'use strict';

// Pull in all of the individual samples.
/*
  .example('node $0 pull worker-1')
*/

// Import all of the needed sub-modules that contain the actual examples.
const sampleModules = [
  require('./subscriptions/listSubscriptions'),
  require('./subscriptions/listTopicSubscriptions'),
  require('./subscriptions/createSubscription'),
  require('./subscriptions/createPushSubscription'),
  require('./subscriptions/modifyPushConfig'),
  require('./subscriptions/deleteSubscription'),
  require('./subscriptions/getSubscription'),
  require('./subscriptions/listenForMessages'),
  require('./subscriptions/subscribeWithFlowControlSettings'),
  require('./subscriptions/synchronousPull'),
  require('./subscriptions/listenForErrors'),
  require('./subscriptions/getSubscriptionPolicy'),
  require('./subscriptions/setSubscriptionPolicy'),
  require('./subscriptions/testSubscriptionPermissions'),
];

// We need these two for special handling below. Please ensure that the
// ordering is maintained in the sampleModules array.
const [listSubscriptions, listTopicSubscriptions] = sampleModules;

const cli = require('yargs').demand(1);

// Add the legacy 'list' command that can call either sample.
cli.command(
  'list [topicName]',
  'Lists all subscriptions in the current project, optionally filtering by a topic.',
  {},
  opts => {
    if (opts.topicName) {
      listTopicSubscriptions.main(opts.topicName);
    } else {
      listSubscriptions.main();
    }
  }
);

// Add all of the sample modules.
sampleModules.forEach(m => m.declaration.addToYargs(cli));

// And finish off the command line arg handler.
cli
  .example('node $0 list')
  .example('node $0 list my-topic')
  .wrap(120)
  .recommendCommands()
  .epilogue('For more information, see https://cloud.google.com/pubsub/docs');

if (module === require.main) {
  cli.help().strict().argv; // eslint-disable-line
}
