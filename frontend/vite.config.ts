import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Minimal ambient declaration so we can read env without pulling in @types/node
declare const process: { env: Record<string, string | undefined> };

// Backend origin for dev/preview proxying. In Docker set BACKEND_ORIGIN=http://backend:8080
const backend = process.env.BACKEND_ORIGIN ?? 'http://localhost:8080';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': backend,
      '/uploads': backend,
      // robots.txt is served statically from public/; sitemap.xml is dynamic → proxy to backend
      '/sitemap.xml': backend
    }
  }
});
