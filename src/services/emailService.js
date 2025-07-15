import sgMail from '@sendgrid/mail'

// Configurar API key de SendGrid
sgMail.setApiKey(import.meta.env.VITE_SENDGRID_API_KEY)

export const emailService = {
  async sendEmail(to, subject, content) {
    try {
      const msg = {
        to,
        from: import.meta.env.VITE_FROM_EMAIL,
        subject,
        html: content,
      }

      await sgMail.send(msg)
      return true
    } catch (error) {
      console.error('Error en el envío de correo:', error)
      throw new Error('Error al enviar el correo electrónico')
    }
  }
} 