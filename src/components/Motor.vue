<template>
  <div class="motor">
    <!-- Este es el componente que usa useApi para el store de motor -->
    <h2>Componente de motor</h2>
    <!-- Estos son los botones para ejecutar las acciones del motor -->
    <button @click="enviarInformacionYEncenderMotor">Encender/Apagar</button> <!-- este es el nuevo botón -->
    <button @click="cargarBateria(10)">Cargar batería 10 unidades</button>
    <button @click="consumirBateria(10)">Consumir batería 10 km</button>
    <button @click="resetearBateria">Resetear batería</button>
    <!-- Estos son los párrafos para mostrar el estado del motor -->
    <p>El motor está {{ encendido ? 'encendido' : 'apagado' }}</p> <!-- este es el nuevo párrafo -->
    <p>{{ mostrarEstadoDeBateria() }}</p>
    <!-- Opcionalmente, mostrar un mensaje con el resultado de la operación -->
    <p>{{ mensaje }}</p>
  </div>
</template>

<script setup>
// Importamos el composable general
import { useApi } from '../composables/useApi'
import { ref } from 'vue' // Importar ref para crear una variable reactiva

// Accedemos al composable general
const api = useApi()

// Usamos const para declarar las propiedades y funciones que queremos usar en el template

// motor
const encendido = api.encendido
const toggleEncendido = api.toggleEncendido
const cargarBateria = api.cargarBateria
const consumirBateria = api.consumirBateria
const resetearBateria = api.resetearBateria
const mostrarEstadoDeBateria = api.mostrarEstadoDeBateria
// Importar el método para enviar la información y encender el motor
const enviarInformacionYEncenderMotor = async function() {
  try {
    // Llamar al método del composable y esperar la respuesta
    const response = await api.enviarInformacionYEncenderMotor()
    // Si la respuesta es exitosa, actualizar el estado del motor a encendido
    if (response.status === 200) {
      toggleEncendido()
    }
    // Mostrar un mensaje de confirmación o de error según el caso
    mensaje.value = response.message
  } catch (error) {
    // Si hay algún error, mostrarlo en la consola y en el mensaje
    console.error(error)
    mensaje.value = 'Ha ocurrido un error al enviar la información o al encender el motor.'
  }
}
// Crear una variable reactiva para guardar el mensaje
const mensaje = ref('')
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