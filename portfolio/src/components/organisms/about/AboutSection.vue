<script setup>
import { useI18n } from 'vue-i18n';
import LineTime from './LineTime.vue';
import IconWrapper from '@/components/atoms/IconWrapper.vue';

// Usamos el JSON que traducimos hace un momento
const { tm } = useI18n();

// Iconos para hobbies (Material Icon names)
const hobbyIcons = {
  music: 'music_note',
  sports: 'sports_soccer',
  videogames: 'sports_esports'
};
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
            <strong>{{ tm('about.hobbies.nature') }}</strong>
          <div class="hobby-item">
            <IconWrapper :name="hobbyIcons.music" color="accent" size="md" class="hobby-icon" />
            <strong>{{ tm('about.hobbies.music.label') }}:</strong>
            <span>{{ tm('about.hobbies.music.value') }}</span>
          </div>
          <div class="hobby-item">
            <IconWrapper :name="hobbyIcons.sports" color="accent" size="md" class="hobby-icon" />
            <strong>{{ tm('about.hobbies.sports.label') }}:</strong>
            <span>{{ tm('about.hobbies.sports.value') }}</span>
          </div>
          <div class="hobby-item">
            <IconWrapper :name="hobbyIcons.videogames" color="accent" size="md" class="hobby-icon" />
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

.about-left {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 0 1.5rem;
}

.title {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: var(--rosaBase);
}

[data-theme="dark"] .title {
  color: #00e5ff;
}

.description {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  opacity: 0.95;
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.3);
  color: var(--texto);
}

.hobbies-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.12);
  padding: 2rem;
  border-radius: 14px;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.hobbies-grid:hover {
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.hobby-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid transparent;
}

.hobby-item:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--cursor);
  transform: translateX(5px);
}

.hobby-icon {
  font-size: 1.5rem;
  min-width: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hobby-item strong {
  color: var(--cursor);
  font-weight: 600;
  min-width: 100px;
}

.hobby-item span:not(.hobby-icon) {
  color: var(--texto);
  opacity: 0.85;
}
</style>