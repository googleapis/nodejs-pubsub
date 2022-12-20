/*!
 * Copyright 2020 Google LLC
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

import {
  Tracer,
  SpanContext,
  Span,
  context,
  trace,
  propagation,
  SpanKind,
  TextMapGetter,
  TextMapSetter,
  ROOT_CONTEXT,
  Context,
} from '@opentelemetry/api';
import {Attributes, PubsubMessage} from './publisher/pubsub-message';
import {PublishOptions} from './publisher/index';
import {SemanticAttributes} from '@opentelemetry/semantic-conventions';
import {Duration} from './temporal';

export {Span};

// We need this to get the library version.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require('../../package.json');

/**
 * Instantiates a Opentelemetry tracer for the library
 *
 * @private
 */
let cachedTracer: Tracer | undefined;
function getTracer(): Tracer {
  const tracer =
    cachedTracer ??
    trace.getTracer('@google-cloud/pubsub', packageJson.version);
  cachedTracer = tracer;
  return cachedTracer;
}

/**
 * Determination of the level of OTel support we're providing.
 *
 * @private
 */
export enum OpenTelemetryLevel {
  /**
   * None: OTel support is not enabled because we found no trace provider.
   */
  None = 0,

  /**
   * Legacy: We found a trace provider, but the user also specified the old
   * manual enable flag; this will trigger the legacy attribute being included.
   * The modern propagation attribute will _also_ be included.
   */
  Legacy = 1,

  /**
   * Modern: We will only inject/extract the modern propagation attribute.
   */
  Modern = 2,
}

/**
 * Tries to divine what sort of OpenTelemetry we're supporting. See the enum
 * for the meaning of the values, and other notes.
 *
 * Legacy OTel is no longer officially supported, but we don't want to
 * break anyone at a non-major.
 *
 * @private
 */
export function isEnabled(
  publishSettings?: PublishOptions
): OpenTelemetryLevel {
  // If there's no trace provider attached, do nothing in any case.
  const traceProvider = trace.getTracerProvider();
  if (!traceProvider) {
    return OpenTelemetryLevel.None;
  }

  if (publishSettings?.enableOpenTelemetryTracing) {
    return OpenTelemetryLevel.Legacy;
  }

  return OpenTelemetryLevel.Modern;
}

/**
 * Our Carrier object for propagation is anything with an 'attributes'
 * object, which is one of several possible Message classes. (They're
 * different for publish and subscribe.)
 *
 * Also we add a telemetrySpan optional member for passing around the
 * actual Span object within the client library.
 *
 * @private
 */
export interface MessageWithAttributes {
  attributes?: Attributes | null | undefined;
  telemetrySpan?: Span;
}

/**
 * Implements the TextMap getter and setter interfaces for Pub/Sub messages.
 *
 * @private
 */
export class PubsubMessageGetSet
  implements
    TextMapGetter<MessageWithAttributes>,
    TextMapSetter<MessageWithAttributes>
{
  static keyPrefix = 'googclient_';

  keys(carrier: MessageWithAttributes): string[] {
    return Object.getOwnPropertyNames(carrier.attributes)
      .filter(n => n.startsWith(PubsubMessageGetSet.keyPrefix))
      .map(n => n.substring(PubsubMessageGetSet.keyPrefix.length));
  }

  private attributeName(key: string): string {
    return `${PubsubMessageGetSet.keyPrefix}${key}`;
  }

  get(
    carrier: MessageWithAttributes,
    key: string
  ): string | string[] | undefined {
    return carrier?.attributes?.[this.attributeName(key)];
  }

  set(carrier: MessageWithAttributes, key: string, value: string): void {
    if (!carrier.attributes) {
      carrier.attributes = {};
    }
    carrier.attributes[this.attributeName(key)] = value;
  }
}

/**
 * The getter to use when calling extract() on a Pub/Sub message.
 *
 * @private
 */
export const pubsubGetter = new PubsubMessageGetSet();

/**
 * The setter to use when calling inject() on a Pub/Sub message.
 *
 * @private
 */
export const pubsubSetter = pubsubGetter;

/**
 * Description of the data structure passed for span attributes.
 *
 * @private
 */
export interface SpanAttributes {
  [x: string]: string | number;
}

