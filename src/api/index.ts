export interface ApiRequest<T = unknown> { method: string; path: string; body?: T; requestId: string; }
export interface ApiResponse<T = unknown> { status: number; data?: T; error?: string; }
export interface ApiRoute { method: string; path: string; handler: (request: ApiRequest) => Promise<ApiResponse>; }
export class ApiRouter { private readonly routes: ApiRoute[] = []; register(route: ApiRoute): void { this.routes.push(route); } list(): ApiRoute[] { return [...this.routes]; } }
