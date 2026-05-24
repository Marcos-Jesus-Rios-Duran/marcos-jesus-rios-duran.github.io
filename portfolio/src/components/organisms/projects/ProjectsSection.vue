<!-- src/components/organisms/projects/ProjectsSection.vue -->
<!--
  PERF fixes:
  - allProjects computed solo se ejecuta cuando cambia el locale (tm() es el bottleneck)
  - filteredProjects usa un Set lookup en vez de Object.entries cada click
  - availableFilters es constante, no computed ni reactive — se calcula UNA vez
  - Modal siempre montado (ProjectModal usa v-show internamente)
-->
<template>
  <section class="projects-section">
    <!-- Header -->
    <div class="projects-header">
      <div class="header-content">
        <h2 class="projects-title">{{ t('projects.title') }}</h2>
        <p class="projects-subtitle">{{ t('projects.subtitle') }}</p>
      </div>

      <div class="filter-controls" role="group" :aria-label="t('projects.filter_all')">
        <button
          v-for="filter in availableFilters"
          :key="filter.value"
          class="filter-btn"
          :class="{ 'filter-btn--active': activeFilter === filter.value }"
          @click="setFilter(filter.value)"
        >
          {{ filter.label }}
        </button>
      </div>
    </div>

    <!-- Projects Grid -->
    <ProjectsGrid :projects="filteredProjects" @projectOpened="openModal" />

    <!-- Empty state -->
    <div v-if="!hasProjects" class="empty-state" role="status">
      <p>{{ t('projects.empty_message') || 'Los proyectos serán publicados próximamente.' }}</p>
    </div>

    <!-- Modal — siempre montado, cero costo en apertura -->
    <ProjectModal
      :project="selectedProject"
      :is-open="isModalOpen"
      @close="closeModal"
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
import { getStatusKey } from '@/components/organisms/projects/useProjectStatus'

const { t, tm, locale } = useI18n()
const { mode } = storeToRefs(useTheme())
const canvasPaused = inject('canvasPaused', null)

const activeFilter = ref('all')
const selectedProject = ref(null)
const isModalOpen = ref(false)

// ─── Canvas pause ────────────────────────────────────────────────────────────
onMounted(() => {
  if (mode.value === 'light' && canvasPaused) canvasPaused.value = true
})

watch(mode, (m) => {
  if (canvasPaused) canvasPaused.value = m === 'light'
})

onUnmounted(() => {
  if (canvasPaused) canvasPaused.value = false
})

// ─── EXCLUIDOS: keys que no son proyectos ────────────────────────────────────
const EXCLUDED_KEYS = new Set([
  'title', 'subtitle', 'status', 'cta_view', 'cta_visit',
  'empty_message', 'filter_all', 'filter_featured',
  'filter_opensource', 'filter_development'
])

// ─── allProjects: se recalcula solo al cambiar locale, NO en cada filter click ──
const allProjects = computed(() => {
  // locale.value como dependencia explícita — tm() no siempre activa el tracking
  void locale.value
  const result = tm('projects')
  if (!result || typeof result !== 'object') return {}

  const out = {}
  for (const [key, value] of Object.entries(result)) {
    if (
      !EXCLUDED_KEYS.has(key) &&
      typeof value === 'object' &&
      value !== null &&
      (value.name || value.description)
    ) {
      out[key] = value
    }
  }
  return out
})

// ─── Filtros — objeto constante, sin reactivity overhead ─────────────────────
// Se inicializa aquí porque t() ya está disponible en setup (sync)
const availableFilters = [
  { label: t('projects.filter_all')         || 'Todos',         value: 'all' },
  { label: t('projects.filter_featured')    || 'Destacados',    value: 'featured' },
  { label: t('projects.filter_development') || 'En Desarrollo', value: 'development' },
  { label: t('projects.filter_opensource')  || 'Open Source',   value: 'opensource' },
]

// ─── Filter predicates — sin string.includes() en caliente ───────────────────
const FILTER_FN = {
  all:         () => true,
  featured:    (p) => getStatusKey(p.status) === 'featured',
  development: (p) => getStatusKey(p.status) === 'development',
  opensource:  (p) => getStatusKey(p.status) === 'opensource',
}

