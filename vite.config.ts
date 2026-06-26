import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        internship: resolve(__dirname, 'internship.html'),
        'intern-dashboard': resolve(__dirname, 'intern-dashboard.html'),
        'admin-login': resolve(__dirname, 'admin-login.html'),
        'admin-dashboard': resolve(__dirname, 'admin-dashboard.html'),
        'privacy-policy': resolve(__dirname, 'privacy-policy.html'),
        'terms-of-service': resolve(__dirname, 'terms-of-service.html'),
        'course-guidelines': resolve(__dirname, 'course-guidelines.html'),
        'refund-policy': resolve(__dirname, 'refund-policy.html'),
        about: resolve(__dirname, 'about.html'),
        contact: resolve(__dirname, 'contact.html'),
        projects: resolve(__dirname, 'projects.html'),
        services: resolve(__dirname, 'services.html')
      },
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  }
});
