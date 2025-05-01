import { defineStore } from 'pinia'

export const useMotorStore = defineStore('motor', {
  state: () => {
    return {
      encendido: false,
      cargaBateria: 0,
      autonomiaBateria: 0,
    }
  },
  actions: {
    // Enciende o apaga el motor
    toggleEncendido() {
      this.encendido = !this.encendido
      if (this.encendido) {
        this.$interval = setInterval(() => {
          this.autonomiaBateria -= this.cargaBateria / 3600
          if (this.autonomiaBateria <= 0) {
            this.encendido = false
            clearInterval(this.$interval)
          }
        }, 1000)
      } else {
        clearInterval(this.$interval)
      }
    },
    cargarBateria(cantidad) {
      this.cargaBateria += cantidad
      this.autonomiaBateria = this.cargaBateria * 10
    },
    consumirBateria(distancia) {
      this.autonomiaBateria -= distancia
      this.cargaBateria = this.autonomiaBateria / 10
    },
    resetearBateria() {
      this.cargaBateria = 0
      this.autonomiaBateria = 0
    },
    mostrarEstadoDeBateria() {
      return `La batería tiene ${this.cargaBateria} unidades de carga y ${this.autonomiaBateria} km de autonomía`
    },
  },
})
