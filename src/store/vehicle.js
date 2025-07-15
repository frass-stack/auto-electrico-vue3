import { defineStore } from 'pinia'
import { ref, computed, onUnmounted } from 'vue'
import { playHorn, startEngineSound, stopEngineSound, updateEngineSound } from '@/utils/sounds'
import { mqttService } from '@/services/mqtt'

export const useVehicleStore = defineStore('vehicle', () => {
  // Estado básico
  const batteryLevel = ref(10000)
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
  const puertasAbiertas = ref(false)
  const cinturonesAbrochados = ref(false)

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

  function setEngineState(encendido) {
    if (batteryLevel.value <= 0 && encendido) return
    isEngineOn.value = encendido
    if (encendido) {
      startEngineSound()
      startSimulation()
      mqttService.publish('/Vehiculo/Encender', { motor: true, timestamp: new Date().toISOString() })
    } else {
      stopEngineSound()
      stopSimulation()
      mqttService.publish('/Vehiculo/Apagar', { motor: false, timestamp: new Date().toISOString() })
    }
  }

  // Acciones
  const toggleEngine = () => {
    setEngineState(!isEngineOn.value)
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
    batteryConsumptionInterval = setInterval(() => {
      if (batteryLevel.value > 0) {
        let totalConsumption = 0
        if (isEngineOn.value) {
          totalConsumption += 0.5
        }
        Object.values(lights.value).forEach(isOn => {
          if (isOn) {
            totalConsumption += 0.2
          }
        })
        if (hazardLights.value) {
          totalConsumption += 0.3
        }
        Object.values(windows.value).forEach(position => {
          if (position > 0) {
            totalConsumption += 0.15
          }
        })
        batteryLevel.value = Math.max(0, batteryLevel.value - totalConsumption)
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
    }, 3000)
  }
  const stopSimulation = () => {
    clearInterval(simulationInterval)
    clearInterval(batteryConsumptionInterval)
  }
  startSimulation()
  onUnmounted(() => {
    stopSimulation()
  })

  // Acciones para recibir actualizaciones de los stores locales y publicar por MQTT
  function actualizarMotor(payload) {
    setEngineState(!!payload.encendido)
  }

  function actualizarLuces(payload) {
    // Sincronizar el estado local de luces para el consumo periódico
    if (payload.lucesAltasYBajas !== undefined) {
      lights.value.front = payload.lucesAltasYBajas
      lights.value.rear = payload.lucesAltasYBajas
    }
    if (payload.luzInterior !== undefined) {
      lights.value.interior = payload.luzInterior
    }
    if (payload.balizas !== undefined) {
      lights.value.balizas = payload.balizas
    }
    if (payload.reflector !== undefined) {
      lights.value.reflector = payload.reflector
    }
    // Publicar mensajes MQTT para cada luz
    if (payload.balizas !== undefined) {
      if (payload.balizas) {
        mqttService.publish('/Baliza/Prender', { baliza: true, timestamp: new Date().toISOString() })
      } else {
        mqttService.publish('/Baliza/Apagar', { baliza: false, timestamp: new Date().toISOString() })
      }
    }
    if (payload.lucesAltasYBajas !== undefined) {
      if (payload.lucesAltasYBajas) {
        mqttService.publish('/LuzBaja/Prender', { luzBaja: true, timestamp: new Date().toISOString() })
      } else {
        mqttService.publish('/LuzBaja/Apagar', { luzBaja: false, timestamp: new Date().toISOString() })
      }
    }
    if (payload.luzInterior !== undefined) {
      if (payload.luzInterior) {
        mqttService.publish('/LuzInterior/Prender', { luzInterior: true, timestamp: new Date().toISOString() })
      } else {
        mqttService.publish('/LuzInterior/Apagar', { luzInterior: false, timestamp: new Date().toISOString() })
      }
    }
    if (payload.reflector !== undefined) {
      if (payload.reflector) {
        mqttService.publish('/ReflectorLed/Prender', { reflector: true, timestamp: new Date().toISOString() })
      } else {
        mqttService.publish('/ReflectorLed/Apagar', { reflector: false, timestamp: new Date().toISOString() })
      }
    }
    if (payload.luzAlta !== undefined) {
      if (payload.luzAlta) {
        mqttService.publish('/LuzAlta/Prender', { luzAlta: true, timestamp: new Date().toISOString() })
      } else {
        mqttService.publish('/LuzAlta/Apagar', { luzAlta: false, timestamp: new Date().toISOString() })
      }
    }
  }

  function actualizarPuertas(payload) {
    if (payload.abiertas !== undefined) {
      puertasAbiertas.value = payload.abiertas
      if (payload.abiertas) {
        mqttService.publish('/Puertas/Abrir', { puertas: 'abiertas', timestamp: new Date().toISOString() })
      } else {
        mqttService.publish('/Puertas/Cerrar', { puertas: 'cerradas', timestamp: new Date().toISOString() })
      }
    }
  }

  function actualizarCinturones(payload) {
    if (payload.abrochados !== undefined) {
      cinturonesAbrochados.value = payload.abrochados
      mqttService.publish('/Cinturones/Estado', { abrochados: payload.abrochados, timestamp: new Date().toISOString() })
    }
  }

  function consumirBateriaPorLuz(tipo, encendida) {
    if (!encendida) return
    let consumo = 0
    switch (tipo) {
      case 'balizas':
        consumo = 0.3
        break
      case 'lucesAltasYBajas':
        consumo = 0.2
        break
      case 'luzInterior':
        consumo = 0.1
        break
      case 'reflector':
        consumo = 0.15
        break
      default:
        consumo = 0.1
    }
    batteryLevel.value = Math.max(0, batteryLevel.value - consumo)
  }

  return {
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
    batteryStatus,
    range,
    allDoorsLocked,
    allSeatbeltsOn,
    allWindowsClosed,
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
    stopSimulation,
    actualizarMotor,
    actualizarLuces,
    actualizarPuertas,
    actualizarCinturones,
    puertasAbiertas,
    cinturonesAbrochados,
    setEngineState,
    consumirBateriaPorLuz
  }
}) 