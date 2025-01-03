<template>
  <div class="usuario">
    <h2>Gestión de Usuarios</h2>

    <nav class="tabs">
      <!-- Pestañas de navegación -->
      <button
          v-for="tab in tabs"
          :key="tab.id"
          :class="{ active: currentTab === tab.id }"
          @click="currentTab = tab.id"
      >
        {{ tab.name }}
      </button>
    </nav>

    <div class="tab-content">
      <!-- Contenido dinámico basado en la pestaña seleccionada -->
      <div v-if="currentTab === 'register'">
        <h3>Registrar Usuario</h3>
        <div class="form-group">
          <label for="email-registro">Email:</label>
          <input id="email-registro" v-model="emailRegistro" type="email" placeholder="Ingrese su email..." />
        </div>
        <div class="form-group">
          <label for="nombre-registro">Nombre:</label>
          <input id="nombre-registro" v-model="nombreRegistro" type="text" placeholder="Ingrese su nombre..." />
        </div>
        <div class="form-group">
          <label for="apellido-registro">Apellido:</label>
          <input id="apellido-registro" v-model="apellidoRegistro" type="text" placeholder="Ingrese su apellido..." />
        </div>
        <div class="button-group">
          <button @click="registrarUsuario">Registrar</button>
        </div>
      </div>

      <div v-if="currentTab === 'login'">
        <h3>Iniciar Sesión</h3>
        <div class="form-group">
          <label for="email-login">Email:</label>
          <input id="email-login" v-model="emailLogin" type="email" placeholder="Ingrese su email..." />
        </div>
        <div class="button-group">
          <button @click="loguearUsuario">Iniciar Sesión</button>
          <button @click="desloguearUsuario" class="secondary-btn">Cerrar Sesión</button>
        </div>
      </div>

      <div v-if="currentTab === 'guest-management'">
        <h3>Gestionar Invitados</h3>
        <div class="form-group">
          <label for="email-invitado">Email:</label>
          <input id="email-invitado" v-model="emailInvitado" type="email" placeholder="Ingrese el email del invitado..." />
        </div>
        <div class="form-group">
          <label for="nombre-invitado">Nombre:</label>
          <input id="nombre-invitado" v-model="nombreInvitado" type="text" placeholder="Ingrese el nombre..." />
        </div>
        <div class="form-group">
          <label for="apellido-invitado">Apellido:</label>
          <input id="apellido-invitado" v-model="apellidoInvitado" type="text" placeholder="Ingrese el apellido..." />
        </div>
        <div class="button-group">
          <button @click="agregarInvitado">Agregar Invitado</button>
          <button @click="eliminarInvitado" class="secondary-btn">Eliminar Invitado</button>
        </div>
      </div>
    </div>

    <!-- Sección de Estado -->
    <div class="estado">
      <p><strong>Estado del Usuario:</strong> {{ mostrarEstadoDeUsuario() }}</p>
      <p><strong>Lista de Usuarios:</strong> {{ mostrarListaDeUsuarios() }}</p>
      <p><strong>Lista de Invitados:</strong> {{ mostrarListaDeInvitados() }}</p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useApi } from '../composables/useApi';

export default {
  name: 'Usuario',
  setup() {
    const api = useApi();

    // Pestañas y estado
    const currentTab = ref('register');
    const tabs = [
      { id: 'register', name: 'Registrar' },
      { id: 'login', name: 'Login' },
      { id: 'guest-management', name: 'Invitados' },
    ];

    // Variables reactivas
    const emailRegistro = ref('');
    const nombreRegistro = ref('');
    const apellidoRegistro = ref('');
    const emailLogin = ref('');
    const emailInvitado = ref('');
    const nombreInvitado = ref('');
    const apellidoInvitado = ref('');

    return {
      currentTab,
      tabs,

      registrarUsuario: () => api.registrarUsuario(emailRegistro.value, nombreRegistro.value, apellidoRegistro.value),
      loguearUsuario: () => api.loguearUsuario(emailLogin.value),
      desloguearUsuario: api.desloguearUsuario,
      agregarInvitado: () => api.agregarInvitado(emailInvitado.value, nombreInvitado.value, apellidoInvitado.value),
      eliminarInvitado: () => api.eliminarInvitado(emailInvitado.value),
      mostrarEstadoDeUsuario: api.mostrarEstadoDeUsuario,
      mostrarListaDeUsuarios: api.mostrarListaDeUsuarios,
      mostrarListaDeInvitados: api.mostrarListaDeInvitados,

      emailRegistro,
      nombreRegistro,
      apellidoRegistro,
      emailLogin,
      emailInvitado,
      nombreInvitado,
      apellidoInvitado,
    };
  },
};
</script>

<style>
/* Contenedor principal */
.usuario {
  max-width: 800px;
  margin: auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  font-family: 'Arial', sans-serif;
}

.usuario h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #222;
}

/* Pestañas */
.tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.tabs button {
  padding: 12px 20px;
  margin: 0 5px;
  background-color: #f0f0f0;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
}

.tabs button.active {
  background-color: #007bff;
  color: white;
  font-weight: bold;
}

.tabs button:hover {
  background-color: #0056b3;
  color: white;
}

/* Formularios */
.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

.form-group label {
  margin-bottom: 5px;
  font-size: 14px;
  color: #444;
}

.form-group input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.form-group input:focus {
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

/* Botones */
.button-group {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

button {
  padding: 12px;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

button:hover {
  filter: brightness(0.9);
}

button.secondary-btn {
  background-color: #6c757d;
  color: white;
}

button.secondary-btn:hover {
  background-color: #545b62;
}
</style>