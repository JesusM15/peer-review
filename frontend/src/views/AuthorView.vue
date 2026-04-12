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
        <button class="nav-item" :class="{ active: vistaActiva === 'overview' }" id="nav-overview-autor" @click="vistaActiva = 'overview'">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Overview
        </button>
        <button class="nav-item" :class="{ active: vistaActiva === 'borradores' }" id="nav-borradores" @click="vistaActiva = 'borradores'">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Borradores
        </button>
        <button class="nav-item" :class="{ active: vistaActiva === 'nuevo' }" id="nav-registrar-articulo" @click="vistaActiva = 'nuevo'">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Registrar artículo
        </button>
      </nav>

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
           <button class="menu-item text-danger" id="btn-salir-autor" @click="logout">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Cerrar sesión
           </button>
        </div>
        <button class="user-chip user-chip-btn" @click="showUserMenu = !showUserMenu" :class="{ active: showUserMenu }">
          <div class="user-avatar">{{ userInitial }}</div>
          <div class="user-info">
            <span class="user-name">{{ currentUser?.nombre || 'Autor' }}</span>
            <span class="user-role">{{ currentUser?.email || 'autor@diego.edu' }}</span>
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
            <h1 class="page-title">Mis artículos</h1>
            <p class="page-sub">Resumen del estado de tus envíos</p>
          </div>
          <button class="btn-primary" id="btn-nuevo-desde-overview" @click="vistaActiva = 'nuevo'">
            + Nuevo artículo
          </button>
        </header>

        <!-- Stat cards por estado -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-header">
              <span class="stat-dot borrador"></span>
              <span class="stat-label">Borrador</span>
            </div>
            <span class="stat-value">{{ stats.borrador }}</span>
            <p class="stat-desc">Artículos guardados aún no enviados</p>
          </div>

          <div class="stat-card">
            <div class="stat-header">
              <span class="stat-dot revision"></span>
              <span class="stat-label">En revisión</span>
            </div>
            <span class="stat-value">{{ stats.enRevision }}</span>
            <p class="stat-desc">Artículos asignados a revisores</p>
          </div>

          <div class="stat-card">
            <div class="stat-header">
              <span class="stat-dot aceptado"></span>
              <span class="stat-label">Aceptados</span>
            </div>
            <span class="stat-value">{{ stats.aceptados }}</span>
            <p class="stat-desc">Artículos aprobados para publicación</p>
          </div>

          <div class="stat-card">
            <div class="stat-header">
              <span class="stat-dot rechazado"></span>
              <span class="stat-label">Rechazados</span>
            </div>
            <span class="stat-value">{{ stats.rechazados }}</span>
            <p class="stat-desc">Artículos que requieren revisión mayor</p>
          </div>
        </div>

        <!-- Sección de actividad reciente -->
        <div class="section">
          <h2 class="section-title">Actividad reciente</h2>
          <div v-if="articulos.length === 0" class="empty-state">
            <div class="empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3>Sin artículos todavía</h3>
            <p>Crea tu primer artículo para iniciar el proceso de revisión por pares.</p>
            <button class="btn-primary small" id="btn-crear-primer-articulo" @click="vistaActiva = 'nuevo'">
              Crear artículo
            </button>
          </div>
          <div v-else class="articulos-list">
            <div v-for="articulo in articulosRecientes" :key="articulo.id" class="articulo-item" @click="verArticulo(articulo.id)">
              <div class="articulo-info">
                <h3 class="articulo-titulo">{{ articulo.titulo }}</h3>
                <div class="articulo-meta">
                  <span class="estado-badge" :class="articulo.estado.toLowerCase().replace(' ', '-')">{{ articulo.estado }}</span>
                  <span class="fecha-creacion">{{ formatDate(articulo.createdAt) }}</span>
                </div>
              </div>
              <div class="articulo-actions">
                <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M9 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- ─── VISTA BORRADORES ─────────────────────────────── -->
      <template v-if="vistaActiva === 'borradores'">
        <header class="topbar">
          <div>
            <h1 class="page-title">Mis borradores</h1>
            <p class="page-sub">Artículos guardados como borrador</p>
          </div>
          <button class="btn-primary" id="btn-nuevo-desde-borradores" @click="vistaActiva = 'nuevo'">
            + Nuevo artículo
          </button>
        </header>

        <div class="section">
          <div v-if="loadingArticulos" class="loading-state">
            <div class="spinner"></div>
            <p>Cargando borradores...</p>
          </div>
          <div v-else-if="borradores.length === 0" class="empty-state">
            <div class="empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3>No hay borradores</h3>
            <p>No tienes artículos guardados como borrador.</p>
            <button class="btn-primary small" id="btn-crear-borrador" @click="vistaActiva = 'nuevo'">
              Crear borrador
            </button>
          </div>
          <div v-else class="articulos-list">
            <div v-for="articulo in borradores" :key="articulo.id" class="articulo-item" @click="verArticulo(articulo.id)">
              <div class="articulo-info">
                <h3 class="articulo-titulo">{{ articulo.titulo }}</h3>
                <div class="articulo-meta">
                  <span class="estado-badge borrador">{{ articulo.estado }}</span>
                  <span class="fecha-creacion">{{ formatDate(articulo.createdAt) }}</span>
                </div>
              </div>
              <div class="articulo-actions">
                <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M9 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- ─── VISTA ARTÍCULO DETALLE ───────────────────────── -->
      <template v-if="vistaActiva === 'articulo'">
        <header class="topbar">
          <div class="flex items-center gap-3">
            <button class="btn-back" @click="vistaActiva = 'borradores'">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M15 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Volver
            </button>
            <div>
              <h1 class="page-title">{{ articuloActual?.titulo || 'Artículo' }}</h1>
              <p class="page-sub">Vista previa del documento</p>
            </div>
          </div>
        </header>

        <div class="articulo-detail-container">
          <div class="pdf-viewer">
            <div v-if="loadingPdf" class="loading-state">
              <div class="spinner"></div>
              <p>Cargando PDF...</p>
            </div>
            <div v-else-if="!articuloActual?.pdf_url" class="empty-state">
              <div class="empty-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                  <path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <h3>No hay PDF disponible</h3>
              <p>Este artículo no tiene un archivo PDF asociado.</p>
            </div>
            <div v-else class="pdf-container">
              <iframe :src="articuloActual.pdf_url" class="pdf-frame" title="PDF del artículo"></iframe>
            </div>
          </div>
          <div class="revision-panel">
            <div class="panel-placeholder">
              <h3>Formulario de revisión</h3>
              <p>Esta sección estará disponible en futuras versiones para agregar formularios de revisión.</p>
            </div>
          </div>
        </div>
      </template>

      <!-- ─── FORMULARIO NUEVO ARTÍCULO ────────────── -->
      <template v-if="vistaActiva === 'nuevo'">
        <header class="topbar">
          <div>
            <h1 class="page-title">Registrar artículo</h1>
            <p class="page-sub">Completa el formulario para enviar tu artículo al sistema</p>
          </div>
        </header>

        <!-- Formulario centrado en pantalla -->
        <div class="form-center">
          <div class="form-card">
            <form @submit.prevent="submitArticulo" class="articulo-form" id="form-nuevo-articulo">

              <div class="form-group">
                <label for="titulo">Título del artículo</label>
                <input type="text" id="titulo" v-model="tituloArticulo" placeholder="Ingrese el título del artículo" required class="form-input"/>
              </div>

              <div class="form-group">
                <label for="pdfFile">Documento PDF</label>
                <div class="file-upload-container">
                  <input type="file" id="pdfFile" @change="handleFileUpload" accept=".pdf" required class="file-input"/>
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
                <button type="button" class="btn-ghost" id="btn-cancelar-form" @click="cancelarFormulario">Cancelar</button>
                <button type="submit" class="btn-primary" id="btn-submit-articulo" :disabled="isLoading">
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
// ── Lógica original intacta + integración localStorage ─────────────────────
import { useRouter } from 'vue-router'
import { ref, onMounted, computed } from 'vue'
import { useTheme } from '../composables/useTheme'
import { useToast } from '../composables/useToast'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const { isDark, toggleTheme } = useTheme()
const { showToast } = useToast()
const authStore = useAuthStore()

