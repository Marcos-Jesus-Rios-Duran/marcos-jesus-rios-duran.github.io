<template>
  <button
    class="toggle"
    data-toggle-theme
    @click="store.toggle()"
    :title="isDark ? 'Modo claro' : 'Modo oscuro'"
  >
    <span class="material-icons-round">
      {{ isDark ? 'dark_mode' : 'light_mode' }}
    </span>
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useTheme } from '@/stores/useTheme'

const store = useTheme()
const { mode } = storeToRefs(store)
const isDark = computed(() => mode.value === 'dark')
</script>

<style scoped>
.toggle {
  width: 42px; height: 42px;
  border-radius: 50%;
  border: 1.5px solid rgba(255,255,255,0.35);
  background: rgba(255,255,255,0.12);
  backdrop-filter: blur(8px);
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.3s;
  color: white;
}
.toggle .material-icons-round {
  font-size: 22px;
  transition: transform 0.4s ease;
}
.toggle:hover {
  background: rgba(255,255,255,0.25);
}
.toggle:hover .material-icons-round {
  transform: rotate(20deg) scale(1.15);
}

/* Modo oscuro */
[data-theme="dark"] .toggle {
  border-color: rgba(0,229,255,0.30);
  background: rgba(0,229,255,0.08);
  color: #00e5ff;
}
[data-theme="dark"] .toggle:hover {
  background: rgba(0,229,255,0.15);
}
</style>