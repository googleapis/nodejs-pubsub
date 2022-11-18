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
import {Attributes} from './publisher/pubsub-message';
import {PublishOptions} from './publisher/index';

// We need this to get the library version.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require('../../package.json');

/**
 * Instantiates a Opentelemetry tracer for the library
 *
 * @private
 */
const libraryTracer: Tracer = trace.getTracer(
  '@google-cloud/pubsub',
  packageJson.version
);

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
 * @private
 */
export interface MessageWithAttributes {
  attributes?: Attributes | null | undefined;
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
 * Creates a new span with the given properties
 *
 * @param {string} spanName the name for the span
 * @param {Attributes?} attributes an object containing the attributes to be set for the span
 * @param {Context?} parent the context of the parent span to link to the span
 *
 * @private
 */
export function createSpan(
  spanName: string,
  kind: SpanKind,
  attributes?: SpanAttributes,
  parent?: Context
): Span {
  return libraryTracer.startSpan(
    spanName,
    {
      kind,
      attributes,
    },
    parent
  );
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
}

/**
 * Returns true if this message potentially contains a span context attribute.
 *
 * @private
 */
export function containsSpanContext(message: MessageWithAttributes): boolean {
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
 * an 'attributes' object) from a propagation.
 *
 * @private
 */
export function extractSpan(
  message: MessageWithAttributes,
  spanName: string,
  spanAttributes: SpanAttributes,
  enabled: OpenTelemetryLevel
): Span | undefined {
  if (!message.attributes) {
    return undefined;
  }
  const keys = Object.getOwnPropertyNames(message.attributes);

  let context: Context | undefined;

  if (enabled === OpenTelemetryLevel.Legacy) {
    // Only prefer the legacy attributes to no trace context attribute.
    if (
      keys.includes(legacyAttributeName) &&
      !keys.includes(modernAttributeName)
    ) {
      const legacyValue = message.attributes[legacyAttributeName];
      const parentSpanContext: SpanContext | undefined = legacyValue
        ? JSON.parse(legacyValue)
        : undefined;
      if (parentSpanContext) {
        context = spanContextToContext(parentSpanContext);
      }
    }
  } else {
    if (keys.includes(modernAttributeName)) {
      context = propagation.extract(ROOT_CONTEXT, message, pubsubGetter);
    }
  }

  return context
    ? createSpan(spanName, SpanKind.CONSUMER, spanAttributes, context)
    : undefined;
}
