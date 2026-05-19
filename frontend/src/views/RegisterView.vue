<template>
  <div class="register-container">
    <div class="register-card">
      <h1>📝 Registro</h1>
      <p class="subtitle">Crea tu cuenta para comenzar</p>

      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <label for="nombre">Nombre completo</label>
          <input
            id="nombre"
            v-model="form.nombre"
            type="text"
            placeholder="Tu nombre completo"
            required
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="email">Correo electrónico</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="tu@email.com"
            required
            class="form-input"
          />
        </div>


        <div class="form-group">
          <label for="password">Contraseña</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            placeholder="Mínimo 6 caracteres"
            required
            minlength="6"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirmar contraseña</label>
          <input
            id="confirmPassword"
            v-model="form.confirmPassword"
            type="password"
            placeholder="Repite tu contraseña"
            required
            minlength="6"
            class="form-input"
            :class="{ 'input-error': passwordMismatch }"
          />
          <span v-if="passwordMismatch" class="error-text">
            Las contraseñas no coinciden
          </span>
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div class="form-actions">
          <button type="button" class="btn-ghost" @click="goBack">
            ← Volver
          </button>
          <button
            type="submit"
            class="btn-primary"
            :disabled="loading || passwordMismatch || !isFormValid"
          >
            {{ loading ? 'Registrando...' : 'Registrarse' }}
          </button>
        </div>
      </form>

      <p class="login-text">
        ¿Ya tienes cuenta?
        <router-link to="/login" class="login-link">Inicia sesión</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const form = ref({
  nombre: '',
  email: '',
  rol: 'Autor',
  password: '',
  confirmPassword: ''
});

const loading = ref(false);
const error = ref('');

const passwordMismatch = computed(() => {
  return form.value.confirmPassword &&
    form.value.password !== form.value.confirmPassword;
});

const isFormValid = computed(() => {
  return form.value.nombre &&
    form.value.email &&
    form.value.rol &&
    form.value.password.length >= 6 &&
    form.value.password === form.value.confirmPassword;
});

const handleRegister = async () => {
  if (passwordMismatch.value) {
    error.value = 'Las contraseñas no coinciden';
    return;
  }

  if (!isFormValid.value) {
    error.value = 'Por favor completa todos los campos correctamente';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    await authStore.register(
      form.value.nombre,
      form.value.email,
      form.value.password,
      form.value.rol
    );

    router.push('/author');
  } catch (err: any) {
    error.value = err.message || 'Error al registrar usuario';
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  router.push('/login');
};
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
  padding: 2rem;
}

.register-card {
  background: #111;
  border: 1px solid #333;
  border-radius: 16px;
  padding: 3rem;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

h1 {
  font-size: 2rem;
  font-weight: 800;
  background: -webkit-linear-gradient(120deg, #ffffff, #888888);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
  text-align: center;
}

.subtitle {
  color: #888;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 0.9rem;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.85rem;
  font-weight: 500;
  color: #bbb;
}

.form-input {
  padding: 0.75rem 1rem;
  border: 1px solid #333;
  border-radius: 8px;
  background: #1a1a1a;
  color: #fff;
  font-size: 0.95rem;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #555;
}

.form-input::placeholder {
  color: #555;
}

.form-input.input-error {
  border-color: #ff6666;
}

.error-text {
  color: #ff6666;
  font-size: 0.8rem;
}

.error-message {
  background: rgba(255, 50, 50, 0.1);
  border: 1px solid rgba(255, 50, 50, 0.3);
  color: #ff6666;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.85rem;
  text-align: center;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.btn-primary {
  flex: 1;
  background: #fff;
  color: #000;
  border: none;
  padding: 0.875rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-primary:hover:not(:disabled) {
  opacity: 0.9;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-ghost {
  padding: 0.875rem 1.5rem;
  border: 1px solid #444;
  background: transparent;
  color: #888;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-ghost:hover {
  border-color: #666;
  color: #bbb;
}

.login-text {
  text-align: center;
  color: #888;
  font-size: 0.9rem;
  margin: 1.5rem 0 0 0;
}

.login-link {
  color: #fff;
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.2s;
}

.login-link:hover {
  opacity: 0.8;
}
</style>
