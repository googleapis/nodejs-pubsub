const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const {PubSub} = require('../build/src');

const argv = require('yargs')
  .option('port', {
    description: 'The port that the Node.js benchwrapper should run on.',
    type: 'number',
    demand: true,
  })
  .parse();

const PROTO_PATH = __dirname + '/pubsub.proto';
// Suggested options for similarity to existing grpc.load behavior.
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const pubsubBenchWrapper = protoDescriptor.pubsub_bench;

const client = new PubSub();

function recv(call, callback) {
  const subName = call.request.sub_name;

  const subOptions = {
    streamingPull: {
      maxStreams: 1,
    },
  };

  const sub = client.subscription(subName, subOptions);

  sub.on('message', message => {
    message.ack();
  });

  sub.on('error', err => {
    callback(null, null);
  });
}

const server = new grpc.Server();

server.addService(pubsubBenchWrapper['PubsubBenchWrapper']['service'], {
  Recv: recv,
});
console.log('starting on localhost:' + argv.port);
server.bind('0.0.0.0:' + argv.port, grpc.ServerCredentials.createInsecure());
server.start();
