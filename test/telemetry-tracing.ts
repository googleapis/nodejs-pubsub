/*!
 * Copyright 2020-2023 Google LLC
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

import * as trace from '@opentelemetry/sdk-trace-base';
import * as otel from '../src/telemetry-tracing';
import {exporter} from './tracing';
import {SpanKind} from '@opentelemetry/api';
import sinon = require('sinon');
import {PubsubMessage} from '../src/publisher';

describe('OpenTelemetryTracer', () => {
  beforeEach(() => {
    exporter.reset();
  });

  describe('project parser', () => {
    it('parses subscription info', () => {
      const name = 'projects/project-name/subscriptions/sub-name';
      const info = otel.getSubscriptionInfo(name);
      assert.strictEqual(info.subName, name);
      assert.strictEqual(info.projectId, 'project-name');
      assert.strictEqual(info.subId, 'sub-name');
      assert.strictEqual(info.topicId, undefined);
      assert.strictEqual(info.topicName, undefined);
    });

    it('parses topic info', () => {
      const name = 'projects/project-name/topics/topic-name';
      const info = otel.getTopicInfo(name);
      assert.strictEqual(info.topicName, name);
      assert.strictEqual(info.projectId, 'project-name');
      assert.strictEqual(info.topicId, 'topic-name');
      assert.strictEqual(info.subId, undefined);
      assert.strictEqual(info.subName, undefined);
    });
  });

  it('creates a span', () => {
    const message: PubsubMessage = {};
    const span = otel.PubsubSpans.createPublisherSpan(
      message,
      'projects/test/topics/topicfoo'
    ) as trace.Span;
    span.end();

    const spans = exporter.getFinishedSpans();
    assert.notStrictEqual(spans.length, 0);
    const exportedSpan = spans.concat().pop()!;

    assert.strictEqual(exportedSpan.name, 'topicfoo create');
    assert.strictEqual(exportedSpan.kind, SpanKind.PRODUCER);
  });

  it('injects a trace context', () => {
    const message: PubsubMessage = {
      attributes: {},
    };
    const span = otel.PubsubSpans.createPublisherSpan(
      message,
      'projects/test/topics/topicfoo'
    ) as trace.Span;

    otel.injectSpan(span, message, otel.OpenTelemetryLevel.Modern);

    assert.strictEqual(
      Object.getOwnPropertyNames(message.attributes).includes(
        otel.modernAttributeName
      ),
      true
    );
  });

  it('injects a trace context and legacy baggage', () => {
    const message: PubsubMessage = {
      attributes: {},
    };
    const span = otel.PubsubSpans.createPublisherSpan(
      message,
      'projects/test/topics/topicfoo'
    );

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
    const message: PubsubMessage = {
      attributes: {
        [otel.legacyAttributeName]: 'foobar',
        [otel.modernAttributeName]: 'bazbar',
      },
    };
    const span = otel.PubsubSpans.createPublisherSpan(
      message,
      'projects/test/topics/topicfoo'
    );

    const warnSpy = sinon.spy(console, 'warn');
    try {
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
    const message = {
      attributes: {
        [otel.modernAttributeName]:
          '00-d4cda95b652f4a1592b449d5929fda1b-553964cd9101a314-01',
      },
    };

    const childSpan = otel.extractSpan(
      message,
      'projects/test/subscriptions/subfoo',
      otel.OpenTelemetryLevel.Modern
    );
    assert.strictEqual(
      childSpan!.spanContext().traceId,
      'd4cda95b652f4a1592b449d5929fda1b'
    );
  });
});
