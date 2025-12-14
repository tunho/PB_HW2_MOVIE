<template>
  <Transition name="fade">
    <div v-if="modalStore.isOpen" class="modal-overlay" @click.self="modalStore.closeModal">
      <div class="modal-content" v-if="modalStore.selectedMovie">
        <button class="close-btn" @click="modalStore.closeModal">
          <i class="fas fa-times"></i>
        </button>
        
        <div class="modal-banner">
          <img :src="getImageUrl(modalStore.selectedMovie.backdrop_path || modalStore.selectedMovie.poster_path, 'original')" :alt="modalStore.selectedMovie.title" />
          <div class="modal-banner-fade"></div>
          <div class="modal-title">
            <h2>{{ modalStore.selectedMovie.title }}</h2>
          </div>
        </div>

        <div class="modal-info">
          <div class="modal-meta">
            <span class="match">98% Match</span>
            <span class="year">{{ modalStore.selectedMovie.release_date?.split('-')[0] }}</span>
            <span class="rating">★ {{ modalStore.selectedMovie.vote_average?.toFixed(1) }}</span>
          </div>
          
          <p class="overview">{{ modalStore.selectedMovie.overview }}</p>
          
          <div class="actions">
            <button class="play-btn">
              <i class="fas fa-play"></i> Play
            </button>
            <button class="wishlist-btn" @click="toggleWishlist" :class="{ active: isInWishlist }">
              <i class="fas" :class="isInWishlist ? 'fa-check' : 'fa-plus'"></i>
              {{ isInWishlist ? 'Remove from My List' : 'Add to My List' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useModalStore } from '../stores/modal';
import { useWishlistStore } from '../stores/wishlist';
import { getImageUrl } from '../services/tmdb';

const modalStore = useModalStore();
const wishlistStore = useWishlistStore();

const isInWishlist = computed(() => {
  if (!modalStore.selectedMovie) return false;
  return wishlistStore.isInWishlist(modalStore.selectedMovie.id);
});

const toggleWishlist = () => {
  if (modalStore.selectedMovie) {
    wishlistStore.toggleWishlist(modalStore.selectedMovie);
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  z-index: 2000;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
}

.modal-content {
  background-color: #181818;
  width: 90%;
  max-width: 800px;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 0 20px rgba(0,0,0,0.9);
  margin-top: 50px;
  margin-bottom: 50px;
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  z-index: 100;
  background: black;
  border: 2px solid white;
  border-radius: 4px;
  width: 40px;
  height: 40px;
  color: white;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0,0,0,0.5);
  transition: transform 0.2s ease, background-color 0.2s;
}

.close-btn:hover {
  background: #333;
  transform: scale(1.1);
}

.modal-banner {
  position: relative;
  height: 400px;
}

.modal-banner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
}

.modal-banner-fade {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100px;
  background: linear-gradient(to top, #181818, transparent);
}

.modal-title {
  position: absolute;
  bottom: 40px;
  left: 40px;
}

.modal-title h2 {
  font-size: 3rem;
  font-weight: 800;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}

.modal-info {
  padding: 20px 40px 40px;
}

.modal-meta {
  display: flex;
  gap: 15px;
  align-items: center;
  margin-bottom: 20px;
  font-size: 1.1rem;
}

.match {
  color: #46d369;
  font-weight: bold;
}

.overview {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 30px;
}

.actions {
  display: flex;
  gap: 15px;
}

.play-btn {
  background: white;
  color: black;
  padding: 10px 30px;
  font-weight: bold;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.play-btn:hover {
  background: rgba(255, 255, 255, 0.75);
}

.wishlist-btn {
  background: rgba(109, 109, 110, 0.7);
  color: white;
  padding: 10px 30px;
  font-weight: bold;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.wishlist-btn:hover {
  background: rgba(109, 109, 110, 0.4);
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    margin: 20px 0;
    max-height: 90vh;
    overflow-y: auto;
  }

  .modal-banner {
    height: 250px;
  }

  .modal-title h2 {
    font-size: 1.8rem;
    bottom: 20px;
    left: 20px;
  }

  .modal-info {
    padding: 20px;
  }

  .modal-meta {
    flex-wrap: wrap;
    font-size: 0.9rem;
    gap: 10px;
  }

  .actions {
    flex-direction: column;
    gap: 10px;
  }

  .play-btn, .wishlist-btn {
    width: 100%;
    justify-content: center;
    font-size: 1rem;
    padding: 10px 0;
  }
  
  .close-btn {
    width: 32px;
    height: 32px;
    font-size: 1.2rem;
    top: 10px;
    right: 10px;
  }
}
</style>
