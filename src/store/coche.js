// stores/coche.js
import { defineStore } from 'pinia'
import { useVehicleStore } from './vehicle'

export const useCocheStore = defineStore('coche', {
  state: () => {
    return {
      cinturonesDeSeguridad: false,
      puertas: false,
      velocimetro: 0,
      odometro: 0,
    }
  },
  actions: {
    
    abrocharCinturones() {
      this.cinturonesDeSeguridad = !this.cinturonesDeSeguridad;
      useVehicleStore().actualizarCinturones({ abrochados: this.cinturonesDeSeguridad })
    },
    abrirPuertas() {
      this.puertas = true
      useVehicleStore().actualizarPuertas({ abiertas: true })
    },
    cerrarPuertas() {
      this.puertas = false
      useVehicleStore().actualizarPuertas({ abiertas: false })
    },
    acelerar(velocidad) {
      this.velocimetro += velocidad
      this.odometro += this.velocimetro / 60
    },
    frenar(velocidad) {
      this.velocimetro -= velocidad
      if (this.velocimetro < 0) {
        this.velocimetro = 0
      }
      this.odometro += this.velocimetro / 60
    },
    resetearVelocimetro() {
      this.velocimetro = 0
    },
    resetearOdometro() {
      this.odometro = 0
    },
    mostrarEstadoDeCoche() {
      const value = `El coche tiene los cinturones de seguridad ${this.cinturonesDeSeguridad ? 'abrochados' : 'desabrochados'}, las puertas ${this.puertas ? 'abiertas' : 'cerradas'}, el velocímetro en ${this.velocimetro} km/h y el odómetro en ${this.odometro} km`;
      return value;
    },
  },
})
