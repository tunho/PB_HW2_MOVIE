
<template>
  <router-view v-slot="{ Component }">
    <component :is="Component" />
  </router-view>
  <MovieDetailModal />
  
  <button class="font-fab" @click="cycleFontSize" title="Adjust Font Size" style="display: flex !important; visibility: visible !important; opacity: 1 !important;">
    <i class="fas fa-font"></i>
    <span style="margin-left: 5px; font-weight: bold; font-size: 0.9rem;">Text Size</span>
  </button>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import MovieDetailModal from './components/MovieDetailModal.vue'
import { ref, onMounted } from 'vue';

const fontSizes = ['16px', '18px', '20px'];
const currentFontIndex = ref(0);

const cycleFontSize = () => {
  currentFontIndex.value = (currentFontIndex.value + 1) % fontSizes.length;
  const newSize = fontSizes[currentFontIndex.value] || '16px';
  document.documentElement.style.fontSize = newSize;
  localStorage.setItem('user_font_size', newSize);
};

onMounted(() => {
  const savedSize = localStorage.getItem('user_font_size');
  if (savedSize) {
    const index = fontSizes.indexOf(savedSize);
    if (index !== -1) {
      currentFontIndex.value = index;
      document.documentElement.style.fontSize = savedSize;
    }
  }
});
</script>

<style>
.zoom-fade-enter-active,
.zoom-fade-leave-active {
  transition: all 0.3s ease;
}

.zoom-fade-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

.zoom-fade-leave-to {
  opacity: 0;
  transform: scale(1.05);
}

.font-fab {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: auto;
  padding: 0 12px;
  height: 40px;
  border-radius: 20px;
  background-color: var(--primary-color) !important;
  border: 2px solid white;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  cursor: pointer;
  z-index: 9999;
  box-shadow: 0 4px 10px rgba(0,0,0,0.5);
  transition: transform 0.2s, background-color 0.2s;
}

.font-fab:hover {
  transform: scale(1.1);
  background-color: #555;
}

.font-fab:active {
  transform: scale(0.95);
}

/* Adjust position if on Popular page to avoid overlap with scroll-top */
/* We can't easily detect page here in CSS, so let's move it to the left or higher */
.font-fab {
  right: 80px; /* Move left to avoid scroll-top button collision */
}
</style>
