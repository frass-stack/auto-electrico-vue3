<template>
  <div class="luces">
    <!-- Este es el componente que usa useApi para el store de luces -->
    <h2>Componente de luces</h2>
    <!-- Estos son los botones para ejecutar las acciones de las luces -->
    <div v-if="!lucesAltasYBajas">
      <button @click="encenderLuzAlta" class="boton-imagen">
        Encender luz alta
        <img v-bind:src="lucesAltasIn" alt="safaty" class="imagen-boton" />
      </button>
    </div>
    <div v-else>
      <button @click="apagarLuzAlta">Apagar luz alta</button>
    </div>

    <div v-if="!balizas">
      <button @click="encenderBalizas" class="boton-imagen">
        Encender balizas
        <img v-bind:src="balizasIn" alt="balizas" class="imagen-boton" />
      </button>
    </div>
    <div v-else>
      <button @click="apagarBalizas" class="boton-imagen">
        Apagar balizas
        <img v-bind:src="balizasOut" alt="balizas-out" class="imagen-boton" />
      </button>
    </div>

    <div v-if="!lucesAltasYBajas">
      <button @click="encenderLuzBaja">Encender luz baja</button>
    </div>
    <div v-else>
      <button @click="apagarLuzBaja">Apagar luz baja</button>
    </div>

    <div v-if="!luzInterior">
      <button @click="encenderLuzInterior" class="boton-imagen">
        Encender luz interior
        <img v-bind:src="luzInteriorIn" alt="safaty" class="imagen-boton" />
      </button>
    </div>
    <div v-else>
      <button @click="apagarLuzInterior">Apagar luz interior</button>
    </div>

    <div v-if="!reflector">
      <button @click="encenderReflector" class="boton-imagen">
        Encender reflector
        <img v-bind:src="reflectorIn" alt="safaty" class="imagen-boton" />
      </button>
    </div>
    <div v-else>
      <button @click="apagarReflector">Apagar reflector</button>
    </div>

    <!-- Este es el párrafo para mostrar el estado de las luces -->
    <p>{{ mostrarEstadoDeLuces() }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
// Importamos el composable general
import { useApi } from '../composables/useApi'

import lucesAltasIn from '../assets/luces/luz-alta-encendida.png';
import luzInteriorIn from '../assets/luces/luz-interior-in.png';
import reflectorIn from '../assets/luces/reflector-in.png';
import balizasIn from '../assets/luces/balizas.jpg';
import balizasOut from '../assets/luces/balizas-out.png';

// Accedemos al composable general
const api = useApi()

// Accedemos a los métodos del lucesService
const {
  luzAltaEncender,
  luzAltaApagar,
  luzBajaEncender,
  luzBajaApagar,
  LuzInteriorEncender,
  LuzInteriorApagar,
  reflectorEncender,
  reflectorApagar,
  balizasEncender,
  balizasApagar
} = api;

// Accedemos al store de luces
const {
  lucesAltasYBajas,
  luzInterior,
  reflector,
  balizas,
  activarLucesDeGiro,
  desactivarLucesDeGiro,
  activarBalizas,
  desactivarBalizas,
  cambiarLucesAltasYBajas,
  mostrarEstadoDeLuces,
  activarLuzInterior,
  desactivarLuzInterior,
  activarReflector,
  desactivarReflector,
} = api;

// Creamos funciones que llamen a los métodos del lucesService y actualicen el store de luces según la respuesta

const encenderLuzAlta = async () => {
  // Llamamos al método del service y esperamos la respuesta
  const response = await luzAltaEncender();
  // Si la respuesta es exitosa, actualizamos el store de luces
  if (response.status === 200) {
    cambiarLucesAltasYBajas('altas');
    alta.value = true;
    baja.value = false;
  }
};

const apagarLuzAlta = async () => {
  // Llamamos al método del service y esperamos la respuesta
  const response = await luzAltaApagar();
  // Si la respuesta es exitosa, actualizamos el store de luces
  if (response.status === 200) {
    cambiarLucesAltasYBajas('apagadas');
    alta.value = false;
    baja.value = false
  }
};

const encenderLuzBaja = async () => {
  // Llamamos al método del service y esperamos la respuesta
  const response = await luzBajaEncender();
  // Si la respuesta es exitosa, actualizamos el store de luces
  if (response.status === 200) {
    cambiarLucesAltasYBajas('bajas');
    baja.value = true;
    alta.value = false;
  }
};

const apagarLuzBaja = async () => {
  // Llamamos al método del service y esperamos la respuesta
  const response = await luzBajaApagar();
  // Si la respuesta es exitosa, actualizamos el store de luces
  if (response.status === 200) {
    cambiarLucesAltasYBajas('apagadas');
    baja.value = false;
    alta.value = false;
  }
};

const encenderLuzInterior = async () => {
  // Llamamos al método del service y esperamos la respuesta
  const response = await LuzInteriorEncender();
  // Si la respuesta es exitosa, actualizamos el store de luces
  if (response.status === 200) {
    // Aquí deberías actualizar alguna propiedad del store de luces que indique el estado de la luz interior
    activarLuzInterior()
  }
};

const apagarLuzInterior = async () => {
  // Llamamos al método del service y esperamos la respuesta
  const response = await LuzInteriorApagar();
  // Si la respuesta es exitosa, actualizamos el store de luces
  if (response.status === 200) {
    // Aquí deberías actualizar alguna propiedad del store de luces que indique el estado de la luz interior
    desactivarLuzInterior()
  }
};

const encenderReflector = async () => {
  // Llamamos al método del service y esperamos la respuesta
  const response = await reflectorEncender();
  // Si la respuesta es exitosa, actualizamos el store de luces
  if (response.status === 200) {
    // Aquí deberías actualizar alguna propiedad del store de luces que indique el estado del reflector
    activarReflector()
  }
};

const apagarReflector = async () => {
  // Llamamos al método del service y esperamos la respuesta
  const response = await reflectorApagar();
  // Si la respuesta es exitosa, actualizamos el store de luces
  if (response.status === 200) {
    // Aquí deberías actualizar alguna propiedad del store de luces que indique el estado del reflector
    desactivarReflector()
  }
};

const encenderBalizas = async () => {
  // Llamamos al método del service y esperamos la respuesta
  const response = await balizasEncender();
  // Si la respuesta es exitosa, actualizamos el store de luces
  if (response.status === 200) {
    // Aquí deberías actualizar alguna propiedad del store de luces que indique el estado del reflector
    activarBalizas()
  }
};

const apagarBalizas = async () => {
  // Llamamos al método del service y esperamos la respuesta
  const response = await balizasApagar();
  // Si la respuesta es exitosa, actualizamos el store de luces
  if (response.status === 200) {
    // Aquí deberías actualizar alguna propiedad del store de luces que indique el estado del reflector
    desactivarBalizas()
  }
};

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
  width: 270px;
  /* aumentamos el ancho del botón */
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
