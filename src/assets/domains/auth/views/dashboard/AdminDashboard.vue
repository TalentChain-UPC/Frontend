<template>
  <div class="dashboard">
    <h1>Panel Administrativo</h1>
    <p>Bienvenido {{ user.name }} ({{ user.role }})</p>
    <button @click="handleLogout">Cerrar Sesión</button>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

export default {
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()
    const user = computed(() => authStore.user)

    const handleLogout = () => {
      authStore.logout()
      router.push('/login')
    }

    return { user, handleLogout }
  }
}
</script>
