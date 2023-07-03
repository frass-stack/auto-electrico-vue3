<template>
  <div class="motor">
    <!-- Este es el componente que usa useApi para el store de motor -->
    <h2>Componente de motor</h2>
    <!-- Estos son los botones para ejecutar las acciones del motor -->
    <button @click="toggleEncendido">Encender/Apagar</button> <!-- este es el nuevo botón -->
    <button @click="cargarBateria(10)">Cargar batería 10 unidades</button>
    <button @click="consumirBateria(10)">Consumir batería 10 km</button>
    <button @click="resetearBateria">Resetear batería</button>
    <!-- Estos son los párrafos para mostrar el estado del motor -->
    <p>El motor está {{ encendido ? 'encendido' : 'apagado' }}</p> <!-- este es el nuevo párrafo -->
    <p>{{ mostrarEstadoDeBateria() }}</p>
  </div>
</template>

<script>
// Importamos el composable general
import { useApi } from '../composables/useApi'

export default {
  name: 'Motor',
  setup() {
    // Accedemos al composable general
    const api = useApi()

    // Devolvemos las propiedades y funciones que queremos usar en el template
    return {
      // motor
      encendido: api.encendido,
      toggleEncendido: api.toggleEncendido,
      cargarBateria: api.cargarBateria,
      consumirBateria: api.consumirBateria,
      resetearBateria: api.resetearBateria,
      mostrarEstadoDeBateria: api.mostrarEstadoDeBateria,
    }
  },
}
</script>

<style>
.motor {
  background-color: lightyellow;
  border: 2px solid yellow;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.motor button {
  width: 200px;
  height: 40px;
  border-radius: 10px;
  font-size: 16px;
}
</style>
