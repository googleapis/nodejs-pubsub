// import { PubSub, v1 } from './';

const { PubSub, v1 } = require('./');

async function foo() {
  const pubsub = new PubSub();
  // const opts = await pubsub.getClientConfig();
  const subClient = new v1.SubscriberClient({ projectId: 'projects/long-door-651' });

  const request = {
    subscription: 'projects/long-door-651/subscriptions/mzp-sdetach-sub',
    maxMessages: 10,
  };

  const [response] = await subClient.pull(request);

  console.log('got response', response);
}

foo().then(() => console.log('hooha'));
setTimeout(() => {}, 60000);
