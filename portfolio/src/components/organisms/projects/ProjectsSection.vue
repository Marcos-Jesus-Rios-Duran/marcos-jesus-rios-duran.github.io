<!-- src/components/organisms/projects/ProjectsSection.vue -->
<template>
  <section class="projects-section">
    <!-- Header -->
    <div class="projects-header">
      <div class="header-content">
        <h2 class="projects-title">{{ t('projects.title') }}</h2>
        <p class="projects-subtitle">{{ t('projects.subtitle') }}</p>
      </div>

      <!-- Filtros opcionales -->
      <div class="filter-controls">
        <button
          v-for="filter in availableFilters"
          :key="filter.value"
          class="filter-btn"
          :class="{ 'filter-btn--active': activeFilter === filter.value }"
          @click="activeFilter = filter.value"
        >
          {{ filter.label }}
        </button>
      </div>
    </div>

    <!-- Projects Grid -->
    <ProjectsGrid :projects="filteredProjects" @projectOpened="openModal" />

    <!-- Empty state -->
    <div v-if="!hasProjects" class="empty-state">
      <p>{{ t('projects.empty_message') || 'Los proyectos serán publicados próximamente.' }}</p>
    </div>

    <!-- Project Modal -->
    <ProjectModal
      :project="selectedProject"
      :is-open="isModalOpen"
      @close="isModalOpen = false"
    />
  </section>
</template>

<script setup>
import { computed, ref, inject, onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useTheme } from '@/stores/useTheme'
import ProjectsGrid from '@/components/molecules/ProjectsGrid.vue'
import ProjectModal from '@/components/molecules/ProjectModal.vue'

const { t, tm } = useI18n()
const { mode } = storeToRefs(useTheme())
const canvasPaused = inject('canvasPaused', null)
const activeFilter = ref('all')
const selectedProject = ref(null)
const isModalOpen = ref(false)

// Pausar/reanudar canvas según tema mientras el componente está montado
onMounted(() => {
  if (mode.value === 'light' && canvasPaused) canvasPaused.value = true
})

watch(mode, (newMode) => {
  if (!canvasPaused) return
  canvasPaused.value = newMode === 'light'
})

onUnmounted(() => {
  if (canvasPaused) canvasPaused.value = false
})

const allProjects = computed(() => {
  const result = tm('projects')
  if (!result || typeof result !== 'object') return {}

  // Filtrar solo los objetos que son proyectos (excluir title, subtitle, status)
  const projectsObj = {}
  Object.entries(result).forEach(([key, value]) => {
    if (
      !['title', 'subtitle', 'status', 'cta_view', 'cta_visit', 'empty_message', 'filter_all', 'filter_featured', 'filter_opensource'].includes(
        key
      ) &&
      typeof value === 'object' &&
      value !== null &&
      (value.name || value.description)
    ) {
      projectsObj[key] = value
    }
  })
  return projectsObj
})

const availableFilters = [
  { label: t('projects.filter_all') || 'Todos', value: 'all' },
  { label: t('projects.filter_featured') || 'Destacados', value: 'featured' },
  { label: t('projects.filter_development') || 'En Desarrollo', value: 'development' },
  { label: t('projects.filter_opensource') || 'Open Source', value: 'opensource' }
]

const filteredProjects = computed(() => {
  if (activeFilter.value === 'all') return allProjects.value

  const projects = Object.entries(allProjects.value).reduce((acc, [key, project]) => {
    let shouldInclude = false

    if (activeFilter.value === 'featured') {
      shouldInclude = project.status === 'featured'
    } else if (activeFilter.value === 'development') {
      shouldInclude = project.status?.includes('Desarrollo')
    } else if (activeFilter.value === 'opensource') {
      shouldInclude = project.status?.includes('Open Source')
    }

    if (shouldInclude) {
      acc[key] = project
    }
    return acc
  }, {})

  return projects
})

const hasProjects = computed(() => Object.keys(filteredProjects.value).length > 0)

const openModal = (project) => {
  selectedProject.value = project
  isModalOpen.value = true
}
</script>

<style scoped>
.projects-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

/* === HEADER === */
.projects-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 32px;
  flex-wrap: wrap;
}

.header-content {
  flex: 1;
  min-width: 250px;
}

.projects-title {
  font-size: 3rem;
  font-weight: 900;
  margin: 0 0 12px 0;
  color: var(--texto);
  letter-spacing: -0.02em;
}

.projects-subtitle {
  font-size: 1.2rem;
  color: var(--textoSub);
  margin: 0;
  line-height: 1.6;
}

/* === FILTER CONTROLS === */
.filter-controls {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items: center;
}

.filter-btn {
  padding: 12px 24px;
  border-radius: 50px;
  border: none;
  background: rgba(255, 255, 255, 0.8);
  color: #b0456e;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(255, 120, 170, 0.15);
  backdrop-filter: blur(8px);
  letter-spacing: 0.3px;
}

.filter-btn:hover {
  background: rgba(255, 255, 255, 0.95);
  color: #7A1840;
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(255, 120, 170, 0.25);
}

.filter-btn--active {
  background: #ffb3cc;
  border: none;
  color: #7A1840;
  font-weight: 700;
  box-shadow: 0 8px 24px rgba(255, 120, 170, 0.3);
  transform: translateY(-2px);
}

/* === EMPTY STATE === */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--textoSub);
  font-size: 1.1rem;
}

/* === LIGHT MODE === */
[data-theme="light"] .filter-btn {
  background: rgba(255, 255, 255, 0.85);
  color: #b0456e;
  box-shadow: 0 4px 15px rgba(255, 120, 170, 0.12);
}

[data-theme="light"] .filter-btn:hover {
  background: rgba(255, 255, 255, 0.98);
  color: #7A1840;
  box-shadow: 0 8px 24px rgba(255, 120, 170, 0.2);
}

[data-theme="light"] .filter-btn--active {
  background: #ffb3cc;
  color: #7A1840;
  box-shadow: 0 8px 24px rgba(255, 120, 170, 0.28);
}

/* === DARK MODE === */
[data-theme="dark"] .filter-btn {
  background: rgba(30, 30, 40, 0.7);
  border: 1.5px solid rgba(0, 229, 255, 0.2);
  color: rgba(255, 255, 255, 0.6);
  box-shadow: 0 4px 15px rgba(0, 229, 255, 0.1);
}

[data-theme="dark"] .filter-btn:hover {
  background: rgba(40, 40, 50, 0.85);
  border-color: rgba(0, 229, 255, 0.5);
  color: rgba(255, 255, 255, 1);
  box-shadow: 0 8px 24px rgba(0, 229, 255, 0.15);
}

[data-theme="dark"] .filter-btn--active {
  background: linear-gradient(135deg, rgba(0, 229, 255, 0.2), rgba(0, 188, 212, 0.15));
  border-color: rgba(0, 229, 255, 0.5);
  color: #00e5ff;
  box-shadow: 0 8px 24px rgba(0, 229, 255, 0.25);
}

/* === RESPONSIVE === */
@media (max-width: 768px) {
  .projects-section {
    gap: 32px;
  }

  .projects-header {
    flex-direction: column;
    gap: 20px;
  }

  .projects-title {
    font-size: 2.2rem;
  }

  .projects-subtitle {
    font-size: 1rem;
  }

  .filter-controls {
    justify-content: flex-start;
    width: 100%;
  }

  .filter-btn {
    flex: 1;
    min-width: 100px;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .projects-title {
    font-size: 1.8rem;
  }

  .filter-btn {
    padding: 8px 14px;
    font-size: 0.85rem;
  }
}
</style>
