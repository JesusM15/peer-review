<template>
  <div class="profile-page">
    <header class="profile-header">
      <h1 class="page-title">Mi perfil</h1>
      <p class="page-sub">Actualiza tus datos y especialidades para recibir asignaciones relevantes.</p>
    </header>

    <main class="profile-main">
      <section class="card profile-card">
        <form class="form" @submit.prevent="saveProfile">
          <div class="form-group">
            <label for="profile-nombre">Nombre</label>
            <input id="profile-nombre" v-model="form.nombre" type="text" class="form-input" required />
          </div>

          <div class="form-group">
            <label for="profile-email">Correo electrónico</label>
            <input id="profile-email" :value="profile?.email || ''" type="email" class="form-input" disabled />
          </div>

          <div class="form-group">
            <label for="profile-carrera">Carrera / área</label>
            <input id="profile-carrera" v-model="form.carrera" type="text" class="form-input" />
          </div>

          <div class="form-group">
            <label for="profile-telefono">Teléfono</label>
            <input id="profile-telefono" v-model="form.telefono" type="text" class="form-input" />
          </div>

          <div class="form-group">
            <label for="profile-especialidades">Especialidades / etiquetas</label>
            <input
              id="profile-especialidades"
              v-model="form.especialidades"
              type="text"
              class="form-input"
              placeholder="Escribe etiquetas separadas por comas, por ejemplo: IA, Machine Learning, Redes"
            />
            <p class="hint">Usa comas para separar especialidades. Estas se usan para emparejarte con congresos, artículos y revisiones.</p>
          </div>

          <div v-if="errorMessage" class="alert alert-error">{{ errorMessage }}</div>

          <button type="submit" class="btn btn-primary" :disabled="saving">
            {{ saving ? 'Guardando...' : 'Guardar cambios' }}
          </button>
        </form>
      </section>

      <section v-if="canManageCongressTags" class="card profile-card">
        <div class="section-heading">
          <h2>Etiquetas en {{ currentCongressName }}</h2>
          <p class="hint">Selecciona las áreas que te corresponden en este congreso.</p>
        </div>
        <div v-if="loadingTags" class="hint">Cargando etiquetas...</div>
        <div v-else-if="availableTags.length === 0" class="hint">Este congreso todavía no tiene tags.</div>
        <div v-else class="tag-options">
          <label v-for="tag in availableTags" :key="tag.id" class="tag-option">
            <input type="checkbox" :value="tag.id" v-model="selectedCongressTagIds" />
            <span>{{ tag.nombre }}</span>
          </label>
        </div>
        <div v-if="tagErrorMessage" class="alert alert-error">{{ tagErrorMessage }}</div>
        <button class="btn btn-primary" :disabled="savingTags || loadingTags" @click="saveCongressTags">
          {{ savingTags ? 'Guardando...' : 'Guardar etiquetas del congreso' }}
        </button>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useCongressStore } from '../stores/congress'
import { useTheme } from '../composables/useTheme'
import { useToast } from '../composables/useToast'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const authStore = useAuthStore()
const congressStore = useCongressStore()
const { isDark } = useTheme()
const { showToast } = useToast()

interface UserProfile {
  id: string
  nombre: string
  email: string
  rol: string
  perfil: {
    nombre: string
    carrera: string
    telefono?: string
    especialidades: string[]
  }
}

const profile = ref<UserProfile | null>(null)
const form = ref({ nombre: '', carrera: '', telefono: '', especialidades: '' })
const saving = ref(false)
const errorMessage = ref('')
const loadingTags = ref(false)
const savingTags = ref(false)
const tagErrorMessage = ref('')
const availableTags = ref<{ id: string; nombre: string }[]>([])
const selectedCongressTagIds = ref<string[]>([])
const originalCongressTagAssignments = ref<{ id: string; tag_id: string }[]>([])

const currentMembership = computed(() =>
  congressStore.memberships.find(m => m.congreso_id === congressStore.currentCongressId)
)
const currentCongressName = computed(() => currentMembership.value?.congreso?.nombre || 'el congreso actual')
const tagEndpointRole = computed(() => {
  if (currentMembership.value?.rol === 'Revisor') return 'revisor'
  if (currentMembership.value?.rol === 'Editor' || currentMembership.value?.rol === 'Editor Jefe') return 'editor'
  return ''
})
const canManageCongressTags = computed(() => Boolean(congressStore.currentCongressId && tagEndpointRole.value && authStore.user?.id))

function authHeaders(extra: Record<string, string> = {}) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...extra,
  }
  if (authStore.token) headers['Authorization'] = `Bearer ${authStore.token}`
  return headers
}

