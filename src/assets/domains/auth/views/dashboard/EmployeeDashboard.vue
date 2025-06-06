<template>
  <div class="dashboard employee-dashboard">
    <header class="dashboard-header">
      <h1>Mi Panel</h1>
      <button @click="logout" class="logout-button">Cerrar Sesión</button>
    </header>

    <main class="dashboard-content">
      <div class="user-info">
        <img :src="user.avatar" alt="Avatar" class="avatar">
        <h2>Bienvenido, {{ user.name }}</h2>
        <p>Rol: Trabajador</p>
        <div class="coins-badge">
          <span>Tus SkillCoins: 350</span>
        </div>
      </div>

      <div class="employee-features">
        <div class="feature-card">
          <h3>Mis Logros</h3>
          <p>Revisa tus habilidades certificadas</p>
        </div>
        <div class="feature-card">
          <h3>Recompensas</h3>
          <p>Canjea tus SkillCoins</p>
        </div>
        <div class="feature-card">
          <h3>Progreso</h3>
          <p>Tu desarrollo profesional</p>
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
.employee-dashboard {
  background-color: #fff7ed;
}

.employee-features {
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
  color: #9a3412;
  margin-bottom: 0.5rem;
}

.coins-badge {
  background: #f59e0b;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  display: inline-block;
  margin-top: 0.5rem;
  font-weight: bold;
}
</style>
