import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Explicit base path for GitHub Pages project site (username.github.io/repo-name/)
  base: '/cinematic-weather/', 
  build: {
    outDir: 'dist',
  }
})