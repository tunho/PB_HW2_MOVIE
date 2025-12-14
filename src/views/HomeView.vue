<template>
  <div class="home">
    <AppHeader />
    <LoadingSpinner v-if="loading" />
    
    <div v-else>
      <MainBanner :movie="bannerMovie" />
      
      <div class="rows-container">
        <div class="row" v-for="(row, index) in rows" :key="index">
          <h2>{{ row.title }}</h2>
          <div class="row-posters">
            <MovieCard 
              v-for="movie in row.movies" 
              :key="movie.id" 
              :movie="movie" 
              class="row-poster"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AppHeader from '../components/AppHeader.vue';
import MainBanner from '../components/MainBanner.vue';
import MovieCard from '../components/MovieCard.vue';
import LoadingSpinner from '../components/LoadingSpinner.vue';
import { 
  fetchPopularMovies, 
  fetchNowPlayingMovies, 
  fetchTopRatedMovies, 
  fetchActionMovies, 
  fetchComedyMovies 
} from '../services/tmdb';
import type { Movie } from '../stores/wishlist';

interface MovieRow {
  title: string;
  movies: Movie[];
}

const bannerMovie = ref<Movie | null>(null);
const rows = ref<MovieRow[]>([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const [popular, nowPlaying, topRated, action, comedy] = await Promise.all([
      fetchPopularMovies(),
      fetchNowPlayingMovies(),
      fetchTopRatedMovies(),
      fetchActionMovies(),
      fetchComedyMovies()
    ]);

    // Set random banner movie from popular
    bannerMovie.value = popular.results[Math.floor(Math.random() * popular.results.length)];

    rows.value = [
      { title: 'Popular on Netflix', movies: popular.results },
      { title: 'Now Playing', movies: nowPlaying.results },
      { title: 'Top Rated', movies: topRated.results },
      { title: 'Action Thrillers', movies: action.results },
      { title: 'Comedies', movies: comedy.results }
    ];
  } catch (error) {
    console.error('Failed to fetch movies:', error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.home {
  background-color: var(--background-color);
  min-height: 100vh;
}

.rows-container {
  margin-top: -100px; /* Pull up over banner fade */
  position: relative;
  z-index: 10;
  padding-bottom: 50px;
}

.row {
  margin-left: 20px;
  margin-bottom: 20px;
}

.row h2 {
  color: white;
  margin-bottom: 10px;
  font-size: 1.5rem;
  font-weight: 600;
}

.row-posters {
  display: flex;
  overflow-y: hidden;
  overflow-x: scroll;
  padding: 20px;
  gap: 10px;
}

.row-posters::-webkit-scrollbar {
  display: none;
}

.row-poster {
  flex: 0 0 auto;
  width: 200px;
}

@media (max-width: 768px) {
  .row-poster {
    width: 140px;
  }
  
  .row h2 {
    font-size: 1.2rem;
  }
  
  .rows-container {
    margin-top: -50px;
  }
}
</style>
