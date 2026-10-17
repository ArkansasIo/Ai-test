# Programming Languages

## ProC-25

AI-Test now defines a 25-language programming subsystem for its code generator, UML Studio, developer tools, sandbox profiles, and build/test orchestration.

| # | Language | Primary toolchain | Main use |
|---:|---|---|---|
| 1 | C | GCC / Clang | Systems |
| 2 | C++ | Clang++ / GCC | Systems / games |
| 3 | C# | .NET | Applications / games |
| 4 | Java | JDK | JVM applications |
| 5 | Kotlin | Kotlin / Gradle | JVM / Android |
| 6 | Swift | SwiftPM / swiftc | Apple platforms |
| 7 | Objective-C | Clang / Xcode | Apple legacy/native |
| 8 | Rust | Cargo / rustc | Systems / secure native |
| 9 | Go | Go toolchain | Services / systems |
| 10 | Python | CPython | AI / automation |
| 11 | JavaScript | Node.js | Web / runtime |
| 12 | TypeScript | tsc / Node.js | Typed web / services |
| 13 | PHP | PHP / Composer | Web |
| 14 | Ruby | Ruby / Bundler | Web / scripting |
| 15 | Dart | Dart / Flutter | Cross-platform UI |
| 16 | R | R / CRAN | Statistics |
| 17 | Julia | Julia / Pkg | Scientific computing |
| 18 | Lua | Lua / LuaJIT | Embedded / scripting |
| 19 | Perl | Perl / CPAN | Automation / text processing |
| 20 | Scala | Scala / sbt | JVM / data systems |
| 21 | Haskell | GHC / Cabal | Functional systems |
| 22 | Elixir | Elixir / Mix | Distributed services |
| 23 | Erlang | OTP / Rebar3 | Distributed systems |
| 24 | Bash / POSIX Shell | bash / sh | Automation |
| 25 | SQL | MySQL / PostgreSQL / SQLite | Data / queries |

## Design rule

The language layer is provider-neutral. Installing a compiler is not implied by selecting a language. The sandbox decides which toolchains are available and which permissions they receive.

WebAssembly is treated as a compilation/runtime target rather than a 26th language entry.

## Source

The canonical TypeScript registry is `src/languages/proc25.ts`.
