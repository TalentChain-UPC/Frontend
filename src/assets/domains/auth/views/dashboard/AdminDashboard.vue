<template>
  <div class="admin-dashboard">
    <!-- Sidebar -->
    <aside class="sidebar">
      <h2>Panel Admin</h2>
      <nav>
        <button @click="activeForm = 'admin'" :class="{ active: activeForm === 'admin' }">
          Crear Administrador
        </button>
        <button @click="activeForm = 'user'" :class="{ active: activeForm === 'user' }">
          Crear Usuario
        </button>
        <button class="logout" @click="handleLogout">
        Cerrar Sesión
        </button>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="content">
      <h1>{{ activeForm === 'admin' ? 'Crear Cuenta de Administrador' : 'Crear Cuenta de Usuario' }}</h1>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>Nombre Completo</label>
          <input v-model="form.fullName" type="text" required />
        </div>

        <div class="form-group">
          <label>Email</label>
          <input v-model="form.email" type="email" required />
        </div>

        <div class="form-group">
          <label>Contraseña</label>
          <input v-model="form.password" type="password" required />
        </div>

        <!-- Campo opcional si es empresa o trabajador -->
        <div v-if="activeForm === 'user'" class="form-group">
          <label>Rol del Usuario</label>
          <select v-model="form.role" required>
            <option disabled value="">Seleccione</option>
            <option value="empresa">Empresa</option>
            <option value="trabajador">Trabajador</option>
          </select>
        </div>

        <button type="submit">Crear {{ activeForm === 'admin' ? 'Administrador' : 'Usuario' }}</button>
      </form>

      <p v-if="message" class="message">{{ message }}</p>
    </main>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { ref, reactive, watch } from 'vue'

export default {
  name: 'AdminDashboard',
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()
    const user = computed(() => authStore.user)

    const handleLogout = () => {
      authStore.logout()
      router.push('/')
    }

    const activeForm = ref('admin') // o 'user'
    const message = ref('')

    const form = reactive({
      fullName: '',
      email: '',
      password: '',
      role: ''
    })

    // Limpiar el formulario al cambiar
    watch(activeForm, () => {
      form.fullName = ''
      form.email = ''
      form.password = ''
      form.role = ''
      message.value = ''
    })

    const handleSubmit = async () => {
      const dataToSend = {
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        role: activeForm.value === 'admin' ? 'administrativo' : form.role
      }

      // Simulación (reemplazar con llamada a tu backend)
      console.log('Enviando:', dataToSend)

      message.value = 'Cuenta creada correctamente (simulado)'
      // Aquí irá la lógica con axios o fetch en producción
    }

    return {
      activeForm,
      form,
      handleSubmit,
      message,
      user,
      handleLogout
    }
  }
}
</script>


<style scoped>
.admin-dashboard {
  display: flex;
  min-height: 100vh;
  font-family: 'Poppins', sans-serif;
}

.sidebar {
  width: 250px;
  background-color: #2c3e50;
  color: white;
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
}

.sidebar h2 {
  margin-bottom: 30px;
}

.sidebar nav button {
  background: none;
  border: none;
  color: white;
  padding: 10px 0;
  font-size: 16px;
  cursor: pointer;
  text-align: left;
}

.sidebar nav button.active {
  font-weight: bold;
  color: #1abc9c;
}

.sidebar nav button:hover {
  color: #1abc9c;
}

.content {
  flex: 1;
  padding: 40px;
  background-color: #f5f6fa;
}

h1 {
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  font-weight: 500;
  margin-bottom: 6px;
}

input, select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

button[type="submit"] {
  background-color: #1abc9c;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

button[type="submit"]:hover {
  background-color: #16a085;
}

.message {
  margin-top: 20px;
  color: green;
}

.logout {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background-color: #ef4444;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

</style>
