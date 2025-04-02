<template>
  <div class="tablero">
    <h1 class="titulo">Panel de Control</h1>
    
    <!-- Mensaje de error -->
    <div v-if="error" class="error-message">
      <i class="fas fa-exclamation-circle"></i>
      <p>{{ error }}</p>
    </div>

    <!-- Estado de carga -->
    <div v-if="loading" class="loading">
      <i class="fas fa-spinner fa-spin"></i>
      <p>Cargando datos...</p>
    </div>

    <!-- Contenido principal -->
    <div v-else class="grid">
      <div
        class="card"
        v-for="(item, index) in items"
        :key="index"
      >
        <img :src="item.img" :alt="item.name" class="imagen" />
        <h2>{{ item.name }}</h2>
        <component 
          :is="item.component" 
          @error="handleComponentError"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Coche from './Coche.vue';
import Luces from './Luces.vue';
import Motor from './Motor.vue';
import { handleApiError } from '../services/api';

import cocheImg from '../assets/coche.png';
import lucesImg from '../assets/luces.jpg';
import motorImg from '../assets/motor.jpg';

export default {
  name: 'Tablero',
  components: {
    Coche,
    Luces,
    Motor,
  },
  data() {
    return {
      items: [
        { name: 'Coche', img: cocheImg, component: 'Coche' },
        { name: 'Luces', img: lucesImg, component: 'Luces' },
        { name: 'Motor', img: motorImg, component: 'Motor' },
      ],
      loading: false,
      error: null
    };
  },
  methods: {
    handleComponentError(error) {
      this.error = handleApiError(error, 'Error en el componente');
      // Limpiar el error después de 5 segundos
      setTimeout(() => {
        this.error = null;
      }, 5000);
    },
    async fetchData() {
      this.loading = true;
      this.error = null;
      try {
        // Aquí irían las llamadas a la API si las necesitas
        await this.$api.get('/dashboard-data');
      } catch (error) {
        this.error = handleApiError(error, 'Error al cargar los datos del panel');
      } finally {
        this.loading = false;
      }
    }
  },
  mounted() {
    this.fetchData();
  }
};
</script>

<style scoped>
.tablero {
  padding: 2rem 1rem;
  width: 100%;
}

.titulo {
  text-align: center;
  margin-bottom: 2rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.imagen {
  width: 80px;
  height: auto;
  margin-bottom: 1rem;
}

/* Mensajes de error y carga */
.error-message,
.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: var(--border-radius);
  background-color: var(--card-bg);
  box-shadow: var(--shadow);
}

.error-message {
  color: #dc3545;
  border: 1px solid #dc3545;
}

.error-message i {
  font-size: 1.2rem;
}

.loading {
  color: var(--text-color);
}

.loading i {
  font-size: 1.5rem;
  color: var(--primary-color);
}

/* Media queries */
@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .titulo {
    font-size: 1.5rem;
  }
}
</style>
