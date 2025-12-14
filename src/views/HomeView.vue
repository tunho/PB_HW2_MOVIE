<template>
  <div class="home">
    <AppHeader />
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
    
    <LoadingSpinner v-if="loading" />
    <div v-if="error" class="error-display">
      <p>{{ error }}</p>
      <button @click="retryFetch">Retry</button>
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
const error = ref('');

const fetchData = async () => {
  loading.value = true;
  error.value = '';
  try {
    const [popular, nowPlaying, topRated, action, comedy] = await Promise.all([
      fetchPopularMovies(),
      fetchNowPlayingMovies(),
      fetchTopRatedMovies(),
      fetchActionMovies(),
      fetchComedyMovies()
    ]);

    // Set random banner movie from popular
    if (popular.results.length > 0) {
      bannerMovie.value = popular.results[Math.floor(Math.random() * popular.results.length)];
    }

    rows.value = [
      { title: 'Popular on Netflix', movies: popular.results },
      { title: 'Now Playing', movies: nowPlaying.results },
      { title: 'Top Rated', movies: topRated.results },
      { title: 'Action Thrillers', movies: action.results },
      { title: 'Comedies', movies: comedy.results }
    ];
  } catch (e: any) {
    console.error('Failed to fetch movies:', e);
    error.value = 'Failed to load movies. Please check your API Key (Password) or network connection.';
    if (e.response && e.response.status === 401) {
       error.value = 'Invalid API Key. Please log out and try again with a valid TMDB API Key.';
    }
  } finally {
    loading.value = false;
  }
};

const retryFetch = () => {
  fetchData();
};

onMounted(() => {
  fetchData();
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

.error-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
  color: white;
  text-align: center;
}

.error-display button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
