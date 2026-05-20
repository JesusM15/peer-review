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
            <input id="profile-email" v-model="profile?.email" type="email" class="form-input" disabled />
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
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useTheme } from '../composables/useTheme'
import { useToast } from '../composables/useToast'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const authStore = useAuthStore()
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

onMounted(loadProfile)
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
</style>
