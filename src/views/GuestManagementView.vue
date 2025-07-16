<template>
  <div class="guest-management">
    <h2>Gestión de Usuarios Invitados</h2>

    <!-- Formulario para agregar invitados -->
    <div class="guest-card">
      <h3>Agregar Nuevo Invitado</h3>
      <form @submit.prevent="handleAddGuest" class="guest-form">
        <div class="form-group">
          <label for="name">Nombre</label>
          <input 
            type="text" 
            id="name" 
            v-model="newGuest.name" 
            required 
            placeholder="Nombre del invitado"
          >
        </div>

        <div class="form-group">
          <label for="email">Correo electrónico</label>
          <input 
            type="email" 
            id="email" 
            v-model="newGuest.email" 
            required 
            placeholder="correo@ejemplo.com"
          >
        </div>

        <div class="form-group">
          <label for="password">Contraseña temporal</label>
          <input 
            type="password" 
            id="password" 
            v-model="newGuest.password" 
            required 
            placeholder="••••••••"
          >
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button type="submit" class="submit-button" :disabled="loading">
          {{ loading ? 'Agregando...' : 'Agregar Invitado' }}
        </button>
      </form>
    </div>

    <!-- Lista de invitados -->
    <div class="guest-card">
      <h3>Usuarios Invitados</h3>
      <div v-if="guests.length === 0" class="empty-state">
        No hay usuarios invitados registrados
      </div>
      <div v-else class="guest-list">
        <div v-for="guest in guests" :key="guest.id" class="guest-item">
          <div class="guest-info">
            <h4>{{ guest.name }}</h4>
            <p>{{ guest.email }}</p>
          </div>
          <div class="guest-actions">
            <button 
              class="delete-button" 
              @click="handleRemoveGuest(guest.id)"
              :disabled="loading"
            >
              <i class="fas fa-trash"></i>
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/store/auth'

export default {
  name: 'GuestManagementView',
  setup() {
    const authStore = useAuthStore()
    const authorizedDrivers = ref([])
    const loading = ref(false)
    const error = ref('')

    const newGuest = ref({
      name: '',
      email: '',
      password: ''
    })

    const loadGuests = async () => {
      try {
        authorizedDrivers.value = await authStore.getAuthorizedDrivers()
      } catch (err) {
        error.value = err.message
        console.error('Error cargando conductores autorizados:', err)
      }
    }

    const handleAddGuest = async () => {
      if (loading.value) return
      loading.value = true
      error.value = ''

      try {
        // TODO: Implementar la función register en el authStore
        // await authStore.register({
        //   ...newGuest.value,
        //   role: 'guest',
        //   ownerId: authStore.user.id
        // })
        
        // Por ahora, mostrar mensaje de que la funcionalidad está en desarrollo
        error.value = 'Funcionalidad de agregar invitados en desarrollo'
        return

        // Limpiar formulario
        newGuest.value = {
          name: '',
          email: '',
          pin: ''
        }

        // Recargar lista de invitados
        await loadGuests()
      } catch (err) {
        error.value = err.message
      } finally {
        loading.value = false
      }
    }

    const handleRemoveGuest = async (guestId) => {
      if (loading.value) return
      loading.value = true
      error.value = ''

      try {
        await authStore.removeGuest(guestId)
        await loadGuests()
      } catch (err) {
        error.value = err.message
      } finally {
        loading.value = false
      }
    }

    onMounted(async () => {
      await loadGuests()
    })

    return {
      guests: authorizedDrivers,
      newGuest,
      loading,
      error,
      handleAddGuest,
      handleRemoveGuest
    }
  }
}
</script>

<style scoped>
.guest-management {
  padding: 1rem;
}

h2 {
  color: var(--text-color);
  margin-bottom: 2rem;
}

.guest-card {
  background: var(--bg-secondary);
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 10px 25px var(--shadow-color);
  margin-bottom: 2rem;
  border: 1px solid var(--border-color);
}

h3 {
  color: var(--text-color);
  margin-bottom: 1.5rem;
}

.guest-form {
  max-width: 500px;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-color);
  font-weight: 500;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  background-color: var(--bg-color);
  color: var(--text-color);
  font-size: 1rem;
  transition: border-color var(--transition-speed);
}

input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.submit-button {
  width: 100%;
  padding: 0.75rem;
  background-color: var(--primary-color);
  color: var(--bg-color);
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color var(--transition-speed);
}

.submit-button:hover:not(:disabled) {
  background-color: var(--primary-hover);
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-message {
  background-color: #ff44441a;
  color: #ff4444;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.empty-state {
  color: var(--text-color-light);
  text-align: center;
  padding: 2rem;
}

.guest-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.guest-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: var(--bg-color);
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
}

.guest-info h4 {
  color: var(--text-color);
  margin-bottom: 0.25rem;
}

.guest-info p {
  color: var(--text-color-light);
  font-size: 0.875rem;
}

.delete-button {
  padding: 0.5rem 1rem;
  background-color: #ff4444;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color var(--transition-speed);
}

.delete-button:hover:not(:disabled) {
  background-color: #cc3333;
}

.delete-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.delete-button i {
  font-size: 0.875rem;
}
</style> 