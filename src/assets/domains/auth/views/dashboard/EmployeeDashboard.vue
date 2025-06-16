<template>
  <AppNavbar />
  <div class="grid">

    <div class="item item-0 desktop-only profile-card">
      <img src="https://randomuser.me/api/portraits/men/44.jpg" class="profile-pic" />
      <div class="profile-info">
        <h2>{{ user.name }}</h2>
        <p>{{ user.email }}</p>
        <p>{{ user.puesto }}</p>

        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: '60%' }"></div>
        </div>
        <span class="progress-text">60% para subir de nivel</span>
      </div>

      <button class="edit-btn" @click="openModal">Editar perfil</button>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h2>Editar Perfil</h2>
        <form @submit.prevent="saveChanges">
          <div class="form-group">
            <label>Nombre completo</label>
            <input v-model="editUser.name" required />
          </div>

          <div class="form-group">
            <label>Correo</label>
            <input v-model="editUser.email" type="email" required />
          </div>

          <div class="form-group">
            <label>Puesto</label>
            <input v-model="editUser.puesto" required />
          </div>

          <div class="modal-actions">
            <button type="submit" class="save-btn">Guardar</button>
            <button type="button" @click="closeModal" class="cancel-btn">Cancelar</button>
          </div>
        </form>
      </div>
    </div>

    <div class="item item-1 desktop-only medals-card">
      <h3>Medallas</h3>
      <div class="medals-grid">
        <div v-for="i in 8" :key="i" class="medal"></div>
      </div>
    </div>

    <div class="item item-2 desktop-only">
      <div class="achievements-card">
        <div class="achievements-header">
          <h3 class="achievements-title">Logros Mensuales</h3>
          <button class="redeem-button">Canjear premios</button>
        </div>

        <div class="achievements-list">
          <div
            v-for="achievement in achievements"
            :key="achievement.id"
            class="achievement-item"
          >
            <div class="progress-circle">
              <span class="progress-text">{{ achievement.progress }}</span>
            </div>

            <div class="achievement-details">
              <p class="achievement-text">{{ achievement.text }}</p>
            </div>

            <div class="achievement-points">
              <div class="points-icon"></div>
              <span class="points-value">{{ achievement.points }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Items sin modificar (como solicitaste) -->
    <div class="item item-3 desktop-only">
      <div class="featured-trajectory">
        <h3 class="title">Trayectoria destacada</h3>
        <div class="podium-container">
          <!-- Segundo lugar -->
          <div class="podium-block silver" v-if="sortedPeople[1]">
            <div class="position">2°</div>
            <div class="person-info">
              <div class="name">{{ sortedPeople[1].name }}</div>
              <div class="points">{{ sortedPeople[1].points }} pts</div>
            </div>
          </div>

          <!-- Primer lugar -->
          <div class="podium-block gold" v-if="sortedPeople[0]">
            <div class="position">1°</div>
            <div class="person-info">
              <div class="name">{{ sortedPeople[0].name }}</div>
              <div class="points">{{ sortedPeople[0].points }} pts</div>
            </div>
          </div>

          <!-- Tercer lugar -->
          <div class="podium-block bronze" v-if="sortedPeople[2]">
            <div class="position">3°</div>
            <div class="person-info">
              <div class="name">{{ sortedPeople[2].name }}</div>
              <div class="points">{{ sortedPeople[2].points }} pts</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="item item-5 desktop-only">
      <div class="personal-achievements-card">
        <h3 class="personal-achievements-header">Mis Progresos</h3>

        <div class="personal-achievements-container">
          <div
            v-for="goal in personalGoals"
            :key="goal.id"
            class="goal-tracker"
          >
            <div class="goal-progress-circle">
              <span class="goal-progress-count">{{ goal.progress }}</span>
            </div>

            <div class="goal-description">
              <p class="goal-text">{{ goal.text }}</p>
            </div>

            <div class="goal-rewards">
              <div class="reward-badge"></div>
              <span class="reward-amount">{{ goal.points }} pts</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="item item-4 desktop-only">
      <div class="featured-employees">
        <h3 class="title">Empleados destacados</h3>
        <div class="employee-list">
          <div class="header-row">
            <span class="header">Empleado</span>
            <span class="header">Logro</span>
          </div>
          <div
            v-for="(item, index) in trajectoryData"
            :key="index"
            class="employee-item"
          >
            <div class="employee-info">
              <p class="name">{{ item.name }}</p>
              <p class="role">{{ item.role }}</p>
            </div>
            <div class="achievement-info">
              <p class="status">{{ item.status }}</p>
              <p class="reward">{{ item.reward }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';
import AppNavbar from '@/shared/components/AppNavbar.vue';
import { computed } from 'vue';
import { ref, reactive } from 'vue'

export default {
  components: {
    AppNavbar
  },
  setup() {
    const achievements = [
      { id: 1, text: "Marcó asistencia durante 30 días seguidos", progress: "12/30", points: 140 },
      { id: 2, text: "Marcó asistencia durante 30 días seguidos", progress: "12/30", points: 140 },
      { id: 3, text: "Marcó asistencia durante 30 días seguidos", progress: "12/30", points: 140 },
      { id: 4, text: "Marcó asistencia durante 30 días seguidos", progress: "12/30", points: 140 },
    ];

    const people = [
      { name: "Luefa M.", points: 20000 },
      { name: "Christhoper Q.", points: 15000 },
      { name: "Alberto C.", points: 22000 },
      { name: "María G.", points: 12000 },
      { name: "Carlos S.", points: 19000 }
    ];

    const personalGoals = [
      { id: 1, text: "Asistencia perfecta este mes", progress: "12/30", points: 140 },
      { id: 2, text: "Días consecutivos activo", progress: "21/30", points: 140 },
    ];

    const trajectoryData = [
      { name: "Olivia Rhye", role: "Product Designer", status: "Certificación", reward: "120 monedas" },
      { name: "Phoenix Baker", role: "Product Manager", status: "Título", reward: "120 monedas" },
      { name: "Lana Steiner", role: "Frontend Developer", status: "Capacitación", reward: "80 monedas" },
      { name: "Demi Wilkinson", role: "Backend Developer", status: "Diplomado", reward: "200 monedas" },
      { name: "Candice Wu", role: "Fullstack Developer", status: "Voluntariado", reward: "100 monedas" },
      { name: "Natali Craig", role: "UX Designer", status: "Certificado", reward: "150 monedas" },
    ];

    const authStore = useAuthStore();
    const router = useRouter();

    const logout = () => {
      authStore.logout();
      router.push('/');
    };

    // Computed property using Composition API
    const sortedPeople = computed(() => {
      return [...people]
        .sort((a, b) => b.points - a.points)
        .slice(0, 3);
    });

    // Simulación de datos del usuario
    const user = reactive({
      name: 'Juan Pérez',
      email: 'trabajador@empresa.com',
      puesto: 'Desarrollador',
    })

    const showModal = ref(false)

    const editUser = reactive({
      name: '',
      email: '',
      puesto: ''
    })

    const openModal = () => {
      editUser.name = user.name
      editUser.email = user.email
      editUser.puesto = user.puesto
      showModal.value = true
    }

    const closeModal = () => {
      showModal.value = false
    }

    const saveChanges = () => {
      user.name = editUser.name
      user.email = editUser.email
      user.puesto = editUser.puesto
      showModal.value = false
      // Aquí se haría el POST/PUT al backend en producción
    }


    return {
      user: authStore.user,
      logout,
      achievements,
      people,
      personalGoals,
      trajectoryData,
      sortedPeople,
      openModal,
      closeModal,
      saveChanges,
      showModal,
      editUser
    };
  }
};
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin: 20px auto;
  padding: 20px;
  width: 82%;
  grid-auto-rows: auto;
}

.item {
  background-color: #444;
  color: #fff;
  border-radius: 5px;
  padding: 20px;
  font-size: 150%;
}

.mobile-only {
  display: block;
}

.desktop-only {
  display: none;
}

@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(4, 1fr);
    grid-auto-rows: auto;
    gap: 12px;
  }

  .mobile-only {
    display: none;
  }

  .desktop-only {
    display: block;
  }

  .item-0 {
    grid-column: 1 / span 3;
  }

  .item-1 {
    grid-column: 4;
  }

  .item-2 {
    grid-column: 1 / span 2;
  }

  .item-3 {
    grid-column: 3 / span 2;
  }

  .item-4 {
    grid-column: 3 / span 2;
  }

  .item-5 {
    grid-column: 1 / span 2;
  }
}

