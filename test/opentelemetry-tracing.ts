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
import {describe, it, before, beforeEach, afterEach} from 'mocha';

import * as api from '@opentelemetry/api';
import * as trace from '@opentelemetry/tracing';
import {OpenTelemetryTracer} from '../src/opentelemetry-tracing';
import {SimpleSpanProcessor} from '@opentelemetry/tracing';

describe('OpenTelemetryTracer', () => {
  let tracing: OpenTelemetryTracer;
  let span: trace.Span;
  const spanName = 'test-span';
  const spanContext: api.SpanContext = {
    traceId: 'd4cda95b652f4a1592b449d5929fda1b',
    spanId: '6e0c63257de34c92',
    traceFlags: api.TraceFlags.SAMPLED,
  };
  const spanAttributes: api.Attributes = {
    foo: 'bar',
  };

  before(() => {
    const provider = new trace.BasicTracerProvider();
    const exporter = new trace.InMemorySpanExporter();
    provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
    api.trace.setGlobalTracerProvider(provider);
  });

  beforeEach(() => {
    tracing = new OpenTelemetryTracer();
  });

  afterEach(() => {
    span.end();
  });

  it('creates a span', () => {
    span = tracing.createSpan(
      spanName,
      spanAttributes,
      spanContext
    ) as trace.Span;
    assert.strictEqual(span.name, spanName);
    assert.deepStrictEqual(span.attributes, spanAttributes);
    assert.strictEqual(span.parentSpanId, spanContext.spanId);
  });
});
