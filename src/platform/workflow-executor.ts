import { randomUUID } from 'node:crypto';
import type { AIContext, AIMessage, AIResult } from '../core/index.js';
import type { AgentRegistry } from '../agents/index.js';
import type { ToolRegistry } from '../tools/index.js';
import type { Workflow, WorkflowNode } from '../workflows/index.js';
import type { AuditSink } from '../audit/index.js';
import type { InMemorySandboxManager } from '../sandbox/manager.js';
import type { SandboxExecutionResult } from '../sandbox/types.js';

export interface WorkflowExecutionContext {
  ai: AIContext;
  messages: AIMessage[];
  variables: Record<string, unknown>;
}

export interface WorkflowExecutorOptions {
  sandbox?: InMemorySandboxManager;
}

export class WorkflowExecutor {
  constructor(
    private readonly agents: AgentRegistry,
    private readonly tools: ToolRegistry,
    private readonly audit?: AuditSink,
    private readonly options: WorkflowExecutorOptions = {},
  ) {}

  async run(workflow: Workflow, context: WorkflowExecutionContext): Promise<AIResult<Record<string, unknown>>> {
    const values = { ...context.variables };
    const ordered = this.topologicalOrder(workflow.nodes, workflow.edges);
    if (!ordered.ok) return ordered.error;

    for (const node of ordered.nodes) {
      await this.audit?.append({
        id: randomUUID(),
        type: 'workflow',
        requestId: context.ai.requestId,
        timestamp: new Date().toISOString(),
        action: `workflow.node:${node.id}`,
        metadata: { nodeType: node.type },
      });

      if (node.type === 'agent') {
        const agent = this.agents.get(String(node.config.agentId ?? ''));
        if (!agent) return { ok: false, error: { code: 'agent-not-found', message: `Workflow agent '${String(node.config.agentId)}' was not found.` } };
        const result = await agent.execute(context.messages, context.ai);
        if (!result.ok) return result as AIResult<Record<string, unknown>>;
        values[node.id] = result.value;
      } else if (node.type === 'tool') {
        const tool = this.tools.get(String(node.config.toolId ?? ''));
        if (!tool) return { ok: false, error: { code: 'tool-not-found', message: `Workflow tool '${String(node.config.toolId)}' was not found.` } };
        values[node.id] = await tool.execute(node.config.input ?? values, { userId: context.ai.userId, permissions: [] });
      } else if (node.type === 'sandbox') {
        const sandbox = this.options.sandbox;
        if (!sandbox) return { ok: false, error: { code: 'sandbox-unavailable', message: 'Workflow requested a sandbox node but no sandbox manager is configured.' } };

        const request = {
          sandboxId: String(node.config.sandboxId ?? ''),
          virtualEnvironmentId: String(node.config.virtualEnvironmentId ?? ''),
          command: String(node.config.command ?? ''),
          args: Array.isArray(node.config.args) ? node.config.args.map(String) : undefined,
          stdin: node.config.stdin == null ? undefined : String(node.config.stdin),
          timeoutMs: node.config.timeoutMs == null ? undefined : Number(node.config.timeoutMs),
        };

        try {
          const result: SandboxExecutionResult = await sandbox.execute(request);
          values[node.id] = result;
          await this.audit?.append({
            id: randomUUID(),
            type: 'sandbox',
            requestId: context.ai.requestId,
            timestamp: new Date().toISOString(),
            action: `sandbox.execute:${node.id}`,
            metadata: { sandboxId: request.sandboxId, virtualEnvironmentId: request.virtualEnvironmentId, ok: result.ok, exitCode: result.exitCode },
          });
        } catch (error) {
          await this.audit?.append({
            id: randomUUID(),
            type: 'error',
            requestId: context.ai.requestId,
            timestamp: new Date().toISOString(),
            action: `sandbox.error:${node.id}`,
            metadata: { message: error instanceof Error ? error.message : String(error) },
          });
          return { ok: false, error: { code: 'sandbox-execution-failed', message: error instanceof Error ? error.message : String(error) } };
        }
      } else if (node.type === 'input') {
        values[node.id] = node.config.value ?? context.messages.at(-1)?.content ?? '';
      }
    }

    return { ok: true, value: values };
  }

  private topologicalOrder(nodes: WorkflowNode[], edges: Workflow['edges']):
    | { ok: true; nodes: WorkflowNode[] }
    | { ok: false; error: { code: string; message: string } } {
    const incoming = new Map(nodes.map((node) => [node.id, 0]));
    for (const edge of edges) {
      if (!incoming.has(edge.from) || !incoming.has(edge.to)) {
        return { ok: false, error: { code: 'workflow-invalid-edge', message: `Workflow edge '${edge.from}' -> '${edge.to}' references an unknown node.` } };
      }
      incoming.set(edge.to, (incoming.get(edge.to) ?? 0) + 1);
    }

    const queue = nodes.filter((node) => incoming.get(node.id) === 0).map((node) => node.id);
    const byId = new Map(nodes.map((node) => [node.id, node]));
    const result: WorkflowNode[] = [];

    while (queue.length) {
      const id = queue.shift()!;
      const node = byId.get(id);
      if (!node) continue;
      result.push(node);
      for (const edge of edges.filter((candidate) => candidate.from === id)) {
        const next = (incoming.get(edge.to) ?? 0) - 1;
        incoming.set(edge.to, next);
        if (next === 0) queue.push(edge.to);
      }
    }

    if (result.length !== nodes.length) {
      return { ok: false, error: { code: 'workflow-cycle', message: `Workflow '${nodes.length ? 'graph' : 'empty'}' contains a dependency cycle.` } };
    }
    return { ok: true, nodes: result };
  }
}
