<template>
  <div id="app" :class="{ 'dark-mode': themeStore.isDarkMode }">
    <router-view v-if="!isAuthenticated" />
    
    <template v-else>
      <header class="app-header">
        <div class="header-left">
          <button class="menu-toggle" @click="toggleMenu" aria-label="Toggle menu">
            <span></span>
            <span></span>
            <span></span>
          </button>
          <h1>Sistema Automóvil Eléctrico</h1>
        </div>
        
        <div class="header-right">
          <div class="user-info">
            <span>{{ user?.name }}</span>
            <span class="user-role" :class="{ 'owner': user?.role === 'owner' }">
              {{ user?.role === 'owner' ? 'Propietario' : 'Invitado' }}
            </span>
            <button class="test-mqtt-button" @click="testMQTT" title="Probar conexión MQTT">
              <i class="fas fa-broadcast-tower"></i>
            </button>
            <button class="logout-button" @click="handleLogout">
              <i class="fas fa-sign-out-alt"></i>
            </button>
          </div>
          <button class="theme-toggle" @click="toggleTheme" aria-label="Cambiar tema">
            <i :class="themeIcon"></i>
          </button>
        </div>
      </header>
      
      <div class="app-container">
        <nav :class="{ 'nav-open': isMenuOpen }">
          <ul class="nav-bar">
            <li v-for="route in navigationRoutes" :key="route.path">
              <router-link 
                :to="route.path" 
                class="nav-link"
                @click="closeMenu"
              >
                <i :class="route.icon"></i>
                <span>{{ route.name }}</span>
              </router-link>
            </li>
          </ul>
        </nav>

        <main class="main-content">
          <router-view />
        </main>
      </div>
    </template>
  </div>
</template>

<script>
import { useThemeStore } from './store/theme'
import { useAuthStore } from './store/auth'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { testMQTTConnection } from './utils/mqttTest'

const NAVIGATION_ROUTES = [
  { path: '/', name: 'Tablero', icon: 'fas fa-tachometer-alt' },
  { path: '/coche', name: 'Coche', icon: 'fas fa-car' },
  { path: '/luces', name: 'Luces', icon: 'fas fa-lightbulb' },
  { path: '/usuario', name: 'Usuario', icon: 'fas fa-user' },
  { path: '/motor', name: 'Motor', icon: 'fas fa-cog' },
  { path: '/guest-management', name: 'Gestión de Usuarios', icon: 'fas fa-users', requiresOwner: true },
];

export default {
  name: 'App',
  setup() {
    const isMenuOpen = ref(false)
    const themeStore = useThemeStore()
    const authStore = useAuthStore()
    const router = useRouter()

    const isAuthenticated = computed(() => authStore.checkAuth())
    const user = computed(() => authStore.user)
    
    const filteredNavigationRoutes = computed(() => {
      return NAVIGATION_ROUTES.filter(route => 
        !route.requiresOwner || user.value?.role === 'owner'
      )
    })

    const toggleMenu = () => {
      isMenuOpen.value = !isMenuOpen.value
    }

    const closeMenu = () => {
      isMenuOpen.value = false
    }

    const toggleTheme = () => {
      themeStore.toggleTheme()
    }

    const handleLogout = () => {
      authStore.logout()
    }

    const testMQTT = () => {
      testMQTTConnection()
    }

    return {
      isMenuOpen,
      themeStore,
      isAuthenticated,
      user,
      navigationRoutes: filteredNavigationRoutes,
      toggleMenu,
      closeMenu,
      toggleTheme,
      handleLogout,
      testMQTT,
      themeIcon: computed(() => themeStore.isDarkMode ? 'fas fa-sun' : 'fas fa-moon')
    }
  }
}
</script>

<style>
:root {
  --primary-color: #0044cc;
  --primary-hover: #386ede;
  --text-color: #2c3e50;
  --text-color-light: #666;
  --bg-color: #ffffff;
  --bg-secondary: #f5f7fa;
  --border-color: #e1e4e8;
  --shadow-color: rgba(0, 0, 0, 0.1);
  --transition-speed: 0.3s;
  --header-height: 64px;
  --sidebar-width: 250px;
}

