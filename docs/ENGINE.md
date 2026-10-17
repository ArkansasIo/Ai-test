# AI Engine

The `src/engine` package provides a dependency-light runtime for local and provider-neutral AI agents.

## Components

- `types.ts` — stable domain contracts for messages, models, tools, memory and runs.
- `models.ts` — model adapter abstraction, mock adapter, Ollama adapter and registry.
- `memory.ts` — in-memory memory store with lexical retrieval.
- `tools.ts` — tool registry plus safe built-in example tools.
- `agent.ts` — agent execution lifecycle and event hooks.
- `workflow.ts` — deterministic sequential workflow execution.
- `events.ts` — asynchronous event bus.
- `index.ts` — public API and `createEngine()` factory.

## Quick start

```ts
import { createEngine } from './src/engine/index.js';

const engine = createEngine();
const result = await engine.agents.run({
  id: 'assistant',
  name: 'Assistant',
  model: 'mock',
  systemPrompt: 'Be helpful and concise.'
}, 'Explain modular architecture.');

console.log(result.output);
```

## Ollama

Register an Ollama adapter when a local Ollama service is available:

```ts
import { OllamaAdapter } from './src/engine/models.js';
engine.models.register('ollama', new OllamaAdapter('http://127.0.0.1:11434'));
```

The runtime keeps model access behind an adapter so additional providers can be implemented without changing agent logic.
