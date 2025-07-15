import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  assetsDir: 'assets', // Indicar el nombre de la carpeta de assets
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  server: {
    // Configuración para desarrollo local
    host: true,
    port: 5173,
    // Configuración para HTTPS en desarrollo
    https: false, // Mantener HTTP para el frontend
    // Configurar proxy si es necesario para evitar CORS
    proxy: {
      '/api': {
        target: 'https://localhost:7263',
        changeOrigin: true,
        secure: false, // Ignorar certificados SSL inválidos
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Proxy request to:', proxyReq.getHeader('host'))
          })
        }
      }
    }
  }
})