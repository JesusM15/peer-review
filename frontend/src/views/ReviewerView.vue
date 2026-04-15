<template>
  <div class="dashboard">

    <!-- ── Sidebar ── -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="brand">
          <svg class="brand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="brand-name">Peer Review System</span>
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

      <!-- Indicador de conexión -->
      <div v-if="isOffline" class="connection-status offline">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m0 0L9 12" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>Sin conexión</span>
      </div>
      <div v-else class="connection-status online">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 12.55a11 11 0 0114.08 0M1.42 9a16 16 0 0121.16 0M8.53 16.11a6 16 0 016.95 0M12 20h.01" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>En línea</span>
      </div>

      <div class="sidebar-footer relative-footer">
        <div class="user-menu-dropdown" v-if="showUserMenu">
           <button class="menu-item" @click="toggleTheme">
              <svg v-if="isDark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
              Tema: {{ isDark ? 'Oscuro' : 'Claro' }}
           </button>
           <button class="menu-item text-danger" id="btn-salir-revisor" @click="logout">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Cerrar sesión
           </button>
        </div>
        <button class="user-chip user-chip-btn" @click="showUserMenu = !showUserMenu" :class="{ active: showUserMenu }">
          <div class="user-avatar">{{ userInitial }}</div>
          <div class="user-info">
            <span class="user-name">{{ currentUser?.nombre || 'Revisor' }}</span>
            <span class="user-role">{{ currentUser?.email || 'revisor@diego.edu' }}</span>
          </div>
          <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
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
                  Fecha límite: {{ formatDate(asignacion.fecha_limite) }}
                </p>
              </div>
              <div class="assignment-actions">
                <button class="btn-primary" @click="irARevision(asignacion.id, asignacion.articulo_id)">
                  Revisar
                </button>
                <span v-if="asignacion.pdfDescargado" class="offline-badge-small">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  Offline
                </span>
              </div>
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
            <!-- Sección: Pendientes / En Progreso -->
            <h3 v-if="[...asignacionesEnProgreso, ...asignacionesPendientes].length > 0" class="sub-section-title">Asignaciones en curso</h3>
            <div v-for="asignacion in [...asignacionesEnProgreso, ...asignacionesPendientes]" :key="asignacion.id" class="assignment-card full">
              <div class="assignment-header">
                <div class="assignment-status" :class="asignacion.articulo?.estado?.toLowerCase().replace(' ', '-')">
                  {{ asignacion.articulo?.estado || 'En Revisión' }}
                </div>
              </div>
              <div class="assignment-info">
                <h4 class="assignment-title">{{ asignacion.articulo?.titulo || 'Sin título' }}</h4>
                <p class="assignment-meta">Límite: {{ formatDate(asignacion.fecha_limite) }}</p>
              </div>
              <div class="assignment-actions">
                <button class="btn-primary" @click="irARevision(asignacion.id, asignacion.articulo_id)">
                  Revisar
                </button>
                <button v-if="!isOffline && !asignacion.pdfDescargado" class="btn-secondary" @click="descargarParaOffline(asignacion)">
                  Guardar offline
                </button>
              </div>
            </div>

            <!-- Sección: Historial de Completados -->
            <div v-if="asignacionesCompletadas.length > 0" style="margin-top: 3rem;">
              <h3 class="sub-section-title">Historial de Revisiones</h3>
              <div v-for="asignacion in asignacionesCompletadas" :key="'comp-' + asignacion.id" class="assignment-card full" style="opacity: 0.8;">
                <div class="assignment-header">
                  <div class="assignment-status" :class="asignacion.articulo?.estado?.toLowerCase()">
                    {{ asignacion.articulo?.estado }}
                  </div>
                </div>
                <div class="assignment-info">
                    <h4 class="assignment-title" style="font-weight: 700; color: var(--text-strong);">{{ asignacion.articulo?.titulo || 'Sin título' }}</h4>
                    <p class="assignment-meta">Revision finalizada satisfactoriamente</p>
                </div>
                <div class="assignment-actions">
                  <button class="btn-secondary" @click="irARevision(asignacion.id, asignacion.articulo_id)">
                    Ver revisión
                  </button>
                </div>
              </div>
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
import { useTheme } from '../composables/useTheme'
import { useToast } from '../composables/useToast'
import { useAuthStore } from '../stores/auth'
import { useOfflineStorage } from '../composables/useOfflineStorage'

