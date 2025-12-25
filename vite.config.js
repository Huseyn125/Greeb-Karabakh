import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  // Use index-react.html as entry point
  build: {
    rollupOptions: {
      input: {
        main: './index-react.html'
      }
    }
  }
})

