[//]: # "This README.md file is auto-generated, all changes to this file will be lost."
[//]: # "To regenerate it, use `npm run generate-scaffolding`."
<img src="https://avatars2.githubusercontent.com/u/2810941?v=3&s=96" alt="Google Cloud Platform logo" title="Google Cloud Platform" align="right" height="96" width="96"/>

# [Google Cloud Pub/Sub: Node.js Client](https://github.com/googleapis/nodejs-pubsub)

[![release level](https://img.shields.io/badge/release%20level-beta-yellow.svg?style&#x3D;flat)](https://cloud.google.com/terms/launch-stages)
[![CircleCI](https://img.shields.io/circleci/project/github/googleapis/nodejs-pubsub.svg?style=flat)](https://circleci.com/gh/googleapis/nodejs-pubsub)
[![AppVeyor](https://ci.appveyor.com/api/projects/status/github/googleapis/nodejs-pubsub?branch=master&svg=true)](https://ci.appveyor.com/project/googleapis/nodejs-pubsub)
[![codecov](https://img.shields.io/codecov/c/github/googleapis/nodejs-pubsub/master.svg?style=flat)](https://codecov.io/gh/googleapis/nodejs-pubsub)

[Cloud Pub/Sub](https://cloud.google.com/pubsub/docs) is a fully-managed real-time messaging service that allows you to send and receive messages between independent applications.


* [Using the client library](#using-the-client-library)
* [Samples](#samples)
* [Versioning](#versioning)
* [Contributing](#contributing)
* [License](#license)

## Using the client library

1.  [Select or create a Cloud Platform project][projects].

1.  [Enable billing for your project][billing].

1.  [Enable the Google Cloud Pub/Sub API][enable_api].

1.  [Set up authentication with a service account][auth] so you can access the
    API from your local workstation.

1. Install the client library:

        npm install --save @google-cloud/pubsub

1. Try an example:

```javascript
// Imports the Google Cloud client library
const {PubSub} = require('@google-cloud/pubsub');

// Your Google Cloud Platform project ID
const projectId = 'YOUR_PROJECT_ID';

// Instantiates a client
const pubsubClient = new PubSub({
  projectId: projectId,
});

// The name for the new topic
const topicName = 'my-new-topic';

// Creates the new topic
pubsubClient
  .createTopic(topicName)
  .then(results => {
    const topic = results[0];
    console.log(`Topic ${topic.name} created.`);
  })
  .catch(err => {
    console.error('ERROR:', err);
  });
```

## Samples

Samples are in the [`samples/`](https://github.com/googleapis/nodejs-pubsub/tree/master/samples) directory. The samples' `README.md`
has instructions for running the samples.

| Sample                      | Source Code                       | Try it |
| --------------------------- | --------------------------------- | ------ |
| Subscriptions | [source code](https://github.com/googleapis/nodejs-pubsub/blob/master/samples/subscriptions.js) | [![Open in Cloud Shell][shell_img]](https://console.cloud.google.com/cloudshell/open?git_repo=https://github.com/googleapis/nodejs-pubsub&page=editor&open_in_editor=samples/subscriptions.js,samples/README.md) |
| Topics | [source code](https://github.com/googleapis/nodejs-pubsub/blob/master/samples/topics.js) | [![Open in Cloud Shell][shell_img]](https://console.cloud.google.com/cloudshell/open?git_repo=https://github.com/googleapis/nodejs-pubsub&page=editor&open_in_editor=samples/topics.js,samples/README.md) |

The [Cloud Pub/Sub Node.js Client API Reference][client-docs] documentation
also contains samples.

## Versioning

This library follows [Semantic Versioning](http://semver.org/).

This library is considered to be in **beta**. This means it is expected to be
mostly stable while we work toward a general availability release; however,
complete stability is not guaranteed. We will address issues and requests
against beta libraries with a high priority.

More Information: [Google Cloud Platform Launch Stages][launch_stages]

[launch_stages]: https://cloud.google.com/terms/launch-stages

## Contributing

Contributions welcome! See the [Contributing Guide](https://github.com/googleapis/nodejs-pubsub/blob/master/.github/CONTRIBUTING.md).

## License

Apache Version 2.0

See [LICENSE](https://github.com/googleapis/nodejs-pubsub/blob/master/LICENSE)

## What's Next

* [Cloud Pub/Sub Documentation][product-docs]
* [Cloud Pub/Sub Node.js Client API Reference][client-docs]
* [github.com/googleapis/nodejs-pubsub](https://github.com/googleapis/nodejs-pubsub)

Read more about the client libraries for Cloud APIs, including the older
Google APIs Client Libraries, in [Client Libraries Explained][explained].

[explained]: https://cloud.google.com/apis/docs/client-libraries-explained

[client-docs]: https://googlecloudplatform.github.io/google-cloud-node/#/docs/pubsub/latest/pubsub
[product-docs]: https://cloud.google.com/pubsub/docs
[shell_img]: https://gstatic.com/cloudssh/images/open-btn.png
[projects]: https://console.cloud.google.com/project
[billing]: https://support.google.com/cloud/answer/6293499#enable-billing
[enable_api]: https://console.cloud.google.com/flows/enableapi?apiid=pubsub.googleapis.com
[auth]: https://cloud.google.com/docs/authentication/getting-started
