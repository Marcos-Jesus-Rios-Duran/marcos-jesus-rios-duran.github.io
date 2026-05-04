<!-- src/components/molecules/ProjectsGrid.vue -->
<template>
  <div class="projects-grid">
    <ProjectCard
      v-for="(project, key) in projects"
      :key="key"
      :project="processProject(project, key)"
      @open="$emit('projectOpened', $event)"
    />
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import ProjectCard from './ProjectCard.vue'

const { tm } = useI18n()

defineProps({
  projects: {
    type: [Object, Array],
    default: () => ({})
  },
  filter: {
    type: String,
    default: 'all'
  }
})

defineEmits(['projectOpened'])

const processProject = (project, key) => {
  return {
    id: key,
    name: project.name || key,
    ...project
  }
}
</script>

<style scoped>
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 24px;
  width: 100%;
  background: linear-gradient(135deg, #f0e5f5 0%, #fff0f6 100%);
  border: 2.5px solid #ffc6e0;
  border-radius: 28px;
  padding: 36px;
  backdrop-filter: blur(10px);
}

[data-theme="dark"] .projects-grid {
  background: linear-gradient(135deg, rgba(0, 229, 255, 0.06) 0%, rgba(255, 143, 181, 0.04) 100%);
  border-color: rgba(0, 229, 255, 0.15);
}

/* === RESPONSIVE === */
@media (max-width: 1024px) {
  .projects-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    padding: 28px;
  }
}

@media (max-width: 768px) {
  .projects-grid {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 20px;
  }
}
</style>
