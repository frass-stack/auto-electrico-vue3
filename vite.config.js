import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Cargar variables de entorno
  const env = loadEnv(mode, process.cwd(), '')

  return {
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
      port: 5173, // Puerto del frontend (Vite)
      // Configuración para HTTPS en desarrollo
      https: false, // Mantener HTTP para el frontend
      // Configurar proxy si es necesario para evitar CORS
      proxy: {
        '/api': {
          target: env.VITE_BACKEND_URL || 'http://localhost:8090',
          changeOrigin: true,
          secure: false, // Ignorar certificados SSL inválidos
          rewrite: (path) => {
            // Reescribir /api a /api (mantener la ruta)
            console.log('Rewriting path:', path, '-> mantener igual')
            return path
          },
          configure: (proxy, options) => {
            proxy.on('error', (err, req, res) => {
              console.log('❌ Proxy error:', err.message)
            })
            proxy.on('proxyReq', (proxyReq, req, res) => {
              const targetUrl = options.target + req.url
              console.log('🌐 Proxy request:', req.method, req.url, '-> ', targetUrl)
            })
            proxy.on('proxyRes', (proxyRes, req, res) => {
              console.log('✅ Proxy response:', req.url, 'Status:', proxyRes.statusCode)
            })
          }
        }
      }
    }
  }
})