.profile-card {
  position: relative;
  display: flex;
  background-color: #f9d9f3;
  align-items: center;
  border-radius: 10px;
  color: #1a1f24;
  padding: 20px;
}

.profile-pic {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin-right: 16px;
}

.profile-info {
  font-weight: bold;
  flex: 1;
}

.progress-bar {
  display: flex;
  background-color: #ccc;
  height: 8px;
  border-radius: 4px;
  flex: 1;
  overflow: hidden;
}

.progress-fill {
  background-color: #e91e63;
  height: 100%;
  border-radius: 4px;
  width: 60%;
}

.progress-text {
  color: #e91e63;
  font-size: 14px;
  white-space: nowrap;
}

p {
  margin: 0;
  font-size: 17px;
}

.edit-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 6px 12px;
  background: none;
  border: 1px solid #e91e63;
  color: #e91e63;
  border-radius: 6px;
  cursor: pointer;
}

.edit-btn:hover {
  background-color: #f9d9f3;
}

/* Estilo del modal */

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-content h2 {
  margin-bottom: 20px;
  font-size: 1.5rem;
  color: #333;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #555;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.save-btn {
  background-color: #4CAF50;
  color: white;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
}

.save-btn:hover {
  background-color: #45a049;
}

.cancel-btn {
  background-color: #f44336;
  color: white;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
}

.cancel-btn:hover {
  background-color: #d7372f;
}


@media (max-width: 768px) {
  .modal-content {
    width: 90%;
    padding: 20px;
  }

  .edit-btn {
    width: 100%;
    margin-top: 20px;
  }
}

/* Estilo de la tarjeta de medallas */

