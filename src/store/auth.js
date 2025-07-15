import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/authService'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Función para inicializar el store con datos guardados
  const initializeStore = () => {

    const savedToken = localStorage.getItem('auth_token')
    const savedUser = localStorage.getItem('auth_user')

    if (savedToken) {
      token.value = savedToken
    } else {
      token.value = null
    }

    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        user.value = parsedUser

      } catch (error) {
        console.error('Error parsing saved user from localStorage:', error)
        localStorage.removeItem('auth_user')
        localStorage.removeItem('auth_token')
        user.value = null
        token.value = null
      }
    } else {
      user.value = null
    }
  }

  // Función para forzar reinicialización (para debugging)
  const forceInitialize = () => {
    initializeStore()
  }

  // Inicializar el store cuando se crea
  initializeStore()


  const login = async ({ userName, pin }) => {
    loading.value = true
    error.value = null

    try {
      // Login con el backend real
      if (userName && pin) {
        const response = await authService.login({ userName, pin })

        if (response.success) {

          // Asignar valores al store
          user.value = response.user
          token.value = response.token

          // Guardar tanto el token como los datos del usuario
          if (response.token) {
            localStorage.setItem('auth_token', response.token)
          }
          if (response.user) {
            localStorage.setItem('auth_user', JSON.stringify(response.user))
          }
          return response.user
        } else {
          throw new Error(response.error)
        }
      }

      throw new Error('Debe proporcionar credenciales válidas')
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const removeGuest = async (guestId) => {
    if (!user.value || user.value.role !== 'Owner') {
      throw new Error('No tienes permisos para realizar esta acción')
    }
  }

  const logout = async () => {

    // Intentar cerrar sesión en el backend si hay token
    user.value = null
    token.value = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  }

  const checkAuth = async () => {
    if (!token.value) return false

    try {
      // Aquí debería validar el token con el backend
      // Por ahora, solo verificar que exista el token
      return !!(user.value && token.value)
    } catch (error) {
      console.warn('Error validando token:', error)
      // Si hay error, limpiar estado
      user.value = null
      token.value = null
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      return false
    }
  }

  // Computed property para verificar autenticación
  const isAuthenticated = computed(() => {
    const hasUser = !!user.value
    const hasToken = !!token.value
    const result = hasUser && hasToken

    return result
  })

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
    checkAuth,
    //register,
    removeGuest,
    forceInitialize
  }
}) 