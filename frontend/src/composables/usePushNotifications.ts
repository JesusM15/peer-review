import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const pushSupported = ref(
  typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window,
);
const pushEnabled = ref(false);
const pushPermission = ref<NotificationPermission>(
  typeof Notification !== 'undefined' ? Notification.permission : 'default',
);
const pushLoading = ref(false);
const pushError = ref<string | null>(null);

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = window.atob(base64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; ++i) {
    arr[i] = raw.charCodeAt(i);
  }
  return arr;
}

export function usePushNotifications() {
  const authStore = useAuthStore();

  const activarPush = async (): Promise<boolean> => {
    if (!pushSupported.value || !authStore.token) {
      pushError.value = 'Tu navegador no soporta notificaciones push.';
      return false;
    }

    pushLoading.value = true;
    pushError.value = null;

    try {
      const permission = await Notification.requestPermission();
      pushPermission.value = permission;
      if (permission !== 'granted') {
        pushError.value = 'Debes permitir notificaciones en el navegador.';
        return false;
      }

      const keyRes = await fetch(`${API_URL}/notificaciones/push/vapid-public-key`, {
        headers: { Authorization: `Bearer ${authStore.token}` },
      });
      if (!keyRes.ok) {
        pushError.value =
          'El servidor no tiene configuradas las notificaciones push.';
        return false;
      }
      const { publicKey } = await keyRes.json();

      const registration = await navigator.serviceWorker.ready;
      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey),
        });
      }

      const subJson = subscription.toJSON();
      const res = await fetch(`${API_URL}/notificaciones/push/subscribe`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authStore.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          endpoint: subJson.endpoint,
          keys: subJson.keys,
        }),
      });

      if (!res.ok) {
        pushError.value = 'No se pudo registrar el dispositivo para push.';
        return false;
      }

      pushEnabled.value = true;
      localStorage.setItem('push_notifications_enabled', '1');
      return true;
    } catch (e) {
      console.error('Error activando push:', e);
      pushError.value = 'Error al activar notificaciones push.';
      return false;
    } finally {
      pushLoading.value = false;
    }
  };

  const desactivarPush = async () => {
    if (!authStore.token) return;
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await fetch(`${API_URL}/notificaciones/push/unsubscribe`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${authStore.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        });
        await subscription.unsubscribe();
      }
      pushEnabled.value = false;
      localStorage.removeItem('push_notifications_enabled');
    } catch (e) {
      console.error('Error desactivando push:', e);
    }
  };

  const syncPushState = async () => {
    if (!pushSupported.value || !authStore.token) return;
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      pushEnabled.value = !!subscription;
      pushPermission.value = Notification.permission;
    } catch {
      pushEnabled.value = false;
    }
  };

  const autoSubscribeIfNeeded = async () => {
    if (
      localStorage.getItem('push_notifications_enabled') === '1' &&
      Notification.permission === 'granted'
    ) {
      await activarPush();
    }
  };

  return {
    pushSupported,
    pushEnabled,
    pushPermission,
    pushLoading,
    pushError,
    activarPush,
    desactivarPush,
    syncPushState,
    autoSubscribeIfNeeded,
  };
}
