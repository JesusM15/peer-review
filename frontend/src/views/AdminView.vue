<template>
  <div class="dashboard">

    <!-- ── Sidebar ── -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="brand">
          <svg class="brand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="brand-name">Peer Review</span>
      </div>
    </div>

      <nav class="sidebar-nav">
        <button class="nav-item active" id="nav-admin-overview" @click="currentView = 'overview'">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Overview
        </button>
        <button class="nav-item" id="nav-admin-users" @click="currentView = 'users'">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Usuarios
        </button>
        <button class="nav-item" :class="{ active: currentView === 'articles' }" id="nav-admin-articles" @click="goToArticles">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Artículos
        </button>
        <button class="nav-item" :class="{ active: currentView === 'solicitudes-congreso' }" id="nav-admin-solicitudes-congreso" @click="abrirSolicitudesCongreso">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Solicitudes de Congreso
          <span v-if="solicitudesPendientesCount > 0" class="nav-badge">{{ solicitudesPendientesCount }}</span>
        </button>
        <button class="nav-item" :class="{ active: currentView === 'ai-settings' }" id="nav-admin-ai" @click="currentView = 'ai-settings'">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M12 2a10 10 0 100 20 10 10 0 000-20zM12 6a6 6 0 110 12 6 6 0 010-12z" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 8v4l3 3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Configuración IA
        </button>
      </nav>

      <div class="sidebar-footer relative-footer">
        <div class="user-menu-dropdown" v-if="showMenu">
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
           <button class="menu-item text-danger" id="btn-salir-admin" @click="logout">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Cerrar sesión
           </button>
        </div>
        <button class="user-chip user-chip-btn" @click="showMenu = !showMenu" :class="{ active: showMenu }">
          <div class="user-avatar">{{ userInitial }}</div>
          <div class="user-info">
            <span class="user-name">{{ currentUser?.nombre || 'Admin' }}</span>
            <span class="user-role">{{ currentUser?.email || 'admin@diego.edu' }}</span>
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
      <template v-if="currentView === 'overview'">
        <header class="topbar">
          <div>
            <h1 class="page-title">Dashboard de Administración</h1>
            <p class="page-sub">Resumen del sistema</p>
          </div>
          <div class="topbar-actions">
            <div class="notif-wrapper">
              <button class="notif-btn" @click="toggleNotifPanel" title="Notificaciones">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span v-if="notificacionesNoLeidas > 0" class="notif-dot">{{ notificacionesNoLeidas }}</span>
              </button>
              <div v-if="showNotifPanel" class="notif-panel" @click.stop>
                <div class="notif-panel-header">
                  <span>Notificaciones</span>
                  <button v-if="notificacionesNoLeidas > 0" class="notif-mark-all" @click="marcarTodasLeidas">Marcar todas como leídas</button>
                </div>
                <div v-if="notificacionesLoading" class="notif-empty">Cargando...</div>
                <div v-else-if="notificaciones.length === 0" class="notif-empty">Sin notificaciones</div>
                <ul v-else class="notif-list">
                  <li
                    v-for="notif in notificaciones"
                    :key="notif.id"
                    class="notif-item"
                    :class="{ 'unread': !notif.leida }"
                    @click="abrirNotificacion(notif)"
                  >
                    <div class="notif-item-title">{{ notif.titulo }}</div>
                    <div class="notif-item-msg">{{ notif.mensaje }}</div>
                    <div class="notif-item-date">{{ formatDateNotif(notif.fecha_creacion) }}</div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </header>
        
        <!-- Stats Cards -->
        <div class="stats-grid">
          <div class="stat-card total">
            <div class="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ stats?.totalUsers || 0 }}</span>
              <span class="stat-label">Total Usuarios</span>
            </div>
          </div>
          <div class="stat-card authors">
            <div class="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
              </svg>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ stats?.usersByRole?.Autor || 0 }}</span>
              <span class="stat-label">Autores</span>
            </div>
          </div>
          <div class="stat-card reviewers">
            <div class="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ stats?.usersByRole?.Revisor || 0 }}</span>
              <span class="stat-label">Revisores</span>
            </div>
          </div>
          <div class="stat-card editors">
            <div class="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ stats?.usersByRole?.Editor || 0 }}</span>
              <span class="stat-label">Editores</span>
            </div>
          </div>
        </div>

        <!-- Chart Section -->
        <div class="chart-section pie-chart-section">
          <h2 class="chart-section-title">Distribución de Usuarios</h2>
          <div class="chart-container pie-chart-container">
            <Pie v-if="chartData" :data="chartData" :options="chartOptions" />
            <div v-else class="chart-loading">Cargando estadísticas...</div>
          </div>
        </div>

        <!-- Article Stats Section -->
        <h2 class="section-title">Estadísticas de Artículos</h2>
        
        <!-- Article Metrics Cards -->
        <div class="stats-grid articles">
          <div class="stat-card articles-total">
            <div class="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ articleStats?.totalArticles || 0 }}</span>
              <span class="stat-label">Total Artículos</span>
            </div>
          </div>
          <div class="stat-card articles-review">
            <div class="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ articleStats?.articlesNeedingReview || 0 }}</span>
              <span class="stat-label">En Revisión</span>
            </div>
          </div>
          <div class="stat-card articles-completed">
            <div class="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ articleStats?.completedArticles || 0 }}</span>
              <span class="stat-label">Completados</span>
            </div>
          </div>
          <div class="stat-card articles-rate">
            <div class="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
              </svg>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ articleStats?.acceptanceRate || 0 }}%</span>
              <span class="stat-label">Tasa Aceptación</span>
            </div>
          </div>
        </div>

        <!-- Bar Charts Grid -->
        <div class="charts-grid">
          <!-- Article Status Chart -->
          <div class="chart-section">
            <h3 class="chart-title">Estado de Artículos</h3>
            <div class="chart-container-bar">
              <Bar v-if="articleStatusChartData" :data="articleStatusChartData" :options="barChartOptions" />
              <div v-else class="chart-loading">Cargando...</div>
            </div>
          </div>

          <!-- Top Authors Chart -->
          <div class="chart-section">
            <h3 class="chart-title">Top Autores</h3>
            <div class="chart-container-bar">
              <Bar v-if="topAuthorsChartData" :data="topAuthorsChartData" :options="barChartOptions" />
              <div v-else class="chart-loading">Cargando...</div>
            </div>
          </div>

          <!-- Reviewer Workload Chart -->
          <div class="chart-section">
            <h3 class="chart-title">Carga de Revisores</h3>
            <div class="chart-container-bar">
              <Bar v-if="reviewerWorkloadChartData" :data="reviewerWorkloadChartData" :options="barChartOptions" />
              <div v-else class="chart-loading">Cargando...</div>
            </div>
          </div>

        </div>

        <h2 class="section-title">Gestión de Usuarios</h2>
        
        <!-- Create User Button -->
        <button class="btn-primary" @click="showCreateModal = true">
          + Crear Usuario
        </button>

        <!-- Users Table -->
        <div class="table-container">
          <table class="users-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id">
                <td>{{ user.nombre }}</td>
                <td>{{ user.email }}</td>
                <td>
                  <span :class="['role-badge', user.rol.toLowerCase()]">{{ user.rol }}</span>
                </td>
                <td>
                  <button class="btn-icon" @click="editUser(user)">Editar</button>
                  <button class="btn-icon delete" @click="deleteUser(user.id)">Borrar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

      <!-- ─── SOLICITUDES DE CONGRESO ─────────────────── -->
      <template v-if="currentView === 'solicitudes-congreso'">
        <header class="topbar">
          <div>
            <h1 class="page-title">Solicitudes de Congreso</h1>
            <p class="page-sub">Revisa y aprueba propuestas de nuevos congresos enviadas por los usuarios.</p>
          </div>
          <div class="topbar-actions">
            <button class="refresh-btn" @click="cargarSolicitudesCongreso" :disabled="cargandoSolicitudesCongreso" title="Refrescar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="23 4 23 10 17 10"></polyline>
                <polyline points="1 20 1 14 7 14"></polyline>
                <path d="M3.51 9a9 9 0 0114.85-3.36L23 10"></path>
                <path d="M20.49 15A9 9 0 015.64 18.36L1 14"></path>
              </svg>
              Refrescar
            </button>
          </div>
        </header>

        <div class="sc-filters">
          <button
            class="filter-chip"
            :class="{ active: scFilter === 'pendientes' }"
            @click="scFilter = 'pendientes'"
          >
            Pendientes
            <span v-if="solicitudesPendientesCount > 0" class="filter-count">{{ solicitudesPendientesCount }}</span>
          </button>
          <button
            class="filter-chip"
            :class="{ active: scFilter === 'todas' }"
            @click="scFilter = 'todas'"
          >
            Todas
          </button>
        </div>

        <div v-if="cargandoSolicitudesCongreso" class="sc-loading">Cargando solicitudes...</div>
        <div v-else-if="solicitudesCongresoFiltradas.length === 0" class="sc-empty">
          {{ scFilter === 'pendientes' ? 'No hay solicitudes pendientes.' : 'Aún no hay solicitudes.' }}
        </div>
        <div v-else class="sc-grid">
          <div
            v-for="sol in solicitudesCongresoFiltradas"
            :key="sol.id"
            class="sc-card"
            :class="sol.estado.toLowerCase()"
          >
            <div class="sc-card-header">
              <h3 class="sc-card-title">{{ sol.nombre_propuesto }}</h3>
              <span class="sc-badge" :class="sol.estado.toLowerCase()">{{ sol.estado }}</span>
            </div>
            <div class="sc-card-body">
              <div class="sc-author">
                <div class="sc-avatar">{{ (sol.solicitante?.nombre || '?').charAt(0).toUpperCase() }}</div>
                <div>
                  <div class="sc-author-name">{{ sol.solicitante?.nombre || 'Usuario' }}</div>
                  <div class="sc-author-email">{{ sol.solicitante?.email || '' }}</div>
                </div>
              </div>
              <p v-if="sol.descripcion_propuesta" class="sc-desc">{{ sol.descripcion_propuesta }}</p>
              <div class="sc-dates" v-if="sol.fecha_inicio_propuesta || sol.fecha_fin_propuesta">
                <span v-if="sol.fecha_inicio_propuesta"><strong>Inicio:</strong> {{ formatDateOnly(sol.fecha_inicio_propuesta) }}</span>
                <span v-if="sol.fecha_fin_propuesta"><strong>Fin:</strong> {{ formatDateOnly(sol.fecha_fin_propuesta) }}</span>
              </div>
              <p v-if="sol.motivo" class="sc-motivo"><strong>Motivo:</strong> {{ sol.motivo }}</p>
              <p v-if="sol.respuesta_admin" class="sc-resp"><strong>Tu respuesta:</strong> {{ sol.respuesta_admin }}</p>
              <div class="sc-meta">Enviada: {{ formatDateNotif(sol.fecha_creacion) }}</div>
            </div>
            <div class="sc-card-actions" v-if="sol.estado === 'Pendiente'">
              <button class="sc-btn approve" @click="resolverSolicitudCongreso(sol, 'Aprobado')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5 13l4 4L19 7"/>
                </svg>
                Aprobar
              </button>
              <button class="sc-btn reject" @click="resolverSolicitudCongreso(sol, 'Rechazado')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M6 18L18 6M6 6l12 12"/>
                </svg>
                Rechazar
              </button>
            </div>
          </div>
        </div>
      </template>

      <!-- ─── ARTÍCULOS ───────────────────────────────── -->
      <template v-if="currentView === 'articles'">
        <header class="topbar">
          <div>
            <h1 class="page-title">Artículos</h1>
            <p class="page-sub">Lista de artículos. Ejecuta análisis con IA (plagio textual, alertas éticas y similitud).</p>
          </div>
          <button class="btn-primary" @click="loadArticles" :disabled="loadingArticles">
            {{ loadingArticles ? 'Cargando...' : 'Recargar' }}
          </button>
        </header>

        <div class="ai-config-container">
          <div class="sc-card">
            <div class="sc-card-body">
              <table v-if="articles.length" class="sc-table">
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Estado</th>
                    <th>Autor</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="a in articles" :key="a.id">
                    <td>{{ a.titulo }}</td>
                    <td><span class="sc-badge">{{ a.estado }}</span></td>
                    <td>{{ a.autor?.nombre || a.autor_id }}</td>
                    <td>
                      <button class="btn-primary" @click="openAIAnalysis(a)">Analizar con IA</button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <p v-else-if="!loadingArticles">No hay artículos para mostrar.</p>
              <p v-else>Cargando artículos...</p>
            </div>
          </div>
        </div>
      </template>

      <!-- ─── CONFIGURACIÓN IA ────────────────────────── -->
      <template v-if="currentView === 'ai-settings'">
        <header class="topbar">
          <div>
            <h1 class="page-title">Configuración de Inteligencia Artificial</h1>
            <p class="page-sub">Gestiona los modelos de lenguaje y parámetros para detección de plagio.</p>
          </div>
        </header>

        <div class="ai-config-container">
          <div class="sc-card">
            <div class="sc-card-header">
              <h3 class="sc-card-title">Proveedor de LLM</h3>
              <span class="sc-badge" :class="aiStore.config.isActive ? 'aprobado' : 'rechazado'">
                {{ aiStore.config.isActive ? 'Activo' : 'Inactivo' }}
              </span>
            </div>
            <div class="sc-card-body">
              <form @submit.prevent="saveAIConfig" class="ai-form">
                <div class="form-grid">
                  <div class="form-group">
                    <label>Proveedor</label>
                    <select v-model="aiForm.provider" class="custom-select">
                      <option value="Gemini">Google Gemini</option>
                      <option value="Groq">Groq</option>
                      <option value="Ollama">Ollama (Local)</option>
                    </select>
                  </div>
                  
                  <div class="form-group">
                    <label>Modelo</label>
                    <input v-model="aiForm.modelName" placeholder="ej. gemini-1.5-flash" />
                  </div>

                  <div class="form-group full-width" v-if="aiForm.provider !== 'Ollama'">
                    <label>API Key</label>
                    <div class="password-input">
                      <input 
                        :type="showApiKey ? 'text' : 'password'" 
                        v-model="aiForm.apiKey" 
                        placeholder="Ingresa tu clave de API"
                      />
                      <button type="button" @click="showApiKey = !showApiKey">
                        {{ showApiKey ? 'Ocultar' : 'Mostrar' }}
                      </button>
                    </div>
                  </div>

                  <div class="form-group full-width" v-if="aiForm.provider === 'Ollama'">
                    <label>Base URL</label>
                    <input v-model="aiForm.baseUrl" placeholder="http://localhost:11434" />
                  </div>

                  <div class="form-group">
                    <label>Temperatura ({{ aiForm.temperature }})</label>
                    <input type="range" v-model.number="aiForm.temperature" min="0" max="1" step="0.1" />
                  </div>

                  <div class="form-group">
                    <label>Máximo de Tokens</label>
                    <input type="number" v-model.number="aiForm.maxTokens" />
                  </div>
                </div>

                <div class="ai-actions">
                  <button type="submit" class="btn-primary" :disabled="aiStore.loading">
                    {{ aiStore.loading ? 'Guardando...' : 'Guardar Configuración' }}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div class="info-card">
            <h4>💡 Recomendaciones</h4>
            <ul>
              <li><strong>Gemini 1.5 Flash:</strong> Recomendado por su gran ventana de contexto (1M tokens). Ideal para artículos largos.</li>
              <li><strong>Groq:</strong> Increíblemente rápido, pero con límites de tokens más estrictos.</li>
              <li><strong>Ollama:</strong> Usa tus propios recursos locales. Totalmente gratuito y privado.</li>
            </ul>
          </div>
        </div>
      </template>
    </main>

    <!-- Create/Edit Modal -->
    <div v-if="showCreateModal || showEditModal" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <h2>{{ showEditModal ? 'Editar Usuario' : 'Crear Usuario' }}</h2>
        
        <form @submit.prevent="submitUser">
          <div class="form-group">
            <label>Nombre</label>
            <input v-model="userForm.nombre" required />
          </div>
          
          <div class="form-group">
            <label>Email</label>
            <input v-model="userForm.email" type="email" required />
          </div>
          
          <div class="form-group">
            <label>Rol</label>
            <select v-model="userForm.rol" required>
              <option value="Autor">Autor</option>
              <option value="Revisor">Revisor</option>
              <option value="Editor">Editor</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          
          <div class="form-group" v-if="!showEditModal">
            <label>Contraseña</label>
            <input v-model="userForm.password" type="password" required minlength="6" />
          </div>
          
          <div class="modal-actions">
            <button type="button" class="btn-ghost" @click="closeModal">Cancelar</button>
            <button type="submit" class="btn-primary">
              {{ showEditModal ? 'Guardar' : 'Crear' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Análisis IA -->
    <div v-if="showAIModal" class="modal-overlay" @click="closeAIModal">
      <div class="modal ai-analysis-modal" @click.stop>
        <div class="ai-modal-header">
          <h2>Análisis IA — {{ currentAnalysisArticle?.titulo }}</h2>
          <button class="btn-ghost" @click="closeAIModal">Cerrar</button>
        </div>

        <div v-if="!aiAnalysisResult && !aiAnalysisLoading">
          <p>Se ejecutarán los tres análisis sobre este artículo (puede tardar 10-30s):</p>
          <ul>
            <li>Plagio textual mediante LLM.</li>
            <li>Alertas éticas (consentimiento, datos personales, afirmaciones no respaldadas).</li>
            <li>Similitud contra otros artículos del sistema (embeddings).</li>
          </ul>
          <div class="modal-actions">
            <button class="btn-primary" @click="runFullAnalysis">Ejecutar análisis completo</button>
          </div>
        </div>

        <div v-if="aiAnalysisLoading">
          <p>Analizando con IA... (esto puede tardar 10-30 segundos)</p>
        </div>

        <div v-if="aiAnalysisResult && !aiAnalysisLoading" class="ai-result">
          <section class="report-section">
            <h3>Plagio textual</h3>
            <p v-if="aiAnalysisResult.plagiarism_report">
              <strong>Score:</strong>
              <span :class="getPlagioClass(aiAnalysisResult.plagiarism_report.score || 0)">
                {{ aiAnalysisResult.plagiarism_report.score ?? 'n/d' }}%
              </span>
            </p>
            <p>{{ aiAnalysisResult.plagiarism_report?.summary || aiAnalysisResult.plagiarism_report?.raw || 'Sin resultados.' }}</p>
          </section>

          <section class="report-section">
            <h3>Alertas éticas</h3>
            <p><strong>Riesgo general:</strong> {{ aiAnalysisResult.ethics_report?.overall_risk || 'n/d' }}</p>
            <p>{{ aiAnalysisResult.ethics_report?.summary || '' }}</p>
            <ul v-if="aiAnalysisResult.ethics_report?.alerts?.length">
              <li v-for="(al, i) in aiAnalysisResult.ethics_report.alerts" :key="i">
                <strong>[{{ al.severity }}] {{ al.type }}</strong>: {{ al.description }}
                <em v-if="al.evidence"> — Evidencia: {{ al.evidence }}</em>
              </li>
            </ul>
            <p v-else>No se detectaron alertas.</p>
          </section>

          <section class="report-section">
            <h3>Similitud con otros artículos</h3>
            <p v-if="!aiAnalysisResult.similarity?.hits?.length">Sin coincidencias significativas (umbral {{ aiAnalysisResult.similarity?.threshold ?? 0 }}).</p>
            <table v-else class="sc-table">
              <thead><tr><th>ID de artículo</th><th>Similitud</th></tr></thead>
              <tbody>
                <tr v-for="h in aiAnalysisResult.similarity.hits" :key="h.articulo_id">
                  <td>{{ h.articulo_id }}</td>
                  <td>{{ (h.similarity * 100).toFixed(1) }}%</td>
                </tr>
              </tbody>
            </table>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useCongressStore } from '../stores/congress';
import { useAIStore } from '../stores/ai';
import { useTheme } from '../composables/useTheme';
import { Pie, Bar } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title } from 'chart.js';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

