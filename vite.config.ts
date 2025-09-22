import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  root: path.resolve(__dirname, "docs"),
  base: "./",
  plugins: [react()],
  resolve: {
    alias: {
      "@mosaic": path.resolve(__dirname, "src"),
    },
  },
  server: {
    port: 5173,
    open: false,
  },
  preview: {
    port: 5173,
  },
  build: {
    outDir: path.resolve(__dirname, "dist-docs"),
    emptyOutDir: true,
  },
});
