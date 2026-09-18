import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_API_USER_SERVICE': JSON.stringify('http://localhost:8087'),
    'import.meta.env.VITE_API_PRODUCTS_SERVICE': JSON.stringify('http://localhost:8087'),
    'import.meta.env.VITE_API_CART_SERVICE': JSON.stringify('http://localhost:8087'),
    'import.meta.env.VITE_API_ADMIN_SERVICE': JSON.stringify('http://localhost:8087'),
    'import.meta.env.VITE_API_ORDER_SERVICE': JSON.stringify('http://localhost:8087'),
    'import.meta.env.VITE_API_NOTIFICATION_SERVICE': JSON.stringify('http://localhost:8087'),
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: true,
  },
})
