<template>
  <form @submit.prevent="handleSubmit" class="contract-form">
    <h2>Crear Contrato</h2>
    <div>
      <label>Nombre del contrato</label>
      <input v-model="nombre" required />
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
      <label>Bonificaciones por horas (ejemplo)</label>
      <pre>{{ JSON.stringify(requirements, null, 2) }}</pre>
    </div>
    <button type="submit">Crear Contrato</button>
    <div v-if="mensaje" class="mensaje">{{ mensaje }}</div>
  </form>
</template>

<script setup>
import { ref, computed } from 'vue'
import { createContract } from '@/assets/domains/auth/services/api'
import { useAuthStore } from '@/stores/authStore'

const nombre = ref('')
const tipo = ref('CERTIFICATE')
const mensaje = ref('')
const authStore = useAuthStore()

const requirements = computed(() => {
  if (tipo.value === 'CERTIFICATE') {
    return {
      bonificacionesPorHoras: [
        { min: 0, max: 7, recompensa: 0 },
        { min: 8, max: 11, recompensa: 5 },
        { min: 12, max: 39, recompensa: 10 },
        { min: 40, max: 1000, recompensa: 25 }
      ]
    }
  }
  // Puedes agregar más tipos aquí
  return {}
})

const handleSubmit = async () => {
  try {
    await createContract({
      nombre: nombre.value,
      tipo: tipo.value,
      requirements: JSON.stringify(requirements.value)
    }, authStore.token)
    mensaje.value = 'Contrato creado correctamente.'
    nombre.value = ''
  } catch {
    mensaje.value = 'Error al crear contrato.'
  }
}
</script>

<style scoped>
.contract-form {
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
.contract-form input, .contract-form select {
  width: 100%;
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
}
.contract-form button {
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
