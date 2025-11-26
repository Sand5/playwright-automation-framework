// eslint.config.cjs
const typescriptParser = require('@typescript-eslint/parser');
const typescriptPlugin = require('@typescript-eslint/eslint-plugin');
const prettierPlugin = require('eslint-plugin-prettier');
const playwrightPlugin = require('eslint-plugin-playwright');

module.exports = [
  // Ignore common folders
  {
    ignores: ['node_modules', 'dist', 'build', 'reports'],
  },

  // TypeScript files
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
      },
      globals: {
        // Jest/Playwright globals
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      prettier: prettierPlugin,
      playwright: playwrightPlugin,
    },
    rules: {
      // TypeScript
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-empty-function': 'warn',
      '@typescript-eslint/consistent-type-imports': 'warn',

      // JS general
      'no-console': 'warn',
      'prefer-const': 'error',
      eqeqeq: ['error', 'always'],
      'consistent-return': 'warn',

      // Prettier
      'prettier/prettier': 'warn',

      // Playwright
      'playwright/no-focused-test': 'error',
      'playwright/no-skipped-test': 'warn',
      'playwright/no-commented-out-tests': 'warn',
    },
  },
];