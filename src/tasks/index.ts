export type TaskStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';

export interface TaskNode {
  id: string;
  parentId?: string;
  name: string;
  status: TaskStatus;
  children: string[];
}

export class TaskTree {
  private readonly nodes = new Map<string, TaskNode>();

  add(node: TaskNode): void {
    this.nodes.set(node.id, node);
    if (node.parentId) this.nodes.get(node.parentId)?.children.push(node.id);
  }

  get(id: string): TaskNode | undefined {
    return this.nodes.get(id);
  }
}
