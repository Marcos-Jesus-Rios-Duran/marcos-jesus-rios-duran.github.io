<!-- src/components/molecules/ProjectCard.vue -->
<template>
  <div class="project-card" @click="openProject">
    <!-- Tech tags header (arriba compacto) -->
    <div v-if="project.technologies" class="project-card__tech-header">
      <span v-for="tech in limitedTechs" :key="tech" class="tech-badge">
        {{ tech }}
      </span>
      <span v-if="project.technologies.length > 3" class="tech-more">
        +{{ project.technologies.length - 3 }}
      </span>
    </div>

    <!-- Header con título y status -->
    <div class="project-card__header">
      <h3 class="project-card__title">{{ project.name }}</h3>
      <span v-if="project.status" class="status-badge" :class="`status--${getStatusClass(project.status)}`">
        {{ project.status }}
      </span>
    </div>

    <!-- Descripción compacta (120 chars) -->
    <p class="project-card__description">
      {{ truncatedDescription }}
    </p>

    <!-- GitHub CTA con ícono SVG -->
    <div v-if="project.github" class="project-card__cta">
      <svg class="github-icon" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
      {{ t('projects.cta_view') || 'Ver en GitHub' }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  project: {
    type: Object,
    required: true,
    validator: (value) => {
      return value.name && (value.description || value.highlights)
    }
  }
})

const emit = defineEmits(['open'])

// Limitar tech tags a 3
const limitedTechs = computed(() => {
  return props.project.technologies ? props.project.technologies.slice(0, 3) : []
})

// Truncar descripción a 120 caracteres
const truncatedDescription = computed(() => {
  const desc = props.project.description || ''
  return desc.length > 120 ? desc.slice(0, 120) + '...' : desc
})

const openProject = () => {
  emit('open', props.project)
}

const getStatusClass = (status) => {
  const statusMap = {
    'En desarrollo': 'development',
    'Finalizado / Académico': 'completed',
    'Open Source / En Desarrollo': 'opensource',
    'Confidencial': 'confidential',
    'En Desarrollo / Refactorización': 'refactoring',
    'Confidential': 'confidential'
  }
  return statusMap[status] || 'default'
}
</script>

<style scoped>
.project-card {
  background: linear-gradient(
    135deg,
    rgba(255, 179, 204, 0.08) 0%,
    rgba(255, 143, 181, 0.06) 100%
  );
  border: 1.5px solid rgba(255, 179, 204, 0.2);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  min-height: 240px;
}

.project-card:hover {
  border-color: rgba(255, 120, 170, 0.5);
  background: linear-gradient(
    135deg,
    rgba(255, 179, 204, 0.14) 0%,
    rgba(255, 143, 181, 0.12) 100%
  );
  box-shadow: 0 12px 32px rgba(255, 120, 170, 0.2);
  transform: translateY(-6px);
}

/* === TECH HEADER === */
.project-card__tech-header {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  min-height: 28px;
}

.tech-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 600;
  background: rgba(0, 229, 255, 0.15);
  color: #00e5ff;
  border: 1px solid rgba(0, 229, 255, 0.25);
  white-space: nowrap;
  transition: all 0.2s;
}

.tech-badge:hover {
  background: rgba(0, 229, 255, 0.22);
  border-color: rgba(0, 229, 255, 0.4);
}

.tech-more {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  font-size: 0.7rem;
  font-weight: 600;
  color: rgba(255, 179, 204, 0.7);
}

/* === HEADER === */
.project-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
}

.project-card__title {
  font-size: 1.2rem;
  font-weight: 700;
  color: white;
  margin: 0;
  flex: 1;
  line-height: 1.3;
}

.status-badge {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 18px;
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: capitalize;
  white-space: nowrap;
  flex-shrink: 0;
}

.status--development {
  background: rgba(255, 193, 7, 0.2);
  color: #ffc107;
  border: 1px solid rgba(255, 193, 7, 0.3);
}

.status--completed {
  background: rgba(76, 175, 80, 0.2);
  color: #4caf50;
  border: 1px solid rgba(76, 175, 80, 0.3);
}

.status--opensource {
  background: rgba(0, 229, 255, 0.2);
  color: #00e5ff;
  border: 1px solid rgba(0, 229, 255, 0.3);
}

.status--confidential {
  background: rgba(156, 39, 176, 0.2);
  color: #ce93d8;
  border: 1px solid rgba(156, 39, 176, 0.3);
}

.status--refactoring {
  background: rgba(255, 152, 0, 0.2);
  color: #ff9800;
  border: 1px solid rgba(255, 152, 0, 0.3);
}

/* === DESCRIPCIÓN === */
.project-card__description {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.5;
  margin: 0;
  flex-grow: 1;
}

/* === CTA BUTTON === */
.project-card__cta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 50px;
  background: linear-gradient(
    135deg,
    rgba(255, 179, 204, 0.15) 0%,
    rgba(255, 143, 181, 0.10) 100%
  );
  border: 1.5px solid rgba(255, 179, 204, 0.35);
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.25s;
  white-space: nowrap;
}

.project-card__cta:hover {
  background: linear-gradient(
    135deg,
    rgba(255, 179, 204, 0.25) 0%,
    rgba(255, 143, 181, 0.20) 100%
  );
  border-color: rgba(255, 179, 204, 0.5);
  color: white;
  transform: translateY(-2px);
}

.github-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

/* === DARK MODE === */
[data-theme="dark"] .project-card {
  background: linear-gradient(
    135deg,
    rgba(0, 229, 255, 0.08) 0%,
    rgba(0, 188, 212, 0.06) 100%
  );
  border-color: rgba(0, 229, 255, 0.15);
}

[data-theme="dark"] .project-card:hover {
  border-color: rgba(0, 229, 255, 0.35);
  background: linear-gradient(
    135deg,
    rgba(0, 229, 255, 0.12) 0%,
    rgba(0, 188, 212, 0.10) 100%
  );
  box-shadow: 0 12px 32px rgba(0, 229, 255, 0.12);
}

[data-theme="dark"] .project-card__cta {
  background: linear-gradient(
    135deg,
    rgba(0, 229, 255, 0.1) 0%,
    rgba(0, 188, 212, 0.08) 100%
  );
  border-color: rgba(0, 229, 255, 0.25);
}

[data-theme="dark"] .project-card__cta:hover {
  background: linear-gradient(
    135deg,
    rgba(0, 229, 255, 0.18) 0%,
    rgba(0, 188, 212, 0.14) 100%
  );
  border-color: rgba(0, 229, 255, 0.4);
}

/* === RESPONSIVE === */
@media (max-width: 640px) {
  .project-card {
    padding: 12px;
    gap: 10px;
    min-height: auto;
  }

  .project-card__title {
    font-size: 1rem;
  }

  .project-card__description {
    font-size: 0.85rem;
  }

  .project-card__cta {
    font-size: 0.8rem;
    padding: 8px 12px;
  }

  .github-icon {
    width: 14px;
    height: 14px;
  }
}
</style>
