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
      // Resuscribirse a todos los tópicos almacenados
      this.subscriptions.forEach((callback, topic) => {
        this.subscribe(topic, callback)
      })
      // Publicar mensaje inicial indicando que la aplicación está activa
      this.publish('frontend/state', { status: 'Inicio', timestamp: new Date().toISOString() })
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
          // Si el mensaje no es JSON, pasarlo como string
          callback(message.toString())
        }
      }
    })

    this.client.on('reconnect', () => {
      console.log('Reconectando al broker MQTT...')
    })

    this.client.on('close', () => {
      console.log('Conexión MQTT cerrada')
      this.connected.value = false
    })
  }

  disconnect() {
    if (this.client) {
      this.client.end()
      this.connected.value = false
    }
  }

  subscribe(topic, callback) {
    // No agregar el prefijo si el tópico ya lo incluye
    const fullTopic = topic.startsWith(this.topic_prefix) ? topic : `${this.topic_prefix}/${topic}`
    this.subscriptions.set(fullTopic, callback)

    if (this.client && this.connected.value) {
      this.client.subscribe(fullTopic, { qos: 1 }, (error) => {
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

    // No agregar el prefijo si el tópico ya lo incluye
    const fullTopic = topic.startsWith(this.topic_prefix) ? topic : `${this.topic_prefix}/${topic}`
    
    // Asegurarse de que el mensaje sea un objeto o string
    const payload = typeof message === 'object' ? JSON.stringify(message) : message.toString()
    
    this.client.publish(fullTopic, payload, { qos: 1 }, (error) => {
      if (error) {
        console.error('Error al publicar mensaje:', error)
      } else {
        console.log('Mensaje publicado en:', fullTopic, payload)
      }
    })
  }

  // Métodos específicos para el auto eléctrico
  publishVehicleState(state) {
    this.publish('vehicle/state', {
      ...state,
      timestamp: new Date().toISOString()
    })
  }

  publishBatteryLevel(level) {
    this.publish('vehicle/battery', {
      level,
      timestamp: new Date().toISOString()
    })
  }

  publishLocation(latitude, longitude) {
    this.publish('vehicle/location', {
      latitude,
      longitude,
      timestamp: new Date().toISOString()
    })
  }

  publishMotorState(state) {
    this.publish('vehicle/motor', {
      ...state,
      timestamp: new Date().toISOString()
    })
  }

  publishLightsState(state) {
    this.publish('vehicle/lights', {
      ...state,
      timestamp: new Date().toISOString()
    })
  }

  // Suscripciones a comandos del backend
  subscribeToCommands(callback) {
    this.subscribe('commands/#', callback)
  }
}

export const mqttService = new MQTTService() 