// src/assets/domains/auth/services/authService.js
import axios from 'axios'

const API_URL = 'http://localhost:8080/api/v1'

export class AuthService {
  /**
   * Login de usuario
   * Retorna token y datos completos incluyendo company_id.
   */
  static async login(email, password) {
    try {
      // 1. Login inicial
      const response = await axios.post(`${API_URL}/auth/sign-in`, { email, password })

      const {
        token,
        username,
        name,
        last_name,
        occupation,
        roles,
        id,
        employeeId
      } = response.data

      const role = roles?.[0] ?? null

      let finalCompanyId = null

      // 🟡 Solo si el usuario tiene un employeeId, traemos su perfil y obtenemos companyId
      if (employeeId) {
        try {
          const employeeRes = await axios.get(`${API_URL}/employees/${employeeId}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          finalCompanyId = employeeRes.data.companyId ?? null
        } catch (fetchError) {
          console.error('Error obteniendo perfil del empleado:', fetchError)
        }
      }

      return {
        success: true,
        token,
        user: {
          id,
          name,
          last_name,
          occupation,
          email: username,
          role,
          employeeId,
          company_id: finalCompanyId
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

  // Los demás métodos los dejas tal cual:
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
        headers: { Authorization: `Bearer ${token}` }
      })
      return { success: true, user: response.data }
    } catch (e) {
      return {
        success: false,
        error: e.response?.data?.message || 'Error al obtener perfil de empleado'
      }
    }
  }

  static async fetchCompanyProfile(company_id, token) {
    try {
      const response = await axios.get(`${API_URL}/companies/${company_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return { success: true, company: response.data }
    } catch (e) {
      return {
        success: false,
        error: e.response?.data?.message || 'Error al obtener perfil de empresa'
      }
    }
  }
}
