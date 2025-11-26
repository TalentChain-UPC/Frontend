<template>
  <div class="auth-container">
    <div class="auth-card">
      <h1 class="auth-title">Recuperar Contraseña</h1>
      <p class="auth-subtitle">
        {{ isResetStep ? 'Ingresa tu nueva contraseña' : 'Ingresa tu email para recibir instrucciones' }}
      </p>

      <form
        @submit.prevent="isResetStep ? handleReset : handleRequest"
        class="auth-form"
      >
        <div v-if="!isResetStep" class="form-group">
          <label>Email</label>
          <input
            v-model="email"
            type="email"
            required
            placeholder="tu@email.com"
          >
        </div>

        <div v-if="isResetStep" class="form-group">
          <label>Nueva Contraseña</label>
          <input
            v-model="newPassword"
            type="password"
            required
            placeholder="••••••••"
          >
        </div>

        <button type="submit" :disabled="isLoading">
          {{ isLoading ? 'Procesando...' : isResetStep ? 'Cambiar Contraseña' : 'Enviar' }}
        </button>

        <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
        <p v-if="error" class="error-message">{{ error }}</p>

        <router-link
          to="/login"
          class="back-to-login-link"
        >
          ← Volver al inicio de sesión
        </router-link>
      </form>
    </div>
  </div>
</template>

<script>
  import { ref, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useAuthStore } from '@/stores/authStore';

  export default {
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
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, #edf2f7, #e2e8f0);
}

.auth-card {
  background: white;
  padding: 2.5rem 2rem;
  max-width: 420px;
  width: 100%;
  border-radius: 16px;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.auth-title {
  font-size: 1.8rem;
  font-weight: 600;
  text-align: center;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.auth-subtitle {
  font-size: 1rem;
  text-align: center;
  color: #718096;
  margin-bottom: 1.5rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.form-group label {
  font-weight: 500;
  margin-bottom: 0.4rem;
  color: #4a5568;
  display: block;
}

.form-group input {
  width: 92%;
  padding: 0.65rem 0.9rem;
  border: 1px solid #cbd5e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border 0.2s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #4361ee;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
}

button[type="submit"] {
  background-color: #4361ee;
  color: white;
  padding: 0.75rem;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s ease;
  width: 60%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
}

button[disabled] {
  background-color: #4361ee;
  cursor: not-allowed;
}

button:hover:not([disabled]) {
  background-color: #4361ee;
}

.success-message {
  color: #38a169;
  text-align: center;
  font-size: 0.9rem;
}

.error-message {
  color: #e53e3e;
  text-align: center;
  font-size: 0.9rem;
}

.back-to-login-link {
  display: block;
  text-align: center;
  color: #4a5568;
  font-size: 0.875rem;
  margin-top: 1rem;
  text-decoration: none;
  transition: color 0.2s ease;
}

.back-to-login-link:hover {
  color: #2b6cb0;
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 480px) {
  .auth-card {
    padding: 2rem 1.5rem;
  }

  .auth-title {
    font-size: 1.6rem;
  }

  .auth-subtitle {
    font-size: 0.95rem;
  }
}

</style>
