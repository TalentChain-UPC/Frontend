<template>
  <AppNavbar />

  <div class="grid">
    <!-- Perfil del usuario -->
    <div class="item item-0 profile-card">
      <div class="profile-top">
        <img src="https://randomuser.me/api/portraits/men/44.jpg" class="profile-pic" />
        <div class="profile-info">
          <h2>{{ user.name }} {{ user.lastName }}</h2>
          <p>{{ user.email }}</p>
          <p>{{ user.occupation }}</p>
          <div class="progress-bar">
            <div class="progress-fill" style="width: 60%;"></div>
          </div>
          <span class="progress-text">40% para subir de nivel</span>
        </div>
      </div>
      <button class="edit-btn" @click="openEditProfileModal">Editar perfil</button>
    </div>

    <!-- Medallas -->
    <div class="item item-1 medals-card">
      <h3>Medallas</h3>
      <div class="medals-grid">
        <div class="medal" v-for="(medal, index) in medals" :key="index">
          {{ medal.icon }}
        </div>
      </div>
    </div>

    <!-- Logros personales -->
    <div class="item item-2 personal-achievements-card">
      <div class="personal-achievements-header">
        <h3>Logros por completar</h3>
        <button class="achivementsmodal" @click="openAchievementsModal">
          Ver todos los logros
        </button>
      </div>

      <div class="personal-achievements-container scrollable-container">
        <div
          class="goal-tracker"
          v-for="(goal, index) in personalAchievements"
          :key="index"
        >
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

    <!-- Trayectoria destacada (Versión Desktop) -->
    <div class="item item-3">
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

    <!-- Progresos -->
    <div class="item item-5 featured-employees">
      <div class="personal-achievements-card">
        <h3 class="personal-achievements-header">
          Mis Progresos
        <div class="dashboard-header">
          <button class="contracts-btn" @click="goToContracts">Enviar Envidencia</button>
        </div>
        </h3>
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

    <!-- Transacciones recientes -->
    <div class="item item-4">
      <h3 class="title">Transacciones Recientes</h3>
      <div class="header-row">
        <span>Nombre</span>
        <span>Código de Transacción</span>
        <span>Monto</span>
      </div>
      <div class="transaction-list">
        <div
          class="transaction-item"
          v-for="(tx, index) in recentTransactions"
          :key="index"
        >
          <div class="tx-name"><p class="name">{{ tx.name }}</p></div>
          <div class="tx-code"><p class="code">{{ tx.transactionCode }}</p></div>
          <div class="tx-amount"><p class="amount">{{ tx.points }} pts</p></div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal separado -->
  <EditProfileModal
    v-if="showEditProfileModal"
    :user="user"
    @save="handleSave"
    @close="closeEditProfileModal"
  />

  <AchievementsModal
    v-if="showAchievementsModal"
    :visible="showAchievementsModal"
    :achievements="personalAchievements"
    @close="closeAchievementsModal"
  />
</template>

<script>
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';
import AppNavbar from '@/shared/components/AppNavbar.vue';
import { computed, ref, reactive } from 'vue';
import EditProfileModal from '@/assets/components/EditProfileModal.vue';
import AchievementsModal from '@/assets/components/AchievementsModal.vue';

