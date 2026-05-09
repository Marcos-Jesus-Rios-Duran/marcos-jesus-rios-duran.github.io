<!-- src/components/molecules/ProjectModal.vue -->
<template>
  <teleport to="body" v-if="isOpen">
    <div class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <!-- Close button -->
        <button class="modal-close" @click="closeModal" aria-label="Cerrar modal">
          <IconWrapper name="close" color="text" size="md" />
        </button>

        <!-- Modal body -->
        <div class="modal-body">
          <!-- Header -->
          <div class="modal-header">
            <h2>{{ project.name }}</h2>
            <span v-if="project.status" class="status-badge" :class="`status--${getStatusClass(project.status)}`">
              {{ project.status }}
            </span>
          </div>

          <!-- Description -->
          <p class="modal-description">{{ project.description }}</p>

          <!-- Technologies -->
          <div v-if="project.technologies" class="section">
            <h3 class="section-title">Tecnologías</h3>
            <div class="tech-list">
              <span v-for="tech in project.technologies" :key="tech" class="tech-badge">
                {{ tech }}
              </span>
            </div>
          </div>

          <!-- Highlights/Features -->
          <div v-if="project.highlights || project.features" class="section">
            <h3 class="section-title">Características Principales</h3>
            <ul class="highlight-list">
              <li v-for="(highlight, idx) in (project.highlights || project.features)" :key="idx">
                {{ highlight }}
              </li>
            </ul>
          </div>

          <!-- Patterns (si existen) -->
          <div v-if="project.patterns" class="section">
            <h3 class="section-title">Patrones de Diseño</h3>
            <ul class="pattern-list">
              <li v-for="pattern in project.patterns" :key="pattern">
                {{ pattern }}
              </li>
            </ul>
          </div>

          <!-- Confidentiality notice -->
          <div v-if="project.confidentiality" class="confidentiality-notice">
            <IconWrapper name="lock" color="warning" size="sm" class="notice-icon" />
            <p>{{ project.confidentiality }}</p>
          </div>

          <!-- Mentorship info -->
          <div v-if="project.mentorship" class="mentorship-info">
            <IconWrapper name="group" color="accent" size="sm" class="mentorship-icon" />
            <p>{{ project.mentorship }}</p>
          </div>

          <!-- View mode (para case studies) -->
          <div v-if="project.view_mode" class="view-mode">
            <strong>Tipo:</strong> {{ project.view_mode }}
          </div>
        </div>

        <!-- Modal footer (actions) -->
        <div class="modal-footer">
          <a
            v-if="project.github"
            :href="project.github"
            target="_blank"
            rel="noopener noreferrer"
            class="action-link"
          >
            Ver en GitHub →
          </a>
          <a
            v-if="project.url"
            :href="project.url"
            target="_blank"
            rel="noopener noreferrer"
            class="action-link"
          >
            Visitar Proyecto →
          </a>
          <button class="action-close" @click="closeModal">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { computed } from 'vue'
import IconWrapper from '@/components/atoms/IconWrapper.vue'

const props = defineProps({
  project: {
    type: Object,
    default: () => ({})
  },
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const closeModal = () => {
  emit('close')
}

const getStatusClass = (status) => {
  const statusMap = {
    'En desarrollo': 'development',
    'Finalizado / Académico': 'completed',
    'Open Source / En Desarrollo': 'opensource',
    'Confidencial': 'confidential',
    'En Desarrollo / Refactorización': 'refactoring',
    'Confidential': 'confidential'
  }
  return statusMap[status] || 'default'
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
  padding: 20px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  background: linear-gradient(
    135deg,
    rgba(20, 20, 30, 0.95) 0%,
    rgba(25, 20, 35, 0.95) 100%
  );
  border: 1px solid rgba(255, 179, 204, 0.15);
  border-radius: 24px;
  max-width: 700px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 24px;
  cursor: pointer;
  transition: color 0.2s;
  z-index: 10;
}

.modal-close:hover {
  color: rgba(255, 255, 255, 1);
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 32px;
  scroll-behavior: smooth;
}

/* === Header === */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
}

.modal-header h2 {
  font-size: 1.8rem;
  font-weight: 700;
  color: white;
  margin: 0;
  flex: 1;
}

.status-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
  white-space: nowrap;
  flex-shrink: 0;
}

.status--development {
  background: rgba(255, 193, 7, 0.2);
  color: #ffc107;
  border: 1px solid rgba(255, 193, 7, 0.3);
}

.status--completed {
  background: rgba(76, 175, 80, 0.2);
  color: #4caf50;
  border: 1px solid rgba(76, 175, 80, 0.3);
}

.status--opensource {
  background: rgba(0, 229, 255, 0.2);
  color: #00e5ff;
  border: 1px solid rgba(0, 229, 255, 0.3);
}

