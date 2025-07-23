// Configuración centralizada de variables de entorno
// Este archivo asegura que todas las variables de entorno se carguen correctamente

// Función para verificar y cargar variables de entorno
const loadEnvironmentVariables = () => {
  const config = {
    // URL del backend - prioridad a VITE_BACKEND_URL
    backendUrl: import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || 'http://localhost:8090/api',
    
    // Otras configuraciones
    apiUrl: import.meta.env.VITE_API_URL || '/api',
    appEnv: import.meta.env.VITE_APP_ENV || 'development',
    debug: import.meta.env.VITE_DEBUG === 'true',
    
    // Configuración MQTT
    mqttBrokerUrl: import.meta.env.VITE_MQTT_BROKER_URL,
    mqttUsername: import.meta.env.VITE_MQTT_USERNAME,
    mqttPassword: import.meta.env.VITE_MQTT_PASSWORD,
    
    // Configuración de email
    sendgridApiKey: import.meta.env.VITE_SENDGRID_API_KEY,
    fromEmail: import.meta.env.VITE_FROM_EMAIL,
    
    // Flags de entorno
    isProduction: import.meta.env.PROD,
    isDevelopment: import.meta.env.DEV,
    ignoreSSLErrors: import.meta.env.VITE_IGNORE_SSL_ERRORS === 'true'
  }

  // Log de configuración en desarrollo
  if (config.isDevelopment && config.debug) {
    console.group('🔧 Configuración de variables de entorno')
    console.log('Backend URL:', config.backendUrl)
    console.log('API URL:', config.apiUrl)
    console.log('Environment:', config.appEnv)
    console.log('Debug mode:', config.debug)
    console.log('MQTT Broker:', config.mqttBrokerUrl)
    console.log('SSL Errors ignored:', config.ignoreSSLErrors)
    console.groupEnd()
  }

  // Validar variables críticas
  if (!config.backendUrl) {
    console.warn('⚠️ VITE_BACKEND_URL no está definida, usando valor por defecto')
  }

  if (config.isDevelopment && !config.mqttBrokerUrl) {
    console.warn('⚠️ VITE_MQTT_BROKER_URL no está definida')
  }

  return config
}

// Exportar configuración
export const env = loadEnvironmentVariables()

// Función helper para obtener la URL completa de la API
export const getApiUrl = (endpoint = '') => {
  const baseUrl = env.backendUrl.endsWith('/') ? env.backendUrl.slice(0, -1) : env.backendUrl
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  return `${baseUrl}${cleanEndpoint}`
}

// Función helper para verificar si estamos en desarrollo
export const isDev = () => env.isDevelopment

// Función helper para verificar si estamos en producción
export const isProd = () => env.isProduction

// Función helper para verificar si el debug está habilitado
export const isDebugMode = () => env.debug

export default env
