import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from '@/stores/authStore'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)


async function init() {
  const authStore = useAuthStore()
  await authStore.initialize()
  app.mount('#app')
}

// Inicializa el store de autenticación
router.isReady().then(() => {
  const authStore = useAuthStore()
  authStore.initialize().catch(error => {
    console.error('Auth initialization error:', error)
  })
})

init()
