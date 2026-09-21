import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://crypto-flow-staging.up.railway.app',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
