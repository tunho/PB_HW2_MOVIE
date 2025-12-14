<template>
  <Transition name="toast">
    <div v-if="visible" class="toast-notification" :class="type">
      <i class="fas" :class="iconClass"></i>
      <span>{{ message }}</span>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
}>();

const visible = ref(false);

const iconClass = computed(() => {
  switch (props.type) {
    case 'success': return 'fa-check-circle';
    case 'error': return 'fa-exclamation-circle';
    default: return 'fa-info-circle';
  }
});

const show = () => {
  visible.value = true;
  setTimeout(() => {
    visible.value = false;
  }, props.duration || 3000);
};

defineExpose({ show });
</script>

<style scoped>
.toast-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 25px;
  border-radius: 4px;
  color: white;
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 10000;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  font-weight: bold;
  min-width: 300px;
}

.toast-notification.success {
  background-color: #46d369; /* Netflix Green */
}

.toast-notification.error {
  background-color: #e50914; /* Netflix Red */
}

.toast-notification.info {
  background-color: #2196f3;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
