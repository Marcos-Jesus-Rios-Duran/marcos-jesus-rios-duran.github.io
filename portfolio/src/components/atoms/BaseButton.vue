<!-- src/components/atoms/BaseButton.vue -->
<template>
  <button :class="['btn', `btn--${variant}`]" v-bind="$attrs">
    <slot />
  </button>
</template>

<script setup>
defineProps({
  variant: { type: String, default: 'primary' }
  // 'primary' = rosita · 'secondary' = borde · 'ghost' = transparente
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
  background: var(--rosaVivo);       /* ← token, no hardcode */
  color: var(--rosaTexto);
  border: 2px solid var(--borde);
}
.btn--primary:hover {
  background: var(--rosaBase);
  transform: translateY(-2px);
}
.btn--secondary {
  background: transparent;
  color: var(--texto);
  border: 1.5px solid var(--borde);
}
</style>