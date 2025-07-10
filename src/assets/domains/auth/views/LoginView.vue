<template>
  <div class="login-bg-gradient">
    <div class="login-main-container">
      <!-- Imagen izquierda -->
      <div class="login-illustration">
        <img src="/login-removebg.png" alt="login-illustration" />
      </div>
      <!-- Formulario derecha -->
      <div class="login-card">
        <h1 class="login-title">Iniciar Sesión</h1>
        <p class="login-subtitle">Ingresa tus credenciales para acceder</p>
        <form @submit.prevent="handleLogin">
          <div class="input-group">
            <span class="input-icon">
              <svg width="18" height="18" fill="none" stroke="#0B562F" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 8-4 8-4s8 0 8 4"/></svg>
            </span>
            <input
              v-model="email"
              type="email"
              placeholder="Correo electrónico"
              required
              autocomplete="username"
            />
          </div>
          <div class="input-group">
            <span class="input-icon">
              <svg width="18" height="18" fill="none" stroke="#0B562F" stroke-width="2" viewBox="0 0 24 24"><rect x="6" y="10" width="12" height="8" rx="2"/><path d="M12 16v-4"/><circle cx="12" cy="13" r="1"/></svg>
            </span>
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Contraseña"
              required
              autocomplete="current-password"
            />
            <span class="input-icon input-action" @click="showPassword = !showPassword" :title="showPassword ? 'Ocultar' : 'Mostrar'">
              <svg v-if="!showPassword" width="18" height="18" fill="none" stroke="#0B562F" stroke-width="2" viewBox="0 0 24 24"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>
              <svg v-else width="18" height="18" fill="none" stroke="#0B562F" stroke-width="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a21.77 21.77 0 0 1 5.06-6.06M1 1l22 22"/><path d="M9.53 9.53A3 3 0 0 0 12 15a3 3 0 0 0 2.47-5.47"/></svg>
            </span>
          </div>
          <div class="forgot-row">
            <router-link to="/forgot-password" class="forgot-link">¿Olvidaste tu contraseña?</router-link>
          </div>
          <button
            type="submit"
            class="login-btn"
            :disabled="isLoading"
          >
            <span v-if="!isLoading">Iniciar sesión</span>
            <div v-else class="spinner"></div>
          </button>
          <p v-if="error" class="error-message">{{ error }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

export default {
  name: 'LoginView',
  setup() {
    const email = ref('')
    const password = ref('')
    const error = ref(null)
    const showPassword = ref(false)
    const router = useRouter()
    const authStore = useAuthStore()

    const handleLogin = async () => {
      error.value = null
      const success = await authStore.login(email.value, password.value)
      if (success) {
        router.push(authStore.getDashboardRoute())
      } else {
        error.value = authStore.error || 'Error al iniciar sesión'
      }
    }

    return {
      email,
      password,
      error,
      showPassword,
      isLoading: authStore.isLoading,
      handleLogin
    }
  }
}
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
  background: none;
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
.input-action {
  left: unset;
  right: 10px;
  cursor: pointer;
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
