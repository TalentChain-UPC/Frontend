// src/assets/domains/auth/services/authService.js
import axios from 'axios'

const API_URL = 'http://localhost:8100/api/v1'

export class AuthService {
  static async login(email, password) {
    try {
      const response = await axios.post(`${API_URL}/auth/sign-in`, { email, password })

      const { token, username, roles, id, employeeId } = response.data

      return {
        success: true,
        token,
        user: {
          id,
          email: username,
          role: roles?.[0] ?? null,
          employeeId
        }
      }
    } catch (e) {
      console.error('Login error:', e.response?.data || e)
      return {
        success: false,
        error: e.response?.data?.message || 'Error al iniciar sesión'
      }
    }
  }

  static async createUser(userData, token) {
    try {
      const response = await axios.post(`${API_URL}/users/create`, userData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return { success: true, message: response.data.message }
    } catch (e) {
      return {
        success: false,
        error: e.response?.data?.message || 'Error al crear usuario'
      }
    }
  }
}
