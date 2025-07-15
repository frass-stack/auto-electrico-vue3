<template>
  <div class="register-container">
    <div class="register-card">
      <div class="register-header">
        <h2>Crear Cuenta</h2>
        <p>Regístrate para acceder al sistema</p>
      </div>
      
      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <label for="name">Nombre</label>
          <input 
            type="text" 
            id="name" 
            v-model="name" 
            required 
            placeholder="Tu nombre"
          >
        </div>

        <div class="form-group">
          <label for="email">Correo electrónico</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            required 
            placeholder="ejemplo@correo.com"
          >
        </div>
        
        <div class="form-group">
          <label for="password">Contraseña</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            required 
            placeholder="••••••••"
          >
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirmar Contraseña</label>
          <input 
            type="password" 
            id="confirmPassword" 
            v-model="confirmPassword" 
            required 
            placeholder="••••••••"
          >
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button type="submit" class="register-button" :disabled="loading || !isFormValid">
          <span v-if="loading">Registrando...</span>
          <span v-else>Registrarse</span>
        </button>

        <div class="register-footer">
          <p>¿Ya tienes cuenta? <router-link to="/login">Inicia sesión</router-link></p>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../store/auth'

export default {
  name: 'RegisterView',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    
    const name = ref('')
    const email = ref('')
    const password = ref('')
    const confirmPassword = ref('')
    const loading = ref(false)
    const error = ref('')

    const isFormValid = computed(() => {
      return name.value.trim() && 
             email.value.trim() && 
             password.value.length >= 6 && 
             password.value === confirmPassword.value
    })

    const handleRegister = async () => {
      if (!isFormValid.value) return

      loading.value = true
      error.value = ''

      try {
        await authStore.register({
          name: name.value,
          email: email.value,
          password: password.value
        })
        router.push('/dashboard')
      } catch (err) {
        error.value = err.message
      } finally {
        loading.value = false
      }
    }

    return {
      name,
      email,
      password,
      confirmPassword,
      loading,
      error,
      isFormValid,
      handleRegister
    }
  }
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--bg-color) 0%, var(--bg-secondary) 100%);
  padding: 1rem;
}

.register-card {
  background: var(--bg-secondary);
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 10px 25px var(--shadow-color);
  width: 100%;
  max-width: 400px;
  border: 1px solid var(--border-color);
}

.register-header {
  text-align: center;
  margin-bottom: 2rem;
}

.register-header h2 {
  color: var(--text-color);
  margin-bottom: 0.5rem;
}

.register-header p {
  color: var(--text-color-light);
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

.error-message {
  background-color: #ff44441a;
  color: #ff4444;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.register-button {
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

.register-button:hover:not(:disabled) {
  background-color: var(--primary-hover);
}

.register-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.register-footer {
  margin-top: 1.5rem;
  text-align: center;
  color: var(--text-color-light);
}

.register-footer a {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
}

.register-footer a:hover {
  text-decoration: underline;
}
</style> 