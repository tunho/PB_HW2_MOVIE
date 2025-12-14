import axios from 'axios';

const TMDB_API_KEY = 'eb89fc38dfc6118d58aecf5d55e658ad'; // Replace with actual key or env var
const BASE_URL = 'https://api.themoviedb.org/3';

const tmdb = axios.create({
    baseURL: BASE_URL,
    params: {
        api_key: TMDB_API_KEY,
        language: 'ko-KR',
    },
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

export const getImageUrl = (path: string, size = 'w500') => {
    if (!path) return 'https://placehold.co/500x750/000000/FFFFFF/png?text=No+Image';
    return `https://image.tmdb.org/t/p/${size}${path}`;
};

export default tmdb;
