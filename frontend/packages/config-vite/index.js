import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const reactConfig = defineConfig({
  plugins: [react()],
});

/**
 * @param {{ entry: string, fileName: string, external?: string[] }} options
 */
function createLibraryConfig({ entry, fileName, external = [] }) {
  return defineConfig({
    build: {
      lib: {
        entry,
        formats: ["es"],
        fileName,
        cssFileName: fileName,
      },

      rollupOptions: {
        external,
      },
    },
  });
}

export { reactConfig, createLibraryConfig };
