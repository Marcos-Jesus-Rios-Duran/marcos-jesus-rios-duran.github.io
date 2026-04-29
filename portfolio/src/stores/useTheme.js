import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { themes } from '@/tokens/themes'

export const useTheme = defineStore('theme', () => {
  const mode = ref(localStorage.getItem('theme') || 'light')
  const tokens = computed(() => themes[mode.value])

  function applyTokens(t) {
    const root = document.documentElement
    Object.entries(t).forEach(([k, v]) => {
      if (typeof v === 'string') root.style.setProperty(`--${k}`, v)
    })
    root.setAttribute('data-theme', mode.value)
  }

  function toggle() {
    mode.value = mode.value === 'light' ? 'dark' : 'light'
    localStorage.setItem('theme', mode.value)
    applyTokens(tokens.value)
  }

  applyTokens(tokens.value)
  return { mode, tokens, toggle }
})