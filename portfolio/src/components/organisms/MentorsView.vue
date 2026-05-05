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
        {{ t('mentors.intro') }}
      </p>

      <div class="mentors-list-styled">
        <div v-for="(mentor, idx) in mentors" :key="idx" class="mentor-item">
          <span class="mentor-icon">👨‍🎓</span>
          <p class="mentor-text">{{ mentor }}</p>
        </div>
      </div>

      <p class="closing-text">
        {{ t('mentors.closing') }}
      </p>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const { t, tm } = useI18n()

// Obtener mentores desde mentors.list (ahora fuera de skills)
const mentors = computed(() => {
  try {
    const result = tm('mentors.list')
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
}

@media (max-width: 768px) {
  .mentors-view {
    padding: 50px 12px;
    gap: 36px;
  }

  .mentors-title {
    font-size: 2rem;
  }

  .description-card {
    padding: 24px;
  }
}
</style>
