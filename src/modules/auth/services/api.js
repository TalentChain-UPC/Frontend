import axios from 'axios'

const api = axios.create({
  baseURL: '/api/v1', //URL real de tu backend
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

export const getEvidenceById = (id, token) =>
  api.get(`/evidences/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
// Companies
export const getCompanyById = (id, token) =>
  api.get(`/companies/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  })

// Employees
export const getEmployeeById = (id, token) =>
  api.get(`/employees/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  })

export const getEmployeesByCompany = (companyId, token) =>
  api.get(`/employees/company/${companyId}`, {
    headers: { Authorization: `Bearer ${token}` }
  })

export const getEmployeeBalance = (employeeId, token) =>
  api.get(`/virtual-accounts/employee/${employeeId}`, {
    headers: { Authorization: `Bearer ${token}` }
  })

export const getEmployeeContracts = (companyId, token) =>
  api.get(`/contracts/company/${companyId}`, {
    headers: { Authorization: `Bearer ${token}` }
  })

export const getCompanyTransactions = (companyId, token) =>
  api.get(`/transactions/company/${companyId}`, {
    headers: { Authorization: `Bearer ${token}` }
  })

export default api
