<template>
  <div class="coche-view">
    <h2>Control del Vehículo</h2>
    
    <div class="status-grid">
      <!-- Estado General -->
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
            <span class="label">Batería:</span>
            <span class="value" :class="batteryStatus">
              {{ batteryLevel }}%
            </span>
          </div>
          <div class="status-item">
            <span class="label">Autonomía:</span>
            <span class="value">{{ range }} km</span>
          </div>
          <div class="status-item">
            <span class="label">Velocidad:</span>
            <span class="value">{{ Math.round(motorPerformance.speed) }} km/h</span>
          </div>
          <div class="status-item">
            <span class="label">Odómetro:</span>
            <span class="value">{{ motorPerformance.odometer.toFixed(1) }} km</span>
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
          <button 
            class="action-button secondary"
            @click="soundHorn"
            :disabled="batteryLevel <= 0"
          >
            <i class="fas fa-bullhorn"></i> Bocina
          </button>
        </div>
      </div>

      <!-- Puertas -->
      <div class="status-card">
        <div class="status-header">
          <i class="fas fa-door-closed"></i>
          <h3>Control de Puertas</h3>
        </div>
        <div class="doors-grid">
          <div 
            v-for="(door, key) in doors" 
            :key="key"
            class="door-item"
            :class="{ 'locked': door.locked, 'open': door.open }"
          >
            <div class="door-icon">
              <i :class="getDoorIcon(key)"></i>
            </div>
            <div class="door-controls">
              <button 
                class="door-button"
                @click="toggleDoorLock(key)"
                :class="{ 'active': door.locked }"
              >
                <i class="fas" :class="door.locked ? 'fa-lock' : 'fa-unlock'"></i>
              </button>
              <button 
                class="door-button"
                @click="toggleDoor(key)"
                :disabled="door.locked"
                :class="{ 'active': door.open }"
              >
                <i class="fas" :class="door.open ? 'fa-door-open' : 'fa-door-closed'"></i>
              </button>
            </div>
          </div>
        </div>
        <div class="actions">
          <button 
            class="action-button"
            @click="allDoorsLocked ? unlockAllDoors() : lockAllDoors()"
          >
            {{ allDoorsLocked ? 'Desbloquear Todas' : 'Bloquear Todas' }}
          </button>
        </div>
      </div>

      <!-- Cinturones -->
      <div class="status-card">
        <div class="status-header">
          <i class="fas fa-user-shield"></i>
          <h3>Cinturones de Seguridad</h3>
        </div>
        <div class="seatbelts-grid">
          <div 
            v-for="(belt, key) in seatbelts" 
            :key="key"
            class="seatbelt-item"
            :class="{ 'active': belt }"
          >
            <div class="seatbelt-icon">
              <i class="fas" :class="belt ? 'fa-user-check' : 'fa-user-times'"></i>
            </div>
            <div class="seatbelt-label">
              {{ getSeatbeltLabel(key) }}
            </div>
            <button 
              class="seatbelt-button"
              @click="toggleSeatbelt(key)"
              :class="{ 'active': belt }"
            >
              {{ belt ? 'Desabrochar' : 'Abrochar' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Ventanas -->
      <div class="status-card">
        <div class="status-header">
          <i class="fas fa-window-maximize"></i>
          <h3>Control de Ventanas</h3>
        </div>
        <div class="windows-grid">
          <div 
            v-for="(window, key) in windows" 
            :key="key"
            class="window-item"
          >
            <div class="window-label">
              {{ getWindowLabel(key) }}
            </div>
            <div class="window-controls">
              <button 
                class="window-button"
                @click="controlWindow(key, 'up')"
                :disabled="window >= 100"
              >
                <i class="fas fa-chevron-up"></i>
              </button>
              <div class="window-progress">
                <div 
                  class="window-progress-bar"
                  :style="{ height: `${window}%` }"
                ></div>
              </div>
              <button 
                class="window-button"
                @click="controlWindow(key, 'down')"
                :disabled="window <= 0"
              >
                <i class="fas fa-chevron-down"></i>
              </button>
            </div>
          </div>
        </div>
        <div class="actions">
          <button 
            class="action-button"
            @click="controlAllWindows('up')"
            :disabled="allWindowsClosed"
          >
            Subir Todas
          </button>
          <button 
            class="action-button"
            @click="controlAllWindows('down')"
            :disabled="allWindowsClosed"
          >
            Bajar Todas
          </button>
        </div>
      </div>

      <!-- Luces -->
      <div class="status-card">
        <div class="status-header">
          <i class="fas fa-lightbulb"></i>
          <h3>Control de Luces</h3>
        </div>
        <div class="lights-grid">
          <div 
            v-for="(light, key) in lights" 
            :key="key"
            class="light-item"
            :class="{ 'active': light }"
          >
            <div class="light-info">
              <div class="light-icon">
                <i :class="getLightIcon(key)"></i>
              </div>
              <div class="light-label">
                {{ getLightLabel(key) }}
              </div>
            </div>
            <div class="light-controls">
              <button 
                class="light-button"
                @click="toggleLight(key)"
                :class="{ 'active': light }"
              >
                {{ light ? 'Apagar' : 'Encender' }}
              </button>
            </div>
          </div>
        </div>
        <div class="actions">
          <button 
            class="action-button"
            @click="toggleHazardLights"
            :class="{ 'active': hazardLights }"
          >
            {{ hazardLights ? 'Apagar Balizas' : 'Encender Balizas' }}
          </button>
        </div>
      </div>

      <!-- Panel de Instrumentos -->
      <div class="dashboard-panel">
        <!-- Velocímetro -->
        <div class="gauge-container speedometer">
          <svg viewBox="0 0 200 200">
            <!-- Fondo del velocímetro -->
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="var(--border-color)"
              stroke-width="4"
            />
            <!-- Arco del velocímetro -->
            <path
              :d="describeArc(100, 100, 90, -120, calculateSpeedAngle())"
              fill="none"
              stroke="var(--primary-color)"
              stroke-width="4"
              class="speed-arc"
            />
            <!-- Marcas de velocidad -->
            <g v-for="n in 13" :key="n">
              <line
                :x1="100 + 75 * Math.cos((n - 1) * 20 * Math.PI / 180 - 120 * Math.PI / 180)"
                :y1="100 + 75 * Math.sin((n - 1) * 20 * Math.PI / 180 - 120 * Math.PI / 180)"
                :x2="100 + 85 * Math.cos((n - 1) * 20 * Math.PI / 180 - 120 * Math.PI / 180)"
                :y2="100 + 85 * Math.sin((n - 1) * 20 * Math.PI / 180 - 120 * Math.PI / 180)"
                stroke="var(--text-color)"
                stroke-width="2"
              />
              <text
                :x="100 + 65 * Math.cos((n - 1) * 20 * Math.PI / 180 - 120 * Math.PI / 180)"
                :y="100 + 65 * Math.sin((n - 1) * 20 * Math.PI / 180 - 120 * Math.PI / 180)"
                text-anchor="middle"
                dominant-baseline="middle"
                fill="var(--text-color)"
                font-size="10"
              >
                {{ (n - 1) * 10 }}
              </text>
            </g>
            <!-- Valor de velocidad -->
            <text
              x="100"
              y="130"
              text-anchor="middle"
              fill="var(--text-color)"
              font-size="24"
              font-weight="bold"
            >
              {{ Math.round(motorPerformance.speed) }}
            </text>
            <text
              x="100"
              y="150"
              text-anchor="middle"
              fill="var(--text-color-light)"
              font-size="12"
            >
              km/h
            </text>
          </svg>
        </div>

        <!-- Odómetro -->
        <div class="gauge-container odometer">
          <svg viewBox="0 0 200 200">
            <!-- Fondo del odómetro -->
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="var(--border-color)"
              stroke-width="4"
            />
            <!-- Valor del odómetro -->
            <text
              x="100"
              y="85"
              text-anchor="middle"
              fill="var(--text-color)"
              font-size="24"
              font-weight="bold"
            >
              {{ Math.floor(motorPerformance.odometer) }}
            </text>
            <text
              x="100"
              y="105"
              text-anchor="middle"
              fill="var(--text-color-light)"
              font-size="12"
            >
              kilómetros
            </text>
            <!-- Decimales -->
            <text
              x="100"
              y="130"
              text-anchor="middle"
              fill="var(--text-color)"
              font-size="18"
              font-family="monospace"
            >
              {{ (motorPerformance.odometer % 1).toFixed(1).substring(1) }}
            </text>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useVehicleStore } from '@/store/vehicle'

export default {
  name: 'CocheView',
  setup() {
    const vehicleStore = useVehicleStore()

    const getDoorIcon = (key) => {
      const icons = {
        frontLeft: 'fa-car-side',
        frontRight: 'fa-car-side fa-flip-horizontal',
        rearLeft: 'fa-car-side',
        rearRight: 'fa-car-side fa-flip-horizontal',
        trunk: 'fa-box'
      }
      return icons[key]
    }

    const getSeatbeltLabel = (key) => {
      const labels = {
        driver: 'Conductor',
        passenger: 'Acompañante',
        rearLeft: 'Trasero Izquierdo',
        rearRight: 'Trasero Derecho'
      }
      return labels[key]
    }

    const getWindowLabel = (key) => {
      const labels = {
        frontLeft: 'Delantera Izquierda',
        frontRight: 'Delantera Derecha',
        rearLeft: 'Trasera Izquierda',
        rearRight: 'Trasera Derecha'
      }
      return labels[key]
    }

    const getLightIcon = (key) => {
      const icons = {
        front: 'fa-lightbulb',
        rear: 'fa-lightbulb',
        interior: 'fa-lightbulb'
      }
      return icons[key]
    }

    const getLightLabel = (key) => {
      const labels = {
        front: 'Luces Delanteras',
        rear: 'Luces Traseras',
        interior: 'Luz Interior'
      }
      return labels[key]
    }

    const describeArc = (x, y, radius, startAngle, endAngle) => {
      const start = polarToCartesian(x, y, radius, endAngle)
      const end = polarToCartesian(x, y, radius, startAngle)
      const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"
      return [
        "M", start.x, start.y,
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
      ].join(" ")
    }

    const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
      const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0
      return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
      }
    }

    const calculateSpeedAngle = () => {
      // Mapear la velocidad (0-120) a un ángulo (-120 a 120)
      const speed = Math.round(vehicleStore.motorPerformance.speed)
      return -120 + (speed / 120) * 240
    }

    return {
      // Estado
      isEngineOn: computed(() => vehicleStore.isEngineOn),
      batteryLevel: computed(() => vehicleStore.batteryLevel),
      batteryStatus: computed(() => vehicleStore.batteryStatus),
      range: computed(() => vehicleStore.range),
      motorPerformance: computed(() => vehicleStore.motorPerformance),
      doors: computed(() => vehicleStore.doors),
      seatbelts: computed(() => vehicleStore.seatbelts),
      windows: computed(() => vehicleStore.windows),
      lights: computed(() => vehicleStore.lights),
      hazardLights: computed(() => vehicleStore.hazardLights),
      allDoorsLocked: computed(() => vehicleStore.allDoorsLocked),
      allWindowsClosed: computed(() => vehicleStore.allWindowsClosed),

      // Métodos
      toggleEngine: vehicleStore.toggleEngine,
      soundHorn: vehicleStore.soundHorn,
      toggleDoor: vehicleStore.toggleDoor,
      toggleDoorLock: vehicleStore.toggleDoorLock,
      lockAllDoors: vehicleStore.lockAllDoors,
      unlockAllDoors: vehicleStore.unlockAllDoors,
      toggleSeatbelt: vehicleStore.toggleSeatbelt,
      controlWindow: vehicleStore.controlWindow,
      controlAllWindows: vehicleStore.controlAllWindows,
      toggleLight: vehicleStore.toggleLight,
      toggleHazardLights: vehicleStore.toggleHazardLights,

      // Helpers
      getDoorIcon,
      getSeatbeltLabel,
      getWindowLabel,
      getLightIcon,
      getLightLabel,
      describeArc,
      calculateSpeedAngle
    }
  }
}
</script>

