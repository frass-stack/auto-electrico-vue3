<template>
  <div class="luces-view">
    <h2>Control de Iluminación</h2>
    
    <div class="lights-grid">
      <div class="light-card">
        <div class="light-icon">
          <i class="fas fa-car-side"></i>
        </div>
        <div class="light-content">
          <h3>Luces Delanteras</h3>
          <p>Estado: {{ lights.front ? 'Encendidas' : 'Apagadas' }}</p>
          <button 
            class="light-button" 
            :class="{ 'active': lights.front }"
            @click="() => toggleLight('front')"
          >
            {{ lights.front ? 'Apagar' : 'Encender' }}
          </button>
        </div>
      </div>

      <div class="light-card">
        <div class="light-icon">
          <i class="fas fa-car"></i>
        </div>
        <div class="light-content">
          <h3>Luces Traseras</h3>
          <p>Estado: {{ lights.rear ? 'Encendidas' : 'Apagadas' }}</p>
          <button 
            class="light-button" 
            :class="{ 'active': lights.rear }"
            @click="() => toggleLight('rear')"
          >
            {{ lights.rear ? 'Apagar' : 'Encender' }}
          </button>
        </div>
      </div>

      <div class="light-card">
        <div class="light-icon">
          <i class="fas fa-lightbulb"></i>
        </div>
        <div class="light-content">
          <h3>Luces Interiores</h3>
          <p>Estado: {{ lights.interior ? 'Encendidas' : 'Apagadas' }}</p>
          <button 
            class="light-button" 
            :class="{ 'active': lights.interior }"
            @click="() => toggleLight('interior')"
          >
            {{ lights.interior ? 'Apagar' : 'Encender' }}
          </button>
        </div>
      </div>
    </div>

    <div class="info-card">
      <div class="info-header">
        <i class="fas fa-info-circle"></i>
        <h3>Información del Sistema</h3>
      </div>
      <div class="info-content">
        <p>Las luces se apagarán automáticamente después de 30 segundos si el motor está apagado para ahorrar batería.</p>
        <p>Consumo estimado de las luces: 0.1 kWh/hora</p>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useVehicleStore } from '@/store/vehicle'

export default {
  name: 'LucesView',
  setup() {
    const vehicleStore = useVehicleStore()

    return {
      lights: computed(() => vehicleStore.lights),
      toggleLight: vehicleStore.toggleLight
    }
  }
}
</script>

<style scoped>
.luces-view {
  padding: 1rem;
}

h2 {
  color: var(--text-color);
  margin-bottom: 2rem;
}

.lights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.light-card {
  background-color: var(--bg-secondary);
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  gap: 1.5rem;
  align-items: center;
  border: 1px solid var(--border-color);
  transition: transform var(--transition-speed);
}

.light-card:hover {
  transform: translateY(-5px);
}

.light-icon {
  background-color: var(--primary-color);
  color: var(--bg-color);
  width: 4rem;
  height: 4rem;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
}

.light-content {
  flex: 1;
}

.light-content h3 {
  color: var(--text-color);
  margin-bottom: 0.5rem;
}

.light-content p {
  color: var(--text-color-light);
  margin-bottom: 1rem;
}

.light-button {
  width: 100%;
  padding: 0.75rem;
  background-color: var(--primary-color);
  color: var(--bg-color);
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color var(--transition-speed);
}

.light-button:hover {
  background-color: var(--primary-hover);
}

.light-button.active {
  background-color: #ffaa00;
}

.light-button.active:hover {
  background-color: #cc8800;
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
}

.info-content p:last-child {
  margin-bottom: 0;
}

@media (max-width: 768px) {
  .lights-grid {
    grid-template-columns: 1fr;
  }
}
</style> 