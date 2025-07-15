<template>
  <div class="usuario-view">
    <h2>Usuario Actual</h2>
    
    <!-- Debug info -->
    <div v-if="!isAuthenticated" class="debug-info">
      <p>⚠️ Usuario no autenticado</p>
    </div>
    
    <div v-if="isAuthenticated" class="usuario-card">
      <div class="usuario-item">
        <span class="label">Nombre:</span>
        <span class="value">{{ userName }}</span>
      </div>
      <div class="usuario-item">
        <span class="label">Email:</span>
        <span class="value">{{ userEmail }}</span>
      </div>
      <div class="usuario-item">
        <span class="label">Rol:</span>
        <span class="value">{{ user?.role || 'No disponible' }}</span>
      </div>
    </div>
    
    <div v-else class="no-user-info">
      <p>No hay información del usuario disponible</p>
      <p>Estado de autenticación: {{ isAuthenticated ? 'Autenticado' : 'No autenticado' }}</p>
    </div>
  </div>
</template>
<script>
import { computed } from 'vue'
import { useAuthStore } from '@/store/auth'

export default {
  name: 'UsuarioView',
  setup() {
    const authStore = useAuthStore()
    
    // Usar computed para hacer reactivos los datos del usuario
    const userName = computed(() => authStore.user?.name || 'No disponible')
    const userEmail = computed(() => authStore.user?.email || 'No disponible')
    
    return {
      userName,
      userEmail,
      user: computed(() => authStore.user),
      isAuthenticated: computed(() => authStore.isAuthenticated)
    }
  }
}
</script>
<style scoped>
.usuario-view { 
  padding: 2rem; 
}

.usuario-card { 
  background: #fff; 
  border-radius: 10px; 
  box-shadow: 0 2px 8px rgba(0,0,0,0.08); 
  padding: 2rem; 
  max-width: 500px; 
  margin: 0 auto; 
}

.usuario-item { 
  display: flex; 
  justify-content: space-between; 
  margin-bottom: 1rem; 
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}

.usuario-item:last-child {
  border-bottom: none;
}

.label { 
  font-weight: 500; 
  color: #666;
}

.value { 
  font-weight: 700; 
  color: #333;
}

.debug-info {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 5px;
  padding: 1rem;
  margin-bottom: 1rem;
  text-align: center;
  color: #856404;
}

.no-user-info {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 5px;
  padding: 2rem;
  text-align: center;
  color: #6c757d;
}
</style> 