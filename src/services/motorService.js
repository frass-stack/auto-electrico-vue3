import { mqttService } from './mqtt'

export const motorService = () => {
    const encenderMotorAPI = async () => {
        try {
            mqttService.publishMotorState({
                action: 'start',
                timestamp: new Date().toISOString()
            })
            return {
                status: 200,
                message: 'Comando de encendido enviado'
            }
        } catch (error) {
            console.error('Error al encender motor:', error)
            throw error
        }
    }

    const apagarMotorAPI = async () => {
        try {
            mqttService.publishMotorState({
                action: 'stop',
                timestamp: new Date().toISOString()
            })
            return {
                status: 200,
                message: 'Comando de apagado enviado'
            }
        } catch (error) {
            console.error('Error al apagar motor:', error)
            throw error
        }
    }

    const escucharEstadoMotor = (callback) => {
        mqttService.subscribe('vehicle/motor/state', callback)
    }

    return {
        encenderMotorAPI,
        apagarMotorAPI,
        escucharEstadoMotor
    }
}
