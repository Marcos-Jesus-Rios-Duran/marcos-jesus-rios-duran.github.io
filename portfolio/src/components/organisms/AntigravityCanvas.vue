<template>

  <div ref="arena" class="canvas-wrap"
  :style="{ cursor: paused ? 'auto' : 'none' }">
    <canvas ref="canvas" class="canvas" />
    <div class="cursor-dot" :style="dotStyle" />
    <div class="slot-content">
      <slot />
    </div>
  </div>

</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, provide } from 'vue'
import { useTheme } from '@/stores/useTheme'

const paused = ref(false)
provide('canvasPaused', paused)

const store = useTheme()

const arena = ref(null)
const canvas = ref(null)
const dotStyle = ref({ left: '-99px', top: '-99px' })

const PARTICLE_CONFIG = {
  light: {
    bgTop:    '#4b96e0',
    bgBottom: '#c8e8f5',
    layers: [
      { colors: ['#FFB3CC','#FF8FAB','#FFD6E5','#FF6B9D','#ffcce0'], count: 65, rMin:3, rMax:6 },
      { colors: ['#ffffff','#e0f4ff','#b8dfff'], count: 45, rMin:2, rMax:4 },
      { colors: ['#ffffffaa','#dff0ff'], count: 25, rMin:1, rMax:2.5 }
    ],
    cursor: '#FF8FAB',
    glow:   'rgba(255,255,255,0.18)'
  },
  dark: {
    bgTop:    '#0a0a0f',
    bgBottom: '#0d1117',
    layers: [
      { colors: ['#00e5ff','#00bcd4','#00f5ff','#007c91','#40e8ff'], count: 70, rMin:2, rMax:5 },
      { colors: ['#FFB3CC','#FF8FAB'], count: 25, rMin:2, rMax:4 },
      { colors: ['#ffffff','#aaaacc'], count: 20, rMin:1, rMax:2 }
    ],
    cursor: '#00e5ff',
    glow:   'rgba(0,229,255,0.12)'
  }
}

let ctx, W, H, raf, ro
let mouse = { x: -999, y: -999 }
let arenaRect = { left: 0, top: 0 }
let rawMouse = { x: -999, y: -999 }
let pendingMouse = false
let parts = []
let prevArea = 0
let prevMode = null
let bgGradientCache = null
let bgGradientKey = ''

const REPEL = 110, REPEL_SQ = REPEL * REPEL, FORCE = 22, RETURN = 0.055, DAMPING = 0.80

function resize() {
  const r = arena.value.getBoundingClientRect()
  // Guard: si el layout colapsó temporalmente (durante swap de ruta), conservar últimas dims válidas
  if (r.width === 0 || r.height === 0) return
  W = canvas.value.width  = r.width
  H = canvas.value.height = r.height
  arenaRect.left = r.left
  arenaRect.top = r.top
}
function makeParts() {
  const cfg = PARTICLE_CONFIG[store.mode]

  // Evitar recrear partículas si el cambio de área es pequeño y el modo no cambió
  const currentArea = W * H
  if (parts.length > 0 && prevMode === store.mode && prevArea > 0) {
    const areaDiff = Math.abs(currentArea - prevArea) / prevArea
    if (areaDiff < 0.12) return // menos del 12% de cambio → mantener partículas
  }

  parts = []

  // Factor basado en el área real del canvas vs un viewport base
  const baseArea = 1440 * 900
  let scaleFactor = Math.min(currentArea / baseArea, 3) // máximo 3x para no exagerar

  // Adaptative adjustments for low-power devices / reduced-motion
  try {
    let deviceFactor = 1
    const deviceMem = navigator.deviceMemory || 8
    const hw = navigator.hardwareConcurrency || 4
    if (deviceMem <= 2) deviceFactor *= 0.45
    else if (deviceMem <= 4) deviceFactor *= 0.75
    if (hw <= 2) deviceFactor *= 0.6
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) deviceFactor *= 0.35
    // Clamp so we always have at least a small, visible effect
    deviceFactor = Math.max(0.25, Math.min(deviceFactor, 1))
    scaleFactor = Math.max(0.25, scaleFactor * deviceFactor)
  } catch {
    // ignore - fallback to default scaleFactor
  }

  for (const layer of cfg.layers) {
    const count = Math.round(layer.count * scaleFactor) // ← escala el count
    for (let i = 0; i < count; i++) {
      // Bias: más partículas en la parte superior (más visibles en el hero)
      const x = Math.random() * W
      const y = Math.pow(Math.random(), 1.6) * H
      parts.push({
        x, y, ox: x, oy: y, vx: 0, vy: 0,
        r: layer.rMin + Math.random() * (layer.rMax - layer.rMin),
        color: layer.colors[Math.floor(Math.random() * layer.colors.length)],
        drift: Math.random() * Math.PI * 2,
        driftSpeed: (Math.random() - 0.5) * 0.012,
        driftAmp:   0.1 + Math.random() * 0.2,
        alpha: 0.82 + Math.random() * 0.18
      })
    }
  }

  prevArea = currentArea
  prevMode = store.mode
}

function drawBg() {
  const cfg = PARTICLE_CONFIG[store.mode]  // ✅
  const key = `${store.mode}:${W}:${H}`

  if (bgGradientKey !== key) {
    const grd = ctx.createLinearGradient(0, 0, 0, H)
    grd.addColorStop(0, cfg.bgTop)
    grd.addColorStop(1, cfg.bgBottom)
    bgGradientCache = grd
    bgGradientKey = key
  }

  ctx.fillStyle = bgGradientCache
  ctx.fillRect(0, 0, W, H)
}

