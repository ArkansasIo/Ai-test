# Multi-Architecture Repository Layout

The repository is organized as a layered modular monorepo. Each major architecture owns a directory, contracts live near the subsystem, and cross-cutting configuration is kept outside implementation folders.

```text
Ai-test/
├── apps/
│   ├── web/                         # Web application
│   └── desktop/                     # Optional desktop shell
├── src/
│   ├── core/                        # Runtime contracts and context
│   ├── agents/                      # Agent implementations
│   ├── models/                      # Model/provider abstractions
│   ├── tools/                       # Tool definitions and registry
│   ├── memory/                      # Short/long-term memory contracts
│   ├── workflows/                   # Workflow graph engine
│   ├── tasks/                       # Task tree and scheduling contracts
│   ├── sandbox/                     # Secure execution control plane
│   ├── modules/                     # Modular architecture/registry
│   ├── knowledge/                   # Dictionary, math, documents, search
│   ├── security/                    # Auth, permissions, policy
│   ├── api/                         # API contracts/adapters
│   ├── plugins/                     # Optional extensions
│   └── ui/                          # Shared UI models/components
├── services/
│   ├── api/                         # HTTP API service
│   ├── gateway/                     # Optional model/tool gateway
│   ├── worker/                      # Background task worker
│   └── scheduler/                   # Scheduled jobs
├── database/
│   ├── schema.sql                   # Core MySQL schema
│   ├── dictionary_schema.sql        # Dictionary data
│   ├── math_schema.sql              # Math knowledge/cache
│   ├── sandbox_schema.sql           # Sandbox state/audit
│   ├── migrations/                  # Versioned migrations
│   └── cron/                        # MySQL/application job definitions
├── configs/
│   ├── app.env.example
│   ├── mysql.env.example
│   ├── sandbox.env.example
│   ├── models/                      # Provider configuration
│   └── security/                    # Security policies
├── docs/
│   ├── architecture/                # Architecture and UML
│   ├── agents/                      # Agent documentation
│   ├── api/                         # API contracts
│   ├── database/                    # Database documentation
│   ├── math/                        # Math/Wolfram documentation
│   ├── sandbox/                     # Sandbox documentation
│   └── security/                    # Threat model and policies
├── plugins/
│   ├── model-providers/
│   ├── knowledge/
│   ├── tools/
│   └── ui/
├── scripts/
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── security/
│   └── sandbox/
├── docker/
├── .github/
│   └── workflows/
├── photos/
└── README.md
```

## Architecture boundaries

### Core architecture
Owns context, messages, results, lifecycle, and common interfaces. It must not depend on concrete UI or provider implementations.

### Agent architecture
Agents consume model, tool, memory, knowledge, and workflow interfaces. Agent implementations should be independently testable.

### Model architecture
Provider-neutral interfaces allow Ollama, llama.cpp, OpenAI-compatible endpoints, or future providers to be selected through configuration.

### Tool architecture
Tools are capability providers. Security-sensitive tools must declare permissions and use the sandbox when executing generated or untrusted code.

### Knowledge architecture
Knowledge sources are independently indexed and queried. Dictionary and mathematical knowledge remain separate domains but share a common retrieval interface.

### Sandbox architecture
The sandbox has two levels: isolated sandbox environments and virtual environments within each sandbox. The control plane is in `src/sandbox`; production isolation belongs to a container/VM/OS driver.

### Service architecture
API, worker, scheduler, and gateway services communicate through typed contracts and persistence interfaces rather than importing application internals directly.

## Folder ownership rule

Every source folder must have one clear owner and one public entry point where practical. Internal implementation files remain private to that subsystem; public contracts are exported from `index.ts` or an explicit API module.
