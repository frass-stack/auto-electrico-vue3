import { mqttService } from './mqtt'

export const motorService = () => {
    // Métodos para cada tópico requerido
    const vehiculoEncender = () => mqttService.publish('/Vehiculo/Encender', {})
    const vehiculoApagar = () => mqttService.publish('/Vehiculo/Apagar', {})

    return {
        vehiculoEncender,
        vehiculoApagar
    }
}
