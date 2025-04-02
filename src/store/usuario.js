// stores/usuario.js
import { defineStore } from 'pinia'

export const useUsuarioStore = defineStore('usuario', {
  state: () => {
    return {
      usuarioActual: null, // el usuario que está logueado actualmente
      usuarios: [], // la lista de usuarios registrados
      invitados: [], // la lista de invitados con permisos de acceso
    }
  },
  actions: {
    // aquí puedes definir las acciones que modifican el estado, por ejemplo:
    registrarUsuario(email, nombre, apellido) {
      // validar que el email no esté en uso
      const usuarioExistente = this.usuarios.find(u => u.email === email)
      if (usuarioExistente) {
        throw new Error('El email ya está en uso')
      }
      // crear un nuevo usuario con los datos recibidos
      const nuevoUsuario = { email, nombre, apellido }
      // añadir el nuevo usuario a la lista de usuarios
      this.usuarios.push(nuevoUsuario)
      // devolver el nuevo usuario creado
      return nuevoUsuario
    },
    loguearUsuario(email) {
      // buscar el usuario con el email recibido
      const usuarioEncontrado = this.usuarios.find(u => u.email === email)
      if (!usuarioEncontrado) {
        throw new Error('El email no está registrado')
      }
      // asignar el usuario encontrado al usuario actual
      this.usuarioActual = usuarioEncontrado
    },
    desloguearUsuario() {
      // asignar null al usuario actual
      this.usuarioActual = null
    },
    agregarInvitado(email, nombre, apellido) {
      // validar que el email no esté en uso por otro invitado o usuario
      const invitadoExistente = this.invitados.find(i => i.email === email)
      const usuarioExistente = this.usuarios.find(u => u.email === email)
      if (invitadoExistente || usuarioExistente) {
        throw new Error('El email ya está en uso')
      }
      // crear un nuevo invitado con los datos recibidos
      const nuevoInvitado = { email, nombre, apellido }
      // añadir el nuevo invitado a la lista de invitados
      this.invitados.push(nuevoInvitado)
      // devolver el nuevo invitado creado
      return nuevoInvitado
    },
    eliminarInvitado(email) {
      // buscar el índice del invitado con el email recibido
      const indiceInvitado = this.invitados.findIndex(i => i.email === email)
      if (indiceInvitado === -1) {
        throw new Error('El email no corresponde a ningún invitado')
      }
      // eliminar el invitado de la lista de invitados
      this.invitados.splice(indiceInvitado, 1)
    },
    mostrarEstadoDeUsuario() {
      if (this.usuarioActual) {
        return `El usuario actual es ${this.usuarioActual.nombre} ${this.usuarioActual.apellido} con el email ${this.usuarioActual.email}`
      } else {
        return 'No hay ningún usuario logueado'
      }
    },
    mostrarListaDeUsuarios() {
        if (this.usuarios.length === 0) {
          return 'No hay ningún usuario registrado'
        } else {
          return `Los usuarios registrados son: ${this.usuarios.map(u => `${u.nombre} ${u.apellido} (${u.email})`).join(', ')}`
        }
      },
      mostrarListaDeInvitados() {
        if (this.invitados.length === 0) {
          return 'No hay ningún invitado con permiso de acceso'
        } else {
          return `Los invitados con permiso de acceso son: ${this.invitados.map(i => `${i.nombre} ${i.apellido} (${i.email})`).join(', ')}`
        }
      },
      // etc.
    },
  })
  
