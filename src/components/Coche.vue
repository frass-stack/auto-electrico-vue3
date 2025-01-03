<template>
  <div class="coche">
    <h1>Control del Coche</h1>

    <!-- Sección de estado visual -->
    <div class="estado-coche">
      <div class="tarjeta">
        <img :src="cinturones ? cinturonesIn : cinturonesOut" alt="Estado Cinturones" />
        <h3>{{ cinturones ? 'Cinturones abrochados' : 'Cinturones desabrochados' }}</h3>
        <button @click="abrocharCinturones" class="btn">
          {{ cinturones ? 'Desabrochar' : 'Abrochar' }}
        </button>
      </div>

      <div class="tarjeta">
        <img :src="puertas ? puertasOut : puertasIn" alt="Estado Puertas" />
        <h3>{{ puertas ? 'Puertas cerradas' : 'Puertas abiertas' }}</h3>
        <button @click="puertas ? cierrePuertas() : aperturaPuertas()" class="btn">
          {{ puertas ? 'Abrir puertas' : 'Cerrar puertas' }}
        </button>
      </div>
    </div>

    <!-- Controles del coche -->
    <div class="controles">
      <h2>Controles de Velocidad</h2>
      <div class="botones">
        <button @click="acelerar(10)" class="btn">Acelerar +10 km/h</button>
        <button @click="frenar(10)" class="btn btn-secondary">Frenar -10 km/h</button>
        <button @click="resetearVelocimetro" class="btn btn-warning">Resetear velocímetro</button>
        <button @click="resetearOdometro" class="btn btn-danger">Resetear odómetro</button>
      </div>
    </div>

    <!-- Estado del coche -->
    <p class="estado">{{ mostrarEstadoDeCoche() }}</p>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useApi } from '../composables/useApi';

import cinturonesPuestos from '../assets/coche/cinturones-puestos.png';
import cinturonesNoPuestos from '../assets/coche/cinturones-no-puestos.png';
import puertasAbiertas from '../assets/coche/puerta-abierta.png';
import puertasCerradas from '../assets/coche/puerta-cerrada.png';

export default {
  name: 'Coche',
  setup() {
    const api = useApi();

    return {
      puertas: api.puertas,
      cinturones: api.cinturonesDeSeguridad,
      cinturonesIn: cinturonesPuestos,
      cinturonesOut: cinturonesNoPuestos,
      puertasIn: puertasAbiertas,
      puertasOut: puertasCerradas,
      abrocharCinturones: api.abrocharCinturones,
      acelerar: api.acelerar,
      frenar: api.frenar,
      resetearVelocimetro: api.resetearVelocimetro,
      resetearOdometro: api.resetearOdometro,
      mostrarEstadoDeCoche: api.mostrarEstadoDeCoche,
      aperturaPuertas: async () => {
        const response = await api.aperturaPuertas();
        if (response.status === 200) api.abrirPuertas();
      },
      cierrePuertas: async () => {
        const response = await api.cierrePuertas();
        if (response.status === 200) api.cerrarPuertas();
      },
    };
  },
};
</script>

<style scoped>
/* Contenedor Principal */
.coche {
  max-width: 960px;
  margin: 20px auto;
  padding: 20px;
  background: #ffffff;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  font-family: 'Arial', sans-serif;
  text-align: center;
}

.coche h1 {
  font-size: 24px;
  color: #333;
  margin-bottom: 30px;
}

/* Sección de estado del coche */
.estado-coche {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.tarjeta {
  background: #f9f9f9;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.tarjeta img {
  height: 120px;
  margin-bottom: 15px;
}

.tarjeta h3 {
  font-size: 18px;
  color: #555;
  margin-bottom: 10px;
}

.tarjeta button {
  margin-top: auto;
}

/* Controles */
.controles {
  margin-bottom: 30px;
}

.controles h2 {
  font-size: 20px;
  color: #333;
  margin-bottom: 20px;
}

.botones {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

/* Botones */
.btn {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn:hover {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
}

.btn-secondary:hover {
  background-color: #545b62;
}

.btn-warning {
  background-color: #ffc107;
}

.btn-warning:hover {
  background-color: #e0a800;
}

.btn-danger {
  background-color: #dc3545;
}

.btn-danger:hover {
  background-color: #c82333;
}

/* Estado general */
.estado {
  font-size: 16px;
  color: #666;
  margin-top: 20px;
}
</style>