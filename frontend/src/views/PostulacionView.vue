<template>
  <div class="postulacion-container">
    <header class="page-header">
      <h1 class="title">Postulación de Rol</h1>
      <p class="subtitle">Solicita un ascenso dentro del congreso actual</p>
    </header>

    <div class="content-grid">
      <!-- Formulario de Postulación -->
      <section class="form-section card">
        <h2 class="section-title">Nueva Solicitud</h2>
        <form @submit.prevent="enviarPostulacion">
          <div class="form-group">
            <label>Rol solicitado</label>
            <select v-model="form.rol_solicitado" required class="form-input">
              <option value="Revisor">Revisor</option>
              <option value="Editor">Editor</option>
            </select>
          </div>
          <div class="form-group">
            <label>Motivo de la postulación</label>
            <textarea 
              v-model="form.motivo" 
              placeholder="Explica por qué deseas este rol (experiencia, especialidades, etc.)"
              class="form-input textarea"
              rows="5"
              required
            ></textarea>
          </div>
          <div v-if="cooldownMessage" class="alert alert-warning">
            {{ cooldownMessage }}
          </div>
          <button type="submit" class="btn btn-primary" :disabled="isSubmitting || !!cooldownMessage">
            {{ isSubmitting ? 'Enviando...' : 'Enviar Postulación' }}
          </button>
        </form>
      </section>

      <!-- Historial de Solicitudes -->
      <section class="history-section card">
        <h2 class="section-title">Mis Solicitudes</h2>
        <div v-if="loading" class="loading">Cargando historial...</div>
        <div v-else-if="solicitudes.length === 0" class="empty-state">
          No has realizado ninguna postulación aún.
        </div>
        <div v-else class="solicitudes-list">
          <div v-for="sol in solicitudes" :key="sol.id" class="solicitud-item" :class="sol.estado.toLowerCase()">
            <div class="sol-header">
              <span class="sol-rol">{{ sol.rol_solicitado }}</span>
              <span class="sol-status-badge">{{ sol.estado }}</span>
            </div>
            <div class="sol-body">
              <p class="sol-motivo"><strong>Mi motivo:</strong> {{ sol.motivo_usuario }}</p>
              <p v-if="sol.respuesta_admin" class="sol-respuesta">
                <strong>Respuesta:</strong> {{ sol.respuesta_admin }}
              </p>
            </div>
            <div class="sol-footer">
              <span class="sol-date">{{ formatDate(sol.fecha_creacion) }}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useCongressStore } from '../stores/congress'
import { useAuthStore } from '../stores/auth'
import { useToast } from '../composables/useToast'

const congressStore = useCongressStore()
const authStore = useAuthStore()
const { showToast } = useToast()

const form = ref({
  rol_solicitado: 'Revisor',
  motivo: ''
})

const solicitudes = ref<any[]>([])
const loading = ref(false)
const isSubmitting = ref(false)
const cooldownMessage = ref('')

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const currentUser = computed(() => {
  const raw = localStorage.getItem('user')
  return raw ? JSON.parse(raw) : null
})

const authHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  }
  if (authStore.token) {
    headers.Authorization = `Bearer ${authStore.token}`
  }
  return headers
}

const fetchSolicitudes = async () => {
  if (!currentUser.value) return
  loading.value = true
  try {
    const res = await fetch(`${API_BASE_URL}/solicitudes/usuario/${currentUser.value.id}`, {
      headers: authHeaders()
    })
    if (res.ok) {
      solicitudes.value = await res.json()
      checkCooldown()
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const checkCooldown = () => {
  const rechazo = solicitudes.value.find(s => s.estado === 'Rechazado')
  if (rechazo && rechazo.fecha_resolucion) {
    const fechaRes = new Date(rechazo.fecha_resolucion).getTime()
    const ahora = Date.now()
    const diff = ahora - fechaRes
    const unaHora = 60 * 60 * 1000
    if (diff < unaHora) {
      const mins = Math.ceil((unaHora - diff) / (60 * 1000))
      cooldownMessage.value = `Has sido rechazado recientemente. Podrás volver a postularte en ${mins} minutos.`
    } else {
      cooldownMessage.value = ''
    }
  }
}

const enviarPostulacion = async () => {
  if (!congressStore.currentCongressId || !currentUser.value) return
  
  isSubmitting.value = true
  try {
    const res = await fetch(`${API_BASE_URL}/solicitudes`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({
        user_id: currentUser.value.id,
        congreso_id: congressStore.currentCongressId,
        rol_solicitado: form.value.rol_solicitado,
        motivo: form.value.motivo
      })
    })

    const data = await res.json()
    if (res.ok) {
      showToast('Postulación enviada con éxito', 'success')
      form.value.motivo = ''
      await fetchSolicitudes()
    } else {
      showToast(data.message || 'Error al enviar postulación', 'error')
    }
  } catch (error) {
    showToast('Error de conexión', 'error')
  } finally {
    isSubmitting.value = false
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(fetchSolicitudes)
</script>

<style scoped>
.postulacion-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header { margin-bottom: 2rem; }
.title { font-size: 1.8rem; font-weight: 700; color: var(--text-strong); }
.subtitle { color: var(--text-muted); }

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 2rem;
}

.card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
}

.section-title {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  color: var(--text-strong);
}

.form-group { margin-bottom: 1.5rem; }
.form-group label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
.form-input {
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--bg-input);
  color: var(--text-normal);
}
.textarea { resize: vertical; }

.btn {
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-primary {
  background: var(--btn-primary-bg);
  color: var(--btn-primary-text);
  border: none;
}
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

.alert {
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}
.alert-warning {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.2);
}

.solicitudes-list { display: flex; flex-direction: column; gap: 1rem; }
.solicitud-item {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1rem;
  background: var(--bg-card-hover);
}

.sol-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}
.sol-rol { font-weight: 700; color: var(--text-strong); }
.sol-status-badge {
  font-size: 0.75rem;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  text-transform: uppercase;
}

.solicitud-item.pendiente .sol-status-badge { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
.solicitud-item.aprobado .sol-status-badge { background: rgba(16, 185, 129, 0.1); color: #10b981; }
.solicitud-item.rechazado .sol-status-badge { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

.sol-body { font-size: 0.9rem; margin-bottom: 0.5rem; }
.sol-motivo, .sol-respuesta { line-height: 1.4; margin-bottom: 0.5rem; }
.sol-footer { font-size: 0.75rem; color: var(--text-faint); }

@media (max-width: 900px) {
  .content-grid { grid-template-columns: 1fr; }
}
</style>
