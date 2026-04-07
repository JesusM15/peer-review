import { createRouter, createWebHistory } from 'vue-router'
import RoleSelection from '../views/RoleSelection.vue'
import EditorView from '../views/EditorView.vue'
import ReviewerView from '../views/ReviewerView.vue'
import AuthorView from '../views/AuthorView.vue'
import RevisionForm from '../views/RevisionForm.vue'

const routes = [
  {
    path: '/',
    name: 'RoleSelection',
    component: RoleSelection
  },
  {
    path: '/editor',
    name: 'Editor',
    component: EditorView
  },
  {
    path: '/reviewer',
    name: 'Reviewer',
    component: ReviewerView
  },
  {
    path: '/reviewer/revision/:id',
    name: 'RevisionForm',
    component: RevisionForm
  },
  {
    path: '/author',
    name: 'Author',
    component: AuthorView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
