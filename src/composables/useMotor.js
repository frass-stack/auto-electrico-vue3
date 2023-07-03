import { computed } from 'vue'
import { useMotorStore } from '../store/motor'

export function useMotor() {
  // accedemos al store de motor
  const motor = useMotorStore()

  // creamos unas propiedades computadas para acceder al estado del motor
  const encendido = computed(() => motor.encendido) // esta es la nueva propiedad
  const cargaBateria = computed(() => motor.cargaBateria)
  const autonomiaBateria = computed(() => motor.autonomiaBateria)

  // creamos unas funciones para ejecutar las acciones del motor
  function toggleEncendido() { motor.toggleEncendido() } // esta es la nueva función
  function cargarBateria(cantidad) { motor.cargarBateria(cantidad) }
  function consumirBateria(distancia) { motor.consumirBateria(distancia) }
  function resetearBateria() { motor.resetearBateria() }

  function mostrarEstadoDeBateria() { return motor.mostrarEstadoDeBateria() }

  // devolvemos las propiedades y funciones que queremos exponer
  return {
    encendido, // esta es la nueva propiedad
    cargaBateria,
    autonomiaBateria,
    toggleEncendido, // esta es la nueva función
    cargarBateria,
    consumirBateria,
    resetearBateria,
    mostrarEstadoDeBateria,
  }
}
