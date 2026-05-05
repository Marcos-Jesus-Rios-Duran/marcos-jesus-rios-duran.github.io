<template>
  <div>
    <HeroSection />
    <SkillsSection />
    <MentorsView />

    <button
      v-show="showBackToTop"
      class="back-to-top"
      type="button"
      aria-label="Volver al inicio"
      @click="scrollToTop"
    >
      <span class="material-icons-round">north</span>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import HeroSection from '@/components/organisms/hero/HeroSection.vue'
import SkillsSection from '@/components/organisms/SkillsSection.vue'
import MentorsView from '@/components/organisms/MentorsView.vue'

const showBackToTop = ref(false)

const onScroll = () => {
  showBackToTop.value = window.scrollY > 320
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<style scoped>
.back-to-top {
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: 52px;
  height: 52px;
  border: none;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 920;
  color: #0a0a0f;
  background: linear-gradient(135deg, #00e5ff, #00bcd4);
  box-shadow: 0 10px 22px rgba(0, 229, 255, 0.3);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.back-to-top:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 28px rgba(0, 229, 255, 0.36);
}

[data-theme="light"] .back-to-top {
  color: #7A1840;
  background: linear-gradient(135deg, #FFB3CC, #FF8FAB);
  box-shadow: 0 10px 22px rgba(255, 120, 170, 0.28);
}

[data-theme="light"] .back-to-top:hover {
  box-shadow: 0 14px 28px rgba(255, 120, 170, 0.34);
}

.back-to-top .material-icons-round {
  font-size: 28px;
  line-height: 1;
}

@media (max-width: 768px) {
  .back-to-top {
    right: 14px;
    bottom: 14px;
    width: 48px;
    height: 48px;
  }

  .back-to-top .material-icons-round {
    font-size: 26px;
  }
}
</style>
