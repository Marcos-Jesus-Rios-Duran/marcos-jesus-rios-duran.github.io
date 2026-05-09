<!-- src/components/organisms/SkillsSection.vue -->
<template>
  <section class="skills-section">

    <!-- Header -->
    <div class="skills-header">
      <h2 class="skills-title">{{ t('skills.title') }}</h2>
    </div>

    <!-- Philosophy & Remote -->
    <div class="philosophy-card">
      <p class="philosophy-text">{{ t('skills.philosophy') }}</p>
      <span class="remote-badge">🌍 {{ t('skills.remote') }}</span>
    </div>

    <!-- Tech Cards Grid -->
    <div class="tech-cards-grid">
      <TechCard
        v-for="card in skillCards"
        :key="card.id"
        :icon="card.icon"
        :title="card.title"
        :tags="card.tags"
        :delay="card.delay"
        :duration="card.duration"
      />
    </div>

    <!-- Arquitectura & Diseño -->
    <div class="info-card">
      <h3 class="info-title">{{ t('skills.architecture.title') }}</h3>
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">Principles</span>
          <p class="info-value">{{ t('skills.architecture.principles') }}</p>
        </div>
        <div class="info-item">
          <span class="info-label">Patterns</span>
          <p class="info-value">{{ t('skills.architecture.patterns') }}</p>
        </div>
        <div class="info-item">
          <span class="info-label">Methodologies</span>
          <p class="info-value">{{ t('skills.architecture.methodologies') }}</p>
        </div>
      </div>
    </div>

  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import TechCard from '@/components/atoms/TechCard.vue'

const { t } = useI18n()


const skillCards = [
  // Card 1: Cloud & Git — certificaciones y control de versiones
  {
    id: 'cloud',
    icon: '☁️',
    title: 'Cloud & Git',
    delay: 0,
    duration: 4.5,
    tags: [
      {
        label: 'Azure AI-900',
        certified: true,
        url: 'https://learn.microsoft.com/es-mx/users/marcosjesusriosduran-4079/credentials/4ae86f377cd55fa8'
      },
      {
        label: 'GitHub',
        certified: false,
        url: 'https://github.com/Marcos-Jesus-Rios-Duran'
      },
      {
        label: 'GitLab',
        certified: false,
        // Sin link — repositorios privados
      },
    ]
  },

  // Card 2: Frontend
  {
    id: 'frontend',
    icon: '💻',
    title: 'Frontend',
    delay: 0.05,
    duration: 5.2,
    tags: [
      { label: 'TypeScript', certified: false },
      { label: 'JavaScript', certified: false },
      { label: 'Vue.js', certified: false },
      { label: 'React', certified: false },
      { label: 'Angular', certified: false },
      { label: 'Pug', certified: false },
    ]
  },

  // Card 3: Backend
  {
    id: 'backend',
    icon: '⚙️',
    title: 'Backend',
    delay: 0.10,
    duration: 4.8,
    tags: [
      { label: 'Java 17/21', certified: false },
      { label: 'Python', certified: false },
      { label: 'Spring Boot', certified: false },
      { label: 'FastAPI', certified: false },
      { label: 'Express.js', certified: false },
      { label: 'Node.js', certified: false },
    ]
  },

  // Card 4: Mobile & Desktop
  {
    id: 'mobile',
    icon: '📱',
    title: 'Mobile & Desktop',
    delay: 0.15,
    duration: 5.5,
    tags: [
      { label: 'Flutter', certified: false },
      { label: 'Dart', certified: false },
      { label: 'Android', certified: false },
      { label: 'Kotlin', certified: false },
      { label: 'Java', certified: false },
    ]
  },

  // Card 5: Databases —
  {
    id: 'databases',
    icon: '🗄️',
    title: 'Databases',
    delay: 0.20,
    duration: 4.6,
    tags: [
      { label: 'MySQL', certified: false },
      { label: 'PostgreSQL', certified: false },
      { label: 'MongoDB', certified: false },
      { label: 'Neo4j', certified: false },
      { label: 'SQLite', certified: false },
    ]
  },

  // Card 6: Análisis & Ciberseguridad
  {
    id: 'security',
    icon: '🛡️',
    title: 'Análisis & Ciberseguridad',
    delay: 0.25,
    duration: 5.0,
    tags: [
      { label: 'Linux', certified: false },
      { label: 'Ciberseguridad', certified: false },
      { label: 'Power BI', certified: false },
    ]
  },
]
</script>

<style scoped>
.skills-section {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 56px;
}

/* === HEADER === */
.skills-header { text-align: center; }

.skills-title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  color: var(--texto);
  margin-bottom: 10px;
  letter-spacing: -0.02em;
}