<style scoped>
.coche-view {
  padding: 1rem;
}

h2 {
  color: var(--text-color);
  margin-bottom: 2rem;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
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
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.action-button {
  flex: 1;
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

.action-button.secondary {
  background-color: var(--bg-color);
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

.action-button.secondary:hover {
  background-color: var(--border-color);
}

/* Puertas */
.doors-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.door-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
}

.door-item.locked {
  opacity: 0.7;
}

.door-item.open {
  border-color: var(--primary-color);
}

.door-icon {
  font-size: 2rem;
  color: var(--text-color);
}

.door-controls {
  display: flex;
  gap: 0.5rem;
}

.door-button {
  padding: 0.5rem;
  background-color: var(--bg-color);
  color: var(--text-color);
  border: 1px solid var(--border-color);
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all var(--transition-speed);
}

.door-button:hover:not(:disabled) {
  background-color: var(--border-color);
}

.door-button.active {
  background-color: var(--primary-color);
  color: var(--bg-color);
  border-color: var(--primary-color);
}

.door-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Cinturones */
.seatbelts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.seatbelt-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
}

.seatbelt-item.active {
  border-color: #44ff44;
}

.seatbelt-icon {
  font-size: 1.5rem;
  color: var(--text-color);
}

.seatbelt-item.active .seatbelt-icon {
  color: #44ff44;
}

.seatbelt-label {
  color: var(--text-color);
  font-weight: 500;
}

.seatbelt-button {
  padding: 0.5rem 1rem;
  background-color: var(--bg-color);
  color: var(--text-color);
  border: 1px solid var(--border-color);
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all var(--transition-speed);
}

.seatbelt-button:hover {
  background-color: var(--border-color);
}

.seatbelt-button.active {
  background-color: #44ff44;
  color: var(--bg-color);
  border-color: #44ff44;
}

/* Ventanas */
.windows-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.window-item {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
}

.window-label {
  color: var(--text-color);
  font-weight: 500;
  text-align: left;
}

.window-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-self: end;
}

