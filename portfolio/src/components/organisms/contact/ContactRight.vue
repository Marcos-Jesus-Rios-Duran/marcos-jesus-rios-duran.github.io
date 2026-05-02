<!-- src/components/organisms/contact/ContactRight.vue -->
<template>
  <div class="contact-right">

    <!-- CV Section -->
    <div class="cv-card info-card">
      <h3 class="card-title">{{ t('contact.cv.title') }}</h3>

      <!-- Selector idioma CV -->
      <div class="cv-tabs">
        <button
          class="cv-tab"
          :class="{ active: cvLang === 'es' }"
          @click="cvLang = 'es'"
        >🇲🇽 Español</button>
        <button
          class="cv-tab"
          :class="{ active: cvLang === 'en' }"
          @click="cvLang = 'en'"
        >🇺🇸 English</button>
      </div>

      <!-- PDF Preview -->
      <div class="cv-preview">
        <iframe
          :src="`/cv/cv-${cvLang}.pdf`"
          class="cv-iframe"
          :title="`CV ${cvLang.toUpperCase()}`"
        />
      </div>

      <!-- Botón descarga -->
      <a
        :href="`/cv/cv-${cvLang}.pdf`"
        :download="`Marcos-Rios-CV-${cvLang.toUpperCase()}.pdf`"
        class="btn-download"
      >
        ⬇️ {{ t('contact.cv.download') }} ({{ cvLang.toUpperCase() }})
      </a>
    </div>

    <!-- Formulario EmailJS -->
    <div class="form-card info-card">
      <h3 class="card-title">{{ t('contact.form.title') }}</h3>

      <form class="contact-form" @submit.prevent="sendEmail">

        <div class="form-group">
          <label class="form-label">{{ t('contact.form.name') }}</label>
          <input
            v-model="form.name"
            type="text"
            class="form-input"
            :placeholder="t('contact.form.name_placeholder')"
            required
          />
        </div>

        <div class="form-group">
          <label class="form-label">{{ t('contact.form.email') }}</label>
          <input
            v-model="form.email"
            type="email"
            class="form-input"
            :placeholder="t('contact.form.email_placeholder')"
            required
          />
        </div>

        <div class="form-group">
          <label class="form-label">{{ t('contact.form.message') }}</label>
          <textarea
            v-model="form.message"
            class="form-input form-textarea"
            :placeholder="t('contact.form.message_placeholder')"
            rows="4"
            required
          />
        </div>

        <button type="submit" class="btn-send" :disabled="sending">
          <span v-if="!sending">{{ t('contact.form.send') }} 🚀</span>
          <span v-else>{{ t('contact.form.sending') }}...</span>
        </button>

        <!-- Feedback -->
        <p v-if="feedbackMsg" class="feedback-msg" :class="feedbackType">
          {{ feedbackMsg }}
        </p>

      </form>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// CV lang toggle
const cvLang = ref('es')

// Form state
const form = ref({ name: '', email: '', message: '' })
const sending = ref(false)
const feedbackMsg = ref('')
const feedbackType = ref('') // 'success' | 'error'

const EMAILJS_SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const EMAILJS_PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

async function sendEmail() {
  sending.value = true
  feedbackMsg.value = ''

  try {
    // Carga EmailJS dinámicamente (sin instalar nada)
    const emailjs = await import('https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js')

    await emailjs.default.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        from_name:    form.value.name,
        from_email:   form.value.email,
        message:      form.value.message,
        to_name:      'Marcos',
      },
      EMAILJS_PUBLIC_KEY
    )

    feedbackMsg.value = t('contact.form.success')
    feedbackType.value = 'success'
    form.value = { name: '', email: '', message: '' }

  } catch (err) {
    console.error('EmailJS error:', err)
    feedbackMsg.value = t('contact.form.error')
    feedbackType.value = 'error'
  } finally {
    sending.value = false
  }
}
</script>

<style scoped>
.contact-right {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* === BASE CARD === */
.info-card {
  background: rgba(255,255,255,0.82);
  border: 2px solid rgba(255,179,204,0.28);
  border-radius: 20px;
  padding: 32px;
  backdrop-filter: blur(10px);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.info-card:hover {
  border-color: rgba(255,143,171,0.45);
  box-shadow: 0 8px 32px rgba(255,143,171,0.12);
}

[data-theme="dark"] .info-card {
  background: rgba(15,15,25,0.65);
  border-color: rgba(0,229,255,0.14);
}

[data-theme="dark"] .info-card:hover {
  border-color: rgba(0,229,255,0.3);
  box-shadow: 0 8px 32px rgba(0,229,255,0.08);
}

.card-title {
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--texto);
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid rgba(255,179,204,0.35);
  letter-spacing: -0.01em;
}

[data-theme="dark"] .card-title {
  border-bottom-color: rgba(0,229,255,0.18);
}

/* === CV TABS === */
.cv-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}