const router = useRouter();
const authStore = useAuthStore();
const congressStore = useCongressStore();
const aiStore = useAIStore();
const { isDark, toggleTheme } = useTheme();
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const currentView = ref('overview');
const showMenu = ref(false);
const showCreateModal = ref(false);
const showEditModal = ref(false);
const users = ref<{id: string, nombre: string, email: string, rol: string}[]>([]);
const stats = ref<{totalUsers: number, usersByRole: Record<string, number>} | null>(null);
const articleStats = ref<{
  totalArticles: number;
  articlesByStatus: { Borrador: number; EnRevision: number; Aceptado: number; Rechazado: number };
  topAuthors: { name: string; count: number }[];
  articlesNeedingReview: number;
  completedArticles: number;
  acceptanceRate: number;
  activityByDay: { day: string; count: number }[];
} | null>(null);
const reviewerWorkload = ref<{nombre: string; articulos_asignados: number; email: string}[]>([]);
const showApiKey = ref(false);
const aiForm = ref({
  provider: 'Gemini',
  apiKey: '',
  modelName: 'gemini-1.5-flash',
  baseUrl: '',
  temperature: 0.7,
  maxTokens: 2048
});
const articles = ref<any[]>([]);
const loadingArticles = ref(false);
const showAIModal = ref(false);
const currentAnalysisArticle = ref<any>(null);
const aiAnalysisResult = ref<any>(null);
const aiAnalysisLoading = ref(false);
const currentUser = computed(() => authStore.user);
const userInitial = computed(() => currentUser.value?.nombre?.[0]?.toUpperCase() || 'A');

