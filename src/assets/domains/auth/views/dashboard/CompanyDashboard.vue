<template>
  <div class="dashboard company-dashboard">
    <header class="dashboard-header">
      <h1>Panel de Empresa</h1>
      <button @click="logout" class="logout-button">Cerrar Sesión</button>
    </header>

    <main class="dashboard-content">
      <div class="user-info">
        <img :src="user.avatar" alt="Avatar" class="avatar">
        <h2>Bienvenido, {{ user.name }}</h2>
        <p>Rol: Empresa</p>
      </div>

      <div class="company-features">
        <div class="feature-card">
          <h3>Gestión de Trabajadores</h3>
          <p>Administra tu equipo de trabajo</p>
        </div>
        <div class="feature-card">
          <h3>Recompensas</h3>
          <p>Configura las recompensas disponibles</p>
        </div>
        <div class="feature-card">
          <h3>Reportes</h3>
          <p>Analiza el desempeño de tu equipo</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();

    const logout = () => {
      authStore.logout();
      router.push('/login');
    };

    return {
      user: authStore.user,
      logout
    };
  }
};
</script>

<style scoped>
.company-dashboard {
  background-color: #f0fdf4;
}

.company-features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 2rem;
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
</style>
