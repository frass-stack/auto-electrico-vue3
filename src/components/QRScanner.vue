<template>
  <div class="qr-scanner">
    <video ref="video" class="scanner-video"></video>
    <div class="scanner-overlay">
      <div class="scanner-line"></div>
    </div>
    <div class="scanner-actions">
      <button @click="startScanning" v-if="!isScanning" class="btn-scan">
        <i class="fas fa-qrcode"></i> Escanear QR
      </button>
      <button @click="stopScanning" v-else class="btn-stop">
        <i class="fas fa-stop"></i> Detener
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { BrowserQRCodeReader } from '@zxing/library'

export default {
  name: 'QRScanner',
  emits: ['qr-detected'],
  setup(props, { emit }) {
    const video = ref(null)
    const isScanning = ref(false)
    let codeReader = null

    const startScanning = async () => {
      try {
        isScanning.value = true
        codeReader = new BrowserQRCodeReader()
        const result = await codeReader.decodeFromVideoDevice(null, video.value, (result) => {
          if (result) {
            emit('qr-detected', result.text)
            stopScanning()
          }
        })
      } catch (error) {
        console.error('Error al iniciar el escáner:', error)
        isScanning.value = false
      }
    }

    const stopScanning = () => {
      if (codeReader) {
        codeReader.reset()
        isScanning.value = false
      }
    }

    onUnmounted(() => {
      stopScanning()
    })

    return {
      video,
      isScanning,
      startScanning,
      stopScanning
    }
  }
}
</script>

<style scoped>
.qr-scanner {
  position: relative;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.scanner-video {
  width: 100%;
  height: 300px;
  object-fit: cover;
  background-color: #000;
}

.scanner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.scanner-line {
  width: 80%;
  height: 2px;
  background: #4CAF50;
  position: absolute;
  animation: scan 2s linear infinite;
}

@keyframes scan {
  0% {
    top: 0;
  }
  50% {
    top: 100%;
  }
  100% {
    top: 0;
  }
}

.scanner-actions {
  padding: 1rem;
  display: flex;
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);
}

.btn-scan, .btn-stop {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.btn-scan {
  background: #4CAF50;
  color: white;
}

.btn-stop {
  background: #f44336;
  color: white;
}

.btn-scan:hover, .btn-stop:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style> 