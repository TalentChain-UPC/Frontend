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

        // 🔥 Asignar el rol principal si viene como array
        user.role = Array.isArray(user.roles) ? user.roles[0] : user.role

        this.user = user
        this.token = token
        localStorage.setItem('authToken', token)
        localStorage.setItem('authUser', JSON.stringify(user))

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
        MANAGER: '/admin-dashboard',
        ADMIN: '/company-dashboard',
        CLIENT: '/employee-dashboard'
      }
      return routes[role] || '/login'
    }
  },

  getters: {
    isAuthenticated: (state) => !!state.token
  }
})
