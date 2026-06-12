import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// Backend origin for dev/preview proxying. In Docker set BACKEND_ORIGIN=http://backend:8080
const backend = process.env.BACKEND_ORIGIN ?? 'http://localhost:8080';
export default defineConfig({
    plugins: [react()],
    server: {
        allowedHosts: [
            'toikhan.kz',
            'www.toikhan.kz',
            'toikhana.kz',
            'www.toikhana.kz'
        ],
        port: 5173,
        proxy: {
            '/api': backend,
            '/uploads': backend,
            // robots.txt is served statically from public/; sitemap.xml is dynamic → proxy to backend
            '/sitemap.xml': backend
        }
    }
});
