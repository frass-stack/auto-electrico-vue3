// Configuración para desarrollo local
// Este archivo agrega configuraciones específicas para desarrollo

// Configuración para desarrollo - solo mostrar información
if (import.meta.env.VITE_APP_ENV === 'development') {
    console.log('Modo desarrollo - Configurando para HTTPS local')
    console.log('API URL:', import.meta.env.VITE_API_URL)
}

export const config = {
    apiUrl: import.meta.env.VITE_API_URL || 'https://localhost:7263/api',
    isProduction: import.meta.env.PROD,
    isDevelopment: import.meta.env.DEV,
    debugMode: import.meta.env.VITE_DEBUG === 'true'
}

export default config