.status--confidential {
  background: rgba(156, 39, 176, 0.2);
  color: #ce93d8;
  border: 1px solid rgba(156, 39, 176, 0.3);
}

.status--refactoring {
  background: rgba(255, 152, 0, 0.2);
  color: #ff9800;
  border: 1px solid rgba(255, 152, 0, 0.3);
}

/* === Description === */
.modal-description {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.8;
  margin: 0 0 24px 0;
}

/* === Sections === */
.section {
  margin-bottom: 28px;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
  margin: 0 0 12px 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(255, 179, 204, 0.9);
}

/* === Technologies === */
.tech-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tech-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 14px;
  font-size: 0.85rem;
  font-weight: 500;
  background: rgba(0, 229, 255, 0.12);
  color: #00e5ff;
  border: 1px solid rgba(0, 229, 255, 0.25);
  transition: all 0.2s;
}

.tech-badge:hover {
  background: rgba(0, 229, 255, 0.18);
  border-color: rgba(0, 229, 255, 0.4);
}

/* === Lists === */
.highlight-list,
.pattern-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.highlight-list li,
.pattern-list li {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  padding-left: 24px;
  position: relative;
}

.highlight-list li::before {
  content: '✓';
  position: absolute;
  left: 4px;
  color: rgba(255, 120, 170, 0.7);
  font-weight: 700;
}

.pattern-list li::before {
  content: '→';
  position: absolute;
  left: 4px;
  color: rgba(0, 229, 255, 0.6);
  font-weight: 700;
}

/* === Notices === */
.confidentiality-notice,
.mentorship-info {
  background: rgba(156, 39, 176, 0.1);
  border-left: 3px solid rgba(156, 39, 176, 0.4);
  padding: 14px 16px;
  border-radius: 8px;
  display: flex;
  gap: 12px;
  align-items: flex-start;
  margin-bottom: 16px;
}

.notice-icon,
.mentorship-icon {
  font-size: 1.4rem;
  flex-shrink: 0;
}

.confidentiality-notice p,
.mentorship-info p {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.75);
  margin: 0;
  line-height: 1.5;
}

.view-mode {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  padding: 12px;
  background: rgba(255, 179, 204, 0.05);
  border-radius: 8px;
  margin-bottom: 16px;
}

/* === Modal Footer === */
.modal-footer {
  display: flex;
  gap: 12px;
  padding: 20px 32px;
  border-top: 1px solid rgba(255, 179, 204, 0.1);
  flex-wrap: wrap;
}

.action-link,
.action-close {
  flex: 1;
  min-width: 120px;
  padding: 12px 20px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.9rem;
  text-decoration: none;
  transition: all 0.25s;
  cursor: pointer;
  border: none;
}

.action-link {
  background: linear-gradient(135deg, rgba(255, 179, 204, 0.2), rgba(255, 143, 181, 0.15));
  color: white;
  border: 1.5px solid rgba(255, 179, 204, 0.4);
}

.action-link:hover {
  background: linear-gradient(135deg, rgba(255, 179, 204, 0.3), rgba(255, 143, 181, 0.25));
  border-color: rgba(255, 179, 204, 0.6);
}

.action-close {
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  border: 1.5px solid rgba(255, 255, 255, 0.3);
}

.action-close:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.5);
  color: white;
}

/* === Scrollbar === */
.modal-body::-webkit-scrollbar {
  width: 8px;
}

.modal-body::-webkit-scrollbar-track {
  background: rgba(255, 179, 204, 0.05);
}

.modal-body::-webkit-scrollbar-thumb {
  background: rgba(255, 179, 204, 0.25);
  border-radius: 4px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 179, 204, 0.4);
}

/* === Dark Mode === */
[data-theme="dark"] .modal-content {
  background: linear-gradient(
    135deg,
    rgba(15, 20, 25, 0.95) 0%,
    rgba(18, 22, 28, 0.95) 100%
  );
  border-color: rgba(0, 229, 255, 0.1);
}

[data-theme="dark"] .tech-badge {
  background: rgba(0, 229, 255, 0.08);
  border-color: rgba(0, 229, 255, 0.2);
}

[data-theme="dark"] .modal-footer {
  border-top-color: rgba(0, 229, 255, 0.1);
}

/* === Responsive === */
@media (max-width: 640px) {
  .modal-content {
    max-width: 95vw;
    border-radius: 16px;
  }

  .modal-body {
    padding: 20px;
  }

  .modal-header h2 {
    font-size: 1.4rem;
  }

  .modal-footer {
    flex-direction: column;
    padding: 16px 20px;
  }

  .action-link,
  .action-close {
    width: 100%;
  }
}
</style>