const filteredProjects = computed(() => {
  const fn = FILTER_FN[activeFilter.value] ?? FILTER_FN.all
  if (activeFilter.value === 'all') return allProjects.value

  const out = {}
  for (const [key, project] of Object.entries(allProjects.value)) {
    if (fn(project)) out[key] = project
  }
  return out
})

const hasProjects = computed(() => Object.keys(filteredProjects.value).length > 0)

// ─── Handlers ─────────────────────────────────────────────────────────────────
// setFilter como función nombrada — más fácil de memoizar si se necesita
const setFilter = (value) => { activeFilter.value = value }

const openModal = (project) => {
  selectedProject.value = project
  isModalOpen.value = true
}

const closeModal = () => { isModalOpen.value = false }
</script>

<style scoped>
.projects-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 36px;
}

/* === HEADER === */
.projects-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 28px;
  flex-wrap: wrap;
}

.header-content { flex: 1; min-width: 240px; }

.projects-title {
  font-size: 2.8rem;
  font-weight: 900;
  margin: 0 0 10px;
  color: var(--texto);
  letter-spacing: -0.025em;
  line-height: 1.1;
}

.projects-subtitle {
  font-size: 1.1rem;
  color: var(--textoSub);
  margin: 0;
  line-height: 1.65;
}

/* === FILTER CONTROLS === */
.filter-controls {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items: center;
}

.filter-btn {
  padding: 9px 20px;
  border-radius: 50px;
  border: 1.5px solid rgba(255, 179, 204, 0.28);
  background: rgba(255, 255, 255, 0.07);
  color: rgba(255, 255, 255, 0.55);
  font-weight: 600;
  font-size: 0.88rem;
  cursor: pointer;
  /* GPU-composited: solo transform + opacity, sin box-shadow en transition → más rápido */
  transition: color 0.16s, background 0.16s, border-color 0.16s, transform 0.16s;
  letter-spacing: 0.01em;
  line-height: 1;
}

.filter-btn:hover {
  background: rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.9);
  border-color: rgba(255, 179, 204, 0.5);
  transform: translateY(-2px);
}

.filter-btn--active {
  background: rgba(255, 143, 171, 0.18);
  border-color: rgba(255, 143, 171, 0.55);
  color: #ffb3cc;
  font-weight: 700;
  transform: translateY(-1px);
}

/* Light mode */
[data-theme="light"] .filter-btn {
  background: rgba(255, 255, 255, 0.82);
  border-color: rgba(255, 179, 204, 0.35);
  color: #b0456e;
  box-shadow: 0 2px 8px rgba(176, 69, 110, 0.08);
}

[data-theme="light"] .filter-btn:hover {
  background: rgba(255, 255, 255, 0.98);
  color: #7a1840;
  border-color: rgba(255, 143, 171, 0.55);
}

[data-theme="light"] .filter-btn--active {
  background: rgba(255, 179, 204, 0.28);
  border-color: rgba(255, 143, 171, 0.6);
  color: #7a1840;
}

/* Dark mode */
[data-theme="dark"] .filter-btn {
  background: rgba(0, 229, 255, 0.04);
  border-color: rgba(0, 229, 255, 0.18);
  color: rgba(255, 255, 255, 0.5);
}

[data-theme="dark"] .filter-btn:hover {
  background: rgba(0, 229, 255, 0.09);
  border-color: rgba(0, 229, 255, 0.4);
  color: rgba(255, 255, 255, 0.95);
}

[data-theme="dark"] .filter-btn--active {
  background: rgba(0, 229, 255, 0.13);
  border-color: rgba(0, 229, 255, 0.5);
  color: #00e5ff;
}

/* === EMPTY STATE === */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--textoSub);
  font-size: 1.05rem;
}

/* === RESPONSIVE === */
@media (max-width: 768px) {
  .projects-section  { gap: 26px; }
  .projects-header   { flex-direction: column; gap: 18px; }
  .projects-title    { font-size: 2rem; }
  .projects-subtitle { font-size: 0.97rem; }

  .filter-controls {
    justify-content: flex-start;
    width: 100%;
    gap: 6px;
  }

  .filter-btn {
    flex: 1;
    min-width: 80px;
    text-align: center;
    padding: 8px 12px;
  }
}

@media (max-width: 480px) {
  .projects-title { font-size: 1.7rem; }

  .filter-btn {
    font-size: 0.8rem;
    padding: 7px 10px;
  }
}
</style>