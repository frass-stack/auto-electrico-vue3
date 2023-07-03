// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Tablero from '../components/Tablero.vue' // importamos el componente Tablero
import Coche from '../components/Coche.vue' // importamos el componente Coche
import Luces from '../components/Luces.vue' // importamos el componente Luces
import Usuario from '../components/Usuario.vue' // importamos el componente Usuario
import Motor from '../components/Motor.vue' // importamos el componente Motor

// definimos las rutas
const routes = [
  {
    path: '/',
    name: 'Tablero',
    component: Tablero, // este es el componente que se muestra en la ruta raíz
  },
  {
    path: '/coche',
    name: 'Coche',
    component: Coche, // este es el componente que se muestra en la ruta /coche
  },
  {
    path: '/luces',
    name: 'Luces',
    component: Luces, // este es el componente que se muestra en la ruta /luces
  },
  {
    path: '/usuario',
    name: 'Usuario',
    component: Usuario, // este es el componente que se muestra en la ruta /usuario
  },
  {
    path: '/motor',
    name: 'Motor',
    component: Motor, // este es el componente que se muestra en la ruta /motor
  },
]

// creamos el router
const router = createRouter({
  history: createWebHistory(''),
  routes,
})

// exportamos el router
export default router
