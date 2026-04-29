<template>
  <div ref="arena" class="canvas-wrap" @mousemove="onMove" @mouseleave="onLeave">
    <canvas ref="canvas" class="canvas" />
    <div class="cursor-dot" :style="dotStyle" />
    <div class="slot-content">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useTheme } from '@/stores/useTheme'

// ✅ NO desestructurar — acceder como store.mode
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

let ctx, W, H, raf
let mouse = { x: -999, y: -999 }
let parts = []

const REPEL = 110, FORCE = 22, RETURN = 0.055, DAMPING = 0.80

function resize() {
  const r = arena.value.getBoundingClientRect()
  W = canvas.value.width  = r.width
  H = canvas.value.height = r.height
}

function makeParts() {
  parts = []
  const cfg = PARTICLE_CONFIG[store.mode]  // ✅
  for (const layer of cfg.layers) {
    for (let i = 0; i < layer.count; i++) {
      const x = Math.random() * W
      const y = Math.random() * H
      parts.push({
        x, y, ox: x, oy: y, vx: 0, vy: 0,
        r: layer.rMin + Math.random() * (layer.rMax - layer.rMin),
        color: layer.colors[Math.floor(Math.random() * layer.colors.length)],
        drift: Math.random() * Math.PI * 2,
        driftSpeed: (Math.random() - 0.5) * 0.012,
        driftAmp:   0.1 + Math.random() * 0.2
      })
    }
  }
}

function drawBg() {
  const cfg = PARTICLE_CONFIG[store.mode]  // ✅
  const grd = ctx.createLinearGradient(0, 0, 0, H)
  grd.addColorStop(0, cfg.bgTop)
  grd.addColorStop(1, cfg.bgBottom)
  ctx.fillStyle = grd
  ctx.fillRect(0, 0, W, H)
}

function draw() {
  const cfg = PARTICLE_CONFIG[store.mode]  // ✅
  ctx.clearRect(0, 0, W, H)
  drawBg()

  if (mouse.x > 0) {
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
    const dist = Math.sqrt(dx * dx + dy * dy)

    if (dist < REPEL && dist > 0) {
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
    ctx.globalAlpha = 0.82 + Math.random() * 0.18
    ctx.fill()
    ctx.globalAlpha = 1
  }

  raf = requestAnimationFrame(draw)
}

function onMove(e) {
  const r = arena.value.getBoundingClientRect()
  mouse.x = e.clientX - r.left
  mouse.y = e.clientY - r.top
  const cfg = PARTICLE_CONFIG[store.mode]  // ✅
  dotStyle.value = {
    left:       mouse.x + 'px',
    top:        mouse.y + 'px',
    background: cfg.cursor,
    boxShadow:  `0 0 10px ${cfg.cursor}`
  }
}

function onLeave() {
  mouse.x = -999
  mouse.y = -999
  dotStyle.value = { left: '-99px', top: '-99px' }
}

// ✅ watch correcto para Pinia setup store
watch(() => store.mode, () => makeParts())

onMounted(() => {
  ctx = canvas.value.getContext('2d')
  resize()
  makeParts()
  draw()
  window.addEventListener('resize', () => { resize(); makeParts() })
})

onUnmounted(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('resize', () => {})
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
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>