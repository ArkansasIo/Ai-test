import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { loadConfig } from '../config/index.js';
import { createRuntimeService } from '../runtime/service.js';

const config = loadConfig();
const runtime = createRuntimeService();

const json = (response: ServerResponse, status: number, body: unknown): void => {
  response.statusCode = status;
  response.setHeader('content-type', 'application/json; charset=utf-8');
  response.end(JSON.stringify(body));
};

const readBody = async (request: IncomingMessage): Promise<unknown> => {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.length;
    if (size > config.maxBodyBytes) throw new Error('request body too large');
    chunks.push(buffer);
  }
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
};

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url ?? '/', `http://${request.headers.host ?? 'localhost'}`);
    if (request.method === 'GET' && url.pathname === '/health') {
      json(response, 200, { ok: true, service: 'ai-test-platform', environment: config.environment });
      return;
    }
    if (request.method === 'POST' && url.pathname === '/api/v1/run') {
      const body = await readBody() as { agent?: unknown; input?: unknown; userId?: unknown };
      if (!body.agent || typeof body.agent !== 'object' || typeof body.input !== 'string') {
        json(response, 400, { ok: false, error: 'agent and input are required' });
        return;
      }
      const result = await runtime.run({ agent: body.agent as never, input: body.input, userId: typeof body.userId === 'string' ? body.userId : undefined });
      json(response, 200, { ok: true, result });
      return;
    }
    json(response, 404, { ok: false, error: 'route_not_found' });
  } catch (error) {
    json(response, 500, { ok: false, error: error instanceof Error ? error.message : String(error) });
  }
});

server.listen(config.port, config.host, () => {
  console.log(`AI Test API listening on http://${config.host}:${config.port}`);
});
