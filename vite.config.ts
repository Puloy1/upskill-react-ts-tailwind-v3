import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

// No dev proxy: /api is served by the MSW worker in the browser, not by a
// separate backend process. See src/mocks/browser.ts.
//
// Tailwind v4 is a Vite plugin. There is no tailwind.config.js and no
// PostCSS step — design tokens live in src/index.css under @theme.
//
// Test config is in vitest.config.ts, not here. Vitest bundles its own copy
// of Vite, so declaring `test` in this file produces a wall of
// "Plugin<any> is not assignable to PluginOption" errors that have nothing
// to do with your code.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
});
