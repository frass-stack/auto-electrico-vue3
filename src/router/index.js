// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../store/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/components/auth/LoginView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/components/auth/RegisterView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/coche',
      name: 'coche',
      component: () => import('@/views/CocheView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/luces',
      name: 'luces',
      component: () => import('@/views/LucesView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/usuario',
      name: 'usuario',
      component: () => import('@/views/UsuarioView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/motor',
      name: 'motor',
      component: () => import('@/views/MotorView.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.checkAuth()

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
