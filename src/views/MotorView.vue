<template>
  <div class="motor-view">
    <h2>Control del Motor</h2>

    <div class="status-grid">
      <div class="status-card">
        <div class="status-header">
          <i class="fas fa-power-off"></i>
          <h3>Estado del Motor</h3>
        </div>
        <div class="status-content">
          <div class="status-item">
            <span class="label">Estado:</span>
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

      <div class="status-card">
        <div class="status-header">
          <i class="fas fa-thermometer-half"></i>
          <h3>Temperatura</h3>
        </div>
        <div class="gauge-container">
          <div class="gauge">
            <div class="gauge-value" :style="{ transform: `rotate(${temperatureRotation}deg)` }"></div>
            <div class="gauge-center">
              {{ motorPerformance.temperature.toFixed(1) }}°C
            </div>
          </div>
          <div class="gauge-labels">
            <span>0°C</span>
            <span>50°C</span>
            <span>100°C</span>
          </div>
        </div>
      </div>

      <div class="status-card">
        <div class="status-header">
          <i class="fas fa-tachometer-alt"></i>
          <h3>RPM</h3>
        </div>
        <div class="gauge-container">
          <div class="gauge">
            <div class="gauge-value" :style="{ transform: `rotate(${rpmRotation}deg)` }"></div>
            <div class="gauge-center">
              {{ Math.round(motorPerformance.rpm) }}
            </div>
          </div>
          <div class="gauge-labels">
            <span>0</span>
            <span>2000</span>
            <span>4000</span>
          </div>
        </div>
      </div>

      <div class="status-card">
        <div class="status-header">
          <i class="fas fa-bolt"></i>
          <h3>Potencia</h3>
        </div>
        <div class="gauge-container">
          <div class="gauge">
            <div class="gauge-value" :style="{ transform: `rotate(${powerRotation}deg)` }"></div>
            <div class="gauge-center">
              {{ Math.round(motorPerformance.power) }}kW
            </div>
          </div>
          <div class="gauge-labels">
            <span>0kW</span>
            <span>50kW</span>
            <span>100kW</span>
          </div>
        </div>
      </div>
    </div>

    <div class="chart-container">
      <h3>Rendimiento en Tiempo Real</h3>
      <canvas ref="performanceChart"></canvas>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref, watch } from 'vue'
import { useVehicleStore } from '@/store/vehicle'
import Chart from 'chart.js/auto'
import { mqttService } from '@/services/mqtt'

export default {
  name: 'MotorView',
  setup() {
    const vehicleStore = useVehicleStore()
    const performanceChart = ref(null)
    let chartInstance = null

    const isEngineOn = computed(() => vehicleStore.isEngineOn)
    const batteryLevel = computed(() => vehicleStore.batteryLevel)
    const batteryStatus = computed(() => vehicleStore.batteryStatus)
    const range = computed(() => vehicleStore.range)
    const motorPerformance = computed(() => vehicleStore.motorPerformance)

    // NUEVO: variables reactivas para voltaje y velocidad
    const batteryVoltage = ref('---')
    const vehicleSpeed = ref('---')

    onMounted(() => {
      mqttService.subscribe('/MedidorDeBateria', (payload) => {
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

    // Cálculos para los medidores
    const temperatureRotation = computed(() => {
      return (motorPerformance.value.temperature / 100) * 180 - 90
    })

    const rpmRotation = computed(() => {
      return (motorPerformance.value.rpm / 4000) * 180 - 90
    })

    const powerRotation = computed(() => {
      return (motorPerformance.value.power / 100) * 180 - 90
    })

    const updateChart = () => {
      if (!chartInstance) return

      chartInstance.data.labels = motorPerformance.value.history.map(h => 
        new Date(h.timestamp).toLocaleTimeString()
      )
      chartInstance.data.datasets[0].data = motorPerformance.value.history.map(h => h.temperature)
      chartInstance.data.datasets[1].data = motorPerformance.value.history.map(h => h.rpm)
      chartInstance.data.datasets[2].data = motorPerformance.value.history.map(h => h.power)
      chartInstance.update()
    }

    const initChart = () => {
      if (chartInstance) chartInstance.destroy()

      chartInstance = new Chart(performanceChart.value, {
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

    watch(() => motorPerformance.value.history, updateChart, { deep: true })

    onMounted(() => {
      initChart()
    })

    const toggleEngine = () => {
      vehicleStore.setEngineState(!vehicleStore.isEngineOn)
    }

    return {
      isEngineOn,
      batteryLevel,
      batteryStatus,
      range,
      motorPerformance,
      toggleEngine,
      temperatureRotation,
      rpmRotation,
      powerRotation,
      performanceChart,
      batteryVoltage,
      vehicleSpeed
    }
  }
}
</script>

<style scoped>
.motor-view {
  padding: 1rem;
}

h2 {
  color: var(--text-color);
  margin-bottom: 2rem;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.status-card {
  background-color: var(--bg-secondary);
  border-radius: 1rem;
  padding: 1.5rem;
  border: 1px solid var(--border-color);
}

.status-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.status-header i {
  font-size: 1.5rem;
  color: var(--primary-color);
}

.status-header h3 {
  color: var(--text-color);
  margin: 0;
}

.status-content {
  margin-bottom: 1.5rem;
}

.status-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border-color);
}

.status-item:last-child {
  border-bottom: none;
}

.label {
  color: var(--text-color-light);
}

.value {
  color: var(--text-color);
  font-weight: 500;
}

.value.active {
  color: #44ff44;
}

.value.excelente {
  color: #44ff44;
}

.value.bueno {
  color: #44ff44;
}

.value.bajo {
  color: #ffaa00;
}

.value.crítico {
  color: #ff4444;
}

.actions {
  margin-top: 1.5rem;
}

.action-button {
  width: 100%;
  padding: 0.75rem;
  background-color: var(--primary-color);
  color: var(--bg-color);
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color var(--transition-speed);
}

.action-button:hover:not(:disabled) {
  background-color: var(--primary-hover);
}

.action-button:disabled {
  background-color: var(--border-color);
  cursor: not-allowed;
}

.action-button.active {
  background-color: #ff4444;
}

.action-button.active:hover {
  background-color: #cc3333;
}

.gauge-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 0;
}

.gauge {
  width: 150px;
  height: 150px;
  position: relative;
  border-radius: 50%;
  background-color: var(--border-color);
  overflow: hidden;
}

.gauge::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80%;
  height: 80%;
  background-color: var(--bg-secondary);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
}

.gauge-value {
  position: absolute;
  width: 50%;
  height: 100%;
  background-color: var(--primary-color);
  transform-origin: 100% 50%;
  transition: transform 0.3s ease;
}

.gauge-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  font-weight: 500;
  color: var(--text-color);
}

.gauge-labels {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 0.5rem;
  color: var(--text-color-light);
  font-size: 0.875rem;
}

.chart-container {
  background-color: var(--bg-secondary);
  border-radius: 1rem;
  padding: 1.5rem;
  border: 1px solid var(--border-color);
  margin-top: 2rem;
  height: 400px;
  overflow: hidden;
}

.chart-container h3 {
  color: var(--text-color);
  margin-bottom: 1rem;
}

canvas {
  width: 100% !important;
  height: 300px !important;
}

@media (max-width: 768px) {
  .status-grid {
    grid-template-columns: 1fr;
  }
}
</style> 