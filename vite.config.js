import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/main.js'),
      name: 'WidgetsCarburantes',
      fileName: () => 'widget-carburantes.js',
      formats: ['iife'] // Formato Autoejecutable (ideal para <script> en un CMS)
    },
    rollupOptions: {
      // Incluye Chart.js dentro del bundle final
      external: [],
    }
  }
});
