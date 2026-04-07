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
        <button class="nav-item active">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Revisión de artículo
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
        <button class="back-btn" @click="goBack">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M10 19l-7-7m0 0l7-7m-7 7h18" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Volver
        </button>
      </div>
    </aside>

    <!-- ── Main ── -->
    <main class="main">
      <header class="topbar">
        <div>
          <h1 class="page-title">Revisión de artículo</h1>
          <p class="page-sub" v-if="articulo">{{ articulo.titulo }}</p>
        </div>
      </header>

      <!-- Split view: PDF + Form -->
      <div class="review-split-container">
        <!-- PDF Viewer (Left side) -->
        <div class="pdf-panel">
          <div v-if="loadingPdf" class="loading-state">
            <div class="spinner"></div>
            <p>Cargando PDF...</p>
          </div>
          <div v-else-if="!articulo?.pdf_url" class="empty-state">
            <div class="empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                <path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3>No hay PDF disponible</h3>
            <p>Este artículo no tiene un archivo PDF asociado.</p>
          </div>
          <div v-else class="pdf-container">
            <iframe :src="articulo.pdf_url" class="pdf-frame" title="PDF del artículo"></iframe>
          </div>
        </div>

        <!-- Review Form (Right side) -->
        <div class="form-panel">
          <div class="form-scroll-content">
            <div class="review-form">
          <!-- Sección: Introducción -->
          <div class="review-section">
            <div class="section-header">
              <h3 class="section-title">Introducción</h3>
              <span class="section-badge">Requerida</span>
            </div>
            <p class="section-desc">Evalúa la claridad del problema, la justificación y los objetivos del artículo.</p>
            <div class="comment-box">
              <label for="comentario-intro">Comentarios sobre la introducción</label>
              <textarea
                id="comentario-intro"
                v-model="revision.introduccion"
                placeholder="Escribe tus comentarios sobre la introducción del artículo..."
                rows="4"
              ></textarea>
            </div>
          </div>

          <!-- Sección: Metodología -->
          <div class="review-section">
            <div class="section-header">
              <h3 class="section-title">Metodología</h3>
              <span class="section-badge">Requerida</span>
            </div>
            <p class="section-desc">Evalúa la adecuación del diseño metodológico, las técnicas de recolección de datos y el análisis.</p>
            <div class="comment-box">
              <label for="comentario-metodologia">Comentarios sobre la metodología</label>
              <textarea
                id="comentario-metodologia"
                v-model="revision.metodologia"
                placeholder="Escribe tus comentarios sobre la metodología utilizada..."
                rows="4"
              ></textarea>
            </div>
          </div>

          <!-- Sección: Resultados -->
          <div class="review-section">
            <div class="section-header">
              <h3 class="section-title">Resultados</h3>
              <span class="section-badge">Requerida</span>
            </div>
            <p class="section-desc">Evalúa la presentación, coherencia y relevancia de los resultados obtenidos.</p>
            <div class="comment-box">
              <label for="comentario-resultados">Comentarios sobre los resultados</label>
              <textarea
                id="comentario-resultados"
                v-model="revision.resultados"
                placeholder="Escribe tus comentarios sobre los resultados presentados..."
                rows="4"
              ></textarea>
            </div>
          </div>

          <!-- Sección: Discusión -->
          <div class="review-section">
            <div class="section-header">
              <h3 class="section-title">Discusión</h3>
              <span class="section-badge">Requerida</span>
            </div>
            <p class="section-desc">Evalúa la interpretación de los resultados, su relación con la literatura y las implicaciones.</p>
            <div class="comment-box">
              <label for="comentario-discusion">Comentarios sobre la discusión</label>
              <textarea
                id="comentario-discusion"
                v-model="revision.discusion"
                placeholder="Escribe tus comentarios sobre la discusión del artículo..."
                rows="4"
              ></textarea>
            </div>
          </div>

          <!-- Sección: Conclusiones -->
          <div class="review-section">
            <div class="section-header">
              <h3 class="section-title">Conclusiones</h3>
              <span class="section-badge">Requerida</span>
            </div>
            <p class="section-desc">Evalúa si las conclusiones responden a los objetivos y son coherentes con los resultados.</p>
            <div class="comment-box">
              <label for="comentario-conclusiones">Comentarios sobre las conclusiones</label>
              <textarea
                id="comentario-conclusiones"
                v-model="revision.conclusiones"
                placeholder="Escribe tus comentarios sobre las conclusiones..."
                rows="4"
              ></textarea>
            </div>
          </div>

          <!-- Sección: Referencias -->
          <div class="review-section">
            <div class="section-header">
              <h3 class="section-title">Referencias</h3>
              <span class="section-badge">Requerida</span>
            </div>
            <p class="section-desc">Evalúa la actualidad, relevancia y formato de las referencias bibliográficas.</p>
            <div class="comment-box">
              <label for="comentario-referencias">Comentarios sobre las referencias</label>
              <textarea
                id="comentario-referencias"
                v-model="revision.referencias"
                placeholder="Escribe tus comentarios sobre las referencias bibliográficas..."
                rows="4"
              ></textarea>
            </div>
          </div>

          <!-- Sección: Comentarios generales -->
          <div class="review-section general-section">
            <div class="section-header">
              <h3 class="section-title">Comentarios generales</h3>
            </div>
            <p class="section-desc">Observaciones adicionales que apliquen al artículo completo.</p>
            <div class="comment-box">
              <label for="comentario-general">Comentarios generales</label>
              <textarea
                id="comentario-general"
                v-model="revision.comentariosGenerales"
                placeholder="Escribe tus comentarios generales sobre el artículo..."
                rows="6"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Botones de decisión final -->
        <div class="decision-panel">
          <h3 class="decision-title">Decisión final</h3>
          <p class="decision-desc">Selecciona el veredicto para este artículo</p>
          
          <div class="decision-buttons">
            <button 
              class="decision-btn accepted"
              :class="{ selected: decision === 'aceptado' }"
              @click="decision = 'aceptado'"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <div class="btn-content">
                <span class="btn-label">Aceptado</span>
                <span class="btn-sublabel">Sin cambios necesarios</span>
              </div>
            </button>

            <button 
              class="decision-btn revision"
              :class="{ selected: decision === 'revision' }"
              @click="decision = 'revision'"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <div class="btn-content">
                <span class="btn-label">Revisión con cambios</span>
                <span class="btn-sublabel">Se requieren modificaciones</span>
              </div>
            </button>

            <button 
              class="decision-btn rejected"
              :class="{ selected: decision === 'rechazado' }"
              @click="decision = 'rechazado'"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <div class="btn-content">
                <span class="btn-label">Rechazado</span>
                <span class="btn-sublabel">No cumple con los criterios</span>
              </div>
            </button>
          </div>

          <div class="submit-actions">
            <button class="btn-ghost" @click="goBack">Cancelar</button>
            <button 
              class="btn-primary" 
              @click="submitRevision"
              :disabled="!decision || isSubmitting"
            >
              <svg v-if="isSubmitting" class="spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke-linecap="round"/>
              </svg>
              {{ isSubmitting ? 'Enviando...' : 'Enviar revisión' }}
            </button>
          </div>
        </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted, computed } from 'vue'
