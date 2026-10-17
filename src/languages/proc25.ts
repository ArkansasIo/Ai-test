export type LanguageId =
  | 'c'
  | 'cpp'
  | 'csharp'
  | 'java'
  | 'kotlin'
  | 'swift'
  | 'objective-c'
  | 'rust'
  | 'go'
  | 'python'
  | 'javascript'
  | 'typescript'
  | 'php'
  | 'ruby'
  | 'dart'
  | 'r'
  | 'julia'
  | 'lua'
  | 'perl'
  | 'scala'
  | 'haskell'
  | 'elixir'
  | 'erlang'
  | 'shell'
  | 'sql';

export interface LanguageToolchain {
  compiler?: string;
  interpreter?: string;
  packageManager?: string;
  formatter?: string;
  linter?: string;
  debugger?: string;
  testRunner?: string;
  buildSystem?: string;
}

export interface ProgrammingLanguageProfile {
  id: LanguageId;
  name: string;
  family: string;
  extensions: string[];
  paradigms: string[];
  toolchain: LanguageToolchain;
  supportsWebAssembly: boolean;
  sandboxRuntime: string;
}

const profile = (
  id: LanguageId,
  name: string,
  family: string,
  extensions: string[],
  toolchain: LanguageToolchain,
  paradigms: string[],
): ProgrammingLanguageProfile => ({
  id,
  name,
  family,
  extensions,
  paradigms,
  toolchain,
  supportsWebAssembly: ['c', 'cpp', 'rust', 'go', 'python', 'javascript', 'typescript', 'swift'].includes(id),
  sandboxRuntime: 'isolated-process',
});

