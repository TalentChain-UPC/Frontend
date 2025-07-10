<template>
  <div class="employee-contracts">
    <div class="contracts-header">
      <button class="back-btn" @click="goBack">← Volver</button>
      <h2>Mis Contratos Activos</h2>
    </div>
    <div v-if="contratos.length === 0">No tienes contratos activos.</div>
    <div v-for="contrato in contratos" :key="contrato.id" class="contract-card">
      <h3>{{ contrato.nombre }}</h3>
      <p>Tipo: {{ contrato.tipo }}</p>
      <p v-if="contrato.requirements">Requisitos: <span class="req-json">{{ contrato.requirements }}</span></p>
      <button @click="goToEvidence(contrato)">Subir evidencia</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/assets/domains/auth/services/api'
import { useAuthStore } from '@/stores/authStore'

const contratos = ref([])
const router = useRouter()
const authStore = useAuthStore()

onMounted(async () => {
  try {
    // Suponiendo que el backend tiene un endpoint para obtener contratos del empleado
    const res = await api.get('/contracts/employee', {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    contratos.value = res.data
  } catch {
    contratos.value = []
  }
})

function goToEvidence(contrato) {
  router.push({
    name: 'nueva-evidencia',
    query: { contractId: contrato.id, tipo: contrato.tipo }
  })
}

function goBack() {
  router.back()
}
</script>

<style scoped>
.employee-contracts {
  max-width: 700px;
  margin: 32px auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  padding: 32px 24px;
  position: relative;
}
.contracts-header {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 18px;
}
.back-btn {
  background: none;
  border: none;
  color: #e91e63;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  padding: 6px 16px;
  border-radius: 8px;
  transition: background 0.2s;
  z-index: 2;
}
.back-btn:hover {
  background: #f9e3f2;
}
.contract-card {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 18px 16px;
  margin-bottom: 18px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}
.contract-card h3 {
  margin: 0 0 8px 0;
  color: #e91e63;
}
.contract-card p {
  margin: 4px 0;
}
.contract-card button {
  background: #e91e63;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 18px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 10px;
  transition: background 0.2s;
}
.contract-card button:hover {
  background: #d015b9;
}
.req-json {
  font-family: monospace;
  font-size: 0.95em;
  color: #333;
}
</style>
