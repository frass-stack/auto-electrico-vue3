import axios from 'axios'
import config from '@/config/development'

// Configuración base del API
const API_BASE_URL = config.apiUrl

// Crear instancia de axios específica para autenticación
const authApi = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'accept': 'text/plain'
    }
})

// En desarrollo, mostrar información de debug
if (config.isDevelopment) {
    console.log('AuthService: Modo desarrollo activado')
    console.log('API Base URL:', API_BASE_URL)
}

// Interceptor para manejar errores
authApi.interceptors.response.use(
    response => response,
    error => {
        console.error('Error en API de autenticación:', error)
        if (error.response) {
            console.error(`Status: ${error.response.status}`, error.response.data)
        } else if (error.request) {
            console.error('Error de red:', error.request)
        } else {
            console.error('Error:', error.message)
        }
        return Promise.reject(new Error(error.message || 'Error en la petición'))
    }
)

export const authService = {
    /**
     * Iniciar sesión usando el endpoint del backend
     * @param {Object} credentials - Credenciales de login
     * @param {string} credentials.userName - Nombre de usuario
     * @param {number} credentials.pin - PIN del usuario
     * @returns {Promise} Respuesta del servidor
     */
    async login({ userName, pin }) {
        try {
            const response = await authApi.post('/Authentication/Login', {
                userName,
                pin
            })

            // Verificar que la respuesta tenga la estructura esperada
            if (!response.data?.result) {
                throw new Error('Respuesta del servidor inválida')
            }

            const { result, statusResponse } = response.data

            // Verificar el estado de la respuesta
            if (statusResponse.code !== 200) {
                throw new Error(statusResponse.messages || 'Error de autenticación')
            }

            // Verificar que existan los datos del usuario y token
            if (!result.user || !result.accessToken) {
                throw new Error('Datos de autenticación incompletos')
            }

            return {
                success: true,
                data: response.data,
                token: result.accessToken,
                user: {
                    id: result.user.id,
                    name: result.user.userName,
                    email: result.user.email,
                    role: result.user.userRoleDescription || (result.user.userRole === 1 ? 'owner' : 'guest'),
                    userRole: result.user.userRole,
                    pin: result.user.pin
                }
            }
        } catch (error) {
            let errorMessage

            if (error.response) {
                // Manejar errores específicos del backend
                if (error.response.data?.statusResponse) {
                    errorMessage = error.response.data.statusResponse.messages || 'Error del servidor'
                } else {
                    switch (error.response.status) {
                        case 400:
                            errorMessage = 'Datos de login inválidos'
                            break
                        case 401:
                            errorMessage = 'Credenciales incorrectas'
                            break
                        case 403:
                            errorMessage = 'Acceso denegado'
                            break
                        case 404:
                            errorMessage = 'Servicio no encontrado'
                            break
                        case 500:
                            errorMessage = 'Error interno del servidor'
                            break
                        default:
                            errorMessage = error.response.data?.message || 'Error desconocido'
                    }
                }
            } else if (error.request) {
                errorMessage = 'No se pudo conectar con el servidor. Verifique la conexión.'
            } else {
                errorMessage = error.message || 'Error de autenticación'
            }

            return {
                success: false,
                error: errorMessage
            }
        }
    },

    /**
     * Endpoint del backend con la lista de los conductores autorizados
     * @returns {Promise} Respuesta del servidor
     */
    async carAuthorizedDrivers() {
        try {
            const savedToken = localStorage.getItem('auth_token')
            if (savedToken) {
                authApi.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`
            }
            const response = await authApi.get('/Authentication/CarAuthorizedDrivers')

            // Verificar que la respuesta tenga la estructura esperada
            if (!response.data?.result) {
                throw new Error('Respuesta del servidor inválida')
            }

            const { result, statusResponse } = response.data

            // Verificar el estado de la respuesta
            if (statusResponse.code !== 200) {
                throw new Error(statusResponse.messages || 'Error obteniendo conductores autorizados')
            }

            // Verificar que existan los datos de los conductores
            if (!result.userResponseDtos) {
                throw new Error('No se encontraron conductores autorizados')
            }

            return {
                success: true,
                data: response.data,
                authorizedDrivers: result.userResponseDtos.map(driver => ({
                    id: driver.id,
                    name: driver.userName,
                    email: driver.email,
                    pin: driver.pin,
                    role: driver.userRoleDescription || (driver.userRole === 1 ? 'owner' : 'guest'),
                    userRole: driver.userRole
                }))
            }
        } catch (error) {
            let errorMessage

            if (error.response) {
                // Manejar errores específicos del backend
                if (error.response.data?.statusResponse) {
                    errorMessage = error.response.data.statusResponse.messages || 'Error del servidor'
                } else {
                    switch (error.response.status) {
                        case 400:
                            errorMessage = 'Petición inválida'
                            break
                        case 401:
                            errorMessage = 'No autorizado. Inicie sesión nuevamente'
                            break
                        case 403:
                            errorMessage = 'Acceso denegado'
                            break
                        case 404:
                            errorMessage = 'Servicio no encontrado'
                            break
                        case 500:
                            errorMessage = 'Error interno del servidor'
                            break
                        default:
                            errorMessage = error.response.data?.message || 'Error desconocido'
                    }
                }
            } else if (error.request) {
                // Error de red - sin respuesta del servidor
                if (error.code === 'ECONNREFUSED' || error.message.includes('ECONNREFUSED')) {
                    errorMessage = 'No se puede conectar con el servidor Verifique la conexión.'
                } else {
                    errorMessage = 'No se pudo conectar con el servidor. Verifique la conexión.'
                }
            } else {
                errorMessage = error.message || 'Error obteniendo conductores autorizados'
            }

            return {
                success: false,
                error: errorMessage
            }
        }
    },

    async register({ userName, email, pin }) {
        try {
            const savedToken = localStorage.getItem('auth_token')
            if (savedToken) {
                authApi.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`
            }
            const response = await authApi.post('/Authentication/CarAuthorizeDriver', {
                userName,
                pin,
                email
            })

            // Verificar que la respuesta tenga la estructura esperada
            if (!response.data?.result && !response.data?.statusResponse) {
                // Si no tiene la estructura estándar, verificar si hay éxito directo
                if (response.data?.success) {
                    return {
                        success: true,
                        user: response.data.user
                    }
                } else {
                    throw new Error(response.data?.message || 'Error al registrar usuario')
                }
            }

            const { result, statusResponse } = response.data

            // Verificar el estado de la respuesta usando el patrón estándar
            if (statusResponse.code !== 200) {
                throw new Error(statusResponse.messages || 'Error al registrar usuario')
            }

            return {
                success: true,
                user: result.user || result
            }
        } catch (error) {
            let errorMessage

            if (error.response) {
                // Manejar errores específicos del backend
                if (error.response.data?.statusResponse) {
                    errorMessage = error.response.data.statusResponse.messages || 'Error del servidor'
                } else {
                    switch (error.response.status) {
                        case 400:
                            errorMessage = 'Datos inválidos para el registro'
                            break
                        case 401:
                            errorMessage = 'No autorizado. Inicie sesión nuevamente'
                            break
                        case 403:
                            errorMessage = 'Acceso denegado'
                            break
                        case 404:
                            errorMessage = 'Servicio no encontrado'
                            break
                        case 409:
                            errorMessage = 'El usuario ya existe'
                            break
                        case 500:
                            errorMessage = 'Error interno del servidor'
                            break
                        default:
                            errorMessage = error.response.data?.message || 'Error desconocido'
                    }
                }
            } else if (error.request) {
                errorMessage = 'No se pudo conectar con el servidor. Verifique la conexión.'
            } else {
                errorMessage = error.message || 'Error de registro'
            }

            return {
                success: false,
                error: errorMessage
            }
        }
    }
}

export default authService
