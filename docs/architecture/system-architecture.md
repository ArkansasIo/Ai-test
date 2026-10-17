# System Architecture

```mermaid
flowchart LR
    UI[Web / Desktop UI]
    API[API Gateway]
    ORCH[Orchestrator]
    AG[Agent Runtime]
    MOD[Module Registry]
    MODEL[Model Router]
    TOOL[Tool Registry]
    MEM[Memory]
    KNOW[Knowledge]
    WF[Workflow Engine]
    TASK[Task Engine]
    SB[Sandbox Manager]
    DB[(MySQL)]
    EXT[External Providers]

    UI --> API
    API --> ORCH
    ORCH --> AG
    ORCH --> WF
    ORCH --> TASK
    AG --> MODEL
    AG --> TOOL
    AG --> MEM
    AG --> KNOW
    TOOL --> SB
    MODEL --> EXT
    MEM --> DB
    KNOW --> DB
    TASK --> DB
    SB --> DB
    MOD --> AG
    MOD --> MODEL
    MOD --> TOOL
    MOD --> KNOW
```

## Runtime flow

```text
request
  -> authentication/authorization
  -> orchestrator
  -> task/workflow planning
  -> agent selection
  -> model/tool calls
  -> sandbox when execution is required
  -> memory/knowledge persistence
  -> response
```

## Deployment architectures

### Local development

```text
Browser -> API -> Node/TypeScript runtime -> MySQL
                           |-> Ollama
                           |-> Sandbox driver
```

### Production

```text
Load Balancer
    |
API instances
    |
Orchestrator / Worker / Scheduler
    |          |             |
Model GW   Tool GW       Job Queue
    |          |
Providers   Sandboxed runtimes
    |
MySQL / cache / object storage
```

The same domain contracts are used in both architectures. Deployment-specific drivers are selected through configuration.
