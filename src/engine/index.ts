export * from './types.js';
export * from './utils.js';
export * from './events.js';
export * from './memory.js';
export * from './models.js';
export * from './tools.js';
export * from './agent.js';
export * from './workflow.js';

import { AgentRuntime } from './agent.js';
import { InMemoryStore } from './memory.js';
import { MockModelAdapter, ModelRegistry } from './models.js';
import { echoTool, timeTool, ToolRegistry } from './tools.js';

export function createEngine(): { agents: AgentRuntime; models: ModelRegistry; tools: ToolRegistry; memory: InMemoryStore } {
  const models = new ModelRegistry();
  models.register('mock', new MockModelAdapter());
  const tools = new ToolRegistry();
  tools.register(echoTool);
  tools.register(timeTool);
  const memory = new InMemoryStore();
  return { models, tools, memory, agents: new AgentRuntime(models, tools, memory) };
}
