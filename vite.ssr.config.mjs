import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  build: {
    ssr: 'scripts/render-check.jsx',
    outDir: 'node_modules/.ssr-check',
    emptyOutDir: false,
    rollupOptions: { external: ['react','react-dom','react-dom/server','react-router-dom','node:fs','node:path'] },
  },
});
