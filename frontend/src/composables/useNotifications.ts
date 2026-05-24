import { ref, computed } from 'vue';
import { useAuthStore } from '../stores/auth';

export interface Notificacion {
  id: string;
  user_id: string;
  tipo: string;
  titulo: string;
  mensaje: string;
  link?: string;
  leida: boolean;
  fecha_creacion: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const POLL_MS = 45_000;

const notificaciones = ref<Notificacion[]>([]);
const loading = ref(false);
let pollTimer: ReturnType<typeof setInterval> | null = null;
let subscribers = 0;

function authHeaders(extra: Record<string, string> = {}) {
  const authStore = useAuthStore();
  return {
    Authorization: `Bearer ${authStore.token}`,
    ...extra,
  };
}

export function useNotifications() {
  const authStore = useAuthStore();

  const noLeidas = computed(
    () => notificaciones.value.filter((n) => !n.leida).length,
  );

  const cargar = async () => {
    if (!authStore.token) return;
    loading.value = true;
    try {
      const res = await fetch(`${API_URL}/notificaciones`, {
        headers: authHeaders(),
      });
      if (res.ok) {
        notificaciones.value = await res.json();
      }
    } catch (e) {
      console.error('Error cargando notificaciones:', e);
    } finally {
      loading.value = false;
    }
  };

  const marcarLeida = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/notificaciones/${id}/leer`, {
        method: 'PATCH',
        headers: authHeaders(),
      });
      if (res.ok) {
        const idx = notificaciones.value.findIndex((n) => n.id === id);
        if (idx !== -1) notificaciones.value[idx].leida = true;
      }
    } catch (e) {
      console.error('Error marcando notificación:', e);
    }
  };

  const marcarTodasLeidas = async () => {
    try {
      const res = await fetch(`${API_URL}/notificaciones/leer-todas`, {
        method: 'PATCH',
        headers: authHeaders(),
      });
      if (res.ok) {
        notificaciones.value = notificaciones.value.map((n) => ({
          ...n,
          leida: true,
        }));
      }
    } catch (e) {
      console.error('Error marcando todas:', e);
    }
  };

  const startPolling = () => {
    subscribers++;
    if (pollTimer) return;
    pollTimer = setInterval(() => {
      if (authStore.token) cargar();
    }, POLL_MS);
  };

  const stopPolling = () => {
    subscribers = Math.max(0, subscribers - 1);
    if (subscribers === 0 && pollTimer) {
      clearInterval(pollTimer);
      pollTimer = null;
    }
  };

  return {
    notificaciones,
    loading,
    noLeidas,
    cargar,
    marcarLeida,
    marcarTodasLeidas,
    startPolling,
    stopPolling,
  };
}

export function formatNotifDate(iso?: string) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleString('es-MX', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  } catch {
    return iso;
  }
}
