<!-- src/components/molecules/NavBar.vue -->

<template>
  <nav class="navbar" :class="{ scrolled, dark: isDark }">
    <span class="logo">COXI<span>DEV</span></span>

    <ul class="nav-menu">
      <li v-for="r in routes" :key="r.name">
        <router-link
          :to="{ name: r.name }"
          :class="{ active: isActive(r.name) }"
        >
          {{ getRouteLabel(r.name) }}
        </router-link>
      </li>
    </ul>

    <div class="nav-actions">
      <LangSwitch />
      <ThemeToggle />
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useTheme } from '@/stores/useTheme'
import ThemeToggle from '@/components/molecules/ThemeToggle.vue'
import LangSwitch from '@/components/molecules/LangSwitch.vue'

const route = useRoute()
const router = useRouter()
const store = useTheme()
const { t } = useI18n()
const { mode } = storeToRefs(store)
const isDark = computed(() => mode.value === 'dark')
const scrolled = ref(false)

const routes = computed(() => router.getRoutes().filter(r => r.path !== '/:pathMatch(.*)*'))
const isActive = (routeName) => route.name === routeName
const getRouteLabel = (routeName) => t(`nav.${routeName}`)

const onScroll = () => { scrolled.value = window.scrollY > 50 }
onMounted(() => window.addEventListener('scroll', onScroll))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
.navbar {
  position: fixed; top: 0; left: 0; right: 0;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 32px;
  height: 70px;
  background: rgba(255,255,255,0.08);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255,255,255,0.18);
  transition: all 0.3s ease;
}

.navbar.scrolled {
  background: rgba(75, 150, 224, 0.75);
  box-shadow: 0 4px 24px rgba(0, 60, 120, 0.15);
  border-bottom-color: rgba(255,255,255,0.25);
}

.navbar.dark.scrolled {
  background: rgba(10, 10, 15, 0.92);
  box-shadow: 0 4px 24px rgba(0, 229, 255, 0.08);
  border-bottom-color: rgba(0,229,255,0.15);
}

.logo {
  font-size: 22px;
  font-weight: 800;
  color: white;
  letter-spacing: -0.5px;
  text-shadow: 0 1px 4px rgba(0,50,100,0.20);
  cursor: pointer;
}

.logo span { color: var(--rosaBase); }

/* Menu de navegación */
.nav-menu {
  display: flex;
  list-style: none;
  gap: 32px;
  margin: 0;
  padding: 0;
}

.nav-menu a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  position: relative;
  transition: color 0.3s ease;
  cursor: pointer;
}

.nav-menu a::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--rosaBase);
  transition: width 0.3s ease;
}

.nav-menu a:hover {
  color: var(--rosaBase);
}

.nav-menu a:hover::after {
  width: 100%;
}

.nav-menu a.active {
  color: var(--rosaBase);
}

.nav-menu a.active::after {
  width: 100%;
}

/* Zona derecha — toggle + lang */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}
</style>