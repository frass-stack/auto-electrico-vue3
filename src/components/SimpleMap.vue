<template>
  <div class="map-container">
    <div ref="mapRef" class="map"></div>
  </div>
</template>

<script>
import { onMounted, onUnmounted, ref } from 'vue'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

export default {
  name: 'SimpleMap',
  setup() {
    const mapRef = ref(null)
    let map = null
    let marker = null

    onMounted(() => {
      // Coordenadas de Buenos Aires
      const buenosAires = [-34.6037, -58.3816]

      // Inicializar el mapa
      map = L.map(mapRef.value).setView(buenosAires, 13)

      // Añadir el layer de OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map)

      // Añadir marcador
      marker = L.marker(buenosAires).addTo(map)
      marker.bindPopup('Ubicación del Vehículo')
    })

    onUnmounted(() => {
      if (map) {
        map.remove()
      }
    })

    return {
      mapRef
    }
  }
}
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 300px;
  border-radius: 8px;
  overflow: hidden;
}

.map {
  width: 100%;
  height: 100%;
}
</style> 