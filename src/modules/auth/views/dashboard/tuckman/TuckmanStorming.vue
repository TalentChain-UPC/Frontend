<template>
  <div class="tuckman-container">
    <div class="content-card">
      <div class="header">
        <h1>Tu Rol y Desarrollo</h1>
        <div class="phase-badge">Fase 2: Storming & Norming</div>
      </div>
      
      <div class="content-body">
        <div class="section">
          <h2>Manejo de Conflictos</h2>
          <p>
            Es natural que surjan desafíos. En TalentChain, vemos el conflicto como una oportunidad de mejora.
          </p>
          <div class="tips-box">
            <h3>💡 Tips para el éxito:</h3>
            <ul>
              <li>Escucha activa: Entiende antes de responder.</li>
              <li>Feedback constructivo: Enfócate en el problema, no en la persona.</li>
              <li>Busca soluciones ganar-ganar.</li>
            </ul>
          </div>
        </div>

        <div class="section">
          <h2>Capacitación Recomendada para: <span class="role-highlight">{{ userRole }}</span></h2>
          <div class="courses-grid">
            <div class="course-card" v-for="(course, index) in recommendedCourses" :key="index">
              <div class="course-icon">{{ course.icon }}</div>
              <div class="course-info">
                <h4>{{ course.title }}</h4>
                <p>{{ course.duration }} • {{ course.level }}</p>
              </div>
              <button class="start-btn">Iniciar</button>
            </div>
          </div>
        </div>

        <div class="commitment-box">
          <input type="checkbox" id="commitment" v-model="accepted" />
          <label for="commitment">Entiendo mi rol y estoy listo para comenzar mis objetivos.</label>
        </div>
      </div>

      <div class="footer">
        <button class="next-btn" :disabled="!accepted" @click="$emit('next')">
          Ir a mi Dashboard
          <span class="arrow">→</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/authStore';

defineEmits(['next']);
const authStore = useAuthStore();
const accepted = ref(false);

// Obtener rol del usuario (fallback a 'General' si no tiene occupation)
const userRole = computed(() => authStore.user?.occupation || 'General');

const coursesDb = {
  'Frontend Developer': [
    { title: 'Vue 3 Avanzado', duration: '4h', level: 'Avanzado', icon: '⚡' },
    { title: 'Arquitectura CSS', duration: '2h', level: 'Intermedio', icon: '🎨' },
    { title: 'Testing con Vitest', duration: '3h', level: 'Intermedio', icon: '🧪' }
  ],
  'Backend Developer': [
    { title: 'Microservicios con Spring', duration: '5h', level: 'Avanzado', icon: '☕' },
    { title: 'Seguridad en APIs', duration: '3h', level: 'Intermedio', icon: '🔒' },
    { title: 'Optimización SQL', duration: '2h', level: 'Intermedio', icon: '💾' }
  ],
  'Product Designer': [
    { title: 'Sistemas de Diseño', duration: '3h', level: 'Intermedio', icon: '✨' },
    { title: 'UX Research', duration: '4h', level: 'Avanzado', icon: '🔍' },
    { title: 'Figma Mastery', duration: '2h', level: 'Básico', icon: '🖌️' }
  ],
  'General': [
    { title: 'Cultura TalentChain', duration: '1h', level: 'Básico', icon: '🏢' },
    { title: 'Gestión del Tiempo', duration: '2h', level: 'Básico', icon: '⏱️' },
    { title: 'Comunicación Efectiva', duration: '2h', level: 'Intermedio', icon: '🗣️' }
  ]
};

const recommendedCourses = computed(() => {
  return coursesDb[userRole.value] || coursesDb['General'];
});
</script>

<style scoped>
.tuckman-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 20px;
  background-color: #f5f7fa;
}

.content-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  max-width: 800px;
  width: 100%;
  overflow: hidden;
}

.header {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  padding: 40px;
  text-align: center;
}

.header h1 {
  margin: 0;
  font-size: 2.5rem;
  margin-bottom: 16px;
}

.phase-badge {
  background: rgba(255, 255, 255, 0.2);
  padding: 6px 16px;
  border-radius: 20px;
  display: inline-block;
  font-weight: 600;
  font-size: 0.9rem;
}

.content-body {
  padding: 40px;
}

.section {
  margin-bottom: 40px;
}

.section h2 {
  color: #1f2937;
  font-size: 1.5rem;
  margin-bottom: 20px;
  border-bottom: 2px solid #f3f4f6;
  padding-bottom: 10px;
}

.role-highlight {
  color: #d97706;
  font-weight: 700;
}

.section p {
  color: #4b5563;
  line-height: 1.6;
  font-size: 1.1rem;
}

.tips-box {
  background: #fffbeb;
  border: 1px solid #fcd34d;
  border-radius: 8px;
  padding: 20px;
  margin-top: 16px;
}

.tips-box h3 {
  color: #92400e;
  margin-top: 0;
}

.tips-box ul {
  margin: 0;
  padding-left: 20px;
  color: #78350f;
}

.tips-box li {
  margin-bottom: 8px;
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.course-card {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: transform 0.2s;
}

.course-card:hover {
  transform: translateY(-3px);
  border-color: #d97706;
}

.course-icon {
  font-size: 2rem;
}

.course-info h4 {
  margin: 0 0 4px 0;
  color: #111827;
  font-size: 1rem;
}

.course-info p {
  margin: 0;
  font-size: 0.85rem;
  color: #6b7280;
}

.start-btn {
  margin-top: auto;
  background: white;
  border: 1px solid #d1d5db;
  padding: 6px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  color: #374151;
  transition: all 0.2s;
}

.start-btn:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.commitment-box {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px;
  background: #f0fdf4;
  border: 1px solid #86efac;
  border-radius: 8px;
}

.commitment-box input {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.commitment-box label {
  color: #166534;
  font-weight: 500;
  cursor: pointer;
}

.footer {
  padding: 24px 40px;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
}

.next-btn {
  background: #e91e63;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.next-btn:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
}

.next-btn:not(:disabled):hover {
  background: #d81b60;
}

.arrow {
  font-size: 1.2rem;
}
</style>
