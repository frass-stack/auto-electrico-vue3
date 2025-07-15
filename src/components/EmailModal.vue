<template>
  <div v-if="isOpen" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>Compartir por Email</h3>
        <button class="close-button" @click="closeModal">&times;</button>
      </div>
      
      <form @submit.prevent="handleSubmit" class="email-form">
        <div class="form-group">
          <label for="to">Para:</label>
          <input 
            type="email" 
            id="to" 
            v-model="formData.to" 
            required
            placeholder="correo@ejemplo.com"
          >
        </div>

        <div class="form-group">
          <label>Contenido:</label>
          <textarea 
            v-model="formData.body"
            rows="10"
            readonly
            class="email-content"
          ></textarea>
        </div>

        <div class="modal-actions">
          <button 
            type="button" 
            class="cancel-button"
            @click="closeModal"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            class="send-button"
            :disabled="sending"
          >
            {{ sending ? 'Enviando...' : 'Enviar' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'

export default {
  name: 'EmailModal',
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    content: {
      type: String,
      required: true
    }
  },
  emits: ['close', 'send'],
  setup(props, { emit }) {
    const sending = ref(false)
    const formData = ref({
      to: '',
      body: props.content
    })

    watch(() => props.content, (newContent) => {
      formData.value.body = newContent
    })

    const closeModal = () => {
      emit('close')
      formData.value.to = ''
    }

    const handleSubmit = async () => {
      try {
        sending.value = true
        // Aquí podríamos integrar con un servicio de correo real
        // Por ahora, simularemos un envío
        await new Promise(resolve => setTimeout(resolve, 1000))
        emit('send', formData.value)
        closeModal()
      } catch (error) {
        console.error('Error al enviar email:', error)
      } finally {
        sending.value = false
      }
    }

    return {
      formData,
      sending,
      closeModal,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: var(--bg-secondary);
  border-radius: 8px;
  padding: 1.5rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.modal-header h3 {
  margin: 0;
  color: var(--text-color);
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-color);
}

.email-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: var(--text-color);
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--bg-color);
  color: var(--text-color);
}

.email-content {
  resize: vertical;
  min-height: 150px;
  font-family: monospace;
  white-space: pre-wrap;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.modal-actions button {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.modal-actions button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.cancel-button {
  background-color: var(--bg-color);
  color: var(--text-color);
  border: 1px solid var(--border-color) !important;
}

.send-button {
  background-color: #ea4335;
  color: white;
}

.send-button:not(:disabled):hover,
.cancel-button:not(:disabled):hover {
  transform: translateY(-1px);
}
</style> 