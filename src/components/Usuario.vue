<template>
    <div class="usuario">
      <!-- Este es el componente que usa useApi para el store de usuario -->
      <h2>Componente de usuario</h2> <!-- movemos el título al principio -->
      <!-- Estas son las secciones de funcionalidad -->
      <div class="registro">
        <label for="email-registro">Email:</label>
        <input id="email-registro" v-model="emailRegistro" type="email" />
        <label for="nombre-registro">Nombre:</label>
        <input id="nombre-registro" v-model="nombreRegistro" type="text" />
        <label for="apellido-registro">Apellido:</label>
        <input id="apellido-registro" v-model="apellidoRegistro" type="text" />
        <button @click="registrarUsuario">Registrar usuario</button>
      </div>
      <div class="login">
        <label for="email-login">Email:</label>
        <input id="email-login" v-model="emailLogin" type="email" />
        <button @click="loguearUsuario">Loguear usuario</button>
        <button @click="desloguearUsuario">Desloguear usuario</button>
      </div>
      <div class="invitado">
        <label for="email-invitado">Email:</label>
        <input id="email-invitado" v-model="emailInvitado" type="email" />
        <label for="nombre-invitado">Nombre:</label>
        <input id="nombre-invitado" v-model="nombreInvitado" type="text" />
        <label for="apellido-invitado">Apellido:</label>
        <input id="apellido-invitado" v-model="apellidoInvitado" type="text" />
        <button @click="agregarInvitado">Agregar invitado</button>
        <button @click="eliminarInvitado">Eliminar invitado</button>
      </div>
      <!-- Estos son los párrafos para mostrar el estado y la lista de usuarios e invitados -->
      <!-- los movemos al final -->
      <p>{{ mostrarEstadoDeUsuario() }}</p>
      <p>{{ mostrarListaDeUsuarios() }}</p>
      <p>{{ mostrarListaDeInvitados() }}</p>
    </div>
  </template>

<script>
// Importamos el composable general
import { ref } from 'vue'
import { useApi } from '../composables/useApi'

export default {
    name: 'Usuario',
    setup() {
        // Accedemos al composable general
        const api = useApi()

        // Creamos unas variables reactivas para los inputs
        const emailRegistro = ref('')
        const nombreRegistro = ref('')
        const apellidoRegistro = ref('')
        const emailLogin = ref('')
        const emailInvitado = ref('')
        const nombreInvitado = ref('')
        const apellidoInvitado = ref('')

        // Devolvemos las propiedades, funciones y variables que queremos usar en el template
        return {
            // usuario
            registrarUsuario: () => api.registrarUsuario(emailRegistro.value, nombreRegistro.value, apellidoRegistro.value),
            loguearUsuario: () => api.loguearUsuario(emailLogin.value),
            desloguearUsuario: api.desloguearUsuario,
            agregarInvitado: () => api.agregarInvitado(emailInvitado.value, nombreInvitado.value, apellidoInvitado.value),
            eliminarInvitado: () => api.eliminarInvitado(emailInvitado.value),
            mostrarEstadoDeUsuario: api.mostrarEstadoDeUsuario,
            mostrarListaDeUsuarios: api.mostrarListaDeUsuarios,
            mostrarListaDeInvitados: api.mostrarListaDeInvitados,

            // variables reactivas
            emailRegistro,
            nombreRegistro,
            apellidoRegistro,
            emailLogin,
            emailInvitado,
            nombreInvitado,
            apellidoInvitado,
        }
    },
}    
</script>

<style>
/* Estilos del componente usuario */
.usuario {
  background-color: lightpink;
  border: 2px solid pink;
  padding: 10px;
  display: inline-block; /* usamos flex para alinear las secciones horizontalmente */
}

.usuario h2 {
  width: 100%; /* hacemos que el título ocupe todo el ancho */
}

.usuario label {
  display: inline-block;
  width: 100px;
}

.usuario input {
  width: 200px;
}

.usuario button {
  width: 200px;
  height: 40px;
  border-radius: 10px;
  font-size: 16px;
  margin: 3px;
}

/* Estos son los estilos para agrupar los inputs y botones de registro, de login y de invitado */
.registro, .login, .invitado {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Estos son los estilos para separar las secciones de registro, de login y de invitado */
.registro, .login {
  margin-right: 10px;
}
</style>