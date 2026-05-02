<!-- src/views/ContactView.vue -->
<template>
  <section class="contact-view">
    <div class="contact-container">

      <!-- Header -->
      <div class="contact-header">
        <h1 class="contact-title">{{ t('contact.title') }}</h1>
        <p class="contact-subtitle">{{ t('contact.subtitle') }}</p>
      </div>

      <!-- Layout dos columnas -->
      <div class="contact-layout">
        <ContactLeft />
        <ContactRight />
      </div>

    </div>
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import ContactLeft  from '@/components/organisms/contact/ContactLeft.vue'
import ContactRight from '@/components/organisms/contact/ContactRight.vue'

const { t } = useI18n()
</script>

<style scoped>
.contact-view {
  width: 100%;
  min-height: 100vh;
  padding: 80px 20px 60px;
}

.contact-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 56px;
}

/* === HEADER === */
.contact-header {
  text-align: center;
}

.contact-title {
  font-size: clamp(2.2rem, 5vw, 3.2rem);
  font-weight: 800;
  color: var(--texto);
  margin-bottom: 12px;
  letter-spacing: -0.02em;
}

.contact-subtitle {
  font-size: 1.2rem;
  color: var(--textoSub);
  font-weight: 300;
}

/* === LAYOUT === */
.contact-layout {
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 48px;
  align-items: start;
}

/* === RESPONSIVE === */
@media (max-width: 1024px) {
  .contact-view { padding: 60px 16px 48px; }
  .contact-container { gap: 40px; }
  .contact-layout { gap: 32px; }
}

@media (max-width: 768px) {
  .contact-view { padding: 48px 12px 40px; }
  .contact-layout {
    grid-template-columns: 1fr;
    gap: 28px;
  }
  .contact-title { font-size: 2rem; }
}
</style>