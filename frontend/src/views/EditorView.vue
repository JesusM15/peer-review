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
        <button class="nav-item" :class="{ active: vistaActiva === 'asignaciones' }" id="nav-asignaciones-editor" @click="vistaActiva = 'asignaciones'">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Asignaciones
        </button>
      </nav>

      <div class="sidebar-footer">
        <div class="user-chip">
          <div class="user-avatar">E</div>
          <div class="user-info">
            <span class="user-name">Editor</span>
            <span class="user-role">editor@uni.edu</span>
          </div>
        </div>
        <button class="back-btn" id="btn-salir-editor" @click="goBack">
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
            <h1 class="page-title">Panel editorial</h1>
            <p class="page-sub">Resumen del estado del sistema</p>
          </div>
          <button class="btn-primary" id="btn-ir-asignar" @click="vistaActiva = 'asignaciones'">
            + Asignar revisor
          </button>
        </header>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-header">
              <span class="stat-dot recibido"></span>
              <span class="stat-label">Recibidos</span>
            </div>
            <span class="stat-value">0</span>
            <p class="stat-desc">Artículos enviados por autores</p>
          </div>
          <div class="stat-card">
            <div class="stat-header">
              <span class="stat-dot revision"></span>
              <span class="stat-label">En revisión</span>
            </div>
            <span class="stat-value">0</span>
            <p class="stat-desc">Artículos con revisor asignado</p>
          </div>
          <div class="stat-card">
            <div class="stat-header">
              <span class="stat-dot aceptado"></span>
              <span class="stat-label">Aceptados</span>
            </div>
            <span class="stat-value">0</span>
            <p class="stat-desc">Aprobados para publicación</p>
          </div>
          <div class="stat-card">
            <div class="stat-header">
              <span class="stat-dot rechazado"></span>
              <span class="stat-label">Rechazados</span>
            </div>
            <span class="stat-value">0</span>
            <p class="stat-desc">Requieren revisión mayor</p>
          </div>
        </div>

        <div class="section">
          <h2 class="section-title">Actividad reciente</h2>
          <div class="empty-state">
            <div class="empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3>Sin artículos en el sistema</h3>
            <p>Cuando los autores envíen artículos, aparecerán aquí para ser gestionados.</p>
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
          <button class="btn-primary" id="btn-asignar-desde-panel" @click="vistaActiva = 'asignaciones'">
            + Asignar revisor
          </button>
        </header>
        <div class="section">
          <div class="empty-state">
            <div class="empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3>Sin artículos en el sistema</h3>
            <p>Cuando los autores envíen artículos, aparecerán aquí para ser gestionados.</p>
          </div>
        </div>
      </template>

      <!-- ─── ASIGNACIONES ──────────────────────────── -->
      <template v-if="vistaActiva === 'asignaciones'">
        <header class="topbar">
          <div>
            <h1 class="page-title">Asignaciones</h1>
            <p class="page-sub">Gestión de revisores por artículo</p>
          </div>
        </header>
        <div class="section">
          <div class="empty-state">
            <div class="empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3>Sin asignaciones activas</h3>
            <p>Asigna revisores a los artículos pendientes para comenzar el proceso.</p>
          </div>
        </div>
      </template>

    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const router = useRouter()
const vistaActiva = ref<string>('overview')
const goBack = () => router.push('/')
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
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); border-bottom: 1px solid #1e1e1e; }
.stat-card { padding: 1.75rem 2rem; border-right: 1px solid #1e1e1e; display: flex; flex-direction: column; gap: 0.5rem; }
.stat-card:last-child { border-right: none; }
.stat-header { display: flex; align-items: center; gap: 0.45rem; margin-bottom: 0.25rem; }
.stat-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.stat-dot.recibido  { background: #888; }
.stat-dot.revision  { background: #e5a24c; }
.stat-dot.aceptado  { background: #4ade80; }
.stat-dot.rechazado { background: #f87171; }
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
.btn-primary { background: #fff; color: #000; font-size: 0.825rem; font-weight: 600; padding: 0.6rem 1.2rem; border-radius: 6px; border: none; cursor: pointer; transition: opacity 0.15s; white-space: nowrap; }
.btn-primary:hover { opacity: 0.88; }
@media (max-width: 900px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 768px) {
  .dashboard { flex-direction: column; }
  .sidebar { width: 100%; min-width: unset; height: auto; position: static; border-right: none; border-bottom: 1px solid #1e1e1e; }
  .sidebar-nav { flex-direction: row; overflow-x: auto; padding: 0.5rem; }
  .nav-item { white-space: nowrap; }
  .topbar { flex-direction: column; gap: 1rem; padding: 1.25rem; }
  .section { padding: 1.5rem 1.25rem; }
}
</style>
