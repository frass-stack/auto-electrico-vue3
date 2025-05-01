import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'
import api from './services/api'
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

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

const toastOptions = {
    position: "top-right",
    timeout: 3000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: true,
    closeButton: "button",
    icon: true,
    rtl: false
}

// Usar plugins
app.use(pinia)
app.use(router)
app.use(Toast, toastOptions)

// Montar la aplicación
app.mount('#app')

