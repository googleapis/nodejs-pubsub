import opentelemetry from '@opentelemetry/api';
import {
  Span,
  SpanContext,
  TraceFlags,
  TraceState,
  Attributes,
} from '@opentelemetry/api';

export class OpenTelemetryTracer {
  createSpan(
    spanName: string,
    attributes?: Attributes,
    parent?: {
      traceId: string;
      spanId: string;
      isRemote: boolean | undefined;
      traceFlags: TraceFlags;
      traceState: TraceState;
    }
  ): Span {
    let parentSpanContext: SpanContext | null = null;
    if (parent) {
      try {
        parentSpanContext = {
          traceId: parent.traceId,
          spanId: parent.spanId,
          isRemote: parent.isRemote,
          traceFlags: parent.traceFlags,
          traceState: parent.traceState,
        };
      } catch (err) {
        console.warn(
          'Parent was provided but could not be used. Ensure that the parent contains traceId, spanId, isRemote, traceFlags, and traceState as keys.'
        );
      }
    }
    const span = opentelemetry.trace.getTracer('default').startSpan(spanName, {
      parent: parentSpanContext,
    });
    if (attributes) {
      span.setAttributes(attributes);
    }
    return span;
  }
}
