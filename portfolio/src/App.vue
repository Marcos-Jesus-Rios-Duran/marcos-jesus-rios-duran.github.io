<template>
  <div class="app-layout" :data-theme="mode">
    <NavBar />

    <!-- El canvas ahora envuelve el contenido y crece con flex: 1 -->
    <AntigravityCanvas class="canvas-base">
      <main class="main-content">
        <RouterView v-slot="{ Component }">
          <Transition name="page">
            <component :is="Component" />
          </Transition>
        </RouterView>
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
/* Reset básico para asegurar que el height funcione */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Fondo del documento = color del canvas para evitar flash blanco */
html {
  background-color: #4b96e0;
}

[data-theme="dark"] html,
html[data-theme="dark"] {
  background-color: #0a0a0f;
}

body {
  font-family: 'Poppins', 'Segoe UI', system-ui, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji', sans-serif;
  color: var(--texto);
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  /* Mismos colores que el canvas para que el body nunca muestre blanco */
  background-color: #4b96e0;
}

[data-theme="dark"] body {
  background-color: #0a0a0f;
}

.app-layout {
  /* Usamos flexbox para controlar la distribución vertical */
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.canvas-base {
  /* flex: 1 hace que este contenedor ocupe todo el espacio sobrante */
  flex: 1;
  display: flex;
  flex-direction: column;
}

.main-content {
  width: 100%;
  /* flex: 1 aquí asegura que el main crezca dentro del canvas */
  flex: 1;
  padding-top: 70px;
  /* Necesario para anclar el page-leave-active (position:absolute) dentro del layout */
  position: relative;
}

.footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 32px 20px;
  background: rgba(75, 150, 224, 0.75);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-top: 1px solid rgba(255,255,255,0.25);
  color: rgba(255,255,255,0.90);
  font-size: 14px;
  transition: all 0.3s;
  position: relative;
  z-index: 10;
  /* El footer ahora se queda al final del flujo natural */
  width: 100%;
}

.footer-sub {
  font-size: 12px;
  opacity: 0.7;
}

/* Transición de páginas — cross-fade sin gap (sin mode out-in para evitar frame vacío) */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.12s ease;
}

/* El que sale va a position absolute para no ocupar espacio mientras el nuevo entra */
.page-leave-active {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  pointer-events: none;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}

/* Ajustes para el tema oscuro */
[data-theme="dark"] .footer {
  background: rgba(10, 10, 15, 0.92);
  border-top-color: rgba(0,229,255,0.15);
  color: rgba(255,255,255,0.70);
}
</style>