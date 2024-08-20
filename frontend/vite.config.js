import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/api': {
                target: process.env.VITE_API_BASE_URL || 'http://localhost:8080', // Используем переменную окружения
                changeOrigin: true,
                secure: false,
            },
        },
    },
});
