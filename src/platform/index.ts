import type { AIContext, AIMessage, AIResult } from '../core';
import { AgentRegistry, type Agent } from '../agents';
import { InMemoryAuditSink } from '../audit';
import { ModelRouter, type AIModel } from '../models';
import { AIRuntime } from '../runtime';
import { ToolRegistry } from '../tools';

export interface PlatformRequest {
  requestId: string;
  input: string;
  agentId?: string;
  userId?: string;
  projectId?: string;
  model?: AIModel;
}

export interface PlatformResult {
  ok: boolean;
  requestId: string;
  output?: unknown;
  error?: { code: string; message: string };
}

export class AIPlatform {
  readonly agents = new AgentRegistry();
  readonly tools = new ToolRegistry();
  readonly models = new ModelRouter();
  readonly audit = new InMemoryAuditSink();
  readonly runtime = new AIRuntime({ modelRouter: this.models, audit: this.audit });

  registerAgent(agent: Agent): void {
    this.agents.register(agent);
  }

  async execute(request: PlatformRequest): Promise<PlatformResult> {
    const agent = this.agents.get(request.agentId ?? 'default');
    if (!agent) {
      return { ok: false, requestId: request.requestId, error: { code: 'agent-not-found', message: `Agent '${request.agentId ?? 'default'}' is not registered.` } };
    }

    const context: AIContext = {
      requestId: request.requestId,
      userId: request.userId,
      projectId: request.projectId,
      metadata: { model: request.model?.id },
    };
    const messages: AIMessage[] = [{ role: 'user', content: request.input, timestamp: new Date().toISOString() }];
    const result = await this.runtime.execute({ agent, messages, context });
    return result.ok
      ? { ok: true, requestId: request.requestId, output: result.value }
      : { ok: false, requestId: request.requestId, error: result.error };
  }
}

export * from './workflow-executor';
