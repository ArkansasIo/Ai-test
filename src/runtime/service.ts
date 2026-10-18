import { createEngine } from '../engine/index.js';
import type { AgentConfig, AgentRun } from '../engine/types.js';

export interface RuntimeRequest {
  agent: AgentConfig;
  input: string;
  userId?: string;
}

export interface RuntimeService {
  readonly engine: ReturnType<typeof createEngine>;
  run(request: RuntimeRequest): Promise<AgentRun>;
}

export function createRuntimeService(): RuntimeService {
  const engine = createEngine();
  return {
    engine,
    run(request) {
      return engine.agents.run(request.agent, request.input, request.userId);
    },
  };
}
