import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import RoleSelection from '../views/RoleSelection.vue'
import EditorView from '../views/EditorView.vue'
import ReviewerView from '../views/ReviewerView.vue'
import AuthorView from '../views/AuthorView.vue'
import AdminView from '../views/AdminView.vue'
import RevisionForm from '../views/RevisionForm.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { public: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
    meta: { public: true }
  },
  {
    path: '/role-selection',
    name: 'RoleSelection',
    component: RoleSelection,
    meta: { requiresAuth: true }
  },
  {
    path: '/editor',
    name: 'Editor',
    component: EditorView,
    meta: { requiresAuth: true, role: 'Editor' }
  },
  {
    path: '/reviewer',
    name: 'Reviewer',
    component: ReviewerView,
    meta: { requiresAuth: true, role: 'Revisor' }
  },
  {
    path: '/reviewer/revision/:id',
    name: 'RevisionForm',
    component: RevisionForm,
    meta: { requiresAuth: true, role: 'Revisor' }
  },
  {
    path: '/author',
    name: 'Author',
    component: AuthorView,
    meta: { requiresAuth: true, role: 'Autor' }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminView,
    meta: { requiresAuth: true, role: 'Admin' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard para protección de rutas
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // Si la ruta es pública, permitir acceso
  if (to.meta.public) {
    // Si ya está autenticado, redirigir según rol
    if (authStore.isAuthenticated) {
      const user = authStore.user
      if (user) {
        switch (user.rol) {
          case 'Autor':
            return next('/author')
          case 'Revisor':
            return next('/reviewer')
          case 'Editor':
            return next('/editor')
          case 'Admin':
            return next('/admin')
        }
      }
    }
    return next()
  }

  // Si requiere autenticación
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      return next('/login')
    }

    // Verificar rol si es necesario
    if (to.meta.role && authStore.userRole !== to.meta.role) {
      // Redirigir a la ruta correspondiente a su rol
      const user = authStore.user
      if (user) {
        switch (user.rol) {
          case 'Autor':
            return next('/author')
          case 'Revisor':
            return next('/reviewer')
          case 'Editor':
            return next('/editor')
          case 'Admin':
            return next('/admin')
          default:
            return next('/login')
        }
      }
    }
  }

  next()
})

export default router
