<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  timeline: {
    type: Array,
    required: true
  }
});
</script>

<template>
  <div class="timeline-container">
    <div
      class="timeline-item"
      v-for="(item, index) in timeline"
      :key="index"
      :style="{ animationDelay: `${index * 0.2}s` }"
    >
      <div class="timeline-dot"></div>
      <div class="timeline-content">
        <span class="timeline-date">{{ item.date }}</span>
        <p class="timeline-event">{{ item.event }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.timeline-container {
  position: relative;
  padding-left: 20px;
  /* La línea vertical que conecta los puntos */
  border-left: 2px solid var(--borde);
}

.timeline-item {
  position: relative;
  margin-bottom: 2rem;

  /* Estado inicial para la animación */
  opacity: 0;
  transform: translateY(30px);
  /* La animación de entrada: el forwards asegura que se quede visible al terminar */
  animation: slideUpFade 0.6s ease-out forwards;
}

/* El punto en la línea */
.timeline-dot {
  position: absolute;
  left: -27px; /* Centrado sobre el borde izquierdo */
  top: 4px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: var(--cursor);
  box-shadow: 0 0 10px rgba(var(--cursor-rgb, 255, 179, 204), 0.5);
}

.timeline-content {
  background: rgba(0, 0, 0, 0.3);
  padding: 1rem 1.5rem;
  border-radius: 8px;
  border: 1px solid var(--borde);
  transition: transform 0.3s ease, border-color 0.3s ease;
}

.timeline-content:hover {
  transform: translateX(10px); /* Pequeño efecto al pasar el mouse */
  border-color: var(--cursor);
}

.timeline-date {
  display: block;
  font-size: 0.85rem;
  color: var(--cursor);
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.timeline-event {
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0;
  color: var(--texto);
}

/* KEYFRAMES PARA LA ANIMACIÓN EN CASCADA */
@keyframes slideUpFade {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>