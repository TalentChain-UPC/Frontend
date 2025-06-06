import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Inicializa el store de autenticación
import { useAuthStore } from '@/stores/authStore'
const authStore = useAuthStore()
authStore.initialize()  // Asegúrate de llamar a initialize()

app.mount('#app')
