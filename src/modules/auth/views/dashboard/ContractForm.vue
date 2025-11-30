<template>
  <div class="contract-form-container" :class="{ 'modal-mode': isModal }">
    <form @submit.prevent="handleSubmit" class="contract-form">
      <button type="button" class="close-btn" @click="goBack" title="Volver">
        ×
      </button>
      
      <header class="form-header">
        <h2>Crear Nuevo Contrato</h2>
      </header>

      <div class="form-grid">
        <!-- Company Name Field -->
        <div class="form-group full-width" v-if="companyName">
          <label>Empresa</label>
          <input :value="companyName" readonly disabled class="readonly-input" />
        </div>

        <div class="form-group full-width">
          <label>Nombre del contrato</label>
          <input v-model="name" placeholder="Ej. Contrato de Desarrollo Senior" required />
        </div>

        <div class="form-group full-width">
          <label>Descripción</label>
          <textarea v-model="description" required rows="3" placeholder="Describe los detalles del contrato..." />
        </div>

        <div class="form-group full-width">
          <label>Tipo de evidencia</label>
          <div class="select-wrapper">
            <select v-model="evidenceType" required>
              <option value="CERTIFICATE">Certificado</option>
              <option value="PROMOTION">Ascenso</option>
              <option value="PUNCTUALITY">Puntualidad</option>
              <option value="SPECIALIZATION">Especialización</option>
              <option value="STUDY_WORKSHOP">Taller de Estudio</option>
              <option value="JOB_TRAINING">Capacitación Laboral</option>
              <option value="PROACTIVITY">Proactividad</option>
            </select>
          </div>
        </div>

        <div class="form-group full-width bonuses-section">
          <label>Bonificaciones por horas</label>
          <div class="bonuses-list">
            <div v-for="(item, idx) in bonificacionesPorHoras" :key="idx" class="bono-row">
              <div class="bono-inputs">
                <div class="input-group">
                  <span>De</span>
                  <input type="number" v-model.number="item.min" min="0" required />
                </div>
                <div class="input-group">
                  <span>a</span>
                  <input type="number" v-model.number="item.max" min="0" required />
                </div>
                <div class="input-group reward-group">
                  <span>horas:</span>
                  <input type="number" v-model.number="item.recompensa" min="0" required class="reward-input" />
                  <span class="currency-label">pts</span>
                </div>
              </div>
              <button 
                type="button" 
                @click="removeBono(idx)" 
                v-if="bonificacionesPorHoras.length > 1" 
                class="remove-btn"
                title="Eliminar rango"
              >
                ✕
              </button>
            </div>
          </div>
          <button type="button" @click="addBono" class="add-btn">
            + Agregar rango
          </button>
        </div>

        <div class="form-row dates-row">
          <div class="form-group">
            <label>Fecha de inicio</label>
            <input v-model="startDateTime" type="datetime-local" required />
          </div>
          <div class="form-group">
            <label>Fecha de fin</label>
            <input v-model="endDateTime" type="datetime-local" required />
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="submit-btn">Crear Contrato</button>
      </div>

      <div v-if="mensaje" class="mensaje" :class="{ error: isError }">
        {{ mensaje }}
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { createContract, getCompanyById } from '@/modules/auth/services/api'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

const props = defineProps({
  isModal: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'success'])

const authStore = useAuthStore()
const router = useRouter()

const name = ref('')
const description = ref('')
const evidenceType = ref('CERTIFICATE')
const bonificacionesPorHoras = ref([
  { min: 0, max: 7, recompensa: 0 },
  { min: 8, max: 11, recompensa: 5 },
  { min: 12, max: 39, recompensa: 10 },
  { min: 40, max: 1000, recompensa: 25 }
])
const startDateTime = ref('')
const endDateTime = ref('')
const mensaje = ref('')
const isError = ref(false)
const fetchedCompanyName = ref(localStorage.getItem('cachedCompanyName') || '')

// Get company details
const companyName = computed(() => {
  return fetchedCompanyName.value || authStore.user?.name || ''
})