.window-button {
  padding: 0.5rem;
  background-color: var(--bg-color);
  color: var(--text-color);
  border: 1px solid var(--border-color);
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all var(--transition-speed);
}

.window-button:hover:not(:disabled) {
  background-color: var(--border-color);
}

.window-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.window-progress {
  width: 30px;
  height: 100px;
  background-color: var(--border-color);
  border-radius: 0.25rem;
  position: relative;
  overflow: hidden;
}

.window-progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: var(--primary-color);
  transition: height 0.3s ease;
}

/* Luces */
.lights-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.light-item {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
}

.light-item.active {
  border-color: var(--primary-color);
}

.light-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.light-icon {
  font-size: 1.5rem;
  color: var(--text-color);
  min-width: 2rem;
  text-align: center;
}

.light-item.active .light-icon {
  color: var(--primary-color);
}

.light-label {
  color: var(--text-color);
  font-weight: 500;
  text-align: left;
}

.light-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-self: end;
}

.light-button {
  padding: 0.5rem 1rem;
  background-color: var(--bg-color);
  color: var(--text-color);
  border: 1px solid var(--border-color);
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all var(--transition-speed);
}

.light-button:hover {
  background-color: var(--border-color);
}

.light-button.active {
  background-color: var(--primary-color);
  color: var(--bg-color);
  border-color: var(--primary-color);
}

.dashboard-panel {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 2rem 0;
  gap: 1rem;
  padding: 1rem;
  background-color: var(--bg-color);
  border-radius: 1rem;
  border: 1px solid var(--border-color);
}

.gauge-container {
  width: 200px;
  height: 200px;
}

.speedometer .speed-arc {
  transition: all 0.3s ease;
}

.odometer {
  position: relative;
}

@media (max-width: 768px) {
  .status-grid {
    grid-template-columns: 1fr;
  }

  .window-item, .light-item {
    grid-template-columns: 1fr;
    justify-items: center;
    text-align: center;
  }

  .window-controls, .light-controls {
    justify-self: center;
  }

  .dashboard-panel {
    flex-direction: column;
  }

  .gauge-container {
    width: 150px;
    height: 150px;
  }
}
</style> 