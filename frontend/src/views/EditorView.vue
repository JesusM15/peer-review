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
        <div v-if="congressStore.currentCongressId" class="congress-context">
          <span class="congress-name-text">{{ currentCongressName }}</span>
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
        <button class="nav-item" :class="{ active: vistaActiva === 'solicitudes' }" id="nav-solicitudes-editor" @click="irASolicitudes">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Solicitudes
        </button>
        <button class="nav-item" :class="{ active: vistaActiva === 'congress-tags' }" id="nav-tags-editor-view" @click="vistaActiva = 'congress-tags'">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Tags del Congreso
        </button>
        <button class="nav-item" :class="{ active: vistaActiva === 'staffchat' }" id="nav-staffchat-editor" @click="vistaActiva = 'staffchat'">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Chat Staff
        </button>
        <button class="nav-item" id="nav-perfil-editor" @click="router.push('/perfil')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Perfil
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
            <button class="menu-item" @click="changeCongress">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                 <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" stroke-linecap="round" stroke-linejoin="round"/>
               </svg>
               Cambiar de congreso
            </button>
            <button class="menu-item text-danger" id="btn-salir-editor" @click="logout">
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
          <!-- Article Picker (Mejorado) -->
          <div class="article-picker-container">
            <div class="picker-controls">
              <div class="search-input-group">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="search-icon">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input 
                  type="text" 
                  v-model="searchArticulo" 
                  placeholder="Buscar artículo por título..." 
                  class="form-input search-bar"
                >
              </div>
              <CustomSelect 
                v-model="filtroEstadoArticulo" 
                :options="OPCIONES_ESTADO"
                class="filter-select"
              />
            </div>

            <div v-if="articulosFiltrados.length === 0" class="empty-state-sm">
              No se encontraron artículos con esos filtros.
            </div>
            <div v-else class="articulos-picker-grid">
              <div 
                v-for="art in articulosFiltrados" 
                :key="art.id" 
                class="art-picker-card"
                :class="{ active: articuloSeleccionadoId === art.id }"
                @click="seleccionarArticulo(art)"
              >
                <div class="art-card-main">
                  <div class="art-card-id-row">
                    <span class="badge" :class="badgeClass(art.estado)">{{ art.estado }}</span>
                    <span class="art-time">ID: {{ art.id.split('-')[0] }}</span>
                  </div>
                  <h4 class="art-card-title">{{ art.titulo }}</h4>
                  <div class="art-card-meta">
                    <div class="meta-item" title="Autor del artículo">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      <span>Anónimo</span>
                    </div>
                    <div class="meta-item" title="Revisores asignados actualmente">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 00-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 010 7.75"></path>
                      </svg>
                      <span class="rev-pill">{{ (art.asignaciones || []).length }} revisores</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Revisores ya asignados al artículo seleccionado -->
          <div v-if="articuloSeleccionadoId && revisoresDelArticulo.length > 0" class="asignados-section">
            <h3 class="sub-title">Revisores ya asignados</h3>
            <div class="revisores-asignados-list">
              <div v-for="rv in revisoresDelArticulo" :key="rv.revisor_id" class="revisor-asignado-chip">
                <span class="chip-avatar">{{ (rv.revisor?.perfil?.nombre || rv.revisor_id || '?').toString().charAt(0).toUpperCase() }}</span>
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
                    <button class="gmail-btn gmail-btn-sm" @click.stop="enviarCorreoGmail(rev.email)" title="Enviar correo por Gmail">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </button>
                    <button 
                      class="whatsapp-btn whatsapp-btn-sm" 
                      @click.stop="enviarWhatsApp(rev.telefono)" 
                      title="Enviar mensaje por WhatsApp"
                      :disabled="!rev.telefono"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M3 21l1.65-5.67A8.94 8.94 0 0121 12a9 9 0 10-9 9 8.94 8.94 0 01-3.35-.67L3 21z" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M9 10a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v2a.5.5 0 01-.5.5h-2a.5.5 0 01-.5.5v-2zM12.5 10a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v2a.5.5 0 01-.5.5h-2a.5.5 0 01-.5.5v-2z" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </button>
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
            <h1 class="page-title">Revisores de {{ currentCongressName }}</h1>
            <p class="page-sub">Revisores con membresía en este congreso y sus artículos asignados</p>
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
            <h3>No hay revisores en este congreso</h3>
            <p>Aún no hay revisores con membresía en <strong>{{ currentCongressName }}</strong>. Los revisores deben ser asignados al congreso primero.</p>
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
                    <button class="gmail-btn" @click.stop="enviarCorreoGmail(rev.email)" title="Enviar correo por Gmail">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </button>
                    <button 
                      class="whatsapp-btn" 
                      @click.stop="enviarWhatsApp(rev.telefono)" 
                      title="Enviar mensaje por WhatsApp"
                      :disabled="!rev.telefono"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M3 21l1.65-5.67A8.94 8.94 0 0121 12a9 9 0 10-9 9 8.94 8.94 0 01-3.35-.67L3 21z" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M9 10a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v2a.5.5 0 01-.5.5h-2a.5.5 0 01-.5.5v-2zM12.5 10a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v2a.5.5 0 01-.5.5h-2a.5.5 0 01-.5.5v-2z" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </button>
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

      <!-- ─── SOLICITUDES DE ROL ─────────────────────── -->
      <template v-if="vistaActiva === 'solicitudes'">
        <header class="topbar">
          <div>
            <h1 class="page-title">Solicitudes de Rol</h1>
            <p class="page-sub">Gestiona las peticiones de ascenso de los usuarios</p>
          </div>
        </header>

        <div class="section">
          <div v-if="cargandoSolicitudes" class="loading-state">
            <div class="spinner"></div>
            <span>Cargando solicitudes...</span>
          </div>
          <div v-else-if="solicitudesRol.length === 0" class="empty-state">
            <div class="empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3>No hay solicitudes pendientes</h3>
            <p>Las peticiones de cambio de rol aparecerán aquí.</p>
          </div>
          <div v-else class="solicitudes-grid">
            <div v-for="sol in solicitudesRol" :key="sol.id" class="sol-card" :class="sol?.estado?.toLowerCase()">
              <div class="sol-card-header">
                <div class="sol-user-info">
                  <div class="sol-avatar">{{ sol.user?.nombre?.charAt(0).toUpperCase() }}</div>
                  <div>
                    <h4 class="sol-user-name">{{ sol.user?.nombre }}</h4>
                    <span class="sol-user-email">{{ sol.user?.email }}</span>
                  </div>
                </div>
                <span class="sol-badge">{{ sol.rol_solicitado }}</span>
              </div>
              <div class="sol-card-body">
                <p class="sol-motivo"><strong>Motivo:</strong> {{ sol.motivo_usuario }}</p>
                <div v-if="sol.estado === 'Pendiente'" class="sol-actions">
                  <button class="btn-action approve" @click="responderSolicitud(sol, 'Aprobado')" title="Aceptar">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Aceptar
                  </button>
                  <button class="btn-action reject" @click="responderSolicitud(sol, 'Rechazado')" title="Denegar">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Denegar
                  </button>
                </div>
                <div v-else class="sol-resolved">
                  <span class="resolved-label">Estado: {{ sol.estado }}</span>
                  <p v-if="sol.respuesta_admin" class="sol-feedback"><strong>Feedback:</strong> {{ sol.respuesta_admin }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- ─── STAFF CHAT ───────────────────────────── -->
      <template v-if="vistaActiva === 'staffchat'">
        <header class="topbar">
          <div>
            <h1 class="page-title">Chat del Staff</h1>
            <p class="page-sub">Comunicación interna del congreso seleccionado</p>
          </div>
        </header>
        <div class="section">
          <StaffChat :congresoId="congressStore.currentCongressId" :jwt="authStore.token" />
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
            <span class="modal-field-label">Teléfono</span>
            <span class="modal-field-value">{{ modalRevisor.telefono || 'No proporcionado' }}</span>
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
            <div class="modal-contact-buttons" v-if="modalRevisor.telefono">
              <button class="btn-secondary w-full" @click="enviarWhatsApp(modalRevisor.telefono)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width: 16px; height: 16px; margin-right: 8px;">
                  <path d="M3 21l1.65-5.67A8.94 8.94 0 0121 12a9 9 0 10-9 9 8.94 8.94 0 01-3.35-.67L3 21z" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M9 10a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v2a.5.5 0 01-.5.5h-2a.5.5 0 01-.5-.5v-2zM12.5 10a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v2a.5.5 0 01-.5.5h-2a.5.5 0 01-.5-.5v-2z" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Enviar mensaje por WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

      <!-- ─── TAGS DEL CONGRESO ────────────────────────── -->
      <template v-if="vistaActiva === 'congress-tags'">
        <header class="topbar">
          <div>
            <h1 class="page-title">Tags de {{ currentCongressName }}</h1>
            <p class="page-sub">Gestiona las etiquetas de clasificación de este congreso</p>
          </div>
        </header>

        <div class="section">
          <!-- Crear nuevo tag -->
          <div class="ct-create-card">
            <h3 class="ct-section-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:18px;height:18px">
                <path d="M12 4v16m8-8H4" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Nuevo tag
            </h3>
            <div class="ct-input-row">
              <input
                id="input-new-tag"
                v-model="nuevoTag"
                type="text"
                class="ct-input"
                placeholder="Nombre del tag (ej: Machine Learning)"
                maxlength="80"
                @keyup.enter="crearTag"
              />
              <button
                id="btn-crear-tag"
                class="btn-primary"
                :disabled="!nuevoTag.trim() || creandoTag"
                @click="crearTag"
              >
                {{ creandoTag ? 'Creando...' : 'Crear tag' }}
              </button>
            </div>
            <p v-if="tagMensaje" :class="['ct-msg', tagMensaje.tipo]">
              {{ tagMensaje.texto }}
            </p>
          </div>

          <!-- Lista de tags existentes -->
          <div class="ct-list-card">
            <h3 class="ct-section-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:18px;height:18px">
                <path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Tags actuales
            </h3>
            <div v-if="cargandoCongresoTags" class="loading-state">
              <div class="spinner"></div><span>Cargando tags...</span>
            </div>
            <div v-else-if="congresoTags.length === 0" class="ct-empty">
              Este congreso aún no tiene tags. ¡Crea el primero!
            </div>
            <div v-else class="ct-tags-grid">
              <div v-for="tag in congresoTags" :key="tag.id" class="ct-tag-chip">
                <span class="ct-tag-name">{{ tag.nombre }}</span>
                <button
                  class="ct-tag-delete"
                  :title="'Eliminar ' + tag.nombre"
                  @click="eliminarTag(tag.id)"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px">
                    <path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </template>

  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref, computed, onMounted, watch } from 'vue'
