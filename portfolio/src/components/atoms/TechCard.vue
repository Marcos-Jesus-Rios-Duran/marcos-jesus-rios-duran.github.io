<!-- src/components/atoms/TechCard.vue -->
<template>
  <div
    class="tech-card"
    :style="{
      animationDelay: `${delay}s`,
      animationDuration: `${duration}s`
    }"
  >
    <div class="tech-card__icon">
      <IconWrapper :name="icon" color="light" size="lg" />
    </div>
    <div class="tech-card__content">
      <h4 class="tech-card__title">{{ title }}</h4>
      <div class="tech-card__tags">
        <template v-for="tag in tags" :key="tag.label">
          <a
            v-if="tag.url"
            class="tag tag--link"
            :class="{ 'tag--certified': tag.certified }"
            :href="tag.url"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ tag.label }}
            <span v-if="tag.certified" class="tag__badge">✓</span>
          </a>
          <span
            v-else
            class="tag"
            :class="{ 'tag--certified': tag.certified }"
          >
            {{ tag.label }}
            <span v-if="tag.certified" class="tag__badge">✓</span>
          </span>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import IconWrapper from './IconWrapper.vue'

const props = defineProps({
  icon:     { type: String,  required: true },
  title:    { type: String,  required: true },
  tags:     { type: Array,   default: () => [] },
  // tags: [{ label: 'Vue', certified: false }, { label: 'Azure AI-900', certified: true }]
  delay:    { type: Number,  default: 0 },    // animación desfasada
  duration: { type: Number,  default: 4 },    // velocidad de flotación
})
</script>

<style scoped>
/* === CARD BASE === */
.tech-card {
  /* Rosa palo de rosa — modo claro, más transparente */
  background: linear-gradient(
    135deg,
    rgba(255, 179, 204, 0.85) 0%,
    rgba(255, 143, 181, 0.85) 50%,
    rgba(255, 176, 200, 0.85) 100%
  );
  border: 2px solid rgba(255, 255, 255, 0.95);
  border-radius: 18px;
  padding: 16px 18px;
  display: flex;
  align-items: center;
  gap: 13px;
  width: 230px;
  box-shadow:
    0 6px 24px rgba(255, 120, 170, 0.25),
    inset 0 2px 0 rgba(255, 255, 255, 0.80);

  /* Animación flotante */
  animation: float linear infinite;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: default;
}

/* Hover — se eleva más */
.tech-card:hover {
  transform: translateY(-6px) scale(1.03);
  box-shadow:
    0 16px 40px rgba(255, 100, 160, 0.35),
    inset 0 2px 0 rgba(255, 255, 255, 0.95);
  animation-play-state: paused; /* pausa al hover */
}

/* === MODO OSCURO === */
[data-theme="dark"] .tech-card {
  background: linear-gradient(
    135deg,
    rgba(0, 229, 255, 0.12) 0%,
    rgba(0, 188, 212, 0.10) 100%
  );
  border-color: rgba(0, 229, 255, 0.30);
  box-shadow:
    0 6px 24px rgba(0, 229, 255, 0.12),
    inset 0 1px 0 rgba(0, 229, 255, 0.20);
}

[data-theme="dark"] .tech-card:hover {
  box-shadow:
    0 16px 40px rgba(0, 229, 255, 0.20),
    inset 0 1px 0 rgba(0, 229, 255, 0.30);
}

/* === ICONO === */
.tech-card__icon {
  width: 44px; height: 44px;
  background: rgba(255, 255, 255, 0.75);
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
  border: 1.5px solid rgba(255, 255, 255, 0.90);
  line-height: 1;
}

[data-theme="dark"] .tech-card__icon {
  background: rgba(0, 229, 255, 0.10);
  border-color: rgba(0, 229, 255, 0.25);
}

/* === TÍTULO === */
.tech-card__title {
  margin: 0 0 8px;
  font-size: 14px;
  font-weight: 800;
  color: #2D0615;
  text-shadow: 0 1px 3px rgba(255,255,255,0.7);
  letter-spacing: -0.3px;
}

[data-theme="dark"] .tech-card__title {
  color: #ffffff;
  text-shadow: none;
}

/* === TAGS === */
.tech-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.tag {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.04em;
  padding: 3px 8px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.75);
  color: #3A0D20;
  border: 1px solid rgba(255, 255, 255, 0.85);
  display: flex;
  align-items: center;
  gap: 3px;
  text-shadow: 0 0.5px 1px rgba(255,255,255,0.6);
  line-height: 1.3;
}

.tag--link {
  text-decoration: none;
}

[data-theme="dark"] .tag {
  background: rgba(0, 229, 255, 0.08);
  color: rgba(0, 229, 255, 0.90);
  border-color: rgba(0, 229, 255, 0.20);
}

/* Tag con certificación */
.tag--certified {
  background: rgba(255, 255, 255, 0.80);
  color: #7A1840;
  border-color: rgba(255, 255, 255, 0.90);
  font-weight: 700;
}

[data-theme="dark"] .tag--certified {
  background: rgba(0, 229, 255, 0.18);
  color: #00e5ff;
  border-color: rgba(0, 229, 255, 0.40);
}

.tag__badge {
  color: #16a34a;
  font-weight: 800;
  font-size: 11px;
}

[data-theme="dark"] .tag__badge {
  color: #00e5ff;
}

/* === ANIMACIÓN FLOTANTE === */
@keyframes float {
  0%   { transform: translateY(0px);   }
  25%  { transform: translateY(-8px);  }
  50%  { transform: translateY(-4px);  }
  75%  { transform: translateY(-10px); }
  100% { transform: translateY(0px);   }
}

/* === RESPONSIVE === */
/* Tablet (768px a 1024px) */
@media (max-width: 1024px) {
  .tech-card {
    width: 210px;
    padding: 14px 16px;
    gap: 10px;
  }

  .tech-card__icon {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }

  .tech-card__title {
    font-size: 13px;
  }

  .tag {
    font-size: 9px;
    padding: 2px 6px;
  }
}

/* Móvil (hasta 768px) */
@media (max-width: 768px) {
  .tech-card {
    width: 100%;
    max-width: 280px;
    padding: 14px 16px;
    gap: 12px;
  }

  .tech-card__icon {
    width: 42px;
    height: 42px;
    font-size: 20px;
    flex-shrink: 0;
  }

  .tech-card__title {
    font-size: 13px;
    margin: 0 0 6px;
  }

  .tech-card__tags {
    gap: 4px;
  }

  .tag {
    font-size: 9px;
    padding: 2px 6px;
  }
}

/* Móvil pequeño (hasta 480px) */
@media (max-width: 480px) {
  .tech-card {
    width: 100%;
    padding: 12px 14px;
    gap: 10px;
    border-radius: 14px;
  }

  .tech-card__icon {
    width: 38px;
    height: 38px;
    font-size: 18px;
  }

  .tech-card__title {
    font-size: 12px;
  }

  .tag {
    font-size: 8px;
    padding: 2px 5px;
  }
}
</style>