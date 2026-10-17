export interface ApiRequest<T = unknown> { method: string; path: string; body?: T; requestId: string; }
export interface ApiResponse<T = unknown> { status: number; requestId: string; data?: T; error?: { code: string; message: string }; }
export interface HealthResponse { status: 'ok' | 'degraded'; version: string; timestamp: string; }
export interface ChatRequest { conversationId?: string; message: string; model?: string; }
export interface ChatResponse { conversationId: string; messageId: string; content: string; model: string; }
