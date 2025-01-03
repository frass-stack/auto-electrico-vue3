<template>
  <div id="app">
    <h1>Sistema Automóvil Eléctrico</h1>
    <nav>
      <ul class="nav-bar">
        <li v-for="route in navigationRoutes" :key="route.path">
          <router-link :to="route.path" class="nav-link">{{ route.name }}</router-link>
        </li>
      </ul>
    </nav>
    <router-view />
  </div>
</template>

<script>
const NAVIGATION_ROUTES = [
  { path: '/', name: 'Tablero' },
  { path: '/coche', name: 'Coche' },
  { path: '/luces', name: 'Luces' },
  { path: '/usuario', name: 'Usuario' },
  { path: '/motor', name: 'Motor' },
];

export default {
  name: 'App',
  computed: {
    navigationRoutes() {
      return NAVIGATION_ROUTES;
    },
  },
};
</script>

<style>
/* General Styles */
#app {
  text-align: center;
  font-family: Arial, sans-serif;
}

h1 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 20px;
}

/* Navigation Bar Styles */
nav {
  background-color: #0044cc;
  padding: 10px 15px;
}

.nav-bar {
  list-style-type: none;
  display: flex;
  justify-content: space-around; /* Espacia los elementos horizontalmente */
  margin: 0;
  padding: 0;
}

.nav-bar li {
  margin: 0; /* Eliminamos márgenes innecesarios */
}

.nav-link {
  color: white;
  text-decoration: none;
  font-size: 1.2rem;
  padding: 10px 20px;
  border-radius: 5px;
}

/* Hover / Active States */
.nav-link:hover {
  background-color: #386ede; /* Color más oscuro al pasar el mouse */
  transition: background-color 0.3s ease;
}

.nav-link.router-link-exact-active {
  font-weight: bold;
  border-bottom: 2px solid white; /* Marca la ruta activa */
}
</style>