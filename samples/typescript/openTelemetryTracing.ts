// Copyright 2020-2023 Google LLC
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
import {SimpleSpanProcessor} from '@opentelemetry/sdk-trace-base';

// To output to the console for testing, use the ConsoleSpanExporter.
import {ConsoleSpanExporter} from '@opentelemetry/sdk-trace-base';

// To output to Cloud Trace, import the OpenTelemetry bridge library.
// import {TraceExporter} from '@google-cloud/opentelemetry-cloud-trace-exporter';

import {Resource} from '@opentelemetry/resources';
import {SemanticResourceAttributes} from '@opentelemetry/semantic-conventions';

// Enable the diagnostic logger for OpenTelemetry
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

// Log spans out to the console, for testing.
const exporter = new ConsoleSpanExporter();

// Log spans out to Cloud Trace, for production.
// const exporter = new TraceExporter();

// Build a tracer provider and a span processor to do
// something with the spans we're generating.
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
  // Publishes the message as a string, e.g. "Hello, world!"
  // or JSON.stringify(someObject)
  const dataBuffer = Buffer.from(data);
  const publisher = pubSubClient.topic(topicNameOrId);
  const messageId = await publisher.publishMessage({data: dataBuffer});
  console.log(`Message ${messageId} published.`);
}

async function subscriptionListen(subscriptionNameOrId: string) {
  const subscriber = pubSubClient.subscription(subscriptionNameOrId);

  // Message handler for subscriber
  const messageHandler = async (message: Message) => {
    console.log(`Message ${message.id} received.`);
    message.ack();

    // Ensure that all spans got flushed by the exporter
    console.log('Cleaning up OpenTelemetry exporter...');
    await processor.forceFlush();
    await subscriber.close();
  };

  const errorHandler = async (error: Error) => {
    console.log('Received error:', error);

    console.log('Cleaning up OpenTelemetry exporter...');
    await processor.forceFlush();
    await subscriber.close();
  };

  // Listens for new messages from the topic
  subscriber.on('message', messageHandler);
  subscriber.on('error', errorHandler);

  // Wait a bit for the subscription to receive messages.
  // For the sample only.
  setTimeout(() => {
    subscriber.removeAllListeners();
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