.medals-card {
  background-color: #2b313a;
  padding: 16px;
  border-radius: 10px;
}

.medals-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.medal {
  width: 40px;
  height: 40px;
  background: linear-gradient(to bottom right, #f0a500, #f39c12);
  border-radius: 6px;
}

/* Estilo de la tarjeta de logros */

.achievements-card {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  width: 95%;
}

/* Header */
.achievements-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.achievements-title {
  font-size: 16px;
  font-weight: 600;
  color: #333333;
  margin: 0;
}

.redeem-button {
  background: linear-gradient(to right, #6d28d9, #8b5cf6);
  color: white;
  font-size: 12px;
  padding: 4px 12px;
  height: 28px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* Lista de logros */
.achievements-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.achievement-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  background-color: rgba(226, 232, 240, 0.3);
  border-radius: 8px;
}

/* Círculo de progreso */
.progress-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid #10b981;
  background-color: rgba(16, 185, 129, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.progress-text {
  color: #10b981;
  font-size: 12px;
  font-weight: bold;
}

/* Detalles del logro */
.achievement-details {
  flex: 1;
  min-width: 0;
}

.achievement-text {
  font-size: 12px;
  color: #333333;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Puntos */
.achievement-points {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.points-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: linear-gradient(to bottom right, #f59e0b, #f97316);
}

.points-value {
  font-size: 12px;
  color: #333333;
  font-weight: 500;
}

/* Estilos base */
.featured-card {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.featured-title {
  font-size: 16px;
  font-weight: 600;
  color: #333333;
  margin-bottom: 12px;
}


.featured-trajectory {
  font-family: Arial, sans-serif;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 100%;
}

.title {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333333;
  text-align: center;
}

.podium-container {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 20px;
  min-height: 200px;
}

.podium-block {
  width: 120px;
  padding: 15px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.gold {
  background: linear-gradient(135deg, #FFD700, #FFECB3);
  height: 180px;
}

.silver {
  background: linear-gradient(135deg, #C0C0C0, #E0E0E0);
  height: 150px;
}

.bronze {
  background: linear-gradient(135deg, #CD7F32, #E6C19E);
  height: 120px;
}

.position {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 10px;
}

.name {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 5px;
  text-align: center;
}

.points {
  font-size: 1.1rem;
  font-weight: bold;
  color: #222222;
}



/* Estilo principal de la tarjeta */
.personal-achievements-card {
  background: #ffffff;
  border-radius: 14px;
  border: 1px solid #e8e8e8;
  padding: 18px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
  min-width: 0; /* Rompe la cadena de flexibilidad */
}

/* Encabezado */
.personal-achievements-header {
  font-size: 17px;
  font-weight: 650;
  color: #2c3e50;
  margin-bottom: 15px;
  padding-bottom: 6px;
  border-bottom: 1px solid #f0f0f0;
}

/* Contenedor de logros */
.personal-achievements-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* Item de logro individual */
.goal-tracker {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px;
  background-color: #f9fafb;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.goal-tracker:hover {
  background-color: #f0f4f8;
  transform: translateY(-2px);
}

/* Círculo de progreso */
.goal-progress-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid #27ae60;
  background-color: rgba(39, 174, 96, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.goal-progress-count {
  color: #27ae60;
  font-size: 11px;
  font-weight: 800;
}

/* Descripción del objetivo */
.goal-description {
  flex: 1;
  min-width: 0;
}

.goal-text {
  font-size: 13px;
  color: #34495e;
  margin: 0;
  line-height: 1.4;
  font-weight: 500;
}

/* Recompensas */
.goal-rewards {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.reward-badge {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f39c12, #e67e22);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.reward-amount {
  font-size: 12px;
  color: #7f8c8d;
  font-weight: 600;
}

/* Estilo de la tarjeta de empleados destacados */
.featured-employees {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  background: white;
}

.title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 12px;
  color: #1a202c;
}

.employee-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.header-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  font-size: 0.75rem;
  font-weight: 500;
  color: #718096;
  padding-bottom: 8px;
  border-bottom: 1px solid #e2e8f0;
}

.employee-item {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  padding: 6px 4px;
  font-size: 0.75rem;
  border-radius: 4px;
}

.employee-item:hover {
  background-color: rgba(226, 232, 240, 0.2);
}

.name {
  font-weight: 500;
  color: #1a202c;
  margin-bottom: 2px;
}

.role {
  color: #718096;
  font-size: 0.75rem;
}

.status {
  color: #63b3ed;
  margin-bottom: 2px;
}

.reward {
  color: #1a202c;
  font-size: 0.75rem;
}

/* Responsive para móviles */
@media (max-width: 767px) {
  .grid {
    grid-template-columns: 1fr;
    width: 95%;
  }

  .progress-card-horizontal {
    flex-direction: column;
    text-align: center;
    padding: 15px;
  }

  .horizontal-content {
    align-items: center;
    text-align: center;
  }

  .circular-progress {
    margin-bottom: 15px;
  }
}

/* Responsive para tablets pequeñas */
@media (min-width: 480px) and (max-width: 767px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .item-0 {
    grid-column: span 2;
  }
}
</style>
