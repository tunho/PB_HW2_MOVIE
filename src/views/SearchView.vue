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
        <div class="movies-grid">
          <MovieCard 
            v-for="movie in filteredMovies" 
            :key="movie.id" 
            :movie="movie" 
          />
        </div>
        <div ref="sentinel" class="sentinel">
          <LoadingSpinner v-if="loading" />
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
import { searchMovies, fetchPopularMovies, discoverMovies } from '../services/tmdb';
import type { Movie } from '../stores/wishlist';

const searchQuery = ref('');
const movies = ref<Movie[]>([]);
const loading = ref(false);
const hasSearched = ref(false);
const searchHistory = ref<string[]>([]);

const selectedGenre = ref('');
const minRating = ref('0');
const sortBy = ref('popularity.desc'); // Default sort for API

// Load history on mount
const loadHistory = () => {
  const history = localStorage.getItem('search_history');
  if (history) {
    searchHistory.value = JSON.parse(history);
  }
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
  page.value = 1; // Reset page
  
  try {
    const data = await searchMovies(term);
    movies.value = data.results;
    totalPages.value = data.total_pages;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const loadDefaultMovies = async () => {
  loading.value = true;
  page.value = 1; // Reset page
  try {
    // Map sort values to API format
    let apiSort = 'popularity.desc';
    if (sortBy.value === 'vote_average') apiSort = 'vote_average.desc';
    if (sortBy.value === 'release_date') apiSort = 'primary_release_date.desc';
    if (sortBy.value === 'popularity') apiSort = 'popularity.desc';

    const params: any = {
      sort_by: apiSort,
      page: 1
    };

    if (selectedGenre.value) {
      params.with_genres = selectedGenre.value;
    }

    if (minRating.value !== '0') {
      params['vote_average.gte'] = minRating.value;
    }

    const data = await discoverMovies(params);
    movies.value = data.results;
    totalPages.value = data.total_pages;
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
    loadDefaultMovies(); // Reload default/filtered view
  }
}, 500));

// Watch filters to trigger server-side filtering when no search query
watch([selectedGenre, minRating, sortBy], () => {
  if (!searchQuery.value.trim()) {
    loadDefaultMovies();
  }
});

// Infinite Scroll Logic
const sentinel = ref<HTMLElement | null>(null);
const page = ref(1);
const totalPages = ref(1);

const loadMore = async () => {
  if (loading.value || page.value >= totalPages.value) return;
  
  loading.value = true;
  const nextPage = page.value + 1;
  
  try {
    let data;
    if (searchQuery.value.trim()) {
      // Search Mode
      data = await searchMovies(searchQuery.value, nextPage);
    } else {
      // Browse Mode
      // Map sort values to API format
      let apiSort = 'popularity.desc';
      if (sortBy.value === 'vote_average') apiSort = 'vote_average.desc';
      if (sortBy.value === 'release_date') apiSort = 'primary_release_date.desc';
      if (sortBy.value === 'popularity') apiSort = 'popularity.desc';

      const params: any = {
        sort_by: apiSort,
        page: nextPage
      };

      if (selectedGenre.value) {
        params.with_genres = selectedGenre.value;
      }

      if (minRating.value !== '0') {
        params['vote_average.gte'] = minRating.value;
      }
      
      data = await discoverMovies(params);
    }

    if (data.results.length > 0) {
      movies.value = [...movies.value, ...data.results];
      page.value = nextPage;
    }
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

import { useIntersectionObserver } from '../composables/useIntersectionObserver';

const { setupObserver } = useIntersectionObserver(sentinel, loadMore);

onMounted(() => {
  loadHistory();
  loadDefaultMovies();
  // setupObserver is called in composable's onMounted, but we might need to ensure sentinel is rendered
});

const filteredMovies = computed(() => {
  // If we are in "Browse Mode" (no search query), movies.value is already filtered by the API.
  // So we just return it.
  if (!searchQuery.value.trim()) {
    return movies.value;
  }

  // If we are in "Search Mode", we do client-side filtering on the search results.
  // Note: For infinite scroll to work properly with client-side filtering, 
  // we should ideally filter on the server. 
  // But for now, we'll keep the hybrid approach: Server fetches pages, Client filters them.
  // This might result in fewer items than expected if many are filtered out.
  // However, the user asked for "related movies" when filtering without search, which we solved with server-side discover.
  // When searching, we are still using client-side filtering for the specific results.
  
  let result = [...movies.value];

  // Filter by Genre (TMDB returns genre_ids)
  if (selectedGenre.value) {
    const genreId = parseInt(selectedGenre.value);
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
  // Watcher will trigger loadDefaultMovies if no search query
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

.sentinel {
  height: 50px;
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
