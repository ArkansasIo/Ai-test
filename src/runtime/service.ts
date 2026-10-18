import { createEngine, type AgentRuntime } from '../engine/index.js';
import type { ChatMessage } from '../engine/types.js';
import type { AIResult } from '../core/index.js';

export interface RuntimeRequest {
  agentId?: string;
  messages: ChatMessage[];
  userId?: string;
  projectId?: string;
}

export interface RuntimeService {
  readonly engine: ReturnType<typeof createEngine>;
  run(request: RuntimeRequest): Promise<AIResult>;
}

export function createRuntimeService(): RuntimeService {
  const engine = createEngine();
  const agents = engine.agents as AgentRuntime;

  return {
    engine,
    async run(request) {
      const context = {
        requestId: crypto.randomUUID(),
        userId: request.userId,
        projectId: request.projectId,
        metadata: {},
      };
      return agents.run(request.messages, context);
    },
  };
}
