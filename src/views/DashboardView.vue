<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h2>Tablero Principal</h2>
      <p>Bienvenido, {{ user?.name }}</p>
    </div>

    <div class="dashboard-grid">
      <div class="dashboard-card">
        <div class="card-icon">
          <i class="fas fa-car"></i>
        </div>
        <div class="card-content">
          <h3>Estado del Vehículo</h3>
          <p>Batería: {{ batteryLevel }}% ({{ batteryStatus }})</p>
          <p>Autonomía: {{ range }} km</p>
          <button 
            class="action-button" 
            :class="{ 'active': isEngineOn }"
            @click="toggleEngine"
            :disabled="batteryLevel <= 0"
          >
            {{ isEngineOn ? 'Apagar Motor' : 'Encender Motor' }}
          </button>
        </div>
      </div>

      <div class="dashboard-card">
        <div class="card-icon">
          <i class="fas fa-bolt"></i>
        </div>
        <div class="card-content">
          <h3>Consumo Energético</h3>
          <p>Consumo actual: {{ energyConsumption.current }} kWh/100km</p>
          <p>Promedio mensual: {{ energyConsumption.average }} kWh/100km</p>
          <button class="action-button" @click="chargeBattery(10)">
            Cargar Batería (+10%)
          </button>
        </div>
      </div>

      <div class="dashboard-card">
        <div class="card-icon">
          <i class="fas fa-map-marker-alt"></i>
        </div>
        <div class="card-content">
          <h3>Última Ubicación</h3>
          <SimpleMap />
          <p>Última actualización: {{ formatTime(location.lastUpdate) }}</p>
          <p>Estado: {{ isEngineOn ? 'En movimiento' : 'Estacionado' }}</p>
          <p>Coordenadas: {{ location.lat.toFixed(6) }}, {{ location.lng.toFixed(6) }}</p>
        </div>
      </div>

      <div class="dashboard-card">
        <div class="card-icon">
          <i class="fas fa-tools"></i>
        </div>
        <div class="card-content">
          <h3>Mantenimiento</h3>
          <p>Próximo servicio: {{ maintenance.nextService }} km</p>
          <p>Estado: {{ maintenance.status }}</p>
        </div>
      </div>

      <div class="dashboard-card">
        <div class="card-icon">
          <i class="fas fa-share-alt"></i>
        </div>
        <div class="card-content">
          <h3>Compartir Estado</h3>
          <ShareButtons />
        </div>
      </div>
    </div>

    <div class="dashboard-charts">
      <div class="chart-container">
        <h3>Consumo de Energía</h3>
        <div class="chart-placeholder">
          <canvas ref="energyChart"></canvas>
        </div>
      </div>

      <div class="chart-container">
        <h3>Rendimiento del Motor</h3>
        <div class="chart-placeholder">
          <canvas ref="motorChart"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref, watch } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useVehicleStore } from '@/store/vehicle'
import Chart from 'chart.js/auto'
import SimpleMap from '@/components/SimpleMap.vue'
import ShareButtons from '@/components/ShareButtons.vue'

