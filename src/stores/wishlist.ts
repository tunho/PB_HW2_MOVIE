import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface Movie {
    id: number;
    title: string;
    original_title?: string;
    poster_path: string;
    backdrop_path?: string;
    overview?: string;
    vote_average?: number;
    release_date?: string;
}

export const useWishlistStore = defineStore('wishlist', () => {
    const wishlist = ref<Movie[]>([]);

    const loadWishlist = () => {
        const stored = localStorage.getItem('movieWishlist');
        if (stored) {
            wishlist.value = JSON.parse(stored);
        }
    };

    const saveWishlist = () => {
        localStorage.setItem('movieWishlist', JSON.stringify(wishlist.value));
    };

    const toggleWishlist = (movie: Movie) => {
        const index = wishlist.value.findIndex((m) => m.id === movie.id);
        if (index === -1) {
            wishlist.value.push(movie);
        } else {
            wishlist.value.splice(index, 1);
        }
        saveWishlist();
    };

    const isInWishlist = (movieId: number) => {
        return wishlist.value.some((m) => m.id === movieId);
    };

    // Initialize
    loadWishlist();

    return {
        wishlist,
        toggleWishlist,
        isInWishlist
    };
});