const fetchCompanyDetails = async () => {
  let user = authStore.user
  let companyId = user?.company_id || user?.companyId || (user?.role === 'COMPANY' ? user.id : null)

  // If companyId is missing and user is employee, try to fetch it
  if (!companyId && user?.role === 'EMPLOYEE' && user?.employeeId) {
      try {
        const { AuthService } = await import('@/modules/auth/services/authService')
        const profileRes = await AuthService.fetchEmployeeProfile(user.employeeId, authStore.token)
        if (profileRes.success && profileRes.user) {
          companyId = profileRes.user.companyId
        }
      } catch (e) {
        console.error('Error fetching profile for companyId:', e)
      }
  }

  if (companyId) {
    // If we already have a cached name, we can still fetch in background to update it
    try {
      const res = await getCompanyById(companyId, authStore.token)
      if (res.data && res.data.name) {
        fetchedCompanyName.value = res.data.name
        localStorage.setItem('cachedCompanyName', res.data.name)
      }
    } catch (e) {
      console.error('Error fetching company details:', e)
    }
  }
}

onMounted(() => {
  fetchCompanyDetails()
})

const goBack = () => {
  if (props.isModal) {
    emit('close')
  } else {
    router.back()
  }
}

const handleSubmit = async () => {
  try {
    // Determine company ID logic
    let user = authStore.user
    // Prioritize company_id/companyId if it exists, otherwise fall back to user.id if role is COMPANY
    let companyId = user?.company_id || user?.companyId || (user?.role === 'COMPANY' ? user.id : null)

    console.log('User from store:', user)
    console.log('Initial companyId:', companyId)

    // Force fetch companyId if user is employee to ensure correctness (user reported stale ID 11 vs 4)
    if (user?.role === 'EMPLOYEE' && user?.employeeId) {
      try {
        const { AuthService } = await import('@/modules/auth/services/authService')
        const profileRes = await AuthService.fetchEmployeeProfile(user.employeeId, authStore.token)
        if (profileRes.success && profileRes.user) {
          console.log('Fetched employee profile:', profileRes.user)
          companyId = profileRes.user.companyId
          console.log('Corrected companyId from profile:', companyId)
        }
      } catch (e) {
        console.error('Error fetching profile for companyId:', e)
      }
    }

    if (!companyId) {
      mensaje.value = 'Error: No se pudo identificar la empresa. Por favor, inicie sesión nuevamente.'
      isError.value = true
      return
    }

    const requirementsObj = { bonificacionesPorHoras: bonificacionesPorHoras.value }
    
    // Ensure companyId is a number
    const finalCompanyId = Number(companyId)

    // Format dates as YYYY-MM-DD HH:mm (matching user's working example)
    const formatDate = (dateVal) => {
        if (!dateVal) return ''
        return dateVal.replace('T', ' ')
    }

    const payload = {
      name: name.value,
      description: description.value,
      companyId: finalCompanyId, 
      evidenceType: evidenceType.value,
      requirements: JSON.stringify(requirementsObj),
      startDateTime: formatDate(startDateTime.value),
      endDateTime: formatDate(endDateTime.value)
    }
    
    console.log('Payload a enviar:', payload)
    await createContract(payload, authStore.token)
    
    mensaje.value = 'Contrato creado correctamente.'
    isError.value = false
    
    if (props.isModal) {
      setTimeout(() => {
        emit('success')
      }, 1500)
    }
    
    // Reset form
    name.value = ''
    description.value = ''
    bonificacionesPorHoras.value = [
      { min: 0, max: 7, recompensa: 0 },
      { min: 8, max: 11, recompensa: 5 },
      { min: 12, max: 39, recompensa: 10 },
      { min: 40, max: 1000, recompensa: 25 }
    ]
    startDateTime.value = ''
    endDateTime.value = ''
    
  } catch (err) {
    console.error('Error creating contract:', err)
    if (err.response && err.response.data) {
        console.error('Server response:', err.response.data)
        // Display specific error from server if available
        const serverError = typeof err.response.data === 'string' ? err.response.data : (err.response.data.message || JSON.stringify(err.response.data))
        mensaje.value = `Error: ${serverError}`
    } else {
        mensaje.value = 'Error al crear contrato.'
    }
    isError.value = true
  }
}

function addBono() {
  bonificacionesPorHoras.value.push({ min: 0, max: 0, recompensa: 0 })
}

function removeBono(idx) {
  if (bonificacionesPorHoras.value.length > 1) bonificacionesPorHoras.value.splice(idx, 1)
}
</script>

<style scoped>
/* Reset box-sizing for consistency */
*, *::before, *::after {
  box-sizing: border-box;
}

