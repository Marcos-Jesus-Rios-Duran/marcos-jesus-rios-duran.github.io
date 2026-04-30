<!-- src/components/organisms/HeroRight.vue -->
<template>
  <div class="hero-right">
    <TechCard
      v-for="card in cards"
      :key="card.id"
      :icon="card.icon"
      :title="t(card.titleKey)"
      :tags="card.tags"
      :delay="card.delay"
      :duration="card.duration"
      :class="`card-${card.id}`"
    />
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import TechCard from '@/components/atoms/TechCard.vue'

const { t } = useI18n()

const cards = [
  {
    id: 'cloud',
    icon: '☁️',
    titleKey: 'hero.cards.cloud',
    delay: 0,
    duration: 4.5,
    tags: [
      { url: 'https://learn.microsoft.com/es-mx/users/marcosjesusriosduran-4079/credentials/4ae86f377cd55fa8?ref=https%3A%2F%2Fwww.linkedin.com%2F', label: 'Azure AI-900', certified: true },
     { label: 'Ciberseguridad', certified: false },

    ]
  },
  {
    id: 'web',
    icon: '🌐',
    titleKey: 'hero.cards.web',
    delay: 0.8,
    duration: 5.2,
    tags: [
      { label: 'Vue', certified: false },
      { label: 'React', certified: false },
      { label: 'Angular', certified: false },
    ]
  },
  {
    id: 'backend',
    icon: '⚙️',
    titleKey: 'hero.cards.backend',
    delay: 1.4,
    duration: 4.8,
    tags: [
      { label: 'FastAPI', certified: false },
      { label: 'Spring Boot', certified: false },
      { label: 'Node.js', certified: false },
    ]
  },
  {
    id: 'mobile',
    icon: '📱',
    titleKey: 'hero.cards.mobile',
    delay: 2.0,
    duration: 5.5,
    tags: [
      { label: 'Flutter', certified: false },
      { label: 'Dart', certified: false },
    ]
  },
  {
    id: 'desktop',
    icon: '🖥️',
    titleKey: 'hero.cards.desktop',
    delay: 2.6,
    duration: 4.2,
    tags: [
      { label: 'Flutter Desktop', certified: false },
      { label: 'Dart', certified: false },
    ]
  },
  {
    id: 'devops',
    icon: '🔧',
    titleKey: 'hero.cards.devops',
    delay: 3.2,
    duration: 5.0,
    tags: [
      { label: 'Git Flow', certified: false },
      { label: 'GitHub', certified: false },
      { label: 'Feature First', certified: false },
    ]
  },
]
</script>

<style scoped>
.hero-right {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 580px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  align-content: center;
  padding: 20px;
}

/* Posicionamiento escalonado — como nubes a distintas alturas */
.card-cloud   { grid-column: 2; grid-row: 1; justify-self: end; }
.card-web     { grid-column: 1; grid-row: 1; }
.card-backend { grid-column: 2; grid-row: 2; justify-self: end; }
.card-mobile  { grid-column: 1; grid-row: 2; }
.card-desktop { grid-column: 2; grid-row: 3; justify-self: end; }
.card-devops  { grid-column: 1; grid-row: 3; }

/* Tablet (768px a 1024px) */
@media (max-width: 1024px) {
  .hero-right {
    min-height: 500px;
    gap: 16px;
    padding: 16px;
  }
}

/* Móvil (hasta 768px) */
@media (max-width: 768px) {
  .hero-right {
    grid-template-columns: 1fr;
    min-height: auto;
    gap: 14px;
    padding: 20px 0;
  }

  .card-cloud,
  .card-web,
  .card-backend,
  .card-mobile,
  .card-desktop,
  .card-devops {
    grid-column: 1;
    grid-row: auto;
    justify-self: center;
  }
}

/* Móvil pequeño (hasta 480px) */
@media (max-width: 480px) {
  .hero-right {
    gap: 12px;
    padding: 16px 0;
  }
}
</style>