<template>
  <div class="tablero">
    <h1 class="titulo">Panel de Control</h1>
    <div class="grid">
      <div
          class="tarjeta"
          v-for="(item, index) in items"
          :key="index"
      >
        <img :src="item.img" :alt="item.name" class="imagen" />
        <h2>{{ item.name }}</h2>
        <component :is="item.component" />
      </div>
    </div>
  </div>
</template>

<script>
import Coche from './Coche.vue';
import Luces from './Luces.vue';
import Motor from './Motor.vue';

import cocheImg from '../assets/coche.png';
import lucesImg from '../assets/luces.jpg';
import motorImg from '../assets/motor.jpg';

export default {
  name: 'Tablero',
  components: {
    Coche,
    Luces,
    Motor,
  },
  data() {
    return {
      items: [
        { name: 'Coche', img: cocheImg, component: 'Coche' },
        { name: 'Luces', img: lucesImg, component: 'Luces' },
        { name: 'Motor', img: motorImg, component: 'Motor' },
      ],
    };
  },
};
</script>

<style>
.tablero {
  background-color: #f5f7fa;
  padding: 30px 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
}

.titulo {
  font-family: 'Poppins', Arial, sans-serif;
  font-size: 2rem;
  color: #333;
  margin-bottom: 20px;
  font-weight: bold;
  text-align: center;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); /* Aumenta el tamaño mínimo */
  gap: 30px; /* Incrementa el espacio entre las tarjetas */
  width: 100%;
  max-width: 1200px;
  margin: 0 auto; /* Centra el grid */
  justify-items: center; /* Asegura que las tarjetas estén centradas */
}

.tarjeta {
  background: #ffffff;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 100%; /* Asegura que las tarjetas ocupen el ancho permitido */
  max-width: 280px; /* Limita el ancho máximo para evitar tarjetas demasiado grandes */
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.tarjeta:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.tarjeta h2 {
  font-size: 1.4rem;
  font-weight: 500;
  color: #555;
  margin-top: 10px;
}


.tarjeta .imagen {
  width: 80px;
  height: auto;
  margin-bottom: 15px;
}

/* Añadir espaciado adicional para el contenido dentro de las tarjetas */
.tarjeta > *:not(:first-child) {
  margin-top: 20px;
}

/* Ajustes de responsividad */
@media (max-width: 768px) {
  .tarjeta {
    padding: 15px;
  }

  .tarjeta h2 {
    font-size: 1.2rem;
  }

  .titulo {
    font-size: 1.8rem;
  }
}
</style>
