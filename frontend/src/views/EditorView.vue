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
        <button class="nav-item" :class="{ active: vistaActiva === 'overview' }" id="nav-overview-editor" @click="vistaActiva = 'overview'">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Overview
        </button>
        <button class="nav-item" :class="{ active: vistaActiva === 'articulos' }" id="nav-articulos-editor" @click="vistaActiva = 'articulos'">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Panel editorial
        </button>
        <button class="nav-item" :class="{ active: vistaActiva === 'asignaciones' }" id="nav-asignaciones-editor" @click="irAAsignaciones">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Asignaciones
        </button>
        <button class="nav-item" :class="{ active: vistaActiva === 'revisores' }" id="nav-revisores-editor" @click="irARevisores">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Revisores
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
           <button class="menu-item text-danger" id="btn-salir-editor" @click="goBack">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Cerrar sesión
           </button>
        </div>
        <button class="user-chip user-chip-btn" @click="showUserMenu = !showUserMenu" :class="{ active: showUserMenu }">
          <div class="user-avatar">E</div>
          <div class="user-info">
            <span class="user-name">Editor</span>
            <span class="user-role">editor@uni.edu</span>
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
            <h1 class="page-title">Panel editorial</h1>
            <p class="page-sub">Resumen del estado del sistema</p>
          </div>
          <button class="btn-primary" id="btn-ir-asignar" @click="irAAsignaciones">
            + Asignar revisor
          </button>
        </header>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-header">
              <span class="stat-dot recibido"></span>
              <span class="stat-label">Recibidos</span>
            </div>
            <span class="stat-value">{{ statsConteo.recibidos }}</span>
            <p class="stat-desc">Artículos enviados por autores</p>
          </div>
          <div class="stat-card">
            <div class="stat-header">
              <span class="stat-dot revision"></span>
              <span class="stat-label">En revisión</span>
            </div>
            <span class="stat-value">{{ statsConteo.enRevision }}</span>
            <p class="stat-desc">Artículos con revisor asignado</p>
          </div>
          <div class="stat-card">
            <div class="stat-header">
              <span class="stat-dot aceptado"></span>
              <span class="stat-label">Aceptados</span>
            </div>
            <span class="stat-value">{{ statsConteo.aceptados }}</span>
            <p class="stat-desc">Aprobados para publicación</p>
          </div>
          <div class="stat-card">
            <div class="stat-header">
              <span class="stat-dot rechazado"></span>
              <span class="stat-label">Rechazados</span>
            </div>
            <span class="stat-value">{{ statsConteo.rechazados }}</span>
            <p class="stat-desc">Requieren revisión mayor</p>
          </div>
        </div>

        <div class="section">
          <h2 class="section-title">Actividad reciente</h2>
          <div v-if="articulosRecientes.length === 0" class="empty-state">
            <div class="empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3>Sin artículos en el sistema</h3>
            <p>Cuando los autores envíen artículos, aparecerán aquí para ser gestionados.</p>
          </div>
          <div v-else class="articulos-list">
            <div v-for="art in articulosRecientes.slice(0,5)" :key="art.id" class="articulo-row">
              <div class="articulo-info">
                <span class="articulo-titulo">{{ art.titulo }}</span>
                <span class="articulo-autor">{{ art.autor?.perfil?.nombre || art.autor_id }}</span>
              </div>
              <span class="badge" :class="badgeClass(art.estado)">{{ art.estado }}</span>
            </div>
          </div>
        </div>
      </template>

      <!-- ─── PANEL EDITORIAL ───────────────────────── -->
      <template v-if="vistaActiva === 'articulos'">
        <header class="topbar">
          <div>
            <h1 class="page-title">Todos los artículos</h1>
            <p class="page-sub">Gestión y seguimiento de artículos en el sistema</p>
          </div>
          <button class="btn-primary" id="btn-asignar-desde-panel" @click="irAAsignaciones">
            + Asignar revisor
          </button>
        </header>
        <div class="section">
          <div v-if="cargandoArticulos" class="loading-state">
            <div class="spinner"></div>
            <span>Cargando artículos...</span>
          </div>
          <div v-else-if="articulos.length === 0" class="empty-state">
            <div class="empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3>Sin artículos en el sistema</h3>
            <p>Cuando los autores envíen artículos, aparecerán aquí para ser gestionados.</p>
          </div>
          <div v-else class="articulos-table-wrap">
            <table class="articulos-table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Autor</th>
                  <th>Estado</th>
                  <th>Revisores asignados</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="art in articulos" :key="art.id">
                  <td class="td-titulo">{{ art.titulo }}</td>
                  <td class="td-muted">{{ art.autor?.perfil?.nombre || art.autor_id }}</td>
                  <td><span class="badge" :class="badgeClass(art.estado)">{{ art.estado }}</span></td>
                  <td class="td-muted">{{ (art.asignaciones || []).length }} revisor(es)</td>
                  <td>
                    <button class="btn-sm" @click="abrirAsignacionDesdeArticulo(art)">Asignar</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>

      <!-- ─── ASIGNACIONES ──────────────────────────── -->
      <template v-if="vistaActiva === 'asignaciones'">
        <header class="topbar">
          <div>
            <h1 class="page-title">Asignaciones</h1>
            <p class="page-sub">Asigna revisores a artículos pendientes</p>
          </div>
        </header>
        <div class="section">
          <!-- Selector de artículo -->
          <div class="form-group">
            <label class="form-label">Seleccionar artículo</label>
            <select class="form-select" v-model="articuloSeleccionadoId" @change="onArticuloChange">
              <option value="">-- Selecciona un artículo --</option>
              <option v-for="art in articulos" :key="art.id" :value="art.id">
                {{ art.titulo }} ({{ art.estado }})
              </option>
            </select>
          </div>

          <!-- Revisores ya asignados al artículo seleccionado -->
          <div v-if="articuloSeleccionadoId && revisoresDelArticulo.length > 0" class="asignados-section">
            <h3 class="sub-title">Revisores ya asignados</h3>
            <div class="revisores-asignados-list">
              <div v-for="rv in revisoresDelArticulo" :key="rv.revisor_id" class="revisor-asignado-chip">
                <span class="chip-avatar">{{ ((rv.revisor?.perfil?.nombre || rv.revisor_id || '?') as string).charAt(0).toUpperCase() }}</span>
                <span>{{ rv.revisor?.perfil?.nombre || rv.revisor_id }}</span>
                <button class="chip-remove" @click="eliminarAsignacion(rv.id)" title="Quitar revisor">×</button>
              </div>
            </div>
          </div>

          <!-- Lista de revisores disponibles -->
          <div v-if="articuloSeleccionadoId" class="revisores-disponibles">
            <h3 class="sub-title">Lista de revisores disponibles</h3>
            <div v-if="cargandoRevisores" class="loading-state">
              <div class="spinner"></div><span>Cargando revisores...</span>
            </div>
            <div v-else-if="revisores.length === 0" class="empty-state-sm">
              No hay revisores registrados.
            </div>
            <div v-else class="revisores-grid">
              <div
                v-for="rev in revisores"
                :key="rev.id"
                class="revisor-card"
                :class="{ 'revisor-lleno': !rev.puede_recibir_mas, 'revisor-asignado-ya': estaAsignado(rev.id) }"
                @click="abrirModalRevisor(rev)"
              >
                <div class="revisor-card-top">
                  <div class="rev-avatar">{{ (rev.nombre || '?').charAt(0).toUpperCase() }}</div>
                  <div class="rev-info">
                    <span class="rev-nombre">{{ rev.nombre }}</span>
                    <span class="rev-carrera">{{ rev.carrera }}</span>
                  </div>
                  <div class="rev-badge-wrap">
                    <span class="rev-count" :class="{ 'count-full': rev.articulos_asignados >= 3 }">
                      {{ rev.articulos_asignados }}/3
                    </span>
                  </div>
                </div>
                <div class="rev-tags">
                  <span v-for="esp in (rev.especialidades || []).slice(0,2)" :key="esp" class="tag">{{ esp }}</span>
                </div>
                <div class="rev-footer">
                  <span v-if="estaAsignado(rev.id)" class="status-chip asignado-chip">Ya asignado</span>
                  <span v-else-if="!rev.puede_recibir_mas" class="status-chip lleno-chip">Límite alcanzado</span>
                  <span v-else class="status-chip libre-chip">Disponible</span>
                </div>
              </div>
            </div>
          </div>

          <div v-if="!articuloSeleccionadoId" class="empty-state">
            <div class="empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3>Selecciona un artículo</h3>
            <p>Elige un artículo para ver los revisores disponibles y asignarlos.</p>
          </div>

          <!-- Mensaje de error/éxito -->
          <div v-if="mensajeAsignacion" class="mensaje-toast" :class="mensajeAsignacion.tipo">
            {{ mensajeAsignacion.texto }}
          </div>
        </div>
      </template>

      <!-- ─── REVISORES ─────────────────────────────── -->
      <template v-if="vistaActiva === 'revisores'">
        <header class="topbar">
          <div>
            <h1 class="page-title">Lista de revisores</h1>
            <p class="page-sub">Todos los revisores disponibles y sus artículos asignados</p>
          </div>
        </header>
        <div class="section">
          <div v-if="cargandoRevisores" class="loading-state">
            <div class="spinner"></div><span>Cargando revisores...</span>
          </div>
          <div v-else-if="revisores.length === 0" class="empty-state">
            <div class="empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3>No hay revisores registrados</h3>
            <p>Los revisores aparecerán aquí cuando se registren en el sistema.</p>
          </div>
          <div v-else>
            <div class="revisores-grid-full">
              <div
                v-for="rev in revisores"
                :key="rev.id"
                class="revisor-card revisor-card-full"
                :class="{ 'revisor-lleno': !rev.puede_recibir_mas }"
                @click="abrirModalRevisor(rev)"
              >
                <div class="revisor-card-top">
                  <div class="rev-avatar rev-avatar-lg">{{ (rev.nombre || '?').charAt(0).toUpperCase() }}</div>
                  <div class="rev-info">
                    <span class="rev-nombre">{{ rev.nombre }}</span>
                    <span class="rev-carrera">{{ rev.carrera }}</span>
                    <span class="rev-email">{{ rev.email }}</span>
                  </div>
                  <div class="rev-badge-wrap">
                    <span class="rev-count" :class="{ 'count-full': rev.articulos_asignados >= 3 }">
                      {{ rev.articulos_asignados }}/3
                    </span>
                    <span class="rev-count-label">artículos</span>
                  </div>
                </div>
                <div class="rev-tags">
                  <span v-for="esp in rev.especialidades" :key="esp" class="tag">{{ esp }}</span>
                </div>
                <div class="rev-footer">
                  <span v-if="!rev.puede_recibir_mas" class="status-chip lleno-chip">Límite alcanzado (3/3)</span>
                  <span v-else class="status-chip libre-chip">{{ 3 - rev.articulos_asignados }} espacio(s) disponible(s)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

    </main>

    <!-- ─── MODAL REVISOR ───────────────────────────── -->
    <div v-if="modalRevisor" class="modal-overlay" @click.self="cerrarModal">
      <div class="modal-card">
        <button class="modal-close" @click="cerrarModal">×</button>
        <div class="modal-header">
          <div class="modal-avatar">{{ (modalRevisor.nombre || '?').charAt(0).toUpperCase() }}</div>
          <div>
            <h2 class="modal-nombre">{{ modalRevisor.nombre }}</h2>
            <span class="modal-email">{{ modalRevisor.email }}</span>
          </div>
        </div>

        <div class="modal-body">
          <div class="modal-field">
            <span class="modal-field-label">Carrera</span>
            <span class="modal-field-value">{{ modalRevisor.carrera || '—' }}</span>
          </div>
          <div class="modal-field">
            <span class="modal-field-label">Especialidades</span>
            <div class="rev-tags">
              <span v-for="esp in modalRevisor.especialidades" :key="esp" class="tag">{{ esp }}</span>
              <span v-if="!modalRevisor.especialidades?.length" class="modal-field-value">—</span>
            </div>
          </div>
          <div class="modal-field">
            <span class="modal-field-label">Artículos en revisión ({{ modalRevisor.articulos_asignados }}/3)</span>
            <div v-if="modalRevisor.articulos && modalRevisor.articulos.length > 0" class="modal-articulos">
              <div v-for="art in modalRevisor.articulos" :key="art.id" class="modal-art-row">
                <span class="modal-art-titulo">{{ art.titulo || art.id }}</span>
                <span class="badge" :class="badgeClass(art.estado)">{{ art.estado || '—' }}</span>
              </div>
            </div>
            <span v-else class="modal-field-value">Sin artículos asignados</span>
          </div>
        </div>

        <div class="modal-footer">
          <div v-if="mensajeModal" class="mensaje-toast" :class="mensajeModal.tipo" style="margin-bottom:0.75rem">
            {{ mensajeModal.texto }}
          </div>
          <div v-if="vistaActiva === 'asignaciones' && articuloSeleccionadoId">
            <button
              class="btn-primary w-full"
              :disabled="!modalRevisor.puede_recibir_mas || estaAsignado(modalRevisor.id) || asignando"
              @click="asignarRevisorDesdeModal"
            >
              <span v-if="asignando">Asignando...</span>
              <span v-else-if="estaAsignado(modalRevisor.id)">Ya asignado a este artículo</span>
              <span v-else-if="!modalRevisor.puede_recibir_mas">Límite alcanzado</span>
              <span v-else>Asignar a este artículo</span>
            </button>
          </div>
          <div v-else>
            <button class="btn-primary w-full" @click="irAAsignarEsteRevisor">Asignar</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref, computed, onMounted } from 'vue'
