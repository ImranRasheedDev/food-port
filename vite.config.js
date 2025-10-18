import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/",
  publicDir: "public",
  build: {
    outDir: "dist",
    assetsDir: "assets",
    // Copy public folder contents correctly
    copyPublicDir: true,
  },
  server: {
    // proxy: {
    //   '/api': {
    //     target: 'https://myfoodport.com',
    //     changeOrigin: true,
    //     secure: false,
    //   },
    // },
  },
  resolve: {
    alias: {
      "@": path.resolve("./src"),
    },
  },
});
