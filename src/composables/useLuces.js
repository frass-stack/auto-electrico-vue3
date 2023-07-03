import { computed } from 'vue' ;
import { useLucesStore } from '../store/luces';

export function useLuces() { // accedemos al store de luces 
    const luces = useLucesStore()

// creamos unas propiedades computadas para acceder al estado de las luces 
const lucesDeGiro = computed(() => luces.lucesDeGiro) 
const balizas = computed(() => luces.balizas) 
const lucesAltasYBajas = computed(() => luces.lucesAltasYBajas)

// creamos unas funciones para ejecutar las acciones de las luces 
function activarLucesDeGiro(lado) { luces.activarLucesDeGiro(lado) }

function desactivarLucesDeGiro() { luces.desactivarLucesDeGiro() }

function activarBalizas() { luces.activarBalizas() }

function desactivarBalizas() { luces.desactivarBalizas() }

function cambiarLucesAltasYBajas() { luces.cambiarLucesAltasYBajas() }

function apagarTodasLasLuces() { luces.apagarTodasLasLuces() }

function mostrarEstadoDeLuces() { return luces.mostrarEstadoDeLuces() }

// devolvemos las propiedades y funciones que queremos exponer 
return { 
    lucesDeGiro, 
    balizas, 
    lucesAltasYBajas, 
    activarLucesDeGiro,
    desactivarLucesDeGiro, 
    activarBalizas, 
    desactivarBalizas, 
    cambiarLucesAltasYBajas, 
    apagarTodasLasLuces, 
    mostrarEstadoDeLuces 
}}