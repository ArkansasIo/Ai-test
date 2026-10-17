# Changelog

All notable changes to the AI-Test Platform are recorded here.

## 0.1.0 — 2026-10-17

### Added

- Modular AI platform prototype documentation.
- Phone-first dark command-center visual direction.
- Agent, team, workflow, model, tool, memory, sandbox, and UML Studio architecture documentation.
- Version and build metadata.
- Developer metadata for the prototype.
- Safety architecture documentation and visual reference.
- GitHub Pages deployment workflow.
- ProC-25 programming-language registry with 25 language profiles.
- Language-aware compiler, runtime, package-manager, formatter, linter, debugger, test-runner, and build metadata.
- Programming-language UML architecture and language capability documentation.

### Changed

- Removed the obsolete `photos/` repository folder so visual assets are no longer mixed into the application source tree.
- Improved the Pages deployment workflow to provision GitHub Pages automatically when permitted.
- Expanded the canonical UML architecture to include programming languages as a first-class subsystem.

### Safety

- Documented authentication, RBAC, approval gates, sandbox isolation, audit logging, secrets handling, and artifact validation as platform requirements.
- Language toolchains are selected through sandbox profiles; selecting a language does not grant host execution privileges.

## Development notes

This is a prototype release. Backend execution, MySQL, local/open model runtimes, and privileged sandbox operations are intentionally separate from the static GitHub Pages client.
