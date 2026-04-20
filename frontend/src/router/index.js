// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  // Public routes
  { path: '/', redirect: '/dashboard' },
  { path: '/login', component: () => import('@/views/LoginView.vue'), meta: { guest: true } },
  { path: '/register', component: () => import('@/views/RegisterView.vue'), meta: { guest: true } },

  // Public event routes
  { path: '/e/:id', component: () => import('@/views/EventPublicView.vue') },
  { path: '/book/:id', component: () => import('@/views/BookingView.vue') },
  { path: '/ticket/:code', component: () => import('@/views/TicketView.vue') },

  // Protected routes
  {
    path: '/',
    component: () => import('@/components/layout/AppLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: 'dashboard', component: () => import('@/views/DashboardView.vue') },
      { path: 'events', component: () => import('@/views/EventListView.vue') },
      { path: 'events/new', component: () => import('@/views/EventFormView.vue') },
      { path: 'events/:id/edit', component: () => import('@/views/EventFormView.vue') },
      { path: 'events/:id', component: () => import('@/views/EventDetailView.vue') },
      { path: 'checkin/:id', component: () => import('@/views/CheckinView.vue') },
    ],
  },

  { path: '/:pathMatch(.*)*', redirect: '/dashboard' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) return '/login'
  if (to.meta.guest && auth.isAuthenticated) return '/dashboard'
})

export default router
