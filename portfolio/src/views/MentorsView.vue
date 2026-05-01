<template>
  <section class="mentors-view">
    <!-- Header -->
    <div class="mentors-header">
      <h1 class="mentors-title">{{ t('mentors.title') }}</h1>
      <p class="mentors-subtitle">{{ t('mentors.subtitle') }}</p>
    </div>

    <!-- Description with Dynamic Mentors -->
    <div class="description-card">
      <h2>{{ t('mentors.inaoe') }}</h2>

      <p class="intro-text">
        Agradezco profundamente a mis mentores en el Instituto Nacional de Astrofísica, Óptica y
        Electrónica (INAOE) por su guía, inspiración y dedicación en mi formación profesional:
      </p>

      <div class="mentors-list-styled">
        <div v-for="(mentor, idx) in mentors" :key="idx" class="mentor-item">
          <span class="mentor-icon">👨‍🎓</span>
          <p class="mentor-text">{{ mentor }}</p>
        </div>
      </div>

      <p class="closing-text">
        Su experiencia y mentoría han sido fundamentales en mi desarrollo como ingeniero de software
        y seguirán siendo una inspiración para mi carrera profesional.
      </p>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const { t } = useI18n()

// Obtener mentores desde mentors.list (ahora fuera de skills)
const mentors = computed(() => {
  try {
    const result = t('mentors.list')
    return Array.isArray(result) ? result : []
  } catch (e) {
    console.warn('Error loading mentors:', e)
    return []
  }
})
</script>

<style scoped>
.mentors-view {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 20px;
  display: flex;
  flex-direction: column;
  gap: 60px;
}

/* === HEADER === */
.mentors-header {
  text-align: center;
  margin-bottom: 20px;
}

.mentors-title {
  font-size: clamp(2.2rem, 5vw, 3.2rem);
  font-weight: 800;
  color: var(--texto);
  margin-bottom: 12px;
  letter-spacing: -0.02em;
}

.mentors-subtitle {
  font-size: 1.2rem;
  color: var(--textoSub);
  font-weight: 300;
}

/* === MENTORS GRID === */
.mentors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
  padding: 40px 0;
}

.mentor-card {
  background: rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(255, 179, 204, 0.25);
  border-radius: 16px;
  padding: 40px 24px;
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 16px;
}

.mentor-card:hover {
  border-color: rgba(255, 179, 204, 0.5);
  transform: translateY(-8px);
  box-shadow: 0 12px 32px rgba(255, 179, 204, 0.2);
}

[data-theme="dark"] .mentor-card {
  background: rgba(20, 20, 30, 0.6);
  border-color: rgba(0, 229, 255, 0.2);
}

[data-theme="dark"] .mentor-card:hover {
  border-color: rgba(0, 229, 255, 0.4);
  box-shadow: 0 12px 32px rgba(0, 229, 255, 0.15);
}

.mentor-icon {
  font-size: 48px;
  line-height: 1;
}

.mentor-name {
  font-size: 1rem;
  font-weight: 700;
  color: var(--texto);
  line-height: 1.6;
}

.mentor-badge {
  background: linear-gradient(135deg, rgba(255, 179, 204, 0.2), rgba(255, 143, 171, 0.15));
  border: 1px solid rgba(255, 179, 204, 0.4);
  color: #FF8FAB;
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
}

[data-theme="dark"] .mentor-badge {
  background: linear-gradient(135deg, rgba(0, 229, 255, 0.15), rgba(0, 200, 255, 0.1));
  border-color: rgba(0, 229, 255, 0.3);
  color: #00e5ff;
}

/* === DESCRIPTION === */
.description-card {
  background: linear-gradient(
    135deg,
    rgba(75, 150, 224, 0.15) 0%,
    rgba(255, 179, 204, 0.1) 100%
  );
  border: 2px solid rgba(255, 179, 204, 0.3);
  border-radius: 16px;
  padding: 40px;
  backdrop-filter: blur(8px);
  margin-top: 40px;
}

.description-card h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #FF8FAB;
  margin-bottom: 16px;
}

[data-theme="dark"] .description-card {
  background: linear-gradient(
    135deg,
    rgba(0, 229, 255, 0.1) 0%,
    rgba(255, 143, 171, 0.08) 100%
  );
  border-color: rgba(0, 229, 255, 0.2);
}

[data-theme="dark"] .description-card h2 {
  color: #00e5ff;
}

.description-card p {
  color: var(--textoSub);
  line-height: 1.8;
  font-size: 1rem;
}

/* === MENTORS LIST STYLED === */
.mentors-list-styled {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 28px 0;
  padding: 20px 0;
}

.mentor-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.mentor-icon {
  font-size: 24px;
  min-width: 24px;
  flex-shrink: 0;
}

.mentor-text {
  color: var(--texto);
  font-weight: 500;
  line-height: 1.6;
  margin: 0;
}

.intro-text {
  color: var(--textoSub);
  line-height: 1.8;
  margin-bottom: 0;
}

.closing-text {
  color: var(--textoSub);
  line-height: 1.8;
  margin-top: 0;
}

/* === RESPONSIVE === */
@media (max-width: 1024px) {
  .mentors-view {
    padding: 60px 16px;
    gap: 48px;
  }

  .mentors-grid {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 24px;
    padding: 30px 0;
  }
}

@media (max-width: 768px) {
  .mentors-view {
    padding: 50px 12px;
    gap: 36px;
  }

  .mentors-title {
    font-size: 2rem;
  }

  .mentor-card {
    padding: 30px 20px;
  }

  .mentors-grid {
    grid-template-columns: 1fr;
  }

  .description-card {
    padding: 24px;
  }
}
</style>