const userForm = ref({
  id: '',
  nombre: '',
  email: '',
  rol: 'Autor',
  password: ''
});

const loadUsers = async () => {
  try {
    const response = await fetch(`${API_URL}/users`, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    });
    if (response.ok) {
      users.value = await response.json();
    }
  } catch (error) {
    console.error('Error cargando usuarios:', error);
  }
};

const loadStats = async () => {
  try {
    const url = `${API_URL}/users/stats`;
    console.log('Fetching stats from:', url);
    
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    });
    
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    const text = await response.text();
    console.log('Response text:', text);
    
    if (response.ok && text) {
      stats.value = JSON.parse(text);
    }
  } catch (error) {
    console.error('Error cargando estadísticas:', error);
  }
};

const loadArticleStats = async () => {
  try {
    const response = await fetch(`${API_URL}/articulos/stats`, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    });
    if (response.ok) {
      articleStats.value = await response.json();
    }
  } catch (error) {
    console.error('Error cargando estadísticas de artículos:', error);
  }
};

const loadReviewerWorkload = async () => {
  try {
    const response = await fetch(`${API_URL}/asignaciones/revisores`, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    });
    if (response.ok) {
      const data = await response.json();
      reviewerWorkload.value = data.map((r: any) => ({
        nombre: r.nombre,
        email: r.email,
        articulos_asignados: r.articulos_asignados
      }));
    }
  } catch (error) {
    console.error('Error cargando carga de revisores:', error);
  }
};

