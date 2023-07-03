<template>
  <div class="coche">
    <h2>Componente de coche</h2>
    <!-- Estos son los botones para ejecutar las acciones del coche -->
    <button @click="abrocharCinturones">Abrochar cinturones</button>
    <button @click="aperturaPuertas">Abrir puertas</button>
    <button @click="cierrePuertas">Cerrar puertas</button>
    <button @click="acelerar(10)">Acelerar 10 km/h</button>
    <button @click="frenar(10)">Frenar 10 km/h</button>
    <button @click="resetearVelocimetro">Resetear velocímetro</button>
    <button @click="resetearOdometro">Resetear odómetro</button>
    <!-- Este es el párrafo para mostrar el estado del coche -->
    <p>{{ mostrarEstadoDeCoche() }}</p>
  </div>
</template>

<script>
// Importamos el composable general
import { useApi } from '../composables/useApi'

export default {
  name: 'Coche',
  setup() {
    // Accedemos al composable general
    const api = useApi()

    // Devolvemos las propiedades y funciones que queremos usar en el template
    return {
      // coche
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
  width: 200px;
  height: 40px;
  border-radius: 10px;
  font-size: 16px;
  margin: 3px;
}
</style>
