<template>
  <div class="search-page">
    <AppHeader />
    <div class="content">
      <div class="search-bar">
        <input 
          v-model="searchQuery" 
          @keyup.enter="handleSearch()" 
          placeholder="Search for movies..." 
          type="text"
        />
        <button @click="handleSearch()">Search</button>
      </div>

      <div class="search-history" v-if="searchHistory.length > 0 && !hasSearched">
        <h3>Recent Searches</h3>
        <div class="history-list">
          <span 
            v-for="term in searchHistory" 
            :key="term" 
            class="history-item"
            @click="handleSearch(term)"
          >
            {{ term }}
          </span>
        </div>
        <button @click="clearHistory" class="clear-history">Clear History</button>
      </div>

      <div class="filters">
        <select v-model="selectedGenre">
          <option value="">All Genres</option>
          <option value="28">Action</option>
          <option value="35">Comedy</option>
          <option value="18">Drama</option>
          <option value="27">Horror</option>
          <option value="10749">Romance</option>
        </select>

        <select v-model="minRating">
          <option value="0">All Ratings</option>
          <option value="5">5+ Stars</option>
          <option value="7">7+ Stars</option>
          <option value="8">8+ Stars</option>
        </select>

        <div class="sort-group">
          <span class="sort-label"><i class="fas fa-sort"></i> Sort by:</span>
          <select v-model="sortBy" class="sort-select">
            <option value="popularity">Popularity</option>
            <option value="vote_average">Rating</option>
            <option value="release_date">Release Date</option>
          </select>
        </div>
        
        <button @click="resetFilters" class="reset-btn">Reset Filters</button>
      </div>

      <div class="results">
        <LoadingSpinner v-if="loading" />
        <div v-else-if="filteredMovies.length === 0 && hasSearched && searchQuery" class="no-results">
          No movies found matching your criteria.
        </div>
        <div v-else class="movies-grid">
          <MovieCard 
            v-for="movie in filteredMovies" 
            :key="movie.id" 
            :movie="movie" 
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import AppHeader from '../components/AppHeader.vue';
import MovieCard from '../components/MovieCard.vue';
import LoadingSpinner from '../components/LoadingSpinner.vue';
import { searchMovies, fetchPopularMovies } from '../services/tmdb';
import type { Movie } from '../stores/wishlist';

const searchQuery = ref('');
const movies = ref<Movie[]>([]);
const loading = ref(false);
const hasSearched = ref(false);
const searchHistory = ref<string[]>([]);

const selectedGenre = ref('');
const minRating = ref('0');
const sortBy = ref('popularity');

// Load history on mount
const loadHistory = () => {
  const history = localStorage.getItem('search_history');
  if (history) {
    searchHistory.value = JSON.parse(history);
  }
};

const loadDefaultMovies = async () => {
  loading.value = true;
  try {
    const data = await fetchPopularMovies();
    movies.value = data.results;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const saveHistory = (query: string) => {
  let history = [...searchHistory.value];
  // Remove if exists to move to top
  history = history.filter(item => item !== query);
  // Add to front
  history.unshift(query);
  // Limit to 5
  if (history.length > 5) history.pop();
  
  searchHistory.value = history;
  localStorage.setItem('search_history', JSON.stringify(history));
};

const clearHistory = () => {
  searchHistory.value = [];
  localStorage.removeItem('search_history');
};

const handleSearch = async (query?: string) => {
  const term = query || searchQuery.value;
  if (!term.trim()) return;
  
  // Update input if searched via history click
  if (query) searchQuery.value = query;

  saveHistory(term);
  
  loading.value = true;
  hasSearched.value = true;
  movies.value = []; // Clear previous results
  
  try {
    const data = await searchMovies(term);
    movies.value = data.results;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

// Debounce function
const debounce = (fn: Function, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

// Real-time search watcher
watch(searchQuery, debounce((newQuery: string) => {
  if (newQuery.trim()) {
    handleSearch(newQuery);
  } else {
    // Reset to initial state if query is empty
    hasSearched.value = false;
    movies.value = [];
    loading.value = false;
  }
}, 500));

onMounted(() => {
  loadHistory();
  loadDefaultMovies();
});

const filteredMovies = computed(() => {
  let result = [...movies.value];

  // Filter by Genre (TMDB returns genre_ids)
  if (selectedGenre.value) {
    const genreId = parseInt(selectedGenre.value);
    // Note: Movie interface needs genre_ids to filter properly. 
    // Let's assume we might not have it in the interface yet, but the object has it.
    // We'll cast to any or update interface. Updating interface is better but for now casting.
    result = result.filter((m: any) => m.genre_ids && m.genre_ids.includes(genreId));
  }

  // Filter by Rating
  if (minRating.value !== '0') {
    result = result.filter(m => (m.vote_average || 0) >= parseInt(minRating.value));
  }

  // Sort
  result.sort((a, b) => {
    if (sortBy.value === 'popularity') {
      return ((b as any).popularity || 0) - ((a as any).popularity || 0);
    } else if (sortBy.value === 'vote_average') {
      return (b.vote_average || 0) - (a.vote_average || 0);
    } else if (sortBy.value === 'release_date') {
      return new Date(b.release_date || '').getTime() - new Date(a.release_date || '').getTime();
    }
    return 0;
  });

  return result;
});

const resetFilters = () => {
  selectedGenre.value = '';
  minRating.value = '0';
  sortBy.value = 'popularity';
};
</script>

<style scoped>
.search-page {
  padding-top: 80px;
  min-height: 100vh;
  background-color: var(--background-color);
}

.content {
  padding: 20px 4%;
}

.search-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  justify-content: center;
}

.search-bar input {
  width: 100%;
  max-width: 500px;
  padding: 10px 15px;
  border-radius: 4px;
  border: none;
  background: #333;
  color: white;
  font-size: 1.2rem;
}

.search-bar button {
  padding: 10px 30px;
  font-size: 1.1rem;
}

.filters {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  justify-content: center;
  flex-wrap: wrap;
}

.filters select {
  padding: 8px 15px;
  border-radius: 4px;
  background: #333;
  color: white;
  border: 1px solid #555;
}

.reset-btn {
  background: transparent;
  border: 1px solid #555;
}

.sort-group {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 10px; /* Separate from filters */
  padding-left: 10px;
  border-left: 1px solid #555;
}

.sort-label {
  color: #aaa;
  font-size: 0.9rem;
}

.sort-select {
  border-color: var(--primary-color) !important;
  color: var(--primary-color) !important;
  font-weight: bold;
}

.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 20px;
  justify-items: center;
}

.no-results {
  text-align: center;
  font-size: 1.5rem;
  color: #777;
  margin-top: 50px;
}

.search-history {
  text-align: center;
  margin-bottom: 40px;
}

.search-history h3 {
  color: #777;
  font-size: 1rem;
  margin-bottom: 15px;
}

.history-list {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 15px;
}

.history-item {
  background: rgba(255, 255, 255, 0.1);
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  transition: background 0.2s;
}

.history-item:hover {
  background: rgba(255, 255, 255, 0.2);
}

.clear-history {
  background: transparent;
  border: none;
  color: #777;
  font-size: 0.8rem;
  text-decoration: underline;
  padding: 0;
}

.clear-history:hover {
  color: #999;
  background: transparent;
}
</style>
