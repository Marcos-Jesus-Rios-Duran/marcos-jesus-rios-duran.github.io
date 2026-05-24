<!-- src/components/molecules/ProjectsGrid.vue -->
<!--
  Sin cambios de lógica. Grid con contain: layout style
  para reducir recalculo de layout al filtrar.
-->
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
import ProjectCard from './ProjectCard.vue'

defineProps({
  projects: {
    type: [Object, Array],
    default: () => ({})
  }
})

defineEmits(['projectOpened'])

// Puro, sin side-effects — Vue no necesita hacerlo reactive
const processProject = (project, key) => ({
  id: key,
  name: project.name || key,
  ...project
})
</script>

<style scoped>
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
  gap: 20px;
  width: 100%;
  padding: 28px;
  border-radius: 24px;
  /* contain reduce recalculos de layout en el resto de la página al filtrar */
  contain: layout style;

  /* Default (sin tema): dark-first */
  background: linear-gradient(135deg,
    rgba(0, 229, 255, 0.05) 0%,
    rgba(255, 143, 181, 0.03) 100%
  );
  border: 1.5px solid rgba(0, 229, 255, 0.12);
}

[data-theme="light"] .projects-grid {
  background: linear-gradient(135deg, #f5eaf5 0%, #fff5f9 100%);
  border-color: rgba(255, 179, 204, 0.4);
}

[data-theme="dark"] .projects-grid {
  background: linear-gradient(135deg,
    rgba(0, 229, 255, 0.05) 0%,
    rgba(255, 143, 181, 0.03) 100%
  );
  border-color: rgba(0, 229, 255, 0.12);
}

/* === RESPONSIVE === */
@media (max-width: 1024px) {
  .projects-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
    padding: 22px;
  }
}

@media (max-width: 768px) {
  .projects-grid {
    grid-template-columns: 1fr;
    gap: 14px;
    padding: 16px;
  }
}
</style>