.contract-form-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  padding: 40px 20px;
  background-color: #f8f9fa;
  font-family: 'Inter', 'Segoe UI', sans-serif;
}

.contract-form-container.modal-mode {
  padding: 0;
  min-height: auto;
  background-color: transparent;
  width: 100%;
}

.contract-form {
  position: relative;
  width: 100%;
  max-width: 800px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.08);
  padding: 40px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.modal-mode .contract-form {
  box-shadow: none;
  padding: 20px;
  max-width: 100%;
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 24px;
  color: #adb5bd;
  cursor: pointer;
  transition: color 0.2s;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  z-index: 10;
}

.close-btn:hover {
  color: #495057;
  background-color: #f1f3f5;
}

.form-header {
  text-align: center;
  margin-bottom: 10px;
}

.form-header h2 {
  font-size: 1.75rem;
  color: #212529;
  margin: 0;
  font-weight: 700;
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

/* Increased spacing for dates */
.dates-row {
  gap: 40px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.form-group label {
  font-weight: 600;
  font-size: 0.9rem;
  color: #343a40;
}

input, select, textarea {
  width: 100%;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #dee2e6;
  font-size: 0.95rem;
  transition: border-color 0.2s, box-shadow 0.2s;
  background-color: #fff;
  color: #495057;
  line-height: 1.5;
}

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: #1abc9c;
  box-shadow: 0 0 0 3px rgba(26, 188, 156, 0.15);
}

.readonly-input {
  background-color: #e9ecef;
  color: #495057;
  cursor: not-allowed;
  font-weight: 600;
  border-color: #ced4da;
}

textarea {
  resize: vertical;
  min-height: 80px;
}

/* Bonuses Section */
.bonuses-section {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e9ecef;
}

.bonuses-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 12px;
}

.bono-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  padding: 10px 15px;
  border-radius: 8px;
  border: 1px solid #dee2e6;
  gap: 10px;
  flex-wrap: wrap; /* Allow wrapping on small screens */
}

.bono-inputs {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
  flex: 1;
}

.input-group {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #6c757d;
}

.input-group input {
  width: 80px; /* Fixed width for small number inputs */
  padding: 6px 10px;
  text-align: center;
}

.input-group .reward-input {
  width: 90px;
  font-weight: bold;
  color: #1abc9c;
}

.currency-label {
  font-weight: 600;
  color: #1abc9c;
}

.remove-btn {
  background: none;
  border: none;
  color: #fa5252;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background 0.2s;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-btn:hover {
  background-color: #fff5f5;
}

.add-btn {
  background: none;
  border: 2px dashed #adb5bd;
  color: #6c757d;
  padding: 12px;
  border-radius: 8px;
  width: 100%;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.add-btn:hover {
  border-color: #1abc9c;
  color: #1abc9c;
  background-color: rgba(26, 188, 156, 0.05);
}

/* Actions */
.form-actions {
  margin-top: 10px;
}

.submit-btn {
  width: 100%;
  padding: 14px;
  background-color: #1abc9c;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
}

.submit-btn:hover {
  background-color: #16a085;
}

.submit-btn:active {
  transform: translateY(1px);
}

.mensaje {
  padding: 12px;
  border-radius: 8px;
  background-color: #d3f9d8;
  color: #2b8a3e;
  text-align: center;
  font-weight: 500;
  font-size: 0.95rem;
}

.mensaje.error {
  background-color: #ffe3e3;
  color: #c92a2a;
}

/* Responsive Adjustments */
@media (max-width: 600px) {
  .contract-form-container {
    padding: 20px 10px;
  }

  .contract-form {
    padding: 24px 20px;
  }
  
  .form-row {
    grid-template-columns: 1fr; /* Stack columns on mobile */
    gap: 20px;
  }
  
  .dates-row {
    gap: 20px; /* Reduce gap on mobile when stacked */
  }
  
  .bono-row {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }
  
  .bono-inputs {
    justify-content: space-between;
    width: 100%;
  }
  
  .input-group {
    flex: 1;
    justify-content: center;
  }
  
  .input-group input {
    width: 100%; /* Full width inputs in bonus row on mobile */
    min-width: 60px;
  }
  
  .remove-btn {
    align-self: flex-end;
    width: 100%;
    background-color: #fff5f5;
    margin-top: 5px;
  }
}
</style>
