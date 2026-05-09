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
      <div class="project-card__badges">
        <span
          v-if="statusLabel"
          class="status-badge"
          :class="`status--${getStatusClass(project.status)}`"
        >
          {{ statusLabel }}
        </span>
        <span
          v-if="project.confidentiality"
          class="status-badge status--confidential status-badge--soft"
        >
          Confidencial
        </span>
      </div>
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

const statusLabel = computed(() => {
  const status = (props.project.status || '').trim()

  const labelMap = {
    featured: 'Destacado',
    Featured: 'Destacado',
    'En desarrollo': 'En desarrollo',
    'En Desarrollo': 'En desarrollo',
    development: 'En desarrollo',
    'Finalizado / Académico': 'Finalizado / Académico',
    'Open Source / En Desarrollo': 'Open Source',
    'En Desarrollo / Refactorización': 'En desarrollo',
    confidential: 'Confidencial',
    Confidential: 'Confidencial'
  }

  return labelMap[status] || status
})

const openProject = () => {
  emit('open', props.project)
}

const getStatusClass = (status) => {
  const normalized = (status || '').toString().trim().toLowerCase()
  const statusMap = {
    'en desarrollo': 'development',
    'development': 'development',
    'finalizado / académico': 'completed',
    'open source / en desarrollo': 'opensource',
    'featured': 'featured',
    'confidencial': 'confidential',
    'confidential': 'confidential',
    'en desarrollo / refactorización': 'refactoring'
  }
  return statusMap[normalized] || 'default'
}
</script>

<style scoped>
.project-card {
  position: relative;
  overflow: hidden;
  background: linear-gradient(180deg, rgba(255,255,255,0.88) 0%, rgba(255,240,246,0.82) 100%);
  border: 1.5px solid rgba(255, 179, 204, 0.38);
  border-radius: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  min-height: 240px;
  box-shadow:
    0 12px 28px rgba(255, 120, 170, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.65);
}

.project-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at top right, rgba(255, 143, 171, 0.16), transparent 30%),
              radial-gradient(circle at bottom left, rgba(75, 150, 224, 0.10), transparent 28%);
  pointer-events: none;
}

.project-card:hover {
  border-color: rgba(255, 143, 171, 0.55);
  background: linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(255,235,242,0.88) 100%);
  box-shadow: 0 18px 40px rgba(255, 120, 170, 0.18);
  transform: translateY(-4px);
}

/* === TECH HEADER === */
.project-card__tech-header {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  min-height: 28px;
  position: relative;
  z-index: 1;
}

.tech-badge {
  display: inline-flex;
  align-items: center;
  padding: 5px 12px;
  border-radius: 14px;
  font-size: 0.7rem;
  font-weight: 700;
  background: #ffd6e8;
  color: #b0456e;
  border: 1.5px solid #ffb3cc;
  white-space: nowrap;
  transition: all 0.2s;
}

.tech-badge:hover {
  background: #ffb3cc;
  border-color: #ff8fb3;
  color: #7A1840;
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
  gap: 12px;
  position: relative;
  z-index: 1;
}

.project-card__title {
  font-size: 1.18rem;
  font-weight: 800;
  color: #1a0812;
  margin: 0;
  flex: 1;
  line-height: 1.3;
  letter-spacing: -0.3px;
}

.project-card__badges {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.status-badge {
  display: inline-block;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 0.64rem;
  font-weight: 600;
  text-transform: capitalize;
  white-space: nowrap;
  flex-shrink: 0;
  letter-spacing: 0.03em;
  backdrop-filter: blur(8px);
}

.status-badge--soft {
  opacity: 0.92;
}

.status--development {
  background: rgba(255, 193, 7, 0.12);
  color: #b7791f;
  border: 1px solid rgba(255, 193, 7, 0.28);
}

.status--completed {
  background: rgba(76, 175, 80, 0.14);
  color: #2e7d32;
  border: 1px solid rgba(76, 175, 80, 0.26);
}

.status--opensource {
  background: rgba(0, 229, 255, 0.12);
  color: #0f6f7d;
  border: 1px solid rgba(0, 229, 255, 0.26);
}

.status--featured {
  background: rgba(255, 143, 171, 0.14);
  color: #a91e55;
  border: 1px solid rgba(255, 143, 171, 0.30);
}

.status--confidential {
  background: rgba(99, 102, 241, 0.14);
  color: #4f46e5;
  border: 1px solid rgba(99, 102, 241, 0.28);
}

.status--refactoring {
  background: rgba(255, 152, 0, 0.14);
  color: #b45309;
  border: 1px solid rgba(255, 152, 0, 0.28);
}

/* === DESCRIPCIÓN === */
.project-card__description {
  font-size: 0.9rem;
  color: #5b5b5b;
  line-height: 1.5;
  margin: 0;
  flex-grow: 1;
  position: relative;
  z-index: 1;
}

/* === CTA BUTTON === */
.project-card__cta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 11px 16px;
  border-radius: 50px;
  background: #ffb3cc;
  border: none;
  color: #7A1840;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.25s;
  white-space: nowrap;
  box-shadow: 0 8px 18px rgba(255, 120, 170, 0.18);
  position: relative;
  z-index: 1;
}

.project-card__cta:hover {
  background: #ff8fb3;
  color: #7A1840;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(255, 120, 170, 0.3);
}

.github-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

/* === LIGHT MODE === */
[data-theme="light"] .tech-badge {
  background: rgba(255, 179, 204, 0.22);
  color: #7A1840;
  border-color: rgba(255, 179, 204, 0.35);
}

[data-theme="light"] .tech-badge:hover {
  background: rgba(255, 179, 204, 0.32);
  border-color: rgba(255, 120, 170, 0.5);
}

[data-theme="light"] .project-card__title {
  color: #1a0812;
}

[data-theme="light"] .project-card__description {
  color: #5a5a5a;
}

[data-theme="light"] .project-card__cta {
  background: #ffb3cc;
  color: #ffffff;
}

[data-theme="light"] .project-card__cta:hover {
  background: #ff8fb3;
  color: #ffffff;
}

[data-theme="light"] .status--featured {
  background: rgba(255, 143, 171, 0.16);
  color: #9a1f52;
}

[data-theme="light"] .status--confidential {
  background: rgba(99, 102, 241, 0.14);
  color: #4f46e5;
}

/* === DARK MODE === */
[data-theme="dark"] .project-card {
  background: linear-gradient(
    180deg,
    rgba(0, 229, 255, 0.08) 0%,
    rgba(0, 188, 212, 0.05) 100%
  );
  border-color: rgba(0, 229, 255, 0.16);
  box-shadow:
    0 12px 28px rgba(0, 229, 255, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

[data-theme="dark"] .tech-badge {
  background: rgba(0, 229, 255, 0.15);
  color: #00e5ff;
  border: 1px solid rgba(0, 229, 255, 0.25);
}

[data-theme="dark"] .tech-badge:hover {
  background: rgba(0, 229, 255, 0.22);
  border-color: rgba(0, 229, 255, 0.4);
}

[data-theme="dark"] .project-card__title {
  color: #ffffff;
}

[data-theme="dark"] .project-card__description {
  color: rgba(255, 255, 255, 0.75);
}

[data-theme="dark"] .project-card:hover {
  border-color: rgba(0, 229, 255, 0.34);
  background: linear-gradient(
    180deg,
    rgba(0, 229, 255, 0.11) 0%,
    rgba(0, 188, 212, 0.08) 100%
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

  .project-card__badges {
    gap: 6px;
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
