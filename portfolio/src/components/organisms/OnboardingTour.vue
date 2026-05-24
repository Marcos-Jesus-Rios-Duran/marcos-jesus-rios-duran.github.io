<!-- OnboardingTour.vue -->
<template>
  <Teleport to="body" v-if="store.isActive">
    <!-- Overlay oscuro de fondo -->
    <div class="onboarding-overlay" :style="overlayVars" @click="store.skipOnboarding">
      <!-- Spotlight ring por encima del overlay (HUD estilo videojuego) -->
      <div
        v-if="shouldSpotlight"
        class="spotlight-ring"
        :style="ringStyle"
        aria-hidden="true"
        @click.stop
      ></div>

      <!-- Card con el contenido del paso actual -->
      <div
        class="onboarding-card"
        :class="cardClasses"
        @click.stop
      >
        <!-- Progreso visual -->
        <div class="onboarding-progress">
          <div class="progress-bar" :style="{ width: store.progress + '%' }"></div>
          <span class="progress-text">{{ store.progress }}%</span>
        </div>

        <!-- Contenido -->
        <h2 class="onboarding-title">{{ currentStep?.title }}</h2>
        <p class="onboarding-description">{{ currentStep?.description }}</p>

        <!-- Controles -->
        <div class="onboarding-controls">
          <button
            v-if="store.currentStep > 0"
            class="btn-control btn-back"
            @click="store.previousStep"
          >
            ← Atrás
          </button>

          <button
            class="btn-control btn-skip"
            @click="store.skipOnboarding"
          >
            Saltar tour
          </button>

          <button
            class="btn-control btn-next"
            @click="store.isLastStep ? store.finishOnboarding() : store.nextStep()"
          >
            {{ store.isLastStep ? '¡Comenzar!' : 'Siguiente' }} <span class="material-icons-round" style="font-size: 1rem; vertical-align: middle;">{{ store.isLastStep ? 'rocket_launch' : 'arrow_forward' }}</span>
          </button>
        </div>

        <!-- Indicador de paso -->
        <div class="step-indicator">
          <span v-for="(step, idx) in store.steps"
                :key="idx"
                :class="['dot', { active: idx === store.currentStep, completed: idx < store.currentStep }]"
                @click="goToStep(idx)"
          ></span>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch, computed, onMounted, onUnmounted } from 'vue'
import { useOnboarding } from '@/stores/useOnboarding'

const store = useOnboarding()

const currentStep = computed(() => store.currentStepData)

const spotlight = ref({
  // Centro del spotlight (para el mask del overlay)
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
  r: 1,
  // Box del ring (para resaltar el target)
  top: 0,
  left: 0,
  width: 0,
  height: 0,
  radius: '16px'
})

const spotlightActive = ref(false)
const shouldSpotlight = computed(() => spotlightActive.value)

const overlayVars = computed(() => ({
  '--spotlight-x': `${spotlight.value.x}px`,
  '--spotlight-y': `${spotlight.value.y}px`,
  '--spotlight-r': `${spotlight.value.r}px`
}))

const ringStyle = computed(() => ({
  top: `${spotlight.value.top}px`,
  left: `${spotlight.value.left}px`,
  width: `${spotlight.value.width}px`,
  height: `${spotlight.value.height}px`,
  borderRadius: spotlight.value.radius
}))

const cardClasses = computed(() => [
  `position-${currentStep.value?.position}`,
  {
    'mobile-drawer-step': isMobileViewport() && ['language', 'theme'].includes(currentStep.value?.id)
  }
])

function isMobileViewport() {
  return window.innerWidth <= 980
}

function shouldOpenDrawerForStep() {
  const stepId = currentStep.value?.id
  return isMobileViewport() && (stepId === 'language' || stepId === 'theme')
}

function syncMobileDrawerForStep() {
  const open = shouldOpenDrawerForStep()
  window.dispatchEvent(new CustomEvent('onboarding:mobile-menu', { detail: { open } }))
}

