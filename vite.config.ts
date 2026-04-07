import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
   server: {
    host: true, // allow external access
    port: 5175,
    strictPort: true,
    allowedHosts: true,
  },
   resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      images: path.resolve(__dirname, './src/assets/images'), // use: import logo from 'images/logo.png'
    },
  },
  esbuild: {
    logOverride: {
      "this-is-undefined-in-esm": "silent"
    }
  }
})
