import { useVehicleStore } from '@/store/vehicle'
import { useAuthStore } from '@/store/auth'

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
   * Comparte el resumen por correo electrónico
   */
  async shareByEmail() {
    const summary = this.generateSummary()
    const subject = 'Estado del Vehículo Eléctrico'
    const body = `
Estado del Vehículo:
- Batería: ${summary.vehiculo.bateria}
- Autonomía: ${summary.vehiculo.autonomia}
- Estado: ${summary.vehiculo.estado}
- Ubicación: ${summary.vehiculo.ubicacion}
- Próximo servicio: ${summary.vehiculo.mantenimiento.proximoServicio}
- Estado mantenimiento: ${summary.vehiculo.mantenimiento.estado}
- Consumo actual: ${summary.vehiculo.consumoEnergia.actual}
- Consumo promedio: ${summary.vehiculo.consumoEnergia.promedio}

Usuarios:
Propietario: ${summary.usuarios.propietario.nombre} (${summary.usuarios.propietario.email})

Invitados:
${summary.usuarios.invitados.map(guest => `- ${guest.nombre} (${guest.email})`).join('\n')}
`
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = mailtoLink
  },

  /**
   * Comparte el resumen por WhatsApp
   */
  async shareByWhatsApp() {
    const summary = this.generateSummary()
    const message = `
🚗 *Estado del Vehículo Eléctrico*

*Estado del Vehículo:*
🔋 Batería: ${summary.vehiculo.bateria}
🛣️ Autonomía: ${summary.vehiculo.autonomia}
⚡ Estado: ${summary.vehiculo.estado}
📍 Ubicación: ${summary.vehiculo.ubicacion}
🔧 Próximo servicio: ${summary.vehiculo.mantenimiento.proximoServicio}
📊 Estado mantenimiento: ${summary.vehiculo.mantenimiento.estado}
⚡ Consumo actual: ${summary.vehiculo.consumoEnergia.actual}
📈 Consumo promedio: ${summary.vehiculo.consumoEnergia.promedio}

*Usuarios:*
👤 Propietario: ${summary.usuarios.propietario.nombre}
📧 Email: ${summary.usuarios.propietario.email}

👥 *Invitados:*
${summary.usuarios.invitados.map(guest => `- ${guest.nombre} (${guest.email})`).join('\n')}
`
    const whatsappLink = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappLink, '_blank')
  }
} 