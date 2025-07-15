<template>
  <div class="qr-generator">
    <qrcode-vue :value="qrValue" :size="size" level="H" />
    <div class="qr-info">
      <p>Escanea este código QR para acceder a la aplicación desde tu dispositivo móvil</p>
      <button @click="copyToClipboard" class="btn-copy">
        <i class="fas fa-copy"></i> Copiar URL
      </button>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import QrcodeVue from 'qrcode.vue'

export default {
  name: 'QRGenerator',
  components: {
    QrcodeVue
  },
  props: {
    url: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const size = 200

    const qrValue = computed(() => props.url)

    const copyToClipboard = async () => {
      try {
        await navigator.clipboard.writeText(props.url)
        alert('URL copiada al portapapeles')
      } catch (err) {
        console.error('Error al copiar URL:', err)
      }
    }

    return {
      size,
      qrValue,
      copyToClipboard
    }
  }
}
</script>

<style scoped>
.qr-generator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.qr-info {
  text-align: center;
  color: #666;
}

.btn-copy {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #2196F3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.btn-copy:hover {
  background: #1976D2;
  transform: translateY(-2px);
}
</style> 