const showUserMenu = ref(false)

const vistaActiva = ref<string>('overview')

// ─── Usuario de sesión (desde Pinia store) ───────────────────────────────
const currentUser = computed(() => authStore.user)

// ─── Artículos ─────────────────────────────────────────────────────────────
interface Articulo {
  id: string
  titulo: string
  estado: string
  autor_id: string
  pdf_url: string
  keywords: string[]
  createdAt?: string
  updatedAt?: string
}

const articulos = ref<Articulo[]>([])
const loadingArticulos = ref<boolean>(false)
const articuloActual = ref<Articulo | null>(null)
const loadingPdf = ref<boolean>(false)

// ─── Artículos recientes (últimos 5) ─────────────────────────────────────────
const articulosRecientes = computed(() => {
  return articulos.value
    .slice()
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    .slice(0, 5)
})

// ─── Estadísticas computadas ────────────────────────────────────────────────
const stats = computed(() => {
  return {
    borrador: articulos.value.filter(a => a.estado === 'Borrador').length,
    enRevision: articulos.value.filter(a => a.estado === 'En Revisión').length,
    aceptados: articulos.value.filter(a => a.estado === 'Aceptado').length,
    rechazados: articulos.value.filter(a => a.estado === 'Rechazado').length
  }
})

onMounted(async () => {
  // Verificar autenticación
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  
  // Cargar artículos del usuario
  await cargarArticulos()
})

