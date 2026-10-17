import type { ModelRequest, ModelResponse } from './index';

export interface ModelAdapter {
  readonly provider: string;
  generate(request: ModelRequest): Promise<ModelResponse>;
}

export interface ModelRouterOptions {
  fallbackProviders?: string[];
}

export class ModelRouter {
  private readonly adapters = new Map<string, ModelAdapter>();

  constructor(private readonly options: ModelRouterOptions = {}) {}

  register(adapter: ModelAdapter): void {
    this.adapters.set(adapter.provider, adapter);
  }

  get(provider: string): ModelAdapter | undefined {
    return this.adapters.get(provider);
  }

  async generate(request: ModelRequest): Promise<ModelResponse> {
    const providers = [request.model.provider, ...(this.options.fallbackProviders ?? [])];
    let lastError: unknown;

    for (const provider of providers) {
      const adapter = this.adapters.get(provider);
      if (!adapter) continue;
      try {
        return await adapter.generate(request);
      } catch (error) {
        lastError = error;
      }
    }

    throw new Error(
      `No model adapter succeeded for provider ${request.model.provider}: ${String(lastError ?? 'adapter unavailable')}`,
    );
  }
}
