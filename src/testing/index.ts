import type { LanguageId } from '../languages/proc25.js';
export interface TestRequest { language: LanguageId; projectId: string; command?: string; }
export interface TestCaseResult { name: string; passed: boolean; durationMs: number; output?: string; }
export interface TestRunResult { ok: boolean; cases: TestCaseResult[]; }
export interface TestRunner { supports(language: LanguageId): boolean; run(request: TestRequest): Promise<TestRunResult>; }
export class SandboxTestRunner implements TestRunner { supports(_language: LanguageId): boolean { return true; } async run(_request: TestRequest): Promise<TestRunResult> { return { ok: false, cases: [{ name: 'sandbox-not-configured', passed: false, durationMs: 0 }] }; } }
