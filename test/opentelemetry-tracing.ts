/*!
 * Copyright 2020 Google LLC
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

import * as assert from 'assert';
import {describe, it, beforeEach} from 'mocha';

import * as api from '@opentelemetry/api';
import * as trace from '@opentelemetry/tracing';
import {createSpan} from '../src/opentelemetry-tracing';
import {exporter} from './tracing';
import {SpanKind} from '@opentelemetry/api';

describe('OpenTelemetryTracer', () => {
  let span: trace.Span;
  const spanName = 'test-span';
  const spanContext: api.SpanContext = {
    traceId: 'd4cda95b652f4a1592b449d5929fda1b',
    spanId: '6e0c63257de34c92',
    traceFlags: api.TraceFlags.SAMPLED,
  };
  const spanAttributes: api.SpanAttributes = {
    foo: 'bar',
  };

  beforeEach(() => {
    exporter.reset();
  });

  it('creates a span', () => {
    span = createSpan(
      spanName,
      SpanKind.PRODUCER,
      spanAttributes,
      spanContext
    ) as trace.Span;
    span.end();

    const spans = exporter.getFinishedSpans();
    assert.notStrictEqual(spans.length, 0);
    const exportedSpan = spans.concat().pop()!;

    assert.strictEqual(exportedSpan.name, spanName);
    assert.deepStrictEqual(exportedSpan.attributes, spanAttributes);
    assert.strictEqual(exportedSpan.parentSpanId, spanContext.spanId);
    assert.strictEqual(exportedSpan.kind, SpanKind.PRODUCER);
  });
});
