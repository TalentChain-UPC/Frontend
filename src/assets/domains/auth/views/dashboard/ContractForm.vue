<template>
  <form @submit.prevent="handleSubmit" class="contract-form">
    <button type="button" class="close-btn" @click="goBack" title="Volver">
      ×
    </button>
    <h2>Crear Contrato</h2>
    <div>
      <label>Nombre del contrato</label>
      <input v-model="name" required />
    </div>
    <div>
      <label>Descripción</label>
      <textarea v-model="description" required rows="2" />
    </div>
    <div>
      <label>ID de la empresa</label>
      <input v-model="companyId" type="number" required />
    </div>
    <div>
      <label>Tipo de evidencia</label>
      <select v-model="evidenceType" required>
        <option value="CERTIFICATE">CERTIFICATE</option>
        <option value="PROMOTION">PROMOTION</option>
        <option value="PUNCTUALITY">PUNCTUALITY</option>
        <option value="SPECIALIZATION">SPECIALIZATION</option>
        <option value="STUDY_WORKSHOP">STUDY_WORKSHOP</option>
        <option value="JOB_TRAINING">JOB_TRAINING</option>
        <option value="PROACTIVITY">PROACTIVITY</option>
      </select>
    </div>
    <div>
      <label>Bonificaciones por horas</label>
      <div v-for="(item, idx) in bonificacionesPorHoras" :key="idx" class="bono-row">
        <span>De</span>
        <input type="number" v-model.number="item.min" min="0" style="width:60px" required />
        <span>a</span>
        <input type="number" v-model.number="item.max" min="0" style="width:60px" required />
        <span>horas: recompensa</span>
        <input type="number" v-model.number="item.recompensa" min="0" style="width:60px" required />
        <button type="button" @click="removeBono(idx)" v-if="bonificacionesPorHoras.length > 1" style="margin-left:4px">✕</button>
      </div>
      <button type="button" @click="addBono" style="margin-top:6px">Agregar rango</button>
    </div>
    <div>
      <label>Fecha de inicio</label>
      <input v-model="startDateTime" type="datetime-local" required />
    </div>
    <div>
      <label>Fecha de fin</label>
      <input v-model="endDateTime" type="datetime-local" required />
    </div>
    <button type="submit">Crear Contrato</button>
    <div v-if="mensaje" class="mensaje">{{ mensaje }}</div>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { createContract } from '@/assets/domains/auth/services/api'
import { useAuthStore } from '@/stores/authStore'

const name = ref('')
const description = ref('')
const companyId = ref('')
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

import { useRouter } from 'vue-router'
const authStore = useAuthStore()
const router = useRouter()

const goBack = () => {
  router.back()
}

const handleSubmit = async () => {
  try {
    const requirementsObj = { bonificacionesPorHoras: bonificacionesPorHoras.value }
    const payload = {
      name: name.value,
      description: description.value,
      companyId: companyId.value ? Number(companyId.value) : null,
      evidenceType: evidenceType.value,
      requirements: JSON.stringify(requirementsObj),
      startDateTime: startDateTime.value.replace('T', ' '),
      endDateTime: endDateTime.value.replace('T', ' ')
    }
    console.log('Payload a enviar:', payload)
    await createContract(payload, authStore.token)
    mensaje.value = 'Contrato creado correctamente.'
    name.value = ''
    description.value = ''
    companyId.value = ''
    bonificacionesPorHoras.value = [
      { min: 0, max: 7, recompensa: 0 },
      { min: 8, max: 11, recompensa: 5 },
      { min: 12, max: 39, recompensa: 10 },
      { min: 40, max: 1000, recompensa: 25 }
    ]
    startDateTime.value = ''
    endDateTime.value = ''
  } catch {
    mensaje.value = 'Error al crear contrato.'
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
.close-btn {
  position: absolute;
  top: 18px;
  right: 18px;
  background: none;
  border: none;
  font-size: 2rem;
  color: #e91e63;
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
.contract-form {
  position: relative;
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
.contract-form label {
  font-weight: 600;
  margin-bottom: 4px;
}
.contract-form input, .contract-form select, .contract-form textarea {
  width: 100%;
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
  font-family: inherit;
  font-size: 1rem;
  resize: vertical;
}
.bono-row {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 6px;
}
.mensaje {
  color: #27ae60;
  font-weight: 600;
  margin-top: 10px;
}
</style>
