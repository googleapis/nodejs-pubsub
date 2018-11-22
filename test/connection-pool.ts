/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as assert from 'assert';
import * as util from '../src/util';
const duplexify = require('duplexify');
import {EventEmitter} from 'events';
import * as proxyquire from 'proxyquire';
import * as uuid from 'uuid';
import * as pjy from '@google-cloud/projectify';
import * as sinon from 'sinon';
import {SinonStub} from 'sinon';

let noopOverride: Function|null = null;
const fakeUtil = {
  noop: (...args) => {
    (noopOverride || util.noop).apply(null, args);
  }
};

const fakeUuid = Object.assign({}, uuid);

class FakeConnection extends EventEmitter {
  isConnected;
  isPaused;
  ended;
  canceled;
  written;
  constructor() {
    super();
    this.isConnected = false;
    this.isPaused = false;
    this.ended = false;
    this.canceled = false;
    this.written = [];
  }

  write(data) {
    this.written.push(data);
  }

  end(callback) {
    this.ended = true;
    if (callback) {
      callback(null);
    }
  }

  pause() {
    this.isPaused = true;
  }

  pipe(stream) {
    return stream;
  }

  resume() {
    this.isPaused = false;
  }

  cancel() {
    this.canceled = true;
  }
}

let duplexifyOverride: Function|null = null;
function fakeDuplexify() {
  const args = [].slice.call(arguments);
  return (duplexifyOverride || duplexify).apply(null, args);
}

