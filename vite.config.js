import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const frontendRoot = fileURLToPath(new URL("./src/frontend", import.meta.url));
const publicDir = fileURLToPath(new URL("./public", import.meta.url));
const outDir = path.resolve(frontendRoot, "../../dist/client");

export default defineConfig({
  root: frontendRoot,
  publicDir,
  plugins: [react()],
  server: {
    port: 5173
  },
  build: {
    outDir,
    emptyOutDir: true
  }
});