const userInitial = computed(() =>
  currentUser.value?.nombre ? currentUser.value.nombre[0].toUpperCase() : 'A'
)

// ─── Logout ─────────────────────────────────────────────────────────
const logout = () => {
  authStore.logout()
  router.push('/login')
}

// ─── Formulario ─────────────────────────────────────────────────────────
const message = ref<string>('')
const status = ref<string>('idle')
const mostrarFormulario = ref<boolean>(true)
const tituloArticulo = ref<string>('')
const archivoPdf = ref<File | null>(null)
const isLoading = ref<boolean>(false)

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// ─── Funciones para manejo de artículos ─────────────────────────────────────
const cargarArticulos = async () => {
  if (!currentUser.value?.id) return
  
  try {
    loadingArticulos.value = true
    const response = await fetch(`${API_BASE_URL}/articulos?autor_id=${currentUser.value.id}&include_relations=true`)
    
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`)
    
    const data = await response.json()
    
    // Construir URLs completas para los PDFs
    const baseUrl = API_BASE_URL.replace('/api', '')
    articulos.value = data.map((articulo: any) => ({
      ...articulo,
      pdf_url: articulo.pdf_url ? `${baseUrl}${articulo.pdf_url}` : ''
    }))
    
    console.log('Artículos cargados:', articulos.value)
  } catch (error) {
    console.error('Error al cargar artículos:', error)
    articulos.value = []
  } finally {
    loadingArticulos.value = false
  }
}

const verArticulo = async (articuloId: string) => {
  try {
    loadingPdf.value = true
    vistaActiva.value = 'articulo'
    
    const response = await fetch(`${API_BASE_URL}/articulos/${articuloId}?include_relations=true`)
    
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`)
    
    const data = await response.json()
    
    // Construir URL completa para el PDF
    const baseUrl = API_BASE_URL.replace('/api', '')
    if (data.pdf_url) {
      data.pdf_url = `${baseUrl}${data.pdf_url}`
    }
    
    articuloActual.value = data
    console.log('Artículo cargado:', data)
  } catch (error) {
    console.error('Error al cargar artículo:', error)
    showToast('Error al cargar el artículo', 'error')
    vistaActiva.value = 'borradores'
  } finally {
    loadingPdf.value = false
  }
}

const formatDate = (dateString?: string) => {
  if (!dateString) return 'Fecha desconocida'
  
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch {
    return 'Fecha inválida'
  }
}

const goBack = () => router.push('/')

