import type { Json, Tool, ToolContext, ToolDefinition } from './types.js';

export class ToolRegistry {
  private readonly tools = new Map<string, Tool>();

  register(tool: Tool): void {
    if (this.tools.has(tool.definition.name)) throw new Error(`Tool already registered: ${tool.definition.name}`);
    this.tools.set(tool.definition.name, tool);
  }

  get(name: string): Tool {
    const tool = this.tools.get(name);
    if (!tool) throw new Error(`Tool not found: ${name}`);
    return tool;
  }

  definitions(): ToolDefinition[] { return [...this.tools.values()].map((tool) => tool.definition); }

  async execute(name: string, input: Record<string, Json>, context: ToolContext): Promise<Json> {
    return this.get(name).execute(input, context);
  }
}

export const echoTool: Tool = {
  definition: { name: 'echo', description: 'Return the supplied text.', inputSchema: { text: { type: 'string' } } },
  async execute(input) { return String(input.text ?? ''); },
};

export const timeTool: Tool = {
  definition: { name: 'time', description: 'Return the current ISO timestamp.', inputSchema: {} },
  async execute() { return new Date().toISOString(); },
};
