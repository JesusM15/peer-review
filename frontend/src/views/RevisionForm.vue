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
        <button class="nav-item" @click="goBack">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Overview
        </button>
        <button class="nav-item active">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Revisión
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
           <button class="menu-item text-danger" @click="logout">
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
      <header class="topbar">
        <div>
          <h1 class="page-title">
            {{ isReadOnly ? 'Consulta de Revisión' : 'Revisión de Artículo' }}
            <span v-if="isOffline" class="offline-badge-pill">OFFLINE</span>
            <span v-if="isReadOnly" class="read-only-badge">SÓLO LECTURA</span>
          </h1>
          <p class="page-sub">{{ articulo?.titulo || 'Cargando artículo...' }}</p>
        </div>
      </header>

      <div class="review-layout">
        <!-- Panel de PDF (Izquierda) -->
        <div class="pdf-panel">
          <div v-if="loadingPdf" class="panel-loading">
            <div class="spinner"></div>
            <p>Cargando documento...</p>
          </div>
          <iframe v-else-if="pdfBlobUrl || articulo?.pdf_url" :src="pdfBlobUrl || articulo?.pdf_url" class="pdf-viewer"></iframe>
          <div v-else class="panel-empty">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
              <path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <p>PDF no disponible</p>
          </div>
        </div>

        <!-- Panel de Formulario (Derecha) -->
        <div class="form-panel">
          <div class="form-scrollable-area">
            <div class="autosave-bar" v-if="hasStartedTyping && !isReadOnly">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 13l4 4L19 7" />
              </svg>
              Progreso guardado automáticamente
            </div>

            <form @submit.prevent="submitRevision" class="revision-form-container">
              <!-- Secciones del Formulario -->
              <div v-for="(label, key) in sections" :key="key" class="form-section">
                <div class="section-top">
                  <h3 class="section-name">{{ label }}</h3>
                  <span class="section-tag" v-if="!isReadOnly">Requerido</span>
                </div>
                <p class="section-instruction">{{ sectionDescriptions[key] }}</p>
                <div class="textarea-container">
                  <textarea 
                    v-model="revision[key as keyof Revision]" 
                    :placeholder="isReadOnly ? 'Sin comentarios' : 'Escribe aquí tus comentarios sobre ' + label.toLowerCase() + '...'"
                    :disabled="isReadOnly"
                    rows="4"
                  ></textarea>
                </div>
              </div>

              <!-- Comentarios Generales -->
              <div class="form-section highlight-section">
                <h3 class="section-name">Comentarios Generales</h3>
                <p class="section-instruction">Observaciones generales finales.</p>
                <div class="textarea-container">
                  <textarea 
                    v-model="revision.comentariosGenerales" 
                    :placeholder="isReadOnly ? 'Sin comentarios' : 'Escribe cualquier observación adicional...'"
                    :disabled="isReadOnly"
                    rows="5"
                  ></textarea>
                </div>
              </div>

              <!-- Decisión Final -->
              <div class="conclusion-panel">
                <h3 class="conclusion-title">{{ isReadOnly ? 'Evaluación Final' : 'Veredicto Final' }}</h3>
                <p class="conclusion-sub">{{ isReadOnly ? 'Resultado de tu revisión' : 'Selecciona el estado en el que dejas el artículo' }}</p>
                
                <div class="verdict-options" :class="{ 'pointer-none': isReadOnly }">
                  <button 
                    type="button"
                    class="verdict-card accepted"
                    :class="{ selected: decision === 'aceptado' }"
                    @click="!isReadOnly && (decision = 'aceptado')"
                  >
                    <div class="verdict-icon">✓</div>
                    <div class="verdict-label">Aceptado</div>
                  </button>

                  <button 
                    type="button"
                    class="verdict-card revision"
                    :class="{ selected: decision === 'revision' }"
                    @click="!isReadOnly && (decision = 'revision')"
                  >
                    <div class="verdict-icon">✎</div>
                    <div class="verdict-label">Revisión</div>
                  </button>

                  <button 
                    type="button"
                    class="verdict-card rejected"
                    :class="{ selected: decision === 'rechazado' }"
                    @click="!isReadOnly && (decision = 'rechazado')"
                  >
                    <div class="verdict-icon">✕</div>
                    <div class="verdict-label">Rechazado</div>
                  </button>
                </div>

                <div class="action-footer">
                  <button type="button" class="btn-cancel" @click="goBack">{{ isReadOnly ? 'Volver' : 'Cancelar' }}</button>
                  <button 
                    v-if="!isReadOnly"
                    type="submit" 
                    class="btn-submit-main" 
                    :disabled="!decision || isSubmitting"
                  >
                    <div v-if="isSubmitting" class="loader-white"></div>
                    {{ isSubmitting ? 'Enviando...' : 'Finalizar revisión' }}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useToast } from '../composables/useToast'
