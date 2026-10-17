import type { LoadedModule, ModuleManifest } from './types';

export class ModuleRegistry {
  private readonly modules = new Map<string, LoadedModule>();

  register(manifest: ModuleManifest): LoadedModule {
    if (this.modules.has(manifest.id)) {
      throw new Error(`Module ${manifest.id} is already registered`);
    }
    const loaded: LoadedModule = {
      manifest,
      loadedAt: new Date().toISOString(),
      enabled: true,
    };
    this.modules.set(manifest.id, loaded);
    return loaded;
  }

  enable(id: string): void {
    this.require(id).enabled = true;
  }

  disable(id: string): void {
    this.require(id).enabled = false;
  }

  get(id: string): LoadedModule | undefined {
    return this.modules.get(id);
  }

  list(enabledOnly = false): LoadedModule[] {
    const modules = [...this.modules.values()];
    return enabledOnly ? modules.filter((module) => module.enabled) : modules;
  }

  private require(id: string): LoadedModule {
    const module = this.modules.get(id);
    if (!module) throw new Error(`Module ${id} was not found`);
    return module;
  }
}
