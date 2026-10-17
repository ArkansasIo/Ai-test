import type { AIContext, AIMessage, AIResult } from '../core';
import type { AgentRegistry } from '../agents';
import type { ToolRegistry } from '../tools';
import type { Workflow, WorkflowNode } from '../workflows';
import type { AuditSink } from '../audit';

export interface WorkflowExecutionContext {
  ai: AIContext;
  messages: AIMessage[];
  variables: Record<string, unknown>;
}

export class WorkflowExecutor {
  constructor(
    private readonly agents: AgentRegistry,
    private readonly tools: ToolRegistry,
    private readonly audit?: AuditSink,
  ) {}

  async run(workflow: Workflow, context: WorkflowExecutionContext): Promise<AIResult<Record<string, unknown>>> {
    const values = { ...context.variables };
    const ordered = this.topologicalOrder(workflow.nodes, workflow.edges);

    for (const node of ordered) {
      await this.audit?.append({
        id: crypto.randomUUID(),
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
      } else if (node.type === 'input') {
        values[node.id] = node.config.value ?? context.messages.at(-1)?.content ?? '';
      }
    }

    return { ok: true, value: values };
  }

  private topologicalOrder(nodes: WorkflowNode[], edges: Workflow['edges']): WorkflowNode[] {
    const incoming = new Map(nodes.map((node) => [node.id, 0]));
    for (const edge of edges) incoming.set(edge.to, (incoming.get(edge.to) ?? 0) + 1);
    const queue = nodes.filter((node) => incoming.get(node.id) === 0).map((node) => node.id);
    const byId = new Map(nodes.map((node) => [node.id, node]));
    const result: WorkflowNode[] = [];

    while (queue.length) {
      const id = queue.shift()!;
      result.push(byId.get(id)!);
      for (const edge of edges.filter((candidate) => candidate.from === id)) {
        const next = (incoming.get(edge.to) ?? 0) - 1;
        incoming.set(edge.to, next);
        if (next === 0) queue.push(edge.to);
      }
    }
    return result.length === nodes.length ? result : nodes;
  }
}
