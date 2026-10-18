import type { AIContext, AIMessage, AIResult } from '../core';
import type { Agent } from '../agents';
import type { AuditSink } from '../audit';
import type { ModelRouter } from '../models';

export interface RuntimeRequest {
  agent: Agent;
  messages: AIMessage[];
  context: AIContext;
}

export interface RuntimeServices {
  modelRouter?: ModelRouter;
  audit?: AuditSink;
}

export class AIRuntime {
  constructor(private readonly services: RuntimeServices = {}) {}

  async execute(request: RuntimeRequest): Promise<AIResult> {
    const started = Date.now();
    await this.services.audit?.append({ id: crypto.randomUUID(), type: 'request', requestId: request.context.requestId, timestamp: new Date().toISOString(), actor: request.agent.id, action: 'runtime.execute' });
    try {
      const result = await request.agent.execute(request.messages, request.context);
      await this.services.audit?.append({ id: crypto.randomUUID(), type: 'result', requestId: request.context.requestId, timestamp: new Date().toISOString(), actor: request.agent.id, action: `runtime.completed:${Date.now() - started}ms`, metadata: { ok: result.ok } });
      return result;
    } catch (error) {
      await this.services.audit?.append({ id: crypto.randomUUID(), type: 'error', requestId: request.context.requestId, timestamp: new Date().toISOString(), actor: request.agent.id, action: 'runtime.failed', metadata: { error: String(error) } });
      return { ok: false, error: { code: 'runtime-error', message: String(error) } };
    }
  }
}

export * from './service.js';