const router = useRouter()
const { isDark, toggleTheme } = useTheme()
const { showToast } = useToast()
const authStore = useAuthStore()
const offlineStorage = useOfflineStorage()

const logout = () => {
  authStore.logout()
  router.push('/login')
}

const showUserMenu = ref(false)
const vistaActiva = ref<string>('overview')
const tituloArticulo = ref<string>('')
const archivoPdf = ref<File | null>(null)
const isLoading = ref<boolean>(false)
const isOffline = ref(false)

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
  pdfDescargado?: boolean
  descargando?: boolean
  articulo?: {
    id: string
    titulo: string
    estado: string
    autor?: { nombre: string; email: string }
  }
}

const asignaciones = ref<Asignacion[]>([])
const isLoadingAsignaciones = ref(false)
const isSyncingPdfs = ref(false)
const offlineAssignments = ref<any[]>([])

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

  // Detectar estado de conexión
  isOffline.value = !offlineStorage.isOnline()
  window.addEventListener('online', () => isOffline.value = false)
  window.addEventListener('offline', () => isOffline.value = true)
})

const cargarAsignaciones = async () => {
  if (!currentUser.value?.id) return

  try {
    isLoadingAsignaciones.value = true

    // Si está offline, cargar desde IndexedDB
    if (!offlineStorage.isOnline()) {
      offlineAssignments.value = await offlineStorage.getAllAssignments()
      asignaciones.value = offlineAssignments.value.map(oa => ({
        id: oa.asignacionId,
        articulo_id: oa.articuloId,
        revisor_id: currentUser.value!.id,
        fecha_limite: oa.fechaLimite,
        articulo: {
          id: oa.articuloId,
          titulo: oa.titulo,
          estado: oa.estado,
          autor: { nombre: oa.autorNombre, email: '' }
        }
      }))
      return
    }

    const response = await fetch(
      `${API_BASE_URL}/asignaciones?revisor_id=${currentUser.value.id}&include_relations=true`
    )
    if (response.ok) {
      asignaciones.value = await response.json()

      // Verificar cuáles ya están descargados
      await verificarPdfsOffline()

      // Descargar PDFs en background para modo offline (silencioso)
      await sincronizarPdfsOffline()
    }
  } catch (error) {
    console.error('Error al cargar asignaciones:', error)
    // Fallback a offline si hay error
    try {
      offlineAssignments.value = await offlineStorage.getAllAssignments()
      asignaciones.value = offlineAssignments.value.map(oa => ({
        id: oa.asignacionId,
        articulo_id: oa.articuloId,
        revisor_id: currentUser.value!.id,
        fecha_limite: oa.fechaLimite,
        articulo: {
          id: oa.articuloId,
          titulo: oa.titulo,
          estado: oa.estado,
          autor: { nombre: oa.autorNombre, email: '' }
        }
      }))
    } catch (offlineError) {
      console.error('Error cargando offline:', offlineError)
    }
  } finally {
    isLoadingAsignaciones.value = false
  }
}

