/*!
 * Copyright 2018 Google Inc. All Rights Reserved.
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
import {promisify} from '@google-cloud/promisify';
import {ClientStub} from 'google-gax';
import {Metadata, StatusObject} from 'grpc';
import {common as protobuf} from 'protobufjs';
import {Duplex, Transform} from 'stream';  // will this work in Node6?

import {Subscriber} from './subscriber';

/*!
 * Frequency to ping streams.
 */
const KEEP_ALIVE_INTERVAL = 30000;

/*!
 * codes to retry streams
 */
const RETRY_CODES: number[] = [
  0,   // ok
  1,   // canceled
  2,   // unknown
  4,   // deadline exceeded
  8,   // resource exhausted
  10,  // aborted
  13,  // internal error
  14,  // unavailable
  15,  // dataloss
];

interface StreamState {
  highWaterMark: number;
}

interface GrpcDuplex extends Duplex {
  _writableState: StreamState;
  _readableState: StreamState;
  stream: GrpcDuplex;
  cancel(): void;
  destroy(): void;
}

/**
 * @see https://cloud.google.com/pubsub/docs/reference/rest/v1/projects.subscriptions/pull#ReceivedMessage
 */
interface ReceivedMessage {
  ackId: string;
  message: {
    attributes: {},
    data: Buffer,
    messageId: string,
    publishTime: protobuf.ITimestamp
  };
}

/**
 * @see https://cloud.google.com/pubsub/docs/reference/rest/v1/projects.subscriptions/pull#body.PullResponse
 */
interface PullResponse {
  receivedMessages: ReceivedMessage[];
}

/**
 * Error wrapper for gRPC status objects.
 *
 * @class
 *
 * @param {object} status The gRPC status object.
 */
export class StatusError extends Error {
  code: number;
  metadata: Metadata;
  constructor(status: StatusObject) {
    super(status.details);
    this.code = status.code;
    this.metadata = status.metadata;
  }
}

/**
 * Message objects provide a simple interface for users to get message data and
 * acknowledge the message.
 *
 * @private
 * @class
 *
 * @param {Subscriber} sub The parent subscriber.
 * @param {object} message The raw message response.
 */
export class Message {
  ackId: string;
  attributes: {};
  data: Buffer;
  id: string;
  publishTime: Date;
  received: number;
  _length: number;
  _subscriber: Subscriber;
  constructor(sub: Subscriber, {ackId, message}: ReceivedMessage) {
    this.ackId = ackId;
    this.attributes = message.attributes;
    this.data = message.data;
    this.id = message.messageId;
    this.publishTime = Message._formatTimestamp(message.publishTime);
    this.received = Date.now();
    this._length = this.data.length;
    this._subscriber = sub;
  }
  /**
   * In case the user tampers with the message data, we want to preserve the
   * original message size for accurate inventory mangement.
   *
   * @type {number}
   */
  get length() {
    return this._length;
  }
  /**
   * Acknowledges the message.
   */
  ack(): void {
    this._subscriber.ack(this);
  }
  /**
   * Modifies the acknowledge deadline 0, causing the message to be
   * re-delivered.
   *
   * @param {number} [delay=0] The desired time to wait before the
   *     re-delivery occurs.
   */
  nack(delay?: number): void {
    this._subscriber.nack(this, delay);
  }
  /**
   * Formats the protobuf timestamp into a JavaScript date.
   *
   * @private
   *
   * @param {object} timestamp The protobuf timestamp.
   * @return {date}
   */
  static _formatTimestamp({nanos = 0, seconds = 0}: protobuf.ITimestamp): Date {
    const ms: number = Number(nanos) / 1e6;
    const s: number = Number(seconds) * 1000;
    return new Date(ms + s);
  }
}

/**
 * @typedef {object} MessageStreamOptions
 * @property {number} [maxStreams=5] The number of connections to make.
 * @property {number} [timeout=300000] Deadline for establishing a connection.
 */
export interface MessageStreamOptions {
  maxStreams?: number;
  timeout?: number;
}

/**
 * Streaming interface used to manage multiple StreamingPull requests.
 *
 * @see https://nodejs.org/api/stream.html#stream_class_stream_transform
 *
 * @private
 * @class
 *
 * @param {Subscriber} sub The parent subscriber.
 * @param {MessageStreamOptions} [options] The message steam options.
 */
