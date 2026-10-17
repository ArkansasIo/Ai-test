import { id, now } from './utils.js';

export type StepStatus = 'pending' | 'running' | 'completed' | 'failed';
export interface WorkflowContext { values: Record<string, unknown>; }
export interface WorkflowStep { id: string; name: string; run(context: WorkflowContext): Promise<void>; }
export interface WorkflowResult { id: string; status: 'completed' | 'failed'; startedAt: string; completedAt: string; error?: string; }

export class WorkflowEngine {
  async execute(steps: WorkflowStep[], initial: WorkflowContext = { values: {} }): Promise<WorkflowResult> {
    const result: WorkflowResult = { id: id(), status: 'completed', startedAt: now(), completedAt: now() };
    try {
      for (const step of steps) await step.run(initial);
      result.completedAt = now();
      return result;
    } catch (error) {
      result.status = 'failed';
      result.error = error instanceof Error ? error.message : String(error);
      result.completedAt = now();
      return result;
    }
  }
}
