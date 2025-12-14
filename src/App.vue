<script setup lang="ts">
import { RouterView } from 'vue-router'
import MovieDetailModal from './components/MovieDetailModal.vue'
</script>

<template>
  <router-view v-slot="{ Component }">
    <!-- Global Page Transition -->
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
  <MovieDetailModal />
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
