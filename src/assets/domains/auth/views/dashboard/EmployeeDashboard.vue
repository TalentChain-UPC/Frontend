<template>
  <AppNavbar />
  <div class="grid">
    <!-- Perfil -->
    <div class="item item-0 desktop-only profile-card">
      <div class="profile-top">
        <img src="https://randomuser.me/api/portraits/men/44.jpg" class="profile-pic" />
        <div class="profile-info">
          <h2>{{ user.name }}</h2>
          <p>{{ user.email }}</p>
          <p>{{ user.role }}</p>
          <div class="progress-bar">
            <div class="progress-fill" style="width: 60%;"></div>
          </div>
          <span class="progress-text">40% para subir de nivel</span>
        </div>
      </div>
      <button class="edit-btn" @click="openModal">Editar perfil</button>
    </div>

    <!-- Medallas -->
    <div class="item item-1 medals-card">
      <h3>Medallas</h3>
      <div class="medals-grid">
        <div class="medal" v-for="(medal, index) in medals" :key="index"></div>
      </div>
    </div>

    <!-- Logros personales -->
    <div class="item item-2 personal-achievements-card">
      <h3 class="personal-achievements-header">Logros personales</h3>
      <div class="personal-achievements-container scrollable-container">
        <div class="goal-tracker" v-for="(goal, index) in personalAchievements" :key="index">
          <div class="goal-progress-circle">
            <span class="goal-progress-count">{{ goal.progress }}%</span>
          </div>
          <div class="goal-description">
            <p class="goal-text">{{ goal.text }}</p>
          </div>
          <div class="goal-rewards">
            <div class="reward-badge"></div>
            <span class="reward-amount">{{ goal.reward }} pts</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Trayectoria - Versión Mobile -->
    <div class="item mobile-only">
      <div class="featured-trajectory">
        <h3 class="title">Top 3</h3>
        <div class="podium-container">
          <div class="podium-block silver" v-if="sortedPeople[1]">
            <div class="position">2°</div>
            <div class="name">{{ sortedPeople[1].name }}</div>
          </div>
          <div class="podium-block gold" v-if="sortedPeople[0]">
            <div class="position">1°</div>
            <div class="name">{{ sortedPeople[0].name }}</div>
          </div>
          <div class="podium-block bronze" v-if="sortedPeople[2]">
            <div class="position">3°</div>
            <div class="name">{{ sortedPeople[2].name }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Trayectoria - Versión Desktop -->
    <div class="item item-3 desktop-only">
      <div class="featured-trajectory">
        <h3 class="title">Trayectoria destacada</h3>
        <div class="podium-container">
          <div class="podium-block silver" v-if="sortedPeople[1]">
            <div class="position">2°</div>
            <div class="person-info">
              <div class="name">{{ sortedPeople[1].name }}</div>
              <div class="points">{{ sortedPeople[1].points }} pts</div>
            </div>
          </div>
          <div class="podium-block gold" v-if="sortedPeople[0]">
            <div class="position">1°</div>
            <div class="person-info">
              <div class="name">{{ sortedPeople[0].name }}</div>
              <div class="points">{{ sortedPeople[0].points }} pts</div>
            </div>
          </div>
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

    <!-- Empleados destacados -->
    <div class="item item-5 featured-employees">
      <div class="personal-achievements-card">
        <h3 class="personal-achievements-header">Mis Progresos</h3>
        <div class="personal-achievements-container">
          <div v-for="goal in personalGoals" :key="goal.id" class="goal-tracker">
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

     <!-- Progresos - Versión Desktop -->
    <div class="item item-4 desktop-only">
      <h3 class="title">Empleados destacados</h3>
      <div class="header-row">
        <span>Nombre y rol</span>
        <span>Recompensa</span>
      </div>
      <div class="employee-list">
        <div class="employee-item" v-for="(employee, index) in employees" :key="index">
          <div>
            <p class="name">{{ employee.name }}</p>
            <p class="role">{{ employee.role }}</p>
          </div>
          <div>
            <p class="reward">{{ employee.reward }} pts</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal -->
  <div class="modal-overlay" v-if="showModal">
    <div class="modal-content">
      <h2>Editar perfil</h2>
      <div class="form-group">
        <label>Nombre completo</label>
        <input v-model="user.fullName" />
      </div>
      <div class="form-group">
        <label>Email</label>
        <input v-model="user.email" />
      </div>
      <div class="form-group">
        <label>Rol</label>
        <select v-model="user.role">
          <option>USER</option>
          <option>ADMIN</option>
        </select>
      </div>
      <div class="modal-actions">
        <button class="save-btn" @click="saveChanges">Guardar</button>
        <button class="cancel-btn" @click="closeModal">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';
import AppNavbar from '@/shared/components/AppNavbar.vue';
import { computed, ref, reactive } from 'vue';

export default {
  components: {
    AppNavbar
  },
  setup() {

    const medals = ref([{}, {}, {},{},{},{}])
    const personalAchievements = ref([
      { text: 'Capacitación finalizada', progress: 90, reward: 300 },
      { text: 'Trabajo en equipo', progress: 100, reward: 500 }
    ])
    const employees = ref([
      { name: 'Pedro R.', role: 'QA', reward: 300 },
      { name: 'Carmen T.', role: 'Diseñadora UX', reward: 400 }
    ])


    const achievements = [
      { id: 1, text: "Asistencia perfecta este mes", progress: "12/30", points: 140 },
      { id: 2, text: "Capacitación completada", progress: "3/5", points: 200 },
      { id: 3, text: "Proyectos entregados", progress: "5/8", points: 320 },
      { id: 4, text: "Feedback positivo", progress: "8/10", points: 150 },
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
      { id: 2, text: "Días consecutivos activo", progress: "21/30", points: 210 },
      { id: 3, text: "Cursos completados", progress: "2/5", points: 300 },
    ];

    const trajectoryData = [
      { name: "Olivia Rhye", role: "Product Designer", status: "Certificación", reward: "120 monedas" },
      { name: "Phoenix Baker", role: "Product Manager", status: "Título", reward: "120 monedas" },
      { name: "Lana Steiner", role: "Frontend Developer", status: "Capacitación", reward: "80 monedas" },
      { name: "Demi Wilkinson", role: "Backend Developer", status: "Diplomado", reward: "200 monedas" },
    ];

    // Versiones móviles
    const mobileAchievements = computed(() => achievements.slice(0, 2));
    const mobileGoals = computed(() => personalGoals.slice(0, 2));
    const mobileEmployees = computed(() => trajectoryData.slice(0, 3));

    const authStore = useAuthStore();
    const router = useRouter();

    const logout = () => {
      authStore.logout();
      router.push('/login');
    };

    const sortedPeople = computed(() => {
      return [...people]
        .sort((a, b) => b.points - a.points)
        .slice(0, 3);
    });

    const user = reactive({
      name: 'Juan Pérez',
      email: 'trabajador@empresa.com',
      puesto: 'Desarrollador',
    });

    const showModal = ref(false);
    const editUser = reactive({
      name: '',
      email: '',
      puesto: ''
    });

    const openModal = () => {
      editUser.name = user.name;
      editUser.email = user.email;
      editUser.puesto = user.puesto;
      showModal.value = true;
    };

    const closeModal = () => {
      showModal.value = false;
    };

    const saveChanges = () => {
      user.name = editUser.name;
      user.email = editUser.email;
      user.puesto = editUser.puesto;
      showModal.value = false;
    };

    return {
      user: authStore.user,
      logout,
      achievements,
      mobileAchievements,
      people,
      personalGoals,
      mobileGoals,
      trajectoryData,
      mobileEmployees,
      sortedPeople,
      openModal,
      closeModal,
      saveChanges,
      showModal,
      editUser,
      medals,
      personalAchievements,
      employees
    };
  }
};
</script>


<style scoped>
/* Estilos base */
.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  padding: 10px;
  width: 100%;
  box-sizing: border-box;
  grid-auto-rows: auto;
}

