import axios from 'axios'
import { env } from '@/config/environment'

// Crear instancia de axios usando la configuración centralizada
const api = axios.create({
  baseURL: env.backendUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Log de configuración en desarrollo
if (env.isDevelopment && env.debug) {
  console.log('🌐 API configurada con baseURL:', env.backendUrl)
}

// Interceptor para manejar errores
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.error(`Error ${error.response.status}:`, error.response.data)
    } else if (error.request) {
      console.error('Error de red:', error.request)
    } else {
      console.error('Error:', error.message)
    }
    return Promise.reject(error)
  }
)

// Funciones helper para manejar errores
export const handleApiError = (error, customMessage = 'Ha ocurrido un error') => {
  if (error.response) {
    return error.response.data.message || customMessage
  }
  return customMessage
}

export const isNetworkError = (error) => {
  return !error.response
}

export const isServerError = (error) => {
  return error.response && error.response.status >= 500
}

export const isClientError = (error) => {
  return error.response && error.response.status >= 400 && error.response.status < 500
}

export default api 