import { useOfflineStorage } from '../composables/useOfflineStorage'
import { useSyncEngine } from '../composables/useSyncEngine'
import { useTheme } from '../composables/useTheme'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const route = useRoute()
const { showToast } = useToast()
const offlineStorage = useOfflineStorage()
const syncEngine = useSyncEngine()
const { isDark, toggleTheme } = useTheme()
const authStore = useAuthStore()

const showUserMenu = ref(false)
const hasStartedTyping = ref(false)
const isReadOnly = ref(false)

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

interface CurrentUser { id: string; email: string; nombre: string; rol: string }
interface Articulo {
  id: string
  titulo: string
  estado: string
  pdf_url?: string
}

interface Revision {
  introduccion: string
  metodologia: string
  resultados: string
  discusion: string
  conclusiones: string
  referencias: string
  comentariosGenerales: string
}

const sections = {
  introduccion: 'Introducción',
  metodologia: 'Metodología',
  resultados: 'Resultados',
  discusion: 'Discusión',
  conclusiones: 'Conclusiones',
  referencias: 'Referencias'
}

const sectionDescriptions: Record<string, string> = {
  introduccion: 'Evalúa la claridad del planteamiento del problema y la importancia del estudio.',
  metodologia: 'Analiza si el diseño del estudio es adecuado y si los métodos están bien descritos.',
  resultados: 'Verifica si los resultados son claros, coherentes y están bien sustentados.',
  discusion: 'Evalúa si la interpretación de los resultados es razonable y se compara con otros estudios.',
  conclusiones: 'Evalúa si las conclusiones responden a los objetivos y son coherentes con los resultados.',
  referencias: 'Evalúa la actualidad, relevancia y formato de las referencias bibliográficas.'
}

const currentUser = ref<CurrentUser | null>(null)
const articulo = ref<Articulo | null>(null)
const isSubmitting = ref(false)
const loadingPdf = ref(false)
const decision = ref<'aceptado' | 'revision' | 'rechazado' | null>(null)
const isOffline = ref(false)
const pdfBlobUrl = ref<string | null>(null)
const asignacionId = ref<string | null>(null)

const revision = ref<Revision>({
  introduccion: '',
  metodologia: '',
  resultados: '',
  discusion: '',
  conclusiones: '',
  referencias: '',
  comentariosGenerales: ''
})

onMounted(async () => {
  const raw = localStorage.getItem('user')
  if (raw) currentUser.value = JSON.parse(raw)

  asignacionId.value = localStorage.getItem('current_revision_asignacion_id')

  const articuloIdParam = route.params.id as string
  if (articuloIdParam) {
    // 1. Cargamos datos básicos del artículo
    await fetchArticulo(articuloIdParam)
    
    // 2. Si el artículo ya está en un estado final, activamos lectura de inmediato
    if (articulo.value?.estado === 'Aceptado' || articulo.value?.estado === 'Rechazado') {
      isReadOnly.value = true
    }

    // 3. Buscamos si ya existe revisión del usuario
    const existingRev = await fetchExistingRevision(articuloIdParam)
    
    // 4. Si existe revisión, forzamos lectura (por seguridad)
    if (existingRev) {
      isReadOnly.value = true
      console.log('[onMounted] Modo lectura detectado por revisión existente')
    } else if (!isReadOnly.value) {
      // 5. Solo si NO es lectura, cargamos borrador
      const draft = await offlineStorage.getDraft(articuloIdParam)
      if (draft) {
        revision.value = draft
        hasStartedTyping.value = true
      }
    }
  }

  isOffline.value = !offlineStorage.isOnline()
  window.addEventListener('online', () => isOffline.value = false)
  window.addEventListener('offline', () => isOffline.value = true)
})

