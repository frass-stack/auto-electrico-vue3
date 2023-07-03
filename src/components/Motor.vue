<template>
  <div class="motor">
    <!-- Este es el componente que usa useApi para el store de motor -->
    <h2>Componente de motor</h2>
    <!-- Estos son los botones para ejecutar las acciones del motor -->
    <div v-if="encendido">
      <button @click="enviarInformacionYEncenderMotor" class="boton-imagen">
        Encender/Apagar
        <img v-bind:src="power" alt="Power" class="imagen-boton" />
      </button> <!-- este es el nuevo botón -->
    </div>
    <div v-else>
      <button @click="apagarMotorVehiculo" class="boton-imagen">
        Encender/Apagar
        <img v-bind:src="offPower" alt="Power" class="imagen-boton" />
      </button> <!-- este es el nuevo botón -->
    </div>
    <button @click="cargarBateria(10)" class="boton-imagen">
      Cargar batería 10 unidades
      <img v-bind:src="bateryCharge" alt="Battery" class="imagen-boton" />
    </button>
    <button @click="consumirBateria(10)" class="boton-imagen">
      Consumir batería 10 km
      <img v-bind:src="bateryUncharge" alt="Battery" class="imagen-boton" />
    </button>
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

// Importamos las imágenes que queremos usar
import powerImg from '../assets/motor/encenderMotor.jpg'
import offPowerImg from '../assets/motor/apagarMotor.jpg'
import bateryChargeImg from '../assets/motor/cargaBateria.png'
import bateryUnchargeImg from '../assets/motor/descargaBateria.png'

// Asignamos las imágenes importadas a unas propiedades del objeto data
const power = powerImg
const offPower = offPowerImg
const bateryCharge = bateryChargeImg
const bateryUncharge = bateryUnchargeImg

// Accedemos al composable general
const api = useApi()
// Crear una variable reactiva para guardar el mensaje
const mensaje = ref('')

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
const apagarMotorVehiculo = async function() {
  try {
    // Llamar al método del composable y esperar la respuesta
    const response = await api.apagarMotorVehiculo()
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