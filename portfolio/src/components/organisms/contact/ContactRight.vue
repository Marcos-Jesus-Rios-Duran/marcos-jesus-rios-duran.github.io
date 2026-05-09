<!-- src/components/organisms/contact/ContactRight.vue -->
<template>
  <div class="contact-right">
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
          <span v-if="!sending">{{ t('contact.form.send') }} <IconWrapper name="send" color="light" size="sm" style="vertical-align: middle; margin-left: 4px;" /></span>
          <span v-else>{{ t('contact.form.sending') }}...</span>
        </button>

        <!-- Feedback -->
        <p v-if="feedbackMsg" class="feedback-msg" :class="feedbackType">
          {{ feedbackMsg }}
        </p>

      </form>
    </div>

    <!-- CV Modal -->
    <transition name="modal" @after-leave="onModalClosed">
      <div v-if="showCVModal" class="cv-modal-overlay" @click="closeCVModal">
        <div class="cv-modal" @click.stop>
          <!-- Header -->
          <div class="cv-modal-header">
            <h2>{{ t('contact.cv.title') }}</h2>
            <button class="cv-modal-close" @click="closeCVModal"><IconWrapper name="close" color="text" size="md" /></button>
          </div>

          <!-- Tabs -->
          <div class="cv-modal-tabs">
            <button
              class="cv-modal-tab"
              :class="{ active: cvLang === 'en' }"
              @click="cvLang = 'en'"
            >🇺🇸 English</button>
            <button
              class="cv-modal-tab"
              :class="{ active: cvLang === 'es' }"
              @click="cvLang = 'es'"
            >🇲🇽 Español</button>
          </div>

          <!-- PDF Preview -->
          <div class="cv-modal-preview">
            <iframe
              v-if="cvEverOpened"
              v-show="showCVModal"
              :src="cvPreviewSrc"
              class="cv-modal-iframe"
            />
            <div v-if="cvPdfLoading" class="cv-modal-loading">
              {{ t('contact.cv.loading') }}
            </div>
          </div>

          <!-- Download Button -->
          <a
            :href="`/cv/cv-${cvLang}.pdf`"
            :download="`Marcos-Rios-CV-${cvLang.toUpperCase()}.pdf`"
            class="cv-modal-download"
          >
            <IconWrapper name="download" color="text" size="md" />
            {{ t('contact.cv.download') }} ({{ cvLang.toUpperCase() }})
          </a>
        </div>
      </div>
    </transition>

    <!-- Floating Button -->
    <button class="cv-floating-btn" @click="openCVModal" :title="t('contact.cv.title')">
      <span class="cv-float-icon">📄</span>
      <span class="cv-float-label">CV</span>
    </button>

  </div>
</template>

