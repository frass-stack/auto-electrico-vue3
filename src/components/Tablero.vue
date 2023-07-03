<template>
  <div class="tablero">
    <!-- Este es el componente vista que muestra todos los componentes que usan useApi -->
    <h1>Componente vista de tablero</h1>
    <!-- Estos son los componentes que usan useApi -->
    <Coche />
    <Luces />
    <!-- <Usuario /> -->
    <Motor />
  </div>
</template>

<script>
// Importamos los componentes que usan useApi
import Coche from './Coche.vue'
import Luces from './Luces.vue'
import Usuario from './Usuario.vue'
import Motor from './Motor.vue'

export default {
  name: 'Tablero',
  components: {
    Coche,
    Luces,
    Usuario,
    Motor,
  },
}
</script>

<style>
.tablero {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  background-color: #f9f9f9;
  padding: 20px;
}

h1 {
  font-family: Courier New, monospace;
  font-size: 20px;
  color: #000000;
}

.tablero > * {
  border: 2px solid #cccccc;
}
</style>
