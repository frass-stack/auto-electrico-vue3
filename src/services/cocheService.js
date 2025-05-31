import { mqttService } from './mqtt'

import { mqttService } from './mqtt'

export const cocheService = () => {
    const enviarComandoPuertas = async (accion) => {
        try {
            mqttService.publish('vehicle/doors', {
                action: accion,
                timestamp: new Date().toISOString()
            })
            return {
                status: 200,
                message: `Comando de ${accion} puertas enviado`
            }
        } catch (error) {
            console.error(`Error al ${accion} puertas:`, error)
            throw error
        }
    }

    const escucharEstadoPuertas = (callback) => {
        mqttService.subscribe('vehicle/doors/state', callback)
    }

    return {
        abrirPuertasAPI: () => enviarComandoPuertas('abrir'),
        cerrarPuertasAPI: () => enviarComandoPuertas('cerrar'),
        escucharEstadoPuertas
    }
}
