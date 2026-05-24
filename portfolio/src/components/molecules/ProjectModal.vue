<!-- src/components/molecules/ProjectModal.vue -->
<!--
  PERF: Modal siempre montado (no v-if), toggle con v-show → 0 mount cost en el click.
  Teleport siempre activo. Status colors legibles en dark/light. SVGs inline, sin emoji.
-->
<template>
  <teleport to="body">
    <div
      class="modal-overlay"
      :class="{ 'modal-overlay--visible': isOpen }"
      @click.self="closeModal"
      aria-modal="isOpen ? 'true':'undefined'"
      :inert="!isOpen || undefined"
    >
      <div class="modal-content" :class="{ 'modal-content--visible': isOpen }">
        <!-- Close -->
        <button class="modal-close" @click="closeModal" aria-label="Cerrar modal">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
          </svg>
        </button>

        <template v-if="project">
          <!-- Body -->
          <div class="modal-body">
            <!-- Header -->
            <div class="modal-header">
              <h2 class="modal-title">{{ project.name }}</h2>
              <span
                v-if="project.status"
                class="status-badge"
                :class="`status--${getStatusKey(project.status)}`"
              >{{ t(`projects.status_labels.${getStatusKey(project.status)}`) || project.status }}</span>
            </div>

            <!-- Description -->
            <p class="modal-description">{{ project.description }}</p>

            <!-- Technologies -->
            <div v-if="project.technologies?.length" class="section">
              <h3 class="section-title">Tecnologías</h3>
              <div class="tech-list">
                <span v-for="tech in project.technologies" :key="tech" class="tech-badge">{{ tech }}</span>
              </div>
            </div>

            <!-- Highlights / Features -->
            <div v-if="(project.highlights || project.features)?.length" class="section">
              <h3 class="section-title">Características Principales</h3>
              <ul class="item-list item-list--check">
                <li v-for="(h, i) in (project.highlights || project.features)" :key="i">{{ h }}</li>
              </ul>
            </div>

            <!-- Patterns -->
            <div v-if="project.patterns?.length" class="section">
              <h3 class="section-title">Patrones de Diseño</h3>
              <ul class="item-list item-list--arrow">
                <li v-for="p in project.patterns" :key="p">{{ p }}</li>
              </ul>
            </div>

            <!-- Confidentiality -->
            <div v-if="project.confidentiality" class="notice notice--lock">
              <svg class="notice-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" stroke-width="2"/>
                <path d="M8 11V7a4 4 0 018 0v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              <p>{{ project.confidentiality }}</p>
            </div>

            <!-- Mentorship -->
            <div v-if="project.mentorship" class="notice notice--group">
              <svg class="notice-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="9" cy="7" r="3" stroke="currentColor" stroke-width="2"/>
                <circle cx="17" cy="7" r="2.5" stroke="currentColor" stroke-width="2"/>
                <path d="M3 19c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="M17 13c2.209 0 4 1.79 4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              <p>{{ project.mentorship }}</p>
            </div>

            <!-- View mode -->
            <div v-if="project.view_mode" class="view-mode">
              <strong>Tipo:</strong> {{ project.view_mode }}
            </div>
          </div>

          <!-- Footer -->
          <div class="modal-footer">
            <a
              v-if="project.github"
              :href="project.github"
              target="_blank"
              rel="noopener noreferrer"
              class="action-btn action-btn--primary"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
              Ver en GitHub
            </a>
            <a
              v-if="project.url"
              :href="project.url"
              target="_blank"
              rel="noopener noreferrer"
              class="action-btn action-btn--primary"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Visitar Proyecto
            </a>
            <button class="action-btn action-btn--ghost" @click="closeModal">Cerrar</button>
          </div>
        </template>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { getStatusKey } from '@/components/organisms/projects/useProjectStatus'


const { t } = useI18n()

defineProps({
  project: { type: Object, default: () => ({}) },
  isOpen:  { type: Boolean, default: false },
})

const emit = defineEmits(['close'])
const closeModal = () => emit('close')
</script>

<style scoped>
/* === OVERLAY: siempre en DOM, visibilidad por clase === */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  /* Oculto por defecto — sin v-if, sin costo de mount */
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.18s ease;
  will-change: opacity;
}

.modal-overlay--visible {
  opacity: 1;
  pointer-events: auto;
}

