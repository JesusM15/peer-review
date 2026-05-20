import { createApp } from 'vue';
import { createPinia } from 'pinia';
import './style.css';
import App from './App.vue';
import router from './router';
import { useAuthStore } from './stores/auth';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

// Inicializar autenticación desde localStorage
const authStore = useAuthStore();
await authStore.initAuth();

app.mount('#app');

// Registrar Service Worker PWA (después del mount para no bloquear el arranque)
try {
  const { registerSW } = await import('virtual:pwa-register');
  registerSW({
    immediate: true,
    onNeedRefresh() {
      // Mostrar opción de actualizar si hay nueva versión
      if (confirm('¡Nueva versión disponible! ¿Actualizar ahora?')) {
        window.location.reload();
      }
    },
    onOfflineReady() {
      console.log('[PWA] App lista para uso offline.');
    },
    onRegistered(registration) {
      console.log('[PWA] Service Worker registrado:', registration?.scope);
    },
    onRegisterError(error) {
      console.warn('[PWA] Error al registrar Service Worker:', error);
    },
  });
} catch (e) {
  // virtual:pwa-register no disponible (modo de prueba sin plugin activo)
  console.warn('[PWA] No se pudo cargar el registro del SW:', e);
}
