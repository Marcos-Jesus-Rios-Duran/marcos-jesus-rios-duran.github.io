<!-- src/components/atoms/IconWrapper.vue -->
<template>
  <span
    class="icon-wrapper material-icons-round"
    :style="computedStyle"
    :class="[sizeClass, `color-${colorName}`]"
  >
    {{ name }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true,
    // Material Icon name (e.g., 'settings', 'mail', 'send', 'laptop')
  },
  color: {
    type: String,
    default: 'inherit',
    // Can be: 'inherit', 'primary', 'accent', 'light', 'dark', or any CSS color
  },
  size: {
    type: String,
    default: 'md',
    // 'xs' (16px), 'sm' (20px), 'md' (24px), 'lg' (32px), 'xl' (40px)
  },
})

// Color mapping to theme-aware CSS variables.
// The values come from useTheme() -> applyTokens(), so icons follow light/dark mode automatically.
const COLOR_MAP = {
  'primary': 'var(--rosaVivo)',
  'primary-light': 'var(--rosaBase)',
  'accent': 'var(--acento, var(--rosaVivo))',
  'accent-light': 'var(--acento, var(--rosaBase))',
  'success': '#16a34a',
  'warning': '#f59e0b',
  'error': '#dc2626',
  'light': '#ffffff',
  'dark': '#0a0a0f',
  'text': 'var(--texto)',
  'text-sub': 'var(--textoSub)',
  'inherit': 'inherit',
}

const SIZE_MAP = {
  'xs': '16px',
  'sm': '20px',
  'md': '24px',
  'lg': '32px',
  'xl': '40px',
}

const colorName = computed(() => {
  const c = props.color.toLowerCase()
  return COLOR_MAP[c] ? c : 'inherit'
})

const sizeClass = computed(() => `icon-size-${props.size}`)

const computedStyle = computed(() => {
  const colorVal = COLOR_MAP[colorName.value] || props.color
  return {
    color: colorVal,
    fontSize: SIZE_MAP[props.size],
    lineHeight: '1',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
})
</script>

<style scoped>
.icon-wrapper {
  font-weight: 400;
  letter-spacing: -0.01em;
  user-select: none;
  transition: color 0.25s ease, opacity 0.25s ease;
}

/* Size classes for convenience */
.icon-size-xs {
  width: 16px;
  height: 16px;
}

.icon-size-sm {
  width: 20px;
  height: 20px;
}

.icon-size-md {
  width: 24px;
  height: 24px;
}

.icon-size-lg {
  width: 32px;
  height: 32px;
}

.icon-size-xl {
  width: 40px;
  height: 40px;
}

/* Color utility classes (optional, for quick styling) */
.color-primary {
  color: #FF8FAB;
}

.color-accent {
  color: #00e5ff;
}

[data-theme="dark"] .color-primary {
  color: #FF8FAB;
}

[data-theme="dark"] .color-accent {
  color: #00e5ff;
}
</style>
