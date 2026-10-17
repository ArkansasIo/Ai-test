import type { SandboxDriver } from './manager';
import type { SandboxEnvironment, SandboxExecutionRequest, SandboxExecutionResult, VirtualEnvironment } from './types';
import { SandboxPolicyEnforcer } from './policy-enforcer';

/**
 * Deterministic development driver. It does not execute host commands.
 * Production deployments should provide a container/VM-backed SandboxDriver.
 */
export class InMemorySandboxDriver implements SandboxDriver {
  constructor(private readonly policy = new SandboxPolicyEnforcer()) {}

  async create(environment: SandboxEnvironment): Promise<void> {
    for (const virtualEnvironment of environment.virtualEnvironments) {
      this.policy.validateEnvironment(virtualEnvironment);
    }
  }

  async destroy(_environment: SandboxEnvironment): Promise<void> {}
  async start(_environment: SandboxEnvironment): Promise<void> {}
  async stop(_environment: SandboxEnvironment): Promise<void> {}

  async execute(
    _environment: SandboxEnvironment,
    virtualEnvironment: VirtualEnvironment,
    request: SandboxExecutionRequest,
  ): Promise<SandboxExecutionResult> {
    this.policy.validateExecution(virtualEnvironment, request);
    const started = Date.now();
    return {
      ok: false,
      exitCode: -1,
      stdout: '',
      stderr: 'InMemorySandboxDriver does not execute commands; install a production isolation driver.',
      durationMs: Date.now() - started,
      timedOut: false,
    };
  }
}
