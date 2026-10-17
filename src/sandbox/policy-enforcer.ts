import type { SandboxExecutionRequest, VirtualEnvironment } from './types';
import { validateRuntime, validateSandboxLimits, type SandboxPolicy } from './policy';

export class SandboxPolicyEnforcer {
  constructor(private readonly policy?: SandboxPolicy) {}

  validateEnvironment(environment: VirtualEnvironment): void {
    validateRuntime(environment.runtime, this.policy);
    validateSandboxLimits(environment.limits, this.policy);
  }

  validateExecution(environment: VirtualEnvironment, request: SandboxExecutionRequest): void {
    this.validateEnvironment(environment);
    const requestedTimeout = request.timeoutMs ?? environment.limits.timeoutMs;
    if (requestedTimeout < 100 || requestedTimeout > environment.limits.timeoutMs) {
      throw new Error('Requested execution timeout exceeds virtual-environment policy');
    }
    if (request.command.trim().length === 0) {
      throw new Error('Sandbox command cannot be empty');
    }
  }
}
