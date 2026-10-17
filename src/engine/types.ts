export type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  name?: string;
  toolCallId?: string;
}

export interface GenerateRequest {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
  tools?: ToolDefinition[];
}

export interface GenerateResponse {
  id: string;
  model: string;
  message: ChatMessage;
  finishReason: 'stop' | 'tool' | 'length' | 'error';
  usage?: { inputTokens: number; outputTokens: number; totalTokens: number };
}

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, Json>;
}

export interface ToolContext {
  requestId: string;
  agentId: string;
  userId?: string;
  permissions: string[];
}

export interface Tool {
  definition: ToolDefinition;
  execute(input: Record<string, Json>, context: ToolContext): Promise<Json>;
}

export interface MemoryRecord {
  id: string;
  namespace: string;
  text: string;
  metadata: Record<string, Json>;
  createdAt: string;
}

export interface AgentConfig {
  id: string;
  name: string;
  systemPrompt: string;
  model: string;
  maxIterations?: number;
  temperature?: number;
  permissions?: string[];
}

export interface AgentRun {
  id: string;
  agentId: string;
  requestId: string;
  input: string;
  output?: string;
  status: 'running' | 'completed' | 'failed';
  startedAt: string;
  completedAt?: string;
  error?: string;
}
