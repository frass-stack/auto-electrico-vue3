import { mqttService } from '../services/mqtt'

export function testMQTTConnection() {
  // Conectar al broker
  mqttService.connect()

  // Suscribirse a comandos
  mqttService.subscribeToCommands((message) => {
    console.log('Comando recibido:', message)
  })

  // Publicar algunos mensajes de prueba
  setTimeout(() => {
    console.log('Enviando mensajes de prueba...')
    
    // Publicar estado del vehículo
    mqttService.publishVehicleState({
      motor: true,
      battery: 80,
      lights: {
        front: true,
        back: false
      }
    })

    // Publicar ubicación
    mqttService.publishLocation(-34.6037, -58.3816)

    // Publicar nivel de batería
    mqttService.publishBatteryLevel(80)

    // Publicar estado del motor
    mqttService.publishMotorState({
      running: true,
      rpm: 2500,
      temperature: 75
    })

    // Publicar estado de las luces
    mqttService.publishLightsState({
      front: true,
      back: false,
      hazard: false,
      indicators: {
        left: false,
        right: false
      }
    })
  }, 2000)
} 