<!-- src/components/organisms/SkillsSection.vue -->
<template>
  <section class="skills-section">
    <!-- Header -->
    <div class="skills-header">
      <h2 class="skills-title">{{ t('skills.title') }}</h2>
      <p class="skills-subtitle">{{ t('skills.subtitle') }}</p>
    </div>

    <!-- Philosophy & Remote -->
    <div class="philosophy-card">
      <p class="philosophy-text">{{ t('skills.philosophy') }}</p>
      <span class="remote-badge">🌍 {{ t('skills.remote') }}</span>
    </div>

    <!-- Tech Categories -->
    <div class="categories-grid">
      <div
        v-for="(category, key) in skillsData.categories"
        :key="key"
        class="category-card"
      >
        <div class="category-header">
          <span class="category-icon">{{ category.icon }}</span>
          <h3 class="category-title">{{ category.title }}</h3>
        </div>
        <div class="technologies">
          <span v-for="tech in category.technologies" :key="tech" class="tech-tag">
            {{ tech }}
          </span>
        </div>
      </div>
    </div>

    <!-- Architecture & Design -->
    <div class="architecture-section">
      <div class="arch-card">
        <h3 class="arch-title">{{ t('skills.architecture.title') }}</h3>
        <div class="arch-content">
          <div class="arch-item">
            <span class="arch-label">Principles:</span>
            <p class="arch-value">{{ t('skills.architecture.principles') }}</p>
          </div>
          <div class="arch-item">
            <span class="arch-label">Patterns:</span>
            <p class="arch-value">{{ t('skills.architecture.patterns') }}</p>
          </div>
          <div class="arch-item">
            <span class="arch-label">Methodologies:</span>
            <p class="arch-value">{{ t('skills.architecture.methodologies') }}</p>
          </div>
          <div class="arch-item">
            <span class="arch-label">Version Control:</span>
            <p class="arch-value">{{ t('skills.architecture.vcs') }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Databases -->
    <div class="databases-section">
      <div class="db-card">
        <h3 class="db-title">{{ t('skills.databases.title') }}</h3>
        <div class="db-content">
          <div class="db-item">
            <span class="db-label">SQL:</span>
            <p class="db-value">{{ t('skills.databases.sql') }}</p>
          </div>
          <div class="db-item">
            <span class="db-label">NoSQL:</span>
            <p class="db-value">{{ t('skills.databases.nosql') }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Specializations -->
    <div class="specializations-section">
      <div class="spec-card">
        <h3 class="spec-title">{{ t('skills.specializations.title') }}</h3>
        <div class="spec-tags">
          <span v-for="(spec, idx) in specializations" :key="idx" class="spec-tag">
            {{ spec }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const { t } = useI18n()

// Especializations
const specializations = computed(() => {
  try {
    const result = t('skills.specializations.items')
    return Array.isArray(result) ? result : []
  } catch (e) {
    return []
  }
})

const skillsData = {
  categories: [
    {
      icon: '💻',
      title: 'Frontend',
      technologies: ['TypeScript', 'JavaScript', 'Angular', 'React', 'Vue.js', 'Pug']
    },
    {
      icon: '⚙️',
      title: 'Backend',
      technologies: ['Java 17', 'Java 21', 'Python', 'Node.js', 'Spring Boot', 'FastAPI', 'Express.js']
    },
    {
      icon: '📱',
      title: 'Mobile & Desktop',
      technologies: ['Flutter', 'Dart', 'Android', 'Java', 'Kotlin']
    }
  ]
}
</script>

<style scoped>
.skills-section {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 20px;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

/* === HEADER === */
.skills-header {
  text-align: center;
  margin-bottom: 20px;
}

.skills-title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  color: var(--texto);
  margin-bottom: 8px;
  letter-spacing: -0.02em;
}

.skills-subtitle {
  font-size: 1.1rem;
  color: var(--textoSub);
  font-weight: 300;
}

/* === PHILOSOPHY CARD === */
.philosophy-card {
  background: linear-gradient(
    135deg,
    rgba(75, 150, 224, 0.15) 0%,
    rgba(255, 179, 204, 0.1) 100%
  );
  border: 2px solid rgba(255, 179, 204, 0.3);
  border-radius: 16px;
  padding: 24px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  backdrop-filter: blur(8px);
}

.philosophy-text {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--texto);
  flex: 1;
}

.remote-badge {
  background: rgba(255, 179, 204, 0.2);
  border: 1px solid rgba(255, 179, 204, 0.5);
  color: #FF8FAB;
  padding: 8px 16px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.95rem;
  white-space: nowrap;
}

[data-theme="dark"] .philosophy-card {
  background: linear-gradient(
    135deg,
    rgba(0, 229, 255, 0.1) 0%,
    rgba(255, 143, 171, 0.08) 100%
  );
  border-color: rgba(0, 229, 255, 0.2);
}

[data-theme="dark"] .remote-badge {
  background: rgba(0, 229, 255, 0.15);
  border-color: rgba(0, 229, 255, 0.4);
  color: #00e5ff;
}

/* === CATEGORIES GRID === */
.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.category-card {
  background: rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(255, 179, 204, 0.25);
  border-radius: 12px;
  padding: 24px;
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
}

.category-card:hover {
  border-color: rgba(255, 179, 204, 0.5);
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(255, 179, 204, 0.15);
}

[data-theme="dark"] .category-card {
  background: rgba(20, 20, 30, 0.6);
  border-color: rgba(0, 229, 255, 0.2);
}

[data-theme="dark"] .category-card:hover {
  border-color: rgba(0, 229, 255, 0.4);
  box-shadow: 0 8px 24px rgba(0, 229, 255, 0.1);
}

.category-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.category-icon {
  font-size: 28px;
}

.category-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--texto);
}

