<template>
  <div class="login-container">
    <div class="login-box">
      <h1>Bienvenido</h1>
      <p>Inicia sesión para acceder al sistema</p>
      
      <!-- Formulario de login real -->
      <form 
        @submit.prevent="handleBackendLogin" 
        class="login-form"
      >
        <div class="form-group">
          <label for="userName">Nombre de usuario</label>
          <input 
            type="text" 
            id="userName" 
            v-model="userName" 
            required 
            placeholder="Ingresa tu nombre de usuario"
          >
        </div>
        
        <div class="form-group">
          <label for="pin">PIN</label>
          <input 
            type="number" 
            id="pin" 
            v-model.number="pin" 
            required 
            placeholder="Ingresa tu PIN"
          >
        </div>
        <button type="submit" class="login-button" :disabled="loading">
          <span v-if="loading">Cargando...</span>
          <span v-else>Iniciar sesión</span>
        </button>
        <div class="login-footer">
          <p>¿No tienes cuenta? <router-link to="/register">Regístrate</router-link></p>
        </div>
      </form>

      <!-- Mostrar errores -->
      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <!-- Sección QR -->
      <div class="qr-section">
        <div class="qr-tabs">
          <button 
            :class="['tab-btn', { active: activeTab === 'scan' }]"
            @click="activeTab = 'scan'"
          >
            <i class="fas fa-qrcode"></i> Escanear QR
          </button>
          <button 
            :class="['tab-btn', { active: activeTab === 'generate' }]"
            @click="activeTab = 'generate'"
          >
            <i class="fas fa-mobile-alt"></i> Acceso Móvil
          </button>
        </div>
        <div class="qr-content">
          <!-- Generador QR por defecto -->
          <QRGenerator 
            v-if="activeTab === 'generate'"
            :url="mobileUrl"
          />
          <!-- Escáner QR -->
          <QRScanner 
            v-if="activeTab === 'scan'"
            @qr-detected="handleQRDetected"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import QRScanner from '@/components/QRScanner.vue'
import QRGenerator from '@/components/QRGenerator.vue'

export default {
  name: 'LoginView',
  components: {
    QRScanner,
    QRGenerator
  },
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const activeTab = ref('generate')
    
    // Estado del formulario
    const userName = ref('')
    const pin = ref('')
    
    // Estados reactivos del store
    const loading = computed(() => authStore.loading)
    const error = computed(() => authStore.error)

    // Obtener la URL para acceso móvil
      const mobileUrl = computed(() => {
      const host = window.location.hostname
      const port = window.location.port
      return `http://${host}:${port}`
    })

    const handleBackendLogin = async () => {
      try {
        const result = await authStore.login({
          userName: userName.value,
          pin: pin.value
        })
        
        if (result && authStore.isAuthenticated) {
          router.push('/dashboard')
        } else {
          console.error('❌ Error de Login:', authStore.error)
          alert('Error al iniciar sesión. Por favor, verifica tus credenciales.')
        }
      } catch (error) {
        console.error('❌ Error de Login:', error)
      } finally {
        loading.value = false
      }
    }

    const handleQRDetected = (url) => {
      try {
        // Validar que la URL sea de nuestra aplicación
        if (url.startsWith(mobileUrl.value)) {
          // Redirigir a la URL escaneada
          window.location.href = url
        } else {
          alert('Código QR inválido')
        }
      } catch (error) {
        console.error('Error al procesar QR:', error)
        alert('Error al procesar el código QR')
      }
    }

    return {
      activeTab,
      mobileUrl,
      handleQRDetected,
      userName,
      pin,
      loading,
      error,
      handleBackendLogin
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  padding: 1rem;
}

.login-box {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 450px;
}

.login-box h1 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
  text-align: center;
}

.login-box p {
  color: #666;
  text-align: center;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus {
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

.error-message {
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #fee;
  border: 1px solid #fcc;
  border-radius: 0.5rem;
  color: #c33;
  font-size: 0.9rem;
}

.login-instructions {
  margin-top: 2rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 0.5rem;
  border-left: 4px solid #0044cc;
}

.login-instructions h4 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
}

.login-instructions p {
  margin: 0.25rem 0;
  font-size: 0.9rem;
  color: #666;
}

.login-instructions em {
  color: #0044cc;
  font-weight: 500;
}

.qr-section {
  margin-top: 2rem;
  border-top: 1px solid #eee;
  padding-top: 1rem;
}

.qr-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.tab-btn {
  flex: 1;
  padding: 0.75rem;
  border: none;
  background: #f5f5f5;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.tab-btn.active {
  background: #2196F3;
  color: white;
}

.qr-content {
  min-height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.debug-qr-section {
  /* Eliminar estilos de depuración */
  border: none !important;
  background: none !important;
  min-height: unset !important;
  z-index: unset !important;
}

@media (max-width: 768px) {
  .login-box {
    padding: 1.5rem;
  }
}
</style>