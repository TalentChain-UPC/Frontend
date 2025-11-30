<template>
  <div>
    <AppNavbar />
    <div class="company-dashboard">
      <h2>Panel de Empresa</h2>

      <div class="company-actions">
        <router-link :to="{ name: 'nuevo-contrato' }" class="action-btn">
          Crear nuevo contrato
        </router-link>
      </div>

      <div class="company-features">
        <!-- Evidencias -->
        <div class="feature-card">
          <h3>Evidencias</h3>
          <div v-if="isLoadingEvidencias">Cargando evidencias...</div>
          <ul v-else>
            <li v-if="evidencias.length === 0">No hay evidencias registradas.</li>
            <li v-for="evidencia in evidencias" :key="evidencia.id">
              <div class="evidence-card">
                <p><strong>Tipo:</strong> {{ evidencia.type }}</p>
                <p><strong>Datos...</strong></p>
                <div class="evidence-actions">
                  <button
                    @click="validarEvidencia(evidencia.id)"
                    :disabled="evidencia.validated"
                  >
                    {{ evidencia.validated ? '✅ Validada' : 'Validar' }}
                  </button>
                  <button @click="verDetalles(evidencia)">
                    Ver detalles
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </div>

        <!-- Empleados -->
        <div class="feature-card">
          <h3>Empleados</h3>
          <div v-if="isLoadingEmpleados">Cargando empleados...</div>
          <div v-else>
            <div v-if="empleados.length === 0">No hay empleados registrados.</div>
            <div v-else class="empleados-grid">
              <div
                v-for="empleado in empleados"
                :key="empleado.id"
                class="empleado-card"
              >
                <div class="empleado-info">
                  <strong>{{ empleado.name }} {{ empleado.lastName }}</strong>
                  <p>{{ empleado.occupation || 'Sin ocupación' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal de detalles -->
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
                <span class="label">Tipo:</span>
                <span class="value">{{ selectedEvidencia.type }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Fecha de creación:</span>
                <span class="value">{{ new Date(selectedEvidencia.created_at || selectedEvidencia.updated_at).toLocaleString() }}</span>
              </div>
              
              <!-- Parsed Data Fields -->
              <div v-if="parseData(selectedEvidencia.data).description" class="detail-row">
                <span class="label">Descripción:</span>
                <span class="value">{{ parseData(selectedEvidencia.data).description }}</span>
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
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppNavbar from '@/shared/components/AppNavbar.vue'
import api from '@/modules/auth/services/api'
import { useAuthStore } from '@/stores/authStore'

const evidencias = ref([])
const empleados = ref([])
const selectedEvidencia = ref(null)
const selectedEmployee = ref(null)
const isLoadingDetails = ref(false)

const isLoadingEvidencias = ref(false)
const isLoadingEmpleados = ref(false)

const authStore = useAuthStore()

function parseData(rawData) {
  try {
    const parsed = JSON.parse(rawData)
    return parsed
  } catch {
    return {}
  }
}

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
    alert('✅ Evidencia validada correctamente.')
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
    empleados.value = res.data || []
  } catch (e) {
    console.error('Error cargando empleados:', e)
    empleados.value = []
  } finally {
    isLoadingEmpleados.value = false
  }
})
</script>

<style scoped>
.empleados-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}
.empleado-card {
  background: #f7f7f7;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  align-items: center;
}
.empleado-info p {
  margin: 0.25rem 0 0;
  font-size: 0.9rem;
  color: #555;
}

.company-dashboard {
  background-color: #fcfcfc;
  min-height: 100vh;
  padding: 32px 16px;
}
.company-dashboard h2 {
  text-align: center;
  color: #166534;
  margin-bottom: 2rem;
}
.company-actions {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}
.action-btn {
  background: #e91e63;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 700;
  text-decoration: none;
  font-size: 1.1rem;
  transition: background 0.2s;
}
.action-btn:hover {
  background: #d015b9;
  }
.company-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}
.feature-card {
  background: #fff;
  padding: 1.25rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.feature-card h3 {
  color: #166534;
  margin-bottom: 1rem;
}
.feature-card ul{
  list-style: none;
  padding: 0;
}
.evidence-card {
  background: #f7f7f7;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
}
.evidence-card pre {
  background: #efefef;
  padding: 0.5rem;
  border-radius: 4px;
  overflow-x: auto;
}
.evidence-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
}
.evidence-actions button {
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;
}
.evidence-actions button:first-child {
  background: #4caf50;
  color: white;
}
.evidence-actions button:first-child:hover {
  background: #43a047;
}
.evidence-actions button:disabled {
  background: #ccc;
  cursor: not-allowed;
}
.evidence-actions button:last-child {
  background: #1976d2;
  color: white;
}
.evidence-actions button:last-child:hover {
  background: #1565c0;
}

/* Modal Styles */
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
}
.data-preview {
  background: #f8f9fa;
  padding: 8px;
  border-radius: 4px;
  font-size: 0.85rem;
  color: #495057;
  margin-top: 4px;
  white-space: pre-wrap;
  word-break: break-all;
}
.loading-text, .no-data {
  text-align: center;
  color: #6c757d;
  font-style: italic;
  padding: 10px;
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
