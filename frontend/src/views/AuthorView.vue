<template>
  <div class="author-view">
    <header class="header">
      <button @click="goBack" class="back-button">
        ← Volver
      </button>
      <h1>✍️ Autor</h1>
      <div class="spacer"></div>
    </header>
    
    <main class="main-content">
      <div class="container">
        <p>Vista del Autor - Envío y gestión de artículos</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.push('/')
}
</script>

<style scoped>
.author-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
}

.header {
  display: flex;
  align-items: center;
  padding: 1.5rem 2rem;
  background: rgba(17, 17, 17, 0.9);
  border-bottom: 1px solid #333;
  backdrop-filter: blur(10px);
}

.back-button {
  background: #1a1a1a;
  border: 1px solid #444;
  color: #ffffff;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.back-button:hover {
  background: #2a2a2a;
  border-color: #666;
}

h1 {
  margin: 0;
  font-size: 1.5em;
  font-weight: 600;
  color: #ffffff;
  flex: 1;
  text-align: center;
}

.spacer {
  width: 80px;
}

.main-content {
  padding: 2rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  color: #888;
  font-size: 1.1rem;
}
</style>
