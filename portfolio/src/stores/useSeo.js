// src/stores/useSeo.js
import { defineStore } from 'pinia'

export const useSeo = defineStore('seo', () => {

  const pages = {
    home: {
      es: {
        title: 'Marcos Ríos | Desarrollador de Software · Huauchinango, Puebla',
        description: 'Portafolio de Marcos Jesús Ríos Durán — Desarrollador Web, certificado Azure AI-900, pianista y amante de la Sierra Norte de Puebla.',
        keywords: 'desarrollador web, Vue, Azure, INAOE, Puebla, México, portafolio'
      },
      en: {
        title: 'Marcos Ríos | Software Developer · Huauchinango, Puebla México',
        description: 'Portfolio of Marcos Jesús Ríos Durán — Web Developer, Azure AI-900 certified, pianist and Sierra Norte de Puebla lover.',
        keywords: 'web developer, Vue, Azure, INAOE, Puebla, Mexico, portfolio'
      }
    },
    projects: {
      es: {
        title: 'Proyectos | Marcos Ríos Dev',
        description: 'Proyectos de software desarrollados por Marcos Ríos — Web, Mobile, Cloud e IA.',
        keywords: 'proyectos, software, Vue, Azure, web'
      },
      en: {
        title: 'Projects | Marcos Ríos Dev',
        description: 'Software projects by Marcos Ríos — Web, Mobile, Cloud and AI.',
        keywords: 'projects, software, Vue, Azure, web'
      }
    }
  }

  function applyMeta(page, lang = 'es') {
    const meta = pages[page]?.[lang] || pages[page]?.['es']
    if (!meta) return

    // Title
    document.title = meta.title

    // Description
    setMeta('description', meta.description)
    setMeta('keywords', meta.keywords)

    // Open Graph (WhatsApp, LinkedIn, redes sociales)
    setMeta('og:title', meta.title, 'property')
    setMeta('og:description', meta.description, 'property')
    setMeta('og:type', 'website', 'property')
    setMeta('og:url', window.location.href, 'property')

    // Twitter Card
    setMeta('twitter:card', 'summary_large_image', 'name')
    setMeta('twitter:title', meta.title, 'name')
    setMeta('twitter:description', meta.description, 'name')
  }

  function setMeta(name, content, attr = 'name') {
    let el = document.querySelector(`meta[${attr}="${name}"]`)
    if (!el) {
      el = document.createElement('meta')
      el.setAttribute(attr, name)
      document.head.appendChild(el)
    }
    el.setAttribute('content', content)
  }

  return { applyMeta }
})