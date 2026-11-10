import { fileURLToPath } from "node:url";

import { createLibraryConfig } from "@openarchive/config-vite";

const config = createLibraryConfig({
  entry: fileURLToPath(new URL("./src/index.ts", import.meta.url)),
  fileName: "utils",
  external: ["react", "react/jsx-runtime"],
});

export default config;
