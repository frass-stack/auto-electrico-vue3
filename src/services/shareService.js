import { useVehicleStore } from '@/store/vehicle'
import { useAuthStore } from '@/store/auth'
import { emailService } from './emailService'

export const shareService = {
  /**
   * Genera un resumen del estado del vehículo y usuarios
   * @returns {Object} Resumen formateado
   */
  generateSummary() {
    const vehicleStore = useVehicleStore()
    const authStore = useAuthStore()

    const summary = {
      vehiculo: {
        bateria: `${vehicleStore.batteryLevel}%`,
        autonomia: `${vehicleStore.range} km`,
        estado: vehicleStore.isEngineOn ? 'En funcionamiento' : 'Apagado',
        ubicacion: 'Buenos Aires, Argentina',
        mantenimiento: {
          proximoServicio: `${vehicleStore.maintenance.nextService} km`,
          estado: vehicleStore.maintenance.status
        },
        consumoEnergia: {
          actual: `${vehicleStore.energyConsumption.current} kWh`,
          promedio: `${vehicleStore.energyConsumption.average} kWh`
        }
      },
      usuarios: {
        propietario: {
          nombre: authStore.currentUser?.name || 'No disponible',
          email: authStore.currentUser?.email || 'No disponible'
        },
        invitados: authStore.guestUsers?.map(guest => ({
          nombre: guest.name,
          email: guest.email
        })) || []
      }
    }

    return summary
  },

  /**
   * Genera el contenido del correo electrónico
   */
  generateEmailContent() {
    const store = useVehicleStore()
    
    return `
      <h2>Estado del Vehículo Eléctrico</h2>
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5; border-radius: 10px;">
        <p><strong>Batería:</strong> ${store.batteryLevel}%</p>
        <p><strong>Autonomía:</strong> ${store.range} km</p>
        <p><strong>Estado:</strong> ${store.isEngineOn ? 'En funcionamiento' : 'Apagado'}</p>
        <p><strong>Ubicación:</strong> ${store.location || 'No disponible'}</p>
        <p><strong>Próximo servicio:</strong> ${store.maintenance?.nextService || 'No disponible'} km</p>
        <p><strong>Estado mantenimiento:</strong> ${store.maintenance?.status || 'No disponible'}</p>
        <p><strong>Consumo actual:</strong> ${store.energyConsumption?.current || '0'} kWh</p>
        <p><strong>Consumo promedio:</strong> ${store.energyConsumption?.average || '0'} kWh</p>
      </div>
    `
  },

  /**
   * Envía el correo electrónico usando el servicio configurado
   * @param {Object} data Datos del correo
   * @param {string} data.to Dirección de correo del destinatario
   * @param {string} data.subject Asunto del correo
   */
  async sendEmail({ to, subject }) {
    const content = this.generateEmailContent()
    return await emailService.sendEmail(to, subject, content)
  },

  /**
   * Comparte el resumen por WhatsApp
   */
  async shareByWhatsApp() {
    const store = useVehicleStore()
    
    const text = `
Estado del Vehículo Eléctrico:
🔋 Batería: ${store.batteryLevel}%
🛣️ Autonomía: ${store.range} km
📍 Estado: ${store.isEngineOn ? 'En funcionamiento' : 'Apagado'}
📌 Ubicación: ${store.location || 'No disponible'}
🔧 Próximo servicio: ${store.maintenance?.nextService || 'No disponible'} km
⚡ Consumo actual: ${store.energyConsumption?.current || '0'} kWh
    `.trim()

    const encodedText = encodeURIComponent(text)
    window.open(`https://wa.me/?text=${encodedText}`, '_blank')
  }
} 