import { defineConfig } from "vite";

import react from "@vitejs/plugin-react";

const CAPTURES_ENDPOINT = "/captures";
const HEALTH_ENDPOINT = "/health";

const BACKEND_URL = "http://localhost:8000";

export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      [CAPTURES_ENDPOINT]: { target: BACKEND_URL, changeOrigin: true },
      [HEALTH_ENDPOINT]: { target: BACKEND_URL, changeOrigin: true },
    },
  },
});
