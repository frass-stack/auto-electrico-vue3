<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h2>Bienvenido</h2>
        <p>Inicia sesión para acceder al sistema</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="login-form">
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
          <label class="checkbox-container">
            <input type="checkbox" v-model="rememberMe">
            <span class="checkmark"></span>
            Recordar sesión
          </label>
        </div>

        <button type="submit" class="login-button" :disabled="loading">
          <span v-if="loading">Cargando...</span>
          <span v-else>Iniciar sesión</span>
        </button>

        <div class="login-footer">
          <p>¿No tienes cuenta? <router-link to="/register">Regístrate</router-link></p>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../store/auth'

export default {
  name: 'LoginView',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    
    const email = ref('')
    const password = ref('')
    const rememberMe = ref(false)
    const loading = ref(false)

    const handleLogin = async () => {
      loading.value = true
      try {
        await authStore.login({
          email: email.value,
          password: password.value
        })
        router.push('/dashboard')
      } catch (error) {
        console.error('Error de login:', error)
      } finally {
        loading.value = false
      }
    }

    return {
      email,
      password,
      rememberMe,
      loading,
      handleLogin
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 1rem;
}

.login-card {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-header h2 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.login-header p {
  color: #666;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 500;
}

input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.3s;
}

input[type="email"]:focus,
input[type="password"]:focus {
  border-color: #0044cc;
  outline: none;
}

.checkbox-container {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.checkbox-container input {
  margin-right: 0.5rem;
}

.login-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #0044cc;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-button:hover {
  background-color: #386ede;
}

.login-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.login-footer {
  margin-top: 1.5rem;
  text-align: center;
  color: #666;
}

.login-footer a {
  color: #0044cc;
  text-decoration: none;
}

.login-footer a:hover {
  text-decoration: underline;
}
</style> 