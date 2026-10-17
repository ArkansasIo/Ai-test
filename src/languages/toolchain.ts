import { proc25Registry, type LanguageId, type LanguageToolchain, type ProgrammingLanguageProfile } from './proc25.js';

export interface LanguageSandboxProfile {
  runtime: string;
  network: 'disabled' | 'restricted' | 'enabled';
  filesystem: 'read-only' | 'workspace' | 'isolated';
  processIsolation: boolean;
  allowPackageInstall: boolean;
}

export interface LanguageProjectProfile {
  language: ProgrammingLanguageProfile;
  toolchain: LanguageToolchain;
  sandbox: LanguageSandboxProfile;
  sourceExtensions: string[];
  codeGenerationTemplate: string;
}

const sandboxFor = (language: ProgrammingLanguageProfile): LanguageSandboxProfile => ({
  runtime: language.sandboxRuntime,
  network: 'restricted',
  filesystem: 'workspace',
  processIsolation: true,
  allowPackageInstall: true,
});

export class LanguageToolchainManager {
  profile(languageId: LanguageId): LanguageProjectProfile {
    const language = proc25Registry.get(languageId);
    return {
      language,
      toolchain: language.toolchain,
      sandbox: sandboxFor(language),
      sourceExtensions: [...language.extensions],
      codeGenerationTemplate: `proc25/${language.id}`,
    };
  }

  all(): LanguageProjectProfile[] {
    return proc25Registry.list().map((language) => this.profile(language.id));
  }
}

export const languageToolchainManager = new LanguageToolchainManager();