function normalizeEspecialidades(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

async function loadProfile() {
  errorMessage.value = ''
  try {
    const res = await fetch(`${API}/users/me`, { headers: authHeaders() })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      errorMessage.value = data?.message || 'No se pudo cargar la información del perfil.'
      return
    }

    const data = await res.json()
    profile.value = data
    form.value.nombre = data.nombre || ''
    form.value.carrera = data.perfil?.carrera || ''
    form.value.telefono = data.perfil?.telefono || ''
    form.value.especialidades = (data.perfil?.especialidades || []).join(', ')
  } catch (e) {
    console.error('Error loading profile', e)
    errorMessage.value = 'Error de conexión al cargar el perfil.'
  }
}

async function loadCongressTags() {
  if (!canManageCongressTags.value || !authStore.user?.id || !congressStore.currentCongressId) return
  loadingTags.value = true
  tagErrorMessage.value = ''
  try {
    const [congresoRes, assignedRes] = await Promise.all([
      fetch(`${API}/congresos/${congressStore.currentCongressId}`, { headers: authHeaders() }),
      fetch(`${API}/congresos/${congressStore.currentCongressId}/${tagEndpointRole.value}/${authStore.user.id}/tags`, { headers: authHeaders() }),
    ])
    if (congresoRes.ok) {
      const congreso = await congresoRes.json()
      availableTags.value = congreso.tags || []
    }
    if (assignedRes.ok) {
      const assigned = await assignedRes.json()
      originalCongressTagAssignments.value = assigned
      selectedCongressTagIds.value = assigned.map((item: any) => item.tag_id)
    }
  } catch (e) {
    console.error('Error loading congress tags', e)
    tagErrorMessage.value = 'No se pudieron cargar las etiquetas del congreso.'
  } finally {
    loadingTags.value = false
  }
}

async function saveCongressTags() {
  if (!canManageCongressTags.value || !authStore.user?.id || !congressStore.currentCongressId) return
  savingTags.value = true
  tagErrorMessage.value = ''
  const selected = new Set(selectedCongressTagIds.value)
  const original = new Set(originalCongressTagAssignments.value.map(item => item.tag_id))
  const toAdd = selectedCongressTagIds.value.filter(tagId => !original.has(tagId))
  const toRemove = originalCongressTagAssignments.value.filter(item => !selected.has(item.tag_id))
  try {
    for (const tagId of toAdd) {
      await fetch(`${API}/congresos/${congressStore.currentCongressId}/assign-${tagEndpointRole.value}`, {
        method: 'POST',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ userId: authStore.user.id, tagId }),
      })
    }
    for (const item of toRemove) {
      await fetch(`${API}/congresos/${tagEndpointRole.value}-tag/${item.id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      })
    }
    await loadCongressTags()
    showToast('Etiquetas del congreso actualizadas.', 'success')
  } catch (e) {
    console.error(e)
    tagErrorMessage.value = 'No se pudieron guardar las etiquetas del congreso.'
    showToast(tagErrorMessage.value, 'error')
  } finally {
    savingTags.value = false
  }
}

async function saveProfile() {
  errorMessage.value = ''
  saving.value = true

  try {
    const payload = {
      nombre: form.value.nombre.trim(),
      carrera: form.value.carrera.trim(),
      telefono: form.value.telefono.trim(),
      especialidades: normalizeEspecialidades(form.value.especialidades),
    }

    const res = await fetch(`${API}/users/me`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    })

    const data = await res.json()
    if (!res.ok) {
      errorMessage.value = data?.message || 'No se pudo actualizar el perfil.'
      showToast(errorMessage.value, 'error')
      return
    }

    profile.value = data
    authStore.user = { ...authStore.user, nombre: data.nombre } as any
    showToast('Perfil actualizado correctamente.', 'success')
  } catch (e) {
    console.error(e)
    errorMessage.value = 'Error de conexión al guardar el perfil.'
    showToast(errorMessage.value, 'error')
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  await loadProfile()
  await loadCongressTags()
})
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  padding: 2rem;
  background: var(--bg-page);
  color: var(--text-normal);
}

.profile-header {
  max-width: 900px;
  margin: 0 auto 1.5rem;
}

.page-title {
  font-size: 1.8rem;
  margin: 0 0 0.5rem;
}

.page-sub {
  color: var(--text-muted);
  margin: 0;
}

.profile-main {
  max-width: 900px;
  margin: 0 auto;
}

.profile-card {
  padding: 1.5rem;
  margin-bottom: 1rem;
}

.section-heading h2 {
  margin: 0 0 0.25rem;
  font-size: 1.05rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-input {
  width: 100%;
}

.hint {
  margin: 0.5rem 0 0;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.alert-error {
  margin: 0.75rem 0;
}

.tag-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 1rem 0;
}

.tag-option {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  cursor: pointer;
}

.tag-option span {
  font-size: 0.78rem;
  color: var(--text-muted);
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: 999px;
  padding: 0.25rem 0.6rem;
}
</style>
