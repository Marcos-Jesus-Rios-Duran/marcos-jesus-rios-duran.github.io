<script setup>
import { useI18n } from 'vue-i18n';
import LineTime from './LineTime.vue';

// Usamos el JSON que traducimos hace un momento
const { tm } = useI18n();
</script>

<template>
  <!-- Relative y z-index aseguran que esté encima del antigravity canvas -->
  <section class="about-wrapper">

    <div class="about-container">

      <!-- COLUMNA IZQUIERDA: Perfil y Hobbies -->
      <div class="about-left">
        <h2 class="title">{{ tm('about.title') }}</h2>
        <p class="description">{{ tm('about.description') }}</p>

        <div class="hobbies-grid">
          <div class="hobby-item">
            <strong>{{ tm('about.hobbies.music.label') }}:</strong>
            <span>{{ tm('about.hobbies.music.value') }}</span>
          </div>
          <div class="hobby-item">
            <strong>{{ tm('about.hobbies.sports.label') }}:</strong>
            <span>{{ tm('about.hobbies.sports.value') }}</span>
          </div>
          <div class="hobby-item">
            <strong>{{ tm('about.hobbies.videogames.label') }}:</strong>
            <span>{{ tm('about.hobbies.videogames.value') }}</span>
          </div>
          <!-- Agrega los demás según necesites -->
        </div>
      </div>

      <!-- COLUMNA DERECHA: Línea del Tiempo Animada -->
      <div class="about-right">
        <!-- Pasamos el array de la línea del tiempo al componente hijo -->
        <LineTime :timeline="tm('about.timeline')" />
      </div>

    </div>
  </section>
</template>

<style scoped>
.about-wrapper {
  position: relative;
  z-index: 10; /* Fundamental para que quede sobre el canvas */
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: white; /* Asumiendo tema oscuro */
}

.about-container {
  display: grid;
  grid-template-columns: 1fr; /* Para móviles */
  gap: 4rem;
  max-width: 1200px;
  width: 100%;
}

/* En pantallas grandes, emulamos la estructura de 2 columnas del Hero */
@media (min-width: 768px) {
  .about-container {
    grid-template-columns: 1fr 1fr;
  }
}

.title {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #4ade80; /* Tu color de acento */
}

.description {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.hobbies-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.05); /* Un fondo sutil cristalino */
  padding: 1.5rem;
  border-radius: 12px;
  backdrop-filter: blur(5px);
}
</style>