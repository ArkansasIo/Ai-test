export interface McpServer { id: string; name: string; endpoint: string; tools: string[]; }
export interface McpTool { name: string; description: string; inputSchema: Record<string, unknown>; }
export interface McpRegistry { register(server: McpServer): void; list(): McpServer[]; }
export class InMemoryMcpRegistry implements McpRegistry { private readonly servers = new Map<string, McpServer>(); register(server: McpServer): void { this.servers.set(server.id, server); } list(): McpServer[] { return [...this.servers.values()]; } }
