<!-- src/components/organisms/contact/ContactLeft.vue -->
<template>
  <div class="contact-left">

    <!-- Mensaje principal -->
    <div class="contact-intro">
      <h2 class="contact-heading">{{ t('contact.heading') }}</h2>
      <p class="contact-desc">{{ t('contact.description') }}</p>
    </div>

    <!-- Social Links -->
    <div class="social-cards">

      <!-- Email -->
      <a
        href="mailto:mr4010650@gmail.com"
        class="social-card"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div class="social-icon email-icon">✉️</div>
        <div class="social-info">
          <span class="social-label">Email</span>
          <span class="social-value">mr4010650@gmail.com</span>
        </div>
        <span class="social-arrow">↗</span>
      </a>

      <!-- LinkedIn -->
      <a
        href="https://www.linkedin.com/in/marcos-jesús-rios-durán-15b036402"
        class="social-card"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div class="social-icon linkedin-icon">💼</div>
        <div class="social-info">
          <span class="social-label">LinkedIn</span>
          <span class="social-value">Marcos Jesús Ríos Durán</span>
        </div>
        <span class="social-arrow">↗</span>
      </a>

      <!-- GitHub -->
      <a
        href="https://github.com/Marcos-Jesus-Rios-Duran"
        class="social-card"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div class="social-icon github-icon">🐙</div>
        <div class="social-info">
          <span class="social-label">GitHub</span>
          <span class="social-value">Marcos-Jesus-Rios-Duran</span>
        </div>
        <span class="social-arrow">↗</span>
      </a>

      <!-- WhatsApp -->
      <a
        href="https://wa.me/527641038217?text=Hola%20Marcos%2C%20vi%20tu%20portfolio%20y%20me%20interesa%20contactarte."
        class="social-card"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div class="social-icon whatsapp-icon">💬</div>
        <div class="social-info">
          <span class="social-label">WhatsApp</span>
          <span class="social-value">+52 764 103 8217</span>
        </div>
        <span class="social-arrow">↗</span>
      </a>

      <!-- Telegram -->
      <a
        href="https://t.me/+527641038217"
        class="social-card"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div class="social-icon telegram-icon">✈️</div>
        <div class="social-info">
          <span class="social-label">Telegram</span>
          <span class="social-value">+52 764 103 8217</span>
        </div>
        <span class="social-arrow">↗</span>
      </a>

    </div>

    <!-- Disponibilidad -->
    <div class="availability-badge">
      <span class="availability-dot" />
      <span>{{ t('contact.available') }}</span>
    </div>

  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<style scoped>
.contact-left {
  display: flex;
  flex-direction: column;
  gap: 36px;
}

/* === INTRO === */
.contact-heading {
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  font-weight: 800;
  color: var(--texto);
  margin-bottom: 12px;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.contact-desc {
  color: var(--textoSub);
  font-size: 1rem;
  line-height: 1.8;
  font-weight: 400;
}

/* === SOCIAL CARDS === */
.social-cards {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.social-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: rgba(255,255,255,0.78);
  border: 2px solid rgba(255,179,204,0.28);
  border-radius: 16px;
  text-decoration: none;
  transition: all 0.25s ease;
  backdrop-filter: blur(8px);
  cursor: pointer;
}

.social-card:hover {
  border-color: rgba(255,143,171,0.55);
  transform: translateX(6px);
  box-shadow: 0 6px 24px rgba(255,143,171,0.15);
  background: rgba(255,255,255,0.92);
}

[data-theme="dark"] .social-card {
  background: rgba(15,15,25,0.65);
  border-color: rgba(0,229,255,0.14);
}

[data-theme="dark"] .social-card:hover {
  border-color: rgba(0,229,255,0.35);
  box-shadow: 0 6px 24px rgba(0,229,255,0.1);
  background: rgba(15,15,30,0.85);
}

.social-icon {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
  background: rgba(255,179,204,0.2);
  border: 1.5px solid rgba(255,179,204,0.35);
}

[data-theme="dark"] .social-icon {
  background: rgba(0,229,255,0.08);
  border-color: rgba(0,229,255,0.2);
}

.social-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
  min-width: 0;
}

.social-label {
  font-size: 0.75rem;
  font-weight: 800;
  color: #c0446a;
  text-transform: uppercase;
  letter-spacing: 0.07em;
}

[data-theme="dark"] .social-label {
  color: #00e5ff;
}

.social-value {
  font-size: 0.92rem;
  font-weight: 600;
  color: #1a0812;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

[data-theme="dark"] .social-value {
  color: rgba(255,255,255,0.85);
}

.social-arrow {
  font-size: 1.1rem;
  color: #c0446a;
  opacity: 0.6;
  flex-shrink: 0;
  transition: opacity 0.2s, transform 0.2s;
}

.social-card:hover .social-arrow {
  opacity: 1;
  transform: translate(2px, -2px);
}

[data-theme="dark"] .social-arrow {
  color: #00e5ff;
}

/* === AVAILABILITY === */
.availability-badge {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #16a34a;
  background: rgba(22,163,74,0.08);
  border: 1.5px solid rgba(22,163,74,0.25);
  border-radius: 50px;
  padding: 10px 20px;
  width: fit-content;
}

[data-theme="dark"] .availability-badge {
  color: #22c55e;
  background: rgba(34,197,94,0.08);
  border-color: rgba(34,197,94,0.2);
}

.availability-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #16a34a;
  animation: pulse-dot 2s infinite;
  flex-shrink: 0;
}

[data-theme="dark"] .availability-dot {
  background: #22c55e;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}
</style>