import { useTheme } from '../composables/useTheme'
import { useAuthStore } from '../stores/auth'
import { useCongressStore } from '../stores/congress'
import CustomSelect from '../components/CustomSelect.vue'
import CongressSelector from '../components/CongressSelector.vue'
import StaffChat from '../components/StaffChat.vue'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const router = useRouter()
const { isDark, toggleTheme } = useTheme()
const authStore = useAuthStore()
const congressStore = useCongressStore()

const authHeaders = (extra: Record<string, string> = {}) => {
  const headers: Record<string, string> = {}
  if (authStore.token) {
    headers.Authorization = `Bearer ${authStore.token}`
  }
  return { ...headers, ...extra }
}

const showUserMenu = ref(false)
const vistaActiva = ref<string>('overview')
const goBack = () => router.push('/')

const currentCongressName = computed(() => {
  const c = congressStore.memberships.find(m => m.congreso_id === congressStore.currentCongressId)
  return c?.congreso?.nombre || 'Sin Congreso'
})

const changeCongress = () => {
  congressStore.setCongress('') // Limpiar selección actual
  router.push('/select-congress')
}

const logout = () => {
  authStore.logout()
  router.push('/login')
}

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


// ── Solicitudes de Rol ────────────────────────────────
const solicitudesRol = ref<any[]>([])
const cargandoSolicitudes = ref(false)
const responderSolicitudId = ref('')
const feedbackResolucion = ref('')

