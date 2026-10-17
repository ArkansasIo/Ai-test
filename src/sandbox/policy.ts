import type { SandboxLimits } from './types';

export interface SandboxPolicy {
  allowNetwork: boolean;
  allowHostFilesystem: boolean;
  allowPrivileged: boolean;
  allowedRuntimes: string[];
  maximum: SandboxLimits;
}

export const DEFAULT_SANDBOX_POLICY: SandboxPolicy = {
  allowNetwork: false,
  allowHostFilesystem: false,
  allowPrivileged: false,
  allowedRuntimes: ['node', 'python', 'shell', 'deno', 'bun'],
  maximum: {
    cpuCores: 2,
    memoryMb: 1024,
    diskMb: 2048,
    timeoutMs: 30_000,
    maxProcesses: 32,
    networkEnabled: false,
  },
};

export function validateSandboxLimits(limits: SandboxLimits, policy = DEFAULT_SANDBOX_POLICY): void {
  if (limits.cpuCores < 1 || limits.cpuCores > policy.maximum.cpuCores) {
    throw new Error('Sandbox CPU limit exceeds policy');
  }
  if (limits.memoryMb < 64 || limits.memoryMb > policy.maximum.memoryMb) {
    throw new Error('Sandbox memory limit exceeds policy');
  }
  if (limits.diskMb < 64 || limits.diskMb > policy.maximum.diskMb) {
    throw new Error('Sandbox disk limit exceeds policy');
  }
  if (limits.timeoutMs < 100 || limits.timeoutMs > policy.maximum.timeoutMs) {
    throw new Error('Sandbox timeout exceeds policy');
  }
  if (limits.maxProcesses < 1 || limits.maxProcesses > policy.maximum.maxProcesses) {
    throw new Error('Sandbox process limit exceeds policy');
  }
  if (limits.networkEnabled && !policy.allowNetwork) {
    throw new Error('Sandbox network access is disabled by policy');
  }
}

export function validateRuntime(runtime: string, policy = DEFAULT_SANDBOX_POLICY): void {
  if (!policy.allowedRuntimes.includes(runtime)) {
    throw new Error(`Runtime ${runtime} is not permitted by sandbox policy`);
  }
}
