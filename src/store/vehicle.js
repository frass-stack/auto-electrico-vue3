import { defineStore } from 'pinia'
import { ref, computed, onUnmounted, watch } from 'vue'
import { playHorn, startEngineSound, stopEngineSound, updateEngineSound } from '@/utils/sounds'
import { mqttService } from '@/services/mqtt'

export const useVehicleStore = defineStore('vehicle', () => {
  // Estado básico
  const batteryLevel = ref(80)
  const isEngineOn = ref(false)
  const lights = ref({
    front: false,
    rear: false,
    interior: false
  })
  const location = ref({
    lat: 40.4168,
    lng: -3.7038,
    lastUpdate: new Date()
  })
  const maintenance = ref({
    nextService: 5000,
    status: 'excelente'
  })
  const energyConsumption = ref({
    current: 0,
    average: 15,
    history: []
  })
  const motorPerformance = ref({
    temperature: 25,
    rpm: 0,
    power: 0,
    speed: 0,
    odometer: 0,
    history: []
  })

  // Nuevos estados de seguridad
  const doors = ref({
    frontLeft: { locked: true, open: false },
    frontRight: { locked: true, open: false },
    rearLeft: { locked: true, open: false },
    rearRight: { locked: true, open: false },
    trunk: { locked: true, open: false }
  })

  const seatbelts = ref({
    driver: false,
    passenger: false,
    rearLeft: false,
    rearRight: false
  })

  const windows = ref({
    frontLeft: 0,
    frontRight: 0,
    rearLeft: 0,
    rearRight: 0
  })

  const hazardLights = ref(false)
  const horn = ref(false)

  // Computed properties
  const batteryStatus = computed(() => {
    if (batteryLevel.value >= 80) return 'excelente'
    if (batteryLevel.value >= 50) return 'bueno'
    if (batteryLevel.value >= 20) return 'bajo'
    return 'crítico'
  })

  const range = computed(() => {
    return Math.round((batteryLevel.value / 100) * 400)
  })

  const allDoorsLocked = computed(() => {
    return Object.values(doors.value).every(door => door.locked)
  })

  const allSeatbeltsOn = computed(() => {
    return Object.values(seatbelts.value).every(belt => belt)
  })

  const allWindowsClosed = computed(() => {
    return Object.values(windows.value).every(window => window === 0)
  })

  // Acciones
  const toggleEngine = () => {
    if (batteryLevel.value <= 0) return
    isEngineOn.value = !isEngineOn.value
    if (isEngineOn.value) {
      startEngineSound()
      startSimulation()
    } else {
      stopEngineSound()
      stopSimulation()
    }
  }

  const toggleLight = (light) => {
    if (batteryLevel.value <= 0 || (!lights.value[light] && batteryLevel.value < 1)) {
      return false
    }
    lights.value[light] = !lights.value[light]
    return true
  }

  const toggleHazardLights = () => {
    if (batteryLevel.value <= 0 || (!hazardLights.value && batteryLevel.value < 2)) {
      return false
    }
    hazardLights.value = !hazardLights.value
    if (hazardLights.value) {
      lights.value.front = true
      lights.value.rear = true
    } else {
      lights.value.front = false
      lights.value.rear = false
    }
    return true
  }

  const toggleDoor = (door) => {
    if (doors.value[door].locked) return
    doors.value[door].open = !doors.value[door].open
  }

  const toggleDoorLock = (door) => {
    doors.value[door].locked = !doors.value[door].locked
  }

  const lockAllDoors = () => {
    Object.keys(doors.value).forEach(door => {
      doors.value[door].locked = true
    })
  }

  const unlockAllDoors = () => {
    Object.keys(doors.value).forEach(door => {
      doors.value[door].locked = false
    })
  }

  const toggleSeatbelt = (position) => {
    seatbelts.value[position] = !seatbelts.value[position]
  }

  const controlWindow = (window, direction) => {
    if (batteryLevel.value <= 0 || batteryLevel.value < 0.5) {
      return false
    }
    
    if (direction === 'up' && windows.value[window] < 100) {
      windows.value[window] += 10
      return true
    } else if (direction === 'down' && windows.value[window] > 0) {
      windows.value[window] -= 10
      return true
    }
    return false
  }

  const controlAllWindows = (direction) => {
    const windowCount = Object.keys(windows.value).length
    if (batteryLevel.value <= 0 || batteryLevel.value < (0.5 * windowCount)) {
      return false
    }
    
    let success = false
    Object.keys(windows.value).forEach(window => {
      if (controlWindow(window, direction)) {
        success = true
      }
    })
    return success
  }

  const soundHorn = () => {
    if (batteryLevel.value <= 0) return
    horn.value = true
    playHorn()
    setTimeout(() => {
      horn.value = false
    }, 1000)
  }

  const chargeBattery = () => {
    if (batteryLevel.value < 100) {
      batteryLevel.value = Math.min(100, batteryLevel.value + 1)
    }
  }

  let simulationInterval
  let batteryConsumptionInterval

  const startSimulation = () => {
    // Simulación del motor
    simulationInterval = setInterval(() => {
      if (isEngineOn.value) {
        motorPerformance.value.temperature = Math.min(100, motorPerformance.value.temperature + 0.1)
        motorPerformance.value.rpm = Math.min(4000, motorPerformance.value.rpm + 100)
        motorPerformance.value.power = Math.min(100, motorPerformance.value.power + 1)
        motorPerformance.value.speed = Math.min(120, (motorPerformance.value.rpm / 4000) * 120)
        motorPerformance.value.odometer += motorPerformance.value.speed / 3600
        
        updateEngineSound(motorPerformance.value.rpm)
      } else {
        motorPerformance.value.temperature = Math.max(25, motorPerformance.value.temperature - 0.1)
        motorPerformance.value.rpm = Math.max(0, motorPerformance.value.rpm - 100)
        motorPerformance.value.power = Math.max(0, motorPerformance.value.power - 1)
        motorPerformance.value.speed = Math.max(0, motorPerformance.value.speed - 5)
      }

      // Guardar historial
      const timestamp = new Date()
      motorPerformance.value.history.push({
        timestamp,
        temperature: motorPerformance.value.temperature,
        rpm: motorPerformance.value.rpm,
        power: motorPerformance.value.power
      })

      if (motorPerformance.value.history.length > 50) {
        motorPerformance.value.history.shift()
      }
    }, 1000)

    // Consumo de batería (siempre activo)
    batteryConsumptionInterval = setInterval(() => {
      if (batteryLevel.value > 0) {
        let totalConsumption = 0

        // Consumo del motor
        if (isEngineOn.value) {
          totalConsumption += 0.5
        }

        // Consumo de luces
        Object.values(lights.value).forEach(isOn => {
          if (isOn) {
            totalConsumption += 0.2
          }
        })

        // Consumo de balizas
        if (hazardLights.value) {
          totalConsumption += 0.3
        }

        // Consumo de ventanas
        Object.values(windows.value).forEach(position => {
          if (position > 0) {
            totalConsumption += 0.15
          }
        })

        // Aplicar consumo total
        batteryLevel.value = Math.max(0, batteryLevel.value - totalConsumption)

        // Si la batería se agota, apagar todo
        if (batteryLevel.value <= 0) {
          batteryLevel.value = 0
          
          if (isEngineOn.value) {
            isEngineOn.value = false
            stopEngineSound()
          }

          Object.keys(lights.value).forEach(light => {
            lights.value[light] = false
          })
          hazardLights.value = false

          Object.keys(windows.value).forEach(window => {
            windows.value[window] = 0
          })
        }
      }
    }, 1000)
  }

  const stopSimulation = () => {
    clearInterval(simulationInterval)
    clearInterval(batteryConsumptionInterval)
  }

  // Iniciar la simulación inmediatamente al crear el store
  startSimulation()

  // Limpiar los intervalos cuando se destruye el store
  onUnmounted(() => {
    stopSimulation()
  })

  // Publicar automáticamente el nivel de batería
  watch(batteryLevel, (nuevoNivel) => {
    mqttService.publishBatteryLevel(nuevoNivel)
  })

  // Publicar automáticamente el estado del motor
  watch(isEngineOn, (nuevoEstado) => {
    mqttService.publishMotorState({ running: nuevoEstado })
  })

  // Publicar automáticamente el estado de las luces
  watch(lights, (nuevasLuces) => {
    mqttService.publishLightsState(nuevasLuces)
  }, { deep: true })

  // Publicar automáticamente la ubicación
  watch(location, (nuevaUbicacion) => {
    mqttService.publishLocation(nuevaUbicacion.lat, nuevaUbicacion.lng)
  }, { deep: true })

  // Publicar automáticamente el estado de las puertas
  watch(doors, (nuevasPuertas) => {
    mqttService.publish('vehicle/doors', nuevasPuertas)
  }, { deep: true })

  // Publicar automáticamente el estado de los cinturones
  watch(seatbelts, (nuevosCinturones) => {
    mqttService.publish('vehicle/seatbelts', nuevosCinturones)
  }, { deep: true })

  // Publicar automáticamente el estado de las ventanas
  watch(windows, (nuevasVentanas) => {
    mqttService.publish('vehicle/windows', nuevasVentanas)
  }, { deep: true })

  // Publicar automáticamente el estado de las luces de emergencia
  watch(hazardLights, (nuevoEstado) => {
    mqttService.publish('vehicle/hazardLights', { hazard: nuevoEstado })
  })

  // Publicar automáticamente el estado de la bocina
  watch(horn, (nuevoEstado) => {
    mqttService.publish('vehicle/horn', { horn: nuevoEstado })
  })

  // Publicar automáticamente el rendimiento del motor
  watch(motorPerformance, (nuevoRendimiento) => {
    mqttService.publish('vehicle/motor/performance', nuevoRendimiento)
  }, { deep: true })

  // Publicar automáticamente el consumo energético
  watch(energyConsumption, (nuevoConsumo) => {
    mqttService.publish('vehicle/energy', nuevoConsumo)
  }, { deep: true })

  return {
    // Estado
    batteryLevel,
    isEngineOn,
    lights,
    location,
    maintenance,
    energyConsumption,
    motorPerformance,
    doors,
    seatbelts,
    windows,
    hazardLights,
    horn,

    // Computed
    batteryStatus,
    range,
    allDoorsLocked,
    allSeatbeltsOn,
    allWindowsClosed,

    // Acciones
    toggleEngine,
    toggleLight,
    toggleHazardLights,
    toggleDoor,
    toggleDoorLock,
    lockAllDoors,
    unlockAllDoors,
    toggleSeatbelt,
    controlWindow,
    controlAllWindows,
    soundHorn,
    chargeBattery,
    startSimulation,
    stopSimulation
  }
}) 