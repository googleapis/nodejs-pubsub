/*!
 * Copyright 2014 Google Inc. All Rights Reserved.
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

/*!
 * @module pubsub/iam
 */

'use strict';

var arrify = require('arrify');
var common = require('@google-cloud/common');
var is = require('is');

/*! Developer Documentation
 *
 * @param {module:pubsub} pubsub - PubSub Object.
 * @param {string} id - The name of the topic or subscription.
 */
/**
 * [IAM (Identity and Access Management)](https://cloud.google.com/pubsub/access_control)
 * allows you to set permissions on invidual resources and offers a wider range
 * of roles: editor, owner, publisher, subscriber, and viewer. This gives you
 * greater flexibility and allows you to set more fine-grained access control.
 *
 * For example:
 *   * Grant access on a per-topic or per-subscription basis, rather than for
 *     the whole Cloud project.
 *   * Grant access with limited capabilities, such as to only publish messages
 *     to a topic, or to only to consume messages from a subscription, but not
 *     to delete the topic or subscription.
 *
 *
 * *The IAM access control features described in this document are Beta,
 * including the API methods to get and set IAM policies, and to test IAM
 * permissions. Cloud Pub/Sub's use of IAM features is not covered by any
 * SLA or deprecation policy, and may be subject to backward-incompatible
 * changes.*
 *
 * @constructor
 * @alias module:pubsub/iam
 *
 * @resource [Access Control Overview]{@link https://cloud.google.com/pubsub/access_control}
 * @resource [What is Cloud IAM?]{@link https://cloud.google.com/iam/}
 *
 * @example
 * var topic = pubsub.topic('my-topic');
 * // topic.iam
 *
 * var subscription = pubsub.subscription('my-subscription');
 * // subscription.iam
 */
function IAM(pubsub, id) {
  this.pubsub = pubsub;
  this.request = pubsub.request.bind(pubsub);
  this.id = id;
}

/**
 * Get the IAM policy
 *
 * @param {object=} gaxOptions - Request configuration options, outlined
 *     here: https://googleapis.github.io/gax-nodejs/CallSettings.html.
 * @param {function} callback - The callback function.
 * @param {?error} callback.err - An error returned while making this request.
 * @param {object} callback.policy - The [policy](https://cloud.google.com/pubsub/docs/reference/rest/Shared.Types/Policy).
 * @param {object} callback.apiResponse - The full API response.
 *
 * @resource [Topics: getIamPolicy API Documentation]{@link https://cloud.google.com/pubsub/docs/reference/rest/v1/projects.topics/getIamPolicy}
 * @resource [Subscriptions: getIamPolicy API Documentation]{@link https://cloud.google.com/pubsub/docs/reference/rest/v1/projects.subscriptions/getIamPolicy}
 *
 * @example
 * topic.iam.getPolicy(function(err, policy, apiResponse) {});
 *
 * subscription.iam.getPolicy(function(err, policy, apiResponse) {});
 *
 * //-
 * // If the callback is omitted, we'll return a Promise.
 * //-
 * topic.iam.getPolicy().then(function(data) {
 *   var policy = data[0];
 *   var apiResponse = data[1];
 * });
 */
IAM.prototype.getPolicy = function(gaxOpts, callback) {
  if (is.fn(gaxOpts)) {
    callback = gaxOpts;
    gaxOpts = null;
  }

  var reqOpts = {
    resource: this.id,
  };

  this.request(
    {
      client: 'SubscriberClient',
      method: 'getIamPolicy',
      reqOpts: reqOpts,
      gaxOpts: gaxOpts,
    },
    callback
  );
};

/**
 * Set the IAM policy
 *
 * @throws {Error} If no policy is provided.
 *
 * @param {object} policy - The [policy](https://cloud.google.com/pubsub/docs/reference/rest/Shared.Types/Policy).
 * @param {array=} policy.bindings - Bindings associate members with roles.
 * @param {Array<object>=} policy.rules - Rules to be applied to the policy.
 * @param {string=} policy.etag - Etags are used to perform a read-modify-write.
 * @param {object=} gaxOptions - Request configuration options, outlined
 *     here: https://googleapis.github.io/gax-nodejs/CallSettings.html.
 * @param {function} callback - The callback function.
 * @param {?error} callback.err - An error returned while making this request.
 * @param {object} callback.policy - The updated policy.
 * @param {object} callback.apiResponse - The full API response.
 *
 * @resource [Topics: setIamPolicy API Documentation]{@link https://cloud.google.com/pubsub/docs/reference/rest/v1/projects.topics/setIamPolicy}
 * @resource [Subscriptions: setIamPolicy API Documentation]{@link https://cloud.google.com/pubsub/docs/reference/rest/v1/projects.subscriptions/setIamPolicy}
 * @resource [Policy]{@link https://cloud.google.com/pubsub/docs/reference/rest/Shared.Types/Policy}
 *
 * @example
 * var myPolicy = {
 *   bindings: [
 *     {
 *       role: 'roles/pubsub.subscriber',
 *       members: ['serviceAccount:myotherproject@appspot.gserviceaccount.com']
 *     }
 *   ]
 * };
 *
 * topic.iam.setPolicy(myPolicy, function(err, policy, apiResponse) {});
 *
 * subscription.iam.setPolicy(myPolicy, function(err, policy, apiResponse) {});
 *
 * //-
 * // If the callback is omitted, we'll return a Promise.
 * //-
 * topic.iam.setPolicy(myPolicy).then(function(data) {
 *   var policy = data[0];
 *   var apiResponse = data[1];
 * });
 */
