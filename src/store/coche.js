// stores/coche.js
import { defineStore } from 'pinia'

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
    // aquí puedes definir las acciones que modifican el estado, por ejemplo:
    abrocharCinturones() {
      this.cinturonesDeSeguridad = !this.cinturonesDeSeguridad;
    },
    abrirPuertas() {
      this.puertas = true
    },
    cerrarPuertas() {
      this.puertas = false
    },
    acelerar(velocidad) {
      this.velocimetro += velocidad
      this.odometro += this.velocimetro / 60 // supongamos que cada minuto recorre la distancia de su velocidad actual
    },
    frenar(velocidad) {
      this.velocimetro -= velocidad
      if (this.velocimetro < 0) {
        this.velocimetro = 0 // no puede tener velocidad negativa
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
