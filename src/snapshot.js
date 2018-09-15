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

'use strict';

const util = require('./util');
const {promisifyAll} = require('@google-cloud/promisify');
const is = require('is');

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
class Snapshot {
  constructor(parent, name) {
    if (parent.Promise) {
      this.Promise = parent.Promise;
    }
    this.parent = parent;
    this.name = Snapshot.formatName_(parent.projectId, name);
    if (is.fn(parent.createSnapshot)) {
      /**
       * Create a snapshot with the given name.
       *
       * **This is only available if you accessed this object through
       * {@link Subscription#snapshot}.**
       *
       * @method Snapshot#create
       * @param {string} name Name of the snapshot.
       * @param {function} [callback] The callback function.
       * @param {?error} callback.err An error from the API call, may be null.
       * @param {Snapshot} callback.snapshot The newly created
       *     snapshot.
       * @param {object} callback.apiResponse The full API response from the
       *     service.
       *
       * @example
       * const subscription = pubsub.subscription('my-subscription');
       * const snapshot = subscription.snapshot('my-snapshot');
       *
       * const callback = (err, snapshot, apiResponse) => {
       *   if (!err) {
       *     // The snapshot was created successfully.
       *   }
       * };
       *
       * snapshot.create('my-snapshot', callback);
       *
       * //-
       * // If the callback is omitted, we'll return a Promise.
       * //-
       * snapshot.create('my-snapshot').then((data) => {
       *   const snapshot = data[0];
       *   const apiResponse = data[1];
       * });
       */
      this.create = parent.createSnapshot.bind(parent, name);
    }
    if (is.fn(parent.seek)) {
      /**
       * Seeks an existing subscription to the snapshot.
       *
       * **This is only available if you accessed this object through
       * {@link Subscription#snapshot}.**
       *
       * @method Snapshot#seek
       * @param {function} callback The callback function.
       * @param {?error} callback.err An error from the API call, may be null.
       * @param {object} callback.apiResponse The full API response from the
       *     service.
       *
       * @example
       * const subscription = pubsub.subscription('my-subscription');
       * const snapshot = subscription.snapshot('my-snapshot');
       *
       * snapshot.seek((err, apiResponse) => {});
       *
       * //-
       * // If the callback is omitted, we'll return a Promise.
       * //-
       * snapshot.seek().then((data) => {
       *   const apiResponse = data[0];
       * });
       */
      this.seek = parent.seek.bind(parent, name);
    }
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
  delete(callback) {
    const reqOpts = {
      snapshot: this.name,
    };
    callback = callback || util.noop;
    this.parent.request(
      {
        client: 'SubscriberClient',
        method: 'deleteSnapshot',
        reqOpts: reqOpts,
      },
      callback
    );
  }
  /*@
   * Format the name of a snapshot. A snapshot's full name is in the format of
   * projects/{projectId}/snapshots/{snapshotName}
   *
   * @private
   */
  static formatName_(projectId, name) {
    return 'projects/' + projectId + '/snapshots/' + name.split('/').pop();
  }
}

/*! Developer Documentation
 *
 * All async methods (except for streams) will return a Promise in the event
 * that a callback is omitted.
 */
promisifyAll(Snapshot);

module.exports = Snapshot;