// ── Search & Filter (Asignaciones) ────────────────────
const searchArticulo = ref('')
const filtroEstadoArticulo = ref('')

const OPCIONES_ESTADO = [
  { label: 'Cualquier estado', value: '' },
  { label: 'Recibidos (Borrador)', value: 'Borrador' },
  { label: 'En proceso', value: 'En Revisión' },
  { label: 'Aceptados', value: 'Aceptado' },
  { label: 'Rechazados', value: 'Rechazado' },
]

const articulosFiltrados = computed(() => {
  return articulos.value.filter(art => {
    const textMatch = art.titulo.toLowerCase().includes(searchArticulo.value.toLowerCase()) ||
                     (art.autor?.perfil?.nombre || '').toLowerCase().includes(searchArticulo.value.toLowerCase())
    const statusMatch = !filtroEstadoArticulo.value || art.estado === filtroEstadoArticulo.value
    return textMatch && statusMatch
  })
})

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
    const params = new URLSearchParams()
    params.append('include_relations', 'true')
    if (congressStore.currentCongressId) {
      params.append('congreso_id', congressStore.currentCongressId)
    }
    const res = await fetch(`${API}/articulos?${params.toString()}`)
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
    const congresoId = congressStore.currentCongressId
    const url = congresoId
      ? `${API}/asignaciones/revisores?congreso_id=${congresoId}`
      : `${API}/asignaciones/revisores`
    const res = await fetch(url, { headers: authHeaders() })
    if (!res.ok) {
      console.error('Error cargando revisores', res.status)
      revisores.value = []
      return
    }
    revisores.value = await res.json()
  } catch (e) {
    console.error('Error cargando revisores', e)
    revisores.value = []
  } finally {
    cargandoRevisores.value = false
  }
}

