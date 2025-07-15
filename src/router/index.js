// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../store/auth'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/components/auth/RegisterView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'Login', component: LoginView },
    { path: '/register', name: 'Register', component: RegisterView },
    { path: '/dashboard', name: 'dashboard', component: () => import('@/views/DashboardView.vue'), meta: { requiresAuth: true } },
    { path: '/coche', name: 'coche', component: () => import('@/views/CocheView.vue'), meta: { requiresAuth: true } },
    { path: '/luces', name: 'luces', component: () => import('@/views/LucesView.vue'), meta: { requiresAuth: true } },
    { path: '/usuario', name: 'usuario', component: () => import('@/views/UsuarioView.vue'), meta: { requiresAuth: true } },
    { path: '/motor', name: 'motor', component: () => import('@/views/MotorView.vue'), meta: { requiresAuth: true } },
    { path: '/guest-management', name: 'guestManagement', component: () => import('@/views/GuestManagementView.vue'), meta: { requiresAuth: true, requiresOwner: true } }
  ]
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Verificar si el usuario está autenticado
  const isAuthenticated = authStore.isAuthenticated

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresOwner && authStore.user?.role !== 'owner') {
    next('/dashboard')
  } else if (to.path === '/login' && isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
