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

import {Attributes, SpanContext, Span, trace} from '@opentelemetry/api';
import {Tracer} from '@opentelemetry/tracing';

/**
 * Wrapper for creating OpenTelemetry Spans
 *
 * @class
 */
export class OpenTelemetryTracer {
  /**
   * Creates a new span with the given properties
   *
   * @param {string} spanName the name for the span
   * @param {Attributes?} attributes an object containing the attributes to be set for the span
   * @param {SpanContext?} parent the context of the parent span to link to the span
   */
  createSpan(
    spanName: string,
    attributes?: Attributes,
    parent?: SpanContext
  ): Span {
    const tracerProvider: Tracer = trace.getTracer('default') as Tracer;
    return tracerProvider.startSpan(spanName, {
      parent: parent,
      attributes: attributes,
    });
  }
}
