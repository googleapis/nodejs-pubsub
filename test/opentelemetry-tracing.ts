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
import * as otel from '../src/opentelemetry-tracing';
import {exporter} from './tracing';
import {SpanKind} from '@opentelemetry/api';
import sinon = require('sinon');

describe('OpenTelemetryTracer', () => {
  let span: trace.Span;
  const spanName = 'test-span';
  const spanContext: api.SpanContext = {
    traceId: 'd4cda95b652f4a1592b449d5929fda1b',
    spanId: '6e0c63257de34c92',
    traceFlags: api.TraceFlags.SAMPLED,
  };
  const spanAttributes: otel.SpanAttributes = {
    foo: 'bar',
  };
  const context = otel.spanContextToContext(spanContext);

  beforeEach(() => {
    exporter.reset();
  });

  it('creates a span', () => {
    span = otel.createSpan(
      spanName,
      SpanKind.PRODUCER,
      spanAttributes,
      context
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

  it('injects a trace context', () => {
    span = otel.createSpan(
      spanName,
      SpanKind.PRODUCER,
      spanAttributes,
      context
    ) as trace.Span;

    const message = {
      attributes: {},
    };

    otel.injectSpan(span, message, otel.OpenTelemetryLevel.Modern);

    assert.strictEqual(
      Object.getOwnPropertyNames(message.attributes).includes(
        otel.modernAttributeName
      ),
      true
    );
  });

  it('injects a trace context and legacy baggage', () => {
    span = otel.createSpan(
      spanName,
      SpanKind.PRODUCER,
      spanAttributes,
      context
    ) as trace.Span;

    const message = {
      attributes: {},
    };

    otel.injectSpan(span, message, otel.OpenTelemetryLevel.Legacy);
    assert.strictEqual(
      Object.getOwnPropertyNames(message.attributes).includes(
        otel.modernAttributeName
      ),
      true
    );
    assert.strictEqual(
      Object.getOwnPropertyNames(message.attributes).includes(
        otel.legacyAttributeName
      ),
      true
    );
  });

  it('should issue a warning if OpenTelemetry span context key is set', () => {
    span = otel.createSpan(
      spanName,
      SpanKind.PRODUCER,
      spanAttributes,
      context
    ) as trace.Span;

    const warnSpy = sinon.spy(console, 'warn');
    try {
      const message = {
        attributes: {
          [otel.legacyAttributeName]: 'foobar',
          [otel.modernAttributeName]: 'bazbar',
        },
      };
      otel.injectSpan(span, message, otel.OpenTelemetryLevel.Legacy);
      assert.strictEqual(warnSpy.callCount, 2);
    } finally {
      warnSpy.restore();
    }
  });

  it('should be able to determine if attributes are present', () => {
    let message: otel.MessageWithAttributes = {
      attributes: {
        [otel.legacyAttributeName]: 'foobar',
      },
    };
    assert.strictEqual(otel.containsSpanContext(message), true);

    message = {
      attributes: {
        [otel.modernAttributeName]: 'foobar',
      },
    };
    assert.strictEqual(otel.containsSpanContext(message), true);

    message = {};
    assert.strictEqual(otel.containsSpanContext(message), false);
  });

  it('extracts a trace context', () => {
    span = otel.createSpan(
      spanName,
      SpanKind.PRODUCER,
      spanAttributes,
      context
    ) as trace.Span;

    const message = {
      attributes: {
        [otel.modernAttributeName]:
          '00-d4cda95b652f4a1592b449d5929fda1b-553964cd9101a314-01',
      },
    };

    const childSpan = otel.extractSpan(
      message,
      'child',
      {},
      otel.OpenTelemetryLevel.Modern
    );
    assert.strictEqual(
      childSpan!.spanContext().traceId,
      'd4cda95b652f4a1592b449d5929fda1b'
    );
  });
});
