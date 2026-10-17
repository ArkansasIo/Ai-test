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

### Changed

- Removed the obsolete `photos/` repository folder so visual assets are no longer mixed into the application source tree.
- Improved the Pages deployment workflow to provision GitHub Pages automatically when permitted.

### Safety

- Documented authentication, RBAC, approval gates, sandbox isolation, audit logging, secrets handling, and artifact validation as platform requirements.

## Development notes

This is a prototype release. Backend execution, MySQL, local/open model runtimes, and privileged sandbox operations are intentionally separate from the static GitHub Pages client.
