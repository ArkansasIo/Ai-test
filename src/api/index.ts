export * from './client.js';
export * from './contracts.js';
export * from './errors.js';

export interface ApiRoute { method: string; path: string; handler: (request: ApiRequest) => Promise<ApiResponse>; }
export class ApiRouter { private readonly routes: ApiRoute[] = []; register(route: ApiRoute): void { this.routes.push(route); } list(): ApiRoute[] { return [...this.routes]; } }
export interface ApiRequest { method: string; path: string; body?: unknown; requestId: string; }
export interface ApiResponse<T = unknown> { status: number; requestId: string; data?: T; error?: { code: string; message: string }; }
