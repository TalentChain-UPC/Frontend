<template>
  <div class="tuckman-container">
    <div class="content-card">
      <div class="header">
        <h1>Bienvenido a TalentChain</h1>
        <div class="phase-badge">Fase 1: Forming</div>
      </div>
      
      <div class="content-body">
        <div class="section">
          <h2>Nuestra Historia</h2>
          <p>
            Fundada en 2023, TalentChain nació con la visión de descentralizar el reconocimiento profesional.
            Lo que comenzó como un pequeño proyecto de blockchain ahora conecta a miles de talentos globalmente.
          </p>
        </div>

        <div class="section">
          <h2>Cultura y Valores</h2>
          <div class="value-grid">
            <div class="value-item">
              <span class="icon">🚀</span>
              <h3>Innovación</h3>
              <p>Desafiamos lo convencional para crear el futuro.</p>
            </div>
            <div class="value-item">
              <span class="icon">🤝</span>
              <h3>Transparencia</h3>
              <p>La verdad está en la cadena, confiamos en los datos.</p>
            </div>
            <div class="value-item">
              <span class="icon">🌍</span>
              <h3>Impacto Global</h3>
              <p>Tu trabajo trasciende fronteras y culturas.</p>
            </div>
            <div class="value-item">
              <span class="icon">🌱</span>
              <h3>Crecimiento</h3>
              <p>Aprendemos, iteramos y mejoramos cada día.</p>
            </div>
          </div>
        </div>

        <div class="section">
          <h2>Tu Impacto</h2>
          <p>
            Cada línea de código, cada diseño y cada estrategia que aportas ayuda a construir una economía
            más justa basada en el mérito real. Aquí, tu talento es tu activo más valioso.
          </p>
        </div>

        <div class="welcome-message">
          <p>Estamos emocionados de que seas parte de esta revolución. ¡Bienvenido a bordo!</p>
        </div>
      </div>

      <div class="footer">
        <button class="next-btn" @click="$emit('next')">
          Siguiente: Conoce tu Rol
          <span class="arrow">→</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineEmits(['next']);
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
  background: linear-gradient(135deg, #6d28d9, #8b5cf6);
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

.section p {
  color: #4b5563;
  line-height: 1.6;
  font-size: 1.1rem;
}

.value-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  margin-top: 24px;
}

.value-item {
  text-align: center;
  padding: 24px;
  background: #f9fafb;
  border-radius: 12px;
  transition: transform 0.2s;
}

.value-item:hover {
  transform: translateY(-5px);
}

.icon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 12px;
}

.value-item h3 {
  color: #111827;
  margin: 0 0 8px 0;
}

.value-item p {
  font-size: 0.95rem;
  margin: 0;
}

.welcome-message {
  background: #eff6ff;
  border-left: 4px solid #3b82f6;
  padding: 20px;
  border-radius: 0 8px 8px 0;
}

.welcome-message p {
  margin: 0;
  color: #1e40af;
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
  transition: background 0.2s;
}

.next-btn:hover {
  background: #d81b60;
}

.arrow {
  font-size: 1.2rem;
}
</style>
