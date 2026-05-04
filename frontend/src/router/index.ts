import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useCongressStore } from '../stores/congress'
import CongressSelectionView from '../views/CongressSelectionView.vue'
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
    path: '/select-congress',
    name: 'CongressSelection',
    component: CongressSelectionView,
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
        if (user.rol === 'Admin') return next('/admin')
        return next('/select-congress')
      }
    }
    return next()
  }

  // Si requiere autenticación
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      return next('/login')
    }

    // Si no es admin y no está en la página de selección ni tiene un congreso activo
    const congressStore = useCongressStore()
    if (authStore.user?.rol !== 'Admin' && to.name !== 'CongressSelection' && !congressStore.currentCongressId) {
      return next('/select-congress')
    }

    // Verificar rol si es necesario
    if (to.meta.role) {
      const user = authStore.user
      if (!user) return next('/login')
      
      // Si es Admin global, tiene acceso a todo (o redirigir a /admin si se prefiere estricto)
      if (user.rol === 'Admin') return next()

      // Si no es admin, verificar rol en el congreso actual
      const membership = congressStore.memberships.find(m => m.congreso_id === congressStore.currentCongressId)
      const effectiveRole = membership?.rol
      
      if (effectiveRole !== to.meta.role) {
        // Redirigir a la ruta correspondiente a su rol en ESTE congreso
        if (effectiveRole === 'Autor') return next('/author')
        if (effectiveRole === 'Revisor') return next('/reviewer')
        if (effectiveRole === 'Editor') return next('/editor')
        return next('/select-congress')
      }
    }
  }

  next()
})

export default router
