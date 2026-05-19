<template>
  <div class="staff-chat" role="region" aria-label="Chat del staff">
    <div class="chat-card">
      <div class="chat-card-header">
        <div>
          <div class="page-sub" style="font-size:0.92rem; font-weight:600">Comunicación interna por congreso</div>
        </div>
        <div style="display:flex;align-items:center;gap:0.6rem">
          <span :class="['status-dot', connected ? 'online' : 'offline']" title="Estado de conexión"></span>
          <span style="font-size:0.82rem;color:var(--text-faint)">{{ connected ? 'Conectado' : 'Desconectado' }}</span>
        </div>
      </div>

      <div class="messages" ref="messagesContainer">
        <div ref="topSentinel" class="sentinel"></div>
        <ul class="messages-list">
          <li v-for="m in messages" :key="m._id" :class="['message-row', m.sender_id === currentUserId ? 'mine' : 'theirs']">
            <div class="msg-avatar">{{ (m.sender_name || '?').charAt(0).toUpperCase() }}</div>
            <div class="msg-body">
              <div class="msg-meta">
                <strong>{{ m.sender_name }}</strong>
                <small class="msg-time">{{ formatDate(m.createdAt) }}</small>
              </div>
              <div class="msg-bubble">{{ m.content }}</div>
            </div>
          </li>
        </ul>
      </div>

      <div class="typing" v-if="Object.keys(typingUsers).length">
        <span class="typing-indicator">Alguien está escribiendo…</span>
      </div>

      <form class="composer" @submit.prevent="onSend">
        <input 
          class="form-input" 
          v-model="text" 
          @input="onInput" 
          :placeholder="isReadOnly ? 'Solo lectura - Eres Revisor' : 'Escribe un mensaje para el staff...'"
          :disabled="isReadOnly"
        />
        <button class="btn-primary btn-send" type="submit" :disabled="!connected || sending || isReadOnly">{{ sending ? 'Enviando...' : 'Enviar' }}</button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed } from 'vue';
import { useStaffChat } from '../composables/useStaffChat';
import { useAuthStore } from '../stores/auth';

export default defineComponent({
  name: 'StaffChat',
  props: {
    congresoId: { type: String, required: true },
    jwt: { type: String, required: false },
  },
  setup(props) {
    const { connect, connected, messages, typingUsers, loadHistory, sendMessage, sendTyping } =
      useStaffChat(props.congresoId, props.jwt || null);

    const authStore = useAuthStore();
    const currentUserId = computed(() => authStore.user?.id || '');
    const isReadOnly = computed(() => authStore.user?.rol === 'Revisor');

    const text = ref('');
    const sending = ref(false);
    const messagesContainer = ref<HTMLElement | null>(null);
    const topSentinel = ref<HTMLElement | null>(null);

    function formatDate(d: string) {
      return new Date(d).toLocaleString();
    }

    async function onSend() {
      if (!text.value.trim()) return;
      try {
        sending.value = true;
        sendMessage(text.value.trim());
        text.value = '';
        // scroll to bottom
        requestAnimationFrame(() => {
          messagesContainer.value?.scrollTo({ top: messagesContainer.value.scrollHeight, behavior: 'smooth' });
        });
      } catch (err: any) {
        alert(err.message || 'Error al enviar mensaje');
      } finally {
        sending.value = false;
      }
    }

    function onInput() {
      sendTyping();
    }

    onMounted(async () => {
      connect();
      // load initial history
      try {
        await loadHistory(50);
      } catch (e) {
        // ignore if backend not ready
      }

      // Infinite scroll: when top sentinel visible, load older messages
      if (topSentinel.value) {
        const obs = new IntersectionObserver(async (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              // Load older messages using last message's createdAt as "before"
              const first = messages.value[0];
              const before = first?.createdAt;
              try {
                await loadHistory(50, before);
              } catch (err) {
                // ignore
              }
            }
          }
        }, { root: messagesContainer.value, threshold: 0.1 });
        obs.observe(topSentinel.value);
      }
    });

    return { text, onSend, onInput, messages, typingUsers, connected, sending, messagesContainer, topSentinel, formatDate, currentUserId, isReadOnly };
  },
});
</script>

<style scoped>
.staff-chat { display:flex; flex-direction:column; height:calc(100vh - 72px); }
.chat-card { display:flex; flex-direction:column; background:var(--bg-card); border:1px solid var(--border-color); border-radius:10px; height:100%; overflow:hidden; width:100% }
.chat-card-header { display:flex; justify-content:space-between; align-items:center; padding:12px 16px; border-bottom:1px solid var(--border-color); }
.chat-card-header .page-title { font-size:1rem; font-weight:700; color:var(--text-strong); }
.status-dot { width:10px; height:10px; border-radius:50%; display:inline-block; }
.status-dot.online { background: #10b981; box-shadow: 0 0 6px rgba(16,185,129,0.12); }
.status-dot.offline { background: #ef4444; opacity:0.6 }

.messages { flex:1; overflow:auto; padding:12px 14px; }
.messages-list { list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:10px }
.message-row { display:flex; gap:10px; align-items:flex-start }
.message-row.mine { flex-direction:row-reverse }
.msg-avatar { width:36px; height:36px; border-radius:50%; background:var(--bg-input); border:1px solid var(--border-hover); display:flex; align-items:center; justify-content:center; font-weight:700; color:var(--text-strong); flex-shrink:0 }
.msg-body { max-width:75%; display:flex; flex-direction:column; }
.msg-meta { display:flex; gap:8px; align-items:center; font-size:0.78rem; color:var(--text-faint); }
.msg-time { font-size:0.72rem; color:var(--text-faint); }
.msg-bubble { margin-top:6px; padding:10px 12px; border-radius:10px; background:var(--bg-input); color:var(--text-normal); border:1px solid var(--border-color); word-break:break-word }
.message-row.mine .msg-bubble { background:#000000; color:#ffffff; border-color:transparent }

.typing { padding:8px 14px; border-top:1px dashed var(--border-color); background:transparent }
.typing-indicator { color:var(--text-faint); font-size:0.85rem }

.composer { display:flex; gap:8px; padding:12px 14px; border-top:1px solid var(--border-color); align-items:center }
.composer .form-input { flex:1; background:var(--bg-input); border:1px solid var(--border-color); padding:10px; border-radius:8px; color:#ffffff }
.composer .btn-primary { white-space:nowrap }
.composer .btn-send { background: #ffffff; color: var(--text-strong); border: 1px solid var(--border-color); padding:8px 12px; border-radius:8px }
.composer .btn-send:disabled { opacity:0.5; cursor:not-allowed }
.sentinel { height:1px }
</style>
