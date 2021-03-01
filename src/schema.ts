// Copyright 2021 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {CallOptions} from 'google-gax';
import {google} from '../protos/protos';
import {IAM} from './iam';
import {PubSub} from './pubsub';

/**
 * A Schema object allows you to interact with a Cloud Pub/Sub schema.
 *
 * @class
 * @param {PubSub} pubsub PubSub object.
 * @param {id} id ID of the schema (non-qualified).
 *
 * @example <caption>Creating an instance of this class.</caption>
 * const {PubSub} = require('@google-cloud/pubsub');
 * const pubsub = new PubSub();
 *
 * const schema = pubsub.schema('my-schema');
 *
 * @example <caption>Getting the details of a schema. Note that Schema
 * methods do not provide a callback interface. Use .then() or await.</caption>
 * const {PubSub} = require('@google-cloud/pubsub');
 * const pubsub = new PubSub();
 *
 * const schema = pubsub.schema('my-schema');
 * schema.get(SchemaView.BASIC).then(console.log);
 */
export class Schema {
  name: string;
  pubsub: PubSub;
  iam: IAM;
  parent: string;

  constructor(pubsub: PubSub, name: string) {
    /**
     * The parent {@link PubSub} instance of this topic instance.
     * @name Schema#pubsub
     * @type {PubSub}
     */
    this.pubsub = pubsub;
    /**
     * The project name (full path) of the {@link PubSub} we're attached to.
     * @name Schema#parent
     * @type {string}
     */
    this.parent = this.pubsub.name;
    /**
     * The fully qualified name of this schema.
     * @name Schema#name
     * @type {string}
     */
    this.name = Schema.formatName_(pubsub.projectId, name);
    /**
     * [IAM (Identity and Access
     * Management)](https://cloud.google.com/pubsub/access_control) allows you
     * to set permissions on individual resources and offers a wider range of
     * roles: editor, owner, publisher, subscriber, and viewer. This gives you
     * greater flexibility and allows you to set more fine-grained access
     * control.
     *
     * *The IAM access control features described in this document are Beta,
     * including the API methods to get and set IAM policies, and to test IAM
     * permissions. Cloud Pub/Sub's use of IAM features is not covered by
     * any SLA or deprecation policy, and may be subject to
     * backward-incompatible changes.*
     *
     * @name Schema#iam
     * @mixes IAM
     *
     * @see [Access Control Overview]{@link https://cloud.google.com/pubsub/access_control}
     * @see [What is Cloud IAM?]{@link https://cloud.google.com/iam/}
     *
     * @example
     * const {PubSub} = require('@google-cloud/pubsub');
     * const pubsub = new PubSub();
     *
     * const schema = pubsub.schema('my-schema');
     *
     * //-
     * // Get the IAM policy for your schema.
     * //-
     * schema.iam.getPolicy((err, policy) => {
     *   console.log(policy);
     * });
     *
     * //-
     * // If the callback is omitted, we'll return a Promise.
     * //-
     * schema.iam.getPolicy().then((data) => {
     *   const policy = data[0];
     *   const apiResponse = data[1];
     * });
     */
    this.iam = new IAM(pubsub, this.name);
  }

  async create(
    type: SchemaType,
    definition: string,
    gaxOpts?: CallOptions
  ): Promise<void> {
    await this.pubsub.createSchema(this.name, type, definition, gaxOpts);
  }

  async get(view: SchemaView, gaxOpts?: CallOptions): Promise<ISchema> {
    const [schema] = await this.pubsub.schemaClient.getSchema(
      {
        name: this.name,
        view,
      },
      gaxOpts
    );

    return schema;
  }

  async delete(gaxOpts?: CallOptions): Promise<void> {
    await this.pubsub.schemaClient.deleteSchema(
      {
        name: this.name,
      },
      gaxOpts
    );
  }

  async validateSchema(schema: ISchema, gaxOpts?: CallOptions): Promise<void> {
    await this.pubsub.schemaClient.validateSchema(
      {
        parent: this.parent,
        schema,
      },
      gaxOpts
    );
  }

  async validateMessage(
    schema: ISchema,
    message: string | null,
    encoding: SchemaEncoding,
    gaxOpts?: CallOptions
  ): Promise<void> {
    await this.pubsub.schemaClient.validateMessage(
      {
        parent: this.parent,
        name: this.name,
        schema,
        message,
        encoding,
      },
      gaxOpts
    );
  }

  /*!
   * Format the name of a schema. A schema's full name is in the
   * format of projects/{projectId}/schemas/{schemaName}.
   *
   * The GAPIC client should do this for us, but since we maintain
   * names rather than IDs, this is simpler.
   *
   * @private
   */
  static formatName_(projectId: string, name: string): string {
    if (typeof name !== 'string') {
      throw new Error('A name is required to identify a schema.');
    }

    // Simple check if the name is already formatted.
    if (name.indexOf('/') > -1) {
      return name;
    }
    return `projects/${projectId}/schemas/${name}`;
  }
}

// Export all of these so that clients don't have to dig for them.
export type CreateSchemaResponse = google.pubsub.v1.Schema;
export type ISchema = google.pubsub.v1.ISchema;
export type SchemaType = google.pubsub.v1.Schema.Type;
export type SchemaView = google.pubsub.v1.SchemaView;
export type ICreateSchemaRequest = google.pubsub.v1.ICreateSchemaRequest;
export type SchemaEncoding = google.pubsub.v1.Encoding;

// Also export this for JavaScript compatible usage.
export const SchemaTypes = {
  ProtocolBuffer: google.pubsub.v1.Schema.Type.PROTOCOL_BUFFER,
  Avro: google.pubsub.v1.Schema.Type.AVRO,
};