/**
 * Converts a SpanContext to a full Context, as needed.
 *
 * @private
 */
export function spanContextToContext(
  parent?: SpanContext
): Context | undefined {
  return parent ? trace.setSpanContext(context.active(), parent) : undefined;
}

/**
 * The modern propagation attribute name.
 *
 * Technically this is determined by the OpenTelemetry library, but
 * in practice, it follows the W3C spec, so this should be the right
 * one. The only thing we're using it for, anyway, is emptying user
 * supplied attributes.
 *
 * @private
 */
export const modernAttributeName = 'googclient_traceparent';

/**
 * The old legacy attribute name.
 *
 * @private
 */
export const legacyAttributeName = 'googclient_OpenTelemetrySpanContext';

export class SpanMaker {
  static createPublisherSpan(message: PubsubMessage, topicName: string): Span {
    const spanAttributes = {
      // Add Opentelemetry semantic convention attributes to the span, based on:
      // https://github.com/open-telemetry/opentelemetry-specification/blob/v1.1.0/specification/trace/semantic_conventions/messaging.md
      [SemanticAttributes.MESSAGING_TEMP_DESTINATION]: false,
      [SemanticAttributes.MESSAGING_SYSTEM]: 'pubsub',
      [SemanticAttributes.MESSAGING_OPERATION]: 'send',
      [SemanticAttributes.MESSAGING_DESTINATION]: topicName,
      [SemanticAttributes.MESSAGING_DESTINATION_KIND]: 'topic',
      [SemanticAttributes.MESSAGING_PROTOCOL]: 'pubsub',
      [SemanticAttributes.MESSAGING_MESSAGE_PAYLOAD_SIZE_BYTES]:
        message.data?.length,
      'messaging.pubsub.ordering_key': message.orderingKey,
    } as SpanAttributes;

    const span: Span = getTracer().startSpan(`${topicName} send`, {
      kind: SpanKind.PRODUCER,
      attributes: spanAttributes,
    });

    return span;
  }

  static createReceiveSpan(
    message: MessageWithAttributes,
    subName: string,
    parent: Context | undefined
  ): Span {
    const name = `${subName} receive`;

    // Mostly we want to keep the context IDs; the attributes and such
    // are only something we do on the publish side.
    if (context) {
      return getTracer().startSpan(
        name,
        {
          kind: SpanKind.CONSUMER,
          attributes: {},
        },
        parent
      );
    } else {
      return getTracer().startSpan(name, {
        kind: SpanKind.CONSUMER,
      });
    }
  }

  static createChildSpan(
    message: MessageWithAttributes,
    name: string
  ): Span | undefined {
    const parent = message.telemetrySpan;
    if (parent) {
      return getTracer().startSpan(
        name,
        {
          kind: SpanKind.INTERNAL,
          attributes: {},
        },
        spanContextToContext(parent.spanContext())
      );
    } else {
      return undefined;
    }
  }

  static createPublishFlowSpan(message: PubsubMessage): Span | undefined {
    return SpanMaker.createChildSpan(message, 'publisher flow control');
  }

  static createPublishBatchSpan(message: PubsubMessage): Span | undefined {
    return SpanMaker.createChildSpan(message, 'publish scheduler');
  }

  static createPublishRpcSpan(message: PubsubMessage): Span | undefined {
    return SpanMaker.createChildSpan(message, 'publish');
  }

  static createReceiveFlowSpan(
    message: MessageWithAttributes
  ): Span | undefined {
    return SpanMaker.createChildSpan(message, 'subscriber flow control');
  }

  static createReceiveSchedulerSpan(
    message: MessageWithAttributes
  ): Span | undefined {
    return SpanMaker.createChildSpan(message, 'subscribe scheduler');
  }

  static createReceiveProcessSpan(
    message: MessageWithAttributes,
    subName: string
  ): Span | undefined {
    return SpanMaker.createChildSpan(message, `${subName} process`);
  }

  static setReceiveProcessResult(span: Span, isAck: boolean) {
    span.setAttribute('messaging.pubsub.result', isAck ? 'ack' : 'nack');
  }

