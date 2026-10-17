# Sandbox subsystem

The AI Test platform uses a layered sandbox model for executing untrusted or generated code without giving an agent unrestricted host access.

## Hierarchy

```text
AI application
└── Sandbox manager
    ├── Sandbox A
    │   ├── Virtual environment: Node.js
    │   └── Virtual environment: Python
    ├── Sandbox B
    │   ├── Virtual environment: Bun
    │   └── Virtual environment: Shell
    └── Sandbox C
        └── Virtual environment: Deno
```

A sandbox is the isolation boundary. A virtual environment is a runtime-specific execution context inside that boundary. Multiple sandboxes may coexist, and each sandbox may contain multiple virtual environments.

## Required isolation

The production driver should use an operating-system/container isolation layer. The TypeScript manager in `src/sandbox` intentionally defines the control-plane interfaces rather than pretending that an in-process JavaScript boundary is a security boundary.

Recommended production controls:

- separate filesystem namespace and read-only base image;
- non-root execution;
- CPU, memory, disk, process, and wall-clock limits;
- disabled network by default;
- explicit writable workspace;
- dropped Linux capabilities;
- seccomp/AppArmor or an equivalent host policy;
- no host Docker socket mounted into the sandbox;
- execution and audit logging;
- automatic cleanup after expiration.

## Configuration

Copy `configs/sandbox.env.example` into the deployment environment and change limits for the target host. Credentials and host-specific paths must not be committed.

## Data model

`database/sandbox_schema.sql` stores sandbox definitions, virtual environments, execution records, and audit events. Foreign keys ensure virtual environments and execution records are removed when their parent sandbox is deleted.

## API concepts

The eventual API should expose:

- `POST /sandboxes`
- `GET /sandboxes`
- `GET /sandboxes/:id`
- `POST /sandboxes/:id/start`
- `POST /sandboxes/:id/stop`
- `DELETE /sandboxes/:id`
- `POST /sandboxes/:id/environments`
- `POST /sandboxes/:id/execute`
- `GET /sandboxes/:id/executions`

All execution endpoints must authenticate the caller, authorize the requested capability, validate resource limits, and record an audit event.
