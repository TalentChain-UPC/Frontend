<template>
  <div class="login-page">
    <div class="login-container">
      <!-- Sección izquierda con imagen -->
      <div class="login-image">
        <div class="image-overlay"></div>
      </div>

      <!-- Sección derecha con formulario -->
      <div class="login-form">
        <div class="form-header">
          <h1>Iniciar Sesión</h1>
          <p>Ingresa tus credenciales para acceder</p>
        </div>

        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label>Correo Electrónico</label>
            <input
              v-model="email"
              type="email"
              placeholder="tu@email.com"
              required
            >
          </div>

          <div class="form-group">
            <label>Contraseña</label>
            <input
              v-model="password"
              type="password"
              placeholder="••••••••"
              required
            >
          </div>

          <div class="form-options">
            <router-link to="/forgot-password" class="forgot-password">
              ¿Olvidaste tu contraseña?
            </router-link>
          </div>

          <button
            type="submit"
            class="login-button"
            :disabled="isLoading"
            :class="{ loading: isLoading }"
          >
            <span v-if="!isLoading">Ingresar</span>
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
      isLoading: authStore.isLoading,
      handleLogin
    }
  }
}
</script>

<style scoped>
/* Estilos base */
.login-page {
  font-family: 'Poppins', sans-serif;
  color: black;
  height: 95vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: linear-gradient(135deg, rgba(67, 97, 238, 0.8) 0%, rgba(81, 45, 168, 0.8) 100%);
  padding: 20px;
}

.login-container {
  color: black;
  display: flex;
  width: 900px;
  height: 600px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(10, 10, 10, 0.1);
  overflow: hidden;

}

/* Sección de imagen */
.login-image {
  flex: 1;
  background: url('../../../../../public/login-bg1.png') center/contain no-repeat;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 400px;
  overflow: hidden;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

}

/* Sección de formulario */
.login-form {
  flex: 1;
  padding: 60px 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.form-header {
  text-align: center;
  margin-bottom: 40px;
}

.logo {
  height: 50px;
  margin-bottom: 20px;
}

.form-header h1 {
  font-size: 1.8rem;
  color: #000000;
  margin-bottom: 10px;
}

.form-header p {
  color: #242525;
  font-size: 0.95rem;
}

/* Formulario */
form {
  width: 100%;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #000000;
  font-size: 0.9rem;
}

.form-group input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #dfdfdf;
  box-shadow: 0 0 0 3px rgba(214, 214, 214, 0.2);
}

.form-options {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 25px;
}

.forgot-password {
  color: #020202;
  font-size: 0.85rem;
  text-decoration: none;
}

.forgot-password:hover {
  text-decoration: underline;
}

/* Botón de login */
.login-button {
  width: 100%;
  padding: 14px;
  background-color: #4361ee;
  color: rgb(8, 8, 8);
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-button:hover {
  background-color: #3a56d4;
}

.login-button:disabled {
  background-color: #000000;
  cursor: not-allowed;
}

.login-button.loading {
  background-color: #3a56d4;
}

.spinner {
  width: 20px;
  height: 20px;
  margin: 0 auto;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: rgb(10, 10, 10);
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Mensaje de error */
.error-message {
  color: #e74c3c;
  font-size: 0.9rem;
  margin-top: 15px;
  text-align: center;
}


/* Responsive */
@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
    height: auto;
    width: 100%;
    max-width: 500px;
  }

  .login-image {
    display: none;
  }

  .login-form {
    padding: 40px 30px;
  }
  .form-group{
    width: 90%;
  }
}
</style>