import { useTheme } from '../composables/useTheme'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const router = useRouter()
const { isDark, toggleTheme } = useTheme()

const showUserMenu = ref(false)
const vistaActiva = ref<string>('overview')
const goBack = () => router.push('/')

// ── Data ──────────────────────────────────────────────
const articulos = ref<any[]>([])
const revisores = ref<any[]>([])
const cargandoArticulos = ref(false)
const cargandoRevisores = ref(false)
const articuloSeleccionadoId = ref('')
const revisoresDelArticulo = ref<any[]>([])
const modalRevisor = ref<any>(null)
const asignando = ref(false)
const mensajeAsignacion = ref<{ texto: string; tipo: string } | null>(null)
const mensajeModal = ref<{ texto: string; tipo: string } | null>(null)

// ── Stats computed ────────────────────────────────────
const articulosRecientes = computed(() => articulos.value)
const statsConteo = computed(() => ({
  recibidos: articulos.value.filter(a => a.estado === 'Borrador').length,
  enRevision: articulos.value.filter(a => a.estado === 'En Revisión').length,
  aceptados: articulos.value.filter(a => a.estado === 'Aceptado').length,
  rechazados: articulos.value.filter(a => a.estado === 'Rechazado').length,
}))

// ── Badge helper ──────────────────────────────────────
function badgeClass(estado: string) {
  const map: Record<string, string> = {
    'Borrador': 'badge-borrador',
    'En Revisión': 'badge-revision',
    'Aceptado': 'badge-aceptado',
    'Rechazado': 'badge-rechazado',
  }
  return map[estado] || 'badge-borrador'
}

