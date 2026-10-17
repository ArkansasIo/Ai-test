import { AgentRegistry, type Agent } from './agents/index.js';
import { InMemoryAuditSink } from './audit/index.js';
import type { AIContext, AIMessage, AIResult } from './core/index.js';
import { AgentTeamManager } from './teams/manager.js';
import { TeamOrchestrator, RegistryTeamAgentExecutor } from './teams/orchestrator.js';
import type { AgentTeam, TeamRun, TeamTask } from './teams/types.js';

const agents = new AgentRegistry();

const demoAgent = (id: string, name: string): Agent => ({
  id,
  name,
  async execute(input: AIMessage[], _context: AIContext): Promise<AIResult> {
    return { ok: true, value: { agent: id, response: `Completed: ${input.at(-1)?.content ?? ''}` } };
  },
});

agents.register(demoAgent('researcher', 'Research Agent'));
agents.register(demoAgent('planner', 'Planning Agent'));

const team: AgentTeam = {
  id: 'prototype-team',
  name: 'Prototype AI Team',
  strategy: 'parallel',
  members: [
    { id: 'researcher-member', name: 'Researcher', agentId: 'researcher', role: 'researcher', status: 'idle', capabilities: ['research'] },
    { id: 'planner-member', name: 'Planner', agentId: 'planner', role: 'planner', status: 'idle', capabilities: ['planning'] },
  ],
  maxConcurrency: 2,
  requireReview: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const tasks: TeamTask[] = [
  { id: 'research-task', teamId: team.id, title: 'research architecture', description: 'Review the modular AI-Test architecture.', dependencies: [], status: 'queued' },
  { id: 'planning-task', teamId: team.id, title: 'planner architecture', description: 'Create an implementation plan for the modular architecture.', dependencies: ['research-task'], status: 'queued' },
];

const run: TeamRun = {
  id: 'prototype-run',
  teamId: team.id,
  objective: 'Validate the AI-Test modular architecture.',
  taskIds: tasks.map((task) => task.id),
  status: 'planning',
  startedAt: new Date().toISOString(),
};

const context: AIContext = {
  requestId: crypto.randomUUID(),
  userId: 'demo-user',
  projectId: 'ai-test',
  metadata: {},
};

const teamContext = { ...context, objective: run.objective, results: {} };
const manager = new AgentTeamManager();
manager.register(team);
for (const task of tasks) manager.addTask(task);
manager.createRun(run);

const audit = new InMemoryAuditSink();
const orchestrator = new TeamOrchestrator({
  registry: agents,
  executor: new RegistryTeamAgentExecutor(agents),
});

const result = await orchestrator.run(team, run, tasks, teamContext);
await audit.append({
  id: crypto.randomUUID(),
  type: 'result',
  requestId: context.requestId,
  timestamp: new Date().toISOString(),
  action: 'demo.completed',
  metadata: { taskCount: result.length, status: run.status },
});

console.log(JSON.stringify({ team: team.name, run, result, audit: audit.list(context.requestId) }, null, 2));
