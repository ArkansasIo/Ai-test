import type { ApiRequest, ApiResponse } from './contracts.js';

export class ApiClient {
  constructor(private readonly baseUrl: string) {}

  async request<TResponse, TBody = unknown>(request: ApiRequest<TBody>): Promise<ApiResponse<TResponse>> {
    const response = await fetch(new URL(request.path, this.baseUrl), {
      method: request.method,
      headers: { 'content-type': 'application/json', 'x-request-id': request.requestId },
      body: request.body === undefined ? undefined : JSON.stringify(request.body),
    });
    const data = (await response.json().catch(() => undefined)) as TResponse | undefined;
    if (!response.ok) return { status: response.status, requestId: request.requestId, error: { code: `HTTP_${response.status}`, message: response.statusText }, data };
    return { status: response.status, requestId: request.requestId, data };
  }
}
