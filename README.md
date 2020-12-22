[//]: # "This README.md file is auto-generated, all changes to this file will be lost."
[//]: # "To regenerate it, use `python -m synthtool`."
<img src="https://avatars2.githubusercontent.com/u/2810941?v=3&s=96" alt="Google Cloud Platform logo" title="Google Cloud Platform" align="right" height="96" width="96"/>

# [Google Cloud Pub/Sub: Node.js Client](https://github.com/googleapis/nodejs-pubsub)

[![release level](https://img.shields.io/badge/release%20level-general%20availability%20%28GA%29-brightgreen.svg?style=flat)](https://cloud.google.com/terms/launch-stages)
[![npm version](https://img.shields.io/npm/v/@google-cloud/pubsub.svg)](https://www.npmjs.org/package/@google-cloud/pubsub)
[![codecov](https://img.shields.io/codecov/c/github/googleapis/nodejs-pubsub/master.svg?style=flat)](https://codecov.io/gh/googleapis/nodejs-pubsub)




[Cloud Pub/Sub](https://cloud.google.com/pubsub/docs) is a fully-managed real-time messaging service that allows
you to send and receive messages between independent applications.

This document contains links to an [API reference](https://googleapis.dev/nodejs/pubsub/latest/index.html#reference), samples,
and other resources useful to developing Node.js applications.
For additional help developing Pub/Sub applications, in Node.js and other languages, see our
[Pub/Sub quickstart](https://cloud.google.com/pubsub/docs/quickstart-client-libraries),
[publisher](https://cloud.google.com/pubsub/docs/publisher), and [subscriber](https://cloud.google.com/pubsub/docs/subscriber)
guides.


A comprehensive list of changes in each version may be found in
[the CHANGELOG](https://github.com/googleapis/nodejs-pubsub/blob/master/CHANGELOG.md).

* [Google Cloud Pub/Sub Node.js Client API Reference][client-docs]
* [Google Cloud Pub/Sub Documentation][product-docs]
* [github.com/googleapis/nodejs-pubsub](https://github.com/googleapis/nodejs-pubsub)

Read more about the client libraries for Cloud APIs, including the older
Google APIs Client Libraries, in [Client Libraries Explained][explained].

[explained]: https://cloud.google.com/apis/docs/client-libraries-explained

**Table of contents:**


* [Quickstart](#quickstart)
  * [Before you begin](#before-you-begin)
  * [Installing the client library](#installing-the-client-library)
  * [Using the client library](#using-the-client-library)
* [Samples](#samples)
* [Versioning](#versioning)
* [Contributing](#contributing)
* [License](#license)

## Quickstart

### Before you begin

1.  [Select or create a Cloud Platform project][projects].
1.  [Enable billing for your project][billing].
1.  [Enable the Google Cloud Pub/Sub API][enable_api].
1.  [Set up authentication with a service account][auth] so you can access the
    API from your local workstation.

### Installing the client library

```bash
npm install @google-cloud/pubsub
```


### Using the client library

```javascript
// Imports the Google Cloud client library
const {PubSub} = require('@google-cloud/pubsub');

async function quickstart(
  projectId = 'your-project-id', // Your Google Cloud Platform project ID
  topicName = 'my-topic', // Name for the new topic to create
  subscriptionName = 'my-sub' // Name for the new subscription to create
) {
  // Instantiates a client
  const pubsub = new PubSub({projectId});

  // Creates a new topic
  const [topic] = await pubsub.createTopic(topicName);
  console.log(`Topic ${topic.name} created.`);

  // Creates a subscription on that new topic
  const [subscription] = await topic.createSubscription(subscriptionName);

  // Receive callbacks for new messages on the subscription
  subscription.on('message', message => {
    console.log('Received message:', message.data.toString());
    process.exit(0);
  });

  // Receive callbacks for errors on the subscription
  subscription.on('error', error => {
    console.error('Received error:', error);
    process.exit(1);
  });

  // Send a message to the topic
  topic.publish(Buffer.from('Test message!'));
}

```
## Running gRPC C++ bindings

For some workflows and environments it might make sense to use the C++ gRPC implementation,
instead of the default one (see: [#770](https://github.com/googleapis/nodejs-pubsub/issues/770)):

To configure `@google-cloud/pubsub` to use an alternative `grpc` transport:

1. `npm install grpc`, adding `grpc` as a dependency.
1. instantiate `@google-cloud/pubsub` with `grpc`:

   ```js
   const {PubSub} = require('@google-cloud/pubsub');
   const grpc = require('grpc');
   const pubsub = new PubSub({grpc});
   ```


## Samples

Samples are in the [`samples/`](https://github.com/googleapis/nodejs-pubsub/tree/master/samples) directory. Each sample's `README.md` has instructions for running its sample.

| Sample                      | Source Code                       | Try it |
| --------------------------- | --------------------------------- | ------ |
| Create Push Subscription | [source code](https://github.com/googleapis/nodejs-pubsub/blob/master/samples/createPushSubscription.js) | [![Open in Cloud Shell][shell_img]](https://console.cloud.google.com/cloudshell/open?git_repo=https://github.com/googleapis/nodejs-pubsub&page=editor&open_in_editor=samples/createPushSubscription.js,samples/README.md) |
| Create Subscription | [source code](https://github.com/googleapis/nodejs-pubsub/blob/master/samples/createSubscription.js) | [![Open in Cloud Shell][shell_img]](https://console.cloud.google.com/cloudshell/open?git_repo=https://github.com/googleapis/nodejs-pubsub&page=editor&open_in_editor=samples/createSubscription.js,samples/README.md) |
| Create Subscription With Dead Letter Policy | [source code](https://github.com/googleapis/nodejs-pubsub/blob/master/samples/createSubscriptionWithDeadLetterPolicy.js) | [![Open in Cloud Shell][shell_img]](https://console.cloud.google.com/cloudshell/open?git_repo=https://github.com/googleapis/nodejs-pubsub&page=editor&open_in_editor=samples/createSubscriptionWithDeadLetterPolicy.js,samples/README.md) |
| Create Subscription with ordering enabled | [source code](https://github.com/googleapis/nodejs-pubsub/blob/master/samples/createSubscriptionWithOrdering.js) | [![Open in Cloud Shell][shell_img]](https://console.cloud.google.com/cloudshell/open?git_repo=https://github.com/googleapis/nodejs-pubsub&page=editor&open_in_editor=samples/createSubscriptionWithOrdering.js,samples/README.md) |
| Create Topic | [source code](https://github.com/googleapis/nodejs-pubsub/blob/master/samples/createTopic.js) | [![Open in Cloud Shell][shell_img]](https://console.cloud.google.com/cloudshell/open?git_repo=https://github.com/googleapis/nodejs-pubsub&page=editor&open_in_editor=samples/createTopic.js,samples/README.md) |
| Delete Subscription | [source code](https://github.com/googleapis/nodejs-pubsub/blob/master/samples/deleteSubscription.js) | [![Open in Cloud Shell][shell_img]](https://console.cloud.google.com/cloudshell/open?git_repo=https://github.com/googleapis/nodejs-pubsub&page=editor&open_in_editor=samples/deleteSubscription.js,samples/README.md) |
| Delete Topic | [source code](https://github.com/googleapis/nodejs-pubsub/blob/master/samples/deleteTopic.js) | [![Open in Cloud Shell][shell_img]](https://console.cloud.google.com/cloudshell/open?git_repo=https://github.com/googleapis/nodejs-pubsub&page=editor&open_in_editor=samples/deleteTopic.js,samples/README.md) |
| Detach Subscription | [source code](https://github.com/googleapis/nodejs-pubsub/blob/master/samples/detachSubscription.js) | [![Open in Cloud Shell][shell_img]](https://console.cloud.google.com/cloudshell/open?git_repo=https://github.com/googleapis/nodejs-pubsub&page=editor&open_in_editor=samples/detachSubscription.js,samples/README.md) |
| Get Subscription | [source code](https://github.com/googleapis/nodejs-pubsub/blob/master/samples/getSubscription.js) | [![Open in Cloud Shell][shell_img]](https://console.cloud.google.com/cloudshell/open?git_repo=https://github.com/googleapis/nodejs-pubsub&page=editor&open_in_editor=samples/getSubscription.js,samples/README.md) |
| Get Subscription Policy | [source code](https://github.com/googleapis/nodejs-pubsub/blob/master/samples/getSubscriptionPolicy.js) | [![Open in Cloud Shell][shell_img]](https://console.cloud.google.com/cloudshell/open?git_repo=https://github.com/googleapis/nodejs-pubsub&page=editor&open_in_editor=samples/getSubscriptionPolicy.js,samples/README.md) |
| Get Topic Policy | [source code](https://github.com/googleapis/nodejs-pubsub/blob/master/samples/getTopicPolicy.js) | [![Open in Cloud Shell][shell_img]](https://console.cloud.google.com/cloudshell/open?git_repo=https://github.com/googleapis/nodejs-pubsub&page=editor&open_in_editor=samples/getTopicPolicy.js,samples/README.md) |
| List All Topics | [source code](https://github.com/googleapis/nodejs-pubsub/blob/master/samples/listAllTopics.js) | [![Open in Cloud Shell][shell_img]](https://console.cloud.google.com/cloudshell/open?git_repo=https://github.com/googleapis/nodejs-pubsub&page=editor&open_in_editor=samples/listAllTopics.js,samples/README.md) |
| List Subscriptions | [source code](https://github.com/googleapis/nodejs-pubsub/blob/master/samples/listSubscriptions.js) | [![Open in Cloud Shell][shell_img]](https://console.cloud.google.com/cloudshell/open?git_repo=https://github.com/googleapis/nodejs-pubsub&page=editor&open_in_editor=samples/listSubscriptions.js,samples/README.md) |
| List Subscriptions On a Topic | [source code](https://github.com/googleapis/nodejs-pubsub/blob/master/samples/listTopicSubscriptions.js) | [![Open in Cloud Shell][shell_img]](https://console.cloud.google.com/cloudshell/open?git_repo=https://github.com/googleapis/nodejs-pubsub&page=editor&open_in_editor=samples/listTopicSubscriptions.js,samples/README.md) |
| Listen For Errors | [source code](https://github.com/googleapis/nodejs-pubsub/blob/master/samples/listenForErrors.js) | [![Open in Cloud Shell][shell_img]](https://console.cloud.google.com/cloudshell/open?git_repo=https://github.com/googleapis/nodejs-pubsub&page=editor&open_in_editor=samples/listenForErrors.js,samples/README.md) |
| Listen For Messages | [source code](https://github.com/googleapis/nodejs-pubsub/blob/master/samples/listenForMessages.js) | [![Open in Cloud Shell][shell_img]](https://console.cloud.google.com/cloudshell/open?git_repo=https://github.com/googleapis/nodejs-pubsub&page=editor&open_in_editor=samples/listenForMessages.js,samples/README.md) |
| Listen For Messages With Custom Attributes | [source code](https://github.com/googleapis/nodejs-pubsub/blob/master/samples/listenWithCustomAttributes.js) | [![Open in Cloud Shell][shell_img]](https://console.cloud.google.com/cloudshell/open?git_repo=https://github.com/googleapis/nodejs-pubsub&page=editor&open_in_editor=samples/listenWithCustomAttributes.js,samples/README.md) |
| Modify Push Configuration | [source code](https://github.com/googleapis/nodejs-pubsub/blob/master/samples/modifyPushConfig.js) | [![Open in Cloud Shell][shell_img]](https://console.cloud.google.com/cloudshell/open?git_repo=https://github.com/googleapis/nodejs-pubsub&page=editor&open_in_editor=samples/modifyPushConfig.js,samples/README.md) |
| OpenTelemetry Tracing | [source code](https://github.com/googleapis/nodejs-pubsub/blob/master/samples/opentelemetryTracing.js) | [![Open in Cloud Shell][shell_img]](https://console.cloud.google.com/cloudshell/open?git_repo=https://github.com/googleapis/nodejs-pubsub&page=editor&open_in_editor=samples/opentelemetryTracing.js,samples/README.md) |
| Publish Batched Messages | [source code](https://github.com/googleapis/nodejs-pubsub/blob/master/samples/publishBatchedMessages.js) | [![Open in Cloud Shell][shell_img]](https://console.cloud.google.com/cloudshell/open?git_repo=https://github.com/googleapis/nodejs-pubsub&page=editor&open_in_editor=samples/publishBatchedMessages.js,samples/README.md) |
| Publish Message | [source code](https://github.com/googleapis/nodejs-pubsub/blob/master/samples/publishMessage.js) | [![Open in Cloud Shell][shell_img]](https://console.cloud.google.com/cloudshell/open?git_repo=https://github.com/googleapis/nodejs-pubsub&page=editor&open_in_editor=samples/publishMessage.js,samples/README.md) |
| Publish Message With Custom Attributes | [source code](https://github.com/googleapis/nodejs-pubsub/blob/master/samples/publishMessageWithCustomAttributes.js) | [![Open in Cloud Shell][shell_img]](https://console.cloud.google.com/cloudshell/open?git_repo=https://github.com/googleapis/nodejs-pubsub&page=editor&open_in_editor=samples/publishMessageWithCustomAttributes.js,samples/README.md) |
| Publish Ordered Message | [source code](https://github.com/googleapis/nodejs-pubsub/blob/master/samples/publishOrderedMessage.js) | [![Open in Cloud Shell][shell_img]](https://console.cloud.google.com/cloudshell/open?git_repo=https://github.com/googleapis/nodejs-pubsub&page=editor&open_in_editor=samples/publishOrderedMessage.js,samples/README.md) |
| Publish With Retry Settings | [source code](https://github.com/googleapis/nodejs-pubsub/blob/master/samples/publishWithRetrySettings.js) | [![Open in Cloud Shell][shell_img]](https://console.cloud.google.com/cloudshell/open?git_repo=https://github.com/googleapis/nodejs-pubsub&page=editor&open_in_editor=samples/publishWithRetrySettings.js,samples/README.md) |
| Quickstart | [source code](https://github.com/googleapis/nodejs-pubsub/blob/master/samples/quickstart.js) | [![Open in Cloud Shell][shell_img]](https://console.cloud.google.com/cloudshell/open?git_repo=https://github.com/googleapis/nodejs-pubsub&page=editor&open_in_editor=samples/quickstart.js,samples/README.md) |
| Remove Dead Letter Policy | [source code](https://github.com/googleapis/nodejs-pubsub/blob/master/samples/removeDeadLetterPolicy.js) | [![Open in Cloud Shell][shell_img]](https://console.cloud.google.com/cloudshell/open?git_repo=https://github.com/googleapis/nodejs-pubsub&page=editor&open_in_editor=samples/removeDeadLetterPolicy.js,samples/README.md) |
| Resume Publish | [source code](https://github.com/googleapis/nodejs-pubsub/blob/master/samples/resumePublish.js) | [![Open in Cloud Shell][shell_img]](https://console.cloud.google.com/cloudshell/open?git_repo=https://github.com/googleapis/nodejs-pubsub&page=editor&open_in_editor=samples/resumePublish.js,samples/README.md) |
| Set Subscription IAM Policy | [source code](https://github.com/googleapis/nodejs-pubsub/blob/master/samples/setSubscriptionPolicy.js) | [![Open in Cloud Shell][shell_img]](https://console.cloud.google.com/cloudshell/open?git_repo=https://github.com/googleapis/nodejs-pubsub&page=editor&open_in_editor=samples/setSubscriptionPolicy.js,samples/README.md) |
| Set Topic IAM Policy | [source code](https://github.com/googleapis/nodejs-pubsub/blob/master/samples/setTopicPolicy.js) | [![Open in Cloud Shell][shell_img]](https://console.cloud.google.com/cloudshell/open?git_repo=https://github.com/googleapis/nodejs-pubsub&page=editor&open_in_editor=samples/setTopicPolicy.js,samples/README.md) |
| Subscribe With Flow Control Settings | [source code](https://github.com/googleapis/nodejs-pubsub/blob/master/samples/subscribeWithFlowControlSettings.js) | [![Open in Cloud Shell][shell_img]](https://console.cloud.google.com/cloudshell/open?git_repo=https://github.com/googleapis/nodejs-pubsub&page=editor&open_in_editor=samples/subscribeWithFlowControlSettings.js,samples/README.md) |
| Synchronous Pull | [source code](https://github.com/googleapis/nodejs-pubsub/blob/master/samples/synchronousPull.js) | [![Open in Cloud Shell][shell_img]](https://console.cloud.google.com/cloudshell/open?git_repo=https://github.com/googleapis/nodejs-pubsub&page=editor&open_in_editor=samples/synchronousPull.js,samples/README.md) |
| Synchronous Pull with delivery attempt. | [source code](https://github.com/googleapis/nodejs-pubsub/blob/master/samples/synchronousPullWithDeliveryAttempts.js) | [![Open in Cloud Shell][shell_img]](https://console.cloud.google.com/cloudshell/open?git_repo=https://github.com/googleapis/nodejs-pubsub&page=editor&open_in_editor=samples/synchronousPullWithDeliveryAttempts.js,samples/README.md) |
| Synchronous Pull With Lease Management | [source code](https://github.com/googleapis/nodejs-pubsub/blob/master/samples/synchronousPullWithLeaseManagement.js) | [![Open in Cloud Shell][shell_img]](https://console.cloud.google.com/cloudshell/open?git_repo=https://github.com/googleapis/nodejs-pubsub&page=editor&open_in_editor=samples/synchronousPullWithLeaseManagement.js,samples/README.md) |
| Test Subscription Permissions | [source code](https://github.com/googleapis/nodejs-pubsub/blob/master/samples/testSubscriptionPermissions.js) | [![Open in Cloud Shell][shell_img]](https://console.cloud.google.com/cloudshell/open?git_repo=https://github.com/googleapis/nodejs-pubsub&page=editor&open_in_editor=samples/testSubscriptionPermissions.js,samples/README.md) |
| Test Topic Permissions | [source code](https://github.com/googleapis/nodejs-pubsub/blob/master/samples/testTopicPermissions.js) | [![Open in Cloud Shell][shell_img]](https://console.cloud.google.com/cloudshell/open?git_repo=https://github.com/googleapis/nodejs-pubsub&page=editor&open_in_editor=samples/testTopicPermissions.js,samples/README.md) |
| Update Dead Letter Policy | [source code](https://github.com/googleapis/nodejs-pubsub/blob/master/samples/updateDeadLetterPolicy.js) | [![Open in Cloud Shell][shell_img]](https://console.cloud.google.com/cloudshell/open?git_repo=https://github.com/googleapis/nodejs-pubsub&page=editor&open_in_editor=samples/updateDeadLetterPolicy.js,samples/README.md) |



The [Google Cloud Pub/Sub Node.js Client API Reference][client-docs] documentation
also contains samples.

## Supported Node.js Versions

Our client libraries follow the [Node.js release schedule](https://nodejs.org/en/about/releases/).
Libraries are compatible with all current _active_ and _maintenance_ versions of
Node.js.

Client libraries targeting some end-of-life versions of Node.js are available, and
can be installed via npm [dist-tags](https://docs.npmjs.com/cli/dist-tag).
The dist-tags follow the naming convention `legacy-(version)`.

_Legacy Node.js versions are supported as a best effort:_

* Legacy versions will not be tested in continuous integration.
* Some security patches may not be able to be backported.
* Dependencies will not be kept up-to-date, and features will not be backported.

#### Legacy tags available

* `legacy-8`: install client libraries from this dist-tag for versions
  compatible with Node.js 8.

## Versioning

This library follows [Semantic Versioning](http://semver.org/).


This library is considered to be **General Availability (GA)**. This means it
is stable; the code surface will not change in backwards-incompatible ways
unless absolutely necessary (e.g. because of critical security issues) or with
an extensive deprecation period. Issues and requests against **GA** libraries
are addressed with the highest priority.





More Information: [Google Cloud Platform Launch Stages][launch_stages]

[launch_stages]: https://cloud.google.com/terms/launch-stages

## Contributing

Contributions welcome! See the [Contributing Guide](https://github.com/googleapis/nodejs-pubsub/blob/master/CONTRIBUTING.md).

Please note that this `README.md`, the `samples/README.md`,
and a variety of configuration files in this repository (including `.nycrc` and `tsconfig.json`)
are generated from a central template. To edit one of these files, make an edit
to its template in this
[directory](https://github.com/googleapis/synthtool/tree/master/synthtool/gcp/templates/node_library).

## License

Apache Version 2.0

See [LICENSE](https://github.com/googleapis/nodejs-pubsub/blob/master/LICENSE)

[client-docs]: https://googleapis.dev/nodejs/pubsub/latest
[product-docs]: https://cloud.google.com/pubsub/docs/
[shell_img]: https://gstatic.com/cloudssh/images/open-btn.png
[projects]: https://console.cloud.google.com/project
[billing]: https://support.google.com/cloud/answer/6293499#enable-billing
[enable_api]: https://console.cloud.google.com/flows/enableapi?apiid=pubsub.googleapis.com
[auth]: https://cloud.google.com/docs/authentication/getting-started
