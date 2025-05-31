import { mqttService } from './mqtt'

export const lucesService = () => {
    const enviarComandoLuces = async (tipo, accion) => {
        try {
            mqttService.publishLightsState({
                type: tipo,
                action: accion,
                timestamp: new Date().toISOString()
            })
            return {
                status: 200,
                message: `Comando de ${accion} enviado para ${tipo}`
            }
        } catch (error) {
            console.error(`Error al ${accion} ${tipo}:`, error)
            throw error
        }
    }

    const escucharEstadoLuces = (tipo, callback) => {
        mqttService.subscribe(`vehicle/lights/${tipo}/state`, callback)
    }

    return {
        luzAltaEncenderAPI: () => enviarComandoLuces('alta', 'encender'),
        luzAltaApagarAPI: () => enviarComandoLuces('alta', 'apagar'),
        luzBajaEncenderAPI: () => enviarComandoLuces('baja', 'encender'),
        luzBajaApagarAPI: () => enviarComandoLuces('baja', 'apagar'),
        LuzInteriorEncenderAPI: () => enviarComandoLuces('interior', 'encender'),
        LuzInteriorApagarAPI: () => enviarComandoLuces('interior', 'apagar'),
        reflectorEncenderAPI: () => enviarComandoLuces('reflector', 'encender'),
        reflectorApagarAPI: () => enviarComandoLuces('reflector', 'apagar'),
        balizasEncenderAPI: () => enviarComandoLuces('balizas', 'encender'),
        balizasApagarAPI: () => enviarComandoLuces('balizas', 'apagar'),
        escucharEstadoLuces
    }
}
