<template>
  <section class="contact-view">
    <div class="contact-container">
      <h1>{{ t('contact.title') }}</h1>
      <p class="subtitle">{{ t('contact.subtitle') }}</p>
      <!-- Contenido de contacto irá aquí -->
    </div>
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style scoped>
.contact-view {
  width: 100%;
  min-height: 100vh;
  padding: 100px 20px 40px;
}

.contact-container {
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  font-size: 3rem;
  font-weight: 900;
  margin-bottom: 12px;
  color: white;
}

.subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.70);
  margin: 0;
}
</style>
