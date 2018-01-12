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

var common = require('@google-cloud/common');
var is = require('is');

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
 * pubsub.getSnapshots(function(err, snapshots) {
 *   // `snapshots` is an array of Snapshot objects.
 * });
 *
 * //-
 * // From {@link PubSub#getSnapshotsStream}:
 * //-
 * pubsub.getSnapshotsStream()
 *   .on('error', console.error)
 *   .on('data', function(snapshot) {
 *     // `snapshot` is a Snapshot object.
 *   });
 *
 * //-
 * // From {@link PubSub#snapshot}:
 * //-
 * var snapshot = pubsub.snapshot('my-snapshot');
 * // snapshot is a Snapshot object.
 *
 * //-
 * // Create a snapshot with {module:pubsub/subscription#createSnapshot}:
 * //-
 * var subscription = pubsub.subscription('my-subscription');
 *
 * subscription.createSnapshot('my-snapshot', function(err, snapshot) {
 *   if (!err) {
 *     // `snapshot` is a Snapshot object.
 *   }
 * });
 *
 * //-
 * // Seek to your snapshot:
 * //-
 * var subscription = pubsub.subscription('my-subscription');
 *
 * subscription.seek('my-snapshot', function(err) {
 *   if (err) {
 *     // Error handling omitted.
 *   }
 * });
 */
function Snapshot(parent, name) {
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
     * var subscription = pubsub.subscription('my-subscription');
     * var snapshot = subscription.snapshot('my-snapshot');
     *
     * var callback = function(err, snapshot, apiResponse) {
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
     * snapshot.create('my-snapshot').then(function(data) {
     *   var snapshot = data[0];
     *   var apiResponse = data[1];
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
     * var subscription = pubsub.subscription('my-subscription');
     * var snapshot = subscription.snapshot('my-snapshot');
     *
     * snapshot.seek(function(err, apiResponse) {});
     *
     * //-
     * // If the callback is omitted, we'll return a Promise.
     * //-
     * snapshot.seek().then(function(data) {
     *   var apiResponse = data[0];
     * });
     */
    this.seek = parent.seek.bind(parent, name);
  }
}

/*@
 * Format the name of a snapshot. A snapshot's full name is in the format of
 * projects/{projectId}/snapshots/{snapshotName}
 *
 * @private
 */
Snapshot.formatName_ = function(projectId, name) {
  return 'projects/' + projectId + '/snapshots/' + name.split('/').pop();
};

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
 * snapshot.delete(function(err, apiResponse) {});
 *
 * //-
 * // If the callback is omitted, we'll return a Promise.
 * //-
 * snapshot.delete().then(function(data) {
 *   var apiResponse = data[0];
 * });
 */
Snapshot.prototype.delete = function(callback) {
  var reqOpts = {
    snapshot: this.name,
  };

  callback = callback || common.util.noop;

  this.parent.request(
    {
      client: 'SubscriberClient',
      method: 'deleteSnapshot',
      reqOpts: reqOpts,
    },
    callback
  );
};

/*! Developer Documentation
 *
 * All async methods (except for streams) will return a Promise in the event
 * that a callback is omitted.
 */
common.util.promisifyAll(Snapshot);

module.exports = Snapshot;
