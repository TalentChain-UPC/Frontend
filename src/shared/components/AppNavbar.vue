<template>
  <nav class="navbar">
    <div class="navbar-left">
      <div class="logo">LOGO</div>
    </div>
    <div class="navbar-right">
      <button class="assistance">
        📅 Marcar asistencia
      </button>
      <button class="logout" @click="handleLogout">
        Cerrar Sesión
      </button>
    </div>
  </nav>
</template>

<script>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

export default {
  name: 'AppNavbar',
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()

    const handleLogout = async () => {
      authStore.logout()
      await router.replace('/login')
    }

    return {
      handleLogout
    }
  }
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #303b46;
  padding: 10px 20px;
  border-radius: 5px;
  font-family: 'Poppins', sans-serif;
  font-weight: bold;
  width: 71%;
  margin: 15px auto;
  flex-wrap: wrap;
}

.logo {
  color: white;
  font-size: 20px;
  font-weight: bold;
}

.navbar-right {
  display: flex;
  gap: 12px;
  align-items: center;
}

.assistance {
  background-color: #e61aca;
  color: white;
  font-weight: bold;
  padding: 10px 14px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.assistance:hover {
  background-color: #d015b9;
}

.logout {
  background-color: #f44336;
  color: white;
  font-weight: bold;
  padding: 10px 14px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.logout:hover {
  background-color: #d32f2f;
}

@media (max-width: 768px) {
  .navbar{
    width: 89%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-left: 3%;
  }
}
</style>
