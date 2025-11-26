<template>
  <div class="tuckman-container">
    <div class="content-card">
      <div class="header">
        <button class="back-btn-header" @click="$emit('back')">
          ← Volver
        </button>
        <div class="header-content">
          <h1>Foro de Ideas</h1>
          <div class="phase-badge">Fase 4: Adjourning & Transforming</div>
        </div>
      </div>
      
      <div class="content-body">
        <div class="intro-section">
          <h2>¡Felicidades por tus logros!</h2>
          <p>
            Has demostrado tu valor y compromiso. Ahora es momento de transformar el futuro de TalentChain.
            Comparte tus ideas innovadoras con toda la organización.
          </p>
        </div>

        <div class="ideas-feed">
          <div class="new-idea-box">
            <textarea placeholder="¿Qué idea innovadora tienes hoy?" v-model="newIdea"></textarea>
            <button class="post-btn" @click="postIdea" :disabled="!newIdea.trim()">Publicar Idea</button>
          </div>

          <div class="ideas-list">
            <div class="idea-card" v-for="idea in ideas" :key="idea.id">
              <div class="idea-header">
                <span class="author">{{ idea.author }}</span>
                <span class="date">{{ idea.date }}</span>
              </div>
              <p class="idea-content">{{ idea.content }}</p>
              <div class="idea-actions">
                <button class="like-btn">👍 {{ idea.likes }}</button>
                <button class="comment-btn">💬 Comentar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/authStore';

defineEmits(['back']);
const authStore = useAuthStore();
const newIdea = ref('');

const ideas = ref([
  { id: 1, author: 'Ana Torres', date: 'Hace 2h', content: 'Deberíamos implementar un sistema de mentorías cruzadas entre departamentos.', likes: 12 },
  { id: 2, author: 'Carlos Sánchez', date: 'Hace 5h', content: 'Propongo usar NFTs para certificar las habilidades blandas.', likes: 8 },
  { id: 3, author: 'María López', date: 'Ayer', content: '¿Y si creamos un hackathon interno trimestral?', likes: 24 }
]);

const postIdea = () => {
  if (!newIdea.value.trim()) return;
  
  ideas.value.unshift({
    id: Date.now(),
    author: `${authStore.user?.name || 'Yo'}`,
    date: 'Justo ahora',
    content: newIdea.value,
    likes: 0
  });
  
  newIdea.value = '';
};
</script>

<style scoped>
.tuckman-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  padding: 40px 20px;
  background-color: #f0fdfa;
}

.content-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  max-width: 900px;
  width: 100%;
  overflow: hidden;
}

.header {
  background: linear-gradient(135deg, #0d9488, #14b8a6);
  color: white;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.header-content {
  flex: 1;
  text-align: center;
  margin-right: 40px; /* Balance the button width visually */
}

.back-btn-header {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.back-btn-header:hover {
  background: rgba(255, 255, 255, 0.3);
}

.header h1 {
  margin: 0;
  font-size: 2rem;
  margin-bottom: 5px;
}

.phase-badge {
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 12px;
  border-radius: 20px;
  display: inline-block;
  font-weight: 600;
  font-size: 0.8rem;
}

.content-body {
  padding: 30px;
}

.intro-section {
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.intro-section h2 {
  color: #115e59;
  margin-bottom: 10px;
}

.intro-section p {
  color: #4b5563;
  max-width: 600px;
  margin: 0 auto;
}

.new-idea-box {
  background: #f9fafb;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 30px;
}

.new-idea-box textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
  margin-bottom: 10px;
}

.post-btn {
  background: #0d9488;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;
}

.post-btn:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
}

.post-btn:not(:disabled):hover {
  background: #0f766e;
}

.ideas-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.idea-card {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  transition: transform 0.2s;
}

.idea-card:hover {
  border-color: #99f6e4;
  background: #f0fdfa;
}

.idea-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 0.9rem;
}

.author {
  font-weight: 600;
  color: #111827;
}

.date {
  color: #9ca3af;
}

.idea-content {
  color: #374151;
  margin-bottom: 16px;
  line-height: 1.5;
}

.idea-actions {
  display: flex;
  gap: 16px;
}

.idea-actions button {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.2s;
}

.idea-actions button:hover {
  background: #f3f4f6;
  color: #0d9488;
}


</style>
