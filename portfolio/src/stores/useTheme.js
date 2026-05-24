import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { themes } from '@/tokens/themes'

export const useTheme = defineStore('theme', () => {
  function getInitialMode() {
    const saved = localStorage.getItem('theme')
    if (saved === 'light' || saved === 'dark') return saved

    try {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark'
      }

      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        return 'light'
      }
    } catch {
      // If browser preference is unavailable, keep the dark default.
    }

    return 'dark'
  }

  const mode = ref(getInitialMode())
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