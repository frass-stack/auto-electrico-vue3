<template>
  <div class="coche">
    <h2>Componente de coche</h2>
    <!-- Estos son los botones para ejecutar las acciones del coche -->
    <button @click="abrocharCinturones" class="boton-imagen" >
      Abrochar cinturones
      <div v-if="cinturones">
        <img v-bind:src="cinturonesIn" alt="safaty" class="imagen-boton" />
      </div>
      <div v-else>
        <img v-bind:src="cinturonesOut" alt="unsafety" class="imagen-boton" />
      </div>
    </button>

    <div v-if="!puertas">
      <button @click="aperturaPuertas" class="boton-imagen" >
        Abrir puertas
        <img v-bind:src="puertasIn" alt="unsafety" class="imagen-boton" />
      </button>
    </div>
    <div v-else>
      <button @click="cierrePuertas" class="boton-imagen" >
        Cerrar puertas
        <img v-bind:src="puertasOut" alt="unsafety" class="imagen-boton" />
      </button>
    </div>

    <button @click="acelerar(10)">
      Acelerar 10 km/h
    </button>
    <button @click="frenar(10)">
      Frenar 10 km/h
    </button>
    <button @click="resetearVelocimetro">
      Resetear velocímetro
    </button>
    <button @click="resetearOdometro">
      Resetear odómetro
    </button>
    <!-- Este es el párrafo para mostrar el estado del coche -->
    <p>{{ mostrarEstadoDeCoche() }}</p>
  </div>
</template>

<script>
import { ref } from 'vue';
// Importamos el composable general
import { useApi } from '../composables/useApi';

import cinturonesPuestos from '../assets/coche/cinturones-puestos.png';
import cinturonesNoPuestos from '../assets/coche/cinturones-no-puestos.png';
import puertasAbiertas from '../assets/coche/puerta-abierta.png';
import puertasCerradas from '../assets/coche/puerta-cerrada.png';

export default {
  name: 'Coche',
  setup() {

    // Accedemos al composable general
    const api = useApi()

    // Devolvemos las propiedades y funciones que queremos usar en el template
    return {
      puertas: api.puertas,
      cinturonesIn: cinturonesPuestos,
      cinturonesOut: cinturonesNoPuestos,
      puertasIn: puertasAbiertas,
      puertasOut: puertasCerradas,
      // coche
      cinturones: api.cinturonesDeSeguridad,
      abrocharCinturones: api.abrocharCinturones,
      abrirPuertas: api.abrirPuertas,
      cerrarPuertas: api.cerrarPuertas,
      acelerar: api.acelerar,
      frenar: api.frenar,
      resetearVelocimetro: api.resetearVelocimetro,
      resetearOdometro: api.resetearOdometro,
      mostrarEstadoDeCoche: api.mostrarEstadoDeCoche,
      aperturaPuertas: async function(){
        // Llamamos al método del service y esperamos la respuesta
        const response = await api.aperturaPuertas();
        // Si la respuesta es exitosa, actualizamos el store de luces
        if (response.status === 200) {
          this.abrirPuertas()
        }
      },
      cierrePuertas: async function () {
        // Llamamos al método del service y esperamos la respuesta
        const response = await api.cierrePuertas();
        // Si la respuesta es exitosa, actualizamos el store de luces
        if (response.status === 200) {
          this.cerrarPuertas()
        }
      }
    }
  },
}
</script>

<style>
.coche {
  background-color: lightblue;
  border: 2px solid blue;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.coche button {
  width: 230px;
  height: 70px;
  border-radius: 10px;
  font-size: 16px;
  margin: 3px;
}

.boton-imagen {
  /* Usar display flex para alinear los elementos en una fila */
  display: flex;
  /* Usar align-items para centrar los elementos verticalmente */
  align-items: center;
  /* Usar justify-content para distribuir los elementos equitativamente */
  justify-content: space-between;
}

.imagen-boton {
  /* Usar display block para la imagen */
  /* display: block; */
  /* Usar object-fit para ajustar la imagen al contenedor */
  /* object-fit: cover; */
  /* Usar width y height para especificar el tamaño de la imagen */
  width: 60%;
  height: 60%;
  margin-left: 10px;
}
</style>
