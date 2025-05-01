import { defineStore } from 'pinia'

export const useLucesStore = defineStore('luces', {
  state: () => {
    return {
      lucesDeGiro: false,
      balizas: false,
      lucesAltasYBajas: false,
      luzInterior: false,
      reflector: false
    }
  },
  actions: {
    activarLucesDeGiro(lado) {
      this.lucesDeGiro = lado
    },
    desactivarLucesDeGiro() {
      this.lucesDeGiro = false
    },
    activarBalizas() {
      this.balizas = true
    },
    desactivarBalizas() {
      this.balizas = false
    },
    cambiarLucesAltasYBajas() {
      this.lucesAltasYBajas = !this.lucesAltasYBajas
    },
    apagarTodasLasLuces() {
      this.lucesDeGiro = false
      this.balizas = false
      this.lucesAltasYBajas = false
    },
    activarLuzInterior(){
      this.luzInterior = true
    },
    desactivarLuzInterior(){
      this.luzInterior = false
    },
    activarReflector(){
      this.reflector = true
    },
    desactivarReflector(){
      this.reflector = false
    },
    mostrarEstadoDeLuces() {
      return `Las luces de giro están en ${this.lucesDeGiro ? 'encendidas' : 'apagadas'}, las balizas están ${this.balizas ? 'encendidas' : 'apagadas'} y las luces altas y bajas están ${this.lucesAltasYBajas ? 'encendidas' : 'apagadas'}. La luz interior esta ${this.luzInterior ? 'encendida':'apagada'}. El reflector esta ${this.reflector ? 'encendido':'apagado'}.`
    },
  },
})