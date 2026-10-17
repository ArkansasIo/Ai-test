export type AuditEventType = 'request' | 'agent' | 'team' | 'workflow' | 'tool' | 'model' | 'sandbox' | 'result' | 'error';

export interface AuditEvent {
  id: string;
  type: AuditEventType;
  requestId: string;
  timestamp: string;
  actor?: string;
  action: string;
  metadata?: Record<string, unknown>;
}

export interface AuditSink {
  append(event: AuditEvent): Promise<void>;
  list(requestId?: string): AuditEvent[];
}

export class InMemoryAuditSink implements AuditSink {
  private readonly events: AuditEvent[] = [];

  async append(event: AuditEvent): Promise<void> {
    this.events.push(event);
  }

  list(requestId?: string): AuditEvent[] {
    return requestId ? this.events.filter((event) => event.requestId === requestId) : [...this.events];
  }
}
