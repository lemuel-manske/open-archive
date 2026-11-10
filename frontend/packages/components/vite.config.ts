import { fileURLToPath } from "node:url";

import { createLibraryConfig, reactConfig } from "@openarchive/config-vite";

import { mergeConfig } from "vite";

const config = mergeConfig(
  reactConfig,

  createLibraryConfig({
    entry: fileURLToPath(new URL("./src/index.ts", import.meta.url)),
    fileName: "components",
    external: ["react", "react/jsx-runtime", "@openarchive/design-tokens", "@openarchive/utils"],
  }),
);

export default config;