const chartData = computed(() => {
  if (!stats.value) return null;

  // Glassmorphism colors with transparency
  const roleColors = {
    Autor: 'rgba(99, 102, 241, 0.6)',    // Indigo with transparency
    Revisor: 'rgba(16, 185, 129, 0.6)',  // Emerald with transparency
    Editor: 'rgba(245, 158, 11, 0.6)',   // Amber with transparency
    Admin: 'rgba(236, 72, 153, 0.6)',    // Pink with transparency
  };

  // Border colors for contrast
  const roleBorderColors = {
    Autor: 'rgba(99, 102, 241, 0.9)',
    Revisor: 'rgba(16, 185, 129, 0.9)',
    Editor: 'rgba(245, 158, 11, 0.9)',
    Admin: 'rgba(236, 72, 153, 0.9)',
  };

  const labels = Object.keys(stats.value.usersByRole);
  const data = Object.values(stats.value.usersByRole);

  return {
    labels,
    datasets: [{
      data,
      backgroundColor: labels.map(role => roleColors[role as keyof typeof roleColors]),
      borderColor: labels.map(role => roleBorderColors[role as keyof typeof roleBorderColors]),
      borderWidth: 2,
      hoverBackgroundColor: labels.map(role => roleColors[role as keyof typeof roleColors].replace('0.6', '0.8')),
      hoverBorderWidth: 3,
      offset: labels.map((_, i) => data[i] > 0 ? 5 : 0),
    }],
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        color: isDark.value ? '#ffffff' : '#374151',
        padding: 20,
        font: {
          size: 14,
          weight: '600',
        },
        usePointStyle: true,
        pointStyle: 'circle',
        pointRadius: 8,
      },
    },
    title: {
      display: false,
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleFont: { size: 14, weight: 'bold' },
      bodyFont: { size: 13 },
      padding: 12,
      cornerRadius: 8,
      displayColors: true,
      callbacks: {
        label: (context: any) => {
          const label = context.label || '';
          const value = context.raw || 0;
          const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
          const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
          return ` ${label}: ${value} usuarios (${percentage}%)`;
        },
      },
    },
  },
  animation: {
    animateRotate: true,
    animateScale: true,
    duration: 1000,
    easing: 'easeOutQuart',
  },
};

// Chart data for Article Status (Horizontal Bar)
const articleStatusChartData = computed(() => {
  if (!articleStats.value) return null;

  return {
    labels: ['Borrador', 'En Revisión', 'Aceptados', 'Rechazados'],
    datasets: [{
      label: 'Artículos',
      data: [
        articleStats.value.articlesByStatus.Borrador,
        articleStats.value.articlesByStatus.EnRevision,
        articleStats.value.articlesByStatus.Aceptado,
        articleStats.value.articlesByStatus.Rechazado,
      ],
      backgroundColor: ['rgba(148, 163, 184, 0.5)', 'rgba(59, 130, 246, 0.5)', 'rgba(16, 185, 129, 0.5)', 'rgba(239, 68, 68, 0.5)'],
      borderColor: ['rgba(148, 163, 184, 0.9)', 'rgba(59, 130, 246, 0.9)', 'rgba(16, 185, 129, 0.9)', 'rgba(239, 68, 68, 0.9)'],
      borderWidth: 2,
      borderRadius: 6,
    }],
  };
});

// Chart data for Top Authors (Vertical Bar)
const topAuthorsChartData = computed(() => {
  if (!articleStats.value || articleStats.value.topAuthors.length === 0) return null;

  const glassColors = ['rgba(139, 92, 246, 0.5)', 'rgba(59, 130, 246, 0.5)', 'rgba(16, 185, 129, 0.5)', 'rgba(245, 158, 11, 0.5)', 'rgba(239, 68, 68, 0.5)'];
  const glassBorders = ['rgba(139, 92, 246, 0.9)', 'rgba(59, 130, 246, 0.9)', 'rgba(16, 185, 129, 0.9)', 'rgba(245, 158, 11, 0.9)', 'rgba(239, 68, 68, 0.9)'];

  return {
    labels: articleStats.value.topAuthors.map(a => a.name.split(' ')[0]),
    datasets: [{
      label: 'Artículos Publicados',
      data: articleStats.value.topAuthors.map(a => a.count),
      backgroundColor: glassColors.slice(0, articleStats.value.topAuthors.length),
      borderColor: glassBorders.slice(0, articleStats.value.topAuthors.length),
      borderWidth: 2,
      borderRadius: 6,
    }],
  };
});

