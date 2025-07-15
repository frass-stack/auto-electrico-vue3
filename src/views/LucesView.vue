<template>
  <div class="luces-view">
    <h2>Control de Luces</h2>
    <div class="luces-grid">
      <div class="luz-card">
        <span>Luz Alta</span>
        <button :class="lucesAltasYBajas ? 'btn-on' : 'btn-off'" @click="cambiarLucesAltasYBajas">{{ lucesAltasYBajas ? 'Apagar' : 'Prender' }}</button>
      </div>
      <div class="luz-card">
        <span>Luz Baja</span>
        <button :class="lucesAltasYBajas ? 'btn-on' : 'btn-off'" @click="cambiarLucesAltasYBajas">{{ lucesAltasYBajas ? 'Apagar' : 'Prender' }}</button>
      </div>
      <div class="luz-card">
        <span>Luz Interior</span>
        <button :class="luzInterior ? 'btn-on' : 'btn-off'" @click="luzInterior ? desactivarLuzInterior() : activarLuzInterior()">{{ luzInterior ? 'Apagar' : 'Prender' }}</button>
      </div>
      <div class="luz-card">
        <span>Baliza</span>
        <button :class="balizas ? 'btn-on' : 'btn-off'" @click="balizas ? desactivarBalizas() : activarBalizas()">{{ balizas ? 'Apagar' : 'Prender' }}</button>
      </div>
      <div class="luz-card">
        <span>Reflector LED</span>
        <button :class="reflector ? 'btn-on' : 'btn-off'" @click="reflector ? desactivarReflector() : activarReflector()">{{ reflector ? 'Apagar' : 'Prender' }}</button>
      </div>
    </div>
  </div>
</template>
<script>
import { computed } from 'vue'
import { useLucesStore } from '@/store/luces'
export default {
  name: 'LucesView',
  setup() {
    const lucesStore = useLucesStore()
    // Computed para reactividad total
    const lucesAltasYBajas = computed(() => lucesStore.lucesAltasYBajas)
    const luzInterior = computed(() => lucesStore.luzInterior)
    const balizas = computed(() => lucesStore.balizas)
    const reflector = computed(() => lucesStore.reflector)
    return {
      lucesAltasYBajas,
      cambiarLucesAltasYBajas: lucesStore.cambiarLucesAltasYBajas,
      luzInterior,
      activarLuzInterior: lucesStore.activarLuzInterior,
      desactivarLuzInterior: lucesStore.desactivarLuzInterior,
      balizas,
      activarBalizas: lucesStore.activarBalizas,
      desactivarBalizas: lucesStore.desactivarBalizas,
      reflector,
      activarReflector: lucesStore.activarReflector,
      desactivarReflector: lucesStore.desactivarReflector
    }
  }
}
</script>
<style scoped>
.luces-view { padding: 2rem; }
.luces-grid { display: flex; gap: 2rem; flex-wrap: wrap; }
.luz-card { background: #fff; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); padding: 1.5rem; min-width: 180px; display: flex; flex-direction: column; align-items: center; gap: 1rem; }
.luz-card button { padding: 0.5rem 1.2rem; border: none; border-radius: 5px; color: #fff; cursor: pointer; font-weight: 600; transition: background 0.2s; }
.btn-off { background: #1976d2; }
.btn-on { background: #43a047; }
.luz-card button:active { filter: brightness(0.9); }
</style> 