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
        <button class="logout" @click="handleLogout">Cerrar Sesión</button>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="content">
      <h1>{{ activeForm === 'admin' ? 'Crear Cuenta de Administrador' : 'Crear Cuenta de Usuario' }}</h1>

      <form @submit.prevent="handleSubmit">
        <!-- Formulario de Administrador -->
        <template v-if="activeForm === 'admin'">
          <div class="form-group">
            <label>Email</label>
            <input v-model="form.email" type="email" required />
          </div>
          <div class="form-group">
            <label>Contraseña</label>
            <input v-model="form.password" type="password" required />
          </div>
        </template>

        <!-- Formulario de Usuario -->
        <template v-else>
          <div class="form-group">
            <label>Nombres</label>
            <input v-model="form.name" type="text" required />
          </div>
          <div class="form-group">
            <label>Apellidos</label>
            <input v-model="form.lastName" type="text" required />
          </div>
          <div class="form-group">
            <label>Edad</label>
            <input v-model="form.age" type="number" required />
          </div>
          <div class="form-group">
            <label>DNI</label>
            <input v-model="form.dni" type="text" required />
          </div>
          <div class="form-group">
            <label>Género</label>
            <input v-model="form.gender" type="text" required />
          </div>
          <div class="form-group">
            <label>Ubicación</label>
            <input v-model="form.location" type="text" required />
          </div>
          <div class="form-group">
            <label>Teléfono</label>
            <input v-model="form.phoneNumber" type="text" required />
          </div>
          <div class="form-group">
            <label>Email Corporativo</label>
            <input v-model="form.workEmail" type="email" required />
          </div>
          <div class="form-group">
            <label>Email Personal</label>
            <input v-model="form.personalEmail" type="email" required />
          </div>
          <div class="form-group">
            <label>Ocupación</label>
            <input v-model="form.occupation" type="text" required />
          </div>
          <div class="form-group">
            <label>Área</label>
            <select v-model="form.area" required>
              <option disabled value="">Seleccione un área</option>
              <option value="INFORMATION_TECHNOLOGY">Tecnología</option>
              <option value="HUMAN_RESOURCES">Recursos Humanos</option>
              <option value="FINANCE">Finanzas</option>
              <option value="SALES">Ventas</option>
            </select>
          </div>
          <div class="form-group">
            <label>Rol</label>
            <select v-model="form.role" required>
              <option disabled value="">Seleccione</option>
              <option value="empresa">Empresa</option>
              <option value="trabajador">Trabajador</option>
            </select>
          </div>
        </template>

        <button type="submit">
          Crear {{ activeForm === 'admin' ? 'Administrador' : 'Usuario' }}
        </button>
      </form>

      <p v-if="message" class="message">{{ message }}</p>
    </main>
  </div>
</template>

<script>
import { ref, reactive, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

export default {
  name: 'AdminDashboard',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const user = computed(() => authStore.user)

    const activeForm = ref('admin')
    const message = ref('')

    const form = reactive({
      // Comunes
      email: '',
      password: '',
      role: '',

      // Solo para usuario
      name: '',
      lastName: '',
      age: '',
      dni: '',
      gender: '',
      location: '',
      phoneNumber: '',
      workEmail: '',
      personalEmail: '',
      occupation: '',
      area: ''
    })

    watch(activeForm, () => {
      for (let key in form) {
        form[key] = ''
      }
      message.value = ''
    })

    const handleLogout = () => {
      authStore.logout()
      router.push('/login')
    }

    const handleSubmit = async () => {
      const roleMap = {
        admin: 'MANAGER',
        empresa: 'ADMIN',
        trabajador: 'CLIENT'
      }

      const payload =
        activeForm.value === 'admin'
          ? {
              email: form.email,
              password: form.password,
              role: roleMap['admin']
            }
          : {
              name: form.name,
              lastName: form.lastName,
              age: form.age,
              dni: form.dni,
              gender: form.gender,
              location: form.location,
              phoneNumber: form.phoneNumber,
              workEmail: form.workEmail,
              personalEmail: form.personalEmail,
              occupation: form.occupation,
              area: form.area,
              role: roleMap[form.role]
            }

      try {
        const res = await fetch('http://localhost:8100/api/v1/users/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authStore.token}`
          },
          body: JSON.stringify(payload)
        })

        if (!res.ok) throw new Error('Error al crear usuario')

        const result = await res.json()
        message.value = result.message || 'Usuario creado correctamente'
      } catch (err) {
        console.error(err)
        message.value = 'Error al crear cuenta'
      }
    }

    return {
      activeForm,
      form,
      handleSubmit,
      handleLogout,
      user,
      message
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
