import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import NotFoundPage from '../views/NotFoundPage.vue'
import { getStoredToken, getStoredUser } from '@/lib/session'

const routes: RouteRecordRaw[] = [
  { path: '/', component: () => import('@/app/page.vue') },
  { path: '/connexion', component: () => import('@/app/connexion/page.vue') },
  { path: '/inscription', component: () => import('@/app/inscription/page.vue') },
  { path: '/mot-de-passe-oublie', component: () => import('@/app/mot-de-passe-oublie/page.vue') },
  { path: '/biens', component: () => import('@/app/biens/page.vue') },
  { path: '/biens/:id', component: () => import('@/app/biens/[id]/page.vue') },
  { path: '/admin', component: () => import('@/app/admin/page.vue') },
  { path: '/admin/parametres', component: () => import('@/app/admin/parametres/page.vue') },
  { path: '/admin/permissions', component: () => import('@/app/admin/permissions/page.vue') },
  { path: '/admin/roles', component: () => import('@/app/admin/roles/page.vue') },
  { path: '/admin/utilisateurs', component: () => import('@/app/admin/utilisateurs/page.vue') },
  { path: '/admin/utilisateurs/nouveau', component: () => import('@/app/admin/utilisateurs/nouveau/page.vue') },
  { path: '/admin/utilisateurs/:id', component: () => import('@/app/admin/utilisateurs/[id]/page.vue') },
  { path: '/admin/utilisateurs/:id/modifier', component: () => import('@/app/admin/utilisateurs/[id]/modifier/page.vue') },
  { path: '/agent', component: () => import('@/app/agent/page.vue') },
  { path: '/agent/biens', component: () => import('@/app/agent/biens/page.vue') },
  { path: '/agent/biens/nouveau', component: () => import('@/app/agent/biens/nouveau/page.vue') },
  { path: '/agent/biens/:id', component: () => import('@/app/agent/biens/[id]/page.vue') },
  { path: '/agent/biens/:id/modifier', component: () => import('@/app/agent/biens/[id]/modifier/page.vue') },
  { path: '/agent/clients', component: () => import('@/app/agent/clients/page.vue') },
  { path: '/agent/clients/:id', component: () => import('@/app/agent/clients/[id]/page.vue') },
  { path: '/agent/options', component: () => import('@/app/agent/options/page.vue') },
  { path: '/agent/reclamations', component: () => import('@/app/agent/reclamations/page.vue') },
  { path: '/agent/reclamations/:id', component: () => import('@/app/agent/reclamations/[id]/page.vue') },
  { path: '/agent/reservations', component: () => import('@/app/agent/reservations/page.vue') },
  { path: '/agent/reservations/:id', component: () => import('@/app/agent/reservations/[id]/page.vue') },
  { path: '/client', component: () => import('@/app/client/page.vue') },
  { path: '/client/profil', component: () => import('@/app/client/profil/page.vue') },
  { path: '/client/recherche', component: () => import('@/app/client/recherche/page.vue') },
  { path: '/client/reclamations', component: () => import('@/app/client/reclamations/page.vue') },
  { path: '/client/reclamations/nouvelle', component: () => import('@/app/client/reclamations/nouvelle/page.vue') },
  { path: '/client/reclamations/:id', component: () => import('@/app/client/reclamations/[id]/page.vue') },
  { path: '/client/reservations', component: () => import('@/app/client/reservations/page.vue') },
  { path: '/client/reservations/nouvelle', component: () => import('@/app/client/reservations/nouvelle/page.vue') },
  { path: '/client/reservations/:id', component: () => import('@/app/client/reservations/[id]/page.vue') },
  { path: '/:pathMatch(.*)*', component: NotFoundPage },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const protectedPrefixes = ['/admin', '/agent', '/client']
  const isProtected = protectedPrefixes.some(prefix => to.path.startsWith(prefix))

  if (!isProtected) {
    return true
  }

  const token = getStoredToken()
  const user = getStoredUser() as { role?: string } | null

  if (!token || !user?.role) {
    return '/connexion'
  }

  if (to.path.startsWith('/admin') && user.role !== 'admin') {
    return `/${user.role}`
  }

  if (to.path.startsWith('/agent') && user.role !== 'agent' && user.role !== 'admin') {
    return `/${user.role}`
  }

  if (to.path.startsWith('/client') && user.role !== 'client') {
    return `/${user.role}`
  }

  return true
})