/* === MODAL CONTENT === */
.modal-content {
  background: var(--modal-bg, rgba(18, 18, 28, 0.97));
  border: 1px solid var(--modal-border, rgba(255, 179, 204, 0.18));
  border-radius: 20px;
  width: 100%;
  max-width: 680px;
  max-height: 84vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.55);
  transform: translateY(14px) scale(0.985);
  transition: transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.18s ease;
  opacity: 0;
  will-change: transform, opacity;
}

.modal-content--visible {
  transform: translateY(0) scale(1);
  opacity: 1;
}

/* Light mode overrides */
[data-theme="light"] .modal-content {
  --modal-bg: rgba(255, 255, 255, 0.98);
  --modal-border: rgba(255, 143, 171, 0.25);
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.18);
}

/* === CLOSE BTN === */
.modal-close {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.55);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, color 0.15s;
  z-index: 10;
  flex-shrink: 0;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.14);
  color: #fff;
}

[data-theme="light"] .modal-close {
  background: rgba(0, 0, 0, 0.05);
  color: rgba(0, 0, 0, 0.45);
}

[data-theme="light"] .modal-close:hover {
  background: rgba(0, 0, 0, 0.09);
  color: rgba(0, 0, 0, 0.8);
}

/* === BODY === */
.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 28px 28px 20px;
  overscroll-behavior: contain;
}

.modal-body::-webkit-scrollbar       { width: 6px; }
.modal-body::-webkit-scrollbar-track { background: transparent; }
.modal-body::-webkit-scrollbar-thumb { background: rgba(255,179,204,0.2); border-radius: 3px; }
.modal-body::-webkit-scrollbar-thumb:hover { background: rgba(255,179,204,0.38); }

[data-theme="light"] .modal-body::-webkit-scrollbar-thumb { background: rgba(176, 69, 110, 0.18); }

/* === HEADER === */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 14px;
  padding-right: 28px; /* espacio para X btn */
}

.modal-title {
  font-size: 1.65rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
  line-height: 1.25;
  flex: 1;
}

[data-theme="light"] .modal-title { color: #0f172a; }

/* === STATUS BADGES — alta visibilidad en ambos modos === */
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  white-space: nowrap;
  flex-shrink: 0;
  line-height: 1;
}

