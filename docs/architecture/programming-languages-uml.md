# ProC-25 Programming Languages UML

The AI-Test platform treats programming languages as a first-class capability of the code-generation, UML Studio, tool, sandbox, and build subsystems.

```mermaid
flowchart TD
    PLATFORM[AI-Test Platform] --> UML[UML Studio]
    PLATFORM --> CODE[Code Generator]
    PLATFORM --> TOOLS[Developer Tools]
    PLATFORM --> SB[Sandbox]
    PLATFORM --> BUILD[Build / Test Engine]

    UML --> REG[ProC-25 Language Registry]
    CODE --> REG
    TOOLS --> REG
    SB --> REG
    BUILD --> REG

    REG --> LANG[25 Programming Languages]
    LANG --> C[C]
    LANG --> CPP[C++]
    LANG --> CS[C#]
    LANG --> JAVA[Java]
    LANG --> KT[Kotlin]
    LANG --> SWIFT[Swift]
    LANG --> OBJC[Objective-C]
    LANG --> RUST[Rust]
    LANG --> GO[Go]
    LANG --> PY[Python]
    LANG --> JS[JavaScript]
    LANG --> TS[TypeScript]
    LANG --> PHP[PHP]
    LANG --> RUBY[Ruby]
    LANG --> DART[Dart]
    LANG --> R[R]
    LANG --> JULIA[Julia]
    LANG --> LUA[Lua]
    LANG --> PERL[Perl]
    LANG --> SCALA[Scala]
    LANG --> HASKELL[Haskell]
    LANG --> ELIXIR[Elixir]
    LANG --> ERLANG[Erlang]
    LANG --> SHELL[Bash / POSIX Shell]
    LANG --> SQL[SQL]

    REG --> WASM[WebAssembly Target]
    REG --> PROFILE[Compiler / Runtime / Formatter / Linter / Debugger / Test Profile]
    PROFILE --> POLICY[Sandbox Policy]
    PROFILE --> GENERATOR[Code Generation Templates]
```

## Language menu

```text
Programming Languages
├── ProC-25
│   ├── C
│   ├── C++
│   ├── C#
│   ├── Java
│   ├── Kotlin
│   ├── Swift
│   ├── Objective-C
│   ├── Rust
│   ├── Go
│   ├── Python
│   ├── JavaScript
│   ├── TypeScript
│   ├── PHP
│   ├── Ruby
│   ├── Dart
│   ├── R
│   ├── Julia
│   ├── Lua
│   ├── Perl
│   ├── Scala
│   ├── Haskell
│   ├── Elixir
│   ├── Erlang
│   ├── Bash / POSIX Shell
│   └── SQL
├── Toolchains
├── Package Managers
├── Formatters
├── Linters
├── Debuggers
├── Test Runners
├── Build Systems
└── WebAssembly Targets
```

## UML Studio behavior

Each language is represented as a selectable UML/code-generation profile. A language node can be connected to:

- an agent;
- a model/tool call;
- a code-generation template;
- a compiler or interpreter;
- a formatter and linter;
- a debugger;
- a test runner;
- a build system;
- a sandbox policy;
- a target runtime;
- a WebAssembly target where supported.

The runtime registry is implemented in `src/languages/proc25.ts` and exported through `src/languages/index.ts`.
