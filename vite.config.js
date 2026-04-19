import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api/claude': {
          target: 'https://api.anthropic.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/claude/, '/v1/messages'),
          headers: {
            'anthropic-version': '2023-06-01',
            'x-api-key': env.ANTHROPIC_API_KEY || '',
            'anthropic-dangerous-direct-browser-access': 'true',
          },
        },
      },
    },
  }
})
