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
    meta: { requiresAuth: true, allowedRoles: ['ADMIN'] }
  },
  {
    path: '/company-dashboard',
    name: 'company-dashboard',
    component: () => import('@/assets/domains/auth/views/dashboard/CompanyDashboard.vue'),
    meta: { requiresAuth: true, allowedRoles: ['COMPANY'] }
  },
  {
    path: '/employee-dashboard',
    name: 'employee-dashboard',
    component: () => import('@/assets/domains/auth/views/dashboard/EmployeeDashboard.vue'),
    meta: { requiresAuth: true, allowedRoles: ['EMPLOYEE'] }
  },
  {
    path: '/catalogo',
    name: 'catalogo',
    component: () => import('@/assets/domains/auth/views/dashboard/CatalogBlock.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/contratos/nuevo',
    name: 'nuevo-contrato',
    component: () => import('@/assets/domains/auth/views/dashboard/ContractForm.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/evidencias/nueva',
    name: 'nueva-evidencia',
    component: () => import('@/assets/domains/auth/views/dashboard/EvidenceForm.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/mis-contratos',
    name: 'mis-contratos',
    component: () => import('@/assets/domains/auth/views/dashboard/EmployeeContracts.vue'),
    meta: { requiresAuth: true, allowedRoles: ['EMPLOYEE'] }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  if (!authStore.isInitialized) {
    await authStore.initialize()
  }

  // Usuario no autenticado intentando acceder a ruta protegida
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    if (to.path !== '/login') {
      return next('/login')
    }
    // Si ya está en /login, permite continuar
    return next()
  }

  // Usuario autenticado intentando acceder a ruta de invitado
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    return next(authStore.getDashboardRoute())
  }

  // Verificación de roles
  if (to.meta.allowedRoles && !to.meta.allowedRoles.includes(authStore.user?.role)) {
    return next(authStore.getDashboardRoute())
  }

  return next()
})

export default router
