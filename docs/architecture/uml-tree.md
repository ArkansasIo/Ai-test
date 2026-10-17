# UML Architecture Tree

This document defines the UML-style node tree for the modular AI platform. It is intended to be the canonical map from folders to architectural components.

```mermaid
flowchart TD
    ROOT[AI Platform]

    ROOT --> APP[Applications]
    ROOT --> CORE[Core Architecture]
    ROOT --> AGENTS[Agent Architecture]
    ROOT --> MODELS[Model Architecture]
    ROOT --> TOOLS[Tool Architecture]
    ROOT --> KNOW[Knowledge Architecture]
    ROOT --> MEMORY[Memory Architecture]
    ROOT --> WORK[Workflow Architecture]
    ROOT --> TASK[Task Architecture]
    ROOT --> SANDBOX[Sandbox Architecture]
    ROOT --> SECURITY[Security Architecture]
    ROOT --> API[API Architecture]
    ROOT --> DATA[Data Architecture]
    ROOT --> INFRA[Infrastructure]
    ROOT --> DOCS[Documentation]

    APP --> WEB[Web App]
    APP --> DESKTOP[Desktop App]

    CORE --> CTX[AIContext]
    CORE --> MSG[AIMessage]
    CORE --> RESULT[AIResult]
    CORE --> EVENTS[Event Bus]
    CORE --> CONFIG[Configuration]

    AGENTS --> ORCH[Orchestrator]
    AGENTS --> PLAN[Planner]
    AGENTS --> CODE[Coder]
    AGENTS --> RESEARCH[Researcher]
    AGENTS --> GH[GitHub Agent]
    AGENTS --> TOOLAGENT[Tool Agent]

    MODELS --> ROUTER[Model Router]
    MODELS --> OLLAMA[Ollama Provider]
    MODELS --> LLAMA[Llama.cpp Provider]
    MODELS --> COMPAT[OpenAI-Compatible Provider]
    MODELS --> CUSTOM[Custom Provider]

    TOOLS --> REG[Tool Registry]
    TOOLS --> MATH[Math Engine]
    TOOLS --> DICT[Dictionary Tool]
    TOOLS --> SEARCH[Search Tool]
    TOOLS --> FILES[File Tool]
    TOOLS --> EXEC[Execution Tool]

    KNOW --> DICTIONARY[Multilingual Dictionary]
    KNOW --> MATHKB[Math Knowledge]
    KNOW --> DOCSDB[Document Knowledge]
    KNOW --> RETRIEVAL[Retrieval]

    MEMORY --> SHORT[Short-Term Memory]
    MEMORY --> LONG[Long-Term Memory]
    MEMORY --> VECTOR[Vector/Embedding Store]

    WORK --> GRAPH[Workflow Graph]
    WORK --> ENGINE[Workflow Runtime]
    WORK --> LOOP[Loop/Parallel Runtime]
    WORK --> CONDITIONS[Condition Runtime]

    TASK --> TREE[Task Tree]
    TASK --> QUEUE[Task Queue]
    TASK --> SCHED[Scheduler]

    SANDBOX --> SBENV[Sandbox Environment]
    SANDBOX --> VENV[Virtual Environment]
    SANDBOX --> DRIVER[Isolation Driver]
    SANDBOX --> POLICY[Sandbox Policy]
    SANDBOX --> AUDIT[Execution Audit]

    SECURITY --> AUTH[Authentication]
    SECURITY --> RBAC[Authorization/RBAC]
    SECURITY --> SECRETS[Secret Management]
    SECURITY --> RATE[Rate Limiting]
    SECURITY --> THREAT[Threat Model]

    API --> HTTP[HTTP API]
    API --> WS[WebSocket/SSE]
    API --> CONTRACTS[API Contracts]

    DATA --> MYSQL[(MySQL)]
    DATA --> CACHE[(Cache)]
    DATA --> OBJECT[(Object Storage)]

    INFRA --> DOCKER[Containers]
    INFRA --> CI[GitHub Actions]
    INFRA --> OBS[Observability]

    DOCS --> UML[UML]
    DOCS --> ADR[Architecture Decisions]
    DOCS --> RUNBOOK[Runbooks]
```

## Node semantics

| Node | Responsibility | Primary children |
|---|---|---|
| AI Platform | Root architecture | Applications, Core, Agents, Models, Tools, Knowledge, Memory, Workflow, Task, Sandbox, Security, API, Data, Infrastructure |
| Core | Stable domain contracts | Context, messages, results, events, config |
| Agents | Autonomous task execution | Orchestrator, planner, coder, researcher, GitHub, tool agent |
| Models | Inference abstraction | Router and providers |
| Tools | Capability boundary | Registry, math, dictionary, search, files, execution |
| Knowledge | Retrieval and domain data | Dictionary, math, documents, retrieval |
| Memory | Conversation and durable state | Short-term, long-term, vector |
| Workflow | Deterministic orchestration | Graph, runtime, loops, conditions |
| Task | Work decomposition | Tree, queue, scheduler |
| Sandbox | Untrusted execution boundary | Environment, virtual environment, driver, policy, audit |
| Security | Trust boundary | Auth, RBAC, secrets, rate limits, threat model |
| API | External interface | HTTP, streaming, contracts |
| Data | Persistence | MySQL, cache, object storage |
| Infrastructure | Deployment/runtime | Containers, CI, observability |

## Folder-to-node mapping

```text
src/core       -> Core
src/agents     -> Agents
src/models     -> Models
src/tools      -> Tools
src/knowledge  -> Knowledge
src/memory     -> Memory
src/workflows  -> Workflow
src/tasks      -> Task
src/sandbox    -> Sandbox
src/security   -> Security
src/api        -> API
src/modules    -> Module Registry
services/*     -> Runtime deployment nodes
database/*     -> Data nodes
configs/*      -> Configuration nodes
docs/*         -> Documentation nodes
tests/*        -> Verification nodes
```

## Design rule

A UML node may contain multiple implementation files and subfolders, but a source file should have one primary architectural owner. Cross-cutting behavior is exposed through interfaces rather than direct imports across unrelated nodes.
