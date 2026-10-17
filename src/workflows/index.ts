export type WorkflowNodeType = 'start' | 'input' | 'model' | 'agent' | 'tool' | 'condition' | 'loop' | 'parallel' | 'memory-read' | 'memory-write' | 'end';

export interface WorkflowNode {
  id: string;
  type: WorkflowNodeType;
  config: Record<string, unknown>;
}

export interface WorkflowEdge {
  from: string;
  to: string;
  condition?: string;
}

export interface Workflow {
  id: string;
  name: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

export * from './team-workflow';
export * from './team-workflow-manager';
export * from './task-editor';
