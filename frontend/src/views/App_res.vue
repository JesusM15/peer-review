<script setup lang="ts">
import { ref } from 'vue';

const message = ref<string>('Esperando comunicación con el Backend...');
const status = ref<string>('idle'); // idle | waiting | success | error

const pingBackend = async () => {
  status.value = 'waiting';
  message.value = 'Contactando a NestJS (/api/ping)...';
  
  try {
    // Al hacer 'http://localhost:5173/api/ping',
    // el Proxy de Vite lo redirige mágicamente a 'http://localhost:3000/api/ping'
    const response = await fetch('/api/ping');
    
    if (!response.ok) throw new Error('API falló: ' + response.statusText);
    
    const data = await response.json();
    message.value = data.message;
    status.value = 'success';
  } catch (error) {
    console.error(error);
    message.value = '¡Error! No se pudo conectar con el Backend 😭';
    status.value = 'error';
  }
};
</script>

<template>
  <div class="container">
    <div class="card">
      <h1>🚀 Peer Review PWA</h1>
      <p class="subtitle">Entorno de Desarrollo Plug & Play</p>
      
      <div 
        class="status-box"
        :class="status"
      >
        <p>{{ message }}</p>
      </div>

      <button @click="pingBackend" :disabled="status === 'waiting'">
        {{ status === 'waiting' ? 'Cargando...' : 'Hacer Ping al API' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.card {
  background: #111; /* Estilo oscuro minimalista B&N */
  border-radius: 12px;
  padding: 3rem;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
  border: 1px solid #333;
  max-width: 400px;
  width: 100%;
}

h1 {
  margin-top: 0;
  font-size: 2em;
  font-weight: 800;
  background: -webkit-linear-gradient(120deg, #ffffff, #888888);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #a0a0a0;
  margin-bottom: 2rem;
  font-size: 0.9em;
}

button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.8em 1.5em;
  font-size: 1.1em;
  font-weight: 600;
  font-family: inherit;
  background-color: #ffffff;
  color: #000000;
  cursor: pointer;
  transition: all 0.25s ease;
  width: 100%;
}

button:hover:not(:disabled) {
  background-color: #dddddd;
  transform: translateY(-2px);
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.status-box {
  margin: 1.5rem 0;
  padding: 1rem;
  border-radius: 8px;
  font-weight: 500;
  background: #222;
  border: 1px solid #444;
  transition: all 0.3s ease;
}

.status-box p {
  margin: 0;
  font-size: 0.95em;
}

/* Modificadores de estado */
.status-box.success {
  background: rgba(0, 255, 100, 0.1);
  border-color: #00ff66;
  color: #00ff66;
}

.status-box.error {
  background: rgba(255, 50, 50, 0.1);
  border-color: #ff3333;
  color: #ff3333;
}

.status-box.waiting {
  opacity: 0.7;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(0.98); }
  100% { transform: scale(1); }
}
</style>
