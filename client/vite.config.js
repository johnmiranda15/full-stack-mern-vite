import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,  // Puerto donde corre el frontend
    proxy: {
      '/api': {
        target: 'http://localhost:4000',  // Redirigir solicitudes API al backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
