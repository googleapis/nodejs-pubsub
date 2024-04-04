/*!
 * Copyright 2020-2024 Google LLC
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
  afterEach(() => {
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

    it('parses broken subscription info', () => {
      const name = 'projec/foo_foo/subs/sub_sub';
      const info = otel.getSubscriptionInfo(name);
      assert.strictEqual(info.subName, name);
      assert.strictEqual(info.projectId, undefined);
      assert.strictEqual(info.subId, undefined);
      assert.strictEqual(info.topicId, undefined);
      assert.strictEqual(info.topicName, undefined);
    });

    it('parses broken topic info', () => {
      const name = 'projec/foo_foo/tops/top_top';
      const info = otel.getTopicInfo(name);
      assert.strictEqual(info.subName, undefined);
      assert.strictEqual(info.projectId, undefined);
      assert.strictEqual(info.subId, undefined);
      assert.strictEqual(info.topicId, undefined);
      assert.strictEqual(info.topicName, name);
    });
  });

  describe('basic span creation', () => {
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
  });

  describe('context propagation', () => {
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

  describe('attribute creation', () => {
    it('creates attributes for publish', () => {
      const topicInfo: otel.AttributeParams = {
        topicName: 'projects/foo/topics/top',
        topicId: 'top',
        projectId: 'foo',
      };
      const message: PubsubMessage = {
        data: Buffer.from('test'),
        attributes: {},
        calculatedSize: 1234,
        orderingKey: 'key',
        isExactlyOnceDelivery: true,
        ackId: 'ackack',
      };

      const topicAttrs = otel.PubsubSpans.createAttributes(topicInfo, message);
      assert.deepStrictEqual(topicAttrs, {
        'messaging.system': 'gcp_pubsub',
        'messaging.destination.name': topicInfo.topicId,
        'gcp.project_id': topicInfo.projectId,
        'messaging.message.envelope.size': message.calculatedSize,
        'messaging.gcp_pubsub.message.ordering_key': message.orderingKey,
        'messaging.gcp_pubsub.message.exactly_once_delivery':
          message.isExactlyOnceDelivery,
        'messaging.gcp_pubsub.message.ack_id': message.ackId,
      });

      // Check again with no calculated size and other parameters missing.
      delete message.calculatedSize;
      delete message.orderingKey;
      delete message.isExactlyOnceDelivery;
      delete message.ackId;

      const topicAttrs2 = otel.PubsubSpans.createAttributes(topicInfo, message);
      assert.deepStrictEqual(topicAttrs2, {
        'messaging.system': 'gcp_pubsub',
        'messaging.destination.name': topicInfo.topicId,
        'gcp.project_id': topicInfo.projectId,
        'messaging.message.envelope.size': message.data?.length,
      });
    });
  });

  describe('specialized span creation', () => {
    const tests = {
      topicInfo: {
        topicName: 'projects/foo/topics/top',
        topicId: 'top',
        projectId: 'foo',
      } as otel.AttributeParams,
      subInfo: {
        subName: 'projects/foo/subscriptions/sub',
        subId: 'sub',
        projectId: 'foo',
      } as otel.AttributeParams,
      message: {
        data: Buffer.from('test'),
        attributes: {},
        calculatedSize: 1234,
        orderingKey: 'key',
        isExactlyOnceDelivery: true,
        ackId: 'ackack',
      } as PubsubMessage,
    };

    it('creates publisher spans', () => {
      const span = otel.PubsubSpans.createPublisherSpan(
        tests.message,
        tests.topicInfo.topicName!
      );
      span.end();

      const spans = exporter.getFinishedSpans();
      assert.strictEqual(spans.length, 1);

      const firstSpan = spans.pop();
      assert.ok(firstSpan);
      assert.strictEqual(firstSpan.name, `${tests.topicInfo.topicId} create`);
      assert.strictEqual(
        firstSpan.attributes['messaging.destination.name'],
        tests.topicInfo.topicId
      );
      assert.strictEqual(
        firstSpan.attributes['messaging.system'],
        'gcp_pubsub'
      );
    });

    it('updates publisher topic names', () => {
      const span = otel.PubsubSpans.createPublisherSpan(
        tests.message,
        tests.topicInfo.topicName!
      );
      otel.PubsubSpans.updatePublisherTopicName(
        span,
        'projects/foo/topics/other'
      );
      span.end();

      const spans = exporter.getFinishedSpans();
      assert.strictEqual(spans.length, 1);

      const firstSpan = spans.pop();
      assert.ok(firstSpan);
      assert.strictEqual(firstSpan.name, 'other create');

      assert.strictEqual(
        firstSpan.attributes['messaging.destination.name'],
        'other'
      );
    });

    it('creates receive spans', () => {
      const parentSpan = otel.PubsubSpans.createPublisherSpan(
        tests.message,
        tests.topicInfo.topicName!
      );
      const span = otel.PubsubSpans.createReceiveSpan(
        tests.message,
        tests.subInfo.subName!,
        otel.spanContextToContext(parentSpan.spanContext())
      );
      span.end();
      parentSpan.end();

      const spans = exporter.getFinishedSpans();
      const parentReadSpan = spans.pop();
      const childReadSpan = spans.pop();
      assert.ok(parentReadSpan && childReadSpan);

      assert.strictEqual(childReadSpan.name, 'sub subscribe');
      assert.strictEqual(
        childReadSpan.attributes['messaging.destination.name'],
        'sub'
      );
      assert.strictEqual(childReadSpan.kind, SpanKind.CONSUMER);
      assert.ok(childReadSpan.parentSpanId);
    });
  });
});
