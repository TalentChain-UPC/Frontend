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
        <div class="feature-card">
          <h3>Evidencias</h3>
          <div v-if="isLoadingEvidencias">Cargando evidencias...</div>
          <ul v-else>
            <li v-if="evidencias.length === 0">No hay evidencias registradas.</li>
            <li v-for="evidencia in evidencias" :key="evidencia.id">
              {{ evidencia.titulo }} - {{ evidencia.fecha }}
            </li>
          </ul>
        </div>

        <div class="feature-card">
          <h3>Empleados</h3>
          <div v-if="isLoadingEmpleados">Cargando empleados...</div>
          <ul v-else>
            <li v-if="empleados.length === 0">No hay empleados registrados.</li>
            <li v-for="empleado in empleados" :key="empleado.id">
              {{ empleado.nombre }}
            </li>
          </ul>
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

const isLoadingEvidencias = ref(false)
const isLoadingEmpleados = ref(false)

const authStore = useAuthStore()

onMounted(async () => {
  const token = authStore.token
  console.log('authStore.user:', authStore.user)
  const companyId = authStore.user?.company_id || authStore.user?.id

  if (!companyId) {
    console.warn('No se encontró company_id. No se pueden cargar evidencias ni empleados.')
    return
  }

  // ✅ Obtener evidencias correctamente
  isLoadingEvidencias.value = true
  try {
    const res = await api.get(
      `/evidences/company/${companyId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    evidencias.value = res.data || []
  } catch (e) {
    console.error('Error cargando evidencias:', e)
    evidencias.value = []
  } finally {
    isLoadingEvidencias.value = false
  }

  // ✅ Obtener empleados
  isLoadingEmpleados.value = true
  try {
    const res = await api.get(
      `/employees/company/${companyId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
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
.company-dashboard {
  background-color: #fcfcfc;
  min-height: 100vh;
  padding: 32px 0;
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
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 2rem;
  max-width: 1100px;
  margin-left: auto;
  margin-right: auto;
}
.feature-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.feature-card h3 {
  color: #166534;
  margin-bottom: 0.5rem;
}
.quick-link {
  display: block;
  margin-top: 10px;
  color: #e91e63;
  font-weight: 600;
  text-decoration: underline;
  cursor: pointer;
}
.quick-link:hover {
  color: #d015b9;
}
</style>