const sincronizarPdfsOffline = async () => {
  console.log('[sincronizarPdfsOffline] Iniciando sincronización...')
  if (!offlineStorage.isOnline()) {
    console.log('[sincronizarPdfsOffline] Sin conexión, cancelando')
    return
  }

  isSyncingPdfs.value = true
  const asignacionesPendientes = asignaciones.value.filter(
    a => !a.articulo?.estado?.includes('Aceptado') && !a.articulo?.estado?.includes('Rechazado')
  )
  console.log(`[sincronizarPdfsOffline] ${asignacionesPendientes.length} asignaciones pendientes`)

  for (const asignacion of asignacionesPendientes) {
    try {
      // Verificar si ya está guardado
      const existingPdf = await offlineStorage.getPdf(asignacion.articulo_id)
      if (existingPdf) {
        console.log(`[sincronizarPdfsOffline] ${asignacion.articulo?.titulo} ya está guardado`)
        asignacion.pdfDescargado = true
        continue
      }

      console.log(`[sincronizarPdfsOffline] Descargando: ${asignacion.articulo?.titulo}`)

      // Guardar info de asignación
      await offlineStorage.storeAssignment({
        asignacionId: asignacion.id,
        articuloId: asignacion.articulo_id,
        titulo: asignacion.articulo?.titulo || 'Sin título',
        autorNombre: asignacion.articulo?.autor?.nombre || 'Desconocido',
        fechaLimite: asignacion.fecha_limite,
        estado: asignacion.articulo?.estado || 'Pendiente',
        synced: true
      })

      // Descargar y guardar PDF
      const success = await offlineStorage.downloadAndStorePdf(
        asignacion.articulo_id,
        asignacion.articulo?.titulo || 'articulo',
        API_BASE_URL
      )

      if (success) {
        console.log(`[sincronizarPdfsOffline] ✅ PDF guardado: ${asignacion.articulo?.titulo}`)
        asignacion.pdfDescargado = true
      } else {
        console.log(`[sincronizarPdfsOffline] ❌ Error descargando: ${asignacion.articulo?.titulo}`)
      }
    } catch (error) {
      console.error(`[sincronizarPdfsOffline] Error en ${asignacion.articulo_id}:`, error)
    }
  }

  isSyncingPdfs.value = false
  console.log('[sincronizarPdfsOffline] Sincronización completada')
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
  // Guardar el asignacionId en localStorage para referencia
  localStorage.setItem('current_revision_asignacion_id', asignacionId)
  router.push(`/reviewer/revision/${articuloId}`)
}

const tienePdfOffline = async (articuloId: string): Promise<boolean> => {
  const pdf = await offlineStorage.getPdf(articuloId)
  return !!pdf
}

const descargarParaOffline = async (asignacion: any) => {
  console.log('[descargarParaOffline] Iniciando descarga:', asignacion)
  asignacion.descargando = true
  try {
    // Verificar datos
    if (!asignacion.articulo_id) {
      console.error('[descargarParaOffline] No hay articulo_id')
      showToast('Error: No se encontró el ID del artículo', 'error')
      return
    }

    // Guardar info de asignación
    console.log('[descargarParaOffline] Guardando asignación...')
    await offlineStorage.storeAssignment({
      asignacionId: asignacion.id,
      articuloId: asignacion.articulo_id,
      titulo: asignacion.articulo?.titulo || 'Sin título',
      autorNombre: asignacion.articulo?.autor?.nombre || 'Desconocido',
      fechaLimite: asignacion.fecha_limite,
      estado: asignacion.articulo?.estado || 'Pendiente',
      synced: true
    })
    console.log('[descargarParaOffline] Asignación guardada')

    // Descargar PDF
    console.log('[descargarParaOffline] Descargando PDF:', asignacion.articulo_id)
    const success = await offlineStorage.downloadAndStorePdf(
      asignacion.articulo_id,
      asignacion.articulo?.titulo || 'articulo',
      API_BASE_URL
    )

    if (success) {
      asignacion.pdfDescargado = true
      showToast(`"${asignacion.articulo?.titulo}" guardado para revisión offline`, 'success')
    } else {
      showToast('Error al descargar el PDF - revisa la consola', 'error')
    }
  } catch (error) {
    console.error('[descargarParaOffline] Error:', error)
    showToast(`Error: ${error instanceof Error ? error.message : 'Desconocido'}`, 'error')
  } finally {
    asignacion.descargando = false
  }
}