onUnmounted(() => {
  if (pdfBlobUrl.value) offlineStorage.revokePdfUrl(pdfBlobUrl.value)
})

watch(
  revision,
  async (newVal) => {
    if (isReadOnly.value) return // No guardar borradores en modo lectura

    const hasContent = Object.values(newVal).some(v => typeof v === 'string' && v.trim().length > 0)
    const articuloIdParam = articulo.value?.id || route.params.id as string

    if (hasContent && articuloIdParam) {
      await offlineStorage.storeDraft(articuloIdParam, { ...newVal })
      if (!hasStartedTyping.value) {
        hasStartedTyping.value = true
        await syncEngine.enqueue('START_REVIEW', {
          articulo_id: articuloIdParam,
          estado: 'En Revisión'
        })
      }
    }
  },
  { deep: true }
)

const userInitial = computed(() =>
  currentUser.value?.nombre ? currentUser.value.nombre[0].toUpperCase() : '?'
)

const goBack = () => router.push('/reviewer')

const logout = () => {
  authStore.logout()
  router.push('/login')
}

const fetchArticulo = async (id: string) => {
  try {
    loadingPdf.value = true
    isOffline.value = !offlineStorage.isOnline()

    if (isOffline.value) {
      const storedPdf = await offlineStorage.getPdf(id)
      const storedAssignments = await offlineStorage.getAllAssignments()
      const assignment = storedAssignments.find(a => a.articuloId === id)
      if (storedPdf) {
        pdfBlobUrl.value = offlineStorage.createPdfUrl(storedPdf.blob)
        articulo.value = { id, titulo: storedPdf.titulo, estado: assignment?.estado || 'En Revisión', pdf_url: pdfBlobUrl.value }
      }
      return
    }

    const response = await fetch(`${API_BASE_URL}/articulos/${id}?include_relations=true`)
    if (response.ok) {
      const data = await response.json()
      const baseUrl = API_BASE_URL.replace('/api', '')
      if (data.pdf_url) data.pdf_url = `${baseUrl}${data.pdf_url}`
      articulo.value = data
      await guardarPdfOffline(id)
    }
  } catch (error) { console.error(error) } finally { loadingPdf.value = false }
}

const fetchExistingRevision = async (articuloId: string): Promise<boolean> => {
  if (!currentUser.value?.id) return false
  try {
    const response = await fetch(`${API_BASE_URL}/revisiones?articulo_id=${articuloId}&revisor_id=${currentUser.value.id}`)
    if (response.ok) {
      const data = await response.json()
      // En MongoDB los comentarios están en 'secciones' según el esquema
      const obs = data.secciones || data.comentarios
      if (data && obs) {
        // Bloqueamos el guardado automático ANTES de poblar los datos
        isReadOnly.value = true
        
        // Mapeo explícito
        revision.value = {
          introduccion: obs.introduccion || '',
          metodologia: obs.metodologia || '',
          resultados: obs.resultados || '',
          discusion: obs.discusion || '',
          conclusiones: obs.conclusiones || '',
          referencias: obs.referencias || '',
          comentariosGenerales: obs.comentariosGenerales || ''
        }
        decision.value = data.decision
        console.log('[fetchExistingRevision] Datos cargados:', revision.value)
        return true
      }
    }
    return false
  } catch (error) {
    console.error('Error al cargar revision existente:', error)
    return false
  }
}

