<template>
  <div class="notif-wrapper" ref="wrapperRef">
    <button
      class="notif-btn"
      type="button"
      title="Notificaciones"
      aria-label="Notificaciones"
      @click="togglePanel"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <span v-if="noLeidas > 0" class="notif-dot">{{ noLeidas > 9 ? '9+' : noLeidas }}</span>
    </button>

    <div v-if="showPanel" class="notif-panel" @click.stop>
      <div class="notif-panel-header">
        <span>Notificaciones</span>
        <button
          v-if="noLeidas > 0"
          type="button"
          class="notif-mark-all"
          @click="marcarTodasLeidas"
        >
          Marcar todas como leídas
        </button>
      </div>

      <div v-if="pushSupported" class="notif-push-bar">
        <span v-if="pushEnabled" class="notif-push-status on">Push activo</span>
        <span v-else class="notif-push-status">Push desactivado</span>
        <button
          v-if="!pushEnabled"
          type="button"
          class="notif-push-btn"
          :disabled="pushLoading"
          @click="onActivarPush"
        >
          {{ pushLoading ? 'Activando...' : 'Activar push' }}
        </button>
        <button
          v-else
          type="button"
          class="notif-push-btn muted"
          @click="desactivarPush"
        >
          Desactivar
        </button>
      </div>
      <p v-if="pushError" class="notif-push-error">{{ pushError }}</p>

      <div v-if="loading" class="notif-empty">Cargando...</div>
      <div v-else-if="notificaciones.length === 0" class="notif-empty">
        Sin notificaciones
      </div>
      <ul v-else class="notif-list">
        <li
          v-for="notif in notificaciones"
          :key="notif.id"
          class="notif-item"
          :class="{ unread: !notif.leida }"
          @click="abrir(notif)"
        >
          <div class="notif-item-title">{{ notif.titulo }}</div>
          <div class="notif-item-msg">{{ notif.mensaje }}</div>
          <div class="notif-item-date">{{ formatNotifDate(notif.fecha_creacion) }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  useNotifications,
  formatNotifDate,
  type Notificacion,
} from '../composables/useNotifications';
import { usePushNotifications } from '../composables/usePushNotifications';

const props = defineProps<{
  onNavigate?: (notif: Notificacion) => void;
}>();

const router = useRouter();
const wrapperRef = ref<HTMLElement | null>(null);
const showPanel = ref(false);

const {
  notificaciones,
  loading,
  noLeidas,
  cargar,
  marcarLeida,
  marcarTodasLeidas,
  startPolling,
  stopPolling,
} = useNotifications();

const {
  pushSupported,
  pushEnabled,
  pushLoading,
  pushError,
  activarPush,
  desactivarPush,
  syncPushState,
  autoSubscribeIfNeeded,
} = usePushNotifications();

const togglePanel = () => {
  showPanel.value = !showPanel.value;
  if (showPanel.value) cargar();
};

const onActivarPush = async () => {
  const ok = await activarPush();
  if (ok) await cargar();
};

const abrir = async (notif: Notificacion) => {
  if (!notif.leida) await marcarLeida(notif.id);
  showPanel.value = false;

  if (props.onNavigate) {
    props.onNavigate(notif);
    return;
  }

  if (notif.link) {
    router.push(notif.link);
  }
};

const onClickOutside = (e: MouseEvent) => {
  if (wrapperRef.value && !wrapperRef.value.contains(e.target as Node)) {
    showPanel.value = false;
  }
};

onMounted(async () => {
  startPolling();
  await cargar();
  await syncPushState();
  await autoSubscribeIfNeeded();
  document.addEventListener('click', onClickOutside);
});

onUnmounted(() => {
  stopPolling();
  document.removeEventListener('click', onClickOutside);
});
</script>

<style scoped>
.notif-wrapper {
  position: relative;
}

.notif-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  color: var(--text-muted);
  cursor: pointer;
  transition: background 0.15s;
}

.notif-btn:hover {
  background: var(--bg-card-hover);
}

.notif-btn svg {
  width: 18px;
  height: 18px;
}

.notif-dot {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  border-radius: 9px;
  background: #ef4444;
  color: #fff;
  font-size: 0.65rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notif-panel {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: min(360px, 92vw);
  max-height: 420px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
  z-index: 200;
}

.notif-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border-color);
  font-weight: 600;
  font-size: 0.85rem;
}

.notif-mark-all {
  background: none;
  border: none;
  color: var(--primary);
  font-size: 0.72rem;
  cursor: pointer;
  padding: 0;
}

.notif-mark-all:hover {
  text-decoration: underline;
}

.notif-push-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid var(--border-color);
  flex-wrap: wrap;
}

.notif-push-status {
  font-size: 0.72rem;
  color: var(--text-muted);
}

.notif-push-status.on {
  color: #22c55e;
}

.notif-push-btn {
  margin-left: auto;
  font-size: 0.72rem;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  border: 1px solid var(--primary);
  background: var(--primary-faint);
  color: var(--primary);
  cursor: pointer;
}

.notif-push-btn.muted {
  border-color: var(--border-color);
  background: transparent;
  color: var(--text-muted);
}

.notif-push-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.notif-push-error {
  margin: 0;
  padding: 0.35rem 1rem;
  font-size: 0.72rem;
  color: #ef4444;
}

.notif-empty {
  padding: 1.5rem;
  text-align: center;
  color: var(--text-muted);
  font-size: 0.82rem;
}

.notif-list {
  list-style: none;
  margin: 0;
  padding: 0;
  overflow-y: auto;
  flex: 1;
}

.notif-item {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
}

.notif-item:last-child {
  border-bottom: none;
}

.notif-item:hover {
  background: var(--bg-card-hover);
}

.notif-item.unread {
  background: var(--primary-faint);
}

.notif-item-title {
  font-weight: 600;
  font-size: 0.82rem;
  color: var(--text-strong);
  margin-bottom: 0.2rem;
}

.notif-item-msg {
  font-size: 0.78rem;
  color: var(--text-muted);
  line-height: 1.4;
}

.notif-item-date {
  font-size: 0.68rem;
  color: var(--text-faint);
  margin-top: 0.35rem;
}
</style>
