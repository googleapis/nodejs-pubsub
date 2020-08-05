import * as api from '@opentelemetry/api';
import * as trace from '@opentelemetry/tracing';
import { Tracing } from 'trace_events';
import { BasicTracerProvider, Tracer } from '@opentelemetry/tracing';

export class OpenTelemetryTracer {
  createSpan(
    spanName: string,
    attributes?: api.Attributes,
    parent?: {
      traceId: string;
      spanId: string;
      isRemote: boolean | undefined;
      traceFlags: api.TraceFlags;
      traceState: api.TraceState;
    }
  ): api.Span {
    let parentSpanContext: api.SpanContext | undefined = undefined;
    if (parent) {
      try {
        parentSpanContext = <api.SpanContext>parent;
      } catch (err) {
        console.warn(
          'Parent was provided but could not be used. Ensure that the parent contains traceId, spanId, isRemote, traceFlags, and traceState as keys.'
        );
      }
    }
    const tracerProvider = new BasicTracerProvider().getTracer('default');
    return tracerProvider.startSpan(spanName, {
      parent: parentSpanContext,
      attributes: attributes
    });
  }
}
