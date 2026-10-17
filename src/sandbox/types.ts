export type SandboxStatus = 'creating' | 'ready' | 'running' | 'stopped' | 'failed' | 'destroyed';

export type SandboxRuntime = 'node' | 'python' | 'shell' | 'deno' | 'bun' | 'custom';

export interface SandboxLimits {
  cpuCores: number;
  memoryMb: number;
  diskMb: number;
  timeoutMs: number;
  maxProcesses: number;
  networkEnabled: boolean;
}

export interface VirtualEnvironment {
  id: string;
  name: string;
  runtime: SandboxRuntime;
  image: string;
  workdir: string;
  environment: Record<string, string>;
  limits: SandboxLimits;
}

export interface SandboxEnvironment {
  id: string;
  name: string;
  parentId?: string;
  virtualEnvironments: VirtualEnvironment[];
  status: SandboxStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SandboxExecutionRequest {
  sandboxId: string;
  virtualEnvironmentId: string;
  command: string;
  args?: string[];
  stdin?: string;
  timeoutMs?: number;
}

export interface SandboxExecutionResult {
  ok: boolean;
  exitCode: number;
  stdout: string;
  stderr: string;
  durationMs: number;
  timedOut: boolean;
}
