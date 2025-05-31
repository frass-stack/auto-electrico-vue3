import mqtt from 'mqtt'
import { ref } from 'vue'

class MQTTService {
  constructor() {
    this.client = null
    this.connected = ref(false)
    this.topic_prefix = 'auto_electrico'
    this.subscriptions = new Map()
  }

  connect() {
    // Usar WebSocket para MQTT
    const brokerUrl = import.meta.env.VITE_MQTT_BROKER_URL || 'wss://42868a8f86294ca1bcb46d95ed80ff5d.s1.eu.hivemq.cloud:8884/mqtt'

    this.client = mqtt.connect(brokerUrl, {
      clientId: 'auto_electrico_frontend_' + Math.random().toString(16).substr(2, 8),
      clean: true,
      connectTimeout: 4000,
      reconnectPeriod: 1000,
      username: 'untref',
      password: 'Untref2025'
    })

    this.client.on('connect', () => {
      console.log('Conectado al broker MQTT')
      this.connected.value = true

      // Resubscribirse a todos los topics
      this.subscriptions.forEach((callback, topic) => {
        this.subscribe(topic, callback)
      })
      this.publish('frontend/state', 'Inicio')
    })

    this.client.on('error', (error) => {
      console.error('Error de conexión MQTT:', error)
      this.connected.value = false
    })

    this.client.on('message', (topic, message) => {
      const callback = this.subscriptions.get(topic)
      if (callback) {
        try {
          const payload = JSON.parse(message.toString())
          callback(payload)
        } catch (error) {
          console.error('Error al procesar mensaje MQTT:', error)
        }
      }
    })
  }

  disconnect() {
    if (this.client) {
      this.client.end()
      this.connected.value = false
    }
  }

  subscribe(topic, callback) {
    const fullTopic = `${this.topic_prefix}/${topic}`
    this.subscriptions.set(fullTopic, callback)

    if (this.client && this.connected.value) {
      this.client.subscribe(fullTopic, (error) => {
        if (error) {
          console.error('Error al suscribirse al topic:', fullTopic, error)
        } else {
          console.log('Suscrito al topic:', fullTopic)
        }
      })
    }
  }

  publish(topic, message) {
    if (!this.client || !this.connected.value) {
      console.error('No hay conexión MQTT')
      return
    }

    const fullTopic = `${this.topic_prefix}/${topic}`
    this.client.publish(fullTopic, JSON.stringify(message), { qos: 1 }, (error) => {
      if (error) {
        console.error('Error al publicar mensaje:', error)
      }
    })
  }

  // Métodos específicos para el auto eléctrico
  publishVehicleState(state) {
    this.publish('vehicle/state', state)
  }

  publishBatteryLevel(level) {
    this.publish('vehicle/battery', { level })
  }

  publishLocation(latitude, longitude) {
    this.publish('vehicle/location', { latitude, longitude })
  }

  publishMotorState(state) {
    this.publish('vehicle/motor', state)
  }

  publishLightsState(state) {
    this.publish('vehicle/lights', state)
  }

  // Suscripciones a comandos del backend
  subscribeToCommands(callback) {
    this.subscribe('commands/#', callback)
  }
}

export const mqttService = new MQTTService() 