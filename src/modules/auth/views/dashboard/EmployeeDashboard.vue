<template>
  <AppNavbar />

  <div class="grid" v-if="currentPhase === 3">
    <!-- Perfil del usuario -->
    <div class="item item-0 profile-card">
      <div class="profile-content">
        <div class="profile-header">
          <div class="avatar-container">
            <img src="https://randomuser.me/api/portraits/men/44.jpg" class="profile-pic" />
            <div class="status-indicator"></div>
          </div>
          <div class="profile-details">
            <h2>{{ user.name }} {{ user.lastName }}</h2>
            <p class="role">{{ user.occupation }}</p>
            <p class="email">{{ user.email }}</p>
          </div>
          <button class="edit-btn-icon" @click="openEditProfileModal" title="Editar perfil">
            ✏️
          </button>
        </div>
        
        <div class="stats-row">
          <div class="stat-item">
            <span class="stat-value">{{ walletBalance }}</span>
            <span class="stat-label">Monedas</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-value">Nivel 5</span>
            <span class="stat-label">Senior</span>
          </div>
        </div>

        <div class="level-progress">
          <div class="progress-info">
            <span>Progreso de nivel</span>
            <span>40%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: 40%;"></div>
          </div>
        </div>
      </div>
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
        <h3>Objetivos por completar</h3>
        <button class="achivementsmodal" @click="openAchievementsModal">
          Ver todos los logros
        </button>
      </div>

      <div class="personal-achievements-container scrollable-container">
        <div v-if="isLoadingContracts">Cargando contratos...</div>
        <div v-else-if="pendingContracts.length === 0">No tienes contratos pendientes.</div>
        <div
          v-else
          class="goal-tracker"
          v-for="(contract, index) in pendingContracts"
          :key="contract.id"
        >
          <div class="goal-progress-circle">
            <span class="goal-progress-count">0%</span>
          </div>
          <div class="goal-description">
            <p class="goal-text">{{ contract.name }}</p>
            <small style="color: #666;">{{ contract.evidenceType }}</small>
          </div>
          <div class="goal-rewards">
            <button class="upload-evidence-btn" @click="openEvidenceModal(contract)">
              Subir Evidencia
            </button>
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
          Objetivos completados
          <div class="dashboard-header">
            <button class="forum-btn" @click="goToForum">💡 Foro de Ideas</button>
          </div>
        </h3>
        <div class="personal-achievements-container">
          <div v-if="submittedContracts.length === 0">No tienes objetivos completados aún.</div>
          <div
            v-else
            v-for="contract in submittedContracts"
            :key="contract.id"
            class="goal-tracker"
          >
            <div class="goal-progress-circle">
              <span class="goal-progress-count">
                {{ contract.status === 'VALIDATED' ? '100%' : '50%' }}
              </span>
            </div>
            <div class="goal-description">
              <p class="goal-text">{{ contract.name }}</p>
              <small style="color: #666;">
                {{ contract.status === 'VALIDATED' ? 'Validado' : 'En revisión' }}
              </small>
            </div>
            <div class="goal-rewards">
              <div class="reward-badge"></div>
              <span class="reward-amount">{{ contract.amount || 0 }} pts</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Transacciones recientes -->
    <div class="item item-4">
      <TransactionFeed />
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
    :achievements="contracts"
    @close="closeAchievementsModal"
  />
  <!-- Fases Tuckman -->
  <TuckmanForming v-if="currentPhase === 1" @next="nextPhase" />
  <TuckmanStorming v-if="currentPhase === 2" @next="nextPhase" />
  <TuckmanAdjourning v-if="currentPhase === 4" @back="backToDashboard" />

  <!-- Evidence Modal Overlay -->
  <div v-if="showEvidenceModal" class="modal-overlay">
    <div class="modal-content">
      <EvidenceForm 
        :contractId="selectedContract?.id"
        :initialType="selectedContract?.evidenceType || 'CERTIFICATE'"
        :isModal="true"
        @close="closeEvidenceModal"
        @success="handleEvidenceSuccess"
      />
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';
import { getEmployeeContracts, getEmployeeById } from '@/modules/auth/services/api';
import AppNavbar from '@/shared/components/AppNavbar.vue';
import { computed, ref, reactive, onMounted } from 'vue';
import EditProfileModal from '@/components/EditProfileModal.vue';
import AchievementsModal from '@/components/AchievementsModal.vue';
import TransactionFeed from '@/modules/auth/views/dashboard/TransactionFeed.vue';
import TuckmanForming from '@/modules/auth/views/dashboard/tuckman/TuckmanForming.vue';
import TuckmanStorming from '@/modules/auth/views/dashboard/tuckman/TuckmanStorming.vue';
import TuckmanAdjourning from '@/modules/auth/views/dashboard/tuckman/TuckmanAdjourning.vue';
import EvidenceForm from '@/modules/auth/views/dashboard/EvidenceForm.vue';

