export type ModuleKind =
  | 'core'
  | 'agent'
  | 'model'
  | 'tool'
  | 'memory'
  | 'workflow'
  | 'sandbox'
  | 'knowledge'
  | 'api'
  | 'ui'
  | 'plugin';

export interface ModuleDependency {
  moduleId: string;
  version?: string;
  optional?: boolean;
}

export interface ModuleManifest {
  id: string;
  name: string;
  version: string;
  kind: ModuleKind;
  description: string;
  entrypoint: string;
  dependencies?: ModuleDependency[];
  capabilities?: string[];
  configuration?: Record<string, unknown>;
}

export interface LoadedModule {
  manifest: ModuleManifest;
  loadedAt: string;
  enabled: boolean;
}
