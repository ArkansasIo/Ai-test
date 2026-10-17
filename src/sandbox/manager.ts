import type {
  SandboxEnvironment,
  SandboxExecutionRequest,
  SandboxExecutionResult,
  SandboxStatus,
  VirtualEnvironment,
} from './types';

export interface SandboxDriver {
  create(environment: SandboxEnvironment): Promise<void>;
  destroy(environment: SandboxEnvironment): Promise<void>;
  start(environment: SandboxEnvironment): Promise<void>;
  stop(environment: SandboxEnvironment): Promise<void>;
  execute(
    environment: SandboxEnvironment,
    virtualEnvironment: VirtualEnvironment,
    request: SandboxExecutionRequest,
  ): Promise<SandboxExecutionResult>;
}

export class InMemorySandboxManager {
  private readonly sandboxes = new Map<string, SandboxEnvironment>();

  constructor(private readonly driver: SandboxDriver) {}

  register(environment: SandboxEnvironment): void {
    this.sandboxes.set(environment.id, environment);
  }

  get(id: string): SandboxEnvironment | undefined {
    return this.sandboxes.get(id);
  }

  list(): SandboxEnvironment[] {
    return [...this.sandboxes.values()];
  }

  async create(environment: SandboxEnvironment): Promise<SandboxEnvironment> {
    environment.status = 'creating';
    this.register(environment);
    try {
      await this.driver.create(environment);
      environment.status = 'ready';
      environment.updatedAt = new Date().toISOString();
      return environment;
    } catch (error) {
      environment.status = 'failed';
      environment.updatedAt = new Date().toISOString();
      throw error;
    }
  }

  async setStatus(id: string, status: SandboxStatus): Promise<void> {
    const environment = this.require(id);
    environment.status = status;
    environment.updatedAt = new Date().toISOString();
  }

  async start(id: string): Promise<void> {
    const environment = this.require(id);
    await this.driver.start(environment);
    await this.setStatus(id, 'running');
  }

  async stop(id: string): Promise<void> {
    const environment = this.require(id);
    await this.driver.stop(environment);
    await this.setStatus(id, 'stopped');
  }

  async destroy(id: string): Promise<void> {
    const environment = this.require(id);
    await this.driver.destroy(environment);
    await this.setStatus(id, 'destroyed');
  }

  async execute(request: SandboxExecutionRequest): Promise<SandboxExecutionResult> {
    const environment = this.require(request.sandboxId);
    if (environment.status !== 'running') {
      throw new Error(`Sandbox ${request.sandboxId} is not running`);
    }

    const virtualEnvironment = environment.virtualEnvironments.find(
      (item) => item.id === request.virtualEnvironmentId,
    );
    if (!virtualEnvironment) {
      throw new Error(`Virtual environment ${request.virtualEnvironmentId} was not found`);
    }

    return this.driver.execute(environment, virtualEnvironment, request);
  }

  private require(id: string): SandboxEnvironment {
    const environment = this.sandboxes.get(id);
    if (!environment) throw new Error(`Sandbox ${id} was not found`);
    return environment;
  }
}
