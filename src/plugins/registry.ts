export interface PluginContext {
  registerTool(name: string, implementation: unknown): void;
  registerModel(name: string, implementation: unknown): void;
}

export interface AiTestPlugin {
  id: string;
  name: string;
  version: string;
  description?: string;
  activate(context: PluginContext): void | Promise<void>;
  deactivate?(): void | Promise<void>;
}

export class PluginRegistry {
  private readonly plugins = new Map<string, AiTestPlugin>();
  private readonly tools = new Map<string, unknown>();
  private readonly models = new Map<string, unknown>();

  async install(plugin: AiTestPlugin): Promise<void> {
    if (this.plugins.has(plugin.id)) throw new Error(`plugin already installed: ${plugin.id}`);
    this.plugins.set(plugin.id, plugin);
    await plugin.activate({
      registerTool: (name, implementation) => this.tools.set(name, implementation),
      registerModel: (name, implementation) => this.models.set(name, implementation),
    });
  }

  async uninstall(id: string): Promise<boolean> {
    const plugin = this.plugins.get(id);
    if (!plugin) return false;
    await plugin.deactivate?.();
    this.plugins.delete(id);
    return true;
  }

  list(): AiTestPlugin[] { return [...this.plugins.values()]; }
  getTool<T = unknown>(name: string): T | undefined { return this.tools.get(name) as T | undefined; }
  getModel<T = unknown>(name: string): T | undefined { return this.models.get(name) as T | undefined; }
}
