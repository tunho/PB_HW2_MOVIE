import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Movie } from './wishlist';

export const useModalStore = defineStore('modal', () => {
    const isOpen = ref(false);
    const selectedMovie = ref<Movie | null>(null);

    const openModal = (movie: Movie) => {
        selectedMovie.value = movie;
        isOpen.value = true;
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    };

    const closeModal = () => {
        isOpen.value = false;
        selectedMovie.value = null;
        document.body.style.overflow = '';
    };

    return {
        isOpen,
        selectedMovie,
        openModal,
        closeModal
    };
});
