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
        <h1>Gestión de Usuarios</h1>
        
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

const router = useRouter();
const authStore = useAuthStore();
const { isDark, toggleTheme } = useTheme();
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const showMenu = ref(false);
const showCreateModal = ref(false);
const showEditModal = ref(false);
const users = ref<{id: string, nombre: string, email: string, rol: string}[]>([]);
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
</style>