.dark-mode {
  --primary-color: #386ede;
  --primary-hover: #0044cc;
  --text-color: #ffffff;
  --text-color-light: #a0a0a0;
  --bg-color: #1a1a1a;
  --bg-secondary: #2d2d2d;
  --border-color: #404040;
  --shadow-color: rgba(0, 0, 0, 0.3);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Arial, sans-serif;
  line-height: 1.6;
  color: var(--text-color);
  background-color: var(--bg-color);
  transition: background-color var(--transition-speed), color var(--transition-speed);
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background-color: var(--primary-color);
  color: var(--bg-color);
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: var(--header-height);
  box-shadow: 0 2px 10px var(--shadow-color);
}

.header-left, .header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logout-button {
  background: none;
  border: none;
  color: var(--bg-color);
  cursor: pointer;
  padding: 0.5rem;
  transition: transform var(--transition-speed);
}

.logout-button:hover {
  transform: scale(1.1);
}

.app-container {
  display: flex;
  padding-top: var(--header-height);
  min-height: 100vh;
}

nav {
  background-color: var(--bg-secondary);
  width: var(--sidebar-width);
  height: calc(100vh - var(--header-height));
  position: fixed;
  left: 0;
  top: var(--header-height);
  padding: 1.5rem 1rem;
  transition: transform var(--transition-speed);
  border-right: 1px solid var(--border-color);
  overflow-y: auto;
}

.nav-bar {
  list-style-type: none;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.nav-link {
  color: var(--text-color);
  text-decoration: none;
  padding: 0.875rem 1.25rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all var(--transition-speed);
  font-weight: 500;
}

.nav-link:hover {
  background-color: var(--primary-color);
  color: var(--bg-color);
  transform: translateX(4px);
}

.nav-link.router-link-exact-active {
  background-color: var(--primary-color);
  color: var(--bg-color);
  font-weight: 600;
}

.main-content {
  flex: 1;
  padding: 2rem 2.5rem;
  margin-left: var(--sidebar-width);
  width: calc(100% - var(--sidebar-width));
  min-height: calc(100vh - var(--header-height));
}

.menu-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
}

.menu-toggle span {
  display: block;
  width: 25px;
  height: 3px;
  background-color: var(--bg-color);
  margin: 5px 0;
  transition: var(--transition-speed);
}

.theme-toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: var(--bg-color);
  font-size: 1.2rem;
  transition: transform var(--transition-speed);
}

.theme-toggle:hover {
  transform: scale(1.1);
}

@media (max-width: 768px) {
  :root {
    --header-height: 56px;
  }

  .app-header {
    padding: 0.75rem 1rem;
  }

  .menu-toggle {
    display: block;
  }

  nav {
    transform: translateX(-100%);
    z-index: 999;
  }

  .nav-open {
    transform: translateX(0);
  }

  .main-content {
    margin-left: 0;
    width: 100%;
    padding: 1.5rem 1rem;
  }

  .nav-open .menu-toggle span:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
  }

  .nav-open .menu-toggle span:nth-child(2) {
    opacity: 0;
  }

  .nav-open .menu-toggle span:nth-child(3) {
    transform: rotate(-45deg) translate(5px, -5px);
  }
}

.user-role {
  font-size: 0.875rem;
  color: var(--text-color-light);
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  background-color: var(--bg-secondary);
}

.user-role.owner {
  background-color: #ffaa00;
  color: var(--bg-color);
}

.test-mqtt-button {
  background: none;
  border: none;
  color: var(--bg-color);
  cursor: pointer;
  padding: 0.5rem;
  transition: transform var(--transition-speed);
  margin-right: 0.5rem;
}

.test-mqtt-button:hover {
  transform: scale(1.1);
  color: #4CAF50;
}
</style>