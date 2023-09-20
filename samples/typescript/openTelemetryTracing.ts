// Copyright 2020-2022 Google LLC
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
 * This sample demonstrates how to add OpenTelemetry tracing to the
 * Google Cloud Pub/Sub API.
 *
 * For more information, see the README.md under /pubsub and the documentation
 * at https://cloud.google.com/pubsub/docs.
 */

// sample-metadata:
//   title: OpenTelemetry Tracing
//   description: Demonstrates how to enable OpenTelemetry tracing in
//     a publisher or subscriber.
//   usage: node openTelemetryTracing.js <topic-name-or-id> <subscription-name-or-id>

const SUBSCRIBER_TIMEOUT = 10;

// [START opentelemetry_tracing]
/**
 * TODO(developer): Uncomment these variables before running the sample.
 */
// const topicNameOrId = 'YOUR_TOPIC_OR_ID';
// const subscriptionNameOrId = 'YOUR_SUBSCRIPTION_OR_ID';
// const data = 'Hello, world!";

// Imports the Google Cloud client library
import {Message, PubSub} from '@google-cloud/pubsub';

// Imports the OpenTelemetry API
import * as otel from '@opentelemetry/sdk-trace-node';
import {diag, DiagConsoleLogger, DiagLogLevel} from '@opentelemetry/api';
const {NodeTracerProvider} = otel;
import {
  SimpleSpanProcessor,
  ConsoleSpanExporter,
} from '@opentelemetry/sdk-trace-base';

import {Resource} from '@opentelemetry/resources';
import {SemanticResourceAttributes} from '@opentelemetry/semantic-conventions';

// Enable the diagnostic logger for OpenTelemetry
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

const exporter = new ConsoleSpanExporter();

const provider = new NodeTracerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'otel example',
  }),
});
const processor = new SimpleSpanProcessor(exporter);
provider.addSpanProcessor(processor);
provider.register();

// Creates a client; cache this for further use.
const pubSubClient = new PubSub();

async function publishMessage(topicNameOrId: string, data: string) {
  // Publishes the message as a string, e.g. "Hello, world!" or JSON.stringify(someObject)
  const dataBuffer = Buffer.from(data);
  const messageId = await pubSubClient
    .topic(topicNameOrId)
    .publishMessage({data: dataBuffer});
  console.log(`Message ${messageId} published.`);
}

async function subscriptionListen(subscriptionNameOrId: string) {
  // Message handler for subscriber
  const messageHandler = (message: Message) => {
    console.log(`Message ${message.id} received.`);
    message.ack();

    // Ensure that all spans got flushed by the exporter
    console.log('Cleaning up OpenTelemetry exporter...');
    exporter.shutdown().then(() => {
      // Cleaned up exporter.
      process.exit(0);
    });
  };

  const errorHandler = (error: Error) => {
    console.log('Received error:', error);

    console.log('Cleaning up OpenTelemetry exporter...');
    exporter.shutdown().then(() => {
      // Cleaned up exporter.
      process.exit(0);
    });
  };

  // Listens for new messages from the topic
  pubSubClient.subscription(subscriptionNameOrId).on('message', messageHandler);
  pubSubClient.subscription(subscriptionNameOrId).on('error', errorHandler);

  // Wait a bit for the subscription. For the sample only.
  setTimeout(() => {
    pubSubClient.subscription(subscriptionNameOrId).removeAllListeners();
  }, SUBSCRIBER_TIMEOUT * 1000);
}
// [END opentelemetry_tracing]

function main(
  topicNameOrId = 'YOUR_TOPIC_NAME_OR_ID',
  subscriptionNameOrId = 'YOUR_SUBSCRIPTION_NAME_OR_ID',
  data = 'Hello, world!'
) {
  publishMessage(topicNameOrId, data)
    .then(() => subscriptionListen(subscriptionNameOrId))
    .catch(err => {
      console.error(err.message);
      process.exitCode = 1;
    });
}

main(...process.argv.slice(2));
