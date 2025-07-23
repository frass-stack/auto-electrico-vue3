// Configuración para desarrollo local
// Este archivo agrega configuraciones específicas para desarrollo
import { env } from './environment'

// Configuración para desarrollo - solo mostrar información
if (env.isDevelopment) {
    console.log('Modo desarrollo - Configurando para HTTPS local')
    console.log('API URL:', env.apiUrl)
    console.log('Backend URL:', env.backendUrl)
    console.log('Variables de entorno cargadas:', {
        VITE_BACKEND_URL: import.meta.env.VITE_BACKEND_URL,
        VITE_API_URL: import.meta.env.VITE_API_URL,
        VITE_APP_ENV: import.meta.env.VITE_APP_ENV,
        VITE_DEBUG: import.meta.env.VITE_DEBUG
    })
}

export const config = {
    apiUrl: env.backendUrl,
    backendUrl: env.backendUrl,
    isProduction: env.isProduction,
    isDevelopment: env.isDevelopment,
    debugMode: env.debug
}

export default config