import { useToast } from '../composables/useToast'

const router = useRouter()
const route = useRoute()
const { showToast } = useToast()

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

interface CurrentUser {
  id: string
  email: string
  nombre: string
  rol: string
}

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

const currentUser = ref<CurrentUser | null>(null)
const articulo = ref<Articulo | null>(null)
const isSubmitting = ref(false)
const loadingPdf = ref(false)
const decision = ref<'aceptado' | 'revision' | 'rechazado' | null>(null)

const revision = ref<Revision>({
  introduccion: '',
  metodologia: '',
  resultados: '',
  discusion: '',
  conclusiones: '',
  referencias: '',
  comentariosGenerales: ''
})

onMounted(() => {
  const raw = localStorage.getItem('user')
  if (raw) {
    currentUser.value = JSON.parse(raw)
  }

  const articuloId = route.params.id as string
  if (articuloId) {
    fetchArticulo(articuloId)
  }
})

const userInitial = computed(() =>
  currentUser.value?.nombre ? currentUser.value.nombre[0].toUpperCase() : 'R'
)

const goBack = () => {
  router.push('/reviewer')
}

const fetchArticulo = async (id: string) => {
  try {
    loadingPdf.value = true
    const response = await fetch(`${API_BASE_URL}/articulos/${id}?include_relations=true`)
    if (response.ok) {
      const data = await response.json()
      // Construir URL completa para el PDF
      const baseUrl = API_BASE_URL.replace('/api', '')
      if (data.pdf_url) {
        data.pdf_url = `${baseUrl}${data.pdf_url}`
      }
      articulo.value = data
    }
  } catch (error) {
    console.error('Error al cargar artículo:', error)
  } finally {
    loadingPdf.value = false
  }
}

