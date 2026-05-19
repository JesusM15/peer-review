<template>
  <div class="dashboard">
    <!-- Header -->
    <header class="dashboard-header">
      <div class="header-content">
        <div class="brand">
          <svg class="brand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <span class="brand-name">Dashboard de Estados</span>
        </div>
        
        <div class="header-actions">
          <div class="user-menu">
            <button class="user-chip" @click="showMenu = !showMenu">
              <div class="user-avatar">{{ userInitial }}</div>
              <span class="user-name">{{ currentUser?.nombre || 'Usuario' }}</span>
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
    <main class="dashboard-main">
      <div class="dashboard-container">
        <!-- Stats Cards -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon borrador">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ estadisticas?.por_estado?.Borrador || 0 }}</div>
              <div class="stat-label">Borrador</div>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon revision">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ estadisticas?.por_estado?.['En Revisión'] || 0 }}</div>
              <div class="stat-label">En Revisión</div>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon aceptado">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ estadisticas?.por_estado?.Aceptado || 0 }}</div>
              <div class="stat-label">Aceptado</div>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon rechazado">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ estadisticas?.por_estado?.Rechazado || 0 }}</div>
              <div class="stat-label">Rechazado</div>
            </div>
          </div>
        </div>

        <!-- Sub-Editor Filter (Solo EditorJefe) -->
        <div v-if="userRole === 'EditorJefe'" class="filter-section">
          <label for="sub-editor-filter">Filtrar por Sub-Editor:</label>
          <select id="sub-editor-filter" v-model="selectedSubEditor" @change="loadDashboard">
            <option value="">Todos los sub-editores</option>
            <option v-for="sub in subEditores" :key="sub.id" :value="sub.id">
              {{ sub.nombre }} ({{ sub.email }})
            </option>
          </select>
        </div>

        <!-- Articles Table -->
        <div class="table-container">
          <h2>Artículos ({{ dashboardData?.total_articulos || 0 }})</h2>
          
          <div v-if="loading" class="loading">Cargando...</div>
          
          <table v-else class="articles-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Autor</th>
                <th>Estado</th>
                <th v-if="userRole === 'SubEditor'">Fecha Límite</th>
                <th v-if="userRole === 'EditorJefe'">Asignado a</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="articulo in dashboardData?.articulos" :key="articulo.id">
                <td>{{ articulo.titulo }}</td>
                <td>{{ articulo.autor }}</td>
                <td>
                  <span :class="['status-badge', getStatusClass(articulo.estado)]">
                    {{ articulo.estado }}
                  </span>
                </td>
                <td v-if="userRole === 'SubEditor'">
                  {{ formatDate(articulo.fecha_limite) }}
                </td>
                <td v-if="userRole === 'EditorJefe'">
                  <div v-if="articulo.asignado_a?.length > 0" class="assigned-to">
                    <span v-for="asignado in articulo.asignado_a" :key="asignado.revisor_id" class="assignee">
                      {{ asignado.revisor_nombre }}
                    </span>
                  </div>
                  <span v-else class="not-assigned">Sin asignar</span>
                </td>
              </tr>
            </tbody>
          </table>
          
          <div v-if="!loading && (!dashboardData?.articulos || dashboardData.articulos.length === 0)" class="empty-state">
            No hay artículos para mostrar
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useTheme } from '../composables/useTheme';

const router = useRouter();
const authStore = useAuthStore();
const { isDark, toggleTheme } = useTheme();
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const showMenu = ref(false);
const loading = ref(false);
const dashboardData = ref<any>(null);
const selectedSubEditor = ref('');
const subEditores = ref<any[]>([]);

const currentUser = computed(() => authStore.user);
const userRole = computed(() => currentUser.value?.rol || '');
const userInitial = computed(() => currentUser.value?.nombre?.[0]?.toUpperCase() || 'U');

const estadisticas = computed(() => dashboardData.value?.estadisticas || null);

const loadDashboard = async () => {
  try {
    loading.value = true;
    const params = selectedSubEditor.value ? `?sub_editor_id=${selectedSubEditor.value}` : '';
    const response = await fetch(`${API_URL}/dashboard${params}`, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    });
    
    if (response.ok) {
      dashboardData.value = await response.json();
      subEditores.value = dashboardData.value.sub_editores || [];
    }
  } catch (error) {
    console.error('Error cargando dashboard:', error);
  } finally {
    loading.value = false;
  }
};

const getStatusClass = (estado: string) => {
  const statusMap: Record<string, string> = {
    'Borrador': 'borrador',
    'En Revisión': 'revision',
    'Aceptado': 'aceptado',
    'Rechazado': 'rechazado',
  };
  return statusMap[estado] || '';
};

const formatDate = (date: string | Date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('es-ES');
};

const logout = () => {
  authStore.logout();
  router.push('/login');
};

onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push('/login');
    return;
  }
  loadDashboard();
});
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: var(--bg-base);
  color: var(--text-strong);
}

.dashboard-header {
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

.dashboard-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.dashboard-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon svg {
  width: 24px;
  height: 24px;
}

.stat-icon.borrador { background: #9ca3af; color: #fff; }
.stat-icon.revision { background: #f59e0b; color: #fff; }
.stat-icon.aceptado { background: #10b981; color: #fff; }
.stat-icon.rechazado { background: #ef4444; color: #fff; }

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-strong);
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-muted);
}

.filter-section {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.filter-section label {
  color: var(--text-normal);
  font-weight: 500;
}

.filter-section select {
  padding: 0.5rem 1rem;
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-strong);
  min-width: 250px;
}

.table-container {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
}

.table-container h2 {
  margin-bottom: 1.5rem;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: var(--text-muted);
}

.articles-table {
  width: 100%;
  border-collapse: collapse;
}

.articles-table th,
.articles-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.articles-table th {
  background: var(--bg-input);
  font-weight: 600;
  color: var(--text-muted);
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-badge.borrador { background: #9ca3af; color: #fff; }
.status-badge.revision { background: #f59e0b; color: #fff; }
.status-badge.aceptado { background: #10b981; color: #fff; }
.status-badge.rechazado { background: #ef4444; color: #fff; }

.assigned-to {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.assignee {
  background: var(--bg-input);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
}

.not-assigned {
  color: var(--text-muted);
  font-style: italic;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: var(--text-muted);
}
</style>
