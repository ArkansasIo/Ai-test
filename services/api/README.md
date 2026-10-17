# AI-Test Backend API

The backend service owns authenticated API requests, orchestration, model routing, tool execution, memory, persistence, sandbox policy, and audit events.

## Runtime boundary

```text
Client -> API -> Authentication/RBAC -> Policy/Approval -> Orchestrator
                                              |                 |
                                              +-> Audit <-------+
                                                |
                           Models / Tools / Memory / Sandbox / Database
```

The service is intentionally provider-neutral. Local models can be exposed through Ollama or another OpenAI-compatible endpoint without coupling the application layer to a single vendor.