  static createReceiveLeaseSpan(
    message: MessageWithAttributes,
    deadline: Duration,
    isInitial: boolean
  ): Span | undefined {
    const span = SpanMaker.createChildSpan(message, 'modify ack deadline');
    span?.setAttribute(
      'messaging.pubsub.modack_deadline_seconds',
      deadline.totalOf('second')
    );
    span?.setAttribute('messaging.pubsub.is_receipt_modack', isInitial);
    return span;
  }

  static createReceiveResponseSpan(
    message: MessageWithAttributes,
    isAck: boolean
  ): Span | undefined {
    const name = isAck ? 'ack' : 'nack';
    return SpanMaker.createChildSpan(message, name);
  }
}

/**
 * Injects the trace context into a Pub/Sub message (or other object with
 * an 'attributes' object) for propagation.
 *
 * @private
 */
export function injectSpan(
  span: Span,
  message: MessageWithAttributes,
  enabled: OpenTelemetryLevel
): void {
  if (!message.attributes) {
    message.attributes = {};
  }

  if (message.attributes[modernAttributeName]) {
    console.warn(
      `${modernAttributeName} key set as message attribute, but will be overridden.`
    );

    delete message.attributes[modernAttributeName];
  }

  // If we're in legacy mode, add that header as well.
  if (enabled === OpenTelemetryLevel.Legacy) {
    if (message.attributes[legacyAttributeName]) {
      console.warn(
        `${legacyAttributeName} key set as message attribute, but will be overridden.`
      );
    }
    message.attributes[legacyAttributeName] = JSON.stringify(
      span.spanContext()
    );
  }

  // Always do propagation injection with the trace context.
  const context = trace.setSpanContext(ROOT_CONTEXT, span.spanContext());
  propagation.inject(context, message, pubsubSetter);

  // Also put the direct reference to the Span object for while we're
  // passing it around in the client library.
  message.telemetrySpan = span;
}

/**
 * Returns true if this message potentially contains a span context.
 *
 * @private
 */
export function containsSpanContext(message: MessageWithAttributes): boolean {
  if (message.telemetrySpan) {
    return true;
  }

  if (!message.attributes) {
    return false;
  }

  const keys = Object.getOwnPropertyNames(message.attributes);
  return !!keys.find(
    n => n === legacyAttributeName || n === modernAttributeName
  );
}

/**
 * Extracts the trace context from a Pub/Sub message (or other object with
 * an 'attributes' object) from a propagation, for receive processing. If no
 * context was present, create a new parent span.
 *
 * @private
 */
export function extractSpan(
  message: MessageWithAttributes,
  subName: string,
  enabled: OpenTelemetryLevel
): Span | undefined {
  if (message.telemetrySpan) {
    return message.telemetrySpan;
  }

  const keys = Object.getOwnPropertyNames(message.attributes ?? {});

  let context: Context | undefined;

  if (enabled === OpenTelemetryLevel.Legacy) {
    // Only prefer the legacy attributes to no trace context attribute.
    if (
      keys.includes(legacyAttributeName) &&
      !keys.includes(modernAttributeName)
    ) {
      const legacyValue = message.attributes?.[legacyAttributeName];
      if (legacyValue) {
        const parentSpanContext: SpanContext | undefined = legacyValue
          ? JSON.parse(legacyValue)
          : undefined;
        if (parentSpanContext) {
          context = spanContextToContext(parentSpanContext);
        }
      }
    }
  } else {
    if (keys.includes(modernAttributeName)) {
      context = propagation.extract(ROOT_CONTEXT, message, pubsubGetter);
    }
  }

  const span = SpanMaker.createReceiveSpan(message, subName, context);
  message.telemetrySpan = span;
  return span;
}

// Since these were exported on the main Pub/Sub index in the previous
// version, we have to export them until the next major.
export const legacyExports = {
  /**
   * @deprecated
   * Use the new telemetry functionality instead; see the updated OpenTelemetry
   * sample for an example.
   */
  createSpan: function (
    spanName: string,
    kind: SpanKind,
    attributes?: SpanAttributes,
    parent?: SpanContext
  ): Span {
    return getTracer().startSpan(
      spanName,
      {
        kind,
        attributes,
      },
      parent ? trace.setSpanContext(context.active(), parent) : undefined
    );
  },
};
