export interface KnowledgeDocument { id: string; title: string; content: string; metadata: Record<string, unknown>; }
export interface KnowledgeHit { documentId: string; score: number; excerpt: string; }
export interface KnowledgeStore { upsert(document: KnowledgeDocument): Promise<void>; search(query: string, limit?: number): Promise<KnowledgeHit[]>; }
