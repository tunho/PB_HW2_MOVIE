<template>
  <header :class="{ 'scrolled': isScrolled }">
    <div class="logo" @click="$router.push('/')">NETFLIX</div>
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/popular">Popular</router-link>
      <router-link to="/search">Search</router-link>
      <router-link to="/wishlist">My List</router-link>
    </nav>
    <div class="user-actions">
      <button class="font-size-btn" @click="cycleFontSize" title="Adjust Font Size">
        <i class="fas fa-font"></i>
      </button>
      <div v-if="authStore.isAuthenticated" class="profile">
        <span>{{ authStore.user?.id }}</span>
        <button @click="handleLogout">Logout</button>
      </div>
      <router-link v-else to="/signin" class="signin-btn">Sign In</router-link>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const isScrolled = ref(false);
const fontSizes = ['16px', '18px', '20px'];
const currentFontIndex = ref(0);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

const cycleFontSize = () => {
  currentFontIndex.value = (currentFontIndex.value + 1) % fontSizes.length;
  const newSize = fontSizes[currentFontIndex.value];
  document.documentElement.style.fontSize = newSize;
  localStorage.setItem('user_font_size', newSize);
};

const handleLogout = () => {
  authStore.logout();
  router.push('/signin');
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  
  // Load saved font size
  const savedSize = localStorage.getItem('user_font_size');
  if (savedSize) {
    const index = fontSizes.indexOf(savedSize);
    if (index !== -1) {
      currentFontIndex.value = index;
      document.documentElement.style.fontSize = savedSize;
    }
  }
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
header {
  position: fixed;
  top: 0;
  width: 100%;
  height: 68px;
  padding: 0 4%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 1000;
  background: linear-gradient(to bottom, rgba(0,0,0,0.7) 10%, rgba(0,0,0,0));
  transition: background-color 0.3s;
}

header.scrolled {
  background-color: var(--header-bg);
}

.logo {
  color: var(--primary-color);
  font-size: 2rem;
  font-weight: bold;
  cursor: pointer;
  margin-right: 2rem;
}

nav {
  display: flex;
  gap: 20px;
  flex-grow: 1;
}

nav a {
  font-size: 0.9rem;
  color: #e5e5e5;
  text-decoration: none;
  transition: color 0.3s ease;
}

nav a:hover {
  color: #b3b3b3;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
}

nav a.router-link-active {
  color: white;
  font-weight: bold;
  cursor: default;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.font-size-btn {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.5);
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  padding: 0;
}

.font-size-btn:hover {
  background: rgba(255,255,255,0.2);
  border-color: white;
}

.profile {
  display: flex;
  align-items: center;
  gap: 10px;
}

.signin-btn {
  background-color: var(--primary-color);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  color: white;
  font-weight: bold;
}

.signin-btn:hover {
  background-color: #f40612;
  color: white;
}

button {
  background: transparent;
  border: 1px solid white;
  padding: 0.3rem 0.8rem;
  font-size: 0.8rem;
}

button:hover {
  background: rgba(255, 255, 255, 0.1);
}

@media (max-width: 768px) {
  nav {
    display: none;
  }
  
  header {
    padding: 0 4%;
  }

  .logo {
    font-size: 1.5rem;
    margin-right: 0;
  }
}
</style>
