import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import mkcert from 'vite-plugin-mkcert'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), mkcert()],
  resolve: {
    alias: [{ find: '@', replacement: '/src' }]
  },
  server: {
    host: 'localhost',
    port: 5173,
    proxy: {
      '/ws': {
        target: 'https://localhost:8080',
        ws: true
      }
    }
  }
})
