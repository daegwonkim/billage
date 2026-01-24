import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import mkcert from 'vite-plugin-mkcert'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  return {
    plugins: [react(), tailwindcss(), mkcert()],
    resolve: {
      alias: [{ find: '@', replacement: '/src' }]
    },
    server: {
      host: 'localhost',
      port: 5173,
      proxy: {
        '/ws': {
          target: env.VITE_API_BASE_URL || 'https://localhost:8080',
          ws: true
        }
      }
    }
  }
})