async function cargarAsignacionesDeArticulo(articuloId: string) {
  try {
    const res = await fetch(`${API}/asignaciones?revisor_id=&include_relations=true`, {
      headers: authHeaders(),
    })
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

// ── Tags del Congreso ─────────────────────────────────
const congresoTags = ref<any[]>([])
const cargandoCongresoTags = ref(false)
const nuevoTag = ref('')
const creandoTag = ref(false)
const tagMensaje = ref<{ texto: string; tipo: string } | null>(null)

async function cargarCongresoTags() {
  const cid = congressStore.currentCongressId
  if (!cid) return
  cargandoCongresoTags.value = true
  try {
    const res = await fetch(`${API}/congresos/${cid}/tags`, { headers: authHeaders() })
    congresoTags.value = res.ok ? await res.json() : []
  } catch {
    congresoTags.value = []
  } finally {
    cargandoCongresoTags.value = false
  }
}

async function crearTag() {
  const nombre = nuevoTag.value.trim()
  if (!nombre) return
  const cid = congressStore.currentCongressId
  if (!cid) return
  creandoTag.value = true
  tagMensaje.value = null
  try {
    const res = await fetch(`${API}/congresos/${cid}/tags`, {
      method: 'POST',
      headers: authHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ nombre }),
    })
    if (res.ok) {
      nuevoTag.value = ''
      tagMensaje.value = { texto: `Tag "${nombre}" creado correctamente.`, tipo: 'success' }
      await cargarCongresoTags()
      setTimeout(() => { tagMensaje.value = null }, 3000)
    } else {
      const err = await res.json().catch(() => ({}))
      tagMensaje.value = { texto: err.message || 'Error al crear el tag.', tipo: 'error' }
    }
  } catch {
    tagMensaje.value = { texto: 'Error de conexión al crear el tag.', tipo: 'error' }
  } finally {
    creandoTag.value = false
  }
}

async function eliminarTag(tagId: string) {
  if (!confirm('¿Eliminar este tag del congreso? Los revisores y editores perderán esta asignación.')) return
  try {
    const res = await fetch(`${API}/congresos/congreso-tag/${tagId}`, {
      method: 'DELETE',
      headers: authHeaders(),
    })
    if (res.ok) {
      await cargarCongresoTags()
    }
  } catch (e) {
    console.error('Error eliminando tag', e)
  }
}

async function irASolicitudes() {
  vistaActiva.value = 'solicitudes'
  await cargarSolicitudes()
}

