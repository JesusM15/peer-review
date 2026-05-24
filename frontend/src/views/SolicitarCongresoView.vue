<template>
  <div class="sc-container" :class="{ dark: isDark }">
    <header class="sc-header">
      <button class="back-btn" @click="goBack" title="Volver">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Volver
      </button>
      <h1 class="page-title">Solicitar Nuevo Congreso</h1>
      <p class="page-sub">Propón un congreso. Un administrador lo revisará y, si lo aprueba, quedarás como Editor en Jefe automáticamente.</p>
    </header>

    <main class="sc-main">
      <section class="card">
        <h2 class="card-title">Nueva propuesta</h2>
        <form @submit.prevent="enviarSolicitud" class="form">
          <div class="form-group">
            <label for="sc-nombre">Nombre del congreso *</label>
            <input
              id="sc-nombre"
              v-model="form.nombre_propuesto"
              type="text"
              required
              minlength="3"
              maxlength="150"
              placeholder="Ej. Congreso Internacional de IA Aplicada 2026"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="sc-desc">Descripción</label>
            <textarea
              id="sc-desc"
              v-model="form.descripcion_propuesta"
              maxlength="2000"
              rows="3"
              placeholder="Tema central, alcance, audiencia objetivo..."
              class="form-input textarea"
            ></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="sc-inicio">Fecha de inicio</label>
              <input
                id="sc-inicio"
                v-model="form.fecha_inicio_propuesta"
                type="date"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label for="sc-fin">Fecha de fin</label>
              <input
                id="sc-fin"
                v-model="form.fecha_fin_propuesta"
                type="date"
                class="form-input"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="sc-motivo">Motivo / justificación</label>
            <textarea
              id="sc-motivo"
              v-model="form.motivo"
              maxlength="2000"
              rows="4"
              placeholder="¿Por qué debería existir este congreso? Comité, instituciones involucradas, etc."
              class="form-input textarea"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="sc-tags">Tags del congreso *</label>
            <input
              id="sc-tags"
              v-model="tagsInput"
              type="text"
              required
              placeholder="IA, Software, Educación"
              class="form-input"
            />
            <div v-if="parsedTags.length" class="tag-preview">
              <span v-for="tag in parsedTags" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </div>

          <div v-if="errorMessage" class="alert alert-error">{{ errorMessage }}</div>

          <button type="submit" class="btn btn-primary" :disabled="enviando">
            <svg v-if="!enviando" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
            {{ enviando ? 'Enviando...' : 'Enviar solicitud' }}
          </button>
        </form>
      </section>

      <section class="card">
        <h2 class="card-title">Mis solicitudes</h2>
        <div v-if="cargando" class="empty-state">Cargando...</div>
        <div v-else-if="solicitudes.length === 0" class="empty-state">
          Aún no has solicitado ningún congreso.
        </div>
        <ul v-else class="sol-list">
          <li
            v-for="sol in solicitudes"
            :key="sol.id"
            class="sol-item"
            :class="estadoClass(sol.estado)"
          >
            <div class="sol-row">
              <h3 class="sol-nombre">{{ sol.nombre_propuesto }}</h3>
              <span class="sol-badge" :class="estadoClass(sol.estado)">{{ sol.estado }}</span>
            </div>
            <p v-if="sol.descripcion_propuesta" class="sol-desc">{{ sol.descripcion_propuesta }}</p>
            <div v-if="sol.tags?.length" class="tag-preview">
              <span v-for="tag in sol.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
            <p v-if="sol.respuesta_admin" class="sol-resp">
              <strong>Respuesta del administrador:</strong> {{ sol.respuesta_admin }}
            </p>
            <div class="sol-meta">
              <span>Enviada: {{ formatDate(sol.fecha_creacion) }}</span>
              <span v-if="sol.fecha_resolucion">· Resuelta: {{ formatDate(sol.fecha_resolucion) }}</span>
            </div>
          </li>
        </ul>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useTheme } from '../composables/useTheme'
