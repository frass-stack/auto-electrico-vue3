import { computed } from 'vue'
import { useCocheStore } from '../store/coche'

export function useCoche() { 
// accedemos al store de coche 
const coche = useCocheStore()

// creamos unas propiedades computadas para acceder al estado del coche 
const cinturonesDeSeguridad = computed(() => coche.cinturonesDeSeguridad) 
const puertas = computed(() => coche.puertas) 
const velocimetro = computed(() => coche.velocimetro) 
const odometro = computed(() => coche.odometro)

// creamos unas funciones para ejecutar las acciones del coche 

function abrocharCinturones() { coche.abrocharCinturones() }
function abrirPuertas() { coche.abrirPuertas() }
function cerrarPuertas() { coche.cerrarPuertas() }
function acelerar(velocidad) { coche.acelerar(velocidad) }
function frenar(velocidad) { coche.frenar(velocidad) }
function resetearVelocimetro() { coche.resetearVelocimetro() }
function resetearOdometro() { coche.resetearOdometro() }
function mostrarEstadoDeCoche() { return coche.mostrarEstadoDeCoche() }

// devolvemos las propiedades y funciones que queremos exponer 
return { 
    cinturonesDeSeguridad, 
    puertas, 
    velocimetro, 
    odometro, 
    abrocharCinturones, 
    abrirPuertas, 
    cerrarPuertas, 
    acelerar, 
    frenar, 
    resetearVelocimetro, 
    resetearOdometro, 
    mostrarEstadoDeCoche, 
}}