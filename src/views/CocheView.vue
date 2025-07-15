<template>
  <div class="coche-view">
    <h2>Control del Vehículo</h2>
    <div class="status-grid">
      <div class="status-card">
        <div class="status-header">
          <i class="fas fa-car"></i>
          <h3>Estado General</h3>
        </div>
        <div class="status-content">
          <div class="status-item">
            <span class="label">Motor:</span>
            <span class="value" :class="{ 'active': isEngineOn }">
              {{ isEngineOn ? 'Encendido' : 'Apagado' }}
            </span>
          </div>
          <div class="status-item">
            <span class="label">Autonomía:</span>
            <span class="value">{{ range }} km</span>
          </div>
          <div class="status-item">
            <span class="label">Voltaje:</span>
            <span class="value">{{ batteryVoltage }} V</span>
          </div>
          <div class="status-item">
            <span class="label">Velocidad:</span>
            <span class="value">{{ vehicleSpeed }} km/h</span>
          </div>
        </div>
        <div class="actions">
          <button class="action-button" :class="{ 'active': isEngineOn }" @click="toggleEngine">
            {{ isEngineOn ? 'Apagar Motor' : 'Encender Motor' }}
          </button>
        </div>
      </div>
      <div class="status-card">
        <div class="status-header">
          <i class="fas fa-door-open"></i>
          <h3>Puertas</h3>
        </div>
        <div class="status-content">
          <div class="status-item">
            <span class="label">Estado:</span>
            <span class="value">{{ puertasAbiertas ? 'Abiertas' : 'Cerradas' }}</span>
          </div>
        </div>
        <div class="actions">
          <button class="action-button" @click="togglePuertas">
            {{ puertasLabel }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { computed, ref, onMounted } from 'vue'
import { useVehicleStore } from '@/store/vehicle'
import { mqttService } from '@/services/mqtt'
export default {
  name: 'CocheView',
  setup() {
    const vehicleStore = useVehicleStore()
    const batteryVoltage = ref('---')
    const vehicleSpeed = ref('---')

    // Motor: acción centralizada
    const toggleEngine = () => {
      vehicleStore.setEngineState(!vehicleStore.isEngineOn)
    }

    // Puertas: acción centralizada
    const togglePuertas = () => {
      vehicleStore.actualizarPuertas({ abiertas: !vehicleStore.puertasAbiertas })
    }
    const puertasAbiertas = computed(() => vehicleStore.puertasAbiertas)
    const puertasLabel = computed(() => puertasAbiertas.value ? 'Cerrar Puertas' : 'Abrir Puertas')

    // Cinturones: acción centralizada
    const toggleCinturones = () => {
      vehicleStore.actualizarCinturones({ abrochados: !vehicleStore.cinturonesAbrochados })
    }
    const cinturonesAbrochados = computed(() => vehicleStore.cinturonesAbrochados)
    const cinturonesLabel = computed(() => cinturonesAbrochados.value ? 'Desabrochar' : 'Abrochar')

    // Hacer los valores principales computados para reactividad
    const isEngineOn = computed(() => vehicleStore.isEngineOn)
    const batteryLevel = computed(() => vehicleStore.batteryLevel)
    const batteryStatus = computed(() => vehicleStore.batteryStatus)
    const range = computed(() => vehicleStore.range)

    onMounted(() => {
      mqttService.subscribe('/MedidorDeBateria', (payload) => {
        // Se asume que el payload tiene la propiedad 'voltaje' o es el valor directamente
        let voltaje = payload?.voltaje ?? payload
        if (typeof voltaje === 'object') voltaje = JSON.stringify(voltaje)
        batteryVoltage.value = voltaje
      })
      mqttService.subscribe('/Velocidad', (payload) => {
        let velocidad = payload?.velocidad ?? payload
        if (typeof velocidad === 'object') velocidad = JSON.stringify(velocidad)
        vehicleSpeed.value = velocidad
      })
    })

    return {
      isEngineOn,
      batteryLevel,
      batteryStatus,
      range,
      toggleEngine,
      puertasAbiertas,
      togglePuertas,
      puertasLabel,
      cinturonesAbrochados,
      toggleCinturones,
      cinturonesLabel,
      batteryVoltage,
      vehicleSpeed
    }
  }
}
</script>
<style scoped>
.coche-view { padding: 2rem; }
.status-grid { display: flex; gap: 2rem; flex-wrap: wrap; }
.status-card { background: #fff; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); padding: 1.5rem; min-width: 250px; flex: 1; }
.status-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; }
.status-header i { font-size: 1.5rem; }
.status-content { margin-bottom: 1rem; }
.status-item { display: flex; justify-content: space-between; margin-bottom: 0.5rem; }
.label { font-weight: 500; }
.value { font-weight: 700; }
.actions { display: flex; gap: 1rem; }
.action-button { padding: 0.5rem 1.2rem; border: none; border-radius: 5px; background: #1976d2; color: #fff; cursor: pointer; font-weight: 600; transition: background 0.2s; }
.action-button.active { background: #388e3c; }
.action-button:disabled { background: #ccc; cursor: not-allowed; }
</style> 