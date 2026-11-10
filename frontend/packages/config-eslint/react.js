import { defineConfig } from "eslint/config";

import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

import nodeConfig from "./node.js";

const config = defineConfig(
  nodeConfig,

  {
    files: ["**/*.{ts,tsx}"],

    languageOptions: {
      globals: globals.browser,
    },

    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },

    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    },
  },

  {
    files: ["**/*.stories.tsx"],

    rules: {
      "react-refresh/only-export-components": "off",
    },
  },
);

export default config;
