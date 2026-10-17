import type { AIContext, AIMessage, AIResult } from '../core';

export interface Agent {
  id: string;
  name: string;
  execute(input: AIMessage[], context: AIContext): Promise<AIResult>;
}

export type AgentKind = 'orchestrator' | 'planner' | 'coder' | 'researcher' | 'github' | 'tool';

export interface AgentDefinition {
  id: string;
  kind: AgentKind;
  instructions: string;
  tools: string[];
}

export class AgentRegistry {
  private readonly agents = new Map<string, Agent>();

  register(agent: Agent): void {
    this.agents.set(agent.id, agent);
  }

  get(id: string): Agent | undefined {
    return this.agents.get(id);
  }
}
