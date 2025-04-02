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
    name: 'Usuario Owner',
    guests: [] // Lista de invitados del propietario
  },
  {
    id: 2,
    email: 'invitado@example.com',
    password: 'invitado123',
    role: 'guest',
    name: 'Usuario Invitado',
    ownerId: 1 // ID del propietario que lo invitó
  }
]

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('auth_token') || null)
  const loading = ref(false)
  const error = ref(null)

  const register = async ({ name, email, password, role = 'guest', ownerId = null }) => {
    loading.value = true
    error.value = null

    try {
      // Validar que el email no exista
      const existingUser = MOCK_USERS.find(u => u.email === email)
      if (existingUser) {
        throw new Error('El correo electrónico ya está registrado')
      }

      // Crear nuevo usuario
      const newUser = {
        id: MOCK_USERS.length + 1,
        email,
        password,
        name,
        role,
        ownerId,
        guests: role === 'owner' ? [] : undefined
      }

      // Agregar a la lista de usuarios
      MOCK_USERS.push(newUser)

      // Si es un invitado, agregarlo a la lista de invitados del propietario
      if (role === 'guest' && ownerId) {
        const owner = MOCK_USERS.find(u => u.id === ownerId)
        if (owner) {
          owner.guests.push(newUser.id)
        }
      }

      // Si no es un invitado siendo registrado por un propietario, iniciar sesión
      if (!ownerId) {
        return await login({ email, password })
      }

      return newUser
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const login = async ({ email, password }) => {
    loading.value = true
    error.value = null

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const foundUser = MOCK_USERS.find(
        user => user.email === email && user.password === password
      )

      if (!foundUser) {
        throw new Error('Credenciales inválidas')
      }

      const mockToken = btoa(JSON.stringify({
        userId: foundUser.id,
        role: foundUser.role,
        exp: Date.now() + 24 * 60 * 60 * 1000
      }))

      user.value = foundUser
      token.value = mockToken
      localStorage.setItem('auth_token', mockToken)
      
      router.push('/')
      
      return foundUser
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const getGuestUsers = () => {
    if (!user.value || user.value.role !== 'owner') return []
    return MOCK_USERS.filter(u => u.ownerId === user.value.id)
  }

  const removeGuest = async (guestId) => {
    if (!user.value || user.value.role !== 'owner') {
      throw new Error('No tienes permisos para realizar esta acción')
    }

    const guestIndex = MOCK_USERS.findIndex(u => u.id === guestId && u.ownerId === user.value.id)
    if (guestIndex === -1) {
      throw new Error('Usuario invitado no encontrado')
    }

    // Eliminar el invitado de la lista de usuarios
    MOCK_USERS.splice(guestIndex, 1)
    // Eliminar el ID del invitado de la lista de invitados del propietario
    const ownerIndex = user.value.guests.indexOf(guestId)
    if (ownerIndex !== -1) {
      user.value.guests.splice(ownerIndex, 1)
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_token')
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
    checkAuth,
    register,
    getGuestUsers,
    removeGuest
  }
}) 