.item {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;
  overflow: hidden;
}

/* Visibilidad condicional */
.mobile-only {
  display: block;
  grid-auto-rows: auto;
}

.desktop-only {
  display: none;
  grid-auto-rows: auto;
}

/* Profile Card */
.profile-top {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
}

.profile-card {
  display: flex;
  flex-direction: column; /* Mantenemos columna para que el botón quede debajo */
  align-items: center;
  background-color: #f9d9f3;
  color: #1a1f24;
  position: relative;
  padding: 20px;
}

.profile-pic {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.profile-info {
  text-align: left; /* alinear texto a la izquierda */
  width: 100%;
}

.profile-info h2 {
  margin: 0 0 8px 0;
  font-size: 1.2rem;
}

.profile-info p {
  margin: 4px 0;
  font-size: 0.9rem;
  color: #555;
}

.progress-bar {
  background-color: #e0e0e0;
  height: 8px;
  border-radius: 4px;
  margin: 12px 0;
  overflow: hidden;
}

.progress-fill {
  background-color: #e91e63;
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  display: block;
  font-size: 0.8rem;
  color: #e91e63;
  margin-top: 4px;
}

.edit-btn {
  margin-top: 16px;
  padding: 8px 16px;
  background: transparent;
  border: 1px solid #e91e63;
  color: #e91e63;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.edit-btn:hover {
  background-color: rgba(233, 30, 99, 0.1);
}

/* Medals Card */
.medals-card h3 {
  margin-top: 0;
  color: black;
}

.medals-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-top: 12px;
}