export class MessageStream extends Transform {
  destroyed: boolean;
  _filling: boolean;
  _keepAliveHandle: NodeJS.Timer;
  _options!: MessageStreamOptions;
  _streams: Set<GrpcDuplex>;
  _subscriber: Subscriber;
  constructor(sub: Subscriber, options = {}) {
    super({objectMode: true, highWaterMark: 0});

    this.destroyed = false;
    this._filling = false;
    this._streams = new Set();
    this._subscriber = sub;
    this._keepAliveHandle =
        setInterval(() => this._keepAlive(), KEEP_ALIVE_INTERVAL);

    this.setOptions(options);
  }
  /**
   * @type {boolean}
   */
  get _needsFill(): boolean {
    return this._streams.size < this._options.maxStreams!;
  }
  /**
   * Merges a stream.
   *
   * @param {stream} stream The client duplex stream.
   */
  add(stream: GrpcDuplex): void {
    this._streams.add(stream);

    stream._readableState.highWaterMark = 0;
    stream._writableState.highWaterMark = 0;

    stream.once('response', () => {
      stream.stream._readableState.highWaterMark = 0;
      stream.stream._writableState.highWaterMark = 0;
    });

    stream.on('error', err => this._onerror(stream, err))
        .once('status', status => this._onstatus(stream, status))
        .pipe(this, {end: false});
  }
  /**
   * Removes a stream.
   *
   * @param {stream} stream The stream to remove.
   */
  remove(stream: GrpcDuplex): void {
    if (!this._streams.has(stream)) {
      return;
    }

    stream.unpipe(this);
    stream.destroy();

    this._streams.delete(stream);
  }
  /**
   * Sets/updates the streaming options.
   *
   * @param {MessageStreamOptions} options The message stream options.
   */
  setOptions(options): void {
    const defaults: MessageStreamOptions = {maxStreams: 5, timeout: 300000};

    this._options = Object.assign(defaults, options);

    if (this._streams.size !== this._options.maxStreams) {
      this._resize();
    }
  }
  /**
   * Should not be called directly, will be called via Transform#destroy.
   *
   * @see https://nodejs.org/api/stream.html#stream_readable_destroy_err_callback
   *
   * @private
   *
   * @param {error?} err An error, if any.
   * @param {function} callback The callback function.
   */
  _destroy(err, callback): void {
    this.destroyed = true;

    clearInterval(this._keepAliveHandle);

    this._streams.forEach(stream => {
      this.remove(stream);
      stream.cancel();
    });

    return super._destroy(err, callback);
  }
  /**
   * Attempts to create and cache the desired number of streamingPull requests.
   * gRPC does not supply a way to confirm that a stream is connected, so our
   * best bet is to open the streams and use the client.waitForReady() method.
   *
   * @private
   *
   * @returns {Promise}
   */
  async _fill(): Promise<void> {
    if (this._filling || !this._needsFill) {
      return;
    }

    this._filling = true;

    let client;

    try {
      client = await this._subscriber.getClient();
    } catch (e) {
      this.destroy(e);
      return;
    }

    if (this.destroyed) {
      return;
    }

    const subscription = this._subscriber.name;
    const streamAckDeadlineSeconds = this._subscriber.ackDeadline;

    for (let i = this._streams.size; i < this._options.maxStreams!; i++) {
      const stream: GrpcDuplex = client.streamingPull();
      this.add(stream);
      stream.write({subscription, streamAckDeadlineSeconds});
    }

    this._filling = false;

    try {
      await this._waitForClientReady(client);
    } catch (e) {
      this.destroy(e);
    }
  }
  /**
   * Sometimes a gRPC status will be emitted as a status and then an error.
   * In order to cut back on emitted errors, we'll ignore any errors that come
   * in AFTER the status event has been emitted.
   *
   * @private
   *
   * @param {stream} stream The stream that errored.
   * @param {Error} err The error.
   */
  _onerror(stream: GrpcDuplex, err: Error): void {
    if (this._streams.has(stream)) {
      this.emit('error', err);
    }
  }
  /**
   * gRPC streams will emit a status event once they are closed. We'll use said
   * event in place of something more traditional like end/close to determine
   * the reason why the stream closed and if its safe to open a new one.
   *
   * @private
   *
   * @param {stream} stream The stream that was closed.
   * @param {object} status The status message stating why it was closed.
   */
  _onstatus(stream: GrpcDuplex, status: StatusObject): void {
    this.remove(stream);

    if (this.destroyed || this._filling) {
      return;
    }

    if (RETRY_CODES.includes(status.code)) {
      this._fill();
    } else if (!this._streams.size) {
      this.destroy(new StatusError(status));
    }
  }
  /**
   * In the event that the desired number of streams is set/updated, we'll use
   * this method to determine if we need to create or close more streams.
   * Calling stream.cancel() should emit a status event.
   *
   * @see {MessageStream#_onstatus}
   *
   * @private
   */
  _resize(): void {
    if (this._needsFill) {
      this._fill();
      return;
    }

    for (let i = this._streams.size; i > this._options.maxStreams!; i--) {
      const stream = this._streams.values().next().value;
      this.remove(stream);
      stream.cancel();
    }
  }
  /**
   * Since we do not use the streams to ack/modAck messages, they will close
   * by themselves unless we periodically send empty messages.
   *
   * @private
   */
  _keepAlive(): void {
    this._streams.forEach(stream => stream.write({}));
  }
  /**
   * Should not be called directly. Will be called via readable class methods.
   *
   * Transform function used to transform the pubsub pull response into
   * individual {@link Message} objects.
   *
   * @see https://nodejs.org/api/stream.html#stream_transform_transform_chunk_encoding_callback
   * @see https://cloud.google.com/pubsub/docs/reference/rest/v1/projects.subscriptions/pull#body.PullResponse
   *
   * @private
   *
   * @param {object} chunk The API response.
   * @param {string} encoding Chunk encoding. We don't care about this since
   *     we are using an object mode stream.
   * @param {function} next The callback function that should be called when
   *     done processing the chunk.
   */
  _transform(chunk: PullResponse, encoding: string, next: Function): void {
    chunk.receivedMessages.forEach(message => {
      this.push(new Message(this._subscriber, message));
    });
    next();
  }
  /**
   * Promisified version of gRPCs client.waitForReady function.
   *
   * @private
   *
   * @param {object} client The gRPC client to wait for.
   * @returns {Promise}
   */
  _waitForClientReady(client: ClientStub): Promise<void> {
    const deadline = Date.now() + this._options.timeout!;
    return promisify(client.waitForReady).call(client, deadline);
  }
}
