<template>
  <div class="popular-page">
    <AppHeader />
    <div class="content">
      <h1>Popular Movies</h1>
      
      <div class="view-controls">
        <button @click="viewMode = 'grid'" :class="{ active: viewMode === 'grid' }">
          <i class="fas fa-th"></i> Grid
        </button>
        <button @click="viewMode = 'table'" :class="{ active: viewMode === 'table' }">
          <i class="fas fa-list"></i> Table
        </button>
      </div>

      <div v-if="viewMode === 'grid'" class="grid-view">
        <div class="movies-grid">
          <MovieCard 
            v-for="movie in movies" 
            :key="movie.id" 
            :movie="movie" 
          />
        </div>
        <div ref="sentinel" class="sentinel">
          <LoadingSpinner v-if="loading" />
        </div>
      </div>

      <div v-else class="table-view">
        <table>
          <thead>
            <tr>
              <th>Poster</th>
              <th>Title</th>
              <th>Release Date</th>
              <th>Rating</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="movie in movies.slice(0, 10)" :key="movie.id">
              <td>
                <img :src="getImageUrl(movie.poster_path, 'w92')" alt="poster" class="table-poster" />
              </td>
              <td>{{ movie.title }}</td>
              <td>{{ movie.release_date }}</td>
              <td>★ {{ movie.vote_average }}</td>
              <td>
                <button @click="toggleWishlist(movie)" class="wishlist-btn">
                  <i class="fas" :class="wishlistStore.isInWishlist(movie.id) ? 'fa-check' : 'fa-plus'"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <PaginationControl 
          :page="page" 
          @prev="prevPage" 
          @next="nextPage" 
        />
      </div>

      <button v-show="showScrollTop" @click="scrollToTop" class="scroll-top">
        <i class="fas fa-arrow-up"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import AppHeader from '../components/AppHeader.vue';
import MovieCard from '../components/MovieCard.vue';
import LoadingSpinner from '../components/LoadingSpinner.vue';
import PaginationControl from '../components/PaginationControl.vue';
import { fetchPopularMovies, getImageUrl } from '../services/tmdb';
import { useWishlistStore, type Movie } from '../stores/wishlist';

import { useIntersectionObserver } from '../composables/useIntersectionObserver';

const wishlistStore = useWishlistStore();
const movies = ref<Movie[]>([]);
const page = ref(1);
const loading = ref(false);
const viewMode = ref<'grid' | 'table'>('grid');
const sentinel = ref<HTMLElement | null>(null);
const showScrollTop = ref(false);

const loadMovies = async (reset = false) => {
  if (loading.value) return;
  loading.value = true;
  try {
    const data = await fetchPopularMovies(page.value);
    if (reset) {
      movies.value = data.results;
    } else {
      movies.value = [...movies.value, ...data.results];
    }
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const loadInitialMovies = async () => {
  await loadMovies(true); // Page 1
  page.value++;
  await loadMovies(); // Page 2
  page.value++;
  await loadMovies(); // Page 3
};

// Use Composable for Infinite Scroll
const { setupObserver } = useIntersectionObserver(sentinel, () => {
  if (viewMode.value === 'grid') {
    page.value++;
    loadMovies();
  }
});

// Table Pagination
const nextPage = () => {
  page.value++;
  loadMovies(true);
  window.scrollTo(0, 0);
};

const prevPage = () => {
  if (page.value > 1) {
    page.value--;
    loadMovies(true);
    window.scrollTo(0, 0);
  }
};

const toggleWishlist = (movie: Movie) => {
  wishlistStore.toggleWishlist(movie);
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const handleScroll = () => {
  showScrollTop.value = window.scrollY > 300;
};

watch(viewMode, (newMode) => {
  if (newMode === 'grid') {
    // Re-setup observer
    setTimeout(setupObserver, 100);
  } else {
    // Table mode uses pagination, maybe reset to page 1 for consistency
    page.value = 1;
    loadMovies(true);
  }
});

onMounted(() => {
  loadInitialMovies();
  // setupObserver is called automatically by composable onMounted, 
  // but we might need to re-call it if sentinel wasn't ready? 
  // The composable handles onMounted. 
  // However, loadInitialMovies is async, so sentinel might be pushed down.
  // The composable watches target? No, it takes a Ref.
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.popular-page {
  padding-top: 80px;
  min-height: 100vh;
  background-color: var(--background-color);
}

.content {
  padding: 20px 4%;
}

h1 {
  margin-bottom: 20px;
}

.view-controls {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}

.view-controls button {
  background: transparent;
  border: 1px solid white;
}

.view-controls button.active {
  background: var(--primary-color);
  border-color: var(--primary-color);
}

.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  justify-items: center;
}

@media (max-width: 768px) {
  .movies-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }
}

.sentinel {
  height: 50px;
  margin-top: 20px;
}

.table-view table {
  width: 100%;
  border-collapse: collapse;
  color: white;
}

.table-view th, .table-view td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #333;
}

.table-poster {
  width: 50px;
  border-radius: 4px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 20px;
  align-items: center;
}

.scroll-top {
  position: fixed;
  bottom: 20px;
  right: 20px;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
</style>
