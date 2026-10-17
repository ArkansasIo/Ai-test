import { EventBus } from './events.js';
import { id, now } from './utils.js';
import type { AgentConfig, AgentRun, ChatMessage } from './types.js';
import type { MemoryStore } from './memory.js';
import type { ModelRegistry } from './models.js';
import type { ToolRegistry } from './tools.js';

export class AgentRuntime {
  constructor(
    private readonly models: ModelRegistry,
    private readonly tools: ToolRegistry,
    private readonly memory: MemoryStore,
    private readonly events = new EventBus(),
  ) {}

  async run(config: AgentConfig, input: string, userId?: string): Promise<AgentRun> {
    const run: AgentRun = { id: id(), agentId: config.id, requestId: id(), input, status: 'running', startedAt: now() };
    await this.events.emit('agent.started', run);
    try {
      const memories = await this.memory.search(config.id, input, 5);
      const context = memories.length ? `\nRelevant memory:\n${memories.map((m) => `- ${m.text}`).join('\n')}` : '';
      const messages: ChatMessage[] = [
        { role: 'system', content: config.systemPrompt },
        { role: 'user', content: `${input}${context}` },
      ];
      const result = await this.models.get(config.model).generate({ model: config.model, messages, temperature: config.temperature, tools: this.tools.definitions() });
      run.output = result.message.content;
      run.status = 'completed';
      run.completedAt = now();
      await this.events.emit('agent.completed', run);
      return run;
    } catch (error) {
      run.status = 'failed';
      run.error = error instanceof Error ? error.message : String(error);
      run.completedAt = now();
      await this.events.emit('agent.failed', run);
      return run;
    }
  }

  on(event: string, handler: (run: AgentRun) => void | Promise<void>): () => void { return this.events.on(event, handler); }
}
