<template>
  <div class="wishlist-page">
    <AppHeader />
    <div class="content">
      <h1>My List</h1>
      
      <div v-if="wishlistStore.wishlist.length === 0" class="empty-state">
        <p>You haven't added any movies to your list yet.</p>
        <router-link to="/" class="browse-btn">Browse Movies</router-link>
      </div>

      <div v-else class="movies-grid">
        <MovieCard 
          v-for="movie in wishlistStore.wishlist" 
          :key="movie.id" 
          :movie="movie" 
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '../components/AppHeader.vue';
import MovieCard from '../components/MovieCard.vue';
import { useWishlistStore } from '../stores/wishlist';

const wishlistStore = useWishlistStore();
</script>

<style scoped>
.wishlist-page {
  padding-top: 80px;
  min-height: 100vh;
  background-color: var(--background-color);
}

.content {
  padding: 20px 4%;
}

h1 {
  margin-bottom: 30px;
}

.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 20px;
  justify-items: center;
}

.empty-state {
  text-align: center;
  margin-top: 100px;
  color: #777;
}

.empty-state p {
  font-size: 1.5rem;
  margin-bottom: 20px;
}

.browse-btn {
  display: inline-block;
  background-color: white;
  color: black;
  padding: 10px 20px;
  font-weight: bold;
  border-radius: 4px;
}

.browse-btn:hover {
  background-color: rgba(255, 255, 255, 0.75);
}
</style>