IAM.prototype.setPolicy = function(policy, gaxOpts, callback) {
  if (!is.object(policy)) {
    throw new Error('A policy object is required.');
  }

  if (is.fn(gaxOpts)) {
    callback = gaxOpts;
    gaxOpts = null;
  }

  var reqOpts = {
    resource: this.id,
    policy,
  };

  this.request(
    {
      client: 'SubscriberClient',
      method: 'setIamPolicy',
      reqOpts: reqOpts,
      gaxOpts: gaxOpts,
    },
    callback
  );
};

/**
 * Test a set of permissions for a resource.
 *
 * Permissions with wildcards such as `*` or `storage.*` are not allowed.
 *
 * @throws {Error} If permissions are not provided.
 *
 * @param {string|string[]} permissions - The permission(s) to test for.
 * @param {object=} gaxOptions - Request configuration options, outlined
 *     here: https://googleapis.github.io/gax-nodejs/CallSettings.html.
 * @param {function} callback - The callback function.
 * @param {?error} callback.err - An error returned while making this request.
 * @param {array} callback.permissions - A subset of permissions that the caller
 *     is allowed
 * @param {object} callback.apiResponse - The full API response.
 *
 * @resource [Topics: testIamPermissions API Documentation]{@link https://cloud.google.com/pubsub/docs/reference/rest/v1/projects.topics/testIamPermissions}
 * @resource [Subscriptions: testIamPermissions API Documentation]{@link https://cloud.google.com/pubsub/docs/reference/rest/v1/projects.subscriptions/testIamPermissions}
 * @resource [Permissions Reference]{@link https://cloud.google.com/pubsub/access_control#permissions}
 *
 * @example
 * //-
 * // Test a single permission.
 * //-
 * var test = 'pubsub.topics.update';
 *
 * topic.iam.testPermissions(test, function(err, permissions, apiResponse) {
 *   console.log(permissions);
 *   // {
 *   //   "pubsub.topics.update": true
 *   // }
 * });
 *
 * //-
 * // Test several permissions at once.
 * //-
 * var tests = [
 *   'pubsub.subscriptions.consume',
 *   'pubsub.subscriptions.update'
 * ];
 *
 * subscription.iam.testPermissions(tests, function(err, permissions) {
 *   console.log(permissions);
 *   // {
 *   //   "pubsub.subscriptions.consume": true,
 *   //   "pubsub.subscriptions.update": false
 *   // }
 * });
 *
 * //-
 * // If the callback is omitted, we'll return a Promise.
 * //-
 * topic.iam.testPermissions(test).then(function(data) {
 *   var permissions = data[0];
 *   var apiResponse = data[1];
 * });
 */
IAM.prototype.testPermissions = function(permissions, gaxOpts, callback) {
  if (!is.array(permissions) && !is.string(permissions)) {
    throw new Error('Permissions are required.');
  }

  if (is.fn(gaxOpts)) {
    callback = gaxOpts;
    gaxOpts = null;
  }

  var reqOpts = {
    resource: this.id,
    permissions: arrify(permissions),
  };

  this.request(
    {
      client: 'SubscriberClient',
      method: 'testIamPermissions',
      reqOpts: reqOpts,
      gaxOpts: gaxOpts,
    },
    function(err, resp) {
      if (err) {
        callback(err, null, resp);
        return;
      }

      var availablePermissions = arrify(resp.permissions);
      var permissionHash = permissions.reduce(function(acc, permission) {
        acc[permission] = availablePermissions.indexOf(permission) > -1;
        return acc;
      }, {});

      callback(null, permissionHash, resp);
    }
  );
};

/*! Developer Documentation
 *
 * All async methods (except for streams) will return a Promise in the event
 * that a callback is omitted.
 */
common.util.promisifyAll(IAM);

module.exports = IAM;
