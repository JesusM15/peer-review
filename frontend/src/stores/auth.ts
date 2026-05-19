import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface User {
  id: string;
  nombre: string;
  email: string;
  rol: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem('token'));

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value);
  const userRole = computed(() => user.value?.rol || null);

  // Actions
  const setAuth = (userData: User, authToken: string) => {
    user.value = userData;
    token.value = authToken;
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const clearAuth = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const login = async (email: string, password: string): Promise<void> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al iniciar sesión');
    }

    const data = await response.json();
    setAuth(data.user, data.token);

    try {
      const { useCongressStore } = await import('./congress');
      await useCongressStore().fetchMemberships();
    } catch (e) {
      console.error('Error fetching congresses:', e);
    }
  };

  const register = async (nombre: string, email: string, password: string, rol: string): Promise<void> => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombre, email, password, rol }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al registrar usuario');
    }

    const data = await response.json();
    setAuth(data.user, data.token);
  };

  const logout = () => {
    clearAuth();
  };

  const initAuth = () => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        token.value = storedToken;
        user.value = JSON.parse(storedUser);
      } catch {
        clearAuth();
      }
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    userRole,
    login,
    register,
    logout,
    initAuth,
  };
});
