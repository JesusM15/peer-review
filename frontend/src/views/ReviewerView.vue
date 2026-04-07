<template>
  <div class="dashboard">

    <!-- ── Sidebar ── -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="brand">
          <svg class="brand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="brand-name">Diego</span>
        </div>
      </div>

      <nav class="sidebar-nav">
        <button class="nav-item" :class="{ active: vistaActiva === 'overview' }" id="nav-overview-revisor" @click="vistaActiva = 'overview'">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Overview
        </button>
        <button class="nav-item" :class="{ active: vistaActiva === 'asignaciones' }" id="nav-asignaciones-revisor" @click="vistaActiva = 'asignaciones'">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Asignaciones
        </button>
        <button class="nav-item" :class="{ active: vistaActiva === 'nuevo' }" id="nav-nuevo-revisor" @click="vistaActiva = 'nuevo'">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Nuevo artículo
        </button>
      </nav>

      <div class="sidebar-footer">
        <div class="user-chip">
          <div class="user-avatar">{{ userInitial }}</div>
          <div class="user-info">
            <span class="user-name">{{ currentUser?.nombre || 'Revisor' }}</span>
            <span class="user-role">{{ currentUser?.email || 'revisor@diego.edu' }}</span>
          </div>
        </div>
        <button class="back-btn" id="btn-salir-revisor" @click="goBack">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Salir
        </button>
      </div>
    </aside>

    <!-- ── Main ── -->
    <main class="main">

      <!-- ─── OVERVIEW ─────────────────────────────── -->
      <template v-if="vistaActiva === 'overview'">
        <header class="topbar">
          <div>
            <h1 class="page-title">Mi actividad</h1>
            <p class="page-sub">Resumen de tus revisiones asignadas</p>
          </div>
          <button class="btn-primary" id="btn-ver-asignaciones-revisor" @click="vistaActiva = 'asignaciones'">
            Ver asignaciones
          </button>
        </header>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-header">
              <span class="stat-dot pendiente"></span>
              <span class="stat-label">Pendientes</span>
            </div>
            <span class="stat-value">{{ asignacionesPendientes.length }}</span>
            <p class="stat-desc">Artículos asignados sin iniciar</p>
          </div>
          <div class="stat-card">
            <div class="stat-header">
              <span class="stat-dot progreso"></span>
              <span class="stat-label">En progreso</span>
            </div>
            <span class="stat-value">{{ asignacionesEnProgreso.length }}</span>
            <p class="stat-desc">Revisiones actualmente en curso</p>
          </div>
          <div class="stat-card">
            <div class="stat-header">
              <span class="stat-dot completado"></span>
              <span class="stat-label">Completadas</span>
            </div>
            <span class="stat-value">{{ asignacionesCompletadas.length }}</span>
            <p class="stat-desc">Revisiones enviadas al editor</p>
          </div>
        </div>

        <div class="section">
          <h2 class="section-title">Asignaciones recientes</h2>
          
          <div v-if="isLoadingAsignaciones" class="loading-state">
            <div class="spinner"></div>
            <p>Cargando asignaciones...</p>
          </div>
          
          <div v-else-if="asignaciones.length === 0" class="empty-state">
            <div class="empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3>Sin asignaciones pendientes</h3>
            <p>Cuando el editor te asigne un artículo para revisar, aparecerá aquí.</p>
          </div>
          
          <div v-else class="assignments-list">
            <div v-for="asignacion in asignaciones.slice(0, 5)" :key="asignacion.id" class="assignment-card">
              <div class="assignment-info">
                <h4 class="assignment-title">{{ asignacion.articulo?.titulo || 'Sin título' }}</h4>
                <p class="assignment-meta">
                  Autor: {{ asignacion.articulo?.autor?.nombre || 'Desconocido' }} · 
                  Fecha límite: {{ formatDate(asignacion.fecha_limite) }}
                </p>
              </div>
              <button class="btn-primary" @click="irARevision(asignacion.id, asignacion.articulo_id)">
                Revisar
              </button>
            </div>
          </div>
        </div>
      </template>

      <!-- ─── ASIGNACIONES ──────────────────────────── -->
      <template v-if="vistaActiva === 'asignaciones'">
        <header class="topbar">
          <div>
            <h1 class="page-title">Asignaciones</h1>
            <p class="page-sub">Artículos asignados para tu revisión</p>
          </div>
        </header>
        <div class="section">
          <div v-if="isLoadingAsignaciones" class="loading-state">
            <div class="spinner"></div>
            <p>Cargando asignaciones...</p>
          </div>
          
          <div v-else-if="asignaciones.length === 0" class="empty-state">
            <div class="empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3>Sin asignaciones activas</h3>
            <p>Cuando el editor te asigne un artículo, aparecerá en esta sección.</p>
          </div>
          
          <div v-else class="assignments-list">
            <div v-for="asignacion in asignaciones" :key="asignacion.id" class="assignment-card full">
              <div class="assignment-header">
                <div class="assignment-status" :class="asignacion.articulo?.estado?.toLowerCase().replace(' ', '-')">
                  {{ asignacion.articulo?.estado || 'Pendiente' }}
                </div>
              </div>
              <div class="assignment-info">
                <h4 class="assignment-title">{{ asignacion.articulo?.titulo || 'Sin título' }}</h4>
                <p class="assignment-meta">
                  <span class="meta-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    {{ asignacion.articulo?.autor?.nombre || 'Desconocido' }}
                  </span>
                  <span class="meta-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    {{ formatDate(asignacion.fecha_limite) }}
                  </span>
                </p>
              </div>
              <button class="btn-primary" @click="irARevision(asignacion.id, asignacion.articulo_id)">
                Revisar
              </button>
            </div>
          </div>
        </div>
      </template>

      <!-- ─── NUEVO ARTÍCULO ────────────────────────── -->
      <template v-if="vistaActiva === 'nuevo'">
        <header class="topbar">
          <div>
            <h1 class="page-title">Registrar artículo</h1>
            <p class="page-sub">Completa el formulario para enviar tu artículo al sistema</p>
          </div>
        </header>

        <div class="form-center">
          <div class="form-card">
            <form @submit.prevent="submitArticulo" class="articulo-form" id="form-nuevo-articulo-revisor">
              <div class="form-group">
                <label for="titulo-r">Título del artículo</label>
                <input type="text" id="titulo-r" v-model="tituloArticulo" placeholder="Ingrese el título del artículo" required class="form-input"/>
              </div>
              <div class="form-group">
                <label for="pdfFile-r">Documento PDF</label>
                <div class="file-upload-container">
                  <input type="file" id="pdfFile-r" @change="handleFileUpload" accept=".pdf" required class="file-input"/>
                  <div class="file-upload-label">
                    <svg v-if="!archivoPdf" class="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
                      <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <svg v-else class="upload-icon success" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span v-if="!archivoPdf" class="file-placeholder">Haz clic para seleccionar un PDF o arrástralo aquí</span>
                    <span v-else class="file-selected">{{ archivoPdf.name }} · {{ formatFileSize(archivoPdf.size) }}</span>
                  </div>
                </div>
              </div>
              <div class="form-actions">
                <button type="button" class="btn-ghost" id="btn-cancelar-revisor" @click="cancelarFormulario">Cancelar</button>
                <button type="submit" class="btn-primary" id="btn-submit-articulo-revisor" :disabled="isLoading">
                  <svg v-if="isLoading" class="spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke-linecap="round"/>
                  </svg>
                  {{ isLoading ? 'Registrando...' : 'Registrar artículo' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </template>

    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref, onMounted, computed } from 'vue'

const router = useRouter()
const vistaActiva = ref<string>('overview')
const tituloArticulo = ref<string>('')
const archivoPdf = ref<File | null>(null)
const isLoading = ref<boolean>(false)

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// ─── Usuario de sesión (localStorage) ──────────────────────────────────────────
interface CurrentUser { id: string; email: string; nombre: string; rol: string }
const currentUser = ref<CurrentUser | null>(null)

// ─── Asignaciones ──────────────────────────────────────────────────────────────
interface Asignacion {
  id: string
  articulo_id: string
  revisor_id: string
  fecha_limite: string
  articulo?: {
    id: string
    titulo: string
    estado: string
    autor?: { nombre: string; email: string }
  }
}

const asignaciones = ref<Asignacion[]>([])
const isLoadingAsignaciones = ref(false)

onMounted(() => {
  try {
    const raw = localStorage.getItem('user')
    if (raw) {
      currentUser.value = JSON.parse(raw)
      // Cargar asignaciones del revisor
      if (currentUser.value?.id) {
        cargarAsignaciones()
      }
    }
  } catch { currentUser.value = null }
})

const cargarAsignaciones = async () => {
  if (!currentUser.value?.id) return
  
  try {
    isLoadingAsignaciones.value = true
    const response = await fetch(
      `${API_BASE_URL}/asignaciones?revisor_id=${currentUser.value.id}&include_relations=true`
    )
    if (response.ok) {
      asignaciones.value = await response.json()
    }
  } catch (error) {
    console.error('Error al cargar asignaciones:', error)
  } finally {
    isLoadingAsignaciones.value = false
  }
}

const asignacionesPendientes = computed(() =>
  asignaciones.value.filter(a => !a.articulo?.estado?.includes('Revisión'))
)

const asignacionesEnProgreso = computed(() =>
  asignaciones.value.filter(a => a.articulo?.estado?.includes('Revisión'))
)

const asignacionesCompletadas = computed(() =>
  asignaciones.value.filter(a => a.articulo?.estado?.includes('Aceptado') || a.articulo?.estado?.includes('Rechazado'))
)

const irARevision = (asignacionId: string, articuloId: string) => {
  router.push(`/reviewer/revision/${articuloId}`)
}

const userInitial = computed(() =>
  currentUser.value?.nombre ? currentUser.value.nombre[0].toUpperCase() : 'R'
)

const goBack = () => router.push('/')

const submitArticulo = async () => {
  try {
    isLoading.value = true
    const articuloId = generateUUID()
    const autorIdFinal = currentUser.value?.id || generateUUID()
    const createArticuloDto = { id: articuloId, titulo: tituloArticulo.value, autor_id: autorIdFinal, pdf_url: '', keywords: [] }
    console.log('Enviando artículo:', createArticuloDto)
    const response = await fetch(`${API_BASE_URL}/articulos`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(createArticuloDto) })
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`)
    const result = await response.json()
    console.log('Artículo registrado:', result)
    alert(`Artículo "${tituloArticulo.value}" registrado con éxito (ID: ${articuloId})`)
    cancelarFormulario()
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    alert(`Error al registrar artículo: ${errorMessage}`)
  } finally { isLoading.value = false }
}

const generateUUID = (): string =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    if (file.type === 'application/pdf') { archivoPdf.value = file }
    else { alert('Por favor, seleccione un archivo PDF válido'); target.value = '' }
  }
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const cancelarFormulario = () => { tituloArticulo.value = ''; archivoPdf.value = null }
const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString()
</script>

<style scoped>
.dashboard { display: flex; min-height: 100vh; background: #080808; }
.sidebar { width: 220px; min-width: 220px; border-right: 1px solid #1e1e1e; display: flex; flex-direction: column; background: #090909; position: sticky; top: 0; height: 100vh; }
.sidebar-header { padding: 1.5rem 1.25rem 1rem; border-bottom: 1px solid #1e1e1e; }
.brand { display: flex; align-items: center; gap: 0.45rem; }
.brand-icon { width: 16px; height: 16px; color: #fff; }
.brand-name { font-size: 0.9rem; font-weight: 700; color: #fff; letter-spacing: -0.02em; }
.sidebar-nav { flex: 1; display: flex; flex-direction: column; gap: 2px; padding: 1rem 0.75rem; }
.nav-item { display: flex; align-items: center; gap: 0.6rem; padding: 0.6rem 0.75rem; border-radius: 6px; font-size: 0.8rem; font-weight: 500; color: #555; transition: all 0.15s ease; text-align: left; width: 100%; background: transparent; border: none; cursor: pointer; }
.nav-item svg { width: 15px; height: 15px; flex-shrink: 0; }
.nav-item:hover { background: #141414; color: #bbb; }
.nav-item.active { background: #1a1a1a; color: #fff; }
.sidebar-footer { padding: 1rem 0.75rem; border-top: 1px solid #1e1e1e; display: flex; flex-direction: column; gap: 0.75rem; }
.user-chip { display: flex; align-items: center; gap: 0.6rem; }
.user-avatar { width: 28px; height: 28px; border-radius: 50%; background: #1f1f1f; border: 1px solid #2e2e2e; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; color: #fff; flex-shrink: 0; }
.user-info { display: flex; flex-direction: column; min-width: 0; }
.user-name { font-size: 0.8rem; font-weight: 600; color: #ddd; }
.user-role { font-size: 0.7rem; color: #555; }
.back-btn { display: flex; align-items: center; gap: 0.4rem; font-size: 0.75rem; color: #444; transition: color 0.15s; background: transparent; border: none; cursor: pointer; padding: 0; }
.back-btn svg { width: 13px; height: 13px; }
.back-btn:hover { color: #888; }
.main { flex: 1; display: flex; flex-direction: column; overflow-y: auto; }
.topbar { display: flex; align-items: flex-start; justify-content: space-between; padding: 2rem 2.5rem 1.5rem; border-bottom: 1px solid #1e1e1e; }
.page-title { font-size: 1.35rem; font-weight: 700; letter-spacing: -0.02em; color: #fff; margin-bottom: 0.2rem; }
.page-sub { font-size: 0.8rem; color: #666; }
.stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); border-bottom: 1px solid #1e1e1e; }
.stat-card { padding: 1.75rem 2rem; border-right: 1px solid #1e1e1e; display: flex; flex-direction: column; gap: 0.5rem; }
.stat-card:last-child { border-right: none; }
.stat-header { display: flex; align-items: center; gap: 0.45rem; margin-bottom: 0.25rem; }
.stat-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.stat-dot.pendiente  { background: #e5a24c; }
.stat-dot.progreso   { background: #60a5fa; }
.stat-dot.completado { background: #4ade80; }
.stat-label { font-size: 0.72rem; font-weight: 500; color: #888; text-transform: uppercase; letter-spacing: 0.05em; }
.stat-value { font-size: 2.4rem; font-weight: 800; letter-spacing: -0.05em; color: #fff; line-height: 1; }
.stat-desc { font-size: 0.75rem; color: #444; line-height: 1.4; margin-top: 0.2rem; }
.section { padding: 2rem 2.5rem; flex: 1; }
.section-title { font-size: 0.8rem; font-weight: 600; color: #666; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 1.5rem; }
.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 4rem 2rem; gap: 0.75rem; text-align: center; }
.empty-icon { width: 44px; height: 44px; color: #222; margin-bottom: 0.5rem; }
.empty-icon svg { width: 100%; height: 100%; }
.empty-state h3 { font-size: 0.95rem; font-weight: 600; color: #666; }
.empty-state p { font-size: 0.82rem; color: #444; max-width: 280px; line-height: 1.6; }
.form-center { flex: 1; display: flex; align-items: center; justify-content: center; padding: 2.5rem 1.5rem; }
.form-card { width: 100%; max-width: 560px; background: #0d0d0d; border: 1px solid #1e1e1e; border-radius: 10px; padding: 2.5rem; }
.articulo-form { display: flex; flex-direction: column; gap: 1.5rem; }
.form-group { display: flex; flex-direction: column; gap: 0.5rem; }
.form-group label { font-size: 0.8rem; font-weight: 500; color: #bbb; display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap; }
.field-hint { font-size: 0.72rem; color: #444; font-weight: 400; }
.form-input { width: 100%; padding: 0.7rem 0.9rem; border: 1px solid #1e1e1e; border-radius: 6px; background: #111; color: #e8e8e8; font-size: 0.875rem; font-family: inherit; transition: border-color 0.15s; }
.form-input.mono { font-family: 'SF Mono', 'Fira Code', monospace; font-size: 0.8rem; }
.form-input:focus { outline: none; border-color: #333; }
.form-input::placeholder { color: #2e2e2e; }
.file-upload-container { position: relative; }
.file-input { position: absolute; inset: 0; opacity: 0; cursor: pointer; z-index: 1; }
.file-upload-label { display: flex; flex-direction: column; align-items: center; gap: 0.6rem; padding: 1.75rem 1.5rem; border: 1px dashed #1e1e1e; border-radius: 6px; background: #0b0b0b; text-align: center; cursor: pointer; transition: border-color 0.15s; }
.file-upload-label:hover { border-color: #333; }
.upload-icon { width: 26px; height: 26px; color: #2a2a2a; }
.upload-icon.success { color: #4ade80; }
.file-placeholder { font-size: 0.8rem; color: #333; }
.file-selected { font-size: 0.8rem; color: #4ade80; }
.form-actions { display: flex; justify-content: flex-end; gap: 0.75rem; padding-top: 0.25rem; }
.btn-primary { display: flex; align-items: center; gap: 0.4rem; background: #fff; color: #000; font-size: 0.825rem; font-weight: 600; padding: 0.6rem 1.2rem; border-radius: 6px; border: none; cursor: pointer; transition: opacity 0.15s; white-space: nowrap; }
.btn-primary:hover { opacity: 0.88; }
.btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }
.btn-ghost { background: transparent; color: #555; font-size: 0.825rem; font-weight: 500; padding: 0.6rem 1rem; border-radius: 6px; border: 1px solid #1e1e1e; cursor: pointer; transition: color 0.15s, border-color 0.15s; }
.btn-ghost:hover { color: #999; border-color: #333; }
@keyframes spin { to { transform: rotate(360deg); } }
.spinner { width: 14px; height: 14px; animation: spin 0.8s linear infinite; }

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  gap: 1rem;
  color: #666;
}

.loading-state p {
  font-size: 0.9rem;
}

.assignments-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.assignment-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  background: #0d0d0d;
  border: 1px solid #1e1e1e;
  border-radius: 8px;
  transition: border-color 0.15s;
}

.assignment-card:hover {
  border-color: #2a2a2a;
}

.assignment-card.full {
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
}

.assignment-header {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.assignment-status {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.35rem 0.75rem;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.assignment-status.borrador {
  background: rgba(229, 162, 76, 0.1);
  color: #e5a24c;
}

.assignment-status.en-revisión,
.assignment-status.en-revision {
  background: rgba(96, 165, 250, 0.1);
  color: #60a5fa;
}

.assignment-status.aceptado {
  background: rgba(74, 222, 128, 0.1);
  color: #4ade80;
}

.assignment-status.rechazado {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.assignment-info {
  flex: 1;
  min-width: 0;
}

.assignment-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #fff;
  margin-bottom: 0.35rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.assignment-meta {
  font-size: 0.78rem;
  color: #666;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.meta-item svg {
  width: 14px;
  height: 14px;
  color: #444;
}

@media (max-width: 768px) {
  .dashboard { flex-direction: column; }
  .sidebar { width: 100%; min-width: unset; height: auto; position: static; border-right: none; border-bottom: 1px solid #1e1e1e; }
  .sidebar-nav { flex-direction: row; overflow-x: auto; padding: 0.5rem; }
  .nav-item { white-space: nowrap; }
  .topbar { flex-direction: column; gap: 1rem; padding: 1.25rem; }
  .section { padding: 1.5rem 1.25rem; }
  .stats-grid { grid-template-columns: 1fr 1fr; }
  .form-center { padding: 1.5rem 1rem; }
  .form-card { padding: 1.5rem; }
}
</style>
