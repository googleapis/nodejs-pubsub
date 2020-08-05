/*!
 * Copyright 2020 Google Inc. All Rights Reserved.
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

describe('OpenTelemetryTracer', () => {
  let tracing: OpenTelemetryTracer;
  const spanName = 'test-span';

  beforeEach(() => {
    tracing = new OpenTelemetryTracer();
  });

  it('creates a span', () => {
    const attributes: api.Attributes = {
        'foo': 'bar'
    };
    const span = <trace.Span>tracing.createSpan(spanName, attributes);
    assert.strictEqual(span.name, spanName);
    assert.deepStrictEqual(span.attributes, attributes);
    span.end();
  });

});