/* === PHILOSOPHY === */
.philosophy-card {
  background: linear-gradient(135deg, rgba(75,150,224,0.15) 0%, rgba(255,179,204,0.12) 100%);
  border: 2px solid rgba(255,179,204,0.35);
  border-radius: 20px;
  padding: 28px 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  backdrop-filter: blur(10px);
}

.philosophy-text {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--texto);
  flex: 1;
  line-height: 1.6;
}

.remote-badge {
  background: rgba(255,179,204,0.25);
  border: 1.5px solid rgba(255,143,171,0.5);
  color: #c0446a;
  padding: 10px 20px;
  border-radius: 50px;
  font-weight: 700;
  font-size: 0.9rem;
  white-space: nowrap;
  letter-spacing: 0.02em;
}

[data-theme="dark"] .philosophy-card {
  background: linear-gradient(135deg, rgba(0,229,255,0.08) 0%, rgba(255,143,171,0.06) 100%);
  border-color: rgba(0,229,255,0.2);
}
[data-theme="dark"] .remote-badge {
  background: rgba(0,229,255,0.12);
  border-color: rgba(0,229,255,0.35);
  color: #00e5ff;
}

/* === TECH CARDS GRID === */
.tech-cards-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 28px;
}

.tech-cards-grid :deep(.tech-card) {
  width: 100%;
  min-height: 150px;
  padding: 24px 26px;
  gap: 18px;
  border-radius: 20px;
}

.tech-cards-grid :deep(.tech-card__icon) {
  width: 54px;
  height: 54px;
  font-size: 26px;
  border-radius: 14px;
  flex-shrink: 0;
}

.tech-cards-grid :deep(.tech-card__title) {
  font-size: 15px;
  font-weight: 800;
  color: #1a0812;
  margin-bottom: 12px;
  letter-spacing: -0.1px;
}

[data-theme="dark"] .tech-cards-grid :deep(.tech-card__title) {
  color: #ffffff;
}

.tech-cards-grid :deep(.tech-card__tags) {
  gap: 7px;
}

.tech-cards-grid :deep(.tag) {
  font-size: 11.5px;
  font-weight: 700;
  padding: 5px 12px;
  border-radius: 20px;
  color: #2D0615;
  letter-spacing: 0.02em;
}

[data-theme="dark"] .tech-cards-grid :deep(.tag) {
  color: rgba(0,229,255,0.9);
}

/* ✓ verde vibrante */
.tech-cards-grid :deep(.tag__badge) {
  color: #16a34a !important;
  font-size: 13px;
  font-weight: 900;
}

[data-theme="dark"] .tech-cards-grid :deep(.tag__badge) {
  color: #22c55e !important;
}

/* Tag certificado con acento verde */
.tech-cards-grid :deep(.tag--certified) {
  border-color: rgba(22,163,74,0.45) !important;
  background: rgba(255,255,255,0.92) !important;
  color: #14532d !important;
}

[data-theme="dark"] .tech-cards-grid :deep(.tag--certified) {
  border-color: rgba(34,197,94,0.45) !important;
  background: rgba(34,197,94,0.1) !important;
  color: #22c55e !important;
}

/* === INFO CARDS === */
.info-card {
  background: rgba(255,255,255,0.82);
  border: 2px solid rgba(255,179,204,0.28);
  border-radius: 20px;
  padding: 36px 40px;
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

.info-title {
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--texto);
  margin-bottom: 28px;
  padding-bottom: 14px;
  border-bottom: 2px solid rgba(255,179,204,0.35);
  letter-spacing: -0.01em;
}

[data-theme="dark"] .info-title {
  border-bottom-color: rgba(0,229,255,0.18);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.info-label {
  font-weight: 800;
  color: #c0446a;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

[data-theme="dark"] .info-label {
  color: #00e5ff;
}

.info-value {
  color: #2a1520;
  line-height: 1.75;
  font-size: 0.95rem;
  font-weight: 500;
}

[data-theme="dark"] .info-value {
  color: rgba(255,255,255,0.75);
}


/* === RESPONSIVE === */
@media (max-width: 1100px) {
  .info-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 1024px) {
  .skills-section { padding: 60px 16px; gap: 40px; }
  .tech-cards-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; }
  .philosophy-card { flex-direction: column; align-items: flex-start; }
  .info-card { padding: 28px; }
}

@media (max-width: 768px) {
  .skills-section { padding: 48px 12px; gap: 28px; }
  .skills-title { font-size: 1.8rem; }
  .tech-cards-grid { grid-template-columns: 1fr; }
  .info-grid { grid-template-columns: 1fr; gap: 20px; }
  .info-card { padding: 22px 20px; }
}
</style>