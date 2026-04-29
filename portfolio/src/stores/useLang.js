// src/stores/useLang.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLang = defineStore('lang', () => {

  const supported = [
    { code: 'es', label: 'Español',  flag: '🇲🇽' },
    { code: 'en', label: 'English',  flag: '🇺🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'de', label: 'Deutsch',  flag: '🇩🇪' },
    { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  ]

  const codes = supported.map(l => l.code)

  // Detecta idioma del navegador automáticamente
  const browserLang = navigator.language.split('-')[0]
  const detected = codes.includes(browserLang) ? browserLang : 'es'
  const saved = localStorage.getItem('lang') || detected

  const lang = ref(saved)

  function setLang(l) {
    if (!codes.includes(l)) return
    lang.value = l
    localStorage.setItem('lang', l)
    document.documentElement.setAttribute('lang', l)
  }

  // Aplica al iniciar
  document.documentElement.setAttribute('lang', lang.value)

  return { lang, setLang, supported, codes }
})