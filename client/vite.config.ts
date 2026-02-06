import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://localhost:7188",
        changeOrigin: true,
        secure: false,
        // Don't rewrite - keep /api in the path since the API endpoints use /api/forms
      }
    }
  }
});
