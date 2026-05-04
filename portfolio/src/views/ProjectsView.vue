<template>
  <section class="projects-view">
    <div class="projects-container">
      <ProjectsSection />
    </div>
  </section>
</template>

<script setup>
import ProjectsSection from '@/components/organisms/projects/ProjectsSection.vue'
</script>

<style scoped>
.projects-view {
  width: 100%;
  min-height: 100vh;
  padding: 100px 20px 40px;
}

.projects-container {
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  font-size: 3rem;
  font-weight: 900;
  margin-bottom: 12px;
  color: white;
}

.subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.70);
  margin: 0;
}
</style>
