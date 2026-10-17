export interface PluginContext { version: string; services: Record<string, unknown>; }
export interface Plugin { id: string; name: string; version: string; activate(context: PluginContext): Promise<void>; deactivate?(): Promise<void>; }
export class PluginRegistry { private readonly plugins = new Map<string, Plugin>(); register(plugin: Plugin): void { this.plugins.set(plugin.id, plugin); } get(id: string): Plugin | undefined { return this.plugins.get(id); } list(): Plugin[] { return [...this.plugins.values()]; } }
