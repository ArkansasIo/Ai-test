import type { LanguageId } from '../languages/proc25.js';
export interface CodeGenerationRequest { language: LanguageId; modelName: string; specification: string; }
export interface GeneratedSource { language: LanguageId; files: Array<{ path: string; content: string }>; }
export interface CodeGenerator { generate(request: CodeGenerationRequest): Promise<GeneratedSource>; }
export class TemplateCodeGenerator implements CodeGenerator { async generate(request: CodeGenerationRequest): Promise<GeneratedSource> { return { language: request.language, files: [{ path: `generated/${request.modelName}.txt`, content: request.specification }] }; } }
