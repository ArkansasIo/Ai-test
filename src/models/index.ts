export type ModelProvider = 'ollama' | 'llama.cpp' | 'openai-compatible' | 'custom';

export interface ModelCapabilities {
  chat: boolean;
  vision: boolean;
  tools: boolean;
  streaming: boolean;
  embeddings: boolean;
}

export interface AIModel {
  id: string;
  provider: ModelProvider;
  name: string;
  capabilities: ModelCapabilities;
}

export interface ModelRequest {
  model: AIModel;
  messages: Array<{ role: string; content: string }>;
  temperature?: number;
  maxTokens?: number;
}

export interface ModelResponse {
  model: string;
  content: string;
  finishReason?: string;
}

export * from './router';
export * from './ollama';
