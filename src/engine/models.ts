import { randomUUID } from 'node:crypto';
import type { GenerateRequest, GenerateResponse } from './types.js';

export interface ModelAdapter {
  readonly provider: string;
  generate(request: GenerateRequest): Promise<GenerateResponse>;
}

export class MockModelAdapter implements ModelAdapter {
  readonly provider = 'mock';

  async generate(request: GenerateRequest): Promise<GenerateResponse> {
    const last = request.messages.at(-1)?.content ?? '';
    return {
      id: randomUUID(), model: request.model,
      message: { role: 'assistant', content: `Mock response: ${last}` },
      finishReason: 'stop',
      usage: { inputTokens: last.length, outputTokens: last.length, totalTokens: last.length * 2 },
    };
  }
}

export class OllamaAdapter implements ModelAdapter {
  readonly provider = 'ollama';
  constructor(private readonly baseUrl = 'http://127.0.0.1:11434') {}

  async generate(request: GenerateRequest): Promise<GenerateResponse> {
    const response = await fetch(`${this.baseUrl.replace(/\/$/, '')}/api/chat`, {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ model: request.model, messages: request.messages, stream: false, options: { temperature: request.temperature, num_predict: request.maxTokens } }),
    });
    if (!response.ok) throw new Error(`Ollama request failed: ${response.status}`);
    const data = await response.json() as { model: string; message: { role: 'assistant'; content: string }; done?: boolean };
    return { id: randomUUID(), model: data.model, message: data.message, finishReason: data.done === false ? 'length' : 'stop' };
  }
}

export class ModelRegistry {
  private readonly adapters = new Map<string, ModelAdapter>();
  register(name: string, adapter: ModelAdapter): void { this.adapters.set(name, adapter); }
  get(name: string): ModelAdapter { const adapter = this.adapters.get(name); if (!adapter) throw new Error(`Model adapter not registered: ${name}`); return adapter; }
  list(): string[] { return [...this.adapters.keys()]; }
}