import { useToast } from '../composables/useToast'

interface SolicitudCongreso {
  id: string
  nombre_propuesto: string
  descripcion_propuesta?: string
  fecha_inicio_propuesta?: string
  fecha_fin_propuesta?: string
  motivo?: string
  tags?: string[]
  estado: 'Pendiente' | 'Aprobado' | 'Rechazado'
  respuesta_admin?: string
  congreso_creado_id?: string
  fecha_creacion: string
  fecha_resolucion?: string
}

const router = useRouter()
const authStore = useAuthStore()
const { isDark } = useTheme()
const { showToast } = useToast()

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const form = ref({
  nombre_propuesto: '',
  descripcion_propuesta: '',
  fecha_inicio_propuesta: '',
  fecha_fin_propuesta: '',
  motivo: '',
})
const tagsInput = ref('')
const parsedTags = computed(() => normalizeTags(tagsInput.value))

const enviando = ref(false)
const cargando = ref(false)
const errorMessage = ref('')
const solicitudes = ref<SolicitudCongreso[]>([])

function authHeaders(): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (authStore.token) headers['Authorization'] = `Bearer ${authStore.token}`
  return headers
}

async function cargarMisSolicitudes() {
  cargando.value = true
  try {
    const res = await fetch(`${API}/solicitudes-congreso/mias`, { headers: authHeaders() })
    if (res.ok) {
      solicitudes.value = await res.json()
    }
  } catch (e) {
    console.error('Error cargando mis solicitudes', e)
  } finally {
    cargando.value = false
  }
}

async function enviarSolicitud() {
  errorMessage.value = ''
  if (!form.value.nombre_propuesto.trim()) {
    errorMessage.value = 'El nombre del congreso es obligatorio.'
    return
  }
  if (parsedTags.value.length === 0) {
    errorMessage.value = 'Agrega al menos un tag para el congreso.'
    return
  }
  if (form.value.fecha_inicio_propuesta && form.value.fecha_fin_propuesta) {
    if (new Date(form.value.fecha_fin_propuesta) < new Date(form.value.fecha_inicio_propuesta)) {
      errorMessage.value = 'La fecha de fin no puede ser anterior a la de inicio.'
      return
    }
  }

  enviando.value = true
  try {
    const payload: Record<string, string> = {
      nombre_propuesto: form.value.nombre_propuesto.trim(),
    }
    if (form.value.descripcion_propuesta.trim()) {
      payload.descripcion_propuesta = form.value.descripcion_propuesta.trim()
    }
    if (form.value.fecha_inicio_propuesta) {
      payload.fecha_inicio_propuesta = form.value.fecha_inicio_propuesta
    }
    if (form.value.fecha_fin_propuesta) {
      payload.fecha_fin_propuesta = form.value.fecha_fin_propuesta
    }
    if (form.value.motivo.trim()) {
      payload.motivo = form.value.motivo.trim()
    }
    const payloadWithTags = { ...payload, tags: parsedTags.value }

    const res = await fetch(`${API}/solicitudes-congreso`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payloadWithTags),
    })
    const data = await res.json()
    if (res.ok) {
      showToast('Solicitud enviada. Un administrador la revisará pronto.', 'success')
      form.value = {
        nombre_propuesto: '',
        descripcion_propuesta: '',
        fecha_inicio_propuesta: '',
        fecha_fin_propuesta: '',
        motivo: '',
      }
      tagsInput.value = ''
      await cargarMisSolicitudes()
    } else {
      errorMessage.value = data?.message || 'No se pudo enviar la solicitud.'
      showToast(errorMessage.value, 'error')
    }
  } catch (e) {
    console.error(e)
    errorMessage.value = 'Error de conexión.'
    showToast('Error de conexión', 'error')
  } finally {
    enviando.value = false
  }
}

function estadoClass(estado: string) {
  return estado.toLowerCase()
}

