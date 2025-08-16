/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React ecosystem
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],

          // Redux ecosystem
          'redux-vendor': ['@reduxjs/toolkit', 'react-redux'],

          // Ant Design
          'antd-vendor': ['antd', '@ant-design/icons'],

          // i18n and utils
          'utils-vendor': ['i18next', 'react-i18next'],

          // Markdown and code highlighting
          'markdown-vendor': ['react-markdown', 'remark-gfm', 'rehype-highlight'],

          // AI related components (separate chunk for AI section)
          'ai-components': [
            './src/pages/chat',
            './src/pages/model-browser',
            './src/pages/provider-management',
            './src/pages/ai-overview',
            './src/services/aiService',
            './src/services/enhancedAIService',
            './src/services/cacheService',
            './src/services/defaultModels'
          ]
        }
      }
    },
    chunkSizeWarningLimit: 600 // Increase limit to 600kb
  }
});