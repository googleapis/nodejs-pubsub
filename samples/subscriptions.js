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

// Pull in all of the individual samples.
const {
  listTopicSubscriptions,
} = require('./subscriptions/listTopicSubscriptions');
const {listSubscriptions} = require('./subscriptions/listSubscriptions');
const {createSubscription} = require('./subscriptions/createSubscription');
const {
  createPushSubscription,
} = require('./subscriptions/createPushSubscription');
const {modifyPushConfig} = require('./subscriptions/modifyPushConfig');
const {deleteSubscription} = require('./subscriptions/deleteSubscription');
const {getSubscription} = require('./subscriptions/getSubscription');
const {listenForMessages} = require('./subscriptions/listenForMessages');
const {
  subscribeWithFlowControlSettings,
} = require('./subscriptions/subscribeWithFlowControlSettings');
const {synchronousPull} = require('./subscriptions/synchronousPull');
const {listenForErrors} = require('./subscriptions/listenForErrors');
const {
  getSubscriptionPolicy,
} = require('./subscriptions/getSubscriptionPolicy');
const {
  setSubscriptionPolicy,
} = require('./subscriptions/setSubscriptionPolicy');
const {
  testSubscriptionPermissions,
} = require('./subscriptions/testSubscriptionPermissions');

const cli = require('yargs')
  .demand(1)
  .command(
    'list [topicName]',
    'Lists all subscriptions in the current project, optionally filtering by a topic.',
    {},
    opts => {
      if (opts.topicName) {
        listTopicSubscriptions(opts.topicName);
      } else {
        listSubscriptions();
      }
    }
  )
  .command(
    'create <topicName> <subscriptionName>',
    'Creates a new subscription.',
    {},
    opts => createSubscription(opts.topicName, opts.subscriptionName)
  )
  .command(
    'create-push <topicName> <subscriptionName>',
    'Creates a new push subscription.',
    {},
    opts => createPushSubscription(opts.topicName, opts.subscriptionName)
  )
  .command(
    'modify-config <topicName> <subscriptionName>',
    'Modifies the configuration of an existing push subscription.',
    {},
    opts => modifyPushConfig(opts.topicName, opts.subscriptionName)
  )
  .command('delete <subscriptionName>', 'Deletes a subscription.', {}, opts =>
    deleteSubscription(opts.subscriptionName)
  )
  .command(
    'get <subscriptionName>',
    'Gets the metadata for a subscription.',
    {},
    opts => getSubscription(opts.subscriptionName)
  )
  .command(
    'listen-messages <subscriptionName>',
    'Listens to messages for a subscription.',
    {
      timeout: {
        alias: 't',
        type: 'number',
        default: 10,
      },
    },
    opts => listenForMessages(opts.subscriptionName, opts.timeout)
  )
  .command(
    'listen-flow-control <subscriptionName>',
    'Listen to messages with flow control settings, which are properties of the client/listener instance.',
    {
      maxInProgress: {
        alias: 'm',
        type: 'number',
        default: 1,
      },
      timeout: {
        alias: 't',
        type: 'number',
        default: 10,
      },
    },
    opts =>
      subscribeWithFlowControlSettings(
        opts.subscriptionName,
        opts.maxInProgress,
        opts.timeout
      )
  )
  .command(
    'sync-pull <projectName> <subscriptionName>',
    'Receive messages synchronously.',
    {},
    opts => synchronousPull(opts.projectName, opts.subscriptionName)
  )
  .command(
    'listen-errors <subscriptionName>',
    'Listens to messages and errors for a subscription.',
    {
      timeout: {
        alias: 't',
        type: 'number',
        default: 10,
      },
    },
    opts => listenForErrors(opts.subscriptionName, opts.timeout)
  )
  .command(
    'get-policy <subscriptionName>',
    'Gets the IAM policy for a subscription.',
    {},
    opts => getSubscriptionPolicy(opts.subscriptionName)
  )
  .command(
    'set-policy <subscriptionName>',
    'Sets the IAM policy for a subscription.',
    {},
    opts => setSubscriptionPolicy(opts.subscriptionName)
  )
  .command(
    'test-permissions <subscriptionName>',
    'Tests the permissions for a subscription.',
    {},
    opts => testSubscriptionPermissions(opts.subscriptionName)
  )
  .example('node $0 list')
  .example('node $0 list my-topic')
  .example('node $0 create my-topic worker-1')
  .example('node $0 create-push my-topic worker-1')
  .example('node $0 modify-config my-topic worker-1')
  .example('node $0 get worker-1')
  .example('node $0 listen-messages my-subscription')
  .example('node $0 sync-pull my-project my-subscription')
  .example('node $0 listen-errors my-subscription')
  .example('node $0 listen-flow-control my-subscription -m 5')
  .example('node $0 delete worker-1')
  .example('node $0 pull worker-1')
  .example('node $0 get-policy worker-1')
  .example('node $0 set-policy worker-1')
  .example('node $0 test-permissions worker-1')
  .wrap(120)
  .recommendCommands()
  .epilogue('For more information, see https://cloud.google.com/pubsub/docs');

if (module === require.main) {
  cli.help().strict().argv; // eslint-disable-line
}
