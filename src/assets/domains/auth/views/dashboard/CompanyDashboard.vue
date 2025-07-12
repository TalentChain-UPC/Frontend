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
                <p><strong>Datos:</strong></p>
                <pre>{{ parseData(evidencia.data) }}</pre>
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
          <h3>Detalles de la evidencia</h3>
          <p><strong>Tipo:</strong> {{ selectedEvidencia.type }}</p>
          <p><strong>Datos:</strong></p>
          <pre>{{ parseData(selectedEvidencia.data) }}</pre>
          <p><strong>Fecha:</strong> {{ selectedEvidencia.updated_at }}</p>
          <p><strong>Empleado ID:</strong> {{ selectedEvidencia.employeeId }}</p>
          <button @click="selectedEvidencia = null">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import AppNavbar from '@/shared/components/AppNavbar.vue'
import api from '@/assets/domains/auth/services/api'
import { useAuthStore } from '@/stores/authStore'

const evidencias = ref([])
const empleados = ref([])
const selectedEvidencia = ref(null)

const isLoadingEvidencias = ref(false)
const isLoadingEmpleados = ref(false)

const authStore = useAuthStore()

function parseData(rawData) {
  try {
    const parsed = JSON.parse(rawData)
    if (parsed.valor !== undefined) {
      return `${parsed.valor} horas`
    }
    return rawData
  } catch {
    return rawData
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
}
.modal-content {
  background:white;
  padding:1.5rem;
  border-radius:8px;
  max-width:600px;
  width:90%;
}
</style>
