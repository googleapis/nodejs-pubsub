// Copyright 2021 Google LLC
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
 * schemas with the Google Cloud Pub/Sub API.
 *
 * For more information, see the README.md under /pubsub and the documentation
 * at https://cloud.google.com/pubsub/docs.
 */

// This is a generated sample. Please see typescript/README.md for more info.

'use strict';

// sample-metadata:
//   title: Delete a previously created schema
//   description: Deletes a schema which was previously created in the project.
//   usage: node deleteSchema.js <schema-name>

// [START pubsub_delete_schema]
/**
 * TODO(developer): Uncomment this variable before running the sample.
 */
// const schemaName = 'YOUR_SCHEMA_NAME';

// Imports the Google Cloud client library
const {PubSub} = require('@google-cloud/pubsub');

// Creates a client; cache this for further use
const pubSubClient = new PubSub();

async function deleteSchema(schemaName) {
  const schema = pubSubClient.schema(schemaName);
  const name = await schema.getName();
  await schema.delete();
  console.log(`Schema ${name} deleted.`);
}
// [END pubsub_delete_schema]

function main(schemaName = 'YOUR_SCHEMA_NAME') {
  deleteSchema(schemaName).catch(err => {
    console.error(err.message);
    process.exitCode = 1;
  });
}

main(...process.argv.slice(2));
