import { defineStore } from 'pinia'

export const useMotorStore = defineStore('motor', {
  state: () => {
    return {
      encendido: false, // Indica si el motor está encendido o apagado
      cargaBateria: 0,
      autonomiaBateria: 0,
    }
  },
  actions: {
    // Enciende o apaga el motor
    toggleEncendido() {
      this.encendido = !this.encendido
      if (this.encendido) {
        // Si se enciende el motor, se inicia un intervalo que actualiza la autonomía cada segundo
        this.$interval = setInterval(() => {
          this.autonomiaBateria -= this.cargaBateria / 3600 // Se resta la carga por hora dividido entre 3600 segundos
          if (this.autonomiaBateria <= 0) {
            // Si la autonomía se agota, se apaga el motor y se limpia el intervalo
            this.encendido = false
            clearInterval(this.$interval)
          }
        }, 1000)
      } else {
        // Si se apaga el motor, se limpia el intervalo
        clearInterval(this.$interval)
      }
    },
    // Carga la batería con una cantidad dada
    cargarBateria(cantidad) {
      this.cargaBateria += cantidad
      this.autonomiaBateria = this.cargaBateria * 10 // supongamos que cada unidad de carga da 10 km de autonomía
    },
    // Consume la batería con una distancia dada
    consumirBateria(distancia) {
      this.autonomiaBateria -= distancia
      this.cargaBateria = this.autonomiaBateria / 10
    },
    // Resetea la batería a cero
    resetearBateria() {
      this.cargaBateria = 0
      this.autonomiaBateria = 0
    },
    // Muestra el estado de la batería en una cadena de texto
    mostrarEstadoDeBateria() {
      return `La batería tiene ${this.cargaBateria} unidades de carga y ${this.autonomiaBateria} km de autonomía`
    },
    // etc.
  },
})