const guardarPdfOffline = async (articuloId: string) => {
  try {
    const existingPdf = await offlineStorage.getPdf(articuloId)
    if (existingPdf) return
    await offlineStorage.downloadAndStorePdf(articuloId, articulo.value?.titulo || 'articulo', API_BASE_URL)
  } catch (error) { console.error(error) }
}

const submitRevision = async () => {
  if (!decision.value || isReadOnly.value) return
  const articuloId = articulo.value?.id || route.params.id as string
  try {
    isSubmitting.value = true
    const revisionData = {
      articulo_id: articuloId,
      revisor_id: currentUser.value?.id,
      decision: decision.value,
      secciones: { ...revision.value }, // Mapeo a secciones
      comentarios: { ...revision.value }, // Fallback para compatibilidad
      fecha_revision: new Date().toISOString()
    }

    if (!offlineStorage.isOnline()) {
      await syncEngine.enqueue('REVISION', revisionData)
      await offlineStorage.deleteDraft(articuloId)
      await eliminarPdfLocal(articuloId)
      showToast('Guardado local (Offline)', 'success')
      router.push('/reviewer')
      return
    }

    const response = await fetch(`${API_BASE_URL}/revisiones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(revisionData)
    })

    if (response.ok) {
      await offlineStorage.deleteDraft(articuloId)
      await eliminarPdfLocal(articuloId)
      showToast('Revisión completada', 'success')
      router.push('/reviewer')
    }
  } catch (error) { showToast('Error al enviar', 'error') } finally { isSubmitting.value = false }
}

const eliminarPdfLocal = async (articuloId: string) => {
  try {
    await offlineStorage.deletePdf(articuloId)
    if (asignacionId.value) await offlineStorage.deleteAssignment(asignacionId.value)
  } catch (error) { console.error(error) }
}
</script>

<style scoped>
.dashboard {
  display: flex;
  height: 100vh;
  background: var(--bg-base);
  overflow: hidden;
  transition: background 0.3s;
}

.sidebar {
  width: 260px;
  min-width: 260px;
  background: var(--bg-sidebar);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 1.5rem 1.25rem 1rem;
  border-bottom: 1px solid var(--border-color);
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.brand-icon {
  width: 16px;
  height: 16px;
  color: var(--text-strong);
}

.brand-name {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-strong);
  letter-spacing: -0.02em;
}

.sidebar-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 1rem 0.75rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 0.75rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--text-muted);
  transition: all 0.15s ease;
  text-align: left;
  width: 100%;
}

.nav-item svg { width: 15px; height: 15px; }

.nav-item:hover {
  background: var(--bg-card-hover);
  color: var(--text-normal);
}

.nav-item.active {
  background: var(--bg-input);
  color: var(--text-strong);
}

.sidebar-footer {
  padding: 1rem 0.75rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.relative-footer { position: relative; }

.user-chip {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  width: 100%;
  padding: 0.5rem;
  border-radius: 6px;
  transition: background 0.2s;
}

.user-chip-btn {
  border: none;
  background: transparent;
  cursor: pointer;
}

.user-chip-btn:hover { background: var(--bg-card-hover); }
.user-chip-btn.active { background: var(--bg-input); }

.user-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--bg-input);
  border: 1px solid var(--border-hover);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-strong);
  flex-shrink: 0;
}

.user-info { display: flex; flex-direction: column; min-width: 0; text-align: left; }
.user-name { font-size: 0.8rem; font-weight: 600; color: var(--text-strong); }
.user-role { font-size: 0.7rem; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.chevron {
  width: 16px;
  height: 16px;
  color: var(--text-faint);
  margin-left: auto;
  transition: transform 0.2s;
}

.user-chip-btn.active .chevron { transform: rotate(180deg); }

.user-menu-dropdown {
  position: absolute;
  bottom: calc(100% + 5px);
  left: 0.75rem;
  right: 0.75rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 0.5rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  z-index: 50;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 0.75rem;
  width: 100%;
  border: none;
  background: transparent;
  text-align: left;
  font-size: 0.8rem;
  color: var(--text-normal);
  font-weight: 500;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.2s;
}

.menu-item svg { width: 15px; height: 15px; color: var(--text-muted); }
.menu-item:hover { background: var(--bg-card-hover); color: var(--text-strong); }
.menu-item.text-danger { color: #f87171; }
.menu-item.text-danger svg { color: #f87171; }

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.topbar {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-sidebar);
}

.page-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-strong);
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.offline-badge-pill {
  font-size: 0.65rem;
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  padding: 0.25rem 0.6rem;
  border-radius: 4px;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.read-only-badge {
  font-size: 0.65rem;
  background: var(--bg-input);
  color: var(--text-faint);
  padding: 0.25rem 0.6rem;
  border-radius: 4px;
  border: 1px solid var(--border-color);
}

.page-sub { font-size: 0.8rem; color: var(--text-muted); }

.review-layout {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.pdf-panel {
  flex: 1;
  background: var(--bg-input);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.pdf-viewer { width: 100%; height: 100%; border: none; }

.form-panel {
  width: 500px;
  min-width: 500px;
  background: var(--bg-base);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.form-scrollable-area {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
}

.autosave-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: var(--stat-aceptado);
  background: rgba(16, 185, 129, 0.05);
  padding: 0.75rem 1rem;
  border-radius: 6px;
  margin-bottom: 1.5rem;
}

.autosave-bar svg { width: 14px; height: 14px; }

.revision-form-container { display: flex; flex-direction: column; gap: 2rem; }

.form-section { display: flex; flex-direction: column; gap: 0.75rem; }
.section-top { display: flex; align-items: center; gap: 0.75rem; }
.section-name { font-size: 0.9rem; font-weight: 700; color: var(--text-strong); }
.section-tag { font-size: 0.65rem; color: var(--stat-aceptado); background: rgba(16, 185, 129, 0.1); padding: 0.2rem 0.4rem; border-radius: 4px; }
.section-instruction { font-size: 0.8rem; color: var(--text-muted); line-height: 1.4; }

.textarea-container textarea {
  width: 100%;
  padding: 1rem;
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-normal);
  font-family: inherit;
  font-size: 0.9rem;
  line-height: 1.5;
  resize: vertical;
  min-height: 120px;
}

.textarea-container textarea:disabled {
  opacity: 0.8;
  cursor: default;
  background: var(--bg-card);
}

.highlight-section { background: var(--bg-card); padding: 1.5rem; border-radius: 12px; border: 1px dashed var(--border-color); }

.conclusion-panel {
  margin-top: 1rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
}

.conclusion-title { font-size: 1rem; font-weight: 700; color: var(--text-strong); }
.conclusion-sub { font-size: 0.8rem; color: var(--text-muted); margin-bottom: 1.5rem; }

.verdict-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.pointer-none { pointer-events: none; }

.verdict-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--text-normal);
}

.verdict-card.selected.accepted { border-color: var(--stat-aceptado); background: rgba(16, 185, 129, 0.1); color: var(--stat-aceptado); }
.verdict-card.selected.revision { border-color: var(--stat-revision); background: rgba(245, 158, 11, 0.1); color: var(--stat-revision); }
.verdict-card.selected.rejected { border-color: var(--stat-rechazado); background: rgba(239, 68, 68, 0.1); color: var(--stat-rechazado); }

.verdict-icon { font-size: 1.25rem; font-weight: 700; }
.verdict-label { font-size: 0.75rem; font-weight: 600; }

.action-footer { display: flex; justify-content: flex-end; gap: 1rem; }

.btn-submit-main {
  background: var(--btn-primary-bg);
  color: var(--btn-primary-text);
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-cancel {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  color: var(--text-muted);
  background: transparent;
  border: 1px solid var(--border-color);
}

@keyframes spin { to { transform: rotate(360deg); } }
.loader-white { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.6s linear infinite; }
</style>
