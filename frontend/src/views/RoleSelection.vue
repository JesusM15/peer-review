<template>
  <div class="page">

    <!-- Nav -->
    <nav class="nav">
      <div class="nav-brand">
        <!-- Ícono: dos páginas con checkmark — representa revisión por pares -->
        <svg class="brand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M15 2v4a1 1 0 001 1h4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="brand-name">Diego</span>
      </div>
      <span class="nav-tag">Sistema de Revisión por Pares</span>
    </nav>

    <!-- Hero -->
    <section class="hero">
      <p class="hero-label">Plataforma académica</p>
      <h1 class="hero-title">
        Revisión de<br />artículos científicos.
      </h1>
      <p class="hero-sub">
        Selecciona tu rol para acceder al sistema. Cada acceso está
        adaptado a tus responsabilidades dentro del proceso editorial.
      </p>
    </section>

    <!-- Cards de roles -->
    <section class="roles">
      <button
        v-for="role in roles"
        :key="role.key"
        class="role-card"
        @click="selectRole(role.key)"
      >
        <div class="role-card-top">
          <span class="role-badge">{{ role.badge }}</span>
          <svg class="role-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M7 17L17 7M17 7H7M17 7v10" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="role-icon-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" v-html="role.iconPath"></svg>
        </div>
        <h2 class="role-name">{{ role.name }}</h2>
        <p class="role-desc">{{ role.desc }}</p>
      </button>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <span>© 2026 Diego — Proyecto Final · Ingeniería de Software</span>
    </footer>

  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const roles = [
  {
    key: 'editor',
    badge: 'Editor',
    name: 'Editor',
    desc: 'Gestiona el flujo completo de artículos, asignaciones y decisiones editoriales.',
    iconPath: '<path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" stroke-linecap="round" stroke-linejoin="round"/>',
  },
  {
    key: 'reviewer',
    badge: 'Revisor',
    name: 'Revisor',
    desc: 'Accede a los artículos que te fueron asignados y emite tus observaciones.',
    iconPath: '<path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" stroke-linecap="round" stroke-linejoin="round"/>',
  },
  {
    key: 'author',
    badge: 'Autor',
    name: 'Autor',
    desc: 'Envía tus artículos, consulta su estado y responde a las revisiones recibidas.',
    iconPath: '<path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" stroke-linecap="round" stroke-linejoin="round"/>',
  },
]

/**
 * Usuarios seed — mismos IDs y datos que backend/src/database/seed.ts
 * Al elegir un rol, guardamos el usuario correspondiente en localStorage.
 * Esto simula una sesión real hasta que se implemente auth completo.
 */
const SEED_USERS: Record<string, object> = {
  author: {
    id: '11111111-1111-4111-a111-111111111111',
    email: 'autor@diego.edu',
    nombre: 'Ana García',
    rol: 'Autor',
    carrera: 'Ingeniería de Software',
    especialidades: ['Machine Learning', 'Bases de Datos'],
  },
  reviewer: {
    id: '22222222-2222-4222-a222-222222222222',
    email: 'revisor@diego.edu',
    nombre: 'Carlos Martínez',
    rol: 'Revisor',
    carrera: 'Ciencias de la Computación',
    especialidades: ['Algoritmos', 'Seguridad Informática'],
  },
  editor: {
    id: '33333333-3333-4333-a333-333333333333',
    email: 'editor@diego.edu',
    nombre: 'Laura Torres',
    rol: 'Editor',
    carrera: 'Sistemas de Información',
    especialidades: ['Gestión Editorial', 'Investigación Académica'],
  },
}

const selectRole = (role: string) => {
  if (SEED_USERS[role]) {
    localStorage.setItem('user', JSON.stringify(SEED_USERS[role]))
  }
  router.push(`/${role}`)
}
</script>

<style scoped>
/* ─── PÁGINA ──────────────────────────────────────── */
.page {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #080808;
}

/* ─── NAV ─────────────────────────────────────────── */
.nav {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 2.5rem;
  border-bottom: 1px solid #222;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.brand-icon {
  width: 18px;
  height: 18px;
  color: #fff;
}

.brand-name {
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #fff;
}

.nav-tag {
  font-size: 0.75rem;
  color: #666;
  font-weight: 400;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

/* ─── HERO ────────────────────────────────────────── */
.hero {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 5rem 2.5rem 3rem;
  /* SIN max-width para que ocupe todo el ancho disponible */
}

.hero-label {
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #777;
  margin-bottom: 1.25rem;
}

.hero-title {
  font-size: clamp(2.5rem, 6vw, 5rem);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.03em;
  color: #ffffff;
  margin-bottom: 1.5rem;
}

.hero-sub {
  font-size: 1rem;
  line-height: 1.7;
  color: #999;
  max-width: 520px;
}

/* ─── ROLES GRID ──────────────────────────────────── */
.roles {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border-top: 1px solid #222;
  flex: 1;
}

.role-card {
  display: flex;
  flex-direction: column;
  /* Más padding para mayor separación visual */
  padding: 3.5rem 3rem;
  border-right: 1px solid #222;
  text-align: left;
  color: #fff;
  background: transparent;
  transition: background 0.25s ease;
  cursor: pointer;
  position: relative;
}

.role-card:last-child {
  border-right: none;
}

.role-card:hover {
  background: #101010;
}

.role-card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.role-badge {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  /* Mayor contraste en el badge */
  color: #ddd;
  background: #1f1f1f;
  border: 1px solid #333;
  border-radius: 4px;
  padding: 0.3rem 0.6rem;
}

.role-arrow {
  width: 17px;
  height: 17px;
  color: #444;
  transition: color 0.2s, transform 0.2s;
}

.role-card:hover .role-arrow {
  color: #fff;
  transform: translate(3px, -3px);
}

.role-icon-wrap {
  width: 40px;
  height: 40px;
  /* Ícono más visible */
  color: #444;
  margin-bottom: 2rem;
  transition: color 0.2s;
}

.role-icon-wrap svg {
  width: 100%;
  height: 100%;
}

.role-card:hover .role-icon-wrap {
  color: #aaa;
}

.role-name {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 0.85rem;
  /* Blanco puro para máximo contraste */
  color: #ffffff;
}

.role-desc {
  font-size: 0.875rem;
  line-height: 1.7;
  /* Gris más claro para mejor legibilidad */
  color: #888;
  margin-top: auto;
}

/* ─── FOOTER ──────────────────────────────────────── */
.footer {
  border-top: 1px solid #222;
  padding: 1.25rem 2.5rem;
  font-size: 0.75rem;
  color: #555;
}

/* ─── RESPONSIVE ──────────────────────────────────── */
@media (max-width: 768px) {
  .nav { padding: 1rem 1.25rem; }
  .hero { padding: 3rem 1.25rem 2rem; }
  .roles { grid-template-columns: 1fr; }
  .role-card { border-right: none; border-bottom: 1px solid #1a1a1a; }
  .role-card:last-child { border-bottom: none; }
}

@media (max-width: 480px) {
  .hero-title { font-size: 2rem; }
}
</style>
