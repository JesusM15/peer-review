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
        <button class="nav-item" id="nav-admin-articles" @click="currentView = 'articles'">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Artículos
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useCongressStore } from '../stores/congress';
import { useTheme } from '../composables/useTheme';
import { Pie, Bar } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title } from 'chart.js';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

const router = useRouter();
const authStore = useAuthStore();
const congressStore = useCongressStore();
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

onMounted(() => {
  if (!authStore.isAuthenticated || authStore.userRole !== 'Admin') {
    router.push('/login');
    return;
  }
  loadUsers();
  loadStats();
  loadArticleStats();
  loadReviewerWorkload();
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
</style>
