export type TeamStrategy = 'sequential' | 'parallel' | 'debate' | 'hierarchical' | 'consensus';
export type TeamRole = 'lead' | 'planner' | 'researcher' | 'coder' | 'reviewer' | 'tester' | 'tool' | 'custom';
export type TeamMemberStatus = 'idle' | 'working' | 'blocked' | 'completed' | 'failed';

export interface TeamMember {
  id: string;
  name: string;
  agentId: string;
  role: TeamRole;
  instructions?: string;
  status: TeamMemberStatus;
  capabilities: string[];
}

export interface AgentTeam {
  id: string;
  name: string;
  description?: string;
  strategy: TeamStrategy;
  members: TeamMember[];
  maxConcurrency: number;
  requireReview: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TeamTask {
  id: string;
  teamId: string;
  title: string;
  description: string;
  dependencies: string[];
  assignedMemberId?: string;
  status: 'queued' | 'running' | 'review' | 'completed' | 'failed';
  result?: unknown;
}

export interface TeamRun {
  id: string;
  teamId: string;
  objective: string;
  taskIds: string[];
  status: 'planning' | 'running' | 'review' | 'completed' | 'failed';
  startedAt: string;
  completedAt?: string;
}
