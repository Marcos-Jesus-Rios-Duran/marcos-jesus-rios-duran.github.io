<!-- src/components/molecules/LangSwitch.vue -->
<template>
  <div class="lang-switch" ref="wrapper">

    <!-- Botón que muestra idioma actual -->
    <button class="lang-btn" @click="open = !open">
      <span class="lang-flag">{{ current.flag }}</span>
      <span class="lang-code">{{ current.code.toUpperCase() }}</span>
      <span class="material-icons-round lang-arrow" :class="{ rotated: open }">
        expand_more
      </span>
    </button>

    <!-- Dropdown -->
    <Transition name="dropdown">
      <div v-if="open" class="lang-dropdown">
        <button
          v-for="l in store.supported"
          :key="l.code"
          class="lang-option"
          :class="{ active: l.code === store.lang }"
          @click="select(l.code)"
        >
          <span>{{ l.flag }}</span>
          <span>{{ l.label }}</span>
          <span v-if="l.code === store.lang" class="material-icons-round check">
            check
          </span>
        </button>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLang } from '@/stores/useLang'

const store = useLang()
const { locale } = useI18n()
const open = ref(false)
const wrapper = ref(null)

const current = computed(() =>
  store.supported.find(l => l.code === store.lang) || store.supported[0]
)

function select(code) {
  store.setLang(code)
  locale.value = code   // ← sincroniza vue-i18n
  open.value = false
}

// Cierra al hacer click fuera
function onClickOutside(e) {
  if (wrapper.value && !wrapper.value.contains(e.target)) {
    open.value = false
  }
}

onMounted(() => document.addEventListener('click', onClickOutside))
onUnmounted(() => document.removeEventListener('click', onClickOutside))
</script>

<style scoped>
.lang-switch {
  position: relative;
}

/* Botón principal */
.lang-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(75, 150, 224, 0.40);
  border: 1.5px solid rgba(255, 255, 255, 0.40);
  border-radius: 50px;
  padding: 7px 12px;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.95);
  font-size: 13px;
  font-weight: 600;
  backdrop-filter: blur(12px);
  transition: all 0.25s;
  text-shadow: 0 1px 2px rgba(0, 20, 40, 0.30);
}

.lang-btn:hover {
  background: rgba(75, 150, 224, 0.55);
  border-color: rgba(255, 255, 255, 0.50);
}

[data-theme="dark"] .lang-btn {
  background: rgba(0, 229, 255, 0.08);
  border-color: rgba(0, 229, 255, 0.25);
  color: #00e5ff;
  text-shadow: none;
}

[data-theme="dark"] .lang-btn:hover {
  background: rgba(0, 229, 255, 0.12);
}

.lang-flag { font-size: 16px; }
.lang-code { letter-spacing: 0.05em; }

.lang-arrow {
  font-size: 18px !important;
  transition: transform 0.25s ease;
}
.lang-arrow.rotated { transform: rotate(180deg); }

/* Dropdown */
.lang-dropdown {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  min-width: 160px;
  background: rgba(75, 150, 224, 0.50);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.40);
  border-radius: 14px;
  overflow: hidden;
  z-index: 100;
  box-shadow: 0 8px 32px rgba(0, 60, 120, 0.20);
}

[data-theme="dark"] .lang-dropdown {
  background: rgba(10, 10, 15, 0.90);
  border-color: rgba(0, 229, 255, 0.20);
  box-shadow: 0 8px 32px rgba(0, 229, 255, 0.08);
}

.lang-option {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.90);
  font-size: 14px;
  font-weight: 500;
  transition: background 0.15s;
  text-align: left;
  text-shadow: 0 1px 2px rgba(0, 20, 40, 0.20);
}

.lang-option:hover {
  background: rgba(255, 255, 255, 0.15);
}

.lang-option.active {
  color: #ffffff;
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(0, 20, 40, 0.30);
}

[data-theme="dark"] .lang-option:hover {
  background: rgba(0, 229, 255, 0.08);
}

[data-theme="dark"] .lang-option.active {
  color: #00e5ff;
  text-shadow: none;
}

.check {
  margin-left: auto;
  font-size: 16px !important;
}

/* Animación dropdown */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.25s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.97);
}
</style>