import type { AgentTeam, TeamMember, TeamRun, TeamTask } from './types';

export class AgentTeamManager {
  private readonly teams = new Map<string, AgentTeam>();
  private readonly tasks = new Map<string, TeamTask>();
  private readonly runs = new Map<string, TeamRun>();

  register(team: AgentTeam): void {
    if (team.members.length === 0) throw new Error('An agent team requires at least one member');
    this.teams.set(team.id, team);
  }

  get(teamId: string): AgentTeam | undefined {
    return this.teams.get(teamId);
  }

  list(): AgentTeam[] {
    return [...this.teams.values()];
  }

  addMember(teamId: string, member: TeamMember): void {
    const team = this.requireTeam(teamId);
    if (team.members.some((item) => item.id === member.id)) throw new Error(`Duplicate member ${member.id}`);
    team.members.push(member);
    team.updatedAt = new Date().toISOString();
  }

  addTask(task: TeamTask): void {
    this.requireTeam(task.teamId);
    for (const dependency of task.dependencies) {
      if (!this.tasks.has(dependency)) throw new Error(`Unknown task dependency ${dependency}`);
    }
    this.tasks.set(task.id, task);
  }

  createRun(run: TeamRun): void {
    this.requireTeam(run.teamId);
    this.runs.set(run.id, run);
  }

  getReadyTasks(teamId: string): TeamTask[] {
    return [...this.tasks.values()].filter((task) => {
      if (task.teamId !== teamId || task.status !== 'queued') return false;
      return task.dependencies.every((id) => this.tasks.get(id)?.status === 'completed');
    });
  }

  private requireTeam(teamId: string): AgentTeam {
    const team = this.teams.get(teamId);
    if (!team) throw new Error(`Unknown agent team ${teamId}`);
    return team;
  }
}
