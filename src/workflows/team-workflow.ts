import type { AgentTeam } from '../teams';

export type TeamWorkflowStepKind = 'task' | 'parallel' | 'condition' | 'review' | 'handoff' | 'join';

export interface TeamWorkflowStep {
  id: string;
  kind: TeamWorkflowStepKind;
  name: string;
  description?: string;
  memberRole?: string;
  dependsOn: string[];
  condition?: string;
  maxRetries?: number;
}

export interface TeamWorkflow {
  id: string;
  name: string;
  teamId: string;
  description?: string;
  steps: TeamWorkflowStep[];
  entryStepId: string;
  finalStepId: string;
  version: number;
  enabled: boolean;
}

export interface TeamWorkflowRun {
  id: string;
  workflowId: string;
  teamId: string;
  input: unknown;
  completedStepIds: string[];
  failedStepIds: string[];
  status: 'queued' | 'running' | 'paused' | 'review' | 'completed' | 'failed' | 'cancelled';
}

export function validateTeamWorkflow(workflow: TeamWorkflow, team?: AgentTeam): void {
  if (workflow.steps.length === 0) throw new Error('Team workflow requires at least one step');
  const ids = new Set(workflow.steps.map((step) => step.id));
  if (!ids.has(workflow.entryStepId) || !ids.has(workflow.finalStepId)) {
    throw new Error('Team workflow entryStepId and finalStepId must reference workflow steps');
  }
  for (const step of workflow.steps) {
    for (const dependency of step.dependsOn) {
      if (!ids.has(dependency)) throw new Error(`Unknown workflow dependency ${dependency}`);
    }
  }
  if (team && workflow.teamId !== team.id) throw new Error('Workflow team does not match the supplied team');
}
