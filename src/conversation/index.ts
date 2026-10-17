export interface Conversation { id: string; projectId?: string; title?: string; messages: ConversationMessage[]; }
export interface ConversationMessage { id: string; role: 'system' | 'user' | 'assistant' | 'tool'; content: string; createdAt: string; }
export class ConversationStore { private readonly conversations = new Map<string, Conversation>(); create(conversation: Conversation): Conversation { this.conversations.set(conversation.id, conversation); return conversation; } get(id: string): Conversation | undefined { return this.conversations.get(id); } }
