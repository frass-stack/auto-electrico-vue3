<template>
  <div class="share-buttons">
    <button @click="shareByEmail" class="share-button email">
      <i class="fas fa-envelope"></i>
      Compartir por Email
    </button>
    <button @click="shareByWhatsApp" class="share-button whatsapp">
      <i class="fab fa-whatsapp"></i>
      Compartir por WhatsApp
    </button>
  </div>
</template>

<script>
import { shareService } from '@/services/shareService'

export default {
  name: 'ShareButtons',
  setup() {
    const shareByEmail = () => {
      shareService.shareByEmail()
    }

    const shareByWhatsApp = () => {
      shareService.shareByWhatsApp()
    }

    return {
      shareByEmail,
      shareByWhatsApp
    }
  }
}
</script>

<style scoped>
.share-buttons {
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
}

.share-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: transform 0.2s;
}

.share-button:hover {
  transform: translateY(-2px);
}

.share-button.email {
  background-color: #ea4335;
  color: white;
}

.share-button.whatsapp {
  background-color: #25d366;
  color: white;
}

.share-button i {
  font-size: 1.2rem;
}
</style> 