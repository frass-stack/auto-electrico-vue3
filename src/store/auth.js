import { defineStore } from 'pinia'
import { ref } from 'vue'
import router from '@/router'

// Mock de usuarios para pruebas
const MOCK_USERS = [
  {
    id: 1,
    email: 'owner@example.com',
    password: 'owner123',
    role: 'owner',
    name: 'Usuario Owner'
  },
  {
    id: 2,
    email: 'invitado@example.com',
    password: 'invitado123',
    role: 'guest',
    name: 'Usuario Invitado'
  }
]

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('auth_token') || null)
  const loading = ref(false)
  const error = ref(null)

  const login = async ({ email, password }) => {
    loading.value = true
    error.value = null

    try {
      // Simulación de llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const foundUser = MOCK_USERS.find(
        user => user.email === email && user.password === password
      )

      if (!foundUser) {
        throw new Error('Credenciales inválidas')
      }

      // Simulación de token JWT
      const mockToken = btoa(JSON.stringify({
        userId: foundUser.id,
        role: foundUser.role,
        exp: Date.now() + 24 * 60 * 60 * 1000 // 24 horas
      }))

      user.value = foundUser
      token.value = mockToken
      localStorage.setItem('auth_token', mockToken)
      
      // Redirigir al dashboard
      router.push('/')
      
      return foundUser
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_token')
    // Redirigir al login
    router.push('/login')
  }

  const checkAuth = () => {
    if (!token.value) return false

    try {
      const tokenData = JSON.parse(atob(token.value))
      if (tokenData.exp < Date.now()) {
        logout()
        return false
      }
      return true
    } catch {
      logout()
      return false
    }
  }

  return {
    user,
    token,
    loading,
    error,
    login,
    logout,
    checkAuth
  }
}) 