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
  SpanAttributes,
  SpanContext,
  Span,
  context,
  trace,
  SpanKind,
} from '@opentelemetry/api';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const PKG = require('../../package.json');

/**
 * @internal
 * Instantiates a Opentelemetry tracer for the library
 */
const libraryTracer: Tracer = trace.getTracer(
  '@google-cloud/pubsub',
  PKG.version
);

/**
 * Creates a new span with the given properties
 *
 * @param {string} spanName the name for the span
 * @param {Attributes?} attributes an object containing the attributes to be set for the span
 * @param {SpanContext?} parent the context of the parent span to link to the span
 */
export function createSpan(
  spanName: string,
  kind: SpanKind,
  attributes?: SpanAttributes,
  parent?: SpanContext
): Span {
  return libraryTracer.startSpan(
    spanName,
    {
      // set the kind of the span
      kind,
      // set the attributes of the span
      attributes: attributes,
    },
    parent ? trace.setSpanContext(context.active(), parent) : undefined
  );
}