.cv-tab {
  padding: 8px 20px;
  border-radius: 50px;
  border: 2px solid rgba(255,179,204,0.4);
  background: transparent;
  color: var(--textoSub);
  font-weight: 700;
  font-size: 0.88rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cv-tab:hover {
  border-color: rgba(255,143,171,0.6);
  color: #c0446a;
}

.cv-tab.active {
  background: linear-gradient(135deg, rgba(255,179,204,0.35), rgba(255,143,171,0.25));
  border-color: rgba(255,143,171,0.6);
  color: #c0446a;
}

[data-theme="dark"] .cv-tab {
  border-color: rgba(0,229,255,0.2);
}

[data-theme="dark"] .cv-tab:hover,
[data-theme="dark"] .cv-tab.active {
  border-color: rgba(0,229,255,0.5);
  color: #00e5ff;
  background: rgba(0,229,255,0.08);
}

/* === CV PREVIEW === */
.cv-preview {
  width: 100%;
  height: 320px;
  border-radius: 12px;
  overflow: hidden;
  border: 1.5px solid rgba(255,179,204,0.3);
  margin-bottom: 16px;
  background: rgba(255,255,255,0.5);
}

[data-theme="dark"] .cv-preview {
  border-color: rgba(0,229,255,0.15);
  background: rgba(10,10,20,0.5);
}

.cv-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

/* === DOWNLOAD BTN === */
.btn-download {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 13px 20px;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(255,179,204,0.3), rgba(255,143,171,0.22));
  border: 2px solid rgba(255,143,171,0.45);
  color: #a03055;
  font-weight: 800;
  font-size: 0.95rem;
  text-decoration: none;
  transition: all 0.25s ease;
  letter-spacing: 0.02em;
}

.btn-download:hover {
  background: linear-gradient(135deg, rgba(255,143,171,0.4), rgba(255,100,150,0.3));
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255,143,171,0.2);
}

[data-theme="dark"] .btn-download {
  background: rgba(0,229,255,0.1);
  border-color: rgba(0,229,255,0.3);
  color: #00e5ff;
}

[data-theme="dark"] .btn-download:hover {
  background: rgba(0,229,255,0.18);
  box-shadow: 0 8px 20px rgba(0,229,255,0.12);
}

/* === FORM === */
.contact-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.form-label {
  font-size: 0.78rem;
  font-weight: 800;
  color: #c0446a;
  text-transform: uppercase;
  letter-spacing: 0.07em;
}

[data-theme="dark"] .form-label {
  color: #00e5ff;
}

.form-input {
  padding: 12px 16px;
  border-radius: 12px;
  border: 2px solid rgba(255,179,204,0.35);
  background: rgba(255,255,255,0.7);
  color: #1a0812;
  font-size: 0.95rem;
  font-weight: 500;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  font-family: inherit;
  resize: none;
}

.form-input:focus {
  border-color: rgba(255,143,171,0.65);
  box-shadow: 0 0 0 3px rgba(255,143,171,0.12);
  background: rgba(255,255,255,0.92);
}

[data-theme="dark"] .form-input {
  background: rgba(15,15,30,0.7);
  border-color: rgba(0,229,255,0.18);
  color: rgba(255,255,255,0.88);
}

[data-theme="dark"] .form-input:focus {
  border-color: rgba(0,229,255,0.45);
  box-shadow: 0 0 0 3px rgba(0,229,255,0.08);
}

.form-textarea {
  resize: vertical;
  min-height: 110px;
}

/* === SEND BUTTON === */
.btn-send {
  padding: 14px 24px;
  border-radius: 14px;
  background: linear-gradient(135deg, #FF8FAB, #FF6B9D);
  border: none;
  color: #fff;
  font-weight: 800;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.25s ease;
  letter-spacing: 0.02em;
  font-family: inherit;
}

.btn-send:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(255,107,157,0.35);
}

.btn-send:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

[data-theme="dark"] .btn-send {
  background: linear-gradient(135deg, #00e5ff, #00bcd4);
  color: #0a0a0f;
}

[data-theme="dark"] .btn-send:hover:not(:disabled) {
  box-shadow: 0 8px 24px rgba(0,229,255,0.25);
}

/* === FEEDBACK === */
.feedback-msg {
  font-size: 0.92rem;
  font-weight: 600;
  padding: 12px 16px;
  border-radius: 10px;
  text-align: center;
}

.feedback-msg.success {
  background: rgba(22,163,74,0.1);
  color: #16a34a;
  border: 1.5px solid rgba(22,163,74,0.25);
}

.feedback-msg.error {
  background: rgba(220,38,38,0.08);
  color: #dc2626;
  border: 1.5px solid rgba(220,38,38,0.2);
}
</style>