.medal {
  width: 100%;
  height: 0;
  padding-bottom: 100%;
  background: linear-gradient(135deg, #f0a500, #f39c12);
  border-radius: 7px;
  margin: 0 auto;
}

/* Achievements Card */
.achievements-card {
  background: #ffffff;
  border-radius: 12px;
}

.achievements-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.achievements-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  color: #333;
}

.redeem-button {
  background: linear-gradient(to right, #6d28d9, #8b5cf6);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 0.8rem;
  cursor: pointer;
}

.achievements-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.achievement-item {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: rgba(226, 232, 240, 0.3);
  border-radius: 8px;
}

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
  font-size: 0.7rem;
  font-weight: bold;
}

.achievement-details {
  flex: 1;
  margin: 0 12px;
  min-width: 0;
}

.achievement-text {
  font-size: 0.8rem;
  color: #333;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.achievement-points {
  display: flex;
  align-items: center;
  gap: 4px;
}

.points-icon {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f59e0b, #f97316);
}

.points-value {
  font-size: 0.8rem;
  color: #333;
  font-weight: 500;
}

/* Podium */
.featured-trajectory {
  padding: 16px;
}

.featured-trajectory .title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 16px 0;
  text-align: center;
  color: #333;
}

.podium-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.podium-block {
  width: 100%;
  padding: 16px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.position {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 8px;
}

.name {
  font-size: 0.9rem;
  font-weight: 500;
  margin: 4px 0;
}

.points {
  font-size: 0.9rem;
  color: #444;
  font-weight: 500;
}

.gold {
  background: linear-gradient(135deg, #FFD700, #FFECB3);
}

.silver {
  background: linear-gradient(135deg, #C0C0C0, #E0E0E0);
}

.bronze {
  background: linear-gradient(135deg, #CD7F32, #E6C19E);
}

/* Personal Achievements */
.personal-achievements-card {
  background: #ffffff;
}

.personal-achievements-header {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
  color: #2c3e50;
}

.personal-achievements-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.goal-tracker {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #f9fafb;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.goal-tracker:hover {
  background-color: #f0f4f8;
  transform: translateY(-2px);
}

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
  font-size: 0.7rem;
  font-weight: 800;
}

.goal-description {
  flex: 1;
  margin: 0 12px;
}

.goal-text {
  font-size: 0.8rem;
  color: #34495e;
  margin: 0;
  line-height: 1.4;
}

.goal-rewards {
  display: flex;
  align-items: center;
  gap: 6px;
}

.reward-badge {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f39c12, #e67e22);
}

.reward-amount {
  font-size: 0.8rem;
  color: #7f8c8d;
  font-weight: 600;
}

/* Featured Employees */
.featured-employees {
  background: #ffffff;
}

.featured-employees .title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: #1a202c;
}

.employee-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.header-row {
  display: none;
}

.employee-item {
  display: flex;
  flex-direction: column;
  padding: 10px;
  border-radius: 6px;
  background-color: #f9fafb;
}

.name {
  font-weight: 500;
  font-size: 0.9rem;
  color: #1a202c;
  margin-bottom: 4px;
}

.role, .status {
  font-size: 0.8rem;
  color: #718096;
}

.reward {
  font-size: 0.8rem;
  color: #1a202c;
  font-weight: 500;
  margin-top: 4px;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  box-sizing: border-box;
}

.modal-content {
  background: white;
  padding: 24px;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
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
  margin: 0 0 20px 0;
  font-size: 1.3rem;
  color: #333;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
  font-size: 0.9rem;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px 12px;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-sizing: border-box;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 24px;
}

.save-btn, .cancel-btn {
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.save-btn {
  background-color: #4CAF50;
  color: white;
}

.save-btn:hover {
  background-color: #45a049;
}

.cancel-btn {
  background-color: #f44336;
  color: white;
}

.cancel-btn:hover {
  background-color: #d7372f;
}

/* NUEVOS ESTILOS PARA SCROLL */
.scrollable-container {
  max-height: 300px; /* ajusta según tu diseño */
  overflow-y: auto;
  padding-right: 0.5rem; /* espacio para que no se corte el contenido */
}

/* Opcional: estiliza la barra de scroll para que se vea más limpia */
.scrollable-container::-webkit-scrollbar {
  width: 6px;
}

.scrollable-container::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

/* Desktop Styles */
@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    padding: 20px;
    width: 90%;
    max-width: 1200px;
    margin: 0 auto;
  }

  .mobile-only {
    display: none !important;
  }

  .desktop-only {
    display: block !important;
  }

  /* Profile Card */
  .profile-card {
    flex-direction: row;
    text-align: left;
    grid-column: 1 / span 3;
    align-items: center;
  }

  .profile-pic {
    width: 120px;
    height: 120px;
    margin-right: 20px;
    margin-bottom: 0;
  }

  .profile-info {
    text-align: left;
  }

  .edit-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    margin-top: 0;
  }

  /* Grid Positioning */
  .item-1 { grid-column: 4; }
  .item-2 { grid-column: 1 / span 2; }
  .item-3 { grid-column: 3 / span 2; }
  .item-4 { grid-column: 3 / span 2; }
  .item-5 { grid-column: 1 / span 2; }

  /* Medals */
  .medals-grid {
    grid-template-columns: repeat(4, 1fr);
  }

  /* Podium */
  .podium-container {
    flex-direction: row;
    align-items: flex-end;
    justify-content: center;
    min-height: 200px;
  }

  .podium-block {
    width: 120px;
    height: auto;
  }

  .gold { height: 180px; }
  .silver { height: 150px; }
  .bronze { height: 120px; }

  /* Employees */
  .employee-list {
    display: grid;
    grid-template-columns: 1fr;
    gap: 4px;
  }

  .header-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding-bottom: 8px;
    border-bottom: 1px solid #e2e8f0;
    font-size: 0.75rem;
    color: #718096;
  }

  .employee-item {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 8px 4px;
    background: transparent;
  }

  .employee-item:hover {
    background-color: rgba(226, 232, 240, 0.2);
  }
}

/* Tablet Styles */
@media (min-width: 481px) and (max-width: 767px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
    width: 95%;
  }

  .item-0 {
    grid-column: span 2;
  }

  .medals-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
