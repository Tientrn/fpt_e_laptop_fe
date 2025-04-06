import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  base: "./",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  server: {
    proxy: {
      "/api/proxy": {
        target: "http://fptsharelaptop.somee.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/proxy/, "/api"),
      },
    },
  },
});
