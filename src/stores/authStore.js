// src/stores/authStore.js
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

        user.role = Array.isArray(user.role) ? user.role[0] : user.role

        this.token = token
        localStorage.setItem('authToken', token)

        // Solo busca perfil de empleado si el usuario es EMPLOYEE
        if (user.role === 'EMPLOYEE' && (user.employeeId || user.employee_id)) {
          const employeeId = user.employeeId || user.employee_id;
          const profileRes = await AuthService.fetchEmployeeProfile(employeeId, token)
          console.log('Perfil recibido:', profileRes)
          if (profileRes.success && profileRes.user) {
            // Mezcla los datos del perfil con el rol y el email original
            this.user = { ...profileRes.user, role: user.role, email: user.email }
            localStorage.setItem('authUser', JSON.stringify(this.user))
          } else {
            this.user = user // fallback
            localStorage.setItem('authUser', JSON.stringify(user))
          }
        } else {
          this.user = user
          localStorage.setItem('authUser', JSON.stringify(user))
        }

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
