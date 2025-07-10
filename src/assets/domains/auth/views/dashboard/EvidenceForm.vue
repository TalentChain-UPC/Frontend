<template>
  <form @submit.prevent="handleSubmit" class="evidence-form">
    <h2>Enviar Evidencia</h2>
    <div>
      <label>ID del contrato</label>
      <input v-model="contractId" required />
    </div>
    <div>
      <label>Tipo de contrato</label>
      <select v-model="tipo" required>
        <option value="CERTIFICATE">CERTIFICATE</option>
        <option value="BONUS">BONUS</option>
        <!-- Agrega más tipos si tu backend los soporta -->
      </select>
    </div>
    <div v-if="tipo === 'CERTIFICATE'">
      <label>Número de horas</label>
      <input v-model.number="numeroDeHoras" type="number" min="0" required />
    </div>
    <button type="submit">Enviar Evidencia</button>
    <div v-if="mensaje" class="mensaje">{{ mensaje }}</div>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { createEvidence } from '@/assets/domains/auth/services/api'
import { useAuthStore } from '@/stores/authStore'

const contractId = ref('')
const tipo = ref('CERTIFICATE')
const numeroDeHoras = ref(0)
const mensaje = ref('')
const authStore = useAuthStore()

const handleSubmit = async () => {
  let data = {}
  if (tipo.value === 'CERTIFICATE') {
    data = { numeroDeHoras: numeroDeHoras.value }
  }
  // Puedes agregar más tipos aquí
  try {
    await createEvidence({
      contractId: contractId.value,
      tipo: tipo.value,
      data: JSON.stringify(data)
    }, authStore.token)
    mensaje.value = 'Evidencia enviada correctamente.'
    numeroDeHoras.value = 0
  } catch {
    mensaje.value = 'Error al enviar evidencia.'
  }
}
</script>

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
