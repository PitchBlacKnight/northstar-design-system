import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/* NorthStar dashboards app. Built output lands in ../live and is served next to the static layouts,
   so `base` is relative and the token sheet is loaded from the site's own css/ folder. */
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  build: { outDir: "../live", emptyOutDir: true },
});
