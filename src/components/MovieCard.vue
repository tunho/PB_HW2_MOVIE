<template>
  <div class="movie-card" @mouseenter="isHovered = true" @mouseleave="isHovered = false" @click="openModal">
    <img :src="imageUrl" :alt="movie.title" loading="lazy" />
    <div class="info" v-if="isHovered">
      <h4>{{ movie.title }}</h4>
      <div class="meta">
        <span class="rating">★ {{ movie.vote_average?.toFixed(1) }}</span>
        <button class="wishlist-toggle" @click="toggleWishlist" :class="{ active: isInWishlist }">
          <i class="fas" :class="isInWishlist ? 'fa-check' : 'fa-plus'"></i>
        </button>
      </div>
    </div>
    <div class="wishlist-indicator" v-if="isInWishlist && !isHovered">
      <i class="fas fa-check"></i>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { getImageUrl } from '../services/tmdb';
import type { Movie } from '../stores/wishlist';
import { useModalStore } from '../stores/modal';
import { useWishlistStore } from '../stores/wishlist';

const props = defineProps<{
  movie: Movie;
}>();

const modalStore = useModalStore();
const wishlistStore = useWishlistStore();
const isHovered = ref(false);

const imageUrl = computed(() => getImageUrl(props.movie.poster_path));
const isInWishlist = computed(() => wishlistStore.isInWishlist(props.movie.id));

const openModal = () => {
  modalStore.openModal(props.movie);
};

const toggleWishlist = (e: Event) => {
  e.stopPropagation(); // Prevent opening modal
  wishlistStore.toggleWishlist(props.movie);
};
</script>

<style scoped>
.movie-card {
  position: relative;
  width: 100%;
  aspect-ratio: 2/3;
  border-radius: 4px;
  overflow: hidden;
  transition: transform 0.3s ease, z-index 0.3s;
  cursor: pointer;
  background-color: #2f2f2f;
}

.movie-card:hover {
  transform: scale(1.1);
  z-index: 10;
  box-shadow: 0 0 20px rgba(0,0,0,0.7);
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px;
  background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);
  display: flex;
  flex-direction: column;
  gap: 5px;
}

h4 {
  font-size: 0.9rem;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.meta {
  font-size: 0.8rem;
  color: #46d369;
  margin-top: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.wishlist-toggle {
  background: transparent;
  border: 1px solid white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.7rem;
  cursor: pointer;
}

.wishlist-toggle:hover {
  background: rgba(255, 255, 255, 0.2);
}

.wishlist-toggle.active {
  background: white;
  color: black;
  border-color: white;
}

.wishlist-indicator {
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(0, 0, 0, 0.6);
  color: #46d369;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  border: 1px solid #46d369;
}
</style>
