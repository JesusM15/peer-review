<template>
  <div class="admin-dashboard">
    <!-- Header -->
    <header class="admin-header">
      <div class="header-content">
        <div class="brand">
          <svg class="brand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <span class="brand-name">Admin Panel</span>
        </div>
        
        <div class="header-actions">
          <div class="user-menu">
            <button class="user-chip" @click="showMenu = !showMenu">
              <div class="user-avatar">{{ userInitial }}</div>
              <span class="user-name">{{ currentUser?.nombre || 'Admin' }}</span>
              <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            
            <div v-if="showMenu" class="dropdown-menu">
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
              <button class="menu-item" @click="logout">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                </svg>
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="admin-main">
      <div class="admin-container">
        <h1>Dashboard de Administración</h1>
        
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
                  <button class="btn-icon" @click="editUser(user)">✏️</button>
                  <button class="btn-icon delete" @click="deleteUser(user.id)">🗑️</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
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
import { useTheme } from '../composables/useTheme';
import { Pie, Bar } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title } from 'chart.js';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

const router = useRouter();
const authStore = useAuthStore();
const { isDark, toggleTheme } = useTheme();
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

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
  
  // Gradient-like vibrant colors for better aesthetics
  const roleColors = {
    Autor: '#6366f1',    // Indigo
    Revisor: '#10b981',  // Emerald
    Editor: '#f59e0b',   // Amber
    Admin: '#ec4899',    // Pink
  };
  
  // Hover colors (slightly lighter)
  const roleHoverColors = {
    Autor: '#818cf8',
    Revisor: '#34d399',
    Editor: '#fbbf24',
    Admin: '#f472b6',
  };
  
  const labels = Object.keys(stats.value.usersByRole);
  const data = Object.values(stats.value.usersByRole);
  
  return {
    labels,
    datasets: [{
      data,
      backgroundColor: labels.map(role => roleColors[role as keyof typeof roleColors]),
      hoverBackgroundColor: labels.map(role => roleHoverColors[role as keyof typeof roleHoverColors]),
      borderWidth: 0,
      hoverBorderWidth: 0,
      offset: labels.map((_, i) => data[i] > 0 ? 5 : 0), // Separate segments with data
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
        color: 'var(--text-normal)',
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
      backgroundColor: ['#94a3b8', '#3b82f6', '#10b981', '#ef4444'],
      borderRadius: 6,
    }],
  };
});

// Chart data for Top Authors (Vertical Bar)
const topAuthorsChartData = computed(() => {
  if (!articleStats.value || articleStats.value.topAuthors.length === 0) return null;
  
  return {
    labels: articleStats.value.topAuthors.map(a => a.name.split(' ')[0]), // First name only
    datasets: [{
      label: 'Artículos Publicados',
      data: articleStats.value.topAuthors.map(a => a.count),
      backgroundColor: ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
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
        r.articulos_asignados >= 3 ? '#ef4444' : 
        r.articulos_asignados >= 2 ? '#f59e0b' : '#10b981'
      ),
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
        color: 'var(--text-normal)',
      },
      grid: {
        color: 'var(--border-color)',
      },
    },
    y: {
      ticks: {
        color: 'var(--text-normal)',
      },
      grid: {
        color: 'var(--border-color)',
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
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify(userForm.value)
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
.admin-dashboard {
  min-height: 100vh;
  background: var(--bg-base);
  color: var(--text-strong);
}

.admin-header {
  background: var(--bg-sidebar);
  border-bottom: 1px solid var(--border-color);
  padding: 1rem 2rem;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.brand-icon {
  width: 24px;
  height: 24px;
  color: var(--text-strong);
}

.brand-name {
  font-size: 1.25rem;
  font-weight: 700;
}

.user-menu {
  position: relative;
}

.user-chip {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 0.5rem 1rem;
  color: var(--text-strong);
  cursor: pointer;
}

.user-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--border-hover);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: var(--text-strong);
}

.chevron {
  width: 16px;
  height: 16px;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 0.5rem;
  min-width: 150px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.5rem;
  border: none;
  background: transparent;
  color: var(--text-normal);
  cursor: pointer;
  border-radius: 4px;
}

.menu-item:hover {
  background: var(--bg-card-hover);
}

.menu-item svg {
  width: 16px;
  height: 16px;
}

.admin-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.admin-container h1 {
  margin-bottom: 1.5rem;
  font-size: 1.75rem;
}

.section-title {
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-card.total { border-left: 4px solid #8b5cf6; }
.stat-card.authors { border-left: 4px solid #3b82f6; }
.stat-card.reviewers { border-left: 4px solid #10b981; }
.stat-card.editors { border-left: 4px solid #f59e0b; }

.stat-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-input);
  border-radius: 12px;
  color: var(--text-strong);
}

.stat-icon svg {
  width: 24px;
  height: 24px;
}

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
  font-size: 0.875rem;
  color: var(--text-muted);
  margin-top: 0.25rem;
}

/* Chart Section */
.chart-section {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.chart-container {
  position: relative;
  height: 300px;
  max-width: 400px;
  margin: 0 auto;
}

.chart-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-muted);
  font-size: 1rem;
}

.btn-primary {
  background: #fff;
  color: #000;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 1.5rem;
}

.table-container {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table th,
.users-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.users-table th {
  background: var(--bg-input);
  font-weight: 600;
  color: var(--text-muted);
}

.role-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.role-badge.autor { background: #3b82f6; color: #fff; }
.role-badge.revisor { background: #10b981; color: #fff; }
.role-badge.editor { background: #f59e0b; color: #fff; }
.role-badge.admin { background: #ef4444; color: #fff; }

.btn-icon {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
  padding: 0.25rem;
  margin-right: 0.5rem;
}

.btn-icon.delete:hover {
  color: #ef4444;
}

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
  border-radius: 12px;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
}

.modal h2 {
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-muted);
  font-size: 0.875rem;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-strong);
}

.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-ghost {
  flex: 1;
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-muted);
  padding: 0.75rem;
  border-radius: 6px;
  cursor: pointer;
}

.btn-ghost:hover {
  border-color: var(--border-hover);
  color: var(--text-normal);
}

/* Pie Chart Section Styling */
.pie-chart-section {
  background: linear-gradient(145deg, var(--bg-card) 0%, var(--bg-base) 100%);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
}

.chart-section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-strong);
  text-align: center;
  margin-bottom: 1.5rem;
  background: linear-gradient(90deg, var(--text-strong) 0%, var(--text-muted) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.pie-chart-container {
  position: relative;
  height: 350px;
  max-width: 450px;
  margin: 0 auto;
  filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.12));
}

/* Article Stats Cards Colors */
.stat-card.articles-total { border-left: 4px solid #64748b; }
.stat-card.articles-review { border-left: 4px solid #3b82f6; }
.stat-card.articles-completed { border-left: 4px solid #10b981; }
.stat-card.articles-rate { border-left: 4px solid #8b5cf6; }

/* Charts Grid */
.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.charts-grid .chart-section {
  margin-bottom: 0;
}

.chart-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-strong);
  margin-bottom: 1rem;
  text-align: center;
}

.chart-container-bar {
  position: relative;
  height: 250px;
}

@media (max-width: 768px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
}
</style>
