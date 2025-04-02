<template>
  <div class="usuario-view">
    <h2>Perfil de Usuario</h2>

    <div class="profile-card">
      <div class="profile-header">
        <div class="profile-icon">
          <i class="fas fa-user-circle"></i>
        </div>
        <div class="profile-role" :class="{ 'owner': user?.role === 'owner' }">
          {{ user?.role === 'owner' ? 'Propietario' : 'Invitado' }}
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="profile-form">
        <div class="form-group">
          <label>Correo Electrónico</label>
          <input 
            type="email" 
            :value="user?.email"
            disabled
            class="form-control disabled"
          >
          <small>El correo electrónico no puede ser modificado</small>
        </div>

        <div class="form-group">
          <label>Nombre</label>
          <input 
            type="text" 
            v-model="formData.name"
            required
            class="form-control"
            placeholder="Tu nombre"
          >
        </div>

        <div class="form-group">
          <label>Apellido</label>
          <input 
            type="text" 
            v-model="formData.lastName"
            required
            class="form-control"
            placeholder="Tu apellido"
          >
        </div>

        <div class="form-group">
          <label>Nueva Contraseña</label>
          <input 
            type="password" 
            v-model="formData.newPassword"
            class="form-control"
            placeholder="Dejar en blanco para mantener la actual"
          >
        </div>

        <div class="form-group">
          <label>Confirmar Nueva Contraseña</label>
          <input 
            type="password" 
            v-model="formData.confirmPassword"
            class="form-control"
            placeholder="Confirmar nueva contraseña"
            :disabled="!formData.newPassword"
          >
        </div>

        <div class="form-group">
          <label>Contraseña Actual</label>
          <input 
            type="password" 
            v-model="formData.currentPassword"
            required
            class="form-control"
            placeholder="Requerida para guardar cambios"
          >
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div v-if="success" class="success-message">
          {{ success }}
        </div>

        <button 
          type="submit" 
          class="submit-button"
          :disabled="loading || !isFormValid"
        >
          {{ loading ? 'Guardando...' : 'Guardar Cambios' }}
        </button>
      </form>
    </div>

    <div class="info-card">
      <div class="info-header">
        <i class="fas fa-shield-alt"></i>
        <h3>Seguridad de la Cuenta</h3>
      </div>
      <div class="info-content">
        <p>
          <i class="fas fa-info-circle"></i>
          Tu contraseña debe tener al menos 8 caracteres y contener letras y números.
        </p>
        <p>
          <i class="fas fa-exclamation-triangle"></i>
          Por seguridad, necesitas ingresar tu contraseña actual para guardar cualquier cambio.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref, reactive } from 'vue'
import { useAuthStore } from '@/store/auth'

export default {
  name: 'UsuarioView',
  setup() {
    const authStore = useAuthStore()
    const user = computed(() => authStore.user)
    const loading = ref(false)
    const error = ref('')
    const success = ref('')

    const formData = reactive({
      name: user.value?.name?.split(' ')[0] || '',
      lastName: user.value?.name?.split(' ')[1] || '',
      newPassword: '',
      confirmPassword: '',
      currentPassword: ''
    })

    const isFormValid = computed(() => {
      if (!formData.name || !formData.lastName || !formData.currentPassword) return false
      if (formData.newPassword && formData.newPassword !== formData.confirmPassword) return false
      if (formData.newPassword && formData.newPassword.length < 8) return false
      return true
    })

    const handleSubmit = async () => {
      error.value = ''
      success.value = ''
      loading.value = true

      try {
        // Validaciones
        if (formData.newPassword && formData.newPassword.length < 8) {
          throw new Error('La nueva contraseña debe tener al menos 8 caracteres')
        }

        if (formData.newPassword && !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(formData.newPassword)) {
          throw new Error('La contraseña debe contener letras y números')
        }

        if (formData.newPassword !== formData.confirmPassword) {
          throw new Error('Las contraseñas no coinciden')
        }

        // Actualizar perfil
        await authStore.updateProfile({
          name: `${formData.name} ${formData.lastName}`,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword || undefined
        })

        success.value = 'Perfil actualizado correctamente'
        formData.newPassword = ''
        formData.confirmPassword = ''
        formData.currentPassword = ''
      } catch (err) {
        error.value = err.message
      } finally {
        loading.value = false
      }
    }

    return {
      user,
      formData,
      loading,
      error,
      success,
      isFormValid,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.usuario-view {
  padding: 1rem;
}

h2 {
  color: var(--text-color);
  margin-bottom: 2rem;
}

.profile-card {
  background-color: var(--bg-secondary);
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 1.5rem;
  border: 1px solid var(--border-color);
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.profile-icon {
  font-size: 4rem;
  color: var(--primary-color);
}

.profile-role {
  background-color: var(--primary-color);
  color: var(--bg-color);
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-weight: 500;
}

.profile-role.owner {
  background-color: #ffaa00;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  color: var(--text-color);
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: border-color var(--transition-speed);
}

.form-control:focus {
  outline: none;
  border-color: var(--primary-color);
}

.form-control.disabled {
  background-color: var(--border-color);
  cursor: not-allowed;
}

small {
  display: block;
  color: var(--text-color-light);
  margin-top: 0.25rem;
  font-size: 0.875rem;
}

.error-message {
  background-color: #ff44441a;
  color: #ff4444;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.success-message {
  background-color: #44ff441a;
  color: #44ff44;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.submit-button {
  width: 100%;
  padding: 0.75rem;
  background-color: var(--primary-color);
  color: var(--bg-color);
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  transition: background-color var(--transition-speed);
}

.submit-button:hover:not(:disabled) {
  background-color: var(--primary-hover);
}

.submit-button:disabled {
  background-color: var(--border-color);
  cursor: not-allowed;
}

.info-card {
  background-color: var(--bg-secondary);
  border-radius: 1rem;
  padding: 1.5rem;
  border: 1px solid var(--border-color);
}

.info-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.info-header i {
  color: var(--primary-color);
  font-size: 1.5rem;
}

.info-header h3 {
  color: var(--text-color);
  margin: 0;
}

.info-content p {
  color: var(--text-color-light);
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.info-content p:last-child {
  margin-bottom: 0;
}

@media (max-width: 768px) {
  .profile-card {
    padding: 1.5rem;
  }
}
</style> 