<template>
  <!-- Contenedor principal -->
  <div class="app-container">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>

    <!-- Notificación con temporizador -->
    <transition name="notification-slide">
      <div
        v-if="notification.show"
        class="notification"
        :class="notification.type"
        @mouseenter="pauseTimer"
        @mouseleave="resumeTimer"
      >
        {{ notification.message }}
        <button @click="hideNotification" class="close-btn">×</button>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

export default {
  name: 'App',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const notification = ref({
      show: false,
      message: '',
      type: 'info',
      timer: null
    })

    // Mostrar notificación con temporizador
    const showNotification = (message, type = 'info', duration = 3000) => {
      // Cancelar notificación anterior si existe
      if (notification.value.timer) {
        clearTimeout(notification.value.timer)
      }

      notification.value = {
        show: true,
        message,
        type,
        timer: setTimeout(() => {
          notification.value.show = false
        }, duration)
      }
    }

    // Pausar temporizador cuando el mouse entra
    const pauseTimer = () => {
      if (notification.value.timer) {
        clearTimeout(notification.value.timer)
      }
    }

    // Reanudar temporizador cuando el mouse sale
    const resumeTimer = () => {
      if (notification.value.show) {
        notification.value.timer = setTimeout(() => {
          notification.value.show = false
        }, 2000) // 2 segundos adicionales después de que el mouse sale
      }
    }

    // Ocultar manualmente
    const hideNotification = () => {
      if (notification.value.timer) {
        clearTimeout(notification.value.timer)
      }
      notification.value.show = false
    }

    onMounted(() => {
      if (router.currentRoute.value.path === '/' && !authStore.isAuthenticated) {
        router.replace('/login')
      }
    })

    return {
      notification,
      showNotification,
      pauseTimer,
      resumeTimer,
      hideNotification
    }
  }
}
</script>

<style scoped>
#app {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Estilos de transición para la notificación */
.notification-slide-enter-active,
.notification-slide-leave-active {
  transition: all 0.3s ease;
}
.notification-slide-enter-from,
.notification-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* Estilos de la notificación */
.notification {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 15px 20px;
  border-radius: 8px;
  color: white;
  max-width: 300px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
}

.notification.info {
  background-color: #4361ee;
}

.notification.success {
  background-color: #4caf50;
}

.notification.warning {
  background-color: #ff9800;
}

.notification.error {
  background-color: #f44336;
}

.close-btn {
  background: transparent;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  margin-left: 10px;
  padding: 0 5px;
}

/* Transiciones para el router */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .notification {
    left: 20px;
    right: 20px;
    max-width: none;
  }
}
</style>
