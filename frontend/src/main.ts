import { registerSW } from 'virtual:pwa-register';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import './style.css';
import App from './App.vue';
import router from './router';
import { useAuthStore } from './stores/auth';

// Register PWA Service Worker
const updateSW = registerSW({
  onNeedRefresh() {
    console.log('New content available, click to update.');
  },
  onOfflineReady() {
    console.log('App is ready for offline use.');
  },
});

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

// Inicializar autenticación desde localStorage
const authStore = useAuthStore();
await authStore.initAuth();

app.mount('#app');
