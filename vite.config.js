import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "build",
    sourcemap: true,
  },
  server: {
    proxy: {
      "/.netlify/functions": {
        target: "http://localhost:9000",
        rewrite: (path) => path.replace(/^\/\.netlify\/functions/, ""),
      },
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
  },
});
