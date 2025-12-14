import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import SigninView from './views/SigninView.vue'
import PopularView from './views/PopularView.vue'
import SearchView from './views/SearchView.vue'
import WishlistView from './views/WishlistView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/signin',
      name: 'signin',
      component: SigninView
    },
    {
      path: '/popular',
      name: 'popular',
      component: PopularView
    },
    {
      path: '/search',
      name: 'search',
      component: SearchView
    },
    {
      path: '/wishlist',
      name: 'wishlist',
      component: WishlistView
    }
  ]
})

router.beforeEach((to, _from, next) => {
  const publicPages = ['/signin'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');

  if (authRequired && !loggedIn) {
    next('/signin');
  } else {
    next();
  }
});

export default router