export default {
  components: {
    AppNavbar,
    EditProfileModal,
    AchievementsModal,
    TransactionFeed,
    TuckmanForming,
    TuckmanStorming,
    TuckmanAdjourning,
    EvidenceForm
  },
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    
    // Estado de fases Tuckman (persistente)
    const currentPhase = ref(parseInt(localStorage.getItem('tuckmanPhase')) || 1);

    const nextPhase = () => {
      if (currentPhase.value < 3) {
        currentPhase.value++;
        localStorage.setItem('tuckmanPhase', currentPhase.value);
      }
    };

    const goToForum = () => {
      currentPhase.value = 4;
    };

    const backToDashboard = () => {
      currentPhase.value = 3;
    };

    const medals = ref([
      { icon: '🥇' },
      { icon: '🥈' },
      { icon: '🥉' },
      { icon: '🏅' },
      { icon: '🎖️' },
      { icon: '🏆' }
    ])

    const contracts = ref([]);
    const pendingContracts = computed(() => {
      return contracts.value.filter(c => !['VALIDATED', 'PENDING_VALIDATION', 'PENDING'].includes(c.status));
    });
    const submittedContracts = computed(() => {
      return contracts.value.filter(c => ['VALIDATED', 'PENDING_VALIDATION', 'PENDING'].includes(c.status));
    });

    const isLoadingContracts = ref(false);
    const walletBalance = ref(0);

    onMounted(async () => {
      if (authStore.token) {
        // Fetch Contracts
        isLoadingContracts.value = true;
        try {
          const companyId = authStore.user?.company_id;
          if (companyId) {
            const res = await getEmployeeContracts(companyId, authStore.token);
            // Store all contracts, filtering happens in computed properties
            contracts.value = res.data; 
          } else {
            console.warn('No company_id found for user');
          }
        } catch (error) {
          console.error("Error fetching contracts:", error);
        } finally {
          isLoadingContracts.value = false;
        }

        // Fetch Profile for Wallet/Points
        if (authStore.user?.employeeId) {
          try {
            const profileRes = await getEmployeeById(authStore.user.employeeId, authStore.token);
            // Assuming the field is 'points' or 'wallet', defaulting to 0 if not found
            walletBalance.value = profileRes.data.points || profileRes.data.wallet || 0;
          } catch (error) {
            console.error("Error fetching profile:", error);
          }
        }
      }
    });

    const showEvidenceModal = ref(false);
    const selectedContract = ref(null);

    const openEvidenceModal = (contract) => {
      selectedContract.value = contract;
      showEvidenceModal.value = true;
    };

    const closeEvidenceModal = () => {
      showEvidenceModal.value = false;
      selectedContract.value = null;
    };

    const handleEvidenceSuccess = async () => {
      closeEvidenceModal();
      // Refresh contracts to update the list (remove the one with submitted evidence if backend updates status)
      if (authStore.user?.company_id) {
        isLoadingContracts.value = true;
        try {
           const res = await getEmployeeContracts(authStore.user.company_id, authStore.token);
           contracts.value = res.data; // Update all contracts
        } catch (error) {
          console.error("Error refreshing contracts:", error);
        } finally {
          isLoadingContracts.value = false;
        }
      }
    };

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
      goToContracts,
      currentPhase,
      nextPhase,
      goToForum,
      backToDashboard,
      contracts,
      pendingContracts,
      submittedContracts,
      isLoadingContracts,
      openEvidenceModal,
      showEvidenceModal,
      selectedContract,
      closeEvidenceModal,
      handleEvidenceSuccess,
      walletBalance
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

/* Profile Card Redesign */
.profile-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 16px;
  padding: 0;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  position: relative;
}

.profile-content {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
}

.avatar-container {
  position: relative;
}

.profile-pic {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #fff;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.status-indicator {
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 14px;
  height: 14px;
  background-color: #2ecc71;
  border: 2px solid #fff;
  border-radius: 50%;
}

.profile-details {
  flex: 1;
}

.profile-details h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #2c3e50;
}

.profile-details .role {
  margin: 4px 0 2px;
  font-size: 0.9rem;
  color: #e91e63;
  font-weight: 600;
}

.profile-details .email {
  margin: 0;
  font-size: 0.85rem;
  color: #7f8c8d;
}

.edit-btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  opacity: 0.6;
  transition: opacity 0.2s;
  padding: 4px;
}

.edit-btn-icon:hover {
  opacity: 1;
}

.stats-row {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: rgba(233, 30, 99, 0.05);
  padding: 12px;
  border-radius: 12px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 1.2rem;
  font-weight: 800;
  color: #e91e63;
}

.stat-label {
  font-size: 0.75rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
}

.stat-divider {
  width: 1px;
  height: 24px;
  background-color: rgba(0,0,0,0.1);
}

.level-progress {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #666;
  font-weight: 500;
}

.progress-bar {
  background-color: #e0e0e0;
  height: 6px;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  background: linear-gradient(90deg, #e91e63, #ff6090);
  height: 100%;
  border-radius: 3px;
  transition: width 0.5s ease;
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

/* Forum Button */
.forum-btn {
  background-color: #0d9488;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  font-weight: 500;
  margin-left: 10px;
  transition: background-color 0.3s, transform 0.2s;
}

.forum-btn:hover {
  background: #0f766e;
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

/* Modal Overlay Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  width: 100%;
  max-width: 600px;
  padding: 20px;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.upload-evidence-btn {
  background-color: #e91e63;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
  white-space: nowrap;
}

.upload-evidence-btn:hover {
  background-color: #d81b60;
}
</style>
