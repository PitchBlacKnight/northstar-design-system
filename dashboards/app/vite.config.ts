import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/* NorthStar dashboards app. Built output lands in ../live and is served next to the static layouts,
   so `base` is relative and the token sheet is loaded from the site's own css/ folder. */
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": path.resolve(import.meta.dirname, "./src") } },
  build: {
    outDir: "../live", emptyOutDir: true,
    /* Long-lived vendor chunks: charts and the UI primitives change far less often than the views */
    rolldownOptions: { output: { advancedChunks: { groups: [
      { name: "charts", test: /node_modules[\\/](recharts|d3-|victory-vendor)/ },
      { name: "react", test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
      { name: "ui", test: /node_modules[\\/](@base-ui|@floating-ui|cmdk|sonner|@number-flow|lucide-react)/ },
    ] } } },
  },
});
