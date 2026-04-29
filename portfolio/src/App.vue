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
      <span class="footer-sub">Hecho con Vue 🌸 desdE Gilberto Camacho, Puebla</span>
    </footer>
  </div>
</template>

<script setup>
import { useTheme } from '@/stores/useTheme'
import NavBar from '@/components/molecules/NavBar.vue'
import AntigravityCanvas from '@/components/organisms/AntigravityCanvas.vue'

const { mode } = useTheme()
</script>

<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'Segoe UI', system-ui, sans-serif;
  color: var(--texto);
  overflow-x: hidden;
}

.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* El canvas ocupa todo menos el footer */
.canvas-base {
  flex: 1;
}

/* El contenido flota encima del canvas */
.main-content {
  width: 100%;
  min-height: 100vh;
  padding-top: 70px;
  /* sin background — el canvas es el fondo */
}
.footer {
  display: flex; flex-direction: column; align-items: center;
  gap: 6px; padding: 32px 20px;

  /* Modo claro → azul cielo igual que el navbar scrolled */
  background: rgba(75, 150, 224, 0.75);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-top: 1px solid rgba(255,255,255,0.25);

  /* Texto blanco como el navbar */
  color: rgba(255,255,255,0.90);
  font-size: 14px;
  transition: all 0.3s;
  position: relative;
  z-index: 10;
}

.footer-sub {
  font-size: 12px;
  opacity: 0.7;
}

/* Modo oscuro → negro profundo igual que el navbar dark scrolled */
[data-theme="dark"] .footer {
  background: rgba(10, 10, 15, 0.92);
  border-top-color: rgba(0,229,255,0.15);
  color: rgba(255,255,255,0.70);
}
</style>