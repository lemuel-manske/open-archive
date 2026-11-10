import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";

import globals from "globals";
import tseslint from "typescript-eslint";

const config = defineConfig(
  globalIgnores([
    "dist",
    "storybook-static",
    "node_modules",
    "**/.cache/**",
    "**/test-results/**",
    "**/playwright-report/**",
  ]),

  js.configs.recommended,
  tseslint.configs.recommended,

  {
    languageOptions: {
      globals: globals.node,
    },
  },
);

export default config;