// ── Fetch data ────────────────────────────────────────
async function cargarArticulos() {
  cargandoArticulos.value = true
  try {
    const res = await fetch(`${API}/articulos?include_relations=true`)
    articulos.value = await res.json()
  } catch (e) {
    console.error('Error cargando artículos', e)
  } finally {
    cargandoArticulos.value = false
  }
}

async function cargarRevisores() {
  cargandoRevisores.value = true
  try {
    const res = await fetch(`${API}/asignaciones/revisores`)
    revisores.value = await res.json()
  } catch (e) {
    console.error('Error cargando revisores', e)
  } finally {
    cargandoRevisores.value = false
  }
}

async function cargarAsignacionesDeArticulo(articuloId: string) {
  try {
    const res = await fetch(`${API}/asignaciones?revisor_id=&include_relations=true`)
    // Filtrar las del artículo actual
    const todas = await res.json()
    revisoresDelArticulo.value = todas.filter((a: any) => a.articulo_id === articuloId)
  } catch (e) {
    revisoresDelArticulo.value = []
  }
}

// ── Navegación ────────────────────────────────────────
async function irAAsignaciones() {
  vistaActiva.value = 'asignaciones'
  await cargarArticulos()
  await cargarRevisores()
}

async function irARevisores() {
  vistaActiva.value = 'revisores'
  await cargarRevisores()
}