export default {
  components: {
    AppNavbar,
    EditProfileModal,
    AchievementsModal
  },
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();

    const medals = ref([
      { icon: '🥇' },
      { icon: '🥈' },
      { icon: '🥉' },
      { icon: '🏅' },
      { icon: '🎖️' },
      { icon: '🏆' }
    ])

    const personalAchievements = ref([
      { text: 'Capacitación finalizada', progress: 90, reward: 300 },
      { text: 'Trabajo en equipo', progress: 100, reward: 500 },
      { text: 'Asistencia perfecta este mes', progress: 75, reward: 200 },
      { text: 'Entrega puntual de proyectos', progress: 60, reward: 250 },
      { text: 'Participación en reuniones', progress: 80, reward: 180 },
      { text: 'Feedback positivo de clientes', progress: 50, reward: 350 },
      { text: 'Cumplimiento de objetivos trimestrales', progress: 40, reward: 400 },
      { text: 'Innovación en procesos', progress: 30, reward: 450 },
      { text: 'Mentoría a compañeros', progress: 55, reward: 220 },
      { text: 'Uso eficiente de recursos', progress: 70, reward: 150 }
    ]);

    const recentTransactions = ref([
      { name: 'Ana Torres', transactionCode: '0x1A3F9...', points: 150 },
      { name: 'Luis Pérez', transactionCode: '0x2B4C8...', points: 200 },
      { name: 'María López', transactionCode: '0x3D5E7...', points: 350 },
      { name: 'Carlos Sánchez', transactionCode: '0x4F6A1...', points: 100 },
      { name: 'Laura Jiménez', transactionCode: '0x5G8H2...', points: 250 }
    ]);

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
      { id: 3, text: "Cursos completados", progress: "2/5", points: 300 }
    ];

    const trajectoryData = [
      { name: "Olivia Rhye", role: "Product Designer", status: "Certificación", reward: "120 monedas" },
      { name: "Phoenix Baker", role: "Product Manager", status: "Título", reward: "120 monedas" },
      { name: "Lana Steiner", role: "Frontend Developer", status: "Capacitación", reward: "80 monedas" },
      { name: "Demi Wilkinson", role: "Backend Developer", status: "Diplomado", reward: "200 monedas" }
    ];

    // ✅ Estado separado para cada modal
    const showEditProfileModal = ref(false);
    const showAchievementsModal = ref(false);

    const editUser = reactive({
      name: '',
      email: '',
      puesto: ''
    });

    // ✅ Abrir modal de editar perfil
    const openEditProfileModal = () => {
      editUser.name = authStore.user.name;
      editUser.email = authStore.user.email;
      editUser.puesto = authStore.user.puesto;
      showEditProfileModal.value = true;
    };

    const closeEditProfileModal = () => {
      showEditProfileModal.value = false;
    };

    const openAchievementsModal = () => {
      console.log("Abriendo modal de logros...");
      showAchievementsModal.value = true;
    };

    const closeAchievementsModal = () => {
      showAchievementsModal.value = false;
    };

    const saveChanges = () => {
      authStore.setUser({
        name: editUser.name,
        email: editUser.email,
        puesto: editUser.puesto
      });
      showEditProfileModal.value = false;
    };

    const handleSave = (editedData) => {
      authStore.setUser({
        name: editedData.name,
        email: editedData.email,
        puesto: editedData.puesto
      });
      showEditProfileModal.value = false;
    };

    const logout = () => {
      authStore.logout();
      router.push('/login');
    };

    const sortedPeople = computed(() => {
      return [...people]
        .sort((a, b) => b.points - a.points)
        .slice(0, 3);
    });

    const mobileGoals = computed(() => personalGoals.slice(0, 2));
    const mobileEmployees = computed(() => trajectoryData.slice(0, 3));

    const goToContracts = () => {
      router.push({ name: 'nueva-evidencia' });
    };

    return {
      user: authStore.user,
      logout,
      people,
      personalGoals,
      mobileGoals,
      trajectoryData,
      mobileEmployees,
      sortedPeople,
      medals,
      personalAchievements,
      recentTransactions,
      editUser,
      // Modal flags y métodos
      showEditProfileModal,
      showAchievementsModal,
      openEditProfileModal,
      closeEditProfileModal,
      openAchievementsModal,
      closeAchievementsModal,
      saveChanges,
      handleSave,
      goToContracts
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
  position: absolute;
  top: 16px;
  right: 16px;
  margin-top: 0;
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

.contracts-btn {
  background-color: #e91e63;
  color: white;
  border: none;
  padding: 8px 7px;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s, transform 0.2s;
}

.contracts-btn:hover {
  background: #e71259;
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
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  background: white;
  border-radius: 10px;
  border: 2px solid #f0a500;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
  color: #2c3e50;
}

.personal-achievements-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
}

.achivementsmodal {
  background-color: #e91e63;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s, transform 0.2s;
}

.achivementsmodal:hover {
  background-color: #dd1558;
  transform: translateY(-1px);
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

.transaction-header-row,
.transaction-item {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  padding: 8px 52px;
  gap: 12px;
  align-items: center;
}

.transaction-header-row {
  font-weight: bold;
  border-bottom: 2px solid #ccc;
  margin-bottom: 10px;
}

.transaction-item {
  border-bottom: 1px solid #eee;
}

.transaction-item:last-child {
  border-bottom: none;
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

/* Contenedor con scroll */
.scrollable-container {
  max-height: 300px;
  overflow-y: auto;
  padding-right: 0.5rem;
}

/*estiliza la barra de scroll para que se vea más limpia */
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
    grid-template-columns: repeat(3, 1fr);
    max-width: 50%;
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

.dashboard-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin: 18px 18px 0 0;
}
</style>
