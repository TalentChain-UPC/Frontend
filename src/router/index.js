import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/assets/domains/auth/views/LoginView.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('@/assets/domains/auth/views/ForgotPasswordView.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/admin-dashboard',
    name: 'admin-dashboard',
    component: () => import('@/assets/domains/auth/views/dashboard/AdminDashboard.vue'),
    meta: { requiresAuth: true, allowedRoles: ['administrativo'] }
  },
  {
    path: '/company-dashboard',
    name: 'company-dashboard',
    component: () => import('@/assets/domains/auth/views/dashboard/CompanyDashboard.vue'),
    meta: { requiresAuth: true, allowedRoles: ['empresa'] }
  },
  {
    path: '/employee-dashboard',
    name: 'employee-dashboard',
    component: () => import('@/assets/domains/auth/views/dashboard/EmployeeDashboard.vue'),
    meta: { requiresAuth: true, allowedRoles: ['trabajador'] }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Verificar autenticación
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next('/login')
  }

  // Verificar roles
  if (to.meta.allowedRoles && !to.meta.allowedRoles.includes(authStore.user?.role)) {
    return next(authStore.getDashboardRoute())
  }

  // Redirigir usuarios autenticados lejos de páginas de invitado
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    return next(authStore.getDashboardRoute())
  }

  next()
})

export default router
