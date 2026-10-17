# AI Test Platform

Modular open-model AI agent platform.

## Initial architecture

```text
Ai-test/
├── src/
│   ├── agents/
│   ├── api/
│   ├── conversation/
│   ├── core/
│   ├── knowledge/
│   ├── mcp/
│   ├── memory/
│   ├── models/
│   ├── plugins/
│   ├── security/
│   ├── tasks/
│   ├── tools/
│   ├── types/
│   ├── ui/
│   └── workflows/
├── photos/
│   ├── avatars/
│   ├── backgrounds/
│   ├── generated/
│   ├── icons/
│   └── screenshots/
├── configs/
├── database/
├── docs/
├── scripts/
└── tests/
```

The implementation is provider-neutral and is intended to support local open-weight inference through adapters such as Ollama and llama.cpp, plus an agent/task/workflow layer.
