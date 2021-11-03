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
import {Attributes} from './publisher';
import {PubSub} from './pubsub';

// Unlike the earlier classes, this one does not do its own gax access.
// Rather, it calls back through the schemaClient instance PubSub holds.
// This class is a very lightweight syntactic wrapper around the GAPIC client.

/**
 * A Schema object allows you to interact with a Cloud Pub/Sub schema.
 *
 * This should only be instantiated by the PubSub class. To obtain an
 * instance for end user usage, call pubsub.schema().
 *
 * @class
 * @param {PubSub} pubsub The PubSub object creating this object.
 * @param {id} id name or ID of the schema.
 *
 * @example Creating an instance of this class.
 * ```
 * const {PubSub} = require('@google-cloud/pubsub');
 * const pubsub = new PubSub();
 *
 * const schema = pubsub.schema('my-schema');
 *
 * ```
 * @example Getting the details of a schema. Note that Schema methods do not provide a callback interface. Use .then() or await.
 * ```
 * const {PubSub} = require('@google-cloud/pubsub');
 * const pubsub = new PubSub();
 *
 * const schema = pubsub.schema('my-schema');
 * schema.get(SchemaViews.Basic).then(console.log);
 * ```
 */
export class Schema {
  id: string;
  name_?: string;
  pubsub: PubSub;

  constructor(pubsub: PubSub, idOrName: string) {
    /**
     * The parent {@link PubSub} instance of this topic instance.
     * @name Schema#pubsub
     * @type {PubSub}
     */
    this.pubsub = pubsub;

    /**
     * The fully qualified name of this schema. We will qualify this if
     * it's only an ID passed (assuming the parent project). Unfortunately,
     * we might not be able to do that if our pubsub's client hasn't been
     * initialized. In that case, we just set the id and get the name later.
     * @name Schema#id
     * @type {string}
     */
    this.id =
      idOrName.indexOf('/') >= 0
        ? idOrName.substr(idOrName.lastIndexOf('/') + 1)
        : idOrName;
  }

  /**
   * Return the fully qualified name of this schema.
   *
   * Note that we have to verify that we have a projectId before returning this,
   * so we have to check that first.
   *
   * @return {Promise<string>} a Promise that resolves to the full schema name
   */
  async getName(): Promise<string> {
    if (!this.name_) {
      if (!this.pubsub.isIdResolved) {
        await this.pubsub.getClientConfig();
      }
      this.name_ = Schema.formatName_(this.pubsub.projectId, this.id);
    }
    return this.name_;
  }

  /**
   * Create a schema.
   *
   * @see [Schemas: create API Documentation]{@link https://cloud.google.com/pubsub/docs/reference/rest/v1/projects.schemas/create}
   *
   * @throws {Error} if the schema type is incorrect.
   * @throws {Error} if the definition is invalid.
   *
   * @param {SchemaType} type The type of the schema (Protobuf, Avro, etc).
   * @param {string} definition The text describing the schema in terms of the type.
   * @param {object} [options] Request configuration options, outlined
   *   here: https://googleapis.github.io/gax-nodejs/interfaces/CallOptions.html.
   * @returns {Promise<void>}
   *
   * @example Create a schema.
   * ```
   * const {PubSub} = require('@google-cloud/pubsub');
   * const pubsub = new PubSub();
   *
   * const schema = pubsub.schema('messageType');
   * await schema.create(
   *   SchemaTypes.Avro,
   *   '{...avro definition...}'
   * );
   * ```
   */
  async create(
    type: SchemaType,
    definition: string,
    gaxOpts?: CallOptions
  ): Promise<void> {
    const name = await this.getName();
    await this.pubsub.createSchema(name, type, definition, gaxOpts);
  }

  /**
   * Get full information about the schema from the service.
   *
   * @see [Schemas: getSchema API Documentation]{@link https://cloud.google.com/pubsub/docs/reference/rest/v1/projects.schemas/get}
   *
   * @param {google.pubsub.v1.SchemaView} [view] The type of schema object
   *   requested, which should be an enum value from {@link SchemaViews}. Defaults
   *   to Full.
   * @param {object} [options] Request configuration options, outlined
   *   here: https://googleapis.github.io/gax-nodejs/interfaces/CallOptions.html.
   * @returns {Promise<ISchema>}
   */
  async get(
    view: SchemaView = SchemaViews.Full,
    gaxOpts?: CallOptions
  ): Promise<ISchema> {
    const client = await this.pubsub.getSchemaClient_();
    const name = await this.getName();
    const [schema] = await client.getSchema(
      {
        name,
        view,
      },
      gaxOpts
    );

    return schema;
  }

