import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'login.html'),
        'intern-dashboard': resolve(__dirname, 'intern-dashboard.html'),
        'admin-dashboard': resolve(__dirname, 'admin-dashboard.html'),
        'privacy-policy': resolve(__dirname, 'privacy-policy.html'),
        'terms-of-service': resolve(__dirname, 'terms-of-service.html'),
        'course-guidelines': resolve(__dirname, 'course-guidelines.html'),
        'refund-policy': resolve(__dirname, 'refund-policy.html')
      },
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  }
});
