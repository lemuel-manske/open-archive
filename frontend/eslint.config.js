import i18n from '@lemuel-manske/i18n/eslint';

import reactConfig from '@lemuel-manske/config-eslint/react';

import { defineConfig } from 'eslint/config';

import globals from 'globals';

const config = defineConfig(
  reactConfig,

  {
    files: ['src/**/*.{ts,tsx}'],

    languageOptions: {
      parserOptions: { project: './tsconfig.tools.json' },
    },

    plugins: { i18n },

    rules: {
      'i18n/generated-message-id': ['error', { messageIdsFile: './src/i18n/message-ids.ts' }],
    },
  },

  {
    files: ['public/replay/sw.js'],

    languageOptions: {
      globals: globals.serviceworker,
    },
  },
);

export default config;