// ── Artículo seleccionado ─────────────────────────────
async function onArticuloChange() {
  if (articuloSeleccionadoId.value) {
    await cargarAsignacionesDeArticulo(articuloSeleccionadoId.value)
    await cargarRevisores()
  } else {
    revisoresDelArticulo.value = []
  }
}

function abrirAsignacionDesdeArticulo(art: any) {
  articuloSeleccionadoId.value = art.id
  irAAsignaciones().then(() => onArticuloChange())
}

// ── Revisor ya asignado al artículo actual ────────────
function estaAsignado(revisorId: string) {
  return revisoresDelArticulo.value.some(a => a.revisor_id === revisorId)
}

// ── Modal ─────────────────────────────────────────────
function abrirModalRevisor(rev: any) {
  modalRevisor.value = rev
  mensajeModal.value = null
}
function cerrarModal() {
  modalRevisor.value = null
  mensajeModal.value = null
}

function irAAsignarEsteRevisor() {
  cerrarModal()
  irAAsignaciones()
}

// ── Asignar desde modal ───────────────────────────────
async function asignarRevisorDesdeModal() {
  if (!articuloSeleccionadoId.value || !modalRevisor.value) return
  asignando.value = true
  mensajeModal.value = null
  try {
    const res = await fetch(`${API}/asignaciones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        articulo_id: articuloSeleccionadoId.value,
        revisor_id: modalRevisor.value.id,
      }),
    })
    if (!res.ok) {
      const err = await res.json()
      mensajeModal.value = { texto: err.message || 'Error al asignar', tipo: 'error' }
    } else {
      mensajeModal.value = { texto: '¡Revisor asignado correctamente!', tipo: 'success' }
      await cargarRevisores()
      await cargarAsignacionesDeArticulo(articuloSeleccionadoId.value)
      // Actualizar datos del modal
      const revActualizado = revisores.value.find(r => r.id === modalRevisor.value!.id)
      if (revActualizado) modalRevisor.value = revActualizado
      setTimeout(() => cerrarModal(), 1500)
    }
  } catch (e) {
    mensajeModal.value = { texto: 'Error de conexión con el servidor', tipo: 'error' }
  } finally {
    asignando.value = false
  }
}

// ── Eliminar asignación ───────────────────────────────
async function eliminarAsignacion(asignacionId: string) {
  try {
    await fetch(`${API}/asignaciones/${asignacionId}`, { method: 'DELETE' })
    await cargarAsignacionesDeArticulo(articuloSeleccionadoId.value)
    await cargarRevisores()
  } catch (e) {
    console.error('Error eliminando asignación', e)
  }
}

// ── Init ──────────────────────────────────────────────
onMounted(async () => {
  await cargarArticulos()
})
</script>

<style scoped>
.dashboard { display: flex; min-height: 100vh; background: transparent; }

/* ── Sidebar ── */
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

/* ── Main ── */
.main { flex: 1; display: flex; flex-direction: column; overflow-y: auto; }
.topbar { display: flex; align-items: flex-start; justify-content: space-between; padding: 2rem 2.5rem 1.5rem; border-bottom: 1px solid var(--border-color); }
.page-title { font-size: 1.35rem; font-weight: 700; letter-spacing: -0.02em; color: var(--text-strong); margin-bottom: 0.2rem; }
.page-sub { font-size: 0.8rem; color: var(--text-faint); }
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); border-bottom: 1px solid var(--border-color); }
.stat-card { padding: 1.75rem 2rem; border-right: 1px solid var(--border-color); display: flex; flex-direction: column; gap: 0.5rem; }
.stat-card:last-child { border-right: none; }
.stat-header { display: flex; align-items: center; gap: 0.45rem; margin-bottom: 0.25rem; }
.stat-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.stat-dot.recibido  { background: var(--stat-borrador); }
.stat-dot.revision  { background: var(--stat-revision); }
.stat-dot.aceptado  { background: var(--stat-aceptado); }
.stat-dot.rechazado { background: var(--stat-rechazado); }
.stat-label { font-size: 0.72rem; font-weight: 500; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
.stat-value { font-size: 2.4rem; font-weight: 800; letter-spacing: -0.05em; color: var(--text-strong); line-height: 1; }
.stat-desc { font-size: 0.75rem; color: var(--text-faint); line-height: 1.4; margin-top: 0.2rem; }
.section { padding: 2rem 2.5rem; flex: 1; }
.section-title { font-size: 0.8rem; font-weight: 600; color: var(--text-faint); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 1.5rem; }
.sub-title { font-size: 0.82rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.75rem; margin-top: 1.5rem; }

/* ── Empty / Loading ── */
.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 4rem 2rem; gap: 0.75rem; text-align: center; }
.empty-icon { width: 44px; height: 44px; color: var(--border-hover); margin-bottom: 0.5rem; }
.empty-icon svg { width: 100%; height: 100%; }
.empty-state h3 { font-size: 0.95rem; font-weight: 600; color: var(--text-faint); }
.empty-state p { font-size: 0.82rem; color: var(--text-muted); max-width: 280px; line-height: 1.6; }
.empty-state-sm { font-size: 0.82rem; color: var(--text-muted); padding: 1rem 0; }
.loading-state { display: flex; align-items: center; gap: 0.75rem; padding: 2rem 0; color: var(--text-muted); font-size: 0.85rem; }
.spinner { width: 18px; height: 18px; border: 2px solid var(--border-color); border-top-color: var(--text-strong); border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Botones ── */
.btn-primary { background: var(--btn-primary-bg); color: var(--btn-primary-text); font-size: 0.825rem; font-weight: 600; padding: 0.6rem 1.2rem; border-radius: 6px; border: none; cursor: pointer; transition: opacity 0.15s; white-space: nowrap; }
.btn-primary:hover:not(:disabled) { opacity: 0.88; }
.btn-primary:disabled { opacity: 0.45; cursor: not-allowed; }
.btn-primary.w-full { width: 100%; text-align: center; padding: 0.75rem; font-size: 0.9rem; }
.btn-sm { background: var(--bg-input); color: var(--text-strong); font-size: 0.75rem; font-weight: 600; padding: 0.35rem 0.85rem; border-radius: 5px; border: 1px solid var(--border-color); cursor: pointer; transition: background 0.15s; }
.btn-sm:hover { background: var(--bg-card-hover); }

/* ── Tabla artículos ── */
.articulos-table-wrap { overflow-x: auto; }
.articulos-table { width: 100%; border-collapse: collapse; font-size: 0.82rem; }
.articulos-table th { text-align: left; padding: 0.6rem 1rem; font-size: 0.72rem; font-weight: 600; color: var(--text-faint); text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid var(--border-color); }
.articulos-table td { padding: 0.8rem 1rem; border-bottom: 1px solid var(--border-color); vertical-align: middle; }
.articulos-table tr:last-child td { border-bottom: none; }
.td-titulo { font-weight: 600; color: var(--text-strong); max-width: 260px; }
.td-muted { color: var(--text-muted); }

/* ── Artículo row (overview) ── */
.articulos-list { display: flex; flex-direction: column; gap: 0.5rem; }
.articulo-row { display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1rem; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 8px; }
.articulo-info { display: flex; flex-direction: column; gap: 0.2rem; }
.articulo-titulo { font-size: 0.85rem; font-weight: 600; color: var(--text-strong); }
.articulo-autor { font-size: 0.75rem; color: var(--text-muted); }

/* ── Badges ── */
.badge { display: inline-flex; align-items: center; padding: 0.25rem 0.6rem; border-radius: 99px; font-size: 0.7rem; font-weight: 600; }
.badge-borrador { background: rgba(148,163,184,0.15); color: var(--text-muted); }
.badge-revision { background: rgba(251,191,36,0.15); color: #b45309; }
.badge-aceptado { background: rgba(34,197,94,0.15); color: #15803d; }
.badge-rechazado { background: rgba(248,113,113,0.15); color: #dc2626; }
[data-theme="dark"] .badge-revision { color: #fbbf24; }
[data-theme="dark"] .badge-aceptado { color: #4ade80; }
[data-theme="dark"] .badge-rechazado { color: #f87171; }

/* ── Form ── */
.form-group { margin-bottom: 1.5rem; }
.form-label { display: block; font-size: 0.8rem; font-weight: 600; color: var(--text-muted); margin-bottom: 0.5rem; }
.form-select { width: 100%; max-width: 480px; padding: 0.6rem 0.9rem; border: 1px solid var(--border-color); border-radius: 6px; background: var(--bg-input); color: var(--text-strong); font-size: 0.85rem; cursor: pointer; }
.form-select:focus { outline: none; border-color: var(--border-hover); }

/* ── Revisores grid ── */
.revisores-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1rem; margin-top: 0.5rem; }
.revisores-grid-full { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem; }
.revisor-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 10px; padding: 1rem; cursor: pointer; transition: border-color 0.15s, box-shadow 0.15s; }
.revisor-card:hover { border-color: var(--border-hover); box-shadow: 0 2px 10px rgba(0,0,0,0.07); }
.revisor-card.revisor-lleno { opacity: 0.6; }
.revisor-card.revisor-asignado-ya { border-color: var(--stat-aceptado); }
.revisor-card-full { padding: 1.25rem; }
.revisor-card-top { display: flex; align-items: flex-start; gap: 0.75rem; margin-bottom: 0.75rem; }
.rev-avatar { width: 36px; height: 36px; border-radius: 50%; background: var(--bg-input); border: 1px solid var(--border-hover); display: flex; align-items: center; justify-content: center; font-size: 0.9rem; font-weight: 700; color: var(--text-strong); flex-shrink: 0; }
.rev-avatar-lg { width: 44px; height: 44px; font-size: 1.1rem; }
.rev-info { flex: 1; min-width: 0; }
.rev-nombre { display: block; font-size: 0.875rem; font-weight: 700; color: var(--text-strong); }
.rev-carrera { display: block; font-size: 0.75rem; color: var(--text-muted); margin-top: 0.1rem; }
.rev-email { display: block; font-size: 0.72rem; color: var(--text-faint); margin-top: 0.1rem; }
.rev-badge-wrap { display: flex; flex-direction: column; align-items: flex-end; gap: 0.2rem; flex-shrink: 0; }
.rev-count { font-size: 0.8rem; font-weight: 700; color: var(--text-strong); background: var(--bg-input); border: 1px solid var(--border-color); border-radius: 99px; padding: 0.15rem 0.55rem; }
.rev-count.count-full { background: rgba(248,113,113,0.12); color: #dc2626; border-color: rgba(248,113,113,0.3); }
[data-theme="dark"] .rev-count.count-full { color: #f87171; }
.rev-count-label { font-size: 0.65rem; color: var(--text-faint); }
.rev-tags { display: flex; flex-wrap: wrap; gap: 0.35rem; }
.tag { font-size: 0.68rem; font-weight: 500; padding: 0.2rem 0.5rem; border-radius: 99px; background: var(--bg-input); color: var(--text-muted); border: 1px solid var(--border-color); }
.rev-footer { margin-top: 0.75rem; }
.status-chip { font-size: 0.7rem; font-weight: 600; padding: 0.25rem 0.6rem; border-radius: 99px; }
.libre-chip { background: rgba(34,197,94,0.12); color: #15803d; }
.lleno-chip { background: rgba(248,113,113,0.12); color: #dc2626; }
.asignado-chip { background: rgba(59,130,246,0.12); color: #1d4ed8; }
[data-theme="dark"] .libre-chip { color: #4ade80; }
[data-theme="dark"] .lleno-chip { color: #f87171; }
[data-theme="dark"] .asignado-chip { color: #60a5fa; }

/* ── Revisores asignados chips ── */
.asignados-section { margin-bottom: 1.5rem; }
.revisores-asignados-list { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.revisor-asignado-chip { display: inline-flex; align-items: center; gap: 0.4rem; background: var(--bg-input); border: 1px solid var(--border-color); border-radius: 99px; padding: 0.3rem 0.6rem 0.3rem 0.4rem; font-size: 0.78rem; font-weight: 500; color: var(--text-strong); }
.chip-avatar { width: 20px; height: 20px; border-radius: 50%; background: var(--btn-primary-bg); color: var(--btn-primary-text); display: flex; align-items: center; justify-content: center; font-size: 0.65rem; font-weight: 700; flex-shrink: 0; }
.chip-remove { background: none; border: none; cursor: pointer; color: var(--text-faint); font-size: 1rem; line-height: 1; padding: 0 0.15rem; transition: color 0.15s; }
.chip-remove:hover { color: var(--stat-rechazado); }

/* ── Toast/mensaje ── */
.mensaje-toast { font-size: 0.8rem; font-weight: 500; padding: 0.6rem 1rem; border-radius: 6px; }
.mensaje-toast.success { background: rgba(34,197,94,0.12); color: #15803d; border: 1px solid rgba(34,197,94,0.3); }
.mensaje-toast.error { background: rgba(248,113,113,0.12); color: #dc2626; border: 1px solid rgba(248,113,113,0.3); }
[data-theme="dark"] .mensaje-toast.success { color: #4ade80; }
[data-theme="dark"] .mensaje-toast.error { color: #f87171; }

/* ── Modal ── */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 1rem; }
[data-theme="dark"] .modal-overlay { background: rgba(0,0,0,0.65); }
.modal-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 14px; width: 100%; max-width: 440px; box-shadow: 0 16px 48px rgba(0,0,0,0.15); position: relative; max-height: 90vh; overflow-y: auto; }
[data-theme="dark"] .modal-card { box-shadow: 0 16px 48px rgba(0,0,0,0.5); }
.modal-close { position: absolute; top: 0.85rem; right: 1rem; background: none; border: none; font-size: 1.4rem; color: var(--text-faint); cursor: pointer; line-height: 1; padding: 0.1rem 0.3rem; }
.modal-close:hover { color: var(--text-strong); }
.modal-header { display: flex; align-items: center; gap: 1rem; padding: 1.5rem 1.5rem 1rem; border-bottom: 1px solid var(--border-color); }
.modal-avatar { width: 48px; height: 48px; border-radius: 50%; background: var(--bg-input); border: 1px solid var(--border-hover); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; font-weight: 700; color: var(--text-strong); flex-shrink: 0; }
.modal-nombre { font-size: 1rem; font-weight: 700; color: var(--text-strong); margin-bottom: 0.15rem; }
.modal-email { font-size: 0.78rem; color: var(--text-muted); }
.modal-body { padding: 1.25rem 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
.modal-field { display: flex; flex-direction: column; gap: 0.35rem; }
.modal-field-label { font-size: 0.72rem; font-weight: 600; color: var(--text-faint); text-transform: uppercase; letter-spacing: 0.05em; }
.modal-field-value { font-size: 0.85rem; color: var(--text-normal); }
.modal-articulos { display: flex; flex-direction: column; gap: 0.4rem; }
.modal-art-row { display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; background: var(--bg-input); border-radius: 6px; gap: 0.5rem; }
.modal-art-titulo { font-size: 0.8rem; color: var(--text-strong); font-weight: 500; flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.modal-footer { padding: 1rem 1.5rem 1.5rem; border-top: 1px solid var(--border-color); }

/* ── Responsive ── */
@media (max-width: 900px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 768px) {
  .dashboard { flex-direction: column; }
  .sidebar { width: 100%; min-width: unset; height: auto; position: static; border-right: none; border-bottom: 1px solid var(--border-color); }
  .sidebar-nav { flex-direction: row; overflow-x: auto; padding: 0.5rem; }
  .nav-item { white-space: nowrap; }
  .topbar { flex-direction: column; gap: 1rem; padding: 1.25rem; }
  .section { padding: 1.5rem 1.25rem; }
  .revisores-grid { grid-template-columns: 1fr; }
}
</style>