async function cargarSolicitudes() {
  if (!congressStore.currentCongressId) return
  cargandoSolicitudes.value = true
  try {
    const res = await fetch(`${API}/solicitudes/congreso/${congressStore.currentCongressId}`, {
      headers: authHeaders(),
    })
    solicitudesRol.value = await res.json()
  } catch (e) {
    console.error('Error cargando solicitudes', e)
  } finally {
    cargandoSolicitudes.value = false
  }
}

async function responderSolicitud(sol: any, estado: string) {
  const respuesta = prompt(`Escribe un breve feedback para ${sol.user?.nombre} (opcional):`)
  // Permitimos cancelar si no hay respuesta y es rechazo, o simplemente enviar vacío
  if (respuesta === null) return

  try {
    const res = await fetch(`${API}/solicitudes/${sol.id}/responder`, {
      method: 'PATCH',
      headers: authHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ 
        estado, 
        respuesta: respuesta || (estado === 'Aprobado' ? '¡Bienvenido al equipo!' : 'Lo sentimos, por ahora no cumples con el perfil.') 
      })
    })
    if (res.ok) {
      await cargarSolicitudes()
      if (estado === 'Aprobado') {
        await cargarRevisores() // Refrescar lista de revisores por si acaso
      }
    }
  } catch (e) {
    console.error('Error respondiendo solicitud', e)
  }
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

function seleccionarArticulo(art: any) {
  articuloSeleccionadoId.value = art.id
  onArticuloChange()
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
      headers: authHeaders({ 'Content-Type': 'application/json' }),
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
    await fetch(`${API}/asignaciones/${asignacionId}`, {
      method: 'DELETE',
      headers: authHeaders(),
    })
    await cargarAsignacionesDeArticulo(articuloSeleccionadoId.value)
    await cargarRevisores()
  } catch (e) {
    console.error('Error eliminando asignación', e)
  }
}

// ── Gmail button ───────────────────────────────────────
function enviarCorreoGmail(reviewerEmail: string) {
  const editorEmail = 'editor@uni.edu'
  const subject = encodeURIComponent('Comunicación sobre revisión de artículo')
  const body = encodeURIComponent(`Estimado/a revisor/a,\n\nLe escribo en relación con la revisión de artículos en el sistema.\n\nAtentamente,\nEditor`)
  const gmailUrl = `https://mail.google.com/mail/?view=cm&to=${reviewerEmail}&cc=${editorEmail}&su=${subject}&body=${body}`
  window.open(gmailUrl, '_blank')
}

