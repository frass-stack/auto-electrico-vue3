import axios from 'axios'

// Crear instancia de axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para manejar errores
api.interceptors.response.use(
  response => response,
  error => {
    // Manejar diferentes tipos de errores
    if (error.response) {
      // El servidor respondió con un estado de error
      switch (error.response.status) {
        case 400:
          console.error('Error de solicitud:', error.response.data)
          break
        case 401:
          console.error('No autorizado:', error.response.data)
          // Aquí podrías manejar la redirección al login
          break
        case 403:
          console.error('Acceso prohibido:', error.response.data)
          break
        case 404:
          console.error('Recurso no encontrado:', error.response.data)
          break
        case 500:
          console.error('Error del servidor:', error.response.data)
          break
        default:
          console.error('Error:', error.response.data)
      }
    } else if (error.request) {
      // La solicitud se realizó pero no se recibió respuesta
      console.error('Sin respuesta del servidor:', error.request)
    } else {
      // Error al configurar la solicitud
      console.error('Error de configuración:', error.message)
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