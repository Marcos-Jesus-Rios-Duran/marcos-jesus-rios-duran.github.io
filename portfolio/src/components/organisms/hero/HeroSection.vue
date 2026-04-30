<!-- src/components/organisms/HeroSection.vue -->
<template>
  <section class="hero-section">
    <Transition
      name="hero"
      mode="out-in"
    >
      <div class="hero-container" key="hero">
        <HeroLeft class="hero-left-col" />
        <HeroRight class="hero-right-col" />
      </div>
    </Transition>
  </section>
</template>

<script setup>
import HeroLeft  from '@/components/organisms//hero/HeroLeft.vue'
import HeroRight from '@/components/organisms//hero/HeroRight.vue'
</script>

<style scoped>
.hero-section {
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
}

.hero-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: start;
}

/* === TRANSICIONES === */
.hero-enter-active {
  transition: opacity 0.24s ease;
}

.hero-leave-active {
  transition: opacity 0.24s ease;
}

.hero-enter-from {
  opacity: 0;
}

.hero-leave-to {
  opacity: 0;
}

/* Tablet (768px a 1024px) */
@media (max-width: 1024px) {
  .hero-container {
    gap: 30px;
  }
}

/* Móvil (hasta 768px) */
@media (max-width: 768px) {
  .hero-section {
    min-height: auto;
  }

  .hero-container {
    grid-template-columns: 1fr;
    gap: 40px;
    align-items: center;
    padding: 40px 16px;
  }
}

/* Móvil pequeño (hasta 480px) */
@media (max-width: 480px) {
  .hero-container {
    gap: 30px;
    padding: 30px 16px;
  }
}
</style>