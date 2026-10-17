import { proc25Registry, type LanguageId } from './proc25.js';

export interface LanguageMenuItem {
  id: string;
  label: string;
  languageId?: LanguageId;
  children?: LanguageMenuItem[];
}

export const PROGRAMMING_LANGUAGE_MENU: LanguageMenuItem = {
  id: 'programming-languages',
  label: 'Programming Languages',
  children: [
    {
      id: 'proc25',
      label: 'ProC-25',
      children: proc25Registry.list().map((language) => ({
        id: `language-${language.id}`,
        label: language.name,
        languageId: language.id,
        children: [
          { id: `${language.id}-profile`, label: 'Language Profile' },
          { id: `${language.id}-toolchain`, label: 'Toolchain' },
          { id: `${language.id}-codegen`, label: 'Code Generation' },
          { id: `${language.id}-build`, label: 'Build & Test' },
          { id: `${language.id}-sandbox`, label: 'Sandbox Profile' },
        ],
      })),
    },
    { id: 'compilers', label: 'Compilers & Interpreters' },
    { id: 'packages', label: 'Package Managers' },
    { id: 'formatters', label: 'Formatters & Linters' },
    { id: 'debuggers', label: 'Debuggers' },
    { id: 'tests', label: 'Test Runners' },
    { id: 'build', label: 'Build Systems' },
    { id: 'wasm', label: 'WebAssembly Targets' },
    { id: 'sandbox', label: 'Sandbox Profiles' },
  ],
};
