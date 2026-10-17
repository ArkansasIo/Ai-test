# AI-Test UML Studio

The AI-Test UML Studio is the redesigned descendant of the MLTA UML Studio from `ArkansasIo/Framework-temp`. It keeps the useful visual UML editor model while making the vocabulary native to the AI-Test operating platform.

## AI-native components

- Agent
- Agent Team
- Workflow
- Model / Model Router
- Tool / MCP
- Memory / Knowledge
- Secure Sandbox
- Artifact
- API / MCP endpoint
- Security / RBAC
- Database
- Standard UML Class, Interface, Component, Use Case and Note

## Editor features

- Visual drag-and-drop architecture canvas
- AI-specific component palette
- Connectors for association, dependency, inheritance, composition, aggregation, handoff, data-flow and tool-call
- Editable component properties
- Snap-to-grid and zoom
- Undo/redo
- Local browser persistence
- JSON import/export
- SVG export
- AI-Test reference architecture sample
- Responsive layout for smaller screens

## Architecture role

The studio is intended to become the visual design surface for the platform's agent, team, workflow, model, tool, memory, sandbox, artifact and security subsystems. Future integration can serialize the editor's JSON directly into `src/teams`, `src/workflows`, `src/models`, `src/tools`, `src/memory`, `src/sandbox` and related APIs.

## Local use

Open `index.html` in a browser or serve `apps/uml-studio/` as static web content. No build tool or third-party runtime dependency is required.