// Chart data for Reviewer Workload
const reviewerWorkloadChartData = computed(() => {
  if (reviewerWorkload.value.length === 0) return null;

  return {
    labels: reviewerWorkload.value.map(r => r.nombre.split(' ')[0]),
    datasets: [{
      label: 'Revisiones Asignadas',
      data: reviewerWorkload.value.map(r => r.articulos_asignados),
      backgroundColor: reviewerWorkload.value.map(r =>
        r.articulos_asignados >= 3 ? 'rgba(239, 68, 68, 0.5)' :
        r.articulos_asignados >= 2 ? 'rgba(245, 158, 11, 0.5)' : 'rgba(16, 185, 129, 0.5)'
      ),
      borderColor: reviewerWorkload.value.map(r =>
        r.articulos_asignados >= 3 ? 'rgba(239, 68, 68, 0.9)' :
        r.articulos_asignados >= 2 ? 'rgba(245, 158, 11, 0.9)' : 'rgba(16, 185, 129, 0.9)'
      ),
      borderWidth: 2,
      borderRadius: 6,
    }],
  };
});

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      ticks: {
        color: isDark.value ? '#e5e7eb' : '#6b7280',
      },
      grid: {
        color: isDark.value ? '#2a2a2a' : '#e5e7eb',
      },
    },
    y: {
      ticks: {
        color: isDark.value ? '#e5e7eb' : '#6b7280',
      },
      grid: {
        color: isDark.value ? '#2a2a2a' : '#e5e7eb',
      },
      beginAtZero: true,
    },
  },
};

const submitUser = async () => {
  try {
    const url = showEditModal.value 
      ? `${API_URL}/users/${userForm.value.id}`
      : `${API_URL}/users`;
    
    const method = showEditModal.value ? 'PATCH' : 'POST';
    
    const payload = { ...userForm.value };
    if (showEditModal.value && !payload.password) {
      delete payload.password;
    }

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify(payload)
    });
    
    if (response.ok) {
      closeModal();
      loadUsers();
    }
  } catch (error) {
    console.error('Error guardando usuario:', error);
  }
};

const saveAIConfig = async () => {
  console.log('[AdminView] Saving AI config with form:', aiForm.value);
  const success = await aiStore.updateConfig(aiForm.value);
  if (success) {
    alert('Configuración de IA guardada con éxito');
  } else {
    alert('Error al guardar la configuración. Revisa la consola del navegador para más detalles.');
  }
};

const getPlagioClass = (score: number) => {
  if (score < 15) return 'plagio-low';
  if (score < 40) return 'plagio-mid';
  return 'plagio-high';
};

const checkPlagiarism = async (id: string) => {
  try {
    const report = await aiStore.checkPlagiarism(id);
    alert(`Análisis completado: ${report.score}% de similitud detectada.`);
    loadArticles();
  } catch (error) {
    alert('Error al realizar el análisis');
  }
};

const loadArticles = async () => {
  loadingArticles.value = true;
  try {
    const response = await fetch(`${API_URL}/articulos?include_relations=true`, {
      headers: { 'Authorization': `Bearer ${authStore.token}` },
    });
    if (response.ok) {
      articles.value = await response.json();
    }
  } catch (e) {
    console.error('Error cargando artículos:', e);
  } finally {
    loadingArticles.value = false;
  }
};

const goToArticles = () => {
  currentView.value = 'articles';
  if (!articles.value.length) loadArticles();
};

const openAIAnalysis = (article: any) => {
  currentAnalysisArticle.value = article;
  aiAnalysisResult.value = null;
  aiAnalysisLoading.value = false;
  showAIModal.value = true;
};

const closeAIModal = () => {
  showAIModal.value = false;
  currentAnalysisArticle.value = null;
  aiAnalysisResult.value = null;
  aiAnalysisLoading.value = false;
};

const runFullAnalysis = async () => {
  if (!currentAnalysisArticle.value) return;
  aiAnalysisLoading.value = true;
  try {
    aiAnalysisResult.value = await aiStore.fullAnalysis(
      currentAnalysisArticle.value.id,
      { topK: 5, threshold: 0.7 },
    );
  } catch (e: any) {
    alert('Error al ejecutar el análisis: ' + (e?.message || e));
  } finally {
    aiAnalysisLoading.value = false;
  }
};

const editUser = (user: any) => {
  userForm.value = { ...user, password: '' };
  showEditModal.value = true;
};

const deleteUser = async (id: string) => {
  if (!confirm('¿Eliminar este usuario?')) return;
  
  try {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    });
    
    if (response.ok) {
      loadUsers();
      loadStats();
      loadArticleStats();
      loadReviewerWorkload();
    }
  } catch (error) {
    console.error('Error eliminando usuario:', error);
  }
};

const closeModal = () => {
  showCreateModal.value = false;
  showEditModal.value = false;
  userForm.value = { id: '', nombre: '', email: '', rol: 'Autor', password: '' };
};

const changeCongress = () => {
  congressStore.setCongress('')
  router.push('/select-congress')
}

const logout = () => {
  authStore.logout();
  router.push('/login');
};

interface SolicitanteRef { id: string; nombre: string; email: string }
interface SolicitudCongreso {
  id: string;
  solicitante_id: string;
  solicitante?: SolicitanteRef;
  nombre_propuesto: string;
  descripcion_propuesta?: string;
  fecha_inicio_propuesta?: string;
  fecha_fin_propuesta?: string;
  motivo?: string;
  estado: 'Pendiente' | 'Aprobado' | 'Rechazado';
  respuesta_admin?: string;
  congreso_creado_id?: string;
  fecha_creacion: string;
  fecha_resolucion?: string;
}
interface Notificacion {
  id: string;
  user_id: string;
  tipo: string;
  titulo: string;
  mensaje: string;
  link?: string;
  leida: boolean;
  fecha_creacion: string;
}

const solicitudesCongreso = ref<SolicitudCongreso[]>([]);
const cargandoSolicitudesCongreso = ref(false);
const scFilter = ref<'pendientes' | 'todas'>('pendientes');
const notificaciones = ref<Notificacion[]>([]);
const notificacionesLoading = ref(false);
const showNotifPanel = ref(false);
const notificacionesNoLeidas = computed(() =>
  notificaciones.value.filter((n) => !n.leida).length
);
const solicitudesPendientesCount = computed(() =>
  solicitudesCongreso.value.filter((s) => s.estado === 'Pendiente').length
);
const solicitudesCongresoFiltradas = computed(() => {
  if (scFilter.value === 'pendientes') {
    return solicitudesCongreso.value.filter((s) => s.estado === 'Pendiente');
  }
  return [...solicitudesCongreso.value].sort((a, b) => {
    const orden: Record<string, number> = { Pendiente: 0, Aprobado: 1, Rechazado: 2 };
    return orden[a.estado] - orden[b.estado];
  });
});

