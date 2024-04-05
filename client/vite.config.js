import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        secure: false,
      },
    },
  },
  
  build: {
    outDir: 'build', // Set the output directory to 'build'
 
    chunkSizeWarningLimit: 1000000, // Adjust the limit as needed
    rollupOptions: {
      output: {
        manualChunks: {
          // Define manual chunks if necessary
        }
      }
    }
  },
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        tailwindcss(),
        autoprefixer(),
      ],
    },
  },
});
