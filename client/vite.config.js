import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const backendEndpoint = process.env.VITE_BACKEND_ENDPOINT || 'http://localhost:5000';

export default defineConfig(() => ({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: `${backendEndpoint}/api`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
}));