const authHeaders = () => ({
  'Authorization': `Bearer ${authStore.token}`,
  'Content-Type': 'application/json'
});

const cargarSolicitudesCongreso = async () => {
  cargandoSolicitudesCongreso.value = true;
  try {
    const res = await fetch(`${API_URL}/solicitudes-congreso`, { headers: authHeaders() });
    if (res.ok) {
      solicitudesCongreso.value = await res.json();
    }
  } catch (e) {
    console.error('Error cargando solicitudes de congreso:', e);
  } finally {
    cargandoSolicitudesCongreso.value = false;
  }
};

const abrirSolicitudesCongreso = () => {
  currentView.value = 'solicitudes-congreso';
  cargarSolicitudesCongreso();
};

const resolverSolicitudCongreso = async (sol: SolicitudCongreso, estado: 'Aprobado' | 'Rechazado') => {
  const label = estado === 'Aprobado' ? 'aprobar' : 'rechazar';
  const respuesta = window.prompt(`Respuesta para el solicitante (opcional) al ${label} "${sol.nombre_propuesto}":`, '');
  if (respuesta === null) return;
  try {
    const res = await fetch(`${API_URL}/solicitudes-congreso/${sol.id}/resolver`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ estado, respuesta: respuesta || undefined })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert(err.message || `No se pudo ${label} la solicitud.`);
      return;
    }
    await cargarSolicitudesCongreso();
    await cargarNotificaciones();
  } catch (e) {
    console.error(`Error al ${label} solicitud:`, e);
    alert(`Error al ${label} la solicitud.`);
  }
};

const cargarNotificaciones = async () => {
  notificacionesLoading.value = true;
  try {
    const res = await fetch(`${API_URL}/notificaciones`, { headers: authHeaders() });
    if (res.ok) {
      notificaciones.value = await res.json();
    }
  } catch (e) {
    console.error('Error cargando notificaciones:', e);
  } finally {
    notificacionesLoading.value = false;
  }
};

const toggleNotifPanel = () => {
  showNotifPanel.value = !showNotifPanel.value;
  if (showNotifPanel.value) {
    cargarNotificaciones();
  }
};

const marcarNotifLeida = async (id: string) => {
  try {
    const res = await fetch(`${API_URL}/notificaciones/${id}/leer`, {
      method: 'PATCH',
      headers: authHeaders()
    });
    if (res.ok) {
      const idx = notificaciones.value.findIndex((n) => n.id === id);
      if (idx !== -1) notificaciones.value[idx].leida = true;
    }
  } catch (e) {
    console.error('Error marcando notificación:', e);
  }
};

const marcarTodasLeidas = async () => {
  try {
    const res = await fetch(`${API_URL}/notificaciones/leer-todas`, {
      method: 'PATCH',
      headers: authHeaders()
    });
    if (res.ok) {
      notificaciones.value = notificaciones.value.map((n) => ({ ...n, leida: true }));
    }
  } catch (e) {
    console.error('Error marcando todas las notificaciones:', e);
  }
};

const abrirNotificacion = (notif: Notificacion) => {
  if (!notif.leida) {
    marcarNotifLeida(notif.id);
  }
  if (notif.tipo === 'SolicitudCongresoCreada' || notif.link?.startsWith('/admin/solicitudes-congreso')) {
    showNotifPanel.value = false;
    abrirSolicitudesCongreso();
  }
};

const formatDateNotif = (iso?: string) => {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' });
  } catch {
    return iso;
  }
};

const formatDateOnly = (iso?: string) => {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('es-MX', { dateStyle: 'medium' });
  } catch {
    return iso;
  }
};

onMounted(async () => {
  if (!authStore.isAuthenticated || authStore.userRole !== 'Admin') {
    router.push('/login');
    return;
  }
  await loadUsers();
  await loadStats();
  await loadArticleStats();
  await loadReviewerWorkload();
  await aiStore.fetchConfig();
  // Sincronizar form con store
  aiForm.value = { ...aiStore.config };
  cargarSolicitudesCongreso();
  cargarNotificaciones();
});
</script>

