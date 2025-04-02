import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'
import api from './services/api'

// Crear la aplicación Vue
const app = createApp(App)
const pinia = createPinia()

// Configuración global
app.config.globalProperties.$api = api
app.config.globalProperties.$filters = {
  formatDate(date) {
    return new Date(date).toLocaleDateString('es-ES')
  },
  formatTime(date) {
    return new Date(date).toLocaleTimeString('es-ES')
  }
}

// Usar plugins
app.use(pinia)
app.use(router)

// Montar la aplicación
app.mount('#app')

