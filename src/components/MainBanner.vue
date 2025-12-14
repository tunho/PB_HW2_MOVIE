<template>
  <div class="banner" :style="bannerStyle">
    <div class="banner-contents">
      <h1 class="banner-title">{{ movie?.title || movie?.original_title }}</h1>
      <div class="banner-buttons">
        <button class="banner-button play"><i class="fas fa-play"></i> Play</button>
        <button class="banner-button info" @click="openModal"><i class="fas fa-info-circle"></i> More Info</button>
      </div>
      <h1 class="banner-description">{{ truncatedOverview }}</h1>
    </div>
    <div class="banner-fade-bottom"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { getImageUrl } from '../services/tmdb';
import type { Movie } from '../stores/wishlist';
import { useModalStore } from '../stores/modal';

const props = defineProps<{
  movie: Movie | null;
}>();

const modalStore = useModalStore();

const bannerStyle = computed(() => {
  if (!props.movie) return {};
  return {
    backgroundImage: `url(${getImageUrl(props.movie.poster_path, 'original')})`, // Usually backdrop_path but interface says poster_path
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
  };
});

const truncatedOverview = computed(() => {
  if (!props.movie?.overview) return '';
  return props.movie.overview.length > 150
    ? props.movie.overview.substring(0, 150) + '...'
    : props.movie.overview;
});

const openModal = () => {
  if (props.movie) {
    modalStore.openModal(props.movie);
  }
};
</script>

<style scoped>
.banner {
  color: white;
  object-fit: contain;
  height: 448px;
  position: relative;
}

.banner-contents {
  margin-left: 30px;
  padding-top: 140px;
  height: 190px;
}

.banner-title {
  font-size: 3rem;
  font-weight: 800;
  padding-bottom: 0.3rem;
}

.banner-description {
  width: 45rem;
  line-height: 1.3;
  padding-top: 1rem;
  font-size: 0.8rem;
  max-width: 360px;
  height: 80px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}

.banner-button {
  cursor: pointer;
  color: #fff;
  outline: none;
  border: none;
  font-weight: 700;
  border-radius: 0.2vw;
  padding-left: 2rem;
  padding-right: 2rem;
  margin-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  background-color: rgba(51, 51, 51, 0.5);
}

.banner-button:hover {
  color: #000;
  background-color: #e6e6e6;
  transition: all 0.2s;
}

.banner-button.play {
  background-color: white;
  color: black;
}

.banner-button.play:hover {
  background-color: rgba(255, 255, 255, 0.75);
}

.banner-fade-bottom {
  height: 7.4rem;
  background-image: linear-gradient(
    180deg,
    transparent,
    rgba(37, 37, 37, 0.61),
    #111
  );
  position: absolute;
  bottom: 0;
  width: 100%;
}

@media (max-width: 768px) {
  .banner-contents {
    padding-top: 100px;
    margin-left: 4%;
  }

  .banner-title {
    font-size: 2rem;
  }

  .banner-description {
    font-size: 0.9rem;
    width: 90%;
    max-width: 100%;
    -webkit-line-clamp: 3;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .banner-button {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
}
</style>
