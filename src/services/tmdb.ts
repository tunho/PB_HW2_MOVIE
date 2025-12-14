import axios from 'axios';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
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

export const discoverMovies = async (params: {
    with_genres?: string;
    'vote_average.gte'?: string;
    sort_by?: string;
    page?: number;
    'primary_release_date.lte'?: string;
}) => {
    const response = await tmdb.get('/discover/movie', { params });
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
