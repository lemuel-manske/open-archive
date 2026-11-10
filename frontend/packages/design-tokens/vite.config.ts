import { fileURLToPath } from "node:url";

import { createLibraryConfig } from "@openarchive/config-vite";

import { mergeConfig } from "vite";

import { archiveTheme } from "./src/tokens";

const declarations = Object.entries(archiveTheme).flatMap(([group, tokens]) =>
  Object.entries(tokens).map(([name, value]) => `  --ui-${group}-${name}: ${value};`),
);

const themeCss = [
  "/* Generated from tokens.ts. Do not edit. */",
  ':where([data-ui-theme="archive"]) {',
  ...declarations,
  "}",
  "",
].join("\n");

const config = mergeConfig(
  createLibraryConfig({
    entry: fileURLToPath(new URL("./src/index.ts", import.meta.url)),
    fileName: "tokens",
  }),
  {
    plugins: [
      {
        name: "theme-css",

        generateBundle() {
          this.emitFile({
            type: "asset",
            fileName: "tokens.css",
            source: themeCss,
          });
        },
      },
    ],
  },
);

export default config;
