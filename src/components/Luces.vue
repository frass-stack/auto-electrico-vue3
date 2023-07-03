<template>
  <div class="luces">
    <!-- Este es el componente que usa useApi para el store de luces -->
    <h2>Componente de luces</h2>
    <!-- Estos son los botones para ejecutar las acciones de las luces -->
    <button @click="activarLucesDeGiro('izquierda')">Activar luces de giro izquierda</button>
    <button @click="activarLucesDeGiro('derecha')">Activar luces de giro derecha</button>
    <button @click="desactivarLucesDeGiro('apagadas')">Desactivar luces de giro</button>
    <button @click="activarBalizas">Activar balizas</button>
    <button @click="desactivarBalizas">Desactivar balizas</button>
    <button @click="cambiarLucesAltasYBajas">Cambiar luces altas y bajas</button>
    <button @click="apagarTodasLasLuces">Apagar todas las luces</button>
    <!-- Este es el párrafo para mostrar el estado de las luces -->
    <p>{{ mostrarEstadoDeLuces() }}</p>
  </div>
</template>

<script>
// Importamos el composable general
import { useApi } from '../composables/useApi'

export default {
  name: 'Luces',
  setup() {
    // Accedemos al composable general
    const api = useApi()

    // Devolvemos las propiedades y funciones que queremos usar en el template
    return {
      // luces
      activarLucesDeGiro: api.activarLucesDeGiro,
      desactivarLucesDeGiro: api.desactivarLucesDeGiro,
      activarBalizas: api.activarBalizas,
      desactivarBalizas: api.desactivarBalizas,
      cambiarLucesAltasYBajas: api.cambiarLucesAltasYBajas,
      apagarTodasLasLuces: api.apagarTodasLasLuces,
      mostrarEstadoDeLuces: api.mostrarEstadoDeLuces,
    }
  },
}
</script>

<style>
.luces {
  background-color: lightgreen;
  border: 2px solid green;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.luces button {
  width: 350px; /* aumentamos el ancho del botón */
  height: 40px;
  border-radius: 10px;
  font-size: 16px;
  margin: 3px;
}

</style>