/* Colores sólidos para máxima legibilidad en dark y light */
.status--development  { background: rgba(234, 179, 8, 0.18);   color: #ffffff; border: 1.5px solid rgba(234,179,8,0.45); }
.status--completed    { background: rgba(34, 197, 94, 0.15);   color: #ffffff; border: 1.5px solid rgba(34,197,94,0.4); }
.status--opensource   { background: rgba(6, 182, 212, 0.15);   color: #ffffff; border: 1.5px solid rgba(6,182,212,0.4); }
.status--confidential { background: rgba(168, 85, 247, 0.15);  color: #ffffff; border: 1.5px solid rgba(168,85,247,0.4); }
.status--refactoring  { background: rgba(249, 115, 22, 0.15);  color: #ffffff; border: 1.5px solid rgba(249,115,22,0.4); }
.status--featured     { background: rgba(255, 143, 171, 0.18); color: #ffffff; border: 1.5px solid rgba(255,143,171,0.45); }
.status--default      { background: rgba(148, 163, 184, 0.12); color: #ffffff; border: 1.5px solid rgba(148,163,184,0.3); }

[data-theme="light"] .status--development,
[data-theme="light"] .status--completed,
[data-theme="light"] .status--opensource,
[data-theme="light"] .status--confidential,
[data-theme="light"] .status--refactoring,
[data-theme="light"] .status--featured,
[data-theme="light"] .status--default {
  color: #ffffff;
}

/* === DESCRIPTION === */
.modal-description {
  font-size: 0.97rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.75;
  margin: 0 0 22px;
}

[data-theme="light"] .modal-description { color: #374151; }

/* === SECTIONS === */
.section { margin-bottom: 22px; }

.section-title {
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 179, 204, 0.85);
  margin: 0 0 10px;
}

[data-theme="light"] .section-title { color: #b0456e; }

/* === TECH BADGES === */
.tech-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tech-badge {
  padding: 5px 11px;
  border-radius: 10px;
  font-size: 0.82rem;
  font-weight: 600;
  background: rgba(6, 182, 212, 0.1);
  color: #67e8f9;
  border: 1px solid rgba(6, 182, 212, 0.25);
  transition: background 0.15s, border-color 0.15s;
}

.tech-badge:hover {
  background: rgba(6, 182, 212, 0.18);
  border-color: rgba(6, 182, 212, 0.4);
}

[data-theme="light"] .tech-badge {
  background: rgba(6, 182, 212, 0.08);
  color: #0891b2;
  border-color: rgba(6, 182, 212, 0.22);
}

/* === LISTS === */
.item-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.item-list li {
  font-size: 0.92rem;
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.55;
  padding-left: 22px;
  position: relative;
}

[data-theme="light"] .item-list li { color: #374151; }

.item-list--check li::before {
  content: '';
  position: absolute;
  left: 2px;
  top: 5px;
  width: 11px;
  height: 7px;
  border-left: 2px solid rgba(255, 120, 170, 0.75);
  border-bottom: 2px solid rgba(255, 120, 170, 0.75);
  transform: rotate(-45deg);
}

[data-theme="light"] .item-list--check li::before {
  border-color: #b0456e;
}

.item-list--arrow li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: #06b6d4;
  font-weight: 700;
  font-size: 0.85rem;
}

[data-theme="light"] .item-list--arrow li::before { color: #0891b2; }

/* === NOTICES === */
.notice {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  padding: 12px 14px;
  border-radius: 10px;
  margin-bottom: 14px;
}

.notice--lock {
  background: rgba(168, 85, 247, 0.08);
  border-left: 3px solid rgba(168, 85, 247, 0.5);
  color: #c084fc;
}

.notice--group {
  background: rgba(6, 182, 212, 0.07);
  border-left: 3px solid rgba(6, 182, 212, 0.45);
  color: #67e8f9;
}

[data-theme="light"] .notice--lock  { color: #6b21a8; }
[data-theme="light"] .notice--group { color: #0891b2; }

.notice-icon { flex-shrink: 0; margin-top: 2px; }

.notice p {
  font-size: 0.88rem;
  line-height: 1.55;
  margin: 0;
  color: rgba(255, 255, 255, 0.72);
}

[data-theme="light"] .notice p { color: #374151; }

/* === VIEW MODE === */
.view-mode {
  font-size: 0.87rem;
  color: rgba(255,255,255,0.55);
  padding: 10px 12px;
  background: rgba(255,179,204,0.05);
  border-radius: 8px;
}

[data-theme="light"] .view-mode { color: #6b7280; background: rgba(255,143,171,0.06); }

/* === FOOTER === */
.modal-footer {
  display: flex;
  gap: 10px;
  padding: 16px 28px;
  border-top: 1px solid rgba(255, 179, 204, 0.1);
  flex-wrap: wrap;
}

[data-theme="light"] .modal-footer { border-top-color: rgba(176,69,110,0.12); }

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  flex: 1;
  min-width: 110px;
  justify-content: center;
  padding: 11px 18px;
  border-radius: 50px;
  font-size: 0.88rem;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
  border: none;
  transition: background 0.15s, transform 0.15s, box-shadow 0.15s;
  font-family: inherit;
}

.action-btn--primary {
  background: rgba(255, 179, 204, 0.14);
  color: #fff;
  border: 1.5px solid rgba(255, 179, 204, 0.38);
}

.action-btn--primary:hover {
  background: rgba(255, 179, 204, 0.22);
  border-color: rgba(255, 179, 204, 0.58);
  transform: translateY(-1px);
}

[data-theme="light"] .action-btn--primary {
  background: rgba(176, 69, 110, 0.08);
  color: #7a1840;
  border-color: rgba(176,69,110,0.3);
}

[data-theme="light"] .action-btn--primary:hover {
  background: rgba(176, 69, 110, 0.14);
}

.action-btn--ghost {
  background: transparent;
  color: rgba(255,255,255,0.5);
  border: 1.5px solid rgba(255,255,255,0.15);
}

.action-btn--ghost:hover {
  background: rgba(255,255,255,0.05);
  color: rgba(255,255,255,0.85);
  border-color: rgba(255,255,255,0.3);
}

[data-theme="light"] .action-btn--ghost {
  color: #6b7280;
  border-color: rgba(0,0,0,0.14);
}

[data-theme="light"] .action-btn--ghost:hover {
  color: #374151;
  background: rgba(0,0,0,0.04);
}

/* === RESPONSIVE === */
@media (max-width: 640px) {
  .modal-content { border-radius: 16px; }
  .modal-body    { padding: 20px 18px 16px; }
  .modal-title   { font-size: 1.35rem; }

  .modal-footer {
    flex-direction: column;
    padding: 14px 18px;
  }

  .action-btn { min-width: 0; width: 100%; }
}
</style>