// src/i18n/index.js
import { createI18n } from 'vue-i18n'
import es from './locales/es.json'
import en from './locales/en.json'
import fr from './locales/fr.json'
import de from './locales/de.json'
import it from './locales/it.json'

const supported = ['es', 'en', 'fr', 'de', 'it']
const browserLang = navigator.language.split('-')[0]
const detected = supported.includes(browserLang) ? browserLang : 'es'
const saved = localStorage.getItem('lang') || detected

export const i18n = createI18n({
  legacy: false,
  locale: saved,
  fallbackLocale: 'es',
  messages: { es, en, fr, de, it }
})