// ── WhatsApp button ─────────────────────────────────────
function enviarWhatsApp(phoneNumber: string | null) {
  if (!phoneNumber) return
  
  // Remove any non-digit characters and ensure it starts with country code
  const cleanPhone = phoneNumber.replace(/\D/g, '')
  const formattedPhone = cleanPhone.startsWith('52') ? cleanPhone : `52${cleanPhone}` // Default to Mexico country code
  
  const message = encodeURIComponent('Estimado/a revisor/a,\n\nLe escribo en relación con la revisión de artículos en el sistema.\n\nAtentamente,\nEditor')
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${message}`
  
  window.open(whatsappUrl, '_blank')
}

// ── Init ──────────────────────────────────────────────
watch(() => congressStore.currentCongressId, () => {
  cargarArticulos()
})

onMounted(async () => {
  await cargarArticulos()
})

watch(vistaActiva, (newVal) => {
  if (newVal === 'congress-tags') {
    cargarCongresoTags()
  }
})
</script>

<style scoped>
.dashboard { display: flex; min-height: 100vh; background: transparent; }

/* ── Sidebar ── */
.sidebar { width: 220px; min-width: 220px; border-right: 1px solid var(--border-color); display: flex; flex-direction: column; background: var(--bg-sidebar); position: sticky; top: 0; height: 100vh; }
.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid #eaeaea;
}

.congress-context {
  margin-top: 0.5rem;
}

.congress-name-text {
  font-size: 0.7rem;
  font-weight: 600;
  color: #10b981;
  letter-spacing: 0.02em;
  opacity: 0.9;
}

.dark .congress-name-text {
  color: #34d399;
  text-shadow: 0 0 8px rgba(52, 211, 153, 0.3);
}
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
.btn-secondary { background: var(--bg-input); color: var(--text-strong); font-size: 0.825rem; font-weight: 600; padding: 0.6rem 1.2rem; border-radius: 6px; border: 1px solid var(--border-color); cursor: pointer; transition: all 0.15s; white-space: nowrap; display: flex; align-items: center; justify-content: center; }
.btn-secondary:hover { background: var(--bg-card-hover); border-color: var(--border-hover); }
.btn-secondary.w-full { width: 100%; margin-top: 0.75rem; }
.modal-contact-buttons { display: flex; flex-direction: column; gap: 0.75rem; margin-top: 0.75rem; }
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
.badge-borrador { background: var(--bg-input); color: var(--text-muted); }
.badge-revision { background: var(--warning-faint); color: var(--warning); }
.badge-aceptado { background: var(--success-faint); color: var(--success); }
.badge-rechazado { background: var(--error-faint); color: var(--error); }
[data-theme="dark"] .badge-revision { color: #fbbf24; }
[data-theme="dark"] .badge-aceptado { color: #4ade80; }
[data-theme="dark"] .badge-rechazado { color: #f87171; }

/* ── Form ── */
.form-group { margin-bottom: 1.5rem; }
.form-label { display: block; font-size: 0.8rem; font-weight: 600; color: var(--text-muted); margin-bottom: 0.5rem; }
.form-select { width: 100%; max-width: 480px; padding: 0.6rem 0.9rem; border: 1px solid var(--border-color); border-radius: 6px; background: var(--bg-input); color: var(--text-strong); font-size: 0.85rem; cursor: pointer; }
.form-select:focus { outline: none; border-color: var(--border-hover); }
.form-input { width: 100%; padding: 0.6rem 0.9rem; border: 1px solid var(--border-color); border-radius: 6px; background: var(--bg-input); color: var(--text-strong); font-size: 0.85rem; }
.form-input:focus { outline: none; border-color: var(--border-hover); }

/* ── Article Picker ── */
.article-picker-container { margin-bottom: 2rem; }
.picker-controls { display: flex; gap: 1rem; margin-bottom: 1.25rem; }
.search-input-group { flex: 1; position: relative; }
.search-icon { position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; color: var(--text-faint); pointer-events: none; }
.search-bar { padding-left: 2.5rem; }
.filter-select { width: 180px; }

.articulos-picker-grid { 
  display: grid; 
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); 
  gap: 1rem; 
  max-height: 280px; 
  overflow-y: auto;
  padding-right: 0.5rem;
}
.articulos-picker-grid::-webkit-scrollbar { width: 6px; }
.articulos-picker-grid::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 10px; }

.art-picker-card { 
  background: var(--bg-card); 
  border: 1px solid var(--border-color); 
  border-radius: 10px; 
  padding: 1rem; 
  cursor: pointer; 
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}
.art-picker-card:hover { border-color: var(--border-hover); background: var(--bg-card-hover); }
.art-picker-card.active { border-color: var(--btn-primary-bg); background: var(--bg-input); box-shadow: 0 0 0 2px var(--btn-primary-bg); }

.art-card-id-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.6rem; }
.art-time { font-size: 0.65rem; color: var(--text-faint); font-weight: 600; text-transform: uppercase; }
.art-card-title { font-size: 0.9rem; font-weight: 700; color: var(--text-strong); margin-bottom: 0.75rem; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; height: 2.8em; }
.art-card-meta { display: flex; align-items: center; gap: 1rem; }
.meta-item { display: flex; align-items: center; gap: 0.35rem; font-size: 0.75rem; color: var(--text-muted); font-weight: 500; }
.meta-item svg { width: 14px; height: 14px; color: var(--text-faint); }
.rev-pill { 
  background: var(--bg-input); 
  padding: 0.2rem 0.6rem; 
  border-radius: 99px; 
  border: 1px solid var(--border-color);
  font-weight: 600;
  font-size: 0.68rem;
  color: var(--text-strong);
}
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
.rev-count.count-full { background: var(--error-faint); color: var(--error); border-color: var(--error-faint); }
.rev-count-label { font-size: 0.65rem; color: var(--text-faint); }
.gmail-btn { background: none; border: none; cursor: pointer; color: var(--text-muted); padding: 0.3rem; border-radius: 4px; transition: all 0.15s; margin-top: 0.2rem; }
.gmail-btn:hover { background: var(--bg-card-hover); color: #ea4335; }
.gmail-btn svg { width: 16px; height: 16px; }
.gmail-btn-sm { padding: 0.2rem; }
.gmail-btn-sm svg { width: 14px; height: 14px; }
.whatsapp-btn { background: none; border: none; cursor: pointer; color: var(--text-muted); padding: 0.3rem; border-radius: 4px; transition: all 0.15s; margin-top: 0.2rem; }
.whatsapp-btn:hover:not(:disabled) { background: var(--bg-card-hover); color: #25D366; }
.whatsapp-btn:disabled { opacity: 0.3; cursor: not-allowed; }
.whatsapp-btn svg { width: 16px; height: 16px; }
.whatsapp-btn-sm { padding: 0.2rem; }
.whatsapp-btn-sm svg { width: 14px; height: 14px; }
.rev-tags { display: flex; flex-wrap: wrap; gap: 0.35rem; }
.tag { font-size: 0.68rem; font-weight: 500; padding: 0.2rem 0.5rem; border-radius: 99px; background: var(--bg-input); color: var(--text-muted); border: 1px solid var(--border-color); }
.rev-footer { margin-top: 0.75rem; }
.status-chip { font-size: 0.7rem; font-weight: 600; padding: 0.25rem 0.6rem; border-radius: 99px; }
.libre-chip { background: var(--success-faint); color: var(--success); }
.lleno-chip { background: var(--error-faint); color: var(--error); }
.asignado-chip { background: var(--primary-faint); color: var(--primary); }


/* ── Solicitudes ── */
.solicitudes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1.5rem;
}
.sol-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.25rem;
  transition: transform 0.2s;
}
.sol-card:hover { transform: translateY(-2px); }
.sol-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}
.sol-user-info { display: flex; gap: 0.75rem; align-items: center; }
.sol-avatar {
  width: 40px;
  height: 40px;
  background: var(--bg-input);
  border: 1px solid var(--border-hover);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: var(--text-strong);
}
.sol-user-name { font-size: 0.95rem; font-weight: 700; color: var(--text-strong); }
.sol-user-email { font-size: 0.75rem; color: var(--text-faint); }
.sol-badge {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  background: var(--bg-input);
  color: var(--text-strong);
  text-transform: uppercase;
}
.sol-card-body { font-size: 0.85rem; }
.sol-motivo { line-height: 1.5; color: var(--text-normal); margin-bottom: 1.25rem; }
.sol-actions { display: flex; gap: 0.75rem; }
.btn-action {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.6rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
}
.btn-action svg { width: 16px; height: 16px; }
.btn-action.approve { background: var(--success-faint); color: var(--success); border-color: var(--success-faint); }
.btn-action.approve:hover { background: var(--success-faint); opacity: 0.8; }
.btn-action.reject { background: var(--error-faint); color: var(--error); border-color: var(--error-faint); }
.btn-action.reject:hover { background: var(--error-faint); opacity: 0.8; }

.sol-resolved {
  padding: 0.75rem;
  background: var(--bg-input);
  border-radius: 8px;
  font-size: 0.8rem;
}
.resolved-label { display: block; font-weight: 700; margin-bottom: 0.4rem; color: var(--text-muted); }
.sol-feedback { color: var(--text-normal); font-style: italic; }

.sol-card.aprobado { border-left: 4px solid var(--success); }
.sol-card.rechazado { border-left: 4px solid var(--error); }

/* ── Revisores asignados chips ── */
.asignados-section { margin-bottom: 1.5rem; }
.revisores-asignados-list { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.revisor-asignado-chip { display: inline-flex; align-items: center; gap: 0.4rem; background: var(--bg-input); border: 1px solid var(--border-color); border-radius: 99px; padding: 0.3rem 0.6rem 0.3rem 0.4rem; font-size: 0.78rem; font-weight: 500; color: var(--text-strong); }
.chip-avatar { width: 20px; height: 20px; border-radius: 50%; background: var(--btn-primary-bg); color: var(--btn-primary-text); display: flex; align-items: center; justify-content: center; font-size: 0.65rem; font-weight: 700; flex-shrink: 0; }
.chip-remove { background: none; border: none; cursor: pointer; color: var(--text-faint); font-size: 1rem; line-height: 1; padding: 0 0.15rem; transition: color 0.15s; }
.chip-remove:hover { color: var(--stat-rechazado); }

/* ── Toast/mensaje ── */
.mensaje-toast { font-size: 0.8rem; font-weight: 500; padding: 0.6rem 1rem; border-radius: 6px; }
.mensaje-toast.success { background: var(--success-faint); color: var(--success); border: 1px solid var(--success-faint); }
.mensaje-toast.error { background: var(--error-faint); color: var(--error); border: 1px solid var(--error-faint); }

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

/* ── Tags Management ── */
.tags-management { display: flex; flex-direction: column; gap: 2rem; }
.add-tag-box { display: flex; gap: 1rem; max-width: 500px; }
.tags-list-admin { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }
.tag-admin-card { display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1rem; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 8px; font-weight: 500; color: var(--text-strong); }
.btn-icon { background: none; border: none; cursor: pointer; color: var(--text-faint); padding: 0.25rem; border-radius: 4px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
.btn-icon svg { width: 16px; height: 16px; }
.btn-icon.delete:hover { color: var(--error); background: var(--error-faint); }

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
  .ct-input-row { flex-direction: column; }
}

/* ── Congress Tags Panel ──────────────────────────────── */
.ct-create-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.75rem;
  margin-bottom: 1.5rem;
  position: relative;
  overflow: hidden;
}
.ct-create-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(99,102,241,.06) 0%, rgba(168,85,247,.04) 100%);
  pointer-events: none;
}

.ct-list-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.75rem;
  margin-bottom: 1.25rem;
}

.ct-section-title {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-main);
  margin: 0 0 1.25rem 0;
  letter-spacing: -0.01em;
}
.ct-section-title svg { color: var(--accent); flex-shrink: 0; }

.ct-input-row {
  display: flex;
  gap: 0.75rem;
  align-items: stretch;
}

.ct-input {
  flex: 1;
  padding: 0.75rem 1.1rem;
  border: 1.5px solid var(--border-color);
  border-radius: 10px;
  background: var(--bg-main, #fff);
  color: var(--text-main);
  font-size: 0.92rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  font-family: inherit;
}
.ct-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(99,102,241,.15);
}
.ct-input::placeholder { color: var(--text-faint); }

.ct-msg {
  font-size: 0.84rem;
  margin-top: 0.85rem;
  padding: 0.6rem 0.9rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  animation: fadeIn 0.2s ease;
}
.ct-msg.success { background: #d1fae5; color: #065f46; border: 1px solid #a7f3d0; }
.ct-msg.error   { background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; }

.ct-empty {
  color: var(--text-faint);
  font-size: 0.9rem;
  text-align: center;
  padding: 2.5rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.ct-tags-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
}

.ct-tag-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  background: linear-gradient(135deg, rgba(99,102,241,.12), rgba(168,85,247,.08));
  color: var(--accent);
  border: 1.5px solid rgba(99,102,241,.28);
  border-radius: 999px;
  padding: 0.4rem 0.55rem 0.4rem 1rem;
  font-size: 0.83rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  transition: background 0.18s, border-color 0.18s, transform 0.15s;
  cursor: default;
}
.ct-tag-chip:hover {
  background: linear-gradient(135deg, rgba(99,102,241,.2), rgba(168,85,247,.14));
  border-color: rgba(99,102,241,.45);
  transform: translateY(-1px);
}

.ct-tag-name { line-height: 1; }

.ct-tag-delete {
  background: rgba(99,102,241,.1);
  border: none;
  cursor: pointer;
  padding: 3px;
  color: var(--accent);
  opacity: 0.75;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.15s, background 0.15s, transform 0.1s;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}
.ct-tag-delete:hover {
  opacity: 1;
  background: rgba(239,68,68,.18);
  color: #ef4444;
  transform: scale(1.15);
}

@keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }

</style>
