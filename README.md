# AI Test Platform

Modular open-model AI agent platform.

## Architecture

```text
Ai-test/
├── src/
│   ├── agents/          # agent definitions and orchestration
│   ├── api/             # API contracts and client/router
│   ├── core/            # shared runtime contracts
│   ├── engine/          # provider-neutral executable AI engine
│   ├── knowledge/       # knowledge services
│   ├── mcp/             # Model Context Protocol integration
│   ├── memory/          # persistent/context memory abstractions
│   ├── models/          # model contracts and providers
│   ├── modules/         # modular platform components
│   ├── plugins/         # extension points
│   ├── runtime/         # platform runtime
│   ├── sandbox/         # isolated execution
│   ├── security/        # permissions and safety controls
│   ├── tasks/           # task graph and execution
│   ├── teams/           # multi-agent teams
│   ├── testing/         # platform and engine tests
│   ├── tools/           # tool contracts and execution
│   ├── types/           # shared TypeScript types
│   └── workflows/       # workflow definitions
├── apps/uml-studio/     # browser UML/meta-studio application
├── configs/             # environment templates
├── database/            # MySQL schemas, seeds and cron jobs
├── docs/                # architecture and developer documentation
└── .github/workflows/   # CI and GitHub Pages
```

The platform is provider-neutral and supports local open-weight inference through adapters such as Ollama and llama.cpp, together with an agent/task/workflow layer.

## Executable engine

The new `src/engine` package provides a compact reference runtime with:

- agent execution lifecycle and events;
- model adapters and a model registry;
- Ollama integration without an additional SDK dependency;
- in-memory contextual memory and retrieval;
- tool registration and execution;
- sequential workflow execution;
- deterministic mock inference for tests and development.

See [`docs/ENGINE.md`](docs/ENGINE.md) for the engine API and examples.

## Development

```bash
npm install
npm run typecheck
npm run build
npm test
npm run dev
```

The mock model allows the platform to be exercised without API keys or an external inference service. Ollama can be enabled by registering `OllamaAdapter` against a local Ollama endpoint.
