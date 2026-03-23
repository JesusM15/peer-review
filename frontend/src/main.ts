import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router';

// Vue feature flags are now handled in vite.config.ts

createApp(App).use(router).mount('#app');