const submitArticulo = async () => {
  try {
    isLoading.value = true
    const articuloId = generateUUID()
    const autorIdFinal = currentUser.value?.id || generateUUID()
    
    // Usar FormData para subir archivo
    const formData = new FormData()
    formData.append('id', articuloId)
    formData.append('titulo', tituloArticulo.value)
    formData.append('autor_id', autorIdFinal)
    formData.append('keywords', JSON.stringify([]))
    
    if (archivoPdf.value) {
      formData.append('pdf', archivoPdf.value)
    }
    
    console.log('Enviando artículo con PDF:', articuloId, archivoPdf.value?.name)
    const response = await fetch(`${API_BASE_URL}/articulos`, {
      method: 'POST',
      body: formData // No Content-Type header needed for FormData
    })
    
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`)
    const result = await response.json()
    console.log('Artículo registrado:', result)
    showToast(`Artículo "${tituloArticulo.value}" registrado con éxito`, 'success')
    tituloArticulo.value = ''
    archivoPdf.value = null
    
    // Recargar artículos y volver a borradores
    await cargarArticulos()
    vistaActiva.value = 'borradores'
  } catch (error) {
    console.error('Error al registrar artículo:', error)
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    showToast(`Error al registrar artículo: ${errorMessage}`, 'error')
  } finally {
    isLoading.value = false
  }
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

const cancelarFormulario = () => {
  tituloArticulo.value = ''
  archivoPdf.value = null
}
</script>

<style scoped>
/* ─── LAYOUT ──────────────────────────────────────── */
.dashboard { display: flex; min-height: 100vh; background: transparent; }

/* ─── SIDEBAR ─────────────────────────────────────── */
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

/* ─── MAIN ────────────────────────────────────────── */
.main { flex: 1; display: flex; flex-direction: column; overflow-y: auto; }

/* ─── TOPBAR ──────────────────────────────────────── */
.topbar { display: flex; align-items: flex-start; justify-content: space-between; padding: 2rem 2.5rem 1.5rem; border-bottom: 1px solid var(--border-color); }
.page-title { font-size: 1.35rem; font-weight: 700; letter-spacing: -0.02em; color: var(--text-strong); margin-bottom: 0.2rem; }
.page-sub { font-size: 0.8rem; color: var(--text-faint); }

/* ─── STAT CARDS (OVERVIEW) ───────────────────────── */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border-bottom: 1px solid var(--border-color);
}

.stat-card {
  padding: 1.75rem 2rem;
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.stat-card:last-child { border-right: none; }

.stat-header {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  margin-bottom: 0.25rem;
}

.stat-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.stat-dot.borrador  { background: var(--stat-borrador); }
.stat-dot.revision  { background: var(--stat-revision); }
.stat-dot.aceptado  { background: var(--stat-aceptado); }
.stat-dot.rechazado { background: var(--stat-rechazado); }

.stat-label { font-size: 0.72rem; font-weight: 500; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
.stat-value { font-size: 2.4rem; font-weight: 800; letter-spacing: -0.05em; color: var(--text-strong); line-height: 1; }
.stat-desc { font-size: 0.75rem; color: var(--text-faint); line-height: 1.4; margin-top: 0.2rem; }

/* ─── SECCIÓN GENERAL ─────────────────────────────── */
.section { padding: 2rem 2.5rem; flex: 1; }
.section-title { font-size: 0.8rem; font-weight: 600; color: var(--text-faint); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 1.5rem; }

/* ─── EMPTY STATE ─────────────────────────────────── */
.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 4rem 2rem; gap: 0.75rem; text-align: center; }
.empty-icon { width: 44px; height: 44px; color: var(--border-hover); margin-bottom: 0.5rem; }
.empty-icon svg { width: 100%; height: 100%; }
.empty-state h3 { font-size: 0.95rem; font-weight: 600; color: var(--text-faint); }
.empty-state p { font-size: 0.82rem; color: var(--text-muted); max-width: 280px; line-height: 1.6; }

/* ─── LOADING STATE ─────────────────────────────────── */
.loading-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 4rem 2rem; gap: 1rem; text-align: center; }
.loading-state .spinner { width: 32px; height: 32px; color: var(--text-muted); }
.loading-state p { font-size: 0.82rem; color: var(--text-muted); }

/* ─── ARTÍCULOS LIST ─────────────────────────────────── */
.articulos-list { display: flex; flex-direction: column; gap: 0.75rem; }
.articulo-item { display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 1.5rem; border: 1px solid var(--border-color); border-radius: 8px; background: var(--bg-card); cursor: pointer; transition: all 0.15s ease; }
.articulo-item:hover { border-color: var(--border-focus); background: var(--bg-card-hover); }
.articulo-info { flex: 1; min-width: 0; }
.articulo-titulo { font-size: 0.95rem; font-weight: 600; color: var(--text-strong); margin-bottom: 0.5rem; line-height: 1.4; }
.articulo-meta { display: flex; align-items: center; gap: 0.75rem; }
.estado-badge { font-size: 0.7rem; font-weight: 500; padding: 0.25rem 0.5rem; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.05em; }
.estado-badge.borrador { background: var(--bg-input); color: var(--text-muted); }
.estado-badge.en-revision { background: rgba(229, 162, 76, 0.15); color: var(--stat-revision); }
.estado-badge.aceptado { background: rgba(74, 222, 128, 0.15); color: var(--stat-aceptado); }
.estado-badge.rechazado { background: rgba(248, 113, 113, 0.15); color: var(--stat-rechazado); }
.fecha-creacion { font-size: 0.75rem; color: var(--text-muted); }
.articulo-actions { display: flex; align-items: center; }
.arrow-icon { width: 16px; height: 16px; color: var(--text-faint); transition: color 0.15s; }
.articulo-item:hover .arrow-icon { color: var(--text-muted); }

/* ─── ARTÍCULO DETAIL ───────────────────────────────── */
.articulo-detail-container { display: flex; flex: 1; gap: 0; height: calc(100vh - 120px); }
.pdf-viewer { flex: 1; display: flex; flex-direction: column; background: var(--bg-card); border-right: 1px solid var(--border-color); }
.revision-panel { width: 400px; background: var(--bg-sidebar); border-left: 1px solid var(--border-color); display: flex; align-items: center; justify-content: center; }
.panel-placeholder { text-align: center; padding: 2rem; }
.panel-placeholder h3 { font-size: 1rem; font-weight: 600; color: var(--text-faint); margin-bottom: 0.5rem; }
.panel-placeholder p { font-size: 0.8rem; color: var(--text-muted); line-height: 1.5; }

.pdf-container { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
.pdf-frame { flex: 1; width: 100%; height: 100%; border: none; background: #fff; }

/* ─── BACK BUTTON ───────────────────────────────────── */
.btn-back { display: flex; align-items: center; gap: 0.5rem; background: transparent; color: var(--text-faint); font-size: 0.8rem; font-weight: 500; padding: 0.5rem 0.75rem; border-radius: 6px; border: 1px solid var(--border-color); cursor: pointer; transition: all 0.15s; }
.btn-back:hover { color: var(--text-muted); border-color: var(--border-focus); background: var(--bg-input); }
.btn-back svg { width: 14px; height: 14px; }

/* ─── FLEX UTILITIES ─────────────────────────────────── */
.flex { display: flex; }
.items-center { align-items: center; }
.gap-3 { gap: 0.75rem; }

/* ─── FORM CENTRADO ───────────────────────────────── */
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

/* ─── BOTONES ─────────────────────────────────────── */
.btn-primary { display: flex; align-items: center; gap: 0.4rem; background: var(--btn-primary-bg); color: var(--btn-primary-text); font-size: 0.825rem; font-weight: 600; padding: 0.6rem 1.2rem; border-radius: 6px; border: none; cursor: pointer; transition: opacity 0.15s; white-space: nowrap; }
.btn-primary:hover { opacity: 0.88; }
.btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }
.btn-primary.small { font-size: 0.8rem; padding: 0.5rem 1rem; margin-top: 0.75rem; }
.btn-ghost { background: transparent; color: var(--btn-ghost-text); font-size: 0.825rem; font-weight: 500; padding: 0.6rem 1rem; border-radius: 6px; border: 1px solid var(--border-color); cursor: pointer; transition: all 0.15s; }
.btn-ghost:hover { color: var(--btn-ghost-hover-text); border-color: var(--border-focus); background: var(--btn-ghost-hover-bg); }

@keyframes spin { to { transform: rotate(360deg); } }
.spinner { width: 14px; height: 14px; animation: spin 0.8s linear infinite; }

/* ─── RESPONSIVE ──────────────────────────────────── */
@media (max-width: 900px) { 
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .revision-panel { width: 300px; }
}
@media (max-width: 768px) {
  .dashboard { flex-direction: column; }
  .sidebar { width: 100%; min-width: unset; height: auto; position: static; border-right: none; border-bottom: 1px solid var(--border-color); }
  .sidebar-nav { flex-direction: row; overflow-x: auto; padding: 0.5rem; }
  .nav-item { white-space: nowrap; }
  .topbar { flex-direction: column; gap: 1rem; padding: 1.25rem; }
  .section { padding: 1.5rem 1.25rem; }
  .form-center { padding: 1.5rem 1rem; }
  .form-card { padding: 1.5rem; }
  .articulo-detail-container { flex-direction: column; height: auto; }
  .pdf-viewer { height: 60vh; border-right: none; border-bottom: 1px solid var(--border-color); }
  .revision-panel { width: 100%; height: 30vh; border-left: none; border-top: 1px solid var(--border-color); }
}
</style>
