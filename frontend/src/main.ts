import { createApp } from 'vue';
import { createPinia } from 'pinia';
import './style.css';
import App from './App.vue';
import router from './router';
import { useAuthStore } from './stores/auth';

// Vue feature flags are now handled in vite.config.ts

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

// Inicializar autenticación desde localStorage
const authStore = useAuthStore();
authStore.initAuth();

app.mount('#app');
