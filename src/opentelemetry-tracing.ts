import * as api from '@opentelemetry/api';
import * as trace from '@opentelemetry/tracing';

export class OpenTelemetryTracer {
  createSpan(
    spanName: string,
    attributes?: api.Attributes,
    parent?: api.SpanContext
  ): api.Span {
    const tracerProvider = <trace.Tracer>api.trace.getTracer('default');
    return tracerProvider.startSpan(spanName, {
      parent: parent,
      attributes: attributes
    });
  }
}
