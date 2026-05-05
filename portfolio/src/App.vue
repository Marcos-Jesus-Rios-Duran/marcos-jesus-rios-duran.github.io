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
      <div class="footer-inner">
        <div class="footer-brand">
          <h3 class="footer-name">COXIDEV</h3>
          <p class="footer-role">Marcos Jesús Ríos Durán · Desarrollador de Software | Estudiante de Ingeniería</p>
          <p class="footer-sub">{{ t('footer.made_with') }}</p>
        </div>

        <nav class="footer-links" aria-label="Footer navigation">
          <router-link :to="{ name: 'home' }">Inicio</router-link>
          <router-link :to="{ name: 'about' }">Sobre mí</router-link>
          <router-link :to="{ name: 'projects' }">Proyectos</router-link>
          <router-link :to="{ name: 'contact' }">Contacto</router-link>
        </nav>

        <div class="footer-socials">
          <a href="https://github.com/marcos-jesus-rios-duran" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="mailto:marcos@example.com">Email</a>
        </div>
      </div>

      <div class="footer-bottom">
        <span>© {{ currentYear }} COXIDEV. Todos los derechos reservados.</span>
      </div>
    </footer>

    <!-- Onboarding Tour -->
    <OnboardingTour />
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import { useTheme } from '@/stores/useTheme'
import { useOnboarding } from '@/stores/useOnboarding'
import NavBar from '@/components/molecules/NavBar.vue'
import AntigravityCanvas from '@/components/organisms/AntigravityCanvas.vue'
import OnboardingTour from '@/components/organisms/OnboardingTour.vue'

const { t } = useI18n()
const themeStore = useTheme()
const onboardingStore = useOnboarding()
const { mode } = storeToRefs(themeStore)
const currentYear = new Date().getFullYear()

// Iniciar onboarding cuando el app monta
onMounted(() => {
  onboardingStore.initOnboarding()
})
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
  gap: 18px;
  padding: 30px 20px 22px;
  background: rgba(75, 150, 224, 0.75);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-top: 1px solid rgba(255,255,255,0.25);
  color: rgba(255,255,255,0.90);
  font-size: 14px;
  transition: all 0.3s;
  position: relative;
  z-index: 1;
  /* El footer ahora se queda al final del flujo natural */
  width: 100%;
}

.footer-inner {
  width: min(1200px, 100%);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr;
  gap: 16px;
  align-items: start;
}

.footer-name {
  font-size: 22px;
  line-height: 1;
  margin-bottom: 8px;
  letter-spacing: 0.02em;
}

.footer-role {
  font-size: 13px;
  opacity: 0.9;
  margin-bottom: 8px;
}

.footer-sub {
  font-size: 12px;
  opacity: 0.75;
}

.footer-links,
.footer-socials {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer-links a,
.footer-socials a {
  color: inherit;
  text-decoration: none;
  opacity: 0.92;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.footer-links a:hover,
.footer-socials a:hover {
  opacity: 1;
  transform: translateX(2px);
}

.footer-bottom {
  width: min(1200px, 100%);
  margin: 0 auto;
  padding-top: 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.18);
  font-size: 12px;
  opacity: 0.85;
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

[data-theme="dark"] .footer-bottom {
  border-top-color: rgba(0, 229, 255, 0.14);
}

@media (max-width: 900px) {
  .footer-inner {
    grid-template-columns: 1fr;
    gap: 18px;
  }
}
</style>