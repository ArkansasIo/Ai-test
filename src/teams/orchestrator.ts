import type { Agent } from '../agents';
import type { AIContext, AIMessage, AIResult } from '../core';
import type { AgentTeam, TeamMember, TeamRun, TeamTask } from './types';

export interface TeamTaskResult {
  taskId: string;
  memberId?: string;
  ok: boolean;
  result?: AIResult;
  error?: string;
}

export interface TeamExecutionContext extends AIContext {
  objective: string;
  results: Record<string, TeamTaskResult>;
}

export interface TeamAgentExecutor {
  execute(agent: Agent, task: TeamTask, context: TeamExecutionContext): Promise<AIResult>;
}

export interface AgentResolver {
  get(agentId: string): Agent | undefined;
}

export class RegistryTeamAgentExecutor implements TeamAgentExecutor {
  constructor(private readonly registry: AgentResolver) {}

  async execute(agent: Agent, task: TeamTask, context: TeamExecutionContext): Promise<AIResult> {
    const message: AIMessage = {
      role: 'user',
      content: `Team task: ${task.title}\n\n${task.description}\n\nTeam objective: ${context.objective}`,
    };
    return agent.execute([message], context);
  }
}

export interface TeamOrchestratorOptions {
  executor: TeamAgentExecutor;
  registry: AgentResolver;
}

export class TeamOrchestrator {
  constructor(private readonly options: TeamOrchestratorOptions) {}

  async run(team: AgentTeam, run: TeamRun, tasks: TeamTask[], context: TeamExecutionContext): Promise<TeamTaskResult[]> {
    const results: TeamTaskResult[] = [];
    const completed = new Set<string>();
    const taskMap = new Map(tasks.map((task) => [task.id, task]));

    if (run.teamId !== team.id) throw new Error('Team run does not match team');
    for (const id of run.taskIds) if (!taskMap.has(id)) throw new Error(`Unknown team task ${id}`);

    run.status = 'running';
    while (completed.size < run.taskIds.length) {
      const ready = run.taskIds
        .map((id) => taskMap.get(id)!)
        .filter((task) => !completed.has(task.id) && task.dependencies.every((id) => completed.has(id)));
      if (!ready.length) throw new Error('Team task graph has unresolved dependencies or a cycle');

      const batch = team.strategy === 'parallel' || team.strategy === 'consensus'
        ? ready.slice(0, Math.max(1, team.maxConcurrency))
        : [ready[0]];

      const batchResults = await Promise.all(batch.map((task) => this.executeTask(team, task, context)));
      for (const result of batchResults) {
        results.push(result);
        context.results[result.taskId] = result;
        const task = taskMap.get(result.taskId)!;
        task.status = result.ok && team.requireReview ? 'review' : result.ok ? 'completed' : 'failed';
        if (result.ok) completed.add(result.taskId);
      }

      if (batchResults.some((result) => !result.ok)) {
        run.status = 'failed';
        run.completedAt = new Date().toISOString();
        return results;
      }
    }

    run.status = team.requireReview ? 'review' : 'completed';
    run.completedAt = new Date().toISOString();
    return results;
  }

  private async executeTask(team: AgentTeam, task: TeamTask, context: TeamExecutionContext): Promise<TeamTaskResult> {
    const member = this.selectMember(team, task);
    if (!member) return { taskId: task.id, ok: false, error: `No available team member for task ${task.id}` };
    const agent = this.options.registry.get(member.agentId);
    if (!agent) return { taskId: task.id, memberId: member.id, ok: false, error: `Unknown agent ${member.agentId}` };

    member.status = 'working';
    task.status = 'running';
    try {
      const result = await this.options.executor.execute(agent, task, context);
      member.status = 'completed';
      return { taskId: task.id, memberId: member.id, ok: true, result };
    } catch (error) {
      member.status = 'failed';
      return { taskId: task.id, memberId: member.id, ok: false, error: String(error) };
    }
  }

  private selectMember(team: AgentTeam, task: TeamTask): TeamMember | undefined {
    const eligible = team.members.filter((member) => member.status !== 'blocked' && member.status !== 'failed');
    if (task.assignedMemberId) return eligible.find((member) => member.id === task.assignedMemberId);
    const title = task.title.toLowerCase();
    return eligible.find((member) => title.includes(member.role)) ?? eligible[0];
  }
}
