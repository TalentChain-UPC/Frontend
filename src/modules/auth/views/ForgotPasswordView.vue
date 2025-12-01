<template>
  <div class="login-bg-gradient">
    <div class="login-main-container">
      <!-- Imagen izquierda (opcional, o puedes quitarla si quieres que sea solo card centrada) -->
      <div class="login-illustration">
        <img src="/login-removebg.png" alt="forgot-password-illustration" />
      </div>
      <!-- Formulario derecha -->
      <div class="login-card">
        <h1 class="login-title">Recuperar Contraseña</h1>
        <p class="login-subtitle">
          {{ isResetStep ? 'Ingresa tu nueva contraseña' : 'Ingresa tu email para recibir instrucciones' }}
        </p>
        
        <form @submit.prevent="isResetStep ? handleReset : handleRequest">
          
          <div v-if="!isResetStep" class="input-group">
            <span class="input-icon">
              <svg width="18" height="18" fill="none" stroke="#0B562F" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 8-4 8-4s8 0 8 4"/></svg>
            </span>
            <input
              v-model="email"
              type="email"
              placeholder="Correo electrónico"
              required
            />
          </div>

          <div v-if="isResetStep" class="input-group">
            <span class="input-icon">
              <svg width="18" height="18" fill="none" stroke="#0B562F" stroke-width="2" viewBox="0 0 24 24"><rect x="6" y="10" width="12" height="8" rx="2"/><path d="M12 16v-4"/><circle cx="12" cy="13" r="1"/></svg>
            </span>
            <input
              v-model="newPassword"
              type="password"
              placeholder="Nueva Contraseña"
              required
            />
          </div>

          <button
            type="submit"
            class="login-btn"
            :disabled="isLoading"
          >
            <span v-if="!isLoading">{{ isResetStep ? 'Cambiar Contraseña' : 'Enviar' }}</span>
            <div v-else class="spinner"></div>
          </button>

          <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
          <p v-if="error" class="error-message">{{ error }}</p>

          <div class="forgot-row" style="justify-content: center; margin-top: 16px;">
            <router-link to="/login" class="forgot-link">← Volver al inicio de sesión</router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

export default {
  name: 'ForgotPasswordView',
  setup() {
    const email = ref('');
    const newPassword = ref('');
    const successMessage = ref('');
    const route = useRoute();
    const router = useRouter();
    const authStore = useAuthStore();

    // Verificar si hay token en la URL (ej: /forgot-password?token=abc123)
    const token = computed(() => route.query.token || authStore.resetToken);
    const isResetStep = computed(() => !!token.value);

    const handleRequest = async () => {
      const success = await authStore.requestPasswordReset(email.value);
      if (success) {
        successMessage.value = `Se han enviado instrucciones a ${email.value}`;
        email.value = '';
      }
    };

    const handleReset = async () => {
      const success = await authStore.resetPassword(token.value, newPassword.value);
      if (success) {
        successMessage.value = 'Contraseña actualizada correctamente';
        setTimeout(() => router.push('/login'), 2000);
      }
    };

    return {
      email,
      newPassword,
      handleRequest,
      handleReset,
      isResetStep,
      isLoading: authStore.isLoading,
      error: authStore.error,
      successMessage
    };
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

.login-bg-gradient {
  min-height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(120deg, #f6fff8 0%, #fbeaff 100%);
  font-family: 'Poppins', sans-serif;
}

.login-main-container {
  display: flex;
  width: 950px;
  height: 520px;
  background: transparent;
  border-radius: 18px;
  overflow: hidden;
}

.login-illustration {
  flex: 1.2;
  background: none;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
}
.login-illustration img {
  width: 90%;
  max-width: 370px;
  min-width: 220px;
  object-fit: contain;
  user-select: none;
}

.login-card {
  flex: 1;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px 0 rgba(31, 38, 135, 0.08);
  padding: 48px 38px 38px 38px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: 320px;
  max-width: 400px;
}

.login-title {
  color: #e6007a;
  font-size: 1.7rem;
  font-weight: 700;
  margin-bottom: 8px;
  text-align: center;
}
.login-subtitle {
  color: #222;
  font-size: 1rem;
  margin-bottom: 28px;
  text-align: center;
}

form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.input-group {
  position: relative;
  display: flex;
  align-items: center;
  background: #fafafa;
  border: 1.5px solid #eaeaea;
  border-radius: 8px;
  padding: 0 12px;
  margin-bottom: 0;
}
.input-group input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 1rem;
  padding: 13px 8px 13px 36px;
  width: 100%;
  color: #222;
  font-family: inherit;
}
.input-group input::placeholder {
  color: #bdbdbd;
  font-size: 0.98rem;
}
.input-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  cursor: default;
}

.forgot-row {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0;
}
.forgot-link {
  color: #222;
  font-size: 0.93rem;
  text-decoration: none;
  transition: color 0.2s;
}
.forgot-link:hover {
  color: #e6007a;
  text-decoration: underline;
}

.login-btn {
  width: 100%;
  padding: 13px 0;
  background: #e6007a;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1.08rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 8px;
  transition: background 0.2s;
  box-shadow: 0 2px 8px 0 rgba(230,0,122,0.08);
  display: flex;
  align-items: center;
  justify-content: center;
}
.login-btn:disabled {
  background: #f3b2d1;
  cursor: not-allowed;
}
.login-btn:hover:not(:disabled) {
  background: #c20065;
}

.spinner {
  width: 22px;
  height: 22px;
  border: 3px solid #fff;
  border-top: 3px solid #e6007a;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

.success-message {
  color: #38a169;
  text-align: center;
  font-size: 0.9rem;
  margin-top: 10px;
  font-weight: 500;
}

.error-message {
  color: #e6007a;
  font-size: 0.97rem;
  margin-top: 10px;
  text-align: center;
  font-weight: 500;
}

@media (max-width: 900px) {
  .login-main-container {
    width: 98vw;
    height: auto;
    min-height: 480px;
  }
  .login-illustration {
    display: none;
  }
  .login-card {
    max-width: 100vw;
    min-width: 0;
    width: 100vw;
    border-radius: 0 0 16px 16px;
    padding: 38px 18px 28px 18px;
  }
}
</style>
