import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Serves /api/chat during `npm run dev` with the same handler Vercel runs in production
const devChatApi = () => ({
  name: 'ghostgrid-dev-chat-api',
  configureServer(server) {
    server.middlewares.use('/api/chat', async (req, res) => {
      const { handleChat } = await server.ssrLoadModule('/server/chat.js')

      const chunks = []
      for await (const chunk of req) chunks.push(chunk)
      const aborter = new AbortController()
      res.on('close', () => !res.writableEnded && aborter.abort())

      const response = await handleChat(
        new Request(`http://${req.headers.host}${req.originalUrl}`, {
          method: req.method,
          headers: Object.entries(req.headers).filter(([, v]) => typeof v === 'string'),
          body: req.method === 'POST' ? Buffer.concat(chunks) : undefined,
          signal: aborter.signal,
        })
      )

      res.statusCode = response.status
      response.headers.forEach((value, key) => res.setHeader(key, value))
      if (response.body) for await (const chunk of response.body) res.write(chunk)
      res.end()
    })
  },
})

export default defineConfig(({ mode }) => {
  // Make GEMINI_API_KEY etc. from .env.local visible to the dev API handler
  for (const [key, value] of Object.entries(loadEnv(mode, process.cwd(), ''))) {
    process.env[key] ??= value
  }

  return {
    plugins: [react(), tailwindcss(), devChatApi()],
    build: {
      rollupOptions: {
        output: {
          // Long-lived vendor chunks so app changes don't invalidate cached libraries
          manualChunks(id) {
            if (!id.includes('node_modules')) return
            if (/[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) return 'react'
            if (/[\\/]node_modules[\\/](framer-motion|motion-dom|motion-utils|motion)[\\/]/.test(id)) return 'motion'
          },
        },
      },
    },
  }
})
