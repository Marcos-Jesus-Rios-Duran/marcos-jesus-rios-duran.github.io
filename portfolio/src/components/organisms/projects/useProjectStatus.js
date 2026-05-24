// src/components/organisms/projects/useProjectStatus.js
//
// SINGLE SOURCE OF TRUTH para status.
// El JSON mezcla keys técnicas y etiquetas localizadas, así que aquí normalizamos ambos.

/** Keys técnicas válidas → clase CSS */
export const STATUS_CLASSES = new Set([
  'development',
  'completed',
  'featured',
  'opensource',
  'confidential',
  'refactoring',
])

const normalizeStatus = (status) => {
  if (!status) return ''
  return status
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
}

/**
 * Devuelve la key CSS para el badge.
 * Soporta tanto keys técnicas como etiquetas traducidas.
 */
export const getStatusKey = (status) => {
  const normalized = normalizeStatus(status)
  if (!normalized) return 'default'
  if (STATUS_CLASSES.has(normalized)) return normalized

  if (normalized.includes('open source')) return 'opensource'
  if (normalized.includes('featured') || normalized.includes('destac') || normalized.includes('en vedette') || normalized.includes('empfohlen') || normalized.includes('in evidenza')) return 'featured'
  if (normalized.includes('confid')) return 'confidential'
  if (normalized.includes('refactor')) return 'refactoring'
  if (normalized.includes('develop') || normalized.includes('desarrollo') || normalized.includes('entwicklung') || normalized.includes('svilupp')) return 'development'
  if (normalized.includes('completed') || normalized.includes('finaliz') || normalized.includes('academ') || normalized.includes('abgeschlossen') || normalized.includes('complete') || normalized.includes('compl')) return 'completed'

  return 'default'
}