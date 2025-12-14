import axios from 'axios';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

const tmdb = axios.create({
    baseURL: BASE_URL,
    params: {
        language: 'ko-KR',
    },
});

// Add a request interceptor to inject the API key dynamically
tmdb.interceptors.request.use((config) => {
    const storedKey = localStorage.getItem('TMDb-Key') || sessionStorage.getItem('TMDb-Key');
    const apiKey = storedKey || TMDB_API_KEY;

    if (apiKey) {
        config.params = { ...config.params, api_key: apiKey };
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const fetchPopularMovies = async (page = 1) => {
    const response = await tmdb.get('/movie/popular', { params: { page } });
    response.data.results = response.data.results.filter((m: any) => m.poster_path);
    return response.data;
};

export const fetchNowPlayingMovies = async (page = 1) => {
    const response = await tmdb.get('/movie/now_playing', { params: { page } });
    response.data.results = response.data.results.filter((m: any) => m.poster_path);
    return response.data;
};

export const fetchTopRatedMovies = async (page = 1) => {
    const response = await tmdb.get('/movie/top_rated', { params: { page } });
    response.data.results = response.data.results.filter((m: any) => m.poster_path);
    return response.data;
};

export const fetchActionMovies = async (page = 1) => {
    const response = await tmdb.get('/discover/movie', { params: { with_genres: 28, page } });
    response.data.results = response.data.results.filter((m: any) => m.poster_path);
    return response.data;
};

export const fetchComedyMovies = async (page = 1) => {
    const response = await tmdb.get('/discover/movie', { params: { with_genres: 35, page } });
    response.data.results = response.data.results.filter((m: any) => m.poster_path);
    return response.data;
};

export const searchMovies = async (query: string, page = 1) => {
    const response = await tmdb.get('/search/movie', { params: { query, page } });
    response.data.results = response.data.results.filter((m: any) => m.poster_path);
    return response.data;
};

export const fetchMovieDetail = async (id: number) => {
    const response = await tmdb.get(`/movie/${id}`);
    return response.data;
};

export const getImageUrl = (path: string, size = 'w500') => {
    if (!path) return 'https://placehold.co/500x750/000000/FFFFFF/png?text=No+Image';
    return `https://image.tmdb.org/t/p/${size}${path}`;
};

export default tmdb;