describe('ConnectionPool', () => {
  // tslint:disable-next-line variable-name
  let ConnectionPool;
  let pool;
  let fakeConnection;
  let fakeChannel;
  let fakeClient;
  let sandbox: sinon.SinonSandbox;

  const FAKE_PUBSUB_OPTIONS = {};
  const PROJECT_ID = 'grapce-spacheship-123';

  // tslint:disable-next-line no-any
  const PUBSUB: any = {
    auth: {
      getAuthClient: util.noop,
    },
    options: FAKE_PUBSUB_OPTIONS,
  };

  const SUB_NAME = 'test-subscription';
  // tslint:disable-next-line no-any
  const SUBSCRIPTION: any = {
    name: SUB_NAME,
    pubsub: PUBSUB,
    request: util.noop,
  };

  let pjyOverride;
  function fakePjy() {
    return (pjyOverride || pjy.replaceProjectIdToken).apply(null, arguments);
  }

  before(() => {
    ConnectionPool = proxyquire('../src/connection-pool', {
                       '../src/util': fakeUtil,
                       '@google-cloud/projectify': {
                         replaceProjectIdToken: fakePjy,
                       },
                       duplexify: fakeDuplexify,
                       uuid: fakeUuid,
                     }).ConnectionPool;
  });

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    fakeConnection = new FakeConnection();
    duplexifyOverride = null;

    fakeChannel = {
      getConnectivityState() {
        return 2;
      },
    };

    fakeClient = {
      streamingPull() {
        return fakeConnection;
      },
      getChannel() {
        return fakeChannel;
      },
      waitForReady() {},
    };

    SUBSCRIPTION.request = util.noop;
    PUBSUB.auth.getAuthClient = util.noop;
    PUBSUB.getClient_ = (config, callback) => {
      callback(null, fakeClient);
    };

    pool = new ConnectionPool(SUBSCRIPTION);
    pool.queue.forEach(clearTimeout);
    pool.queue.length = 0;
  });

  afterEach(() => {
    if (pool.isOpen) {
      pool.close();
    }
    noopOverride = null;
    sandbox.restore();
  });

  describe('initialization', () => {
    it('should initialize internally used properties', () => {
      // tslint:disable-next-line:no-any
      (sandbox as any)
          .stub(ConnectionPool.prototype, 'open')
          .returns(undefined);

      const pool = new ConnectionPool(SUBSCRIPTION);
      assert.strictEqual(pool.subscription, SUBSCRIPTION);
      assert.strictEqual(pool.pubsub, SUBSCRIPTION.pubsub);
      assert(pool.connections instanceof Map);
      assert.strictEqual(pool.isPaused, false);
      assert.strictEqual(pool.isOpen, false);
      assert.strictEqual(pool.isGettingChannelState, false);
      assert.strictEqual(pool.failedConnectionAttempts, 0);
      assert.strictEqual(pool.noConnectionsTime, 0);
      assert.strictEqual(pool.settings.maxConnections, 5);
      assert.strictEqual(pool.settings.ackDeadline, 10000);
      assert.deepStrictEqual(pool.queue, []);
    });

    it('should respect user specified settings', () => {
      const options = {
        maxConnections: 2,
        ackDeadline: 100,
      };

      const subscription = Object.assign({}, SUBSCRIPTION, options);
      const subscriptionCopy = Object.assign({}, subscription);
      const pool = new ConnectionPool(subscription);

      assert.deepStrictEqual(pool.settings, options);
      assert.deepStrictEqual(subscription, subscriptionCopy);
    });

    it('should inherit from EventEmitter', () => {
      assert(pool instanceof EventEmitter);
    });

    it('should call open', done => {
      const open = ConnectionPool.prototype.open;

      ConnectionPool.prototype.open = () => {
        ConnectionPool.prototype.open = open;
        done();
      };

      // tslint:disable-next-line no-unused-expression
      new ConnectionPool(SUBSCRIPTION);
    });
  });

  describe('acquire', () => {
    it('should return an error if the pool is closed', done => {
      const expectedErr = 'No connections available to make request.';

      pool.isOpen = false;

      pool.acquire(err => {
        assert(err instanceof Error);
        assert.strictEqual(err.message, expectedErr);
        done();
      });
    });

    it('should return a specified connection', done => {
      const id = 'a';
      const fakeConnection = new FakeConnection();

      pool.connections.set(id, fakeConnection);
      pool.connections.set('b', new FakeConnection());

      pool.acquire(id, (err, connection) => {
        assert.ifError(err);
        assert.strictEqual(connection, fakeConnection);
        done();
      });
    });

    it('should return any conn when the specified is missing', done => {
      const fakeConnection = new FakeConnection();

      pool.connections.set('a', fakeConnection);

      pool.acquire('b', (err, connection) => {
        assert.ifError(err);
        assert.strictEqual(connection, fakeConnection);
        done();
      });
    });

    it('should return any connection when id is missing', done => {
      const fakeConnection = new FakeConnection();

      pool.connections.set('a', fakeConnection);

      pool.acquire((err, connection) => {
        assert.ifError(err);
        assert.strictEqual(connection, fakeConnection);
        done();
      });
    });

    it('should listen for connected event if no conn is ready', done => {
      const fakeConnection = new FakeConnection();

      pool.acquire((err, connection) => {
        assert.ifError(err);
        assert.strictEqual(connection, fakeConnection);
        done();
      });

      pool.emit('connected', fakeConnection);
    });
  });

  describe('close', () => {
    let _clearTimeout;
    let _clearInterval;

    before(() => {
      _clearTimeout = global.clearTimeout;
      _clearInterval = global.clearInterval;
    });

    beforeEach(() => {
      global.clearTimeout = global.clearInterval = util.noop;
    });

    afterEach(() => {
      global.clearTimeout = _clearTimeout;
      global.clearInterval = _clearInterval;
    });

    it('should stop running the keepAlive task', done => {
      const fakeHandle = 123;

      pool.keepAliveHandle = fakeHandle;

      global.clearInterval = handle => {
        assert.strictEqual(handle, fakeHandle);
        done();
      };

      pool.close();
    });

    it('should clear the connections map', done => {
      pool.connections.clear = done;
      pool.close();
    });

    it('should clear any timeouts in the queue', () => {
      let clearCalls = 0;

      const fakeHandles = ['a', 'b', 'c', 'd'];

      global.clearTimeout = handle => {
        assert.strictEqual(handle, fakeHandles[clearCalls++]);
      };

      pool.queue = Array.from(fakeHandles);
      pool.close();

      assert.strictEqual(clearCalls, fakeHandles.length);
      assert.strictEqual(pool.queue.length, 0);
    });

    it('should set isOpen to false', () => {
      pool.close();
      assert.strictEqual(pool.isOpen, false);
    });

    it('should set isGettingChannelState to false', () => {
      pool.isGettingChannelState = true;
      pool.close();

      assert.strictEqual(pool.isGettingChannelState, false);
    });

    it('should reset internally used props', () => {
      pool.failedConnectionAttempts = 100;
      pool.noConnectionsTime = Date.now();

      pool.close();

      assert.strictEqual(pool.failedConnectionAttempts, 0);
      assert.strictEqual(pool.noConnectionsTime, 0);
    });

    it('should remove event listeners', () => {
      pool.on('channel.ready', nope)
          .on('channel.error', nope)
          .on('newListener', nope);

      pool.close();

      assert.strictEqual(pool.listenerCount('channel.ready'), 0);
      assert.strictEqual(pool.listenerCount('channel.error'), 0);
      assert.strictEqual(pool.listenerCount('newListener'), 0);

      function nope() {
        throw new Error('Should not be called!');
      }
    });

    it('should call cancel on all active connections', done => {
      const a = new FakeConnection();
      const b = new FakeConnection();

      pool.connections.set('a', a);
      pool.connections.set('b', b);

      pool.close(err => {
        assert.ifError(err);
        assert.strictEqual(a.canceled, true);
        assert.strictEqual(b.canceled, true);
        done();
      });
    });

    it('should call end on all active connections', () => {
      const a = new FakeConnection();
      const b = new FakeConnection();

      pool.connections.set('a', a);
      pool.connections.set('b', b);

      pool.close();

      assert.strictEqual(a.ended, true);
      assert.strictEqual(b.ended, true);
    });

    it('should close the client', done => {
      pool.client = {close: done};
      pool.close();
    });

    it('should exec a callback when finished closing', done => {
      pool.close(done);
    });

    it('should use noop when callback is omitted', done => {
      noopOverride = done;
      pool.close();
    });
  });

  describe('createConnection', () => {
    let fakeConnection;
    let fakeChannel;
    let fakeClient;
    let fakeDuplex;

    beforeEach(() => {
      fakeConnection = new FakeConnection();

      fakeChannel = {
        getConnectivityState() {
          return 2;
        },
      };

      fakeClient = {
        streamingPull() {
          return fakeConnection;
        },
        getChannel() {
          return fakeChannel;
        },
      };

      fakeClient.waitForReady = util.noop;

      pool.getClient = callback => {
        pool.pubsub = {
          projectId: PROJECT_ID,
        };

        callback(null, fakeClient);
      };

      fakeDuplex = new FakeConnection();

      duplexifyOverride = () => {
        return fakeDuplex;
      };
    });

    it('should emit any errors that occur when getting client', done => {
      const error = new Error('err');

      pool.getClient = callback => {
        callback(error);
      };

      pool.on('error', err => {
        assert.strictEqual(err, error);
        done();
      });

      pool.createConnection();
    });

    describe('channel', () => {
      const channelReadyEvent = 'channel.ready';
      const channelErrorEvent = 'channel.error';

      describe('error', () => {
        it('should remove the channel ready event listener', () => {
          pool.createConnection();
          assert.strictEqual(pool.listenerCount(channelReadyEvent), 1);

          pool.emit(channelErrorEvent);
          assert.strictEqual(pool.listenerCount(channelReadyEvent), 0);
        });

        it('should cancel the connection', () => {
          pool.createConnection();
          pool.emit(channelErrorEvent);

          assert.strictEqual(fakeConnection.canceled, true);
        });
      });

      describe('success', () => {
        it('should remove the channel error event', () => {
          pool.createConnection();
          assert.strictEqual(pool.listenerCount(channelErrorEvent), 1);

          pool.emit(channelReadyEvent);
          assert.strictEqual(pool.listenerCount(channelErrorEvent), 0);
        });

        it('should set the isConnected flag to true', () => {
          pool.createConnection();
          pool.emit(channelReadyEvent);

          assert.strictEqual(fakeDuplex.isConnected, true);
        });

        it('should reset internally used properties', () => {
          pool.noConnectionsTime = Date.now();
          pool.failedConnectionAttempts = 10;

          pool.createConnection();
          pool.emit(channelReadyEvent);

          assert.strictEqual(pool.noConnectionsTime, 0);
          assert.strictEqual(pool.failedConnectionAttempts, 0);
        });

        it('should emit a connected event', done => {
          pool.on('connected', connection => {
            assert.strictEqual(connection, fakeDuplex);
            done();
          });

          pool.createConnection();
          pool.emit(channelReadyEvent);
        });
      });
    });

    describe('connection', () => {
      const TOKENIZED_SUB_NAME = 'project/p/subscriptions/' + SUB_NAME;
      let fakeId;

      beforeEach(() => {
        fakeId = uuid.v4();

        fakeUuid.v4 = () => {
          return fakeId;
        };

        pjyOverride = null;
      });

      it('should create a connection', done => {
        const fakeDuplex = new FakeConnection();

        duplexifyOverride = (writable, readable, options) => {
          assert.strictEqual(writable, fakeConnection);
          assert.deepStrictEqual(options, {objectMode: true});
          return fakeDuplex;
        };

        pjyOverride = (subName, projectId) => {
          assert.strictEqual(subName, SUB_NAME);
          assert.strictEqual(projectId, PROJECT_ID);
          return TOKENIZED_SUB_NAME;
        };

        fakeDuplex.write = reqOpts => {
          assert.deepStrictEqual(reqOpts, {
            subscription: TOKENIZED_SUB_NAME,
            streamAckDeadlineSeconds: pool.settings.ackDeadline / 1000,
          });
        };

        pool.connections.set = (id, connection) => {
          assert.strictEqual(id, fakeId);
          assert.strictEqual(connection, fakeDuplex);
          done();
        };

        pool.createConnection();
      });

      it('should unpack the recieved messages', done => {
        const fakeDuplex = new FakeConnection();
        const pipedMessages: Array<{}> = [];
        const fakeResp = {
          receivedMessages: [{}, {}, {}, {}, null],
        };

        duplexifyOverride = (writable, readable) => {
          readable
              .on('data',
                  message => {
                    pipedMessages.push(message);
                  })
              .on('end',
                  () => {
                    assert.strictEqual(pipedMessages.length, 4);
                    pipedMessages.forEach((message, i) => {
                      assert.strictEqual(message, fakeResp.receivedMessages[i]);
                    });
                    done();
                  })
              .write(fakeResp);

          return fakeDuplex;
        };

        pool.createConnection();
      });

      it('should proxy the cancel method', () => {
        const fakeCancel = () => {};
        fakeConnection.cancel = {
          bind(context) {
            assert.strictEqual(context, fakeConnection);
            return fakeCancel;
          },
        };
        pool.createConnection();
        assert.strictEqual(fakeDuplex.cancel, fakeCancel);
      });

      it('should pause the connection if the pool is paused', done => {
        fakeDuplex.pause = done;
        pool.isPaused = true;
        pool.createConnection();
      });

      describe('error events', () => {
        it('should emit errors to the pool', done => {
          const error = new Error('err');

          pool.on('error', err => {
            assert.strictEqual(err, error);
            done();
          });

          pool.createConnection();
          fakeDuplex.emit('error', error);
        });
      });

      describe('status events', () => {
        beforeEach(() => {
          pool.connections.set('a', new FakeConnection());
        });

        it('should cancel any error events', done => {
          const fakeError = {code: 4};

          pool.on('error', done);  // should not fire
          pool.createConnection();

          fakeConnection.emit('status', fakeError);
          fakeDuplex.emit('error', fakeError);

          done();
        });

        it('should close and delete the connection', done => {
          pool.createConnection();

          pool.connections.delete = id => {
            assert.strictEqual(id, fakeId);
            done();
          };

          fakeConnection.emit('status', {});
        });

        it('should increment the failed connection counter', done => {
          pool.failedConnectionAttempts = 0;
          fakeDuplex.isConnected = false;

          pool.createConnection();
          fakeConnection.emit('status', {});

          setImmediate(() => {
            assert.strictEqual(pool.failedConnectionAttempts, 1);
            done();
          });
        });

        it('should not incr. the failed connection counter', () => {
          pool.failedConnectionAttempts = 0;
          fakeDuplex.isConnected = true;

          pool.createConnection();
          fakeConnection.emit('status', {});

          assert.strictEqual(pool.failedConnectionAttempts, 0);
        });

        it('should capture the date when no conns are found', done => {
          const dateNow = global.Date.now;

          const fakeDate = Date.now();
          global.Date.now = () => {
            return fakeDate;
          };

          pool.noConnectionsTime = 0;
          pool.isConnected = () => {
            return false;
          };

          pool.createConnection();
          fakeConnection.emit('status', {});

          setImmediate(() => {
            assert.strictEqual(pool.noConnectionsTime, fakeDate);
            global.Date.now = dateNow;
            done();
          });
        });

        it('should not capture the date when already set', () => {
          pool.noConnectionsTime = 123;
          pool.isConnected = () => {
            return false;
          };

          pool.createConnection();
          fakeConnection.emit('status', {});

          assert.strictEqual(pool.noConnectionsTime, 123);
        });

        it('should not capture the date if a conn. is found', () => {
          pool.noConnectionsTime = 0;
          pool.isConnected = () => {
            return true;
          };

          pool.createConnection();
          fakeConnection.emit('status', {});

          assert.strictEqual(pool.noConnectionsTime, 0);
        });

        it('should queue a connection if status is retryable', done => {
          const fakeStatus = {};

          pool.shouldReconnect = status => {
            assert.strictEqual(status, fakeStatus);
            return true;
          };

          pool.queueConnection = done;

          pool.createConnection();
          fakeConnection.emit('status', fakeStatus);
        });

        it('should emit error if no pending conn. are found', done => {
          const error = {
            code: 4,
            details: 'Deadline Exceeded',
          };

          pool.shouldReconnect = () => {
            return false;
          };

          // will only emit status errors if pool is empty
          pool.connections = new Map();

          pool.on('error', err => {
            assert.strictEqual(err.code, error.code);
            assert.strictEqual(err.message, error.details);
            done();
          });

          pool.createConnection();
          fakeConnection.emit('status', error);
        });
      });

      describe('data events', () => {
        it('should emit messages', done => {
          const fakeResp = {};
          const fakeMessage = {};

          pool.createMessage = (id, resp) => {
            assert.strictEqual(id, fakeId);
            assert.strictEqual(resp, fakeResp);
            return fakeMessage;
          };

          pool.on('message', message => {
            assert.strictEqual(message, fakeMessage);
            done();
          });

          pool.createConnection();
          fakeDuplex.emit('data', fakeResp);
        });
      });
    });
  });

  describe('createMessage', () => {
    let message;
    let globalDateNow;

    const CONNECTION_ID = 'abc';
    const FAKE_DATE_NOW = Date.now();

    const PT = {
      seconds: 6838383,
      nanos: 20323838,
    };

    const RESP = {
      ackId: 'def',
      message: {
        messageId: 'ghi',
        data: Buffer.from('hello'),
        attributes: {
          a: 'a',
        },
        publishTime: PT,
      },
    };

    before(() => {
      globalDateNow = global.Date.now;
      global.Date.now = () => {
        return FAKE_DATE_NOW;
      };
    });

    beforeEach(() => {
      message = pool.createMessage(CONNECTION_ID, RESP);
    });

    after(() => {
      global.Date.now = globalDateNow;
    });

    it('should capture the connection id', () => {
      assert.strictEqual(message.connectionId, CONNECTION_ID);
    });

    it('should capture the message data', () => {
      const expectedPublishTime =
          new Date(Math.floor(PT.seconds) * 1000 + Math.floor(PT.nanos) / 1e6);

      assert.strictEqual(message.ackId, RESP.ackId);
      assert.strictEqual(message.id, RESP.message.messageId);
      assert.strictEqual(message.data, RESP.message.data);
      assert.strictEqual(message.attributes, RESP.message.attributes);
      assert.deepStrictEqual(message.publishTime, expectedPublishTime);
      assert.strictEqual(message.received, FAKE_DATE_NOW);
    });

    it('should create a read-only message length property', () => {
      assert.strictEqual(message.length, RESP.message.data.length);

      assert.throws(() => {
        message.length = 3;
      });
    });

    it('should create an ack method', done => {
      SUBSCRIPTION.ack_ = message_ => {
        assert.strictEqual(message_, message);
        done();
      };

      message.ack();
    });

    it('should create a nack method', done => {
      SUBSCRIPTION.nack_ = message_ => {
        assert.strictEqual(message_, message);
        done();
      };

      message.nack();
    });

    it('should create a nack method accepting a delay argument', done => {
      const delay = Math.random();

      SUBSCRIPTION.nack_ = (message_, delay_) => {
        assert.strictEqual(message_, message);
        assert.strictEqual(delay_, delay);
        done();
      };

      message.nack(delay);
    });
  });

  describe('getAndEmitChannelState', () => {
    const channelErrorEvent = 'channel.error';
    const channelReadyEvent = 'channel.ready';
    const channelReadyState = 2;
    let fakeChannelState;
    let dateNow;
    let fakeTimestamp;
    // tslint:disable-next-line no-any
    const fakeChannel: any = {};

    // tslint:disable-next-line no-any
    const fakeClient: any = {
      getChannel() {
        return fakeChannel;
      },
    };

    before(() => {
      dateNow = global.Date.now;
    });

    beforeEach(() => {
      fakeChannel.getConnectivityState = () => {
        return fakeChannelState;
      };

      fakeChannelState = 0;
      fakeClient.waitForReady = util.noop;

      pool.getClient = callback => {
        callback(null, fakeClient);
      };

      PUBSUB.getClient_ = (config, callback) => {
        callback(null, fakeClient);
      };

      fakeTimestamp = dateNow.call(global.Date);
      pool.noConnectionsTime = 0;

      global.Date.now = () => {
        return fakeTimestamp;
      };
    });

    after(() => {
      global.Date.now = dateNow;
    });

    it('should set the isGettingChannelState flag to true', () => {
      pool.getAndEmitChannelState();
      assert.strictEqual(pool.isGettingChannelState, true);
    });

    it('should emit any client errors', done => {
      let channelErrorEmitted = false;

      pool.on(channelErrorEvent, () => {
        channelErrorEmitted = true;
      });

      const fakeError = new Error('nope');
      let errorEmitted = false;

      pool.on('error', err => {
        assert.strictEqual(err, fakeError);
        errorEmitted = true;
      });

      pool.getClient = callback => {
        callback(fakeError);

        assert.strictEqual(pool.isGettingChannelState, false);
        assert.strictEqual(channelErrorEmitted, true);
        assert.strictEqual(errorEmitted, true);

        done();
      };

      pool.getAndEmitChannelState();
    });

    it('should emit the ready event if the channel is ready', done => {
      fakeClient.waitForReady = (deadline, callback) => {
        callback();
      };
      fakeChannelState = channelReadyState;

      fakeChannel.getConnectivityState = shouldConnect => {
        assert.strictEqual(shouldConnect, false);
        return fakeChannelState;
      };

      pool.on(channelReadyEvent, () => {
        assert.strictEqual(pool.isGettingChannelState, false);
        done();
      });

      pool.getAndEmitChannelState();
      fakeClient.waitForReady = util.noop;
    });

    it('should wait for the channel to be ready', done => {
      const expectedDeadline = fakeTimestamp + 300000;

      fakeClient.waitForReady = deadline => {
        assert.strictEqual(deadline, expectedDeadline);
        done();
      };

      pool.getAndEmitChannelState();
    });

    it('should factor in the noConnectionsTime property', done => {
      pool.noConnectionsTime = 10;

      const fakeElapsedTime = fakeTimestamp - pool.noConnectionsTime;
      const expectedDeadline = fakeTimestamp + (300000 - fakeElapsedTime);

      fakeClient.waitForReady = deadline => {
        assert.strictEqual(deadline, expectedDeadline);
        done();
      };

      pool.getAndEmitChannelState();
    });

    it('should emit any waitForReady errors', done => {
      const fakeError = new Error('err');

      pool.on(channelErrorEvent, err => {
        assert.strictEqual(err, fakeError);
        assert.strictEqual(pool.isGettingChannelState, false);
        done();
      });

      fakeClient.waitForReady = (deadline, callback) => {
        callback(fakeError);
      };

      pool.getAndEmitChannelState();
    });

    it('should emit the ready event when ready', done => {
      pool.on(channelReadyEvent, () => {
        assert.strictEqual(pool.isGettingChannelState, false);
        done();
      });

      fakeClient.waitForReady = (deadline, callback) => {
        callback(null);
      };

      pool.getAndEmitChannelState();
    });
  });

  describe('getClient', () => {
    const fakeCreds = {};

    class FakeSubscriber {
      address;
      creds;
      options;
      closed;
      constructor(address, creds, options) {
        this.address = address;
        this.creds = creds;
        this.options = options;
        this.closed = false;
      }
      streamingPull() {
        return fakeConnection;
      }
      getChannel() {
        return fakeChannel;
      }
      close() {
        this.closed = true;
      }
    }

    const fakeClient = new FakeSubscriber('fake-address', fakeCreds, {});

    beforeEach(() => {
      PUBSUB.getClient_ = (config, callback) => {
        callback(null, fakeClient);
      };
    });

    it('should return the cached client when available', done => {
      pool.getClient((err1, client1) => {
        assert.ifError(err1);

        pool.getClient((err2, client2) => {
          assert.ifError(err2);
          assert.strictEqual(client1, client2);
          done();
        });
      });
    });

    it('should create/use grpc credentials', done => {
      pool.getClient((err, client) => {
        assert.ifError(err);
        assert(client instanceof FakeSubscriber);
        assert.strictEqual(client.creds, fakeCreds);
        done();
      });
    });
  });

  describe('isConnected', () => {
    it('should return true when at least one stream is connected', () => {
      const connections = (pool.connections = new Map());

      connections.set('a', new FakeConnection());
      connections.set('b', new FakeConnection());
      connections.set('c', new FakeConnection());
      connections.set('d', new FakeConnection());

      const conn = new FakeConnection();
      conn.isConnected = true;
      connections.set('e', conn);

      assert(pool.isConnected());
    });

    it('should return false when there is no connection', () => {
      const connections = (pool.connections = new Map());

      connections.set('a', new FakeConnection());
      connections.set('b', new FakeConnection());
      connections.set('c', new FakeConnection());
      connections.set('d', new FakeConnection());
      connections.set('e', new FakeConnection());

      assert(!pool.isConnected());
    });

    it('should return false when the map is empty', () => {
      pool.connections = new Map();
      assert(!pool.isConnected());
    });
  });

  describe('open', () => {
    beforeEach(() => {
      pool.queueConnection = util.noop;
      clearInterval(pool.keepAliveHandle);
    });

    it('should make the specified number of connections', () => {
      const expectedCount = 5;
      let connectionCount = 0;

      pool.queueConnection = () => {
        connectionCount += 1;
      };

      pool.settings.maxConnections = expectedCount;
      pool.open();

      assert.strictEqual(expectedCount, connectionCount);
    });

    it('should set the isOpen flag to true', () => {
      pool.open();
      assert(pool.isOpen);
    });

    it('should reset internal used props', () => {
      const fakeDate = Date.now();
      const dateNow = Date.now;

      global.Date.now = () => {
        return fakeDate;
      };

      pool.failedConnectionAttempts = 100;
      pool.noConnectionsTime = 0;

      pool.open();

      assert.strictEqual(pool.failedConnectionAttempts, 0);
      assert.strictEqual(pool.noConnectionsTime, fakeDate);

      global.Date.now = dateNow;
    });

    it('should listen for newListener events', () => {
      pool.removeAllListeners('newListener');
      pool.open();

      assert.strictEqual(pool.listenerCount('newListener'), 1);
    });

    describe('newListener callback', () => {
      beforeEach(() => {
        pool.getAndEmitChannelState = () => {
          throw new Error('Should not be called!');
        };
      });

      it('should call getAndEmitChannelState', done => {
        pool.getAndEmitChannelState = done;
        pool.emit('newListener', 'channel.ready');
      });

      it('should do nothing for unknown events', () => {
        pool.emit('newListener', 'channel.error');
      });

      it('should do nothing when already getting state', () => {
        pool.isGettingChannelState = true;
        pool.emit('newListener', 'channel.ready');
      });
    });

    it('should start a keepAlive task', done => {
      const _setInterval = global.setInterval;
      let unreffed = false;
      const fakeHandle = {
        unref: () => (unreffed = true),
      };

      pool.subscription = {writeToStreams_: false};
      pool.sendKeepAlives = done;

      // tslint:disable-next-line no-any
      (global as any).setInterval = (fn, interval) => {
        global.setInterval = _setInterval;

        assert.strictEqual(interval, 30000);
        fn();  // should call sendKeepAlives aka done

        return fakeHandle;
      };

      pool.open();

      assert.strictEqual(pool.keepAliveHandle, fakeHandle);
      assert.strictEqual(unreffed, true);
    });
  });

  describe('pause', () => {
    it('should set the isPaused flag to true', () => {
      pool.pause();
      assert(pool.isPaused);
    });

    it('should pause all the connections', () => {
      const a = new FakeConnection();
      const b = new FakeConnection();

      pool.connections.set('a', a);
      pool.connections.set('b', b);

      pool.pause();

      assert(a.isPaused);
      assert(b.isPaused);
    });
  });

  describe('queueConnection', () => {
    const fakeTimeoutHandle = 123;

    let _setTimeout;
    let _random;
    let _open;

    before(() => {
      _setTimeout = global.setTimeout;
      _random = global.Math.random;

      _open = ConnectionPool.prototype.open;
      // prevent open from calling queueConnection
      ConnectionPool.prototype.open = util.noop;
    });

    beforeEach(() => {
      Math.random = () => {
        return 1;
      };

      // tslint:disable-next-line no-any
      (global as any).setTimeout = cb => {
        cb();
        return fakeTimeoutHandle;
      };

      pool.failedConnectionAttempts = 0;
      pool.createConnection = util.noop;
    });

    after(() => {
      global.setTimeout = _setTimeout;
      global.Math.random = _random;
      ConnectionPool.prototype.open = _open;
    });

    it('should set a timeout to create the connection', done => {
      pool.createConnection = done;

      // tslint:disable-next-line no-any
      (global as any).setTimeout = (cb, delay) => {
        assert.strictEqual(delay, 0);
        cb();  // should call the done fn
      };

      pool.queueConnection();
    });

    it('should factor in the number of failed requests', done => {
      pool.createConnection = done;
      pool.failedConnectionAttempts = 3;

      // tslint:disable-next-line no-any
      (global as any).setTimeout = (cb, delay) => {
        assert.strictEqual(delay, 9000);
        cb();  // should call the done fn
      };

      pool.queueConnection();
    });

    it('should capture the timeout handle', () => {
      pool.queueConnection();
      assert.deepStrictEqual(pool.queue, [fakeTimeoutHandle]);
    });

    it('should remove the timeout handle once it fires', done => {
      pool.createConnection = () => {
        setImmediate(() => {
          assert.strictEqual(pool.queue.length, 0);
          done();
        });
      };

      pool.queueConnection();
    });
  });

  describe('resume', () => {
    it('should set the isPaused flag to false', () => {
      pool.resume();
      assert.strictEqual(pool.isPaused, false);
    });

    it('should resume all the connections', () => {
      const a = new FakeConnection();
      const b = new FakeConnection();

      pool.connections.set('a', a);
      pool.connections.set('b', b);

      pool.resume();

      assert.strictEqual(a.isPaused, false);
      assert.strictEqual(b.isPaused, false);
    });
  });

  describe('sendKeepAlives', () => {
    it('should write an empty message to all the streams', () => {
      const a = new FakeConnection();
      const b = new FakeConnection();

      pool.connections.set('a', a);
      pool.connections.set('b', b);

      pool.sendKeepAlives();

      assert.deepStrictEqual(a.written, [{}]);
      assert.deepStrictEqual(b.written, [{}]);
    });
  });

  describe('shouldReconnect', () => {
    it('should not reconnect if the pool is closed', () => {
      pool.isOpen = false;
      assert.strictEqual(pool.shouldReconnect({}), false);
    });

    it('should return true for retryable errors', () => {
      assert(pool.shouldReconnect({code: 0}));   // OK
      assert(pool.shouldReconnect({code: 1}));   // Canceled
      assert(pool.shouldReconnect({code: 2}));   // Unknown
      assert(pool.shouldReconnect({code: 4}));   // DeadlineExceeded
      assert(pool.shouldReconnect({code: 8}));   // ResourceExhausted
      assert(pool.shouldReconnect({code: 10}));  // Aborted
      assert(pool.shouldReconnect({code: 13}));  // Internal
      assert(pool.shouldReconnect({code: 14}));  // Unavailable
      assert(pool.shouldReconnect({code: 15}));  // Dataloss
    });

    it('should return false for non-retryable errors', () => {
      assert(!pool.shouldReconnect({code: 3}));   // InvalidArgument
      assert(!pool.shouldReconnect({code: 5}));   // NotFound
      assert(!pool.shouldReconnect({code: 6}));   // AlreadyExists
      assert(!pool.shouldReconnect({code: 7}));   // PermissionDenied
      assert(!pool.shouldReconnect({code: 9}));   // FailedPrecondition
      assert(!pool.shouldReconnect({code: 11}));  // OutOfRange
      assert(!pool.shouldReconnect({code: 12}));  // Unimplemented
      assert(!pool.shouldReconnect({code: 16}));  // Unauthenticated
    });

    it('should not retry if no connection can be made', () => {
      const fakeStatus = {
        code: 4,
      };

      pool.noConnectionsTime = Date.now() - 300001;

      assert.strictEqual(pool.shouldReconnect(fakeStatus), false);
    });

    it('should return true if all conditions are met', () => {
      const fakeStatus = {
        code: 4,
      };

      pool.noConnectionsTime = 0;

      assert.strictEqual(pool.shouldReconnect(fakeStatus), true);
    });
  });
});
