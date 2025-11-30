<template>
  <div class="dashboard-layout">
    <AppNavbar />
    
    <div class="dashboard-container">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <h2>Panel Empresa</h2>
        </div>
        <nav class="sidebar-nav">
          <button 
            :class="['nav-item', { active: activeTab === 'evidences' }]"
            @click="activeTab = 'evidences'"
          >
            Evidencias
          </button>
          <button 
            :class="['nav-item', { active: activeTab === 'employees' }]"
            @click="activeTab = 'employees'"
          >
            Empleados
          </button>
        </nav>
        
        <div class="sidebar-footer">
           <button @click="showContractModal = true" class="create-contract-btn">
            + Nuevo Contrato
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <!-- Evidencias View -->
        <div v-if="activeTab === 'evidences'" class="view-section">
          <div class="section-header">
            <h3>Gestión de Evidencias</h3>
            <div class="header-actions">
               <button @click="cargarEvidencias" class="refresh-btn" title="Actualizar">
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                   <path d="M23 4v6h-6"></path>
                   <path d="M1 20v-6h6"></path>
                   <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                 </svg>
               </button>
            </div>
          </div>

          <div v-if="isLoadingEvidencias" class="loading-state">Cargando evidencias...</div>
          <div v-else class="evidences-list">
            <div v-if="evidencias.length === 0" class="empty-state">No hay evidencias registradas.</div>
            <div v-else class="evidence-grid">
              <div v-for="evidencia in evidencias" :key="evidencia.id" class="evidence-card">
                <div class="evidence-header">
                  <span class="evidence-type">{{ evidencia.type }}</span>
                  <span :class="['status-badge', evidencia.validated ? 'validated' : 'pending']">
                    {{ evidencia.validated ? 'Validada' : 'Pendiente' }}
                  </span>
                </div>
                <div class="evidence-body">
                  <p class="evidence-desc">{{ evidencia.description || 'Sin descripción' }}</p>
                  <p class="evidence-date">Fecha de emisión: {{ evidencia.certificateResource?.issuedDate || 'No especificada' }}</p>
                </div>
                <div class="evidence-actions">
                  <button
                    @click="validarEvidencia(evidencia.id)"
                    :disabled="evidencia.validated"
                    class="validate-btn"
                  >
                    {{ evidencia.validated ? 'Validada' : 'Validar' }}
                  </button>
                  <button @click="verDetalles(evidencia)" class="details-btn">
                    Ver detalles
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empleados View -->
        <div v-if="activeTab === 'employees'" class="view-section">
          <div class="section-header">
            <h3>Directorio de Empleados</h3>
            <button @click="downloadReport" class="download-btn">
             Descargar Reporte
            </button>
          </div>

          <div v-if="isLoadingEmpleados" class="loading-state">Cargando empleados...</div>
          <div v-else>
            <div v-if="empleados.length === 0" class="empty-state">No hay empleados registrados.</div>
            <div v-else class="empleados-table-container">
              <table class="empleados-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Cargo</th>
                    <th>Balance</th>
                    <th>Evidencias Enviadas</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="empleado in empleados" :key="empleado.id">
                    <td>
                      <div class="employee-name">
                        <div class="avatar-placeholder">{{ empleado.name.charAt(0) }}</div>
                        {{ empleado.name }} {{ empleado.lastName }}
                      </div>
                    </td>
                    <td>{{ empleado.occupation || 'Sin ocupación' }}</td>
                    <td class="balance-cell">{{ empleado.balance || 0 }} pts</td>
                    <td>{{ getEmployeeEvidenceCount(empleado.id) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Modals (unchanged logic, updated styles if needed) -->
    <div v-if="selectedEvidencia" class="modal-overlay" @click.self="selectedEvidencia = null">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Detalles de la Evidencia</h3>
            <button class="close-icon" @click="selectedEvidencia = null">×</button>
          </div>
          
          <div class="modal-body">
            <div class="detail-section">
              <h4>Información de la Evidencia</h4>
              <div class="detail-row">
                <span class="label">Descripción:</span>
                <span class="value">{{ selectedEvidencia.description || 'Sin descripción' }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Fecha de emisión:</span>
                <span class="value">{{ selectedEvidencia.certificateResource?.issuedDate || 'No especificada' }}</span>
              </div>
            </div>

            <div class="detail-section">
              <h4>Información del Empleado</h4>
              <div v-if="isLoadingDetails" class="loading-text">Cargando datos...</div>
              <div v-else-if="selectedEmployee" class="employee-details">
                <div class="detail-row">
                  <span class="label">Nombre:</span>
                  <span class="value highlight">
                    {{ selectedEmployee.name }} {{ selectedEmployee.lastName }}
                  </span>
                </div>
                <div class="detail-row">
                  <span class="label">Email:</span>
                  <span class="value">{{ selectedEmployee.workEmail }}</span>
                </div>
              </div>
              <div v-else class="no-data">
                No se pudo cargar la información del empleado.
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-close" @click="selectedEvidencia = null">Cerrar</button>
          </div>
        </div>
      </div>

      <!-- Modal de crear contrato -->
      <div v-if="showContractModal" class="modal-overlay">
        <div class="modal-content contract-modal-content">
          <ContractForm 
            :isModal="true"
            @close="showContractModal = false"
            @success="handleContractSuccess"
          />
        </div>
      </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import AppNavbar from '@/shared/components/AppNavbar.vue'
import api, { getEmployeeBalance } from '@/modules/auth/services/api'
import { useAuthStore } from '@/stores/authStore'
import ContractForm from '@/modules/auth/views/dashboard/ContractForm.vue'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const activeTab = ref('evidences')
const evidencias = ref([])
const empleados = ref([])
const selectedEvidencia = ref(null)
const selectedEmployee = ref(null)
const isLoadingDetails = ref(false)
const showContractModal = ref(false)

const isLoadingEvidencias = ref(false)
const isLoadingEmpleados = ref(false)

const authStore = useAuthStore()

async function cargarEvidencias() {
  isLoadingEvidencias.value = true
  const token = authStore.token
  const companyId = authStore.user?.company_id

  try {
    const res = await api.get(`/evidences/company/${companyId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    evidencias.value = res.data || []
  } catch (e) {
    console.error('Error cargando evidencias:', e)
    evidencias.value = []
  } finally {
    isLoadingEvidencias.value = false
  }
}

async function validarEvidencia(id) {
  const token = authStore.token
  try {
    await api.patch(
      `/evidences/${id}`,
      { validate: true },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    alert('Evidencia validada correctamente.')
    await cargarEvidencias()
  } catch (e) {
    console.error('Error validando evidencia:', e)
    alert('Error al validar evidencia.')
  }
}

function verDetalles(evidencia) {
  selectedEvidencia.value = evidencia
  selectedEmployee.value = null
  
  if (evidencia.employeeId) {
    isLoadingDetails.value = true
    api.get(`/employees/${evidencia.employeeId}`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    .then(res => {
      selectedEmployee.value = res.data
    })
    .catch(e => console.error('Error cargando detalles del empleado:', e))
    .finally(() => isLoadingDetails.value = false)
  }
}

function getEmployeeEvidenceCount(employeeId) {
  return evidencias.value.filter(e => e.employeeId === employeeId).length
}

function downloadReport() {
  if (empleados.value.length === 0) {
    alert('No hay datos para generar el reporte.')
    return
  }

  const doc = new jsPDF()

  // Title
  doc.setFontSize(18)
  doc.text('Reporte de Empleados', 14, 22)
  doc.setFontSize(11)
  doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 30)

  // Columns
  const columns = [
    { header: 'ID', dataKey: 'id' },
    { header: 'Nombre', dataKey: 'name' },
    { header: 'Apellido', dataKey: 'lastName' },
    { header: 'Ocupación', dataKey: 'occupation' },
    { header: 'Balance', dataKey: 'balance' },
    { header: 'Evidencias', dataKey: 'evidenceCount' },
    { header: 'Detalle Evidencias', dataKey: 'evidenceDetails' },
  ]

  // Rows
  const rows = empleados.value.map(emp => {
    const empEvidences = evidencias.value.filter(e => e.employeeId === emp.id)
    const evidenceCount = empEvidences.length
    
    // Create a summary string of evidences
    const evidenceDetails = empEvidences
      .map(e => `${e.description || 'Sin descripción'} (${e.certificateResource?.issuedDate || 'Fecha no especificada'})`)
      .join('\n') // Use newline for PDF readability

    return {
      id: emp.id,
      name: emp.name,
      lastName: emp.lastName,
      occupation: emp.occupation || 'N/A',
      balance: emp.balance || 0,
      evidenceCount: evidenceCount,
      evidenceDetails: evidenceDetails
    }
  })

  // Generate Table
  autoTable(doc, {
    head: [columns.map(col => col.header)],
    body: rows.map(row => columns.map(col => row[col.dataKey])),
    startY: 35,
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 2 },
    columnStyles: {
      6: { cellWidth: 60 } // Wider column for evidence details
    }
  })

  // Save
  doc.save(`reporte_empleados_${new Date().toISOString().slice(0,10)}.pdf`)
}

onMounted(async () => {
  const companyId = authStore.user?.company_id
  if (!companyId) {
    console.warn('company_id no disponible en authStore.user:', authStore.user)
    return
  }

  await cargarEvidencias()

  isLoadingEmpleados.value = true
  try {
    const res = await api.get(`/employees/company/${companyId}`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    
    const employeesData = res.data || []
    
    // Fetch balances for each employee
    const employeesWithBalance = await Promise.all(employeesData.map(async (emp) => {
      try {
        const balanceRes = await getEmployeeBalance(emp.id, authStore.token)
        return {
          ...emp,
          balance: balanceRes.data?.balance || 0
        }
      } catch (err) {
        console.error(`Error fetching balance for employee ${emp.id}:`, err)
        return { ...emp, balance: 0 }
      }
    }))

    empleados.value = employeesWithBalance
  } catch (e) {
    console.error('Error cargando empleados:', e)
    empleados.value = []
  } finally {
    isLoadingEmpleados.value = false
  }
})

const handleContractSuccess = () => {
  showContractModal.value = false
}
</script>

<style scoped>
.dashboard-layout {
  min-height: 100vh;
  background-color: #f3f4f6;
  display: flex;
  flex-direction: column;
}

.dashboard-container {
  display: flex;
  flex: 1;
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
}

/* Sidebar */
.sidebar {
  width: 260px;
  background: white;
  border-right: 1px solid #e5e7eb;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.sidebar-header h2 {
  font-size: 1.25rem;
  color: #111827;
  font-weight: 700;
  margin: 0;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.nav-item {
  text-align: left;
  padding: 12px 16px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: #4b5563;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.95rem;
}

.nav-item:hover {
  background-color: #f9fafb;
  color: #111827;
}

.nav-item.active {
  background-color: #eff6ff;
  color: #2563eb;
  font-weight: 600;
}

.create-contract-btn {
  width: 100%;
  padding: 12px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.create-contract-btn:hover {
  background: #1d4ed8;
}

/* Main Content */
.main-content {
  flex: 1;
  padding: 32px;
  overflow-y: auto;
}

.view-section {
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-header h3 {
  font-size: 1.5rem;
  color: #111827;
  margin: 0;
}

.refresh-btn {
  background: white;
  border: 1px solid #e5e7eb;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.refresh-btn:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

.download-btn {
  background: #10b981;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s;
}

.download-btn:hover {
  background: #059669;
}

/* Evidence Grid */
.evidence-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.evidence-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  border: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.evidence-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.evidence-type {
  font-weight: 600;
  color: #111827;
}

.status-badge {
  font-size: 0.75rem;
  padding: 4px 8px;
  border-radius: 999px;
  font-weight: 500;
}

.status-badge.validated {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.pending {
  background: #fef3c7;
  color: #92400e;
}

.evidence-desc {
  color: #6b7280;
  font-size: 0.9rem;
  margin: 0 0 8px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.evidence-date {
  color: #9ca3af;
  font-size: 0.8rem;
  margin: 0;
}

.evidence-actions {
  display: flex;
  gap: 8px;
  margin-top: auto;
}

.validate-btn {
  flex: 1;
  padding: 8px;
  border-radius: 6px;
  border: none;
  background: #10b981;
  color: white;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.validate-btn:hover:not(:disabled) {
  background: #059669;
}

.validate-btn:disabled {
  background: #d1fae5;
  color: #065f46;
  cursor: default;
}

.details-btn {
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  background: white;
  color: #374151;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.details-btn:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

/* Employees Table */
.empleados-table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  overflow: hidden;
}

.empleados-table {
  width: 100%;
  border-collapse: collapse;
}

.empleados-table th {
  background: #f9fafb;
  padding: 16px 24px;
  text-align: left;
  font-size: 0.85rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.empleados-table td {
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
  color: #111827;
  font-size: 0.95rem;
}

.employee-name {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 500;
}

.avatar-placeholder {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #e0e7ff;
  color: #4f46e5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
}

.balance-cell {
  font-family: monospace;
  font-weight: 600;
  color: #059669;
}

/* Modal Styles Reuse */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right:0;
  bottom:0;
  background: rgba(0,0,0,0.6);
  display:flex;
  align-items:center;
  justify-content:center;
  z-index: 1000;
  backdrop-filter: blur(2px);
}
.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideUp 0.3s ease-out;
}
.contract-modal-content {
  max-width: 800px; /* Wider for contract form */
  width: 95%;
  max-height: 90vh;
  overflow-y: auto;
}
@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
.modal-header {
  padding: 16px 24px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.modal-header h3 {
  margin: 0;
  color: #166534;
  font-size: 1.25rem;
}
.close-icon {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #6c757d;
  cursor: pointer;
  line-height: 1;
}
.close-icon:hover {
  color: #343a40;
}
.modal-body {
  padding: 24px;
  overflow-y: auto;
  max-height: 70vh;
}
.detail-section {
  margin-bottom: 24px;
}
.detail-section:last-child {
  margin-bottom: 0;
}
.detail-section h4 {
  margin: 0 0 12px 0;
  color: #495057;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 6px;
}
.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 0.95rem;
}
.label {
  color: #6c757d;
  font-weight: 500;
}
.value {
  color: #212529;
  font-weight: 600;
  text-align: right;
}
.value.highlight {
  color: #166534;
  font-weight: 600;
}
.loading-text, .no-data, .empty-state, .loading-state {
  text-align: center;
  color: #6c757d;
  font-style: italic;
  padding: 24px;
}
.modal-footer {
  padding: 16px 24px;
  background-color: #f8f9fa;
  border-top: 1px solid #e9ecef;
  display: flex;
  justify-content: flex-end;
}
.btn-close {
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-close:hover {
  background-color: #5a6268;
}
</style>
