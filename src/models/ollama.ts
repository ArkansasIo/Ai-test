import type { ModelRequest, ModelResponse } from './index';
import type { ModelAdapter } from './router';

interface OllamaResponse {
  model?: string;
  message?: { content?: string };
  done_reason?: string;
}

export class OllamaAdapter implements ModelAdapter {
  readonly provider = 'ollama';

  constructor(private readonly baseUrl = 'http://localhost:11434') {}

  async generate(request: ModelRequest): Promise<ModelResponse> {
    const response = await fetch(`${this.baseUrl.replace(/\/$/, '')}/api/chat`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        model: request.model.name,
        messages: request.messages,
        stream: false,
        options: {
          ...(request.temperature === undefined ? {} : { temperature: request.temperature }),
          ...(request.maxTokens === undefined ? {} : { num_predict: request.maxTokens }),
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama request failed with HTTP ${response.status}`);
    }

    const data = (await response.json()) as OllamaResponse;
    return {
      model: data.model ?? request.model.name,
      content: data.message?.content ?? '',
      finishReason: data.done_reason,
    };
  }
}
