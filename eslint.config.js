// @ts-check
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import reactHooks from 'eslint-plugin-react-hooks';
import stylistic from '@stylistic/eslint-plugin';
import tailwindcss from 'eslint-plugin-tailwindcss';
import { defineConfig, globalIgnores } from 'eslint/config';

const styleRules = /** @type {import('eslint').Linter.RulesRecord} */ ({
  'stylistic/semi': 'error',
  'stylistic/quotes': ['error', 'single'],
  'stylistic/indent': ['error', 2],
  'stylistic/no-trailing-spaces': 'error',
  'stylistic/comma-dangle': ['error', 'always-multiline'],
  'stylistic/comma-spacing': ['error', { before: false, after: true }],
  'stylistic/comma-style': ['error', 'last'],
  'stylistic/no-multiple-empty-lines': ['error', { max: 1 }],
  'stylistic/object-curly-spacing': ['error', 'always'],
  'stylistic/array-bracket-spacing': ['error', 'never'],
  'stylistic/array-element-newline': ['error', 'consistent'],
  'stylistic/arrow-parens': 'error',
  'stylistic/arrow-spacing': ['error', { before: true, after: true }],
  'stylistic/dot-location': ['error', 'property'],
  'stylistic/function-call-argument-newline': ['error', 'consistent'],
  'stylistic/no-mixed-operators': 'error',
  'stylistic/no-multi-spaces': 'error',
  'stylistic/no-whitespace-before-property': 'error',
  'stylistic/operator-linebreak': ['error', 'before'],
  'stylistic/padded-blocks': ['error', 'never'],
  'stylistic/rest-spread-spacing': ['error', 'never'],
  'stylistic/space-before-blocks': ['error', 'always'],
  'stylistic/space-infix-ops': 'error',
  'stylistic/space-unary-ops': 'error',
  'stylistic/spaced-comment': ['error', 'always'],
  'stylistic/switch-colon-spacing': ['error', { after: true, before: false }],
  'stylistic/template-curly-spacing': ['error', 'always'],
  'stylistic/template-tag-spacing': 'error',
  'stylistic/type-generic-spacing': 'error',
  'stylistic/type-named-tuple-spacing': 'error',
  'stylistic/wrap-iife': ['error', 'outside'],
});

const jsxStyleRules = /** @type {import('eslint').Linter.RulesRecord} */ ({
  'stylistic/jsx-curly-spacing': ['error', { when: 'never', children: true }],
  'stylistic/jsx-curly-brace-presence': [
    'error',
    {
      props: 'always',
      children: 'always',
    },
  ],
  'stylistic/jsx-closing-tag-location': 'error',
  'stylistic/jsx-closing-bracket-location': 'error',
  'stylistic/jsx-self-closing-comp': ['error', { component: true, html: true }],
  'stylistic/jsx-tag-spacing': [
    'error',
    {
      closingSlash: 'never',
      beforeSelfClosing: 'always',
      afterOpening: 'never',
    },
  ],
  'stylistic/jsx-wrap-multilines': [
    'error',
    {
      declaration: 'parens-new-line',
      assignment: 'parens-new-line',
      return: 'parens-new-line',
      arrow: 'parens-new-line',
      condition: 'parens-new-line',
      logical: 'parens-new-line',
      prop: 'parens-new-line',
    },
  ],
  'stylistic/jsx-equals-spacing': ['error', 'never'],
});

const tsRules = /** @type {import('eslint').Linter.RulesRecord} */ ({
  '@typescript-eslint/no-unused-vars': [
    'error',
    {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      caughtErrorsIgnorePattern: '^_',
    },
  ],
  '@typescript-eslint/consistent-type-imports': [
    'error',
    {
      prefer: 'type-imports',
      fixStyle: 'inline-type-imports',
    },
  ],
});

export default defineConfig([
  globalIgnores(['dist/', '.astro/', 'node_modules/', 'public/', '*.d.ts']),

  {
    name: 'koast/js-ts',
    files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: { stylistic },
    rules: /** @type {import('eslint').Linter.RulesRecord} */ ({
      ...styleRules,
      ...tsRules,
    }),
  },
  {
    name: 'koast/react',
    files: ['**/*.{jsx,tsx}'],
    extends: [reactHooks.configs.flat.recommended],
    rules: /** @type {import('eslint').Linter.RulesRecord} */ ({
      ...jsxStyleRules,
      'react-hooks/set-state-in-effect': 'warn',
    }),
  },

  {
    name: 'koast/astro',
    files: ['**/*.astro'],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    plugins: { stylistic },
    rules: /** @type {import('eslint').Linter.RulesRecord} */ ({
      ...styleRules,
      ...tsRules,
    }),
  },
  // tseslint 가 parser 를 덮어쓰므로 astro 설정은 반드시 이 뒤에 와야 한다.
  ...astro.configs['flat/recommended'],
  {
    name: 'koast/astro-client-script',
    files: ['**/*.astro/*.{js,ts}'],
    languageOptions: { globals: globals.browser },
    plugins: { stylistic },
    rules: /** @type {import('eslint').Linter.RulesRecord} */ ({
      ...styleRules,
      'stylistic/indent': 'off',
    }),
  },

  {
    // configs.recommended 를 extends 하면 files 교집합으로 .astro 가 전부 빠진다.
    name: 'koast/tailwind',
    files: ['**/*.{js,jsx,ts,tsx,astro}'],
    plugins: {
      tailwindcss: /** @type {import('eslint').ESLint.Plugin} */ (
        /** @type {unknown} */ (tailwindcss)
      ),
    },
    settings: {
      tailwindcss: {
        cssConfigPath: './src/styles/global.css',
      },
    },
    rules: {
      'tailwindcss/classnames-order': 'warn',
      'tailwindcss/enforces-canonical-classname': 'warn',
      'tailwindcss/enforces-negative-arbitrary-values': 'error',
      'tailwindcss/enforces-shorthand': 'warn',
      'tailwindcss/important-modifier-suffix': 'error',
      'tailwindcss/no-contradicting-classname': 'error',
      'tailwindcss/no-unnecessary-arbitrary-value': 'warn',
      'tailwindcss/no-arbitrary-value': 'off',
      'tailwindcss/no-custom-classname': 'off',
    },
  },

  {
    name: 'koast/config-files',
    files: ['*.{js,mjs,cjs,ts}', 'astro.config.mjs', 'eslint.config.js'],
    languageOptions: { globals: globals.node },
  },
]);