function findVisibleTarget(selector) {
  const elements = Array.from(document.querySelectorAll(selector))
  return elements.find((el) => {
    const rect = el.getBoundingClientRect()
    const style = window.getComputedStyle(el)
    return (
      rect.width > 0 &&
      rect.height > 0 &&
      style.display !== 'none' &&
      style.visibility !== 'hidden' &&
      style.opacity !== '0'
    )
  }) || null
}

// Calcular posición del target para el spotlight
function updateSpotlightPosition() {
  const targetSelector = currentStep.value?.target

  if (!targetSelector) {
    spotlight.value = {
      x: -9999,
      y: -9999,
      r: 1,
      top: 0,
      left: 0,
      width: 0,
      height: 0,
      radius: '16px'
    }
    spotlightActive.value = false
    return
  }

  const element = findVisibleTarget(targetSelector)
  if (!element) {
    spotlight.value = {
      x: -9999,
      y: -9999,
      r: 1,
      top: 0,
      left: 0,
      width: 0,
      height: 0,
      radius: '16px'
    }
    spotlightActive.value = false
    return
  }

  const rect = element.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2

  const maxDim = Math.max(rect.width, rect.height)
  const r = maxDim / 2 + 44 // tamaño del “agujero” del overlay

  const ringPadding = 10
  const computedBorderRadius = window.getComputedStyle(element).borderRadius || '16px'

  spotlight.value = {
    x: centerX,
    y: centerY,
    r,
    top: rect.top - ringPadding,
    left: rect.left - ringPadding,
    width: rect.width + ringPadding * 2,
    height: rect.height + ringPadding * 2,
    radius: computedBorderRadius
  }
  spotlightActive.value = true
}

// Throttle con rAF para scroll/resize (evita recalcular 1000 veces/seg)
let rafUpdate = 0
function scheduleUpdate() {
  if (rafUpdate) return
  rafUpdate = requestAnimationFrame(() => {
    rafUpdate = 0
    updateSpotlightPosition()
  })
}

// Navegación directo a un paso
function goToStep(idx) {
  store.currentStep = idx
  store.scrollToTarget()
}

watch(() => store.currentStep, () => {
  syncMobileDrawerForStep()
  updateSpotlightPosition()

  // Espera breve para transición del drawer en mobile y recalcula.
  setTimeout(() => {
    updateSpotlightPosition()
  }, 300)
})

onMounted(() => {
  syncMobileDrawerForStep()
  updateSpotlightPosition()
  window.addEventListener('resize', scheduleUpdate)
  window.addEventListener('scroll', scheduleUpdate, { passive: true })
})

onUnmounted(() => {
  // Al cerrar tour, devolvemos el drawer móvil a cerrado.
  window.dispatchEvent(new CustomEvent('onboarding:mobile-menu', { detail: { open: false } }))
  window.removeEventListener('resize', scheduleUpdate)
  window.removeEventListener('scroll', scheduleUpdate)
  if (rafUpdate) cancelAnimationFrame(rafUpdate)
})
</script>

<style scoped>
.onboarding-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: all;
}

/* Oscurecer fondo excepto “agujero” del spotlight (CSS mask) */
.onboarding-overlay::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1;

  /* Mask radial: transparente en el centro, opaco fuera */
  -webkit-mask-image: radial-gradient(
    circle var(--spotlight-r) at var(--spotlight-x) var(--spotlight-y),
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0) 55%,
    rgba(0, 0, 0, 1) 75%,
    rgba(0, 0, 0, 1) 100%
  );
  mask-image: radial-gradient(
    circle var(--spotlight-r) at var(--spotlight-x) var(--spotlight-y),
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0) 55%,
    rgba(0, 0, 0, 1) 75%,
    rgba(0, 0, 0, 1) 100%
  );

  pointer-events: none;
}

