import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  base: '/time-to-end/',
  build: {
    sourcemap: 'hidden',
    target: 'es2020',
  },
  plugins: [
    react(),
    tsconfigPaths()
  ],
})
