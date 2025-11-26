// src/stores/authStore.js
import { defineStore } from 'pinia'
import { AuthService } from '@/modules/auth/services/authService'

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

        const role = Array.isArray(user.role) ? user.role[0] : user.role

        this.token = token
        localStorage.setItem('authToken', token)

        let fullUser = { ...user, role }

        // Si el usuario es EMPLOYEE y quieres traer más datos del perfil
        if (role === 'EMPLOYEE' && user.employeeId) {
          const profileRes = await AuthService.fetchEmployeeProfile(user.employeeId, token)
          if (profileRes.success && profileRes.user) {
            fullUser = {
              ...fullUser,
              ...profileRes.user,
              // Asegúrate de mantener el company_id que ya trae el login
              company_id: user.company_id ?? profileRes.user.companyId ?? null
            }
          }
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