.spotlight-ring {
  position: fixed;
  z-index: 2;
  pointer-events: auto;
  border: 2px solid rgba(0, 229, 255, 0.65);
  background: rgba(0, 229, 255, 0.06);
  box-shadow:
    0 0 0 2px rgba(0, 229, 255, 0.16),
    0 0 60px rgba(0, 229, 255, 0.35);
  transition:
    top 250ms ease,
    left 250ms ease,
    width 250ms ease,
    height 250ms ease,
    border-radius 250ms ease;
}

.onboarding-card {
  position: fixed;
  background: rgba(10, 10, 15, 0.98);
  backdrop-filter: blur(16px);
  border: 1.5px solid rgba(0, 229, 255, 0.5);
  border-radius: 16px;
  padding: 32px;
  max-width: 420px;
  z-index: 3;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.9),
              0 0 60px rgba(0, 229, 255, 0.3);
  animation: slideIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Posicionamiento según step */
.position-center {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.position-top-center {
  top: 120px;
  left: 50%;
  transform: translateX(-50%);
}

/* Ajuste dedicado para skills: dejar visible la cuadrícula central */
.position-top-skills {
  top: 86px;
  right: 34px;
  left: auto;
  transform: none;
  max-width: 390px;
}

.position-bottom-center {
  bottom: 120px;
  left: 50%;
  transform: translateX(-50%);
}

.position-bottom-left {
  bottom: 120px;
  right: 40px;
}

.position-top-mentor {
  top: 74px;
  right: 34px;
  left: auto;
  transform: none;
  max-width: 380px;
}
.position-left-center {
  left: 40px;
  top: 50%;
  transform: translateY(-50%);
}

.onboarding-progress {
  position: relative;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  margin-bottom: 24px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #00e5ff, #0099ff);
  border-radius: 2px;
  transition: width 0.4s ease;
}

.progress-text {
  position: absolute;
  right: 8px;
  top: -20px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.onboarding-title {
  font-size: 24px;
  font-weight: 700;
  color: #00e5ff;
  margin: 0 0 12px 0;
  line-height: 1.3;
}

.onboarding-description {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin: 0 0 24px 0;
}

.onboarding-controls {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.btn-control {
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s;
  flex: 1;
  min-width: 100px;
}

.btn-back {
  background: rgba(0, 229, 255, 0.1);
  color: #00e5ff;
  border: 1px solid rgba(0, 229, 255, 0.3);
}

.btn-back:hover {
  background: rgba(0, 229, 255, 0.2);
  border-color: rgba(0, 229, 255, 0.6);
}

.btn-skip {
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.btn-skip:hover {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.9);
}

.btn-next {
  background: linear-gradient(135deg, #00e5ff, #0099ff);
  color: #000;
  font-weight: 700;
}

.btn-next:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 229, 255, 0.4);
}

.step-indicator {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.25s;
}

.dot.active {
  background: #00e5ff;
  transform: scale(1.3);
}

.dot.completed {
  background: rgba(0, 229, 255, 0.6);
}

.dot:hover {
  background: rgba(0, 229, 255, 0.8);
}

/* Responsive */
@media (max-width: 640px) {
  .onboarding-card {
    max-width: 90vw;
    margin: 0 auto;
    padding: 24px;
  }

  /* En pasos del drawer, dejamos visible el selector/acciones del menú lateral */
  .onboarding-card.mobile-drawer-step {
    bottom: 14px;
    top: auto;
    left: 50%;
    right: auto;
    transform: translateX(-50%);
    width: min(92vw, 360px);
    max-width: min(92vw, 360px);
    padding: 18px;
  }

  .onboarding-title {
    font-size: 20px;
  }

  .onboarding-description {
    font-size: 14px;
  }

  .btn-control {
    padding: 8px 12px;
    font-size: 12px;
    min-width: 80px;
  }

  .position-top-skills,
  .position-top-mentor {
    top: 76px;
    left: 50%;
    right: auto;
    transform: translateX(-50%);
    max-width: 90vw;
  }
}
</style>
