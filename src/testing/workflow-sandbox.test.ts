import { strict as assert } from 'node:assert';
import test from 'node:test';
import { AgentRegistry } from '../agents/index.js';
import { InMemoryAuditSink } from '../audit/index.js';
import { WorkflowExecutor } from '../platform/workflow-executor.js';
import { InMemorySandboxDriver } from '../sandbox/in-memory-driver.js';
import { InMemorySandboxManager } from '../sandbox/manager.js';
import type { SandboxEnvironment } from '../sandbox/types.js';
import { ToolRegistry } from '../tools/index.js';
import type { Workflow } from '../workflows/index.js';

const sandbox: SandboxEnvironment = {
  id: 'sandbox-test',
  name: 'Test Sandbox',
  virtualEnvironments: [{
    id: 'node-test',
    name: 'Node Test',
    runtime: 'node',
    image: 'node:22',
    workdir: '/workspace',
    environment: {},
    limits: { cpuCores: 1, memoryMb: 128, diskMb: 128, timeoutMs: 1000, maxProcesses: 4, networkEnabled: false },
  }],
  status: 'creating',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

function makeExecutor() {
  const audit = new InMemoryAuditSink();
  const manager = new InMemorySandboxManager(new InMemorySandboxDriver());
  return { audit, manager, workflowExecutor: new WorkflowExecutor(new AgentRegistry(), new ToolRegistry(), audit, { sandbox: manager }) };
}

const context = { ai: { requestId: 'workflow-request', metadata: {} }, messages: [], variables: {} };

test('workflow sandbox node executes through the sandbox manager and audits the result', async () => {
  const { audit, manager, workflowExecutor } = makeExecutor();
  await manager.create(sandbox);
  await manager.start(sandbox.id);

  const workflow: Workflow = {
    id: 'sandbox-workflow', name: 'Sandbox Workflow',
    nodes: [{ id: 'run', type: 'sandbox', config: { sandboxId: sandbox.id, virtualEnvironmentId: 'node-test', command: 'node', args: ['--version'] } }],
    edges: [],
  };

  const result = await workflowExecutor.run(workflow, context);
  assert.equal(result.ok, true);
  assert.equal((result.value?.run as { ok: boolean }).ok, false);
  assert.equal(audit.list('workflow-request').some((event) => event.type === 'sandbox'), true);
});

test('workflow rejects dependency cycles instead of executing them', async () => {
  const { workflowExecutor } = makeExecutor();
  const workflow: Workflow = {
    id: 'cycle', name: 'Cycle',
    nodes: [{ id: 'a', type: 'input', config: {} }, { id: 'b', type: 'input', config: {} }],
    edges: [{ from: 'a', to: 'b' }, { from: 'b', to: 'a' }],
  };
  const result = await workflowExecutor.run(workflow, context);
  assert.equal(result.ok, false);
  assert.equal(result.error?.code, 'workflow-cycle');
});

test('sandbox policy rejects a network-enabled virtual environment', async () => {
  const { manager } = makeExecutor();
  const invalid = structuredClone(sandbox);
  invalid.id = 'invalid-network';
  invalid.virtualEnvironments[0].limits.networkEnabled = true;
  await assert.rejects(() => manager.create(invalid), /network access is disabled/);
});

test('sandbox execution rejects an unknown virtual environment', async () => {
  const { manager } = makeExecutor();
  const environment = structuredClone(sandbox);
  environment.id = 'missing-ve';
  await manager.create(environment);
  await manager.start(environment.id);
  await assert.rejects(() => manager.execute({ sandboxId: environment.id, virtualEnvironmentId: 'missing', command: 'node' }), /was not found/);
});
