// eslint.config.ts
import js from '@eslint/js';
import globals from 'globals';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import * as tseslint from '@typescript-eslint/eslint-plugin';
import { defineConfig, globalIgnores } from 'eslint/config';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig([
  // always ignore build artifacts
  globalIgnores(['dist', 'build', 'node_modules']),

  // Base (fast) config for JS/TS/React
  {
    files: ['**/*.{js,cjs,mjs,jsx,ts,tsx}'],
    languageOptions: {
      parser: '@typescript-eslint/parser', // allows TS syntax
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    settings: { react: { version: 'detect' } },
    extends: [
      js.configs.recommended,
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
      'plugin:react-refresh/recommended',
      // non-type-checked TS rules (fast)
      'plugin:@typescript-eslint/recommended'
    ],
    rules: {
      'react/react-in-jsx-scope': 'off',
      // other base rules...
    },
  },

  // Type-aware (slow) rules — apply ONLY to TS files
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
        // point to your tsconfigs and set a correct root dir
        project: ['./tsconfig.app.json', './tsconfig.node.json'],
        tsconfigRootDir: __dirname,
      },
    },
    // here we use the plugin's exported configs directly
    extends: [
      // pick one preset:
      tseslint.configs.recommendedTypeChecked,    // production: type-aware recommended
      // tseslint.configs.strictTypeChecked,      // optional: stricter alternative (pick one)
      tseslint.configs.stylisticTypeChecked      // optional: stylistic rules
    ],
    rules: {
      // any overrides for type-checked rules
      // e.g. '@typescript-eslint/explicit-function-return-type': 'off'
    },
  },
]);
