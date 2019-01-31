/*!
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

import {promisifyAll} from '@google-cloud/promisify';
import {CallOptions} from 'google-gax';
import {google} from '../proto/pubsub';
import {CreateSnapshotCallback, CreateSnapshotResponse, RequestCallback, Subscription} from '.';
import {PubSub} from './index';
import * as util from './util';

/**
 * A Snapshot object will give you access to your Cloud Pub/Sub snapshot.
 *
 * Snapshots are sometimes retrieved when using various methods:
 *
 * - {@link PubSub#getSnapshots}
 * - {@link PubSub#getSnapshotsStream}
 * - {@link PubSub#snapshot}
 *
 * Snapshots may be created with:
 *
 * - {@link Subscription#createSnapshot}
 *
 * You can use snapshots to seek a subscription to a specific point in time.
 *
 * - {@link Subscription#seek}
 *
 * @class
 *
 * @example
 * //-
 * // From {@link PubSub#getSnapshots}:
 * //-
 * pubsub.getSnapshots((err, snapshots) => {
 *   // `snapshots` is an array of Snapshot objects.
 * });
 *
 * //-
 * // From {@link PubSub#getSnapshotsStream}:
 * //-
 * pubsub.getSnapshotsStream()
 *   .on('error', console.error)
 *   .on('data', (snapshot) => {
 *     // `snapshot` is a Snapshot object.
 *   });
 *
 * //-
 * // From {@link PubSub#snapshot}:
 * //-
 * const snapshot = pubsub.snapshot('my-snapshot');
 * // snapshot is a Snapshot object.
 *
 * //-
 * // Create a snapshot with {module:pubsub/subscription#createSnapshot}:
 * //-
 * const subscription = pubsub.subscription('my-subscription');
 *
 * subscription.createSnapshot('my-snapshot', (err, snapshot) => {
 *   if (!err) {
 *     // `snapshot` is a Snapshot object.
 *   }
 * });
 *
 * //-
 * // Seek to your snapshot:
 * //-
 * const subscription = pubsub.subscription('my-subscription');
 *
 * subscription.seek('my-snapshot', (err) => {
 *   if (err) {
 *     // Error handling omitted.
 *   }
 * });
 */
export class Snapshot {
  parent: Subscription|PubSub;
  name: string;
  // tslint:disable-next-line variable-name
  Promise?: PromiseConstructor;
  metadata!: google.pubsub.v1.Snapshot;
  constructor(parent: Subscription|PubSub, name: string) {
    if (parent instanceof PubSub) {
      this.Promise = parent.Promise;
    }
    this.parent = parent;
    this.name = Snapshot.formatName_(parent.projectId, name);
  }

  /**
   * Delete the snapshot.
   *
   * @param {function} [callback] The callback function.
   * @param {?error} callback.err An error returned while making this
   *     request.
   * @param {object} callback.apiResponse The full API response from the
   *     service.
   *
   * @example
   * snapshot.delete((err, apiResponse) => {});
   *
   * //-
   * // If the callback is omitted, we'll return a Promise.
   * //-
   * snapshot.delete().then((data) => {
   *   const apiResponse = data[0];
   * });
   */
  delete(): Promise<google.protobuf.Empty>;
  delete(callback: RequestCallback<google.protobuf.Empty>): void;
  delete(callback?: RequestCallback<google.protobuf.Empty>):
      void|Promise<google.protobuf.Empty> {
    const reqOpts = {
      snapshot: this.name,
    };
    callback = callback || util.noop;
    (this.parent as PubSub)
        .request<google.protobuf.Empty>(
            {
              client: 'SubscriberClient',
              method: 'deleteSnapshot',
              reqOpts,
            },
            callback);
  }
  /*@
   * Format the name of a snapshot. A snapshot's full name is in the format of
   * projects/{projectId}/snapshots/{snapshotName}
   *
   * @private
   */
  static formatName_(projectId: string, name: string) {
    return 'projects/' + projectId + '/snapshots/' + name.split('/').pop();
  }


  create(gaxOpts?: CallOptions): Promise<CreateSnapshotResponse>;
  create(callback: CreateSnapshotCallback): void;
  create(gaxOpts: CallOptions, callback: CreateSnapshotCallback): void;
  create(
      gaxOpts?: CallOptions|CreateSnapshotCallback,
      callback?: CreateSnapshotCallback): void|Promise<CreateSnapshotResponse> {
    if (!(this.parent instanceof Subscription)) {
      throw new Error(
          `This is only available if you accessed this object through {@link Subscription#snapshot}`);
    }
    return (this.parent as Subscription)
        .createSnapshot(this.name, gaxOpts! as CallOptions, callback!);
  }

  seek(gaxOpts?: CallOptions): Promise<google.pubsub.v1.SeekResponse>;
  seek(callback: google.pubsub.v1.Subscriber.SeekCallback): void;
  seek(
      gaxOpts: CallOptions,
      callback: google.pubsub.v1.Subscriber.SeekCallback): void;
  seek(
      gaxOpts?: CallOptions|google.pubsub.v1.Subscriber.SeekCallback,
      callback?: google.pubsub.v1.Subscriber.SeekCallback):
      void|Promise<google.pubsub.v1.SeekResponse> {
    if (!(this.parent instanceof Subscription)) {
      throw new Error(
          `This is only available if you accessed this object through {@link Subscription#snapshot}`);
    }
    return (this.parent as Subscription)
        .seek(this.name, gaxOpts! as CallOptions, callback!);
  }
}



/*! Developer Documentation
 *
 * All async methods (except for streams) will return a Promise in the event
 * that a callback is omitted.
 */
promisifyAll(Snapshot);
