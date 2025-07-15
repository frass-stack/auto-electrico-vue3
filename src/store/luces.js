import { defineStore } from 'pinia'
import { useVehicleStore } from './vehicle'

let consumoInterval = null;

function iniciarConsumoAcumulativo() {
  if (consumoInterval) return;
  consumoInterval = setInterval(() => {
    const store = useLucesStore(); // Instancia reactiva del store
    const vehicleStore = useVehicleStore();
    if (vehicleStore.batteryLevel > 0) {
      if (store.balizas) {
        vehicleStore.consumirBateriaPorLuz('balizas', true);
      }
      if (store.lucesAltasYBajas) {
        vehicleStore.consumirBateriaPorLuz('lucesAltasYBajas', true);
      }
      if (store.luzInterior) {
        vehicleStore.consumirBateriaPorLuz('luzInterior', true);
      }
      if (store.reflector) {
        vehicleStore.consumirBateriaPorLuz('reflector', true);
      }
    }
  }, 1000);
}

function detenerConsumoAcumulativo() {
  if (consumoInterval) {
    clearInterval(consumoInterval);
    consumoInterval = null;
  }
}

// Iniciar el consumo acumulativo automáticamente al cargar el store
setTimeout(() => {
  const store = useLucesStore();
  store.iniciarConsumoAcumulativo();
}, 0);

// Agregar los métodos al store
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
      useVehicleStore().actualizarLuces({ lucesDeGiro: this.lucesDeGiro })
    },
    desactivarLucesDeGiro() {
      this.lucesDeGiro = false
      useVehicleStore().actualizarLuces({ lucesDeGiro: this.lucesDeGiro })
    },
    activarBalizas() {
      if (!this.balizas && useVehicleStore().batteryLevel > 0) {
        this.balizas = true
        useVehicleStore().actualizarLuces({ balizas: true })
        useVehicleStore().consumirBateriaPorLuz('balizas', true)
      }
    },
    desactivarBalizas() {
      this.balizas = false
      useVehicleStore().actualizarLuces({ balizas: false })
    },
    cambiarLucesAltasYBajas() {
      if (!this.lucesAltasYBajas && useVehicleStore().batteryLevel > 0) {
        this.lucesAltasYBajas = true
        useVehicleStore().actualizarLuces({ lucesAltasYBajas: true })
        useVehicleStore().consumirBateriaPorLuz('lucesAltasYBajas', true)
      } else {
        this.lucesAltasYBajas = false
        useVehicleStore().actualizarLuces({ lucesAltasYBajas: false })
      }
    },
    apagarTodasLasLuces() {
      this.lucesDeGiro = false
      this.balizas = false
      this.lucesAltasYBajas = false
      useVehicleStore().actualizarLuces({
        lucesDeGiro: false,
        balizas: false,
        lucesAltasYBajas: false
      })
    },
    activarLuzInterior() {
      if (!this.luzInterior && useVehicleStore().batteryLevel > 0) {
        this.luzInterior = true
        useVehicleStore().actualizarLuces({ luzInterior: true })
        useVehicleStore().consumirBateriaPorLuz('luzInterior', true)
      }
    },
    desactivarLuzInterior() {
      this.luzInterior = false
      useVehicleStore().actualizarLuces({ luzInterior: false })
    },
    activarReflector() {
      if (!this.reflector && useVehicleStore().batteryLevel > 0) {
        this.reflector = true
        useVehicleStore().actualizarLuces({ reflector: true })
        useVehicleStore().consumirBateriaPorLuz('reflector', true)
      }
    },
    desactivarReflector() {
      this.reflector = false
      useVehicleStore().actualizarLuces({ reflector: false })
    },
    iniciarConsumoAcumulativo,
    detenerConsumoAcumulativo,
    mostrarEstadoDeLuces() {
      return `Las luces de giro están en ${this.lucesDeGiro ? 'encendidas' : 'apagadas'}, las balizas están ${this.balizas ? 'encendidas' : 'apagadas'} y las luces altas y bajas están ${this.lucesAltasYBajas ? 'encendidas' : 'apagadas'}. La luz interior esta ${this.luzInterior ? 'encendida':'apagada'}. El reflector esta ${this.reflector ? 'encendido':'apagado'}.`
    },
  },
})