export default {
  name: 'DashboardView',
  components: {
    SimpleMap,
    ShareButtons
  },
  setup() {
    const authStore = useAuthStore()
    const vehicleStore = useVehicleStore()
    const energyChart = ref(null)
    const motorChart = ref(null)
    let energyChartInstance = null
    let motorChartInstance = null

    const user = computed(() => authStore.user)
    const batteryLevel = computed(() => vehicleStore.batteryLevel)
    const batteryStatus = computed(() => vehicleStore.batteryStatus)
    const range = computed(() => vehicleStore.range)
    const isEngineOn = computed(() => vehicleStore.isEngineOn)
    const energyConsumption = computed(() => vehicleStore.energyConsumption)
    const location = computed(() => vehicleStore.location)
    const maintenance = computed(() => vehicleStore.maintenance)
    const motorPerformance = computed(() => vehicleStore.motorPerformance)

    const toggleEngine = () => {
      vehicleStore.toggleEngine()
    }

    const chargeBattery = (amount) => {
      vehicleStore.chargeBattery(amount)
    }

    const formatTime = (date) => {
      return new Date(date).toLocaleTimeString()
    }

    const updateEnergyChart = () => {
      if (!energyChartInstance) return

      energyChartInstance.data.labels = energyConsumption.value.history.map(h => 
        new Date(h.timestamp).toLocaleTimeString()
      )
      energyChartInstance.data.datasets[0].data = energyConsumption.value.history.map(h => h.consumption)
      energyChartInstance.update()
    }

    const updateMotorChart = () => {
      if (!motorChartInstance) return

      motorChartInstance.data.labels = motorPerformance.value.history.map(h => 
        new Date(h.timestamp).toLocaleTimeString()
      )
      motorChartInstance.data.datasets[0].data = motorPerformance.value.history.map(h => h.temperature)
      motorChartInstance.data.datasets[1].data = motorPerformance.value.history.map(h => h.rpm)
      motorChartInstance.data.datasets[2].data = motorPerformance.value.history.map(h => h.power)
      motorChartInstance.update()
    }

    const initCharts = () => {
      // Destruir gráficos existentes si los hay
      if (energyChartInstance) energyChartInstance.destroy()
      if (motorChartInstance) motorChartInstance.destroy()

      // Gráfico de consumo de energía
      energyChartInstance = new Chart(energyChart.value, {
        type: 'line',
        data: {
          labels: [],
          datasets: [{
            label: 'Consumo (kWh/100km)',
            data: [],
            borderColor: '#0044cc',
            tension: 0.1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 0
          }
        }
      })

      // Gráfico de rendimiento del motor
      motorChartInstance = new Chart(motorChart.value, {
        type: 'line',
        data: {
          labels: [],
          datasets: [
            {
              label: 'Temperatura (°C)',
              data: [],
              borderColor: '#ff4444',
              tension: 0.1
            },
            {
              label: 'RPM',
              data: [],
              borderColor: '#44ff44',
              tension: 0.1,
              yAxisID: 'rpm'
            },
            {
              label: 'Potencia (kW)',
              data: [],
              borderColor: '#4444ff',
              tension: 0.1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 0
          },
          scales: {
            rpm: {
              type: 'linear',
              position: 'right',
              min: 0,
              max: 4000
            }
          }
        }
      })
    }

    // Observar cambios en los datos para actualizar los gráficos
    watch(() => energyConsumption.value.history, updateEnergyChart, { deep: true })
    watch(() => motorPerformance.value.history, updateMotorChart, { deep: true })

    onMounted(() => {
      vehicleStore.startSimulation()
      initCharts()
    })

    return {
      user,
      batteryLevel,
      batteryStatus,
      range,
      isEngineOn,
      energyConsumption,
      location,
      maintenance,
      toggleEngine,
      chargeBattery,
      formatTime,
      energyChart,
      motorChart
    }
  }
}
</script>

<style scoped>
.dashboard {
  padding: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-header {
  margin-bottom: 2rem;
}

.dashboard-header h2 {
  color: var(--text-color);
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
}

.dashboard-header p {
  color: var(--text-color-light);
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.dashboard-card {
  background-color: var(--bg-secondary);
  border-radius: 0.75rem;
  padding: 1.25rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--border-color);
  height: fit-content;
}

.card-icon {
  background-color: var(--primary-color);
  color: white;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  margin-bottom: 1rem;
}

.card-content {
  width: 100%;
}

.card-content h3 {
  color: var(--text-color);
  margin-bottom: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
}

.card-content p {
  color: var(--text-color-light);
  font-size: 0.9rem;
  margin: 0.5rem 0;
  line-height: 1.4;
}

/* Ajustes específicos para la tarjeta del mapa */
.dashboard-card:nth-child(3) {
  grid-row: span 2;
}

/* Ajustes para los botones */
.action-button {
  width: 100%;
  padding: 0.75rem;
  margin-top: 1rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;
}

.action-button:hover {
  background-color: var(--primary-hover);
  transform: translateY(-2px);
}

.action-button:disabled {
  background-color: var(--border-color);
  cursor: not-allowed;
}

.action-button.active {
  background-color: #dc3545;
}

.action-button.active:hover {
  background-color: #c82333;
}

/* Ajustes para los gráficos */
.dashboard-charts {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-top: 2rem;
}

.chart-container {
  background-color: var(--bg-secondary);
  border-radius: 0.75rem;
  padding: 1.25rem;
  border: 1px solid var(--border-color);
}

.chart-container h3 {
  color: var(--text-color);
  margin-bottom: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
}

.chart-placeholder {
  height: 250px;
  width: 100%;
}

/* Responsive */
@media (max-width: 1200px) {
  .dashboard-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .dashboard-card:nth-child(3) {
    grid-column: span 2;
    grid-row: auto;
  }
}

@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  
  .dashboard-card:nth-child(3) {
    grid-column: auto;
  }
  
  .dashboard-charts {
    grid-template-columns: 1fr;
  }
  
  .chart-placeholder {
    height: 200px;
  }
}
</style> 