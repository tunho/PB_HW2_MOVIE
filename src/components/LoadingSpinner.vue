<template>
  <div class="spinner-container" :class="{ 'overlay': overlay }">
    <div class="spinner"></div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  overlay?: boolean;
}>();
</script>

<style scoped>
.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 20px 0;
}

.spinner-container.overlay {
  height: 100vh; /* Full viewport height */
  position: fixed; /* Overlay everything */
  top: 0;
  left: 0;
  z-index: 2000; /* Below FAB but above content */
  background-color: var(--background-color); /* Ensure background is opaque */
  padding: 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: var(--primary-color);
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
