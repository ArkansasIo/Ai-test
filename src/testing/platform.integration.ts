import { strict as assert } from 'node:assert';
import test from 'node:test';
import { AgentRegistry, type Agent } from '../agents/index.js';
import { InMemoryAuditSink } from '../audit/index.js';
import type { AIContext, AIMessage, AIResult } from '../core/index.js';
import { AgentTeamManager } from '../teams/manager.js';
import { RegistryTeamAgentExecutor, TeamOrchestrator } from '../teams/orchestrator.js';
import type { AgentTeam, TeamRun, TeamTask } from '../teams/types.js';

test('agent team executes dependency graph and records results', async () => {
  const registry = new AgentRegistry();
  const makeAgent = (id: string): Agent => ({
    id,
    name: id,
    async execute(messages: AIMessage[], _context: AIContext): Promise<AIResult> {
      return { ok: true, value: { agent: id, input: messages[0]?.content } };
    },
  });
  registry.register(makeAgent('researcher'));
  registry.register(makeAgent('planner'));

  const team: AgentTeam = {
    id: 'integration-team', name: 'Integration Team', strategy: 'sequential',
    members: [
      { id: 'researcher', name: 'Researcher', agentId: 'researcher', role: 'researcher', status: 'idle', capabilities: [] },
      { id: 'planner', name: 'Planner', agentId: 'planner', role: 'planner', status: 'idle', capabilities: [] },
    ], maxConcurrency: 1, requireReview: false,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  };
  const tasks: TeamTask[] = [
    { id: 'research', teamId: team.id, title: 'research', description: 'Research platform', dependencies: [], status: 'queued' },
    { id: 'plan', teamId: team.id, title: 'planner', description: 'Plan platform', dependencies: ['research'], status: 'queued' },
  ];
  const run: TeamRun = { id: 'integration-run', teamId: team.id, objective: 'test', taskIds: ['research', 'plan'], status: 'planning', startedAt: new Date().toISOString() };

  const manager = new AgentTeamManager();
  manager.register(team);
  tasks.forEach((task) => manager.addTask(task));
  manager.createRun(run);

  const context = { requestId: 'integration-request', objective: run.objective, results: {}, metadata: {} };
  const orchestrator = new TeamOrchestrator({ registry, executor: new RegistryTeamAgentExecutor(registry) });
  const results = await orchestrator.run(team, run, tasks, context);

  assert.equal(results.length, 2);
  assert.equal(results.every((result) => result.ok), true);
  assert.equal(run.status, 'completed');
});

test('audit sink isolates events by request', async () => {
  const audit = new InMemoryAuditSink();
  await audit.append({ id: '1', type: 'request', requestId: 'a', timestamp: new Date().toISOString(), action: 'start' });
  await audit.append({ id: '2', type: 'result', requestId: 'b', timestamp: new Date().toISOString(), action: 'done' });
  assert.equal(audit.list('a').length, 1);
  assert.equal(audit.list('b').length, 1);
  assert.equal(audit.list().length, 2);
});
