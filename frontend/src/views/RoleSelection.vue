<template>
  <div class="role-selection">
    <div class="container">
      <div class="card">
        <h1>Peer Review System</h1>
        <p class="subtitle">Selecciona tu rol para continuar</p>
        
        <div class="roles-grid">
          <button 
            @click="selectRole('editor')"
            class="role-button"
          >
            <div class="role-icon">E</div>
            <h3>Editor</h3>
            <p>Gestionar artículos y asignaciones</p>
          </button>
          
          <button 
            @click="selectRole('reviewer')"
            class="role-button"
          >
            <div class="role-icon">R</div>
            <h3>Revisor</h3>
            <p>Revisar artículos asignados</p>
          </button>
          
          <button 
            @click="selectRole('author')"
            class="role-button"
          >
            <div class="role-icon">A</div>
            <h3>Autor</h3>
            <p>Enviar y gestionar mis artículos</p>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const selectRole = (role: string) => {
  router.push(`/${role}`)
}
</script>

<style scoped>
.role-selection {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
}

.container {
  padding: 2rem;
  max-width: 800px;
  width: 100%;
}

.card {
  background: #111;
  border-radius: 16px;
  padding: 3rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  border: 1px solid #333;
  text-align: center;
}

h1 {
  margin-top: 0;
  font-size: 2.5em;
  font-weight: 800;
  background: -webkit-linear-gradient(120deg, #ffffff, #888888);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #a0a0a0;
  margin-bottom: 3rem;
  font-size: 1.1em;
}

.roles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.role-button {
  background: #1a1a1a;
  border: 1px solid #444;
  border-radius: 12px;
  padding: 2rem 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  color: #ffffff;
}

.role-button:hover {
  background: #2a2a2a;
  border-color: #666;
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(255, 255, 255, 0.1);
}

.role-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.role-button h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.3em;
  font-weight: 600;
  color: #ffffff;
}

.role-button p {
  margin: 0;
  color: #888;
  font-size: 0.9em;
  line-height: 1.4;
}
</style>
