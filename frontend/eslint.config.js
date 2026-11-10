import reactConfig from "@openarchive/config-eslint/react";

import { defineConfig, globalIgnores } from "eslint/config";

import globals from "globals";

const config = defineConfig(
  globalIgnores(["packages"]),

  reactConfig,

  {
    files: ["public/replay/sw.js"],

    languageOptions: {
      globals: globals.serviceworker,
    },
  },
);

export default config;
