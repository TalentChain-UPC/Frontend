import { mockUsers } from '../mock/users'

export class AuthService {
  static async login(email, password) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = mockUsers.find(u =>
          u.email === email && u.password === password
        )

        if (user) {
          resolve({
            success: true,
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
              companyId: user.companyId
            },
            token: `mock-token-${user.id}`
          })
        } else {
          resolve({
            success: false,
            error: 'Credenciales incorrectas'
          })
        }
      }, 500) // Simulamos delay de red
    })
  }

  static async getUserById(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockUsers.find(u => u.id === id) || null)
      }, 300)
    })
  }
}