<script setup>
import emailjs from '@emailjs/browser'
import { ref, onMounted, reactive, computed, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import IconWrapper from '@/components/atoms/IconWrapper.vue'

const canvasPaused = inject('canvasPaused', null)
const cvEverOpened = ref(false)
const { t } = useI18n()

const showCVModal = ref(false)
const cvLang = ref('en')
const cvPdfUrls = reactive({ en: '', es: '' })
const cvPdfLoading = ref(false)

const CV_LANGS = ['en', 'es']
const cvPrefetchState = {
  promise: null,
}

async function loadCvPdf(lang) {
  if (cvPdfUrls[lang]) return cvPdfUrls[lang]

  const response = await fetch(`/cv/cv-${lang}.pdf`, { cache: 'force-cache' })
  if (!response.ok) {
    throw new Error(`Failed to load CV PDF: ${lang}`)
  }

  const blob = await response.blob()
  const objectUrl = URL.createObjectURL(blob)
  cvPdfUrls[lang] = objectUrl
  return objectUrl
}

function prefetchCvPdfs() {
  if (cvPrefetchState.promise) return cvPrefetchState.promise

  cvPrefetchState.promise = Promise.all(CV_LANGS.map((lang) => loadCvPdf(lang)))
    .catch((error) => {
      console.warn('CV PDF prefetch failed:', error)
    })

  return cvPrefetchState.promise
}

const cvPreviewSrc = computed(() => cvPdfUrls[cvLang.value] || `/cv/cv-${cvLang.value}.pdf`)

async function ensureActiveCvPdf() {
  cvPdfLoading.value = true

  try {
    await loadCvPdf(cvLang.value)
  } catch (error) {
    console.warn('CV PDF load failed:', error)
  } finally {
    cvPdfLoading.value = false
  }
}

onMounted(() => {
  prefetchCvPdfs()
})

const onModalClosed = () => {
  // Espera un tick antes de reactivar para no bloquear la transición
  setTimeout(() => {
    if (canvasPaused) canvasPaused.value = false
  }, 50)
}

const openCVModal = () => {
  cvEverOpened.value = true
  showCVModal.value = true
  // Evitar CLS al ocultar scrollbar: añadir padding-right equivalente al ancho del scrollbar
  const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth
  if (scrollBarWidth > 0) document.body.style.paddingRight = `${scrollBarWidth}px`
  document.body.style.overflow = 'hidden'
  if (canvasPaused) canvasPaused.value = true // ← pausa el canvas al abrir el modal
  void ensureActiveCvPdf()
}

const closeCVModal = () => {
  showCVModal.value = false
  // Restaurar estilos aplicados al abrir
  document.body.style.overflow = 'auto'
  document.body.style.paddingRight = ''
}

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
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        from_name:  form.value.name,
        from_email: form.value.email,
        message:    form.value.message,
        to_name:    'Marcos',
        year:       new Date().getFullYear(),
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

/* === CV MODAL === */
.cv-modal-overlay {
padding-top: 70px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.cv-modal {
  background: rgba(255,255,255,0.95);
  border-radius: 20px;
  width: 90%;
  max-width: 900px;
  height: 90vh;
  display: flex;
  flex-direction: column;
  padding: 0;
  box-shadow: 0 20px 60px rgba(0,0,0,0.25);
  overflow: hidden;
}

[data-theme="dark"] .cv-modal {
  background: rgba(15,15,25,0.95);
  box-shadow: 0 20px 60px rgba(0,0,0,0.5);
}

.cv-modal-header {
  padding: 20px 28px;
  border-bottom: 2px solid rgba(255,179,204,0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

[data-theme="dark"] .cv-modal-header {
  border-bottom-color: rgba(0,229,255,0.12);
}

.cv-modal-header h2 {
  margin: 0;
  font-size: 1.4rem;
  color: #1a0812;
  font-weight: 800;
}

[data-theme="dark"] .cv-modal-header h2 {
  color: #fff;
}

.cv-modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.cv-modal-close:hover {
  background: rgba(255,179,204,0.1);
  color: #c0446a;
}

[data-theme="dark"] .cv-modal-close {
  color: #aaa;
}

[data-theme="dark"] .cv-modal-close:hover {
  background: rgba(0,229,255,0.1);
  color: #00e5ff;
}

.cv-modal-tabs {
  display: flex;
  gap: 10px;
  padding: 12px 28px;
  border-bottom: 1px solid rgba(255,179,204,0.15);
}

[data-theme="dark"] .cv-modal-tabs {
  border-bottom-color: rgba(0,229,255,0.08);
}

.cv-modal-tab {
  padding: 8px 20px;
  border-radius: 50px;
  border: 2px solid rgba(255,179,204,0.4);
  background: transparent;
  color: #666;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cv-modal-tab:hover {
  border-color: rgba(255,143,171,0.6);
  color: #c0446a;
}

.cv-modal-tab.active {
  background: linear-gradient(135deg, rgba(255,179,204,0.35), rgba(255,143,171,0.25));
  border-color: rgba(255,143,171,0.6);
  color: #c0446a;
}

[data-theme="dark"] .cv-modal-tab {
  border-color: rgba(0,229,255,0.2);
  color: #aaa;
}

[data-theme="dark"] .cv-modal-tab:hover,
[data-theme="dark"] .cv-modal-tab.active {
  border-color: rgba(0,229,255,0.5);
  color: #00e5ff;
  background: rgba(0,229,255,0.08);
}

.cv-modal-preview {
  flex: 1;
  position: relative;
  overflow: hidden;
  padding: 0 28px 28px;
  border-radius: 12px;
}

.cv-modal-iframe {
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 12px;
}

.cv-modal-loading {
  position: absolute;
  inset: 0 28px 28px 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: rgba(255,255,255,0.72);
  color: #1a0812;
  font-weight: 700;
  backdrop-filter: blur(8px);
  pointer-events: none;
}

[data-theme="dark"] .cv-modal-loading {
  background: rgba(15,15,25,0.72);
  color: rgba(255,255,255,0.9);
}

.cv-modal-download {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  margin: 0 28px 28px;
  width: calc(100% - 56px);
  background: linear-gradient(135deg, rgba(255,179,204,0.3), rgba(255,143,171,0.22));
  border: 2px solid rgba(255,143,171,0.45);
  border-radius: 14px;
  color: #a03055;
  text-decoration: none;
  font-weight: 800;
  font-size: 0.95rem;
  transition: all 0.25s ease;
}

.cv-modal-download:hover {
  background: linear-gradient(135deg, rgba(255,143,171,0.4), rgba(255,100,150,0.3));
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255,143,171,0.2);
}

[data-theme="dark"] .cv-modal-download {
  background: rgba(0,229,255,0.1);
  border-color: rgba(0,229,255,0.3);
  color: #00e5ff;
}

[data-theme="dark"] .cv-modal-download:hover {
  background: rgba(0,229,255,0.18);
  box-shadow: 0 8px 20px rgba(0,229,255,0.12);
}

/* === FLOATING BUTTON === */
.cv-floating-btn {
  position: fixed;
  bottom: 110px; /* encima del footer (~90px alto) */
  right: 30px;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FF8FAB, #FF6B9D);
  border: none;
  color: white;
  font-size: 1.8rem;
  font-weight: 800;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  z-index: 900;
  box-shadow: 0 8px 24px rgba(255,107,157,0.35);
  transition: all 0.3s ease;
}

.cv-floating-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 12px 32px rgba(255,107,157,0.45);
}

.cv-floating-btn:active {
  transform: scale(0.95);
}

.cv-float-icon {
  font-size: 1.5rem;
}

.cv-float-label {
  font-size: 0.65rem;
  font-weight: 900;
  letter-spacing: 0.05em;
}

[data-theme="dark"] .cv-floating-btn {
  background: linear-gradient(135deg, #00e5ff, #00bcd4);
  color: #0a0a0f;
  box-shadow: 0 8px 24px rgba(0,229,255,0.25);
}

[data-theme="dark"] .cv-floating-btn:hover {
  box-shadow: 0 12px 32px rgba(0,229,255,0.35);
}

/* === MODAL TRANSITIONS === */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .cv-modal,
.modal-leave-to .cv-modal {
  transform: scale(0.95) translateY(20px);
}

/* === RESPONSIVE === */
@media (max-width: 768px) {
  .cv-modal {
    width: 95%;
    height: 85vh;
  }

  .cv-floating-btn {
    width: 60px;
    height: 60px;
    bottom: 90px;
    right: 20px;
  }

  .cv-float-icon {
    font-size: 1.2rem;
  }

  .cv-float-label {
    font-size: 0.6rem;
  }

  .cv-modal-header,
  .cv-modal-tabs,
  .cv-modal-preview {
    padding-left: 16px;
    padding-right: 16px;
  }

  .cv-modal-download {
    margin: 0 16px 16px;
    width: calc(100% - 32px);
  }
}
</style>
