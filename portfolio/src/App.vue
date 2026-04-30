<template>
  <div class="app-layout" :data-theme="mode">
    <NavBar />
    <AntigravityCanvas class="canvas-base">
      <main class="main-content">
        <RouterView />
      </main>
    </AntigravityCanvas>
    <footer class="footer">
      <span>© 2026 Marcos Jesús Ríos Durán</span>
      <span class="footer-sub">{{ t('footer.made_with') }}</span>
    </footer>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useTheme } from '@/stores/useTheme'
import NavBar from '@/components/molecules/NavBar.vue'
import AntigravityCanvas from '@/components/organisms/AntigravityCanvas.vue'

const { t } = useI18n()
const store = useTheme()
const { mode } = storeToRefs(store)
</script>

<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'Poppins', 'Segoe UI', system-ui, sans-serif;
  color: var(--texto);
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.canvas-base { flex: 1; }

.main-content {
  width: 100%;
  min-height: 100vh;
  padding-top: 70px;
}

.footer {
  display: flex; flex-direction: column; align-items: center;
  gap: 6px; padding: 32px 20px;
  background: rgba(75, 150, 224, 0.75);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-top: 1px solid rgba(255,255,255,0.25);
  color: rgba(255,255,255,0.90);
  font-size: 14px;
  transition: all 0.3s;
  position: relative;
  z-index: 10;
}

.footer-sub { font-size: 12px; opacity: 0.7; }

[data-theme="dark"] .footer {
  background: rgba(10, 10, 15, 0.92);
  border-top-color: rgba(0,229,255,0.15);
  color: rgba(255,255,255,0.70);
}
</style>