const submitRevision = async () => {
  if (!decision.value) return

  try {
    isSubmitting.value = true

    const revisionData = {
      articulo_id: articulo.value?.id || route.params.id,
      revisor_id: currentUser.value?.id,
      decision: decision.value,
      comentarios: revision.value,
      fecha_revision: new Date().toISOString()
    }

    const response = await fetch(`${API_BASE_URL}/revisiones`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(revisionData)
    })

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`)
    }

    showToast('Revisión enviada con éxito', 'success')
    router.push('/reviewer')
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    showToast(`Error al enviar la revisión: ${errorMessage}`, 'error')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.dashboard {
  display: flex;
  min-height: 100vh;
  background: #080808;
  overflow: hidden;
}

.sidebar {
  width: 220px;
  min-width: 220px;
  border-right: 1px solid #1e1e1e;
  display: flex;
  flex-direction: column;
  background: #090909;
  position: sticky;
  top: 0;
  height: 100vh;
}

.sidebar-header {
  padding: 1.5rem 1.25rem 1rem;
  border-bottom: 1px solid #1e1e1e;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.brand-icon {
  width: 16px;
  height: 16px;
  color: #fff;
}

.brand-name {
  font-size: 0.9rem;
  font-weight: 700;
  color: #fff;
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
  color: #555;
  transition: all 0.15s ease;
  text-align: left;
  width: 100%;
  background: transparent;
  border: none;
  cursor: pointer;
}

.nav-item svg {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
}

.nav-item:hover {
  background: #141414;
  color: #bbb;
}

.nav-item.active {
  background: #1a1a1a;
  color: #fff;
}

.sidebar-footer {
  padding: 1rem 0.75rem;
  border-top: 1px solid #1e1e1e;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.user-chip {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.user-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #1f1f1f;
  border: 1px solid #2e2e2e;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
}

.user-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.user-name {
  font-size: 0.8rem;
  font-weight: 600;
  color: #ddd;
}

.user-role {
  font-size: 0.7rem;
  color: #555;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  color: #444;
  transition: color 0.15s;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
}

.back-btn svg {
  width: 13px;
  height: 13px;
}

.back-btn:hover {
  color: #888;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  overflow: hidden;
}

.topbar {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #1e1e1e;
  flex-shrink: 0;
}

.page-title {
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #fff;
  margin-bottom: 0.2rem;
}

.page-sub {
  font-size: 0.8rem;
  color: #666;
}

/* Split container with independent scrolling */
.review-split-container {
  display: flex;
  flex: 1;
  height: calc(100vh - 80px);
  overflow: hidden;
}

/* PDF Panel - Left side */
.pdf-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #0d0d0d;
  border-right: 1px solid #1e1e1e;
  overflow: hidden;
}

.pdf-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.pdf-frame {
  flex: 1;
  width: 100%;
  height: 100%;
  border: none;
  background: #fff;
}

/* Form Panel - Right side */
.form-panel {
  width: 480px;
  min-width: 480px;
  background: #080808;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.form-scroll-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

/* Scrollbar styling */
.form-scroll-content::-webkit-scrollbar {
  width: 6px;
}

.form-scroll-content::-webkit-scrollbar-track {
  background: transparent;
}

.form-scroll-content::-webkit-scrollbar-thumb {
  background: #333;
  border-radius: 3px;
}

.form-scroll-content::-webkit-scrollbar-thumb:hover {
  background: #444;
}

.review-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.review-section {
  background: #0d0d0d;
  border: 1px solid #1e1e1e;
  border-radius: 10px;
  padding: 1.5rem;
}

.review-section.general-section {
  background: #111;
  border-color: #2a2a2a;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
}

.section-badge {
  font-size: 0.65rem;
  font-weight: 600;
  color: #4ade80;
  background: rgba(74, 222, 128, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.section-desc {
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.comment-box {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.comment-box label {
  font-size: 0.8rem;
  font-weight: 500;
  color: #bbb;
}

.comment-box textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #1e1e1e;
  border-radius: 6px;
  background: #080808;
  color: #e8e8e8;
  font-size: 0.875rem;
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.15s;
}

.comment-box textarea:focus {
  outline: none;
  border-color: #333;
}

.comment-box textarea::placeholder {
  color: #444;
}

.decision-panel {
  margin-top: 2rem;
  background: #0d0d0d;
  border: 1px solid #1e1e1e;
  border-radius: 10px;
  padding: 1.5rem;
}

.decision-title {
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  margin-bottom: 0.25rem;
}

.decision-desc {
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 1.25rem;
}

.decision-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.decision-btn {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border: 1px solid #1e1e1e;
  border-radius: 8px;
  background: #080808;
  cursor: pointer;
  transition: all 0.15s ease;
  text-align: left;
}

.decision-btn:hover {
  border-color: #333;
  background: #0f0f0f;
}

.decision-btn.selected {
  border-width: 2px;
}

.decision-btn.selected.accepted {
  border-color: #4ade80;
  background: rgba(74, 222, 128, 0.05);
}

.decision-btn.selected.revision {
  border-color: #e5a24c;
  background: rgba(229, 162, 76, 0.05);
}

.decision-btn.selected.rejected {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.05);
}

.decision-btn svg {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.decision-btn.accepted svg {
  color: #4ade80;
}

.decision-btn.revision svg {
  color: #e5a24c;
}

.decision-btn.rejected svg {
  color: #ef4444;
}

.btn-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.btn-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #fff;
}

.btn-sublabel {
  font-size: 0.75rem;
  color: #666;
}

.submit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #1e1e1e;
}

.btn-ghost {
  background: transparent;
  color: #555;
  font-size: 0.825rem;
  font-weight: 500;
  padding: 0.6rem 1rem;
  border-radius: 6px;
  border: 1px solid #1e1e1e;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
}

.btn-ghost:hover {
  color: #999;
  border-color: #333;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: #fff;
  color: #000;
  font-size: 0.825rem;
  font-weight: 600;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: opacity 0.15s;
}

.btn-primary:hover:not(:disabled) {
  opacity: 0.88;
}

.btn-primary:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.spinner {
  width: 14px;
  height: 14px;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .dashboard {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    min-width: unset;
    height: auto;
    position: static;
    border-right: none;
    border-bottom: 1px solid #1e1e1e;
  }

  .review-split-container {
    flex-direction: column;
    height: auto;
  }

  .pdf-panel {
    border-right: none;
    border-bottom: 1px solid #1e1e1e;
    height: 50vh;
    min-height: 300px;
  }

  .form-panel {
    width: 100%;
    min-width: unset;
    height: auto;
    max-height: 50vh;
  }

  .topbar {
    padding: 1.25rem;
  }

  .decision-buttons {
    gap: 0.5rem;
  }

  .decision-btn {
    padding: 0.875rem 1rem;
  }

  .submit-actions {
    flex-direction: column-reverse;
  }

  .btn-primary,
  .btn-ghost {
    width: 100%;
    justify-content: center;
  }
}

/* Loading and empty states */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  gap: 1rem;
  text-align: center;
  color: #666;
}

.loading-state .spinner {
  width: 32px;
  height: 32px;
}

.loading-state p {
  font-size: 0.85rem;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  gap: 0.75rem;
  text-align: center;
}

.empty-icon {
  width: 44px;
  height: 44px;
  color: #333;
  margin-bottom: 0.5rem;
}

.empty-icon svg {
  width: 100%;
  height: 100%;
}

.empty-state h3 {
  font-size: 0.95rem;
  font-weight: 600;
  color: #666;
}

.empty-state p {
  font-size: 0.8rem;
  color: #444;
  max-width: 280px;
  line-height: 1.5;
}
</style>
