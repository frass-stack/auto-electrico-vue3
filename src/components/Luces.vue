<template>
  <div class="luces">
    <!-- Este es el componente que usa useApi para el store de luces -->
    <h2>Componente de luces</h2>
    <!-- Estos son los botones para ejecutar las acciones de las luces -->
    <button @click="encenderLuzAlta">Encender luz alta</button>
    <button @click="apagarLuzAlta">Apagar luz alta</button>
    <button @click="encenderBalizas">Encender balizas</button>
    <button @click="apagarBalizas">Apagar balizas</button>
    <button @click="encenderLuzBaja">Encender luz baja</button>
    <button @click="apagarLuzBaja">Apagar luz baja</button>
    <button @click="encenderLuzInterior">Encender luz interior</button>
    <button @click="apagarLuzInterior">Apagar luz interior</button>
    <button @click="encenderReflector">Encender reflector</button>
    <button @click="apagarReflector">Apagar reflector</button>
    <!-- Este es el párrafo para mostrar el estado de las luces -->
    <p>{{ mostrarEstadoDeLuces() }}</p>
  </div>
</template>

<script setup>
// Importamos el composable general
import { useApi } from '../composables/useApi'

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
  }
};

const apagarLuzAlta = async () => {
  // Llamamos al método del service y esperamos la respuesta
  const response = await luzAltaApagar();
  // Si la respuesta es exitosa, actualizamos el store de luces
  if (response.status === 200) {
    cambiarLucesAltasYBajas('apagadas');
  }
};

const encenderLuzBaja = async () => {
  // Llamamos al método del service y esperamos la respuesta
  const response = await luzBajaEncender();
  // Si la respuesta es exitosa, actualizamos el store de luces
  if (response.status === 200) {
    cambiarLucesAltasYBajas('bajas');
  }
};

const apagarLuzBaja = async () => {
  // Llamamos al método del service y esperamos la respuesta
  const response = await luzBajaApagar();
  // Si la respuesta es exitosa, actualizamos el store de luces
  if (response.status === 200) {
    cambiarLucesAltasYBajas('apagadas');
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
  width: 350px;
  /* aumentamos el ancho del botón */
  height: 40px;
  border-radius: 10px;
  font-size: 16px;
  margin: 3px;
}
</style>
