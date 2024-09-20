import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // eslint-disable-next-line no-undef
    port: process.env.PORT || 3001, // Default to port 3001 or custom via env
  },
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer], // Use ES module imports for PostCSS plugins
    },
  },
});
