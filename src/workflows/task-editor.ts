import type { TeamWorkflow, TeamWorkflowStep } from './team-workflow';

export interface TaskEditPatch {
  name?: string;
  description?: string;
  memberRole?: string;
  dependsOn?: string[];
  condition?: string;
  maxRetries?: number;
  enabled?: boolean;
}

export class TaskEditor {
  editStep(workflow: TeamWorkflow, stepId: string, patch: TaskEditPatch): TeamWorkflow {
    const step = workflow.steps.find((item) => item.id === stepId);
    if (!step) throw new Error(`Unknown workflow step ${stepId}`);

    const updatedStep: TeamWorkflowStep = {
      ...step,
      ...(patch.name === undefined ? {} : { name: patch.name }),
      ...(patch.description === undefined ? {} : { description: patch.description }),
      ...(patch.memberRole === undefined ? {} : { memberRole: patch.memberRole }),
      ...(patch.dependsOn === undefined ? {} : { dependsOn: [...patch.dependsOn] }),
      ...(patch.condition === undefined ? {} : { condition: patch.condition }),
      ...(patch.maxRetries === undefined ? {} : { maxRetries: patch.maxRetries }),
    };

    if (updatedStep.dependsOn.includes(stepId)) {
      throw new Error('A workflow step cannot depend on itself');
    }
    if (updatedStep.maxRetries !== undefined && updatedStep.maxRetries < 0) {
      throw new Error('maxRetries cannot be negative');
    }

    return {
      ...workflow,
      steps: workflow.steps.map((item) => (item.id === stepId ? updatedStep : item)),
      version: workflow.version + 1,
    };
  }

  addStep(workflow: TeamWorkflow, step: TeamWorkflowStep): TeamWorkflow {
    if (workflow.steps.some((item) => item.id === step.id)) {
      throw new Error(`Duplicate workflow step ${step.id}`);
    }
    return { ...workflow, steps: [...workflow.steps, step], version: workflow.version + 1 };
  }

  removeStep(workflow: TeamWorkflow, stepId: string): TeamWorkflow {
    if (stepId === workflow.entryStepId || stepId === workflow.finalStepId) {
      throw new Error('Entry and final workflow steps cannot be removed');
    }
    if (!workflow.steps.some((item) => item.id === stepId)) {
      throw new Error(`Unknown workflow step ${stepId}`);
    }
    return {
      ...workflow,
      steps: workflow.steps
        .filter((item) => item.id !== stepId)
        .map((item) => ({ ...item, dependsOn: item.dependsOn.filter((id) => id !== stepId) })),
      version: workflow.version + 1,
    };
  }
}
