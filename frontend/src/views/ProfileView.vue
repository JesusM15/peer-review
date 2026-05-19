<template>
  <div class="profile-page">
    <header class="profile-header topbar">
      <div>
        <h1 class="page-title">Mi perfil</h1>
        <p class="page-sub">Actualiza tus datos y especialidades para recibir asignaciones relevantes.</p>
      </div>
      <button class="btn-ghost back-btn" type="button" @click="goBack">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 12H5"></path>
          <path d="M12 19l-7-7 7-7"></path>
        </svg>
        Volver
      </button>
    </header>

    <main class="profile-main">
      <section class="profile-panel">
        <div class="section-heading">
          <h2>Informacion personal</h2>
          <p class="hint">Estos datos se usan para identificar tu cuenta dentro del sistema.</p>
        </div>
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
            <div v-if="profileTagNames.length" class="profile-tags" aria-label="Especialidades actuales">
              <span v-for="tag in profileTagNames" :key="tag" class="tag-chip">{{ tag }}</span>
            </div>
          </div>

          <div v-if="errorMessage" class="alert alert-error">{{ errorMessage }}</div>

          <div class="form-actions">
            <button type="submit" class="btn-primary" :disabled="saving">
            {{ saving ? 'Guardando...' : 'Guardar cambios' }}
            </button>
          </div>
        </form>
      </section>

      <section v-if="canManageCongressTags" class="profile-panel">
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
        <div class="form-actions">
          <button class="btn-primary" :disabled="savingTags || loadingTags" @click="saveCongressTags">
            {{ savingTags ? 'Guardando...' : 'Guardar etiquetas del congreso' }}
          </button>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useCongressStore } from '../stores/congress'
import { useToast } from '../composables/useToast'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const router = useRouter()
const authStore = useAuthStore()
const congressStore = useCongressStore()
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
const profileTagNames = computed(() => normalizeEspecialidades(form.value.especialidades))

function goBack() {
  if (window.history.length > 1) {
    router.back()
    return
  }
  router.push('/select-congress')
}

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

async function readJson(res: Response) {
  const text = await res.text()
  if (!text) return null
  return JSON.parse(text)
}

async function loadProfile() {
  errorMessage.value = ''
  try {
    const res = await fetch(`${API}/users/me`, { headers: authHeaders() })
    if (!res.ok && !authStore.user?.id) {
      const data = await readJson(res).catch(() => null)
      errorMessage.value = data?.message || 'No se pudo cargar la información del perfil.'
      return
    }

    let data = res.ok ? await readJson(res) : null
    if (!data && authStore.user?.id) {
      const fallbackRes = await fetch(`${API}/users/${authStore.user.id}?include_relations=true`, { headers: authHeaders() })
      data = fallbackRes.ok ? await readJson(fallbackRes) : null
    }
    if (!data) {
      errorMessage.value = 'No se pudo cargar la informaciÃ³n del perfil.'
      return
    }
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
      const congreso = await readJson(congresoRes)
      availableTags.value = congreso?.tags || []
    }
    if (assignedRes.ok) {
      const assigned = await readJson(assignedRes)
      originalCongressTagAssignments.value = assigned || []
      selectedCongressTagIds.value = (assigned || []).map((item: any) => item.tag_id)
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

    const data = await readJson(res).catch(() => null)
    if (!res.ok) {
      errorMessage.value = data?.message || 'No se pudo actualizar el perfil.'
      showToast(errorMessage.value, 'error')
      return
    }
    if (!data) {
      errorMessage.value = 'El servidor no devolviÃ³ la informaciÃ³n actualizada del perfil.'
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
  background: var(--bg-base);
  color: var(--text-normal);
}

.profile-header {
  max-width: 1040px;
  margin: 0 auto;
}

.topbar {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 2rem 2rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.page-title {
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--text-strong);
  margin: 0 0 0.2rem;
}

.page-sub {
  color: var(--text-faint);
  font-size: 0.8rem;
  margin: 0;
}

.profile-main {
  max-width: 1040px;
  margin: 0 auto;
  padding: 1.5rem 2rem 2rem;
  display: grid;
  gap: 1rem;
}

.profile-panel {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
}

.section-heading h2 {
  margin: 0 0 0.25rem;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text-strong);
}

.section-heading {
  padding-bottom: 1rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.form {
  display: grid;
  gap: 1rem;
}

.form-group {
  display: grid;
  gap: 0.35rem;
}

.form-input {
  width: 100%;
  padding: 0.65rem 0.75rem;
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-strong);
  font-size: 0.875rem;
  font-family: inherit;
}

.form-input:focus {
  outline: none;
  border-color: var(--border-focus);
}

.form-input:disabled {
  color: var(--text-muted);
  cursor: not-allowed;
}

.form-group label {
  color: var(--text-normal);
  font-size: 0.8rem;
  font-weight: 600;
}

.hint {
  margin: 0.35rem 0 0;
  color: var(--text-muted);
  font-size: 0.82rem;
  line-height: 1.45;
}

.alert {
  margin: 0.75rem 0;
  padding: 0.75rem 0.9rem;
  border-radius: 6px;
  font-size: 0.82rem;
  border: 1px solid var(--border-color);
}

.alert-error {
  color: var(--stat-rechazado);
  background: rgba(239, 68, 68, 0.08);
  border-color: rgba(239, 68, 68, 0.2);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 0.25rem;
}

.tag-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 1rem 0;
}

.profile-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.65rem;
}

.tag-chip {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  border: 1px solid var(--border-color);
  background: var(--bg-input);
  color: var(--text-normal);
  font-size: 0.78rem;
  font-weight: 500;
}

.tag-option {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  cursor: pointer;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 0.45rem 0.65rem;
  background: var(--bg-input);
  transition: border-color 0.15s, background 0.15s;
}

.tag-option:hover {
  border-color: var(--border-hover);
  background: var(--bg-card-hover);
}

.tag-option input {
  accent-color: var(--text-strong);
}

.tag-option span {
  font-size: 0.8rem;
  color: var(--text-normal);
}

.btn-primary,
.btn-ghost {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  font-size: 0.825rem;
  font-weight: 600;
  padding: 0.6rem 1.05rem;
  border-radius: 6px;
  transition: opacity 0.15s, background 0.15s, color 0.15s, border-color 0.15s;
}

.btn-primary {
  background: var(--btn-primary-bg);
  color: var(--btn-primary-text);
}

.btn-primary:hover {
  opacity: 0.88;
}

.btn-primary:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.btn-ghost {
  color: var(--btn-ghost-text);
  border: 1px solid var(--border-color);
  background: var(--bg-card);
}

.btn-ghost:hover {
  color: var(--btn-ghost-hover-text);
  border-color: var(--border-focus);
  background: var(--btn-ghost-hover-bg);
}

.back-btn svg {
  width: 16px;
  height: 16px;
}

@media (max-width: 720px) {
  .topbar {
    flex-direction: column;
    padding: 1.25rem;
  }

  .profile-main {
    padding: 1rem 1.25rem 1.5rem;
  }

  .profile-panel {
    padding: 1.15rem;
  }

  .form-actions,
  .back-btn {
    width: 100%;
  }
}
</style>
