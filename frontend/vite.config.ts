import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'node:path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    strictPort: true,
    allowedHosts: ["jmichairlines.ru", "localhost"]
  },
  build: {
    assetsDir: path.resolve(process.cwd(), '/src/assets'),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
