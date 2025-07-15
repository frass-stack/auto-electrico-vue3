<template>
  <div class="share-buttons">
    <button @click="openEmailModal" class="share-button email" :disabled="isSharing">
      <i class="fas fa-envelope"></i>
      Compartir por Email
    </button>
    <button @click="shareByWhatsApp" class="share-button whatsapp" :disabled="isSharing">
      <i class="fab fa-whatsapp"></i>
      Compartir por WhatsApp
    </button>

    <EmailModal 
      :is-open="showEmailModal"
      :content="emailContent"
      @close="showEmailModal = false"
      @send="handleEmailSend"
    />
  </div>
</template>

<script>
import { ref } from 'vue'
import { shareService } from '@/services/shareService'
import EmailModal from './EmailModal.vue'
import { useToast } from 'vue-toastification'

export default {
  name: 'ShareButtons',
  components: {
    EmailModal
  },
  setup() {
    const toast = useToast()
    const isSharing = ref(false)
    const showEmailModal = ref(false)
    const emailContent = ref('')

    const openEmailModal = () => {
      emailContent.value = shareService.generateEmailContent()
      showEmailModal.value = true
    }

    const handleEmailSend = async (data) => {
      try {
        isSharing.value = true
        await shareService.sendEmail(data)
        toast.success("¡Correo enviado exitosamente!", {
          icon: "✉️"
        })
      } catch (error) {
        console.error('Error al enviar el correo:', error)
        toast.error("Error al enviar el correo. Por favor, intente más tarde.", {
          icon: "❌"
        })
      } finally {
        isSharing.value = false
      }
    }

    const shareByWhatsApp = async () => {
      try {
        isSharing.value = true
        await shareService.shareByWhatsApp()
      } catch (error) {
        console.error('Error al compartir por WhatsApp:', error)
      } finally {
        isSharing.value = false
      }
    }

    return {
      isSharing,
      showEmailModal,
      emailContent,
      openEmailModal,
      handleEmailSend,
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
  transition: all 0.2s;
  opacity: 1;
}

.share-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.share-button:not(:disabled):hover {
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