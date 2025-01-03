<template>
  <div class="motor">
    <h2 class="titulo">Control del Motor</h2>

    <!-- Indicador del estado del motor -->
    <div class="estado-motor">
      <p>Estado del Motor:</p>
      <div :class="['indicador', encendido ? 'activo' : 'inactivo']"></div>
      <p>{{ encendido ? 'Encendido' : 'Apagado' }}</p>
    </div>

    <!-- Botón principal de encendido/apagado -->
    <button
        @click="encendido ? apagarMotorVehiculo() : enviarInformacionYEncenderMotor()"
        class="boton-principal"
    >
      {{ encendido ? 'Apagar Motor' : 'Encender Motor' }}
      <img :src="encendido ? offPower : power" alt="Power" class="imagen-boton" />
    </button>

    <!-- Información del estado de batería -->
    <div class="informacion-bateria">
      <h3>Estado de la Batería</h3>
      <ul>
        <li>
          <strong>Carga actual:</strong> {{ mostrarEstadoDeBateria() }}
        </li>
        <li>
          <strong>Consumo estimado:</strong> {{ consumoCalculado }} km
        </li>
        <li>
          <strong>Estado:</strong> {{ estadoBateria }}
        </li>
      </ul>
    </div>

    <!-- Controles de la batería -->
    <div class="controles">
      <button @click="cargarBateria(10)" class="boton-secundario">
        Cargar batería
        <img :src="bateryCharge" alt="Cargar batería" />
      </button>
      <button @click="consumirBateria(10)" class="boton-secundario">
        Consumir batería
        <img :src="bateryUncharge" alt="Consumir batería" />
      </button>
      <button @click="resetearBateria" class="boton-secundario">
        Resetear batería
      </button>
    </div>

    <!-- Mensaje de respuesta -->
    <p class="mensaje">{{ mensaje }}</p>
  </div>
</template>

<script setup>
// Importamos el composable para manejar las operaciones del motor
import { useApi } from '../composables/useApi';
import { ref, computed } from 'vue'; // Usamos computed para cálculos derivados

// Importamos las imágenes
import powerImg from '../assets/motor/encenderMotor.jpg';
import offPowerImg from '../assets/motor/apagarMotor.jpg';
import bateryChargeImg from '../assets/motor/cargaBateria.png';
import bateryUnchargeImg from '../assets/motor/descargaBateria.png';

// Asignación de imágenes
const power = powerImg;
const offPower = offPowerImg;
const bateryCharge = bateryChargeImg;
const bateryUncharge = bateryUnchargeImg;

// Acceso al composable
const api = useApi();
const mensaje = ref('');

// Variables reactivas
const encendido = api.encendido;
const toggleEncendido = api.toggleEncendido;
const cargarBateria = api.cargarBateria;
const consumirBateria = api.consumirBateria;
const resetearBateria = api.resetearBateria;
const mostrarEstadoDeBateria = api.mostrarEstadoDeBateria;

// Información derivada sobre la batería
const consumoCalculado = computed(() => (encendido ? '10-20' : '0')); // Ajusta los valores según tu lógica
const estadoBateria = computed(() => {
  const carga = api.bateria; // Ejemplo de propiedad (ajústalo según tu composable)
  if (carga >= 80) return 'Alta';
  if (carga >= 40) return 'Media';
  return 'Baja';
});

// Funciones personalizadas
const enviarInformacionYEncenderMotor = async () => {
  try {
    const response = await api.enviarInformacionYEncenderMotor();
    if (response.status === 200) toggleEncendido();
    mensaje.value = response.message;
  } catch (error) {
    console.error(error);
    mensaje.value = 'Error al encender el motor.';
  }
};

const apagarMotorVehiculo = async () => {
  try {
    const response = await api.apagarMotorVehiculo();
    if (response.status === 200) toggleEncendido();
    mensaje.value = response.message;
  } catch (error) {
    console.error(error);
    mensaje.value = 'Error al apagar el motor.';
  }
};
</script>

<style scoped>
/* Estilo general */
.motor {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f9f9fc;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  padding: 20px;
  width: 100%;
  max-width: 400px;
  margin: 20px auto;
}

.titulo {
  font-size: 1.8rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

/* Indicador de estado */
.estado-motor {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 10px;
  margin-bottom: 20px;
  width: 100%;
}

.indicador {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid #ccc;
}

.indicador.activo {
  background-color: green;
  border-color: green;
}

.indicador.inactivo {
  background-color: red;
  border-color: red;
}

/* Información de la batería */
.informacion-bateria {
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 15px;
  width: 100%;
  margin-bottom: 20px;
}

.informacion-bateria h3 {
  font-size: 1.2rem;
  color: #333;
  border-bottom: 1px solid #ccc;
  padding-bottom: 10px;
  margin-bottom: 10px;
}

.informacion-bateria ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.informacion-bateria li {
  font-size: 1rem;
  color: #555;
  margin: 5px 0;
}

/* Botones */
.boton-principal {
  background-color: #007bff;
  color: white;
  font-size: 1.2rem;
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: background-color 0.3s ease;
  cursor: pointer;
  margin-bottom: 15px;
}

.boton-principal:hover {
  background-color: #0056b3;
}

.boton-secundario {
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  font-size: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-bottom: 10px;
}

.boton-secundario:hover {
  background-color: #e6e6e6;
}
</style>