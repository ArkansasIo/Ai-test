import assert from 'node:assert/strict';
import test from 'node:test';
import { createEngine } from '../engine/index.js';

test('engine creates a usable agent runtime', async () => {
  const engine = createEngine();
  const run = await engine.agents.run({ id: 'test-agent', name: 'Test Agent', systemPrompt: 'Be concise.', model: 'mock' }, 'hello');
  assert.equal(run.status, 'completed');
  assert.match(run.output ?? '', /hello/);
});

test('memory performs lexical retrieval', async () => {
  const engine = createEngine();
  await engine.memory.put({ id: 'm1', namespace: 'test-agent', text: 'TypeScript modular architecture', metadata: {}, createdAt: new Date().toISOString() });
  const results = await engine.memory.search('test-agent', 'modular architecture');
  assert.equal(results.length, 1);
});
