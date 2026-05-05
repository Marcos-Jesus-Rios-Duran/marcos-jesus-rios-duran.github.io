<!-- OnboardingTour.vue -->
<template>
  <Teleport to="body" v-if="store.isActive">
    <!-- Overlay oscuro de fondo -->
    <div class="onboarding-overlay" @click="store.skipOnboarding">
      <!-- Canvas para el spotlight effect -->
      <canvas 
        ref="spotlightCanvas" 
        class="spotlight-canvas"
        @click.stop
      ></canvas>

      <!-- Card con el contenido del paso actual -->
      <div 
        class="onboarding-card"
        :class="`position-${currentStep?.position}`"
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
            @click="store.nextStep"
          >
            {{ store.isLastStep ? '¡Comenzar! 🚀' : 'Siguiente →' }}
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
const spotlightCanvas = ref(null)
let animationId = null

const currentStep = computed(() => store.currentStepData)

const spotlightSize = ref(120)
const spotlightX = ref(window.innerWidth / 2)
const spotlightY = ref(window.innerHeight / 2)

// Dibujar el spotlight effect
function drawSpotlight() {
  const canvas = spotlightCanvas.value
  if (!canvas) return

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  const ctx = canvas.getContext('2d')
  
  // Fondo oscuro semitransparente
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Spotlight circular
  if (currentStep.value?.highlight) {
    const gradient = ctx.createRadialGradient(
      spotlightX.value, spotlightY.value, spotlightSize.value * 0.3,
      spotlightX.value, spotlightY.value, spotlightSize.value
    )
    gradient.addColorStop(0, 'rgba(0, 229, 255, 0.3)')
    gradient.addColorStop(1, 'rgba(0, 229, 255, 0)')
    
    // Limpiar el spotlight (hacerlo transparente)
    ctx.clearRect(
      spotlightX.value - spotlightSize.value,
      spotlightY.value - spotlightSize.value,
      spotlightSize.value * 2,
      spotlightSize.value * 2
    )
    
    // Dibujar borde del spotlight
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.6)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(spotlightX.value, spotlightY.value, spotlightSize.value, 0, Math.PI * 2)
    ctx.stroke()
  }

  animationId = requestAnimationFrame(drawSpotlight)
}

// Calcular posición del target para el spotlight
function updateSpotlightPosition() {
  if (!currentStep.value?.target) {
    spotlightX.value = window.innerWidth / 2
    spotlightY.value = window.innerHeight / 2
    spotlightSize.value = 120
    return
  }

  const element = document.querySelector(currentStep.value.target)
  if (element) {
    const rect = element.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const maxDim = Math.max(rect.width, rect.height)

    spotlightX.value = centerX
    spotlightY.value = centerY
    spotlightSize.value = maxDim / 2 + 30
  }
}

// Manejar resize
function handleResize() {
  updateSpotlightPosition()
}

// Navegación directo a un paso
function goToStep(idx) {
  store.currentStep = idx
  store.scrollToTarget()
}

watch(() => store.currentStep, () => {
  updateSpotlightPosition()
})

onMounted(() => {
  updateSpotlightPosition()
  drawSpotlight()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  window.removeEventListener('resize', handleResize)
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

.spotlight-canvas {
  position: absolute;
  top: 0;
  left: 0;
  cursor: pointer;
}

.onboarding-card {
  position: fixed;
  background: rgba(10, 10, 15, 0.95);
  backdrop-filter: blur(12px);
  border: 1.5px solid rgba(0, 229, 255, 0.4);
  border-radius: 16px;
  padding: 32px;
  max-width: 400px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8), 
              0 0 40px rgba(0, 229, 255, 0.2);
  animation: slideIn 0.4s ease-out;
  z-index: 10000;
  pointer-events: all;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Posicionamiento según step */
.position-center {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.position-top {
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
}

.position-bottom {
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
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
}
</style>
