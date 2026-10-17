export interface MemoryRecord {
  id: string;
  userId?: string;
  namespace: string;
  content: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface MemoryStore {
  put(record: MemoryRecord): Promise<void>;
  search(query: string, namespace?: string): Promise<MemoryRecord[]>;
  delete(id: string): Promise<void>;
}
