import { resolve } from "path";
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  envDir: resolve(__dirname, '..', '..'),
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        host: resolve(__dirname, 'pages', 'host', 'index.html'),
        chat: resolve(__dirname, 'pages', 'chat', 'index.html')
      }
    }
  },
})