function normalizeTags(value: string) {
  return [...new Set(value.split(',').map((tag) => tag.trim()).filter(Boolean))]
}

function formatDate(date?: string) {
  if (!date) return ''
  return new Date(date).toLocaleString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function goBack() {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/select-congress')
  }
}

onMounted(cargarMisSolicitudes)
</script>

<style scoped>
.sc-container {
  min-height: 100vh;
  background-color: var(--bg-base);
  color: var(--text-normal);
  font-family: 'Inter', sans-serif;
  padding: 2rem;
}

.sc-header {
  max-width: 900px;
  margin: 0 auto 2rem;
}
.page-title {
  font-size: 1.6rem;
  font-weight: 700;
  margin: 0.5rem 0;
}
.page-sub {
  color: var(--text-muted);
  font-size: 0.95rem;
  margin: 0;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 0.45rem 0.85rem;
  color: inherit;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background 0.15s ease;
}
.back-btn:hover { background: var(--bg-card-hover); }

.sc-main {
  max-width: 900px;
  margin: 0 auto;
  display: grid;
  gap: 1.5rem;
}

.card {
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 1.5rem;
  background: var(--bg-card);
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 1.25rem 0;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
.form-group { display: flex; flex-direction: column; gap: 0.4rem; }
.form-group label { font-size: 0.85rem; font-weight: 500; color: var(--text-normal); }

.form-input {
  width: 100%;
  padding: 0.6rem 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--bg-input);
  color: var(--text-normal);
  font-size: 0.9rem;
  font-family: inherit;
  box-sizing: border-box;
}
.tag-preview { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.5rem; }
.tag { font-size: 0.72rem; color: #555; background: #f6f6f6; border: 1px solid #e5e5e5; border-radius: 999px; padding: 0.2rem 0.5rem; }
.sc-container.dark .tag { color: #ddd; background: #151515; border-color: #333; }
.form-input:focus {
  outline: none;
  border-color: var(--border-focus);
}
.textarea { resize: vertical; min-height: 80px; }

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.7rem 1.1rem;
  border-radius: 4px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  border: 1px solid transparent;
  transition: opacity 0.15s ease;
}
.btn-primary {
  background: var(--btn-primary-bg);
  color: var(--btn-primary-text);
}
.btn-primary:disabled { opacity: 0.55; cursor: not-allowed; }

.alert {
  padding: 0.7rem 0.9rem;
  border-radius: 4px;
  font-size: 0.85rem;
}
.alert-error {
  background: var(--error-faint);
  color: var(--error);
  border: 1px solid var(--error-faint);
}

.empty-state {
  padding: 1.5rem 0;
  color: #888;
  text-align: center;
  font-size: 0.9rem;
}

.sol-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.75rem;
}
.sol-item {
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 1rem;
  background: var(--bg-card);
}
.sol-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
}
.sol-nombre {
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0;
}
.sol-desc {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin: 0.5rem 0 0 0;
  line-height: 1.4;
}
.sol-resp {
  font-size: 0.85rem;
  margin: 0.5rem 0 0 0;
  padding: 0.5rem 0.7rem;
  border-left: 2px solid var(--primary);
  background: var(--primary-faint);
}
.sol-meta {
  font-size: 0.75rem;
  color: #888;
  margin-top: 0.6rem;
}

.sol-badge {
  font-size: 0.7rem;
  text-transform: uppercase;
  font-weight: 600;
  padding: 0.2rem 0.55rem;
  border-radius: 4px;
  letter-spacing: 0.04em;
}
.sol-badge.pendiente { background: var(--primary-faint); color: var(--primary); }
.sol-badge.aprobado { background: var(--success-faint); color: var(--success); }
.sol-badge.rechazado { background: var(--error-faint); color: var(--error); }

@media (max-width: 720px) {
  .form-row { grid-template-columns: 1fr; }
}
</style>
