// App.vue
<template>
  <div id="app">
    <!-- Este es el componente raíz de la app -->
    <h1>App</h1>
    <!-- Este es el menú para navegar entre los componentes -->
    <nav>
      <ul>
        <li><router-link to="/">Tablero</router-link></li>
        <li><router-link to="/coche">Coche</router-link></li>
        <li><router-link to="/luces">Luces</router-link></li>
        <li><router-link to="/usuario">Usuario</router-link></li>
        <li><router-link to="/motor">Motor</router-link></li>
      </ul>
    </nav>
    <!-- Este es el componente que se renderiza según la ruta -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>
