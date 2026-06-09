import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      // Catch-all if the old 'backend-api' string gets sent by the browser
      '/backend-api': {
        target: 'http://stem_backend:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/backend-api/, '')
      },
      // Standard catch-all for clean paths
      '/api': {
        target: 'http://stem_backend:8000',
        changeOrigin: true
      },
      '/auth': {
        target: 'http://stem_backend:8000',
        changeOrigin: true
      }
    }
  }
})