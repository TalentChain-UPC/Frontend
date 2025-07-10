<template>
  <AppNavbar />
  <div class="company-dashboard">
    <h2>Panel de Empresa</h2>
    <div class="company-actions">
      <router-link :to="{ name: 'nuevo-contrato' }" class="action-btn">Crear nuevo contrato</router-link>
    </div>
    <div class="company-features">
      <div class="feature-card">
        <h3>Contratos creados</h3>
        <ul>
          <li v-for="contrato in contratos" :key="contrato.id">
            {{ contrato.nombre }} ({{ contrato.tipo }})
          </li>
        </ul>
      </div>
      <div class="feature-card">
        <h3>Empleados</h3>
        <ul>
          <li v-for="empleado in empleados" :key="empleado.id">
            {{ empleado.nombre }}
          </li>
        </ul>
      </div>
      <div class="feature-card">
        <h3>Acciones rápidas</h3>
        <router-link :to="{ name: 'nuevo-contrato' }" class="quick-link">+ Contrato</router-link>
        <router-link :to="{ name: 'catalogo' }" class="quick-link">Ver Catálogo</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import AppNavbar from '@/shared/components/AppNavbar.vue'
import api from '@/assets/domains/auth/services/api'
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'

const contratos = ref([])
const empleados = ref([])
const authStore = useAuthStore()

onMounted(async () => {
  try {
    // Obtener contratos creados por la empresa
    const res = await api.get('/contracts/company', {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    contratos.value = res.data
  } catch {
    contratos.value = []
  }
  try {
    // Obtener empleados de la empresa usando el company_id del perfil y mostrar en consola
    const companyId = authStore.user?.company_id
    console.log('companyId usado para empleados:', companyId)
    if (companyId) {
      const res = await api.get(`/employees/${companyId}`, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      })
      console.log('Empleados recibidos:', res.data)
      empleados.value = res.data
    } else {
      empleados.value = []
    }
  } catch (e) {
    console.error('Error obteniendo empleados:', e)
    empleados.value = []
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
