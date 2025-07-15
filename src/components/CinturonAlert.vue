<template>
  <div v-if="show" class="alert-overlay">
    <div class="alert-modal">
      <div class="alert-header">
        <i class="fas fa-exclamation-triangle"></i>
        <span>¡Atención!</span>
      </div>
      <div class="alert-body">
        <p>Por favor, abrocha el cinturón de seguridad.</p>
      </div>
      <button class="alert-btn" @click="$emit('close')">Entendido</button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean
})
defineEmits(['close'])
</script>

<style scoped>
.alert-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex; align-items: center; justify-content: center;
  z-index: 2000;
}
.alert-modal {
  background: #fff;
  border-radius: 12px;
  padding: 2rem 2.5rem;
  box-shadow: 0 4px 24px rgba(0,0,0,0.18);
  text-align: center;
  min-width: 300px;
  max-width: 90vw;
}
.alert-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  color: #e65100;
  margin-bottom: 1rem;
  justify-content: center;
}
.alert-body {
  font-size: 1.15rem;
  color: #333;
  margin-bottom: 1.5rem;
}
.alert-btn {
  background: #e65100;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.7rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.alert-btn:hover {
  background: #ff9800;
}
</style> 