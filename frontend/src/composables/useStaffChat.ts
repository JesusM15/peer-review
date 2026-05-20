import { ref, onBeforeUnmount } from 'vue';
import { io, Socket } from 'socket.io-client';

type StaffMessage = {
  _id?: string;
  congreso_id: string;
  sender_id: string;
  sender_name: string;
  content: string;
  createdAt: string;
  readBy?: string[];
};

export function useStaffChat(congresoId: string, jwtToken: string | null) {
  const socket = ref<Socket | null>(null);
  const messages = ref<StaffMessage[]>([]);
  const typingUsers = ref<Record<string, boolean>>({});
  const connected = ref(false);

  // Simple client-side rate limiter: 5 messages per 10s
  const bucket = {
    tokens: 5,
    lastRefill: Date.now(),
    refill() {
      const now = Date.now();
      const elapsed = now - this.lastRefill;
      const add = Math.floor(elapsed / 2000); // add 1 token every 2s
      if (add > 0) {
        this.tokens = Math.min(5, this.tokens + add);
        this.lastRefill = now;
      }
    },
    take() {
      this.refill();
      if (this.tokens > 0) {
        this.tokens -= 1;
        return true;
      }
      return false;
    },
  };

  function connect() {
    if (socket.value) return;

    const url = (import.meta.env.VITE_API_WS_URL as string) || 'http://localhost:3000';
    console.log('Connecting to WebSocket:', url, 'with congresoId:', congresoId, 'token:', jwtToken ? 'present' : 'missing');
    
    socket.value = io(url, {
      auth: { token: jwtToken },
      query: { congresoId },
      transports: ['websocket'],
      autoConnect: true,
    });

    socket.value.on('connect', () => {
      connected.value = true;
      console.log('WebSocket connected successfully');
      // Backend automatically joins the room via handleConnection
    });

    socket.value.on('disconnect', () => {
      connected.value = false;
      console.log('WebSocket disconnected');
    });

    socket.value.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });

    socket.value.on('message', (msg: StaffMessage) => {
      console.log('Received message:', msg);
      messages.value.push(msg);
    });

    socket.value.on('typing', (payload: { userId: string; name: string }) => {
      typingUsers.value[payload.userId] = true;
      setTimeout(() => delete typingUsers.value[payload.userId], 3000);
    });
  }

  function disconnect() {
    if (!socket.value) return;
    socket.value.disconnect();
    socket.value = null;
    connected.value = false;
  }

  async function loadHistory(limit = 50, before?: string) {
    const params = new URLSearchParams({ limit: String(limit) });
    if (before) params.set('before', before);
    const headers: Record<string, string> = {};
    if (jwtToken) {
      headers['Authorization'] = `Bearer ${jwtToken}`;
    }
    const res = await fetch(`/api/staff-chat/${encodeURIComponent(congresoId)}/history?${params.toString()}`, {
      headers,
    });
    if (!res.ok) throw new Error('Failed to load history');
    const data: StaffMessage[] = await res.json();
    // Prepend older messages
    messages.value = [...data.reverse(), ...messages.value];
    return data;
  }

  function sendMessage(content: string) {
    if (!socket.value) throw new Error('Socket not connected');
    if (!bucket.take()) throw new Error('Rate limit exceeded');
    const payload = { congresoId, content };
    socket.value.emit('message', payload);
  }

  function sendTyping() {
    socket.value?.emit('typing', { congresoId });
  }

  onBeforeUnmount(() => {
    disconnect();
  });

  return {
    connect,
    disconnect,
    connected,
    messages,
    typingUsers,
    loadHistory,
    sendMessage,
    sendTyping,
  };
}
