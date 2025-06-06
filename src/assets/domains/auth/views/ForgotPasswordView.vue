<template>
  <div class="auth-container">
    <div class="auth-card">
      <h1 class="auth-title">Recuperar Contraseña</h1>
      <p class="auth-subtitle">Ingresa tu email</p>

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
          Volver al inicio de sesión
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
.success-message {
  color: #38a169;
  text-align: center;
  font-size: 0.875rem;
}

.back-to-login-link {
  text-align: center;
  color: #4a5568;
  font-size: 0.875rem;
  text-decoration: none;
  margin-top: 1rem;
  display: block;
}

.back-to-login-link:hover {
  text-decoration: underline;
}
</style>
