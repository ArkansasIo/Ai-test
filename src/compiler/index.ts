import type { LanguageId } from '../languages/proc25.js';
export interface CompileRequest { language: LanguageId; sourceFiles: string[]; buildCommand?: string; }
export interface CompileResult { ok: boolean; artifact?: string; diagnostics: string[]; exitCode: number; }
export interface CompilerAdapter { supports(language: LanguageId): boolean; compile(request: CompileRequest): Promise<CompileResult>; }
export class SandboxCompiler implements CompilerAdapter { supports(_language: LanguageId): boolean { return true; } async compile(request: CompileRequest): Promise<CompileResult> { return { ok: false, diagnostics: ['Compiler execution requires a configured sandbox runtime.'], exitCode: 78 }; } }
