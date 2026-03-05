import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { isAuthenticated } from '../lib/api'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/annuaire',
      name: 'annuaire',
      component: () => import('../views/Annuaire.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/Register.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue'),
    },
    { path: '/profil', 
      name: 'profil', 
      component: () => import('../views/Profilview.vue'), 
      meta: { requiresAuth: true } 
    },
    { 
      path: '/badge', 
      name: 'badge', 
      component: () => import('../views/Badgeview.vue'), 
      meta: { requiresAuth: true } 
    },
    {
      path: '/annuaire/:id',
      name: 'plumber-detail',
      component: () => import('../views/PlumberDetailView.vue'),
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminDashboard.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

router.beforeEach((to, _from, next) => {
  const authenticated = isAuthenticated()

  // Route protégée → redirige vers login si pas connecté
  if (to.meta.requiresAuth && !authenticated) {
    return next({ name: 'login', query: { redirect: to.fullPath } })
  }

  // Route guest only → redirige vers accueil si déjà connecté
  if (to.meta.guestOnly && authenticated) {
    return next({ name: 'home' })
  }

  next()
})

export default router