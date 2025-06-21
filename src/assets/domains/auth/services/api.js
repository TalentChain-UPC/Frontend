import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8100/api', // Cambia por la URL real de tu backend
  headers: {
    'Content-Type': 'application/json'
  }
})

export default api
