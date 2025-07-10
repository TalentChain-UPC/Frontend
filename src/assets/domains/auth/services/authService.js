// src/assets/domains/auth/services/authService.js
import axios from 'axios'

const API_URL = 'http://localhost:8080/api/v1'

export class AuthService {
  static async login(email, password) {
    try {
      const response = await axios.post(`${API_URL}/auth/sign-in`, { email, password })

      const { token, username,name,last_name,occupation,roles, id, employeeId } = response.data

      return {
        success: true,
        token,
        user: {
          id,
          name,
          last_name,
          occupation,
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

  static async fetchEmployeeProfile(employee_id, token) {
    try {
      const response = await axios.get(`${API_URL}/employees/${employee_id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return { success: true, user: response.data };
    } catch (e) {
      return {
        success: false,
        error: e.response?.data?.message || 'Error al obtener perfil de empleado'
      };
    }
  }
}