  /**
   * Delete the schema from the project.
   *
   * @see [Schemas: deleteSchema API Documentation]{@link https://cloud.google.com/pubsub/docs/reference/rest/v1/projects.schemas/delete}
   *
   * @param {object} [options] Request configuration options, outlined
   *   here: https://googleapis.github.io/gax-nodejs/interfaces/CallOptions.html.
   * @returns {Promise<void>}
   */
  async delete(gaxOpts?: CallOptions): Promise<void> {
    const client = await this.pubsub.getSchemaClient_();
    const name = await this.getName();
    await client.deleteSchema(
      {
        name,
      },
      gaxOpts
    );
  }

  /**
   * Validate a message against this schema's definition.
   *
   * If you would like to validate a message against an arbitrary schema, please
   * use the {@link SchemaServiceClient} GAPIC class directly, using your
   * {@link PubSub} instance's configuration, via {@link PubSub#getClientConfig}.
   *
   * @see [Schemas: validateMessage API Documentation]{@link https://cloud.google.com/pubsub/docs/reference/rest/v1/projects.schemas/validateMessage}
   *
   * @throws {Error} if the validation fails.
   * @throws {Error} if other parameters are invalid.
   *
   * @param {string} message The message to validate.
   * @param {Encoding | "JSON" | "BINARY"} encoding The encoding of the message to validate.
   * @param {object} [options] Request configuration options, outlined
   *   here: https://googleapis.github.io/gax-nodejs/interfaces/CallOptions.html.
   * @returns {Promise<void>}
   */
  async validateMessage(
    message: string,
    encoding:
      | google.pubsub.v1.Encoding
      | keyof typeof google.pubsub.v1.Encoding,
    gaxOpts?: CallOptions
  ): Promise<void> {
    const client = await this.pubsub.getSchemaClient_();
    const name = await this.getName();

    await client.validateMessage(
      {
        parent: this.pubsub.name,
        name,
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
  static formatName_(projectId: string, nameOrId: string): string {
    if (typeof nameOrId !== 'string') {
      throw new Error('A name is required to identify a schema.');
    }

    // Simple check if the name is already formatted.
    if (nameOrId.indexOf('/') > -1) {
      return nameOrId;
    }
    return `projects/${projectId}/schemas/${nameOrId}`;
  }

  /**
   * Translates the schema attributes in messages delivered from Pub/Sub.
   * All resulting fields may end up being blank.
   */
  static metadataFromMessage(attributes: Attributes): SchemaMessageMetadata {
    return {
      name: attributes['googclient_schemaname'],
      encoding: attributes[
        'googclient_schemaencoding'
      ] as unknown as SchemaEncoding,
    };
  }
}

/**
 * Schema metadata that might be gathered from a Pub/Sub message.
 * This is created for you from {@link Schema#metadataForMessage}.
 */
export interface SchemaMessageMetadata {
  /**
   * Schema name; may be queried using {@link PubSub#schema}.
   */
  name?: string;

  /**
   * Encoding; this will be Encodings.Json or Encodings.Binary.
   */
  encoding: SchemaEncoding | undefined;
}

// Export all of these so that clients don't have to dig for them.
export type CreateSchemaResponse = google.pubsub.v1.Schema;
export type ISchema = google.pubsub.v1.ISchema;
export type SchemaType = keyof typeof google.pubsub.v1.Schema.Type;
export type SchemaView = keyof typeof google.pubsub.v1.SchemaView;
export type ICreateSchemaRequest = google.pubsub.v1.ICreateSchemaRequest;
export type SchemaEncoding = keyof typeof google.pubsub.v1.Encoding;

// Also export these for JavaScript compatible usage.
export const SchemaTypes = {
  ProtocolBuffer: 'PROTOCOL_BUFFER' as const,
  Avro: 'AVRO' as const,
};

export const SchemaViews = {
  Basic: 'BASIC' as const,
  Full: 'FULL' as const,
};

// These are not schema-specific, but this seems to be the
// only place that exports methods that need them.
export const Encodings = {
  Json: 'JSON' as const,
  Binary: 'BINARY' as const,
};
