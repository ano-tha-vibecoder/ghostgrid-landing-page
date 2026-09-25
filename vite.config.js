import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        // Long-lived vendor chunks; the three.js globe is split out separately via React.lazy
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (/[\/]node_modules[\/](react|react-dom|scheduler)[\/]/.test(id)) return 'react'
          if (/[\/]node_modules[\/](framer-motion|motion-dom|motion-utils|motion)[\/]/.test(id)) return 'motion'
        },
      },
    },
  },
})
