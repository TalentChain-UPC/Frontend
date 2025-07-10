import { defineStore } from 'pinia'
import { AuthService } from '@/assets/domains/auth/services/authService'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    isLoading: false,
    error: null,
    isInitialized: false
  }),

  actions: {
    async initialize() {
      const token = localStorage.getItem('authToken')
      const userData = localStorage.getItem('authUser')
      if (token && userData) {
        this.token = token
        this.user = JSON.parse(userData)
      }
      this.isInitialized = true
    },

    async login(email, password) {
      this.isLoading = true
      this.error = null

      try {
        const { success, token, user, error } = await AuthService.login(email, password)
        if (!success) throw new Error(error)

        // Normalizar rol
        const role = Array.isArray(user.role) ? user.role[0] : user.role

        this.token = token
        localStorage.setItem('authToken', token)

        let fullUser = { ...user, role }

        if (role === 'EMPLOYEE' && user.employeeId) {
          // Obtener perfil de empleado si aplica
          const profileRes = await AuthService.fetchEmployeeProfile(user.employeeId, token)
          if (profileRes.success && profileRes.user) {
            fullUser = {
              ...fullUser,
              ...profileRes.user
            }
          }
        } else if (role === 'COMPANY') {
          // 🚀 Aquí SÍ o SÍ obtenemos perfil de empresa
          const profileRes = await AuthService.fetchCompanyProfile(token)
          if (profileRes.success && profileRes.company) {
            fullUser = {
              ...fullUser,
              ...profileRes.company,
              company_id: profileRes.company?.id ?? user.companyId ?? user.company_id ?? user.id
            }
          } else {
            // Si no vino perfil, igual tratamos de derivar company_id
            fullUser.company_id = user.companyId ?? user.company_id ?? user.id
          }
        }

        // Como fallback siempre definimos company_id si no existe
        if (!fullUser.company_id && role === 'COMPANY') {
          fullUser.company_id = fullUser.id
        }

        this.user = fullUser

        localStorage.setItem('authUser', JSON.stringify(this.user))

        return true
      } catch (e) {
        this.error = e.message
        return false
      } finally {
        this.isLoading = false
      }
    },

    logout() {
      this.user = null
      this.token = null
      this.isInitialized = false
      localStorage.removeItem('authToken')
      localStorage.removeItem('authUser')
    },

    getDashboardRoute() {
      const role = this.user?.role
      const routes = {
        ADMIN: '/admin-dashboard',
        COMPANY: '/company-dashboard',
        EMPLOYEE: '/employee-dashboard'
      }
      return routes[role] || '/login'
    }
  },

  getters: {
    isAuthenticated: (state) => !!state.token
  }
})
