import { mqttService } from './mqtt'

export const lucesService = () => {
    // Métodos para cada tópico requerido
    const balizaPrender = () => mqttService.publish('/Baliza/Prender', {})
    const balizaApagar = () => mqttService.publish('/Baliza/Apagar', {})
    const luzBajaPrender = () => mqttService.publish('/LuzBaja/Prender', {})
    const luzBajaApagar = () => mqttService.publish('/LuzBaja/Apagar', {})
    const luzInteriorPrender = () => mqttService.publish('/LuzInterior/Prender', {})
    const luzInteriorApagar = () => mqttService.publish('/LuzInterior/Apagar', {})
    const reflectorLedPrender = () => mqttService.publish('/ReflectorLed/Prender', {})
    const reflectorLedApagar = () => mqttService.publish('/ReflectorLed/Apagar', {})
    const luzAltaPrender = () => mqttService.publish('/LuzAlta/Prender', {})
    const luzAltaApagar = () => mqttService.publish('/LuzAlta/Apagar', {})

    return {
        balizaPrender,
        balizaApagar,
        luzBajaPrender,
        luzBajaApagar,
        luzInteriorPrender,
        luzInteriorApagar,
        reflectorLedPrender,
        reflectorLedApagar,
        luzAltaPrender,
        luzAltaApagar
    }
}
