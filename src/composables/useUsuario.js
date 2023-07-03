import { computed } from 'vue'
import { useUsuarioStore } from '../store/usuario.js'

export function useUsuario() { // accedemos al store de usuario 
    const usuario = useUsuarioStore()

// creamos unas propiedades computadas para acceder al estado del usuario 
const usuarioActual = computed(() => usuario.usuarioActual) 
const usuarios = computed(() => usuario.usuarios) 
const invitados = computed(() => usuario.invitados)

// creamos unas funciones para ejecutar las acciones del usuario 
function registrarUsuario(email, nombre, apellido) { 
    return usuario.registrarUsuario(email, nombre, apellido) 
}

function loguearUsuario(email) { usuario.loguearUsuario(email) }

function desloguearUsuario() { usuario.desloguearUsuario() }

function agregarInvitado(email, nombre, apellido) { 
    return usuario.agregarInvitado(email, nombre, apellido) 
}

function eliminarInvitado(email) { usuario.eliminarInvitado(email) }

function mostrarEstadoDeUsuario() { return usuario.mostrarEstadoDeUsuario() }

function mostrarListaDeUsuarios() { return usuario.mostrarListaDeUsuarios() }

function mostrarListaDeInvitados() { return usuario.mostrarListaDeInvitados() }

// devolvemos las propiedades y funciones que queremos exponer 
return { 
    usuarioActual, 
    usuarios, 
    invitados, 
    registrarUsuario, 
    loguearUsuario, 
    desloguearUsuario, 
    agregarInvitado, 
    eliminarInvitado, 
    mostrarEstadoDeUsuario, 
    mostrarListaDeUsuarios, 
    mostrarListaDeInvitados, 
}}