export interface AIContext {
  requestId: string;
  userId?: string;
  projectId?: string;
  metadata: Record<string, unknown>;
}

export interface AIMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  timestamp: string;
}

export interface AIResult<T = unknown> {
  ok: boolean;
  value?: T;
  error?: { code: string; message: string };
}
