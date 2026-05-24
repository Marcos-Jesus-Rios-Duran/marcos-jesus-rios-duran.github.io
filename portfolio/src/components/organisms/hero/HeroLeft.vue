<!-- src/components/organisms/HeroLeft.vue -->
<template>
  <div class="hero-left">
    <!-- Saludo -->
    <p class="greeting animate-fade-right" style="--delay: 0.2s">
      {{ t('hero.greeting') }}
    </p>

    <!-- Nombre grande -->
    <h1 class="name">
      <span class="name__line">Marcos <span class="name--accent">Ríos</span></span>
      <span class="name__role">{{ t('hero.role') }}</span>
    </h1>

    <!-- Línea divisora animada -->
    <div class="divider animate-grow" style="--delay: 0.4s" />

    <!-- Tagline -->
    <p class="tagline animate-fade-up" style="--delay: 0.6s">
      {{ t('hero.tagline') }}
    </p>
    <p class="tagline2 animate-fade-up" style="--delay: 0.7s">
      {{ t('hero.tagline2') }}
    </p>

    <!-- Botones -->
    <div class="hero-actions animate-fade-up" style="--delay: 0.9s">
      <BaseButton variant="primary" @click="goTo('projects')">
        <span class="material-icons-round">rocket_launch</span>
        {{ t('hero.cta_primary') }}
      </BaseButton>
      <BaseButton variant="secondary" @click="goTo('contact')">
        <span class="material-icons-round">mail</span>
        {{ t('hero.cta_secondary') }}
      </BaseButton>
    </div>

  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/atoms/BaseButton.vue'

const { t } = useI18n()
const router = useRouter()

function goTo(name) {
  router.push({ name })
}
</script>

<style scoped>
.hero-left {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 14px;
  padding: 40px 20px 40px 40px;
  max-width: 560px;
}


/* === SALUDO === */
.greeting {
  font-size: 1.4rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
  text-shadow: 0 1px 4px rgba(0, 40, 80, 0.20);
}

/* === NOMBRE GRANDE === */
.name {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: clamp(3.2rem, 7vw, 5.6rem);
  font-weight: 900;
  color: white;
  margin: 0;
  line-height: 0.98;
  letter-spacing: -2px;
  text-shadow: 0 2px 12px rgba(0, 40, 80, 0.20);
}

.name__line {
  display: block;
}

.name__role {
  display: block;
  font-size: clamp(0.95rem, 1.7vw, 1.2rem);
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.86);
}

.name--accent {
  color: var(--rosaBase);
  text-shadow: 0 2px 16px rgba(0, 0, 0, 0.44);
}

[data-theme="dark"] .name--accent {
  color: #00e5ff;
  text-shadow: 0 2px 16px rgba(0, 229, 255, 0.35);
}

/* === DIVISOR === */
.divider {
  height: 3px;
  width: 60px;
  background: linear-gradient(90deg, var(--rosaVivo), transparent);
  border-radius: 10px;
  transform-origin: left;
}

[data-theme="dark"] .divider {
  background: linear-gradient(90deg, #00e5ff, transparent);
}

/* === TAGLINE === */
.tagline {
  font-size: 1.15rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.90);
  margin: 0;
  line-height: 1.5;
}

.tagline2 {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.60);
  margin: 0;
}

/* === BOTONES === */
.hero-actions {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  margin-top: 8px;
}

.hero-actions .btn {
  display: flex;
  align-items: center;
  gap: 8px;
}

.hero-actions .material-icons-round {
  font-size: 18px;
}

/* === ANIMACIONES DE ENTRADA === */

/* Fade + slide desde arriba */
.animate-fade-down {
  animation: fadeDown 0.6s ease both;
  animation-delay: var(--delay);
}

/* Fade + slide desde la derecha */
.animate-fade-right {
  animation: fadeRight 0.7s ease both;
  animation-delay: var(--delay);
}

/* Fade + slide desde abajo */
.animate-fade-up {
  animation: fadeUp 0.7s ease both;
  animation-delay: var(--delay);
}

/* Crecer desde la izquierda */
.animate-grow {
  animation: growLine 0.6s ease both;
  animation-delay: var(--delay);
}

@keyframes fadeDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeRight {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes growLine {
  from {
    transform: scaleX(0);
    opacity: 0;
  }
  to {
    transform: scaleX(1);
    opacity: 1;
  }
}

@keyframes pulse {
  0%, 100% { transform: scale(1);   opacity: 1; }
  50%       { transform: scale(1.3); opacity: 0.7; }
}

/* === RESPONSIVE === */
/* Tablet (768px a 1024px) */
@media (max-width: 1024px) {
  .hero-left {
    padding: 40px 20px;
    max-width: 100%;
  }

  .name {
    font-size: clamp(3rem, 8vw, 4.8rem);
  }

  .name__role {
    font-size: 0.92rem;
  }

  .greeting {
    font-size: 1.2rem;
  }

  .role {
    font-size: 0.95rem;
  }

  .tagline {
    font-size: 1.05rem;
  }

  .tagline2 {
    font-size: 0.90rem;
  }
}

/* Móvil (hasta 768px) */
@media (max-width: 768px) {
  .hero-left {
    padding: 30px 20px;
    align-items: center;
    text-align: center;
    max-width: 100%;
    gap: 12px;
  }

  .greeting {
    font-size: 1.2rem;
  }

  .name {
    font-size: clamp(2.2rem, 10vw, 3.5rem);
  }

  .divider {
    margin: 0 auto;
    width: 50px;
  }

  .tagline {
    font-size: 1rem;
  }

  .tagline2 {
    font-size: 0.88rem;
  }

  .hero-actions {
    justify-content: center;
    gap: 12px;
  }
}

/* Móvil pequeño (hasta 480px) */
@media (max-width: 480px) {
  .hero-left {
    padding: 25px 16px;
    gap: 10px;
  }

  .greeting {
    font-size: 1.1rem;
  }

  .name {
    font-size: clamp(2.6rem, 10vw, 3.5rem);
  }

  .name__role {
    font-size: 0.8rem;
    letter-spacing: 0.06em;
  }

  .divider {
    width: 45px;
  }

  .tagline {
    font-size: 0.95rem;
    line-height: 1.4;
  }

  .tagline2 {
    font-size: 0.85rem;
  }

  .hero-actions {
    flex-direction: column;
    width: 100%;
  }

  .hero-actions .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>