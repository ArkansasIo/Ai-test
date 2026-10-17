import { AgentTeam, TeamOrchestrator } from './teams/index.js';

const team = new AgentTeam({
  id: 'prototype-team',
  name: 'Prototype AI Team',
  strategy: 'parallel',
  members: [
    { id: 'researcher', agentId: 'researcher', role: 'research' },
    { id: 'planner', agentId: 'planner', role: 'planning' }
  ]
});

const orchestrator = new TeamOrchestrator();
const result = await orchestrator.run(team, {
  id: 'prototype-task',
  title: 'Prototype task',
  input: 'Validate the AI-test modular architecture.',
  dependencies: []
});

console.log(JSON.stringify({ team: team.name, result }, null, 2));
