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
        
        <div v-else class="movies-container">
          <div class="table-view">
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
                <tr v-for="movie in filteredMovies.slice(0, 8)" :key="movie.id">
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
          </div>
          
          <!-- Pagination Controls -->
          <div class="pagination-controls" v-if="filteredMovies.length > 0">
            <button 
              @click="changePage(page - 1)" 
              :disabled="page === 1"
              class="page-btn"
            >
              Previous
            </button>
            <span class="page-info">Page {{ page }} of {{ totalPages }}</span>
            <button 
              @click="changePage(page + 1)" 
              :disabled="page >= totalPages"
              class="page-btn"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import AppHeader from '../components/AppHeader.vue';
import LoadingSpinner from '../components/LoadingSpinner.vue';
import { searchMovies, fetchPopularMovies, discoverMovies, getImageUrl } from '../services/tmdb';
import { useWishlistStore, type Movie } from '../stores/wishlist';

const wishlistStore = useWishlistStore();
const searchQuery = ref('');
const movies = ref<Movie[]>([]);
const loading = ref(false);
const hasSearched = ref(false);
const searchHistory = ref<string[]>([]);

const selectedGenre = ref('');
const minRating = ref('0');
const sortBy = ref('popularity');

// Pagination State
const page = ref(1);
const totalPages = ref(1);

// Load history on mount
const loadHistory = () => {
  const history = localStorage.getItem('search_history');
  if (history) {
    searchHistory.value = JSON.parse(history);
  }
};

const saveHistory = (query: string) => {
  let history = [...searchHistory.value];
  history = history.filter(item => item !== query);
  history.unshift(query);
  if (history.length > 5) history.pop();
  
  searchHistory.value = history;
  localStorage.setItem('search_history', JSON.stringify(history));
};

const clearHistory = () => {
  searchHistory.value = [];
  localStorage.removeItem('search_history');
};

const fetchMovies = async (pageNum: number) => {
  loading.value = true;
  movies.value = []; // Clear current view
  
  try {
    let data;
    const today = new Date().toISOString().split('T')[0];
    
    if (searchQuery.value.trim()) {
      // Search Mode
      data = await searchMovies(searchQuery.value, pageNum);
      // Client-side filter for search results (API doesn't support strict date filter on search endpoint)
      data.results = data.results.filter((m: any) => !m.release_date || m.release_date <= today);
    } else {
      // Browse Mode
      let apiSort = 'popularity.desc';
      if (sortBy.value === 'vote_average') apiSort = 'vote_average.desc';
      if (sortBy.value === 'release_date') apiSort = 'primary_release_date.desc';
      if (sortBy.value === 'popularity') apiSort = 'popularity.desc';

      const params: any = {
        sort_by: apiSort,
        page: pageNum,
        'primary_release_date.lte': today
      };

      if (selectedGenre.value) {
        params.with_genres = selectedGenre.value;
      }

      if (minRating.value !== '0') {
        params['vote_average.gte'] = minRating.value;
      }
      
      data = await discoverMovies(params);
    }

    movies.value = data.results;
    totalPages.value = Math.min(data.total_pages, 500); // TMDB limit
    page.value = pageNum;
    
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const toggleWishlist = (movie: Movie) => {
  wishlistStore.toggleWishlist(movie);
};

const handleSearch = async (query?: string) => {
  const term = query || searchQuery.value;
  if (!term.trim()) return;
  
  if (query) searchQuery.value = query;
  saveHistory(term);
  
  hasSearched.value = true;
  await fetchMovies(1);
};

const loadDefaultMovies = async () => {
  await fetchMovies(1);
};

const changePage = (newPage: number) => {
  if (newPage >= 1 && newPage <= totalPages.value) {
    fetchMovies(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    hasSearched.value = false;
    loadDefaultMovies();
  }
}, 500));

// Watch filters
watch([selectedGenre, minRating, sortBy], () => {
  // Reset to page 1 on filter change
  fetchMovies(1);
});

onMounted(() => {
  loadHistory();
  loadDefaultMovies();
});

const filteredMovies = computed(() => {
  // Client-side filtering for current page results (if needed)
  // Since we are doing server-side filtering for Browse Mode, this is mostly for Search Mode
  // where we might want to refine the 20 results returned.
  // However, for consistency with Pagination, it's better to rely on Server-side as much as possible.
  // But since searchMovies API doesn't support complex filtering (only query), 
  // we might still need client-side filtering for Search Mode.
  
  if (!searchQuery.value.trim()) {
    return movies.value; // Browse mode is already filtered by API
  }

  // Search Mode: Client-side filter on the current page of results
  let result = [...movies.value];

  if (selectedGenre.value) {
    const genreId = parseInt(selectedGenre.value);
    result = result.filter((m: any) => m.genre_ids && m.genre_ids.includes(genreId));
  }

  if (minRating.value !== '0') {
    result = result.filter(m => (m.vote_average || 0) >= parseInt(minRating.value));
  }

  // Sort is handled by API in Browse, but for Search we might need client sort
  // if API doesn't support sort param in search endpoint (it usually doesn't).
  // TMDB Search API sorts by relevance by default.
  if (sortBy.value !== 'popularity.desc') { // If user changed sort
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
  }

  return result;
});

const resetFilters = () => {
  selectedGenre.value = '';
  minRating.value = '0';
  sortBy.value = 'popularity.desc';
  // Watcher will trigger fetchMovies(1)
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
  margin-left: 10px;
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
  margin-bottom: 40px;
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

/* Pagination Styles */
.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 30px;
  padding-bottom: 50px;
}

.page-btn {
  background-color: #333;
  color: white;
  border: 1px solid #555;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-btn:hover:not(:disabled) {
  background-color: #555;
  border-color: var(--primary-color);
}

.page-info {
  color: #aaa;
  font-size: 1rem;
}

.table-view {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  overflow-x: auto;
}

.table-view table {
  width: 100%;
  border-collapse: collapse;
  color: white;
  margin-bottom: 20px;
}

.table-view th, .table-view td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #333;
  vertical-align: middle;
}

.table-poster {
  width: 50px;
  border-radius: 4px;
}

.wishlist-btn {
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1.2rem;
}

.wishlist-btn:hover {
  color: var(--primary-color);
}
</style>