export const PROC25_LANGUAGES: readonly ProgrammingLanguageProfile[] = [
  profile('c', 'C', 'C family', ['.c', '.h'], { compiler: 'gcc/clang', formatter: 'clang-format', linter: 'clang-tidy', debugger: 'gdb/lldb', testRunner: 'CTest', buildSystem: 'CMake' }, ['procedural', 'imperative']),
  profile('cpp', 'C++', 'C family', ['.cpp', '.cc', '.cxx', '.hpp'], { compiler: 'clang++/g++', formatter: 'clang-format', linter: 'clang-tidy', debugger: 'gdb/lldb', testRunner: 'CTest', buildSystem: 'CMake' }, ['multi-paradigm', 'object-oriented', 'generic']),
  profile('csharp', 'C#', '.NET', ['.cs'], { compiler: 'dotnet', packageManager: 'NuGet', formatter: 'dotnet format', linter: 'Roslyn', debugger: 'vsdbg', testRunner: 'dotnet test', buildSystem: 'dotnet' }, ['object-oriented', 'functional']),
  profile('java', 'Java', 'JVM', ['.java'], { compiler: 'javac', packageManager: 'Maven/Gradle', formatter: 'google-java-format', linter: 'Checkstyle', debugger: 'jdb', testRunner: 'JUnit', buildSystem: 'Maven/Gradle' }, ['object-oriented', 'concurrent']),
  profile('kotlin', 'Kotlin', 'JVM', ['.kt', '.kts'], { compiler: 'kotlinc', packageManager: 'Gradle', formatter: 'ktfmt', linter: 'detekt', debugger: 'JVM debugger', testRunner: 'JUnit', buildSystem: 'Gradle' }, ['object-oriented', 'functional']),
  profile('swift', 'Swift', 'Apple', ['.swift'], { compiler: 'swiftc', packageManager: 'Swift Package Manager', formatter: 'swift-format', linter: 'SwiftLint', debugger: 'lldb', testRunner: 'swift test', buildSystem: 'SwiftPM' }, ['protocol-oriented', 'functional']),
  profile('objective-c', 'Objective-C', 'C family', ['.m', '.mm', '.h'], { compiler: 'clang', formatter: 'clang-format', linter: 'clang-tidy', debugger: 'lldb', buildSystem: 'Xcode/xcodebuild' }, ['object-oriented', 'imperative']),
  profile('rust', 'Rust', 'Systems', ['.rs'], { compiler: 'rustc', packageManager: 'Cargo', formatter: 'rustfmt', linter: 'Clippy', debugger: 'gdb/lldb', testRunner: 'cargo test', buildSystem: 'Cargo' }, ['systems', 'functional', 'concurrent']),
  profile('go', 'Go', 'Systems', ['.go'], { compiler: 'go', packageManager: 'Go modules', formatter: 'gofmt', linter: 'go vet', debugger: 'Delve', testRunner: 'go test', buildSystem: 'go' }, ['concurrent', 'imperative']),
  profile('python', 'Python', 'Scripting', ['.py'], { interpreter: 'CPython', packageManager: 'pip/uv', formatter: 'Ruff', linter: 'Ruff', debugger: 'debugpy', testRunner: 'pytest', buildSystem: 'pyproject' }, ['object-oriented', 'functional', 'scripting']),
  profile('javascript', 'JavaScript', 'Web', ['.js', '.mjs', '.cjs'], { interpreter: 'Node.js', packageManager: 'npm/pnpm/yarn', formatter: 'Prettier', linter: 'ESLint', debugger: 'Node Inspector', testRunner: 'Vitest/Jest', buildSystem: 'Vite' }, ['event-driven', 'functional', 'prototype-based']),
  profile('typescript', 'TypeScript', 'Web', ['.ts', '.tsx'], { compiler: 'tsc', packageManager: 'npm/pnpm/yarn', formatter: 'Prettier', linter: 'ESLint', debugger: 'Node Inspector', testRunner: 'Vitest/Jest', buildSystem: 'Vite/tsc' }, ['typed', 'functional', 'object-oriented']),
  profile('php', 'PHP', 'Web', ['.php'], { interpreter: 'PHP', packageManager: 'Composer', formatter: 'PHP-CS-Fixer', linter: 'PHPStan', debugger: 'Xdebug', testRunner: 'PHPUnit', buildSystem: 'Composer' }, ['scripting', 'object-oriented']),
  profile('ruby', 'Ruby', 'Scripting', ['.rb'], { interpreter: 'Ruby', packageManager: 'Bundler', formatter: 'RuboCop', linter: 'RuboCop', debugger: 'ruby-debug', testRunner: 'RSpec/Minitest', buildSystem: 'Bundler' }, ['object-oriented', 'functional', 'scripting']),
  profile('dart', 'Dart', 'Flutter', ['.dart'], { compiler: 'dart', packageManager: 'pub', formatter: 'dart format', linter: 'dart analyze', debugger: 'Dart DevTools', testRunner: 'dart test', buildSystem: 'dart/flutter' }, ['object-oriented', 'functional']),
  profile('r', 'R', 'Statistics', ['.r', '.R'], { interpreter: 'R', packageManager: 'CRAN', formatter: 'styler', linter: 'lintr', testRunner: 'testthat' }, ['statistical', 'functional']),
  profile('julia', 'Julia', 'Scientific', ['.jl'], { interpreter: 'Julia', packageManager: 'Pkg', formatter: 'JuliaFormatter', linter: 'StaticLint', testRunner: 'Pkg test' }, ['scientific', 'multiple-dispatch', 'functional']),
  profile('lua', 'Lua', 'Scripting', ['.lua'], { interpreter: 'Lua/LuaJIT', packageManager: 'LuaRocks', formatter: 'StyLua', linter: 'Luacheck', debugger: 'MobDebug' }, ['scripting', 'embedded']),
  profile('perl', 'Perl', 'Scripting', ['.pl', '.pm'], { interpreter: 'Perl', packageManager: 'CPAN/cpanm', formatter: 'Perl::Tidy', linter: 'Perl::Critic', testRunner: 'Test2' }, ['scripting', 'text-processing']),
  profile('scala', 'Scala', 'JVM', ['.scala', '.sc'], { compiler: 'scalac', packageManager: 'sbt', formatter: 'scalafmt', linter: 'Scalafix', testRunner: 'ScalaTest', buildSystem: 'sbt' }, ['functional', 'object-oriented']),
  profile('haskell', 'Haskell', 'Functional', ['.hs'], { compiler: 'GHC', packageManager: 'Cabal/Stack', formatter: 'fourmolu', linter: 'HLint', debugger: 'GHCi', testRunner: 'Hspec/QuickCheck', buildSystem: 'Cabal/Stack' }, ['pure-functional', 'lazy']),
  profile('elixir', 'Elixir', 'BEAM', ['.ex', '.exs'], { compiler: 'Elixir/Mix', packageManager: 'Hex', formatter: 'mix format', linter: 'Credo', debugger: 'IEx', testRunner: 'ExUnit', buildSystem: 'Mix' }, ['functional', 'concurrent', 'distributed']),
  profile('erlang', 'Erlang', 'BEAM', ['.erl', '.hrl'], { compiler: 'Erlang/OTP', packageManager: 'Hex/Rebar3', formatter: 'rebar3 fmt', linter: 'Dialyzer', debugger: 'Erlang debugger', testRunner: 'EUnit/CT', buildSystem: 'Rebar3' }, ['functional', 'concurrent', 'distributed']),
  profile('shell', 'Bash / POSIX Shell', 'Shell', ['.sh', '.bash'], { interpreter: 'bash/sh', formatter: 'shfmt', linter: 'ShellCheck', debugger: 'bashdb', testRunner: 'Bats' }, ['scripting', 'automation']),
  profile('sql', 'SQL', 'Database', ['.sql'], { interpreter: 'MySQL/PostgreSQL/SQLite', formatter: 'SQLFluff', linter: 'SQLFluff', testRunner: 'database test harness' }, ['declarative', 'query']),
];

export class Proc25LanguageRegistry {
  private readonly languages = new Map(PROC25_LANGUAGES.map((language) => [language.id, language]));

  get(id: LanguageId): ProgrammingLanguageProfile {
    const language = this.languages.get(id);
    if (!language) throw new Error(`Unknown ProC-25 language: ${id}`);
    return language;
  }

  list(): ProgrammingLanguageProfile[] {
    return [...this.languages.values()];
  }

  count(): number {
    return this.languages.size;
  }
}

export const proc25Registry = new Proc25LanguageRegistry();
