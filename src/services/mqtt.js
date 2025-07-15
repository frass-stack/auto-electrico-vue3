import mqtt from 'mqtt'
import { ref } from 'vue'

class MQTTService {
  constructor() {
    this.client = null
    this.connected = ref(false)
    this.topic_prefix = '' // Ya no se usa prefijo
    this.subscriptions = new Map() // Map<string, Set<Function>>
  }

  connect() {
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
      this.subscriptions.forEach((callbacks, topic) => {
        callbacks.forEach(cb => {
          this.subscribe(topic, cb)
        })
      })
      this.publish('/frontend/state', { status: 'Inicio', timestamp: new Date().toISOString() })
      // Suscribirse al tópico /CinturonConductor e imprimir lo recibido
      // this.subscribe('/CinturonConductor', (payload) => {
      //   console.log('Mensaje recibido en /CinturonConductor:', payload)
    })
    this.client.on('error', (error) => {
      console.error('Error de conexión MQTT:', error)
      this.connected.value = false
    })
    this.client.on('message', (topic, message) => {
      const callbacks = this.subscriptions.get(topic)
      if (callbacks && callbacks.size > 0) {
        let payload
        try {
          payload = JSON.parse(message.toString())
        } catch (error) {
          payload = message.toString()
        }
        callbacks.forEach(cb => {
          try {
            cb(payload)
          } catch (err) {
            console.error('Error en callback de MQTT:', err)
          }
        })
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
    if (!this.subscriptions.has(topic)) {
      this.subscriptions.set(topic, new Set())
    }
    this.subscriptions.get(topic).add(callback)
    if (this.client && this.connected.value) {
      this.client.subscribe(topic, { qos: 1 }, (error) => {
        if (error) {
          console.error('Error al suscribirse al topic:', topic, error)
        } else {
          //console.log('Suscrito al topic:', topic)
        }
      })
    }
  }

  publish(topic, message) {
    if (!this.client || !this.connected.value) {
      console.error('No hay conexión MQTT')
      return
    }
    const payload = typeof message === 'object' ? JSON.stringify(message) : message.toString()
    this.client.publish(topic, payload, { qos: 1 }, (error) => {
      if (error) {
        console.error('Error al publicar mensaje:', error)
      } else {
        console.log('Mensaje publicado en:', topic, payload)
      }
    })
  }
}

export const mqttService = new MQTTService() 