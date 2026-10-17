# Development & Build Information

## Repository

- Repository: `ArkansasIo/Ai-test`
- Default branch: `main`
- Current prototype version: `0.1.0`
- Developer: Stephen / `ArkansasIo`

## Architecture

```text
Phone-first UI
   ↓
API / Gateway
   ↓
Task Orchestrator
   ↓
Teams → Agents → Model Router
   ↓
Tools / Memory / Sandbox
   ↓
MySQL + external/local model runtimes
```

GitHub Pages hosts the static documentation/prototype client. Server-side API, MySQL, local models, and sandbox execution remain separate services.

## Build information

The repository contains a GitHub Pages workflow at `.github/workflows/pages.yml`. The workflow publishes the `docs/` directory as the static site.

## Safety build requirements

1. Keep secrets out of source control.
2. Require explicit approval before privileged or destructive tools execute.
3. Keep sandbox execution isolated from the host system.
4. Record security-sensitive tool activity in the audit layer.
5. Validate external inputs at the API boundary.
6. Keep production credentials in deployment secrets/environment configuration.

## UI direction

The visual target is a dark, compact command-center interface designed for phone screens first, then expanded for tablets and desktop. The same visual language is used for Agents, Teams, Workflows, Models, Tools, Memory, Sandbox, and UML Studio.
