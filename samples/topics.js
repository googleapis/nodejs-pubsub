// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * This application demonstrates how to perform basic operations on topics with
 * the Google Cloud Pub/Sub API. The individual samples may be run on their own,
 * or you can use this aggregate application.
 *
 * For more information, see the README.md under /pubsub and the documentation
 * at https://cloud.google.com/pubsub/docs.
 */

'use strict';

// Import all of the needed sub-modules that contain the actual examples.
const sampleModules = [
  require('./topics/listAllTopics'),
  require('./topics/createTopic'),
  require('./topics/deleteTopic'),
  require('./topics/publishMessage'),
  require('./topics/publishMessageWithCustomAttributes'),
  require('./topics/publishOrderedMessage'),
  require('./topics/publishBatchedMessages'),
  require('./topics/publishWithRetrySettings'),
  require('./topics/getTopicPolicy'),
  require('./topics/setTopicPolicy'),
  require('./topics/testTopicPermissions'),
];

// We need to re-export this for the system tests to find.
module.exports = {
  publishOrderedMessage: require('./topics/publishOrderedMessage')
    .publishOrderedMessage,
};

const cli = require('yargs').demand(1);
sampleModules.forEach(m => m.declaration.addToYargs(cli));

// And finish off the command line arg handler.
cli
  .wrap(120)
  .recommendCommands()
  .epilogue('For more information, see https://cloud.google.com/pubsub/docs');

if (module === require.main) {
  cli.help().strict().argv; // eslint-disable-line
}
