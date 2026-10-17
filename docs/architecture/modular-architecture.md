# Modular Architecture

The AI Test clone is organized as independently deployable and replaceable modules with explicit contracts.

```mermaid
flowchart TD
    APP[AI Application]
    CORE[Core Module]
    AGENTS[Agent Module]
    MODELS[Model Providers]
    TOOLS[Tool Registry]
    MEMORY[Memory]
    WORKFLOW[Workflow Engine]
    KNOWLEDGE[Knowledge]
    SANDBOX[Sandbox]
    API[API Layer]
    UI[UI Layer]
    PLUGINS[Plugin Modules]

    APP --> CORE
    CORE --> AGENTS
    CORE --> WORKFLOW
    AGENTS --> MODELS
    AGENTS --> TOOLS
    AGENTS --> MEMORY
    AGENTS --> KNOWLEDGE
    TOOLS --> SANDBOX
    API --> CORE
    UI --> API
    PLUGINS --> CORE
    PLUGINS --> TOOLS
    PLUGINS --> KNOWLEDGE
```

## Module contract

Every module has an ID, semantic version, kind, entrypoint, dependency list, capabilities, and configuration schema. `ModuleRegistry` controls registration and enabled/disabled state.

## Design rules

1. Modules communicate through typed interfaces rather than importing implementation details across boundaries.
2. Provider implementations remain replaceable. A local model, remote model, or future provider can implement the same model contract.
3. Tools execute through the tool registry and use the sandbox for untrusted code.
4. Configuration is externalized into environment/config files.
5. Persistence is isolated behind data-access services; modules do not embed database credentials.
6. Optional capabilities are represented as optional module dependencies.
7. Security-sensitive modules such as sandbox and authentication have explicit policies.

## Planned module tree

```text
src/
├── core/
├── agents/
├── models/
├── tools/
├── memory/
├── workflows/
├── sandbox/
├── knowledge/
├── modules/
├── api/
├── security/
├── plugins/
└── ui/
```

This structure allows individual modules to be tested, upgraded, disabled, or replaced without redesigning the entire application.
