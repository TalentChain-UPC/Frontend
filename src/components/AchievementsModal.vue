<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Logros por hacer</h2>
        <button class="modal-close" @click="close">✕</button>
      </div>

      <div class="modal-body">
        <div
          class="goal-tracker"
          v-for="(goal, index) in achievements"
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

        <p v-if="!achievements.length" class="no-achievements">
          No tienes logros registrados todavía.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  visible: { type: Boolean, default: false },
  achievements: { type: Array, default: () => [] },
});

const emit = defineEmits(["close"]);

function close() {
  emit("close");
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal-content {
  background: #fff;
  width: 500px;
  max-width: 90%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 15px rgba(0,0,0,0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #ddd;
}

.modal-header h2 {
  margin: 0;
  font-size: 18px;
}

.modal-close {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
}

.modal-body {
  max-height: 60vh;
  overflow-y: auto;
  padding: 16px;
  font-family: 'Poppins', sans-serif;
  gap: 12px;
  display: flex;
  flex-direction: column;
}

.modal-button {
  background-color: #3f51b5;
  color: #fff;
  border: none;
  padding: 8px 14px;
  border-radius: 4px;
  cursor: pointer;
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

.no-achievements {
  text-align: center;
  color: #777;
  margin-top: 20px;
}
</style>