<style scoped>
  /* ─── LAYOUT ──────────────────────────────────────── */
  .dashboard { display: flex; min-height: 100vh; background: transparent; }

  /* ─── SIDEBAR ─────────────────────────────────────── */
  .sidebar { width: 220px; min-width: 220px; border-right: 1px solid var(--border-color); display: flex; flex-direction: column; background: var(--bg-sidebar); position: sticky; top: 0; height: 100vh; }
  .sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
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

  /* ─── MAIN ────────────────────────────────────────── */
  .main { flex: 1; display: flex; flex-direction: column; overflow-y: auto; padding: 1.5rem; }

  /* ─── TOPBAR ──────────────────────────────────────── */
  .topbar { display: flex; align-items: flex-start; justify-content: space-between; padding: 2rem 2.5rem 1.5rem; border-bottom: 1px solid var(--border-color); }
  .page-title { font-size: 1.35rem; font-weight: 700; letter-spacing: -0.02em; color: var(--text-strong); margin-bottom: 0.2rem; }
  .page-sub { font-size: 0.8rem; color: var(--text-faint); }

  /* ─── STAT CARDS (ADMIN) ───────────────────────── */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    border-bottom: 1px solid var(--border-color);
  }

  .stat-card {
    padding: 1.75rem 2rem;
    border-right: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  .stat-card:last-child { border-right: none; }
  .stat-card.total { border-left: none; }
  .stat-card.authors { border-left: none; }
  .stat-card.reviewers { border-left: none; }
  .stat-card.editors { border-left: none; }
  .stat-card.articles-total { border-left: none; }
  .stat-card.articles-review { border-left: none; }
  .stat-card.articles-completed { border-left: none; }
  .stat-card.articles-rate { border-left: none; }

  .stat-icon {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-input);
    border-radius: 6px;
    color: var(--text-normal);
    flex-shrink: 0;
  }
  .stat-icon svg { width: 20px; height: 20px; }

  .stat-content {
    display: flex;
    flex-direction: column;
  }

  .stat-value {
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--text-strong);
    line-height: 1;
  }

  .stat-label {
    font-size: 0.75rem;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-top: 0.25rem;
  }

  /* ─── SECCIÓN GENERAL ─────────────────────────────── */
  .section { padding: 2rem 2.5rem; flex: 1; }
  .section-title { font-size: 0.8rem; font-weight: 600; color: var(--text-faint); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 1.5rem; padding-left: 2rem; }

  /* ─── CHARTS GLASSMORPHISM ────────────────────────── */
  .chart-section {
    background: rgba(255, 255, 255, 0.4);
    backdrop-filter: blur(12px) saturate(120%);
    -webkit-backdrop-filter: blur(12px) saturate(120%);
    border: 1px solid rgba(255, 255, 255, 0.6);
    border-radius: 16px;
    padding: 1.5rem;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
    position: relative;
    overflow: hidden;
  }

  .chart-section::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 16px;
    padding: 1px;
    background: linear-gradient(135deg, rgba(200,200,200,0.4) 0%, transparent 50%, rgba(200,200,200,0.2) 100%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }

  [data-theme="dark"] .chart-section {
    background: rgba(30, 30, 35, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
  }

  [data-theme="dark"] .chart-section::before {
    background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%, rgba(255,255,255,0.1) 100%);
  }

  .chart-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--text-muted);
    font-size: 0.875rem;
  }

  .pie-chart-section {
    background: rgba(255, 255, 255, 0.4);
    backdrop-filter: blur(12px) saturate(120%);
    -webkit-backdrop-filter: blur(12px) saturate(120%);
    border: 1px solid rgba(255, 255, 255, 0.6);
    border-radius: 16px;
    padding: 2rem;
    margin-bottom: 2rem;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
    position: relative;
    overflow: hidden;
  }

  .pie-chart-section::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 16px;
    padding: 1px;
    background: linear-gradient(135deg, rgba(200,200,200,0.4) 0%, transparent 50%, rgba(200,200,200,0.2) 100%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }

  [data-theme="dark"] .pie-chart-section {
    background: rgba(30, 30, 35, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
  }

  [data-theme="dark"] .pie-chart-section::before {
    background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%, rgba(255,255,255,0.1) 100%);
  }

  .chart-section-title {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-strong);
    text-align: center;
    margin-bottom: 1.5rem;
  }

  .pie-chart-container {
    position: relative;
    height: 300px;
    max-width: 400px;
    margin: 0 auto;
  }

  .charts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .charts-grid .chart-section {
    margin-bottom: 0;
  }

  .chart-title {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-normal);
    margin-bottom: 1rem;
    text-align: center;
  }

  .chart-container-bar {
    position: relative;
    height: 200px;
  }

  /* ─── TABLE ───────────────────────────────────────── */
  .table-container {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    overflow: hidden;
  }

  .users-table {
    width: 100%;
    border-collapse: collapse;
  }

  .users-table th,
  .users-table td {
    padding: 0.875rem 1rem;
    text-align: left;
    border-bottom: 1px solid var(--border-color);
    font-size: 0.875rem;
  }

  .users-table th {
    background: var(--bg-input);
    font-weight: 600;
    color: var(--text-strong);
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .users-table tr:last-child td {
    border-bottom: none;
  }

  .role-badge {
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 500;
    background: var(--bg-input);
    color: var(--text-muted);
    border: 1px solid var(--border-color);
  }

  /* ─── BOTONES ─────────────────────────────────────── */
  .btn-primary { display: flex; align-items: center; gap: 0.4rem; background: var(--btn-primary-bg); color: var(--btn-primary-text); font-size: 0.825rem; font-weight: 600; padding: 0.6rem 1.2rem; border-radius: 6px; border: none; cursor: pointer; transition: opacity 0.15s; white-space: nowrap; }
  .btn-primary:hover { opacity: 0.88; }
  .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }

  .btn-ghost { background: transparent; color: var(--btn-ghost-text); font-size: 0.825rem; font-weight: 500; padding: 0.6rem 1rem; border-radius: 6px; border: 1px solid var(--border-color); cursor: pointer; transition: all 0.15s; }
  .btn-ghost:hover { color: var(--btn-ghost-hover-text); border-color: var(--border-focus); background: var(--btn-ghost-hover-bg); }

  .btn-icon {
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 0.875rem;
    padding: 0.25rem 0.5rem;
    color: var(--text-normal);
    border-radius: 4px;
  }

  .btn-icon:hover {
    background: var(--bg-input);
    color: var(--text-strong);
  }

  .btn-icon.delete:hover {
    color: var(--stat-rechazado);
    background: rgba(248, 113, 113, 0.1);
  }

  /* ─── MODAL ───────────────────────────────────────── */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
  }

  .modal {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 1.5rem;
    width: 100%;
    max-width: 400px;
  }

  .modal h2 {
    margin-bottom: 1.25rem;
    font-size: 1.1rem;
    font-weight: 600;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  .form-group label {
    display: block;
    margin-bottom: 0.35rem;
    color: var(--text-normal);
    font-size: 0.8rem;
    font-weight: 500;
  }

  .form-group input,
  .form-group select {
    width: 100%;
    padding: 0.6rem 0.75rem;
    background: var(--bg-input);
    border: 1px solid var(--border-color);
    border-radius: 6px;
    color: var(--text-strong);
    font-size: 0.875rem;
    font-family: inherit;
  }

  .form-group input:focus,
  .form-group select:focus {
    outline: none;
    border-color: var(--border-focus);
  }

  .modal-actions {
    display: flex;
    gap: 0.75rem;
    margin-top: 1.25rem;
  }

  .modal-actions .btn-primary,
  .modal-actions .btn-ghost {
    flex: 1;
    margin-bottom: 0;
    justify-content: center;
  }

  /* ─── RESPONSIVE ──────────────────────────────────── */
  @media (max-width: 900px) {
    .stats-grid { grid-template-columns: repeat(2, 1fr); }
    .charts-grid { grid-template-columns: 1fr; }
  }

  @media (max-width: 768px) {
    .dashboard { flex-direction: column; }
    .sidebar { width: 100%; min-width: unset; height: auto; position: static; border-right: none; border-bottom: 1px solid var(--border-color); }
    .sidebar-nav { flex-direction: row; overflow-x: auto; padding: 0.5rem; }
    .nav-item { white-space: nowrap; }
    .topbar { flex-direction: column; gap: 1rem; padding: 1.25rem; }
    .section { padding: 1.5rem 1.25rem; }
    .stats-grid { grid-template-columns: 1fr; }
  }

  /* ─── NAV BADGE ─── */
  .nav-badge {
    margin-left: auto;
    background: #0070f3;
    color: #fff;
    font-size: 0.65rem;
    font-weight: 700;
    min-width: 18px;
    height: 18px;
    padding: 0 6px;
    border-radius: 9px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
  }

  /* ─── TOPBAR ACTIONS ─── */
  .topbar-actions { display: flex; align-items: center; gap: 0.75rem; }

  .refresh-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.5rem 0.85rem;
    border: 1px solid var(--border-color);
    background: var(--bg-card);
    color: var(--text-normal);
    border-radius: 4px;
    font-size: 0.78rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s ease;
  }
  .refresh-btn svg { width: 14px; height: 14px; }
  .refresh-btn:hover { background: var(--bg-card-hover); }
  .refresh-btn:disabled { opacity: 0.5; cursor: wait; }

  /* ─── NOTIFICATIONS ─── */
  .notif-wrapper { position: relative; }

  .notif-btn {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border: 1px solid var(--border-color);
    background: var(--bg-card);
    color: var(--text-normal);
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.15s ease;
  }
  .notif-btn:hover { background: var(--bg-card-hover); }
  .notif-btn svg { width: 18px; height: 18px; }

  .notif-dot {
    position: absolute;
    top: -4px;
    right: -4px;
    background: #0070f3;
    color: #fff;
    font-size: 0.6rem;
    font-weight: 700;
    min-width: 16px;
    height: 16px;
    padding: 0 4px;
    border-radius: 8px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
  }

  .notif-panel {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    width: 340px;
    max-height: 420px;
    overflow-y: auto;
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
    z-index: 50;
  }
  .notif-panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--border-color);
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--text-strong);
  }
  .notif-mark-all {
    background: transparent;
    border: none;
    color: #0070f3;
    font-size: 0.72rem;
    cursor: pointer;
    padding: 0;
  }
  .notif-mark-all:hover { text-decoration: underline; }

  .notif-empty {
    padding: 1.5rem;
    text-align: center;
    color: var(--text-faint);
    font-size: 0.82rem;
  }

  .notif-list { list-style: none; margin: 0; padding: 0; }
  .notif-item {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--border-color);
    cursor: pointer;
    transition: background 0.15s ease;
  }
  .notif-item:last-child { border-bottom: none; }
  .notif-item:hover { background: var(--bg-card-hover); }
  .notif-item.unread { background: rgba(0, 112, 243, 0.06); }
  .notif-item-title { font-weight: 600; font-size: 0.82rem; color: var(--text-strong); margin-bottom: 0.2rem; }
  .notif-item-msg { font-size: 0.78rem; color: var(--text-muted); line-height: 1.4; }
  .notif-item-date { font-size: 0.68rem; color: var(--text-faint); margin-top: 0.35rem; }

  /* ─── SOLICITUDES DE CONGRESO ─── */
  .sc-filters {
    display: flex;
    gap: 0.5rem;
    padding: 1rem 2.5rem 0;
  }
  .filter-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.4rem 0.9rem;
    border: 1px solid var(--border-color);
    background: var(--bg-card);
    color: var(--text-muted);
    border-radius: 4px;
    font-size: 0.78rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s ease;
  }
  .filter-chip:hover { background: var(--bg-card-hover); color: var(--text-normal); }
  .filter-chip.active {
    background: var(--text-strong);
    color: var(--bg-page);
    border-color: var(--text-strong);
  }
  .filter-count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    border-radius: 9px;
    background: #0070f3;
    color: #fff;
    font-size: 0.65rem;
    font-weight: 700;
  }

  .sc-loading, .sc-empty {
    padding: 3rem 2.5rem;
    text-align: center;
    color: var(--text-faint);
    font-size: 0.88rem;
  }

  .sc-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 1rem;
    padding: 1rem 2.5rem 2.5rem;
  }

  .sc-card {
    border: 1px solid var(--border-color);
    border-radius: 4px;
    background: var(--bg-card);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .sc-card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 1rem 1rem 0.6rem;
    border-bottom: 1px solid var(--border-color);
  }
  .sc-card-title {
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--text-strong);
    margin: 0;
    line-height: 1.3;
  }
  .sc-badge {
    font-size: 0.68rem;
    font-weight: 600;
    padding: 0.18rem 0.55rem;
    border-radius: 10px;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }
  .sc-badge.pendiente { background: rgba(0, 112, 243, 0.12); color: #0070f3; }
  .sc-badge.aprobado { background: rgba(16, 145, 76, 0.12); color: #10914c; }
  .sc-badge.rechazado { background: rgba(220, 38, 38, 0.12); color: #dc2626; }

  .sc-card-body {
    padding: 0.75rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
    flex: 1;
  }
  .sc-author { display: flex; align-items: center; gap: 0.6rem; }
  .sc-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--bg-input);
    color: var(--text-strong);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.85rem;
  }
  .sc-author-name { font-size: 0.82rem; font-weight: 600; color: var(--text-normal); }
  .sc-author-email { font-size: 0.72rem; color: var(--text-faint); }

  .sc-desc, .sc-motivo, .sc-resp {
    font-size: 0.8rem;
    color: var(--text-muted);
    line-height: 1.45;
    margin: 0;
  }
  .sc-dates { display: flex; flex-wrap: wrap; gap: 0.75rem; font-size: 0.75rem; color: var(--text-muted); }
  .sc-meta { font-size: 0.7rem; color: var(--text-faint); margin-top: auto; }

  .sc-card-actions {
    display: flex;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    border-top: 1px solid var(--border-color);
    background: var(--bg-page);
  }
  .sc-btn {
    flex: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    padding: 0.55rem 0.85rem;
    border-radius: 4px;
    font-size: 0.78rem;
    font-weight: 600;
    cursor: pointer;
    border: 1px solid transparent;
    transition: opacity 0.15s ease;
  }
  .sc-btn svg { width: 14px; height: 14px; }
  .sc-btn.approve { background: #10914c; color: #fff; border-color: #10914c; }
  .sc-btn.reject { background: transparent; color: #dc2626; border-color: #dc2626; }
  .sc-btn:hover { opacity: 0.85; }

/* AI Config Styles */
.ai-config-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
  max-width: 800px;
}

.ai-form .form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.ai-form .full-width {
  grid-column: span 2;
}

.ai-form label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
}

.ai-form input, .ai-form select {
  width: 100%;
  padding: 0.75rem;
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-normal);
  font-size: 0.9rem;
}

.password-input {
  display: flex;
  gap: 0.5rem;
}

.password-input button {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  padding: 0 1rem;
  border-radius: 6px;
  font-size: 0.75rem;
  cursor: pointer;
  color: var(--text-muted);
}

.ai-actions {
  margin-top: 2rem;
  display: flex;
  justify-content: flex-end;
}

.info-card {
  background: rgba(59, 130, 246, 0.05);
  border: 1px solid rgba(59, 130, 246, 0.2);
  padding: 1.5rem;
  border-radius: 8px;
}

.info-card h4 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #3b82f6;
  font-size: 1rem;
}

.info-card ul {
  padding-left: 1.25rem;
  margin: 0;
}

.info-card li {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
}

.sc-badge.aprobado {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.sc-badge.rechazado {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.plagio-low {
  color: #10b981;
  font-weight: 700;
}

.plagio-mid {
  color: #f59e0b;
  font-weight: 700;
}

.plagio-high {
  color: #ef4444;
  font-weight: 700;
}

.btn-text {
  background: none;
  border: none;
  color: #3b82f6;
  text-decoration: underline;
  cursor: pointer;
  font-size: 0.85rem;
}
</style>
