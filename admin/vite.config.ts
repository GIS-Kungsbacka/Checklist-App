import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// Get IIS application base path from environment variable
// Default: /FormApp/admin/ (admin is an IIS application under FormApp root)
// If FormApp root is different, set VITE_APP_BASE environment variable
declare const process: { cwd(): string; env: Record<string, string> };

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const appBase = env.VITE_APP_BASE || "/FormApp";
  const basePath = `${appBase}/admin/`;

  return {
    plugins: [react()],
    base: basePath,
    server: {
      port: 3001,
      open: true,
      proxy: {
        "/api": {
          target: "https://localhost:7188",
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, "")
        }
      }
    }
  };
});
