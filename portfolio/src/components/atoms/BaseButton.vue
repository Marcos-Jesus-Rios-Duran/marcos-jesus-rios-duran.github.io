<!-- src/components/atoms/BaseButton.vue -->
<template>
  <button :class="['btn', `btn--${variant}`]" v-bind="$attrs">
    <slot />
  </button>
</template>

<script setup>
defineProps({
  variant: { type: String, default: 'primary' }
})
</script>

<style scoped>
.btn {
  padding: 12px 24px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.25s;
  border: none;
}
.btn--primary {
  background: var(--rosaVivo);
  color: #2a0a1a;
  border: 2px solid var(--borde);
  font-weight: 700;
}
.btn--primary:hover {
  background: var(--rosaBase);
  transform: translateY(-2px);
  color: #2a0a1a;
}

[data-theme="dark"] .btn--primary {
  color: var(--rosaTexto);
}
.btn--secondary {
  background: transparent;
  color: var(--texto);
  border: 1.5px solid var(--borde);
}
.btn--secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
  border-color: var(--rosaBase);
}

/* === RESPONSIVE === */
@media (max-width: 768px) {
  .btn {
    padding: 11px 20px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .btn {
    padding: 10px 18px;
    font-size: 13px;
  }
}
</style>