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

    <!-- Status badge -->
    <div v-if="projectStatus" class="status-info">
      <span class="status-badge">{{ projectStatus }}</span>
      <span class="status-text">{{ t('projects.status') }}</span>
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
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ProjectsGrid from '@/components/molecules/ProjectsGrid.vue'
import ProjectModal from '@/components/molecules/ProjectModal.vue'

const { t, tm } = useI18n()
const activeFilter = ref('all')
const selectedProject = ref(null)
const isModalOpen = ref(false)

const projectStatus = computed(() => t('projects.status'))

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
  { label: t('projects.filter_opensource') || 'Open Source', value: 'opensource' }
]

const filteredProjects = computed(() => {
  if (activeFilter.value === 'all') return allProjects.value

  const projects = Object.entries(allProjects.value).reduce((acc, [key, project]) => {
    let shouldInclude = false

    if (activeFilter.value === 'featured') {
      shouldInclude = !project.status || project.status.includes('desarrollo')
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
  color: white;
  letter-spacing: -0.02em;
}

.projects-subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
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
  padding: 10px 18px;
  border-radius: 50px;
  border: 1.5px solid rgba(255, 179, 204, 0.3);
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn:hover {
  border-color: rgba(255, 179, 204, 0.6);
  color: rgba(255, 255, 255, 1);
}

.filter-btn--active {
  background: linear-gradient(135deg, rgba(255, 179, 204, 0.2), rgba(255, 143, 181, 0.15));
  border-color: rgba(255, 179, 204, 0.6);
  color: white;
  font-weight: 600;
}

/* === STATUS INFO === */
.status-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
}

.status-badge {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  background: rgba(255, 193, 7, 0.15);
  color: #ffc107;
  border: 1px solid rgba(255, 193, 7, 0.3);
  text-transform: capitalize;
}

.status-text {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.6);
}

/* === EMPTY STATE === */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 1.1rem;
}

/* === DARK MODE === */
[data-theme="dark"] .filter-btn {
  border-color: rgba(0, 229, 255, 0.2);
  color: rgba(255, 255, 255, 0.6);
}

[data-theme="dark"] .filter-btn:hover {
  border-color: rgba(0, 229, 255, 0.5);
  color: rgba(255, 255, 255, 1);
}

[data-theme="dark"] .filter-btn--active {
  background: linear-gradient(135deg, rgba(0, 229, 255, 0.15), rgba(0, 188, 212, 0.1));
  border-color: rgba(0, 229, 255, 0.5);
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
