/**
 * Main entry point for the Netflix-like Demo App
 * Sets up Vue, Pinia, Router, and FontAwesome
 */
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@fortawesome/fontawesome-free/css/all.css'
import './style.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