.technologies {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tech-tag {
  background: rgba(255, 179, 204, 0.15);
  color: #FF8FAB;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

[data-theme="dark"] .tech-tag {
  background: rgba(0, 229, 255, 0.15);
  color: #00e5ff;
}

/* === ARCHITECTURE SECTION === */
.architecture-section,
.databases-section,
.specializations-section {
  margin-top: 20px;
}

.arch-card,
.db-card,
.spec-card,
.mentors-card {
  background: rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(75, 150, 224, 0.2);
  border-radius: 12px;
  padding: 32px;
  backdrop-filter: blur(8px);
}

[data-theme="dark"] .arch-card,
[data-theme="dark"] .db-card,
[data-theme="dark"] .spec-card,
[data-theme="dark"] .mentors-card {
  background: rgba(20, 20, 30, 0.6);
  border-color: rgba(0, 229, 255, 0.15);
}

.arch-title,
.db-title,
.spec-title,
.mentors-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--texto);
  margin-bottom: 24px;
  border-bottom: 2px solid rgba(255, 179, 204, 0.3);
  padding-bottom: 12px;
}

[data-theme="dark"] .arch-title,
[data-theme="dark"] .db-title,
[data-theme="dark"] .spec-title,
[data-theme="dark"] .mentors-title {
  border-bottom-color: rgba(0, 229, 255, 0.2);
}

.arch-content,
.db-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

.arch-item,
.db-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.arch-label,
.db-label {
  font-weight: 700;
  color: #FF8FAB;
  font-size: 0.95rem;
}

[data-theme="dark"] .arch-label,
[data-theme="dark"] .db-label {
  color: #00e5ff;
}

.arch-value,
.db-value {
  color: var(--textoSub);
  line-height: 1.6;
  font-size: 0.95rem;
}

/* === SPECIALIZATIONS === */
.spec-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.spec-tag {
  background: linear-gradient(135deg, rgba(255, 179, 204, 0.2), rgba(255, 143, 171, 0.15));
  border: 1px solid rgba(255, 179, 204, 0.4);
  color: #FF8FAB;
  padding: 10px 16px;
  border-radius: 25px;
  font-weight: 600;
  font-size: 0.95rem;
}

[data-theme="dark"] .spec-tag {
  background: linear-gradient(135deg, rgba(0, 229, 255, 0.15), rgba(0, 200, 255, 0.1));
  border-color: rgba(0, 229, 255, 0.3);
  color: #00e5ff;
}

/* === RESPONSIVE === */
@media (max-width: 1024px) {
  .skills-section {
    padding: 50px 16px;
    gap: 32px;
  }

  .philosophy-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .categories-grid {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 16px;
  }

  .arch-content,
  .db-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .skills-section {
    padding: 40px 12px;
    gap: 24px;
  }

  .skills-title {
    font-size: 1.8rem;
  }

  .category-card,
  .arch-card,
  .db-card,
  .spec-card,
  .mentors-card {
    padding: 20px;
  }

  .categories-grid {
    grid-template-columns: 1fr;
  }

  .philosophy-text {
    font-size: 1rem;
  }
}
</style>
