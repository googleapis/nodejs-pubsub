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
import * as isStreamEnded from 'is-stream-ended';
import {Duplex, PassThrough} from 'stream';

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

/*!
 * default stream options
 */
const DEFAULT_OPTIONS = {
  highWaterMark: 0,
  maxStreams: 5,
  timeout: 300000,
};

interface StreamState {
  highWaterMark: number;
}

interface GrpcDuplex extends Duplex {
  _writableState: StreamState;
  _readableState: StreamState;
  cancel(): void;
}

interface GaxDuplex extends GrpcDuplex {
  stream: GrpcDuplex;
  destroy(): void;
  setReadable(readable: GrpcDuplex): void;
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
 * @typedef {object} MessageStreamOptions
 * @property {number} [highWaterMark=0] Configures the Buffer level for all
 *     underlying streams. See
 *     {@link https://nodejs.org/en/docs/guides/backpressuring-in-streams/} for
 *     more details.
 * @property {number} [maxStreams=5] Number of streaming connections to make.
 * @property {number} [timeout=300000] Timeout for establishing a connection.
 */
export interface MessageStreamOptions {
  highWaterMark?: number;
  maxStreams?: number;
  timeout?: number;
}

/**
 * Streaming class used to manage multiple StreamingPull requests.
 *
 * @private
 * @class
 *
 * @param {Subscriber} sub The parent subscriber.
 * @param {MessageStreamOptions} [options] The message stream options.
 */
export class MessageStream extends PassThrough {
  destroyed: boolean;
  private _keepAliveHandle: NodeJS.Timer;
  private _options: MessageStreamOptions;
  private _streams: Map<GaxDuplex, boolean>;
  private _subscriber: Subscriber;
  constructor(sub: Subscriber, options = {} as MessageStreamOptions) {
    const {highWaterMark = 0} = options;
    super({objectMode: true, highWaterMark});

    this.destroyed = false;
    this._streams = new Map();
    this._subscriber = sub;
    this._options = Object.assign({}, DEFAULT_OPTIONS, options);

    this._fillStreamPool();

    this._keepAliveHandle =
        setInterval(() => this._keepAlive(), KEEP_ALIVE_INTERVAL);
    this._keepAliveHandle.unref();
  }
  /**
   * Destroys the stream and any underlying streams.
   *
   * @param {error?} err An error to emit, if any.
   */
  destroy(err?: Error): void {
    if (this.destroyed) {
      return;
    }

    this.destroyed = true;
    clearInterval(this._keepAliveHandle);

    for (const stream of this._streams.keys()) {
      this._removeStream(stream);
      stream.cancel();
    }

    if (super.destroy) {
      return super.destroy(err);
    }

    process.nextTick(() => {
      if (err) {
        this.emit('error', err);
      }
      this.emit('close');
    });
  }
  /**
   * Adds a StreamingPull stream to the combined stream.
   *
   * @private
   *
   * @param {stream} stream The StreamingPull stream.
   */
  private _addStream(stream: GaxDuplex): void {
    this._setHighWaterMark(stream);
    this._streams.set(stream, false);

    if (stream.stream) {
      this._setHighWaterMark(stream.stream);
    } else {
      this._interceptGrpcStream(stream);
    }

    stream.on('error', err => this._onError(stream, err))
        .once('status', status => this._onStatus(stream, status))
        .pipe(this, {end: false});
  }
  /**
   * Attempts to create and cache the desired number of StreamingPull requests.
   * gRPC does not supply a way to confirm that a stream is connected, so our
   * best bet is to open the streams and use the client.waitForReady() method to
   * confirm everything is ok.
   *
   * @private
   *
   * @returns {Promise}
   */
  private async _fillStreamPool(): Promise<void> {
    let client;

    try {
      client = await this._subscriber.getClient();
    } catch (e) {
      this.destroy(e);
    }

    if (this.destroyed) {
      return;
    }

    const subscription = this._subscriber.name;
    const streamAckDeadlineSeconds = this._subscriber.ackDeadline;

    for (let i = this._streams.size; i < this._options.maxStreams!; i++) {
      const stream: GaxDuplex = client.streamingPull();
      this._addStream(stream);
      stream.write({subscription, streamAckDeadlineSeconds});
    }

    try {
      await this._waitForClientReady(client);
    } catch (e) {
      this.destroy(e);
    }
  }
  /**
   * gax streams are basically just proxy streams that allow grpc streams to be
   * created and set asychronously without the user having to deal with that.
   * However since there isn't a way to specify the flow control limits on any
   * grpc stream or tap into an event when its been created, we'll stub the
   * setter method to adjust the highWaterMark before data starts flowing.
   *
   * @private
   *
   * @param {stream} stream Duplexify stream.
   */
  private _interceptGrpcStream(stream: GaxDuplex): void {
    const setReadable = stream.setReadable;

    // gax streams are basically just a proxy for grpc streams, which are set
    // asynchronously.
    stream.setReadable = (readable: GrpcDuplex): void => {
      stream.setReadable = setReadable;
      this._setHighWaterMark(readable);
      return setReadable.call(stream, readable);
    };
  }
  /**
   * Since we do not use the streams to ack/modAck messages, they will close
   * by themselves unless we periodically send empty messages.
   *
   * @private
   */
  private _keepAlive(): void {
    for (const stream of this._streams.keys()) {
      stream.write({});
    }
  }
  /**
   * Once the stream has nothing left to read, we'll remove it and attempt to
   * refill our stream pool if needed.
   *
   * @private
   *
   * @param {Duplex} stream The ended stream.
   * @param {object} status The stream status.
   */
  private _onEnd(stream: GaxDuplex, status: StatusObject): void {
    this._removeStream(stream);

    if (RETRY_CODES.includes(status.code)) {
      this._fillStreamPool();
    } else if (!this._streams.size) {
      this.destroy(new StatusError(status));
    }
  }
  /**
   * Sometimes a gRPC status will be emitted as both a status event and an
   * error event. In order to cut back on emitted errors, we'll ignore any
   * error events that come in AFTER the status has been received.
   *
   * @private
   *
   * @param {stream} stream The stream that errored.
   * @param {Error} err The error.
   */
  private _onError(stream: GaxDuplex, err: Error): void {
    const code = (err as StatusError).code;
    const receivedStatus = this._streams.get(stream) !== false;

    if (typeof code !== 'number' || !receivedStatus) {
      this.emit('error', err);
    }
  }
  /**
   * gRPC streams will emit a status event once the connection has been
   * terminated. This is preferable to end/close events because we'll receive
   * information as to why the stream closed and if it is safe to open another.
   *
   * @private
   *
   * @param {stream} stream The stream that was closed.
   * @param {object} status The status message stating why it was closed.
   */
  private _onStatus(stream: GaxDuplex, status: StatusObject): void {
    if (this.destroyed) {
      stream.destroy();
      return;
    }

    this._streams.set(stream, true);

    if (isStreamEnded(stream)) {
      this._onEnd(stream, status);
    } else {
      stream.once('end', () => this._onEnd(stream, status));
      stream.push(null);
    }
  }
  /**
   * Removes a stream from the combined stream.
   *
   * @private
   *
   * @param {stream} stream The stream to remove.
   */
  private _removeStream(stream: GaxDuplex): void {
    stream.unpipe(this);
    this._streams.delete(stream);
  }
  /**
   * Neither gRPC or gax allow for the highWaterMark option to be specified.
   * However using the default value (16) it is possible to end up with a lot of
   * PullResponse objects stored in internal buffers. If this were to happen
   * and the client were slow to process messages, we could potentially see a
   * very large number of redeliveries happen before the messages even made it
   * to the client.
   *
   * @private
   *
   * @param {Duplex} stream The duplex stream to adjust the
   *     highWaterMarks for.
   */
  private _setHighWaterMark(stream: GrpcDuplex): void {
    stream._readableState.highWaterMark = this._options.highWaterMark!;
    stream._writableState.highWaterMark = this._options.highWaterMark!;
  }
  /**
   * Promisified version of gRPCs Client#waitForReady function.
   *
   * @private
   *
   * @param {object} client The gRPC client to wait for.
   * @returns {Promise}
   */
  private _waitForClientReady(client: ClientStub): Promise<void> {
    const deadline = Date.now() + this._options.timeout!;
    return promisify(client.waitForReady).call(client, deadline);
  }
}
