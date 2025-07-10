import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1', //URL real de tu backend
  headers: {
    'Content-Type': 'application/json'
  }
})

// Contratos
export const createContract = (payload, token) =>
  api.post('/contracts', payload, {
    headers: { Authorization: `Bearer ${token}` }
  })

// Evidencias
export const createEvidence = (payload, token) =>
  api.post('/evidences', payload, {
    headers: { Authorization: `Bearer ${token}` }
  })

export default api
