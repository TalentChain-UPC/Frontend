import { defineStore } from 'pinia'
import { AuthService } from '@/assets/domains/auth/services/authService'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    isLoading: false,
    error: null
  }),

  actions: {
    async initialize() {
      const token = localStorage.getItem('authToken')
      if (token && !this.token) {
        this.token = token
        // Simulamos la carga del usuario desde el token
        await this.loadUserFromToken(token)
      }
    },

    async loadUserFromToken(token) {
      try {
        // En una app real, aquí harías una petición al backend
        const userId = parseInt(token.replace('mock-token-', ''))
        const mockUser = (await AuthService.getUserById(userId)) || null
        this.user = mockUser
      } catch (error) {
        console.error('Error loading user:', error)
        this.logout()
      }
    },

    async login(email, password) {
      this.isLoading = true
      this.error = null

      try {
        const response = await AuthService.login(email, password)
        if (!response.success) throw new Error(response.error || 'Login failed')

        this.user = response.user
        this.token = response.token
        localStorage.setItem('authToken', this.token)
        return true
      } catch (error) {
        this.error = error.message
        return false
      } finally {
        this.isLoading = false
      }
    },

    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('authToken')
    },

    getDashboardRoute() {
      if (!this.user?.role) return '/login'

      const routes = {
        administrativo: '/admin-dashboard',
        empresa: '/company-dashboard',
        trabajador: '/employee-dashboard'
      }

      return routes[this.user.role] || '/login'
    }
  },

  getters: {
    isAuthenticated: (state) => !!state.token
  }
})
