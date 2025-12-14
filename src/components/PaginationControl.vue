<template>
  <div class="pagination">
    <button @click="$emit('prev')" :disabled="page === 1">Previous</button>
    <span>Page {{ page }}</span>
    <button @click="$emit('next')">Next</button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  page: number;
}>();

defineEmits<{
  (e: 'prev'): void;
  (e: 'next'): void;
}>();
</script>

<style scoped>
.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 20px;
  align-items: center;
}

button {
  padding: 8px 16px;
  background-color: #333;
  color: white;
  border: 1px solid #555;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #555;
}
</style>
