import { mqttService } from './mqtt'

export const cocheService = () => {
    // Métodos para cada tópico requerido
    const puertasAbrir = () => mqttService.publish('/Puertas/Abrir', {})
    const puertasCerrar = () => mqttService.publish('/Puertas/Cerrar', {})

    return {
        puertasAbrir,
        puertasCerrar
    }
}
