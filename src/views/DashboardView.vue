<template>
  <div class="dashboard-view">
    <h2>Resumen del Vehículo</h2>
    <div class="dashboard-card">
      <div class="dashboard-item">
        <span class="label">Autonomía:</span>
        <span class="value">{{ range }} km</span>
      </div>
      <div class="dashboard-item">
        <span class="label">Motor:</span>
        <span class="value">{{ isEngineOn ? 'Encendido' : 'Apagado' }}</span>
      </div>
    </div>
    <div class="dashboard-map">
      <h3>Ubicación actual</h3>
      <SimpleMap :lat="location.lat" :lng="location.lng" />
      <div class="map-info">
        <span>Lat: {{ location.lat.toFixed(6) }}, Lng: {{ location.lng.toFixed(6) }}</span>
        <span>Última actualización: {{ formatTime(location.lastUpdate) }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import { useVehicleStore } from '@/store/vehicle'
import SimpleMap from '@/components/SimpleMap.vue'
export default {
  name: 'DashboardView',
  components: { SimpleMap },
  setup() {
    const vehicleStore = useVehicleStore()
    const formatTime = (date) => new Date(date).toLocaleTimeString()
    return {
      batteryLevel: vehicleStore.batteryLevel,
      range: vehicleStore.range,
      isEngineOn: vehicleStore.isEngineOn,
      location: vehicleStore.location,
      formatTime
    }
  }
}
</script>
<style scoped>
.dashboard-view { padding: 2rem; }
.dashboard-card { background: #fff; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); padding: 2rem; max-width: 400px; margin: 0 auto 2rem auto; }
.dashboard-item { display: flex; justify-content: space-between; margin-bottom: 1rem; }
.label { font-weight: 500; }
.value { font-weight: 700; }
.dashboard-map { background: #fff; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); padding: 2rem; max-width: 600px; margin: 0 auto; }
.map-info { margin-top: 1rem; display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.95rem; color: #333; }
</style> 