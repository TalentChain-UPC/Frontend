<template>
  <form @submit.prevent="handleSubmit" class="evidence-form">
    <button class="close-btn" @click="goBack" title="Volver">
      ×
    </button>
    <h2>Enviar Evidencia</h2>

    <div>
      <label>Tipo de evidencia</label>
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

    <div>
      <label>Descripción</label>
      <input v-model="description" required />
    </div>

    <div>
      <label>ID del empleado</label>
      <input v-model="employeeId" type="number" required />
    </div>

    <div>
      <label>ID de la empresa</label>
      <input v-model="companyId" type="number" required />
    </div>

    <div>
      <label>Horas realizadas</label>
      <input v-model="dataNumber" type="number" required />
    </div>

    <div>
      <label>URL</label>
      <input v-model="url" required />
    </div>

    <div>
      <label>Nombre del Certificado</label>
      <input v-model="name" required />
    </div>

    <div>
      <label>Institución</label>
      <input v-model="institutionName" required />
    </div>

    <div>
      <label>Fecha de emisión</label>
      <input v-model="issuedDate" type="date" required />
    </div>

    <button type="submit">Enviar Evidencia</button>
    <div v-if="mensaje" class="mensaje">{{ mensaje }}</div>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { createEvidence } from '@/assets/domains/auth/services/api'
import { useAuthStore } from '@/stores/authStore'

const type = ref('CERTIFICATE')
const description = ref('')
const employeeId = ref('')
const companyId = ref('')
const dataNumber = ref('')
const url = ref('')
const name = ref('')
const institutionName = ref('')
const issuedDate = ref('')
const mensaje = ref('')

const authStore = useAuthStore()

const goBack = () => {
  window.history.back()
}

const handleSubmit = async () => {
  try {
    const dataObject = { valor: Number(dataNumber.value) }

    await createEvidence(
      {
        type: type.value,
        description: description.value,
        employeeId: employeeId.value ? Number(employeeId.value) : null,
        companyId: companyId.value ? Number(companyId.value) : null,
        data: JSON.stringify(dataObject),
        url: url.value || '',
        name: name.value || '',
        institutionName: institutionName.value || '',
        issuedDate: issuedDate.value || ''
      },
      authStore.token
    )

    mensaje.value = 'Evidencia enviada correctamente.'

    // Limpiar campos
    description.value = ''
    employeeId.value = ''
    companyId.value = ''
    dataNumber.value = ''
    url.value = ''
    name.value = ''
    institutionName.value = ''
    issuedDate.value = ''
  } catch {
    mensaje.value = 'Error al enviar evidencia.'
  }
}
</script>


<style scoped>
.close-btn {
  position: absolute;
  top: 35px;
  right: 500px;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  z-index: 2;
  line-height: 1;
  padding: 0 8px;
  transition: color 0.2s;
}
.close-btn:hover {
  color: #b71c50;
}
</style>

<style scoped>
.evidence-form {
  max-width: 400px;
  margin: 32px auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.evidence-form label {
  font-weight: 600;
  margin-bottom: 4px;
}
.evidence-form input, .evidence-form select {
  width: 100%;
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
}
.evidence-form button {
  background: #e91e63;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 0;
  font-weight: 700;
  cursor: pointer;
  margin-top: 10px;
}
.mensaje {
  color: #27ae60;
  font-weight: 600;
  margin-top: 10px;
}
</style>
