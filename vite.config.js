import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    // react-simple-maps'in UMD browser entry'si require() kullaniyor.
    // Rolldown/dev ortami icin ESM entry'e sabitliyoruz.
    alias: {
      "react-simple-maps": "react-simple-maps/dist/index.es.js",
    },
  },
  plugins: [react(), tailwindcss()],
});