function draw() {
  const cfg = PARTICLE_CONFIG[store.mode]  // ✅
  ctx.clearRect(0, 0, W, H)
  drawBg()

  // Apply pending mouse updates from pointer handler (throttled via rAF)
  if (pendingMouse && !paused.value) {
    mouse.x = rawMouse.x
    mouse.y = rawMouse.y
    pendingMouse = false
    const cfgDot = PARTICLE_CONFIG[store.mode]
    dotStyle.value = {
      left:       mouse.x + 'px',
      top:        mouse.y + 'px',
      background: cfgDot.cursor,
      boxShadow:  `0 0 10px ${cfgDot.cursor}`
    }
  }

  if (!paused.value && mouse.x > 0) {
    const grd = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, REPEL * 1.6)
    grd.addColorStop(0, cfg.glow)
    grd.addColorStop(1, 'transparent')
    ctx.fillStyle = grd
    ctx.fillRect(0, 0, W, H)
  }

  for (const p of parts) {
    p.drift += p.driftSpeed
    p.ox += Math.cos(p.drift) * p.driftAmp
    p.oy += Math.sin(p.drift) * p.driftAmp

    const dx = p.x - mouse.x
    const dy = p.y - mouse.y
    const distSq = dx * dx + dy * dy

    if (distSq < REPEL_SQ && distSq > 0) {
      const dist = Math.sqrt(distSq)
      const str = (REPEL - dist) / REPEL
      p.vx += (dx / dist) * str * str * FORCE
      p.vy += (dy / dist) * str * str * FORCE
    }

    p.vx += (p.ox - p.x) * RETURN
    p.vy += (p.oy - p.y) * RETURN
    p.vx *= DAMPING
    p.vy *= DAMPING
    p.x  += p.vx
    p.y  += p.vy

    ctx.beginPath()
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
    ctx.fillStyle = p.color
    ctx.globalAlpha = p.alpha
    ctx.fill()
    ctx.globalAlpha = 1
  }

  raf = requestAnimationFrame(draw)
}

// ✅ watch correcto para Pinia setup store
watch(() => store.mode, () => makeParts())

onMounted(() => {
  ctx = canvas.value.getContext('2d')
  resize()
  makeParts()
  draw()
  ro = new ResizeObserver(() => { resize(); makeParts() })
  ro.observe(arena.value)

  // Pointer handling: use passive pointermove + rAF-throttle to avoid layout thrash
  const handlePointerMove = (e) => {
    if (paused.value) return
    // Si arenaRect no está inicializado (o parece inválido), recalcular
    if (!arenaRect || arenaRect.left === 0) {
      const r = arena.value.getBoundingClientRect()
      arenaRect.left = r.left
      arenaRect.top = r.top
      // update canvas size if needed
      if (W !== r.width || H !== r.height) {
        resize()
        makeParts()
      }
    }

    rawMouse.x = e.clientX - arenaRect.left
    rawMouse.y = e.clientY - arenaRect.top
    pendingMouse = true
  }

  const handlePointerLeave = () => {
    rawMouse.x = -999
    rawMouse.y = -999
    pendingMouse = true
  }

  const handlePointerEnter = (e) => {
    // Force rect refresh on enter to avoid mis-positioned dot
    const r = arena.value.getBoundingClientRect()
    arenaRect.left = r.left
    arenaRect.top = r.top
    rawMouse.x = e.clientX - arenaRect.left
    rawMouse.y = e.clientY - arenaRect.top
    pendingMouse = true
  }

  arena.value.addEventListener('pointermove', handlePointerMove, { passive: true })
  arena.value.addEventListener('pointerleave', handlePointerLeave, { passive: true })
  arena.value.addEventListener('pointerenter', handlePointerEnter, { passive: true })

  // Pause canvas when page is hidden (Visibility API) — reduces CPU ~90% when tab hidden
  const handleVisibilityChange = () => {
    paused.value = document.hidden
  }
  document.addEventListener('visibilitychange', handleVisibilityChange)

  // store handlers for cleanup
  arena.value._ag_handlers = { handlePointerMove, handlePointerLeave, handlePointerEnter }
  document._ag_visibilityHandler = handleVisibilityChange
})

onUnmounted(() => {
  cancelAnimationFrame(raf)
  if (ro) ro.disconnect()

  // Clean up visibility listener
  if (document._ag_visibilityHandler) {
    document.removeEventListener('visibilitychange', document._ag_visibilityHandler)
    delete document._ag_visibilityHandler
  }

  if (arena.value && arena.value._ag_handlers) {
    arena.value.removeEventListener('pointermove', arena.value._ag_handlers.handlePointerMove)
    arena.value.removeEventListener('pointerleave', arena.value._ag_handlers.handlePointerLeave)
    arena.value.removeEventListener('pointerenter', arena.value._ag_handlers.handlePointerEnter)
    delete arena.value._ag_handlers
  }
})
</script>

<style scoped>
.canvas-wrap {
  position: relative;
  width: 100%;
  min-height: 100vh;
  cursor: none;
  overflow: hidden;
}
.canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.cursor-dot {
  position: absolute;
  width: 12px; height: 12px;
  border-radius: 50%;
  pointer-events: none;
  transform: translate(-50%, -50%);
  transition: background 0.3s;
  z-index: 10;
}
.slot-content {
  position: relative;
  z-index: 5;
  width: 100%;
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>