// Verificar qué asignaciones tienen PDF descargado al cargar
const verificarPdfsOffline = async () => {
  for (const asignacion of asignaciones.value) {
    asignacion.pdfDescargado = await tienePdfOffline(asignacion.articulo_id)
  }
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
    showToast(`Artículo "${tituloArticulo.value}" registrado con éxito (ID: ${articuloId})`, 'success')
    cancelarFormulario()
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    showToast(`Error al registrar artículo: ${errorMessage}`, 'error')
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
    else { showToast('Por favor, seleccione un archivo PDF válido', 'error'); target.value = '' }
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
.dashboard { display: flex; min-height: 100vh; background: transparent; }
.sidebar { width: 220px; min-width: 220px; border-right: 1px solid var(--border-color); display: flex; flex-direction: column; background: var(--bg-sidebar); position: sticky; top: 0; height: 100vh; }
.sidebar-header { padding: 1.5rem 1.25rem 1rem; border-bottom: 1px solid var(--border-color); }
.brand { display: flex; align-items: center; gap: 0.45rem; }
.brand-icon { width: 16px; height: 16px; color: var(--text-strong); }
.brand-name { font-size: 0.9rem; font-weight: 700; color: var(--text-strong); letter-spacing: -0.02em; }
.sidebar-nav { flex: 1; display: flex; flex-direction: column; gap: 2px; padding: 1rem 0.75rem; }
.nav-item { display: flex; align-items: center; gap: 0.6rem; padding: 0.6rem 0.75rem; border-radius: 6px; font-size: 0.8rem; font-weight: 500; color: var(--text-muted); transition: all 0.15s ease; text-align: left; width: 100%; background: transparent; border: none; cursor: pointer; }
.nav-item svg { width: 15px; height: 15px; flex-shrink: 0; }
.nav-item:hover { background: var(--bg-card-hover); color: var(--text-normal); }
.nav-item.active { background: var(--bg-input); color: var(--text-strong); }
.sidebar-footer { padding: 1rem 0.75rem; border-top: 1px solid var(--border-color); display: flex; flex-direction: column; gap: 0.75rem; }
.relative-footer { position: relative; }
.user-chip-btn { text-align: left; width: 100%; border: none; background: transparent; cursor: pointer; padding: 0.5rem; border-radius: 6px; transition: background 0.2s; }
.user-chip-btn:hover { background: var(--bg-card-hover); }
.user-chip-btn.active { background: var(--bg-input); }
.user-chip-btn .chevron { width: 16px; height: 16px; color: var(--text-faint); margin-left: auto; transition: transform 0.2s; }
.user-chip-btn.active .chevron { transform: rotate(180deg); }
.user-chip { display: flex; align-items: center; gap: 0.6rem; }
.user-avatar { width: 28px; height: 28px; border-radius: 50%; background: var(--bg-input); border: 1px solid var(--border-hover); display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; color: var(--text-strong); flex-shrink: 0; }
.user-info { display: flex; flex-direction: column; min-width: 0; }
.user-name { font-size: 0.8rem; font-weight: 600; color: var(--text-strong); }
.user-role { font-size: 0.7rem; color: var(--text-muted); }

.user-menu-dropdown { position: absolute; bottom: calc(100% + 5px); left: 0.75rem; right: 0.75rem; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 8px; padding: 0.5rem; box-shadow: 0 4px 12px rgba(0,0,0,0.1); display: flex; flex-direction: column; gap: 0.25rem; z-index: 50; }
[data-theme="dark"] .user-menu-dropdown { box-shadow: 0 4px 12px rgba(0,0,0,0.4); }
.menu-item { display: flex; align-items: center; gap: 0.5rem; padding: 0.6rem 0.75rem; width: 100%; border: none; background: transparent; text-align: left; font-size: 0.8rem; color: var(--text-normal); font-weight: 500; cursor: pointer; border-radius: 4px; transition: background 0.2s; }
.menu-item svg { width: 15px; height: 15px; color: var(--text-muted); }
.menu-item:hover { background: var(--bg-card-hover); color: var(--text-strong); }
.menu-item.text-danger { color: var(--stat-rechazado); }
.menu-item.text-danger svg { color: var(--stat-rechazado); }
.menu-item.text-danger:hover { background: rgba(248, 113, 113, 0.1); }

.main { flex: 1; display: flex; flex-direction: column; overflow-y: auto; }
.topbar { display: flex; align-items: flex-start; justify-content: space-between; padding: 2rem 2.5rem 1.5rem; border-bottom: 1px solid var(--border-color); }
.page-title { font-size: 1.35rem; font-weight: 700; letter-spacing: -0.02em; color: var(--text-strong); margin-bottom: 0.2rem; }
.page-sub { font-size: 0.8rem; color: var(--text-faint); }
.stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); border-bottom: 1px solid var(--border-color); }
.stat-card { padding: 1.75rem 2rem; border-right: 1px solid var(--border-color); display: flex; flex-direction: column; gap: 0.5rem; }
.stat-card:last-child { border-right: none; }
.stat-header { display: flex; align-items: center; gap: 0.45rem; margin-bottom: 0.25rem; }
.stat-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.stat-dot.pendiente  { background: var(--stat-revision); }
.stat-dot.progreso   { background: var(--stat-progreso); }
.stat-dot.completado { background: var(--stat-aceptado); }
.stat-label { font-size: 0.72rem; font-weight: 500; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
.stat-value { font-size: 2.4rem; font-weight: 800; letter-spacing: -0.05em; color: var(--text-strong); line-height: 1; }
.stat-desc { font-size: 0.75rem; color: var(--text-faint); line-height: 1.4; margin-top: 0.2rem; }
.section { padding: 2rem 2.5rem; flex: 1; }
.section-title { font-size: 0.8rem; font-weight: 600; color: var(--text-faint); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 1.5rem; }
.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 4rem 2rem; gap: 0.75rem; text-align: center; }
.empty-icon { width: 44px; height: 44px; color: var(--border-hover); margin-bottom: 0.5rem; }
.empty-icon svg { width: 100%; height: 100%; }
.empty-state h3 { font-size: 0.95rem; font-weight: 600; color: var(--text-faint); }
.empty-state p { font-size: 0.82rem; color: var(--text-muted); max-width: 280px; line-height: 1.6; }
.form-center { flex: 1; display: flex; align-items: center; justify-content: center; padding: 2.5rem 1.5rem; }
.form-card { width: 100%; max-width: 560px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 10px; padding: 2.5rem; }
.articulo-form { display: flex; flex-direction: column; gap: 1.5rem; }
.form-group { display: flex; flex-direction: column; gap: 0.5rem; }
.form-group label { font-size: 0.8rem; font-weight: 500; color: var(--text-normal); display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap; }
.field-hint { font-size: 0.72rem; color: var(--text-faint); font-weight: 400; }
.form-input { width: 100%; padding: 0.7rem 0.9rem; border: 1px solid var(--border-color); border-radius: 6px; background: var(--bg-input); color: var(--text-strong); font-size: 0.875rem; font-family: inherit; transition: border-color 0.15s; }
.form-input.mono { font-family: 'SF Mono', 'Fira Code', monospace; font-size: 0.8rem; }
.form-input:focus { outline: none; border-color: var(--border-focus); }
.form-input::placeholder { color: var(--text-muted); }
.file-upload-container { position: relative; }
.file-input { position: absolute; inset: 0; opacity: 0; cursor: pointer; z-index: 1; }
.file-upload-label { display: flex; flex-direction: column; align-items: center; gap: 0.6rem; padding: 1.75rem 1.5rem; border: 1px dashed var(--border-color); border-radius: 6px; background: var(--bg-base); text-align: center; cursor: pointer; transition: border-color 0.15s; }
.file-upload-label:hover { border-color: var(--border-focus); }
.upload-icon { width: 26px; height: 26px; color: var(--border-focus); }
.upload-icon.success { color: var(--stat-aceptado); }
.file-placeholder { font-size: 0.8rem; color: var(--text-muted); }
.file-selected { font-size: 0.8rem; color: var(--stat-aceptado); }
.form-actions { display: flex; justify-content: flex-end; gap: 0.75rem; padding-top: 0.25rem; }
.btn-primary { display: flex; align-items: center; gap: 0.4rem; background: var(--btn-primary-bg); color: var(--btn-primary-text); font-size: 0.825rem; font-weight: 600; padding: 0.6rem 1.2rem; border-radius: 6px; border: none; cursor: pointer; transition: opacity 0.15s; white-space: nowrap; }
.btn-primary:hover { opacity: 0.88; }
.btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }
.btn-ghost { background: transparent; color: var(--btn-ghost-text); font-size: 0.825rem; font-weight: 500; padding: 0.6rem 1rem; border-radius: 6px; border: 1px solid var(--border-color); cursor: pointer; transition: color 0.15s, border-color 0.15s; }
.btn-ghost:hover { color: var(--btn-ghost-hover-text); border-color: var(--border-focus); background: var(--btn-ghost-hover-bg); }
@keyframes spin { to { transform: rotate(360deg); } }
.spinner { width: 14px; height: 14px; animation: spin 0.8s linear infinite; }

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  gap: 1rem;
  color: var(--text-faint);
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
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  transition: border-color 0.15s;
}

.assignment-card:hover {
  border-color: var(--border-focus);
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
  color: var(--stat-revision);
}

.assignment-status.en-revisión,
.assignment-status.en-revision {
  background: rgba(96, 165, 250, 0.1);
  color: var(--stat-progreso);
}

.assignment-status.aceptado {
  background: rgba(74, 222, 128, 0.1);
  color: var(--stat-aceptado);
}

.assignment-status.rechazado {
  background: rgba(239, 68, 68, 0.1);
  color: var(--stat-rechazado);
}

.assignment-info {
  flex: 1;
  min-width: 0;
}

.assignment-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-strong);
  margin-bottom: 0.35rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.assignment-meta {
  font-size: 0.78rem;
  color: var(--text-muted);
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
  color: var(--text-faint);
}

/* Acciones de asignación */
.assignment-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.btn-secondary {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: transparent;
  color: var(--text-muted);
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.5rem 0.875rem;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: all 0.15s;
}

.btn-secondary:hover:not(:disabled) {
  background: var(--bg-card-hover);
  color: var(--text-normal);
  border-color: var(--border-hover);
}

.btn-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary svg {
  width: 14px;
  height: 14px;
}

.offline-badge {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--stat-aceptado);
  background: rgba(74, 222, 128, 0.1);
  padding: 0.4rem 0.75rem;
  border-radius: 6px;
}

