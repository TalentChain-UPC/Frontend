<template>
  <div class="evidence-form-container" :class="{ 'modal-mode': isModal }">
    <form @submit.prevent="handleSubmit" class="evidence-form">
      <button type="button" class="close-btn" @click="goBack" title="Volver">
        ×
      </button>
      
      <header class="form-header">
        <h2>Enviar Evidencia</h2>
      </header>

      <div class="form-grid">

        <div class="form-group full-width">
          <label>Tipo de evidencia</label>
          <div class="select-wrapper">
            <select v-model="type" required>
              <option value="CERTIFICATE">Certificado</option>
              <option value="PROMOTION">Ascenso</option>
              <option value="PUNCTUALITY">Puntualidad</option>
              <option value="SPECIALIZATION">Especialización</option>
              <option value="STUDY_WORKSHOP">Taller de Estudio</option>
              <option value="JOB_TRAINING">Capacitación</option>
              <option value="PROACTIVITY">Proactividad</option>
            </select>
          </div>
        </div>

        <div class="form-group full-width">
          <label>Nombre del Certificado / Actividad</label>
          <input v-model="name" placeholder="Ej. Curso de Vue.js Avanzado" required />
        </div>

        <div class="form-group full-width">
          <label>Institución</label>
          <input v-model="institutionName" placeholder="Ej. Universidad Online" required />
        </div>

        <div class="form-group full-width">
          <label>Descripción</label>
          <textarea v-model="description" required rows="3" placeholder="Describe los detalles de la evidencia..." />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Horas realizadas</label>
            <input v-model="dataNumber" type="number" min="0" required />
          </div>
          <div class="form-group">
            <label>Fecha de emisión</label>
            <input v-model="issuedDate" type="date" required />
          </div>
        </div>

        <div class="form-group full-width">
          <label>URL de soporte (opcional)</label>
          <input v-model="url" placeholder="https://..." />
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="submit-btn">Enviar Evidencia</button>
      </div>

      <div v-if="mensaje" class="mensaje" :class="{ error: isError }">
        {{ mensaje }}
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps, defineEmits, watch } from 'vue'
import { createEvidence } from '@/modules/auth/services/api'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

const props = defineProps({
  contractId: {
    type: [Number, String],
    default: null
  },
  initialType: {
    type: String,
    default: 'CERTIFICATE'
  },
  isModal: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'success'])

const authStore = useAuthStore()
const router = useRouter()

const type = ref(props.initialType)
const description = ref('')
const dataNumber = ref('')
const url = ref('')
const name = ref('')
const institutionName = ref('')
const issuedDate = ref('')
const mensaje = ref('')
const isError = ref(false)

// Watch for prop changes to update local state if modal is reused
watch(() => props.initialType, (newVal) => {
  type.value = newVal
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
    const user = authStore.user
    
    // Automatic ID resolution
    const employeeId = user?.employeeId || (user?.role === 'EMPLOYEE' ? user.id : null)
    const companyId = user?.company_id || user?.companyId
    
    if (!employeeId) {
      mensaje.value = 'Error: No se pudo identificar al empleado. Inicie sesión nuevamente.'
      isError.value = true
      return
    }

    if (!companyId) {
      mensaje.value = 'Error: No se pudo identificar la empresa asociada. Contacte al administrador.'
      isError.value = true
      return
    }

    const dataObject = { valor: Number(dataNumber.value) }

    await createEvidence(
      {
        type: type.value,
        description: description.value,
        employeeId: Number(employeeId),
        companyId: Number(companyId),
        contractId: props.contractId ? Number(props.contractId) : null, // Include contractId if present
        data: JSON.stringify(dataObject),
        url: url.value || '',
        name: name.value || '',
        institutionName: institutionName.value || '',
        issuedDate: issuedDate.value || ''
      },
      authStore.token
    )

    mensaje.value = 'Evidencia enviada correctamente.'
    isError.value = false

    // Limpiar campos
    description.value = ''
    dataNumber.value = ''
    url.value = ''
    name.value = ''
    institutionName.value = ''
    issuedDate.value = ''
    type.value = 'CERTIFICATE' 

    if (props.isModal) {
      setTimeout(() => {
        emit('success')
        mensaje.value = ''
      }, 1500)
    }

  } catch (err) {
    console.error('Error sending evidence:', err)
    const serverError = err.response?.data?.message || (typeof err.response?.data === 'string' ? err.response.data : '')
    mensaje.value = serverError ? `Error: ${serverError}` : 'Error al enviar evidencia.'
    isError.value = true
  }
}
</script>

<style scoped>
/* Reset box-sizing for consistency */
*, *::before, *::after {
  box-sizing: border-box;
}

.evidence-form-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  padding: 40px 20px;
  background-color: #f8f9fa;
  font-family: 'Inter', 'Segoe UI', sans-serif;
}

/* When used inside a modal, remove container padding/bg */
.evidence-form-container.modal-mode {
  min-height: auto;
  padding: 0;
  background-color: transparent;
  width: 100%;
}

.evidence-form {
  position: relative;
  width: 100%;
  max-width: 600px; /* Slightly narrower than contract form for better focus */
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.08);
  padding: 40px;
  display: flex;
  flex-direction: column;
  gap: 24px;
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
  border-color: #e91e63; /* Pink accent for Evidence to distinguish slightly or match brand */
  box-shadow: 0 0 0 3px rgba(233, 30, 99, 0.15);
}

textarea {
  resize: vertical;
  min-height: 80px;
}

/* Actions */
.form-actions {
  margin-top: 10px;
}

.submit-btn {
  width: 100%;
  padding: 14px;
  background-color: #e91e63;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
}

.submit-btn:hover {
  background-color: #d81b60;
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
  .evidence-form-container {
    padding: 20px 10px;
  }

  .evidence-form {
    padding: 24px 20px;
  }
  
  .form-row {
    grid-template-columns: 1fr; /* Stack columns on mobile */
    gap: 20px;
  }
}
</style>
