import {
  BasicTracerProvider,
  InMemorySpanExporter,
  SimpleSpanProcessor,
} from '@opentelemetry/tracing';

export const exporter: InMemorySpanExporter = new InMemorySpanExporter();
export const provider: BasicTracerProvider = new BasicTracerProvider();
provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
provider.register();
