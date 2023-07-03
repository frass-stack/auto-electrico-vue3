<template>
  <div class="tablero">
    <!-- Este es el componente vista que muestra todos los componentes que usan useApi -->
    <h1>Componente vista de tablero</h1>
    <!-- Estos son los componentes que usan useApi -->
    <div class="imagen">
      <img v-bind:src="cocheImg" alt="Coche" />
      <Coche />
    </div>
    <div class="imagen">
      <img v-bind:src="lucesImg" alt="Luces" />
      <Luces />
    </div>
    <!-- <Usuario /> -->
    <div class="imagen">
      <img v-bind:src="motorImg" alt="Motor" />
      <Motor />
    </div>
  </div>
</template>

<script>
// Importamos los componentes que usan useApi
import Coche from './Coche.vue'
import Luces from './Luces.vue'
import Usuario from './Usuario.vue'
import Motor from './Motor.vue'

// Importamos las imágenes que queremos usar
import cocheImg from '../assets/coche.png'
import lucesImg from '../assets/luces.jpg'
import motorImg from '../assets/motor.jpg'
import tableroImg from '../assets/tablero.png'

export default {
  name: 'Tablero',
  components: {
    Coche,
    Luces,
    Usuario,
    Motor,
  },
  data() {
    return {
      // Asignamos las imágenes importadas a unas propiedades del objeto data
      cocheImg,
      lucesImg,
      motorImg,
      tableroImg
    }
  }
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

.imagen {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.imagen > img {
  width: 100px;
  height: auto;
}
</style>