.offline-badge svg {
  width: 12px;
  height: 12px;
}

.offline-badge-small {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.65rem;
  font-weight: 600;
  color: var(--stat-aceptado);
  background: rgba(74, 222, 128, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.offline-badge-small svg {
  width: 10px;
  height: 10px;
}

/* Indicador de conexión */
.connection-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  margin: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
}

.connection-status svg {
  width: 14px;
  height: 14px;
}

.connection-status.online {
  background: rgba(74, 222, 128, 0.1);
  color: #4ade80;
  border: 1px solid rgba(74, 222, 128, 0.2);
}

.connection-status.offline {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

@media (max-width: 768px) {
  .dashboard { flex-direction: column; }
  .sidebar { width: 100%; min-width: unset; height: auto; position: static; border-right: none; border-bottom: 1px solid var(--border-color); }
  .sidebar-nav { flex-direction: row; overflow-x: auto; padding: 0.5rem; }
  .nav-item { white-space: nowrap; }
  .topbar { flex-direction: column; gap: 1rem; padding: 1.25rem; }
  .section { padding: 1.5rem 1.25rem; }
  .stats-grid { grid-template-columns: 1fr 1fr; }
  .form-center { padding: 1.5rem 1rem; }
  .form-card { padding: 1.5rem; }
}
</style>
