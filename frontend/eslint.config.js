import reactConfig from '@lemuel-manske/config-eslint/react';

import { defineConfig } from 'eslint/config';

import globals from 'globals';

const config = defineConfig(
  reactConfig,

  {
    files: ['public/replay/sw.js'],

    languageOptions: {
      globals: globals.serviceworker,
    },
  },
);

export default config;
