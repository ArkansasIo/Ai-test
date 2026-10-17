import { id, now } from './utils.js';
import type { Json, MemoryRecord } from './types.js';

export interface MemoryStore {
  put(record: MemoryRecord): Promise<void>;
  search(namespace: string, query: string, limit?: number): Promise<MemoryRecord[]>;
  delete(id: string): Promise<boolean>;
}

export class InMemoryStore implements MemoryStore {
  private readonly records = new Map<string, MemoryRecord>();

  async put(record: MemoryRecord): Promise<void> { this.records.set(record.id, record); }

  async search(namespace: string, query: string, limit = 10): Promise<MemoryRecord[]> {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    return [...this.records.values()]
      .filter((r) => r.namespace === namespace)
      .map((r) => ({ r, score: terms.reduce((n, term) => n + (r.text.toLowerCase().includes(term) ? 1 : 0), 0) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score || b.r.createdAt.localeCompare(a.r.createdAt))
      .slice(0, limit)
      .map((x) => x.r);
  }

  async delete(recordId: string): Promise<boolean> { return this.records.delete(recordId); }
}

export function createMemory(namespace: string, text: string, metadata: Record<string, Json> = {}): MemoryRecord {
  return { id: id(), namespace, text, metadata, createdAt: now() };
}
