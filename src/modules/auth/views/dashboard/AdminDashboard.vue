<template>
  <div class="admin-dashboard">
    <!-- Sidebar -->
    <aside class="sidebar">
      <h2>Panel Admin</h2>
      <nav>
        <button @click="activeForm = 'admin'" class="switch" :class="{ active: activeForm === 'admin' }">
          Crear Administrador
        </button>
        <button @click="activeForm = 'company'" class="switch" :class="{ active: activeForm === 'company' }">
          Crear Empresa
        </button>
        <button class="logout" @click="handleLogout">Cerrar Sesión</button>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="content">
      <h1>
        {{
          activeForm === 'admin'
            ? 'Crear Cuenta de Administrador'
            : activeForm === 'company'
            ? 'Crear Empresa'
            : ''
        }}
      </h1>

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

        <!-- Formulario de Empresa -->
        <template v-else-if="activeForm === 'company'">
          <div class="form-group">
            <label>Nombre de la Empresa</label>
            <input v-model="form.name" type="text" required />
          </div>
          <div class="form-group">
            <label>RUC</label>
            <input v-model="form.ruc" type="text" required />
          </div>
          <div class="form-group">
            <label>Sector</label>
            <input v-model="form.sector" type="text" required />
          </div>
          <hr />
          <h3>Datos del Empleado Principal</h3>
          <div class="form-group">
            <label>Nombres</label>
            <input v-model="form.employee.name" type="text" required />
          </div>
          <div class="form-group">
            <label>Apellidos</label>
            <input v-model="form.employee.lastName" type="text" required />
          </div>
          <div class="form-group">
            <label>Edad</label>
            <input v-model="form.employee.age" type="number" required />
          </div>
          <div class="form-group">
            <label>DNI</label>
            <input 
              v-model="form.employee.dni" 
              type="text" 
              required 
              @input="form.employee.dni = form.employee.dni.replace(/[^0-9]/g, '')"
              maxlength="8"
            />
          </div>
          <div class="form-group">
            <label>Género</label>
            <select v-model="form.employee.gender" required>
              <option disabled value="">Seleccione género</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
            </select>
          </div>
          <div class="form-group">
            <label>Ubicación</label>
            <input v-model="form.employee.location" type="text" required />
          </div>
          <div class="form-group">
            <label>Teléfono</label>
            <input 
              v-model="form.employee.phoneNumber" 
              type="text" 
              required 
              @input="form.employee.phoneNumber = form.employee.phoneNumber.replace(/[^0-9]/g, '')"
              maxlength="9"
            />
          </div>
          <div class="form-group">
            <label>Email Corporativo</label>
            <input v-model="form.employee.workEmail" type="email" required />
          </div>
          <div class="form-group">
            <label>Email Personal</label>
            <input v-model="form.employee.personalEmail" type="email" required />
          </div>
          <div class="form-group">
            <label>Área</label>
            <select v-model="form.employee.area" required>
              <option disabled value="">Seleccione un área</option>
              <option value="GENERAL_MANAGEMENT">Gerencia General</option>
              <option value="ADMINISTRATION">Administración</option>
              <option value="HUMAN_RESOURCES">Recursos Humanos</option>
              <option value="INFORMATION_TECHNOLOGY">Tecnología de la Información</option>
              <option value="FINANCE">Finanzas</option>
              <option value="LOGISTICS">Logística</option>
              <option value="SALES">Ventas</option>
              <option value="MARKETING">Marketing</option>
              <option value="OPERATIONS">Operaciones</option>
              <option value="QUALITY_ASSURANCE">Aseguramiento de Calidad</option>
              <option value="LEGAL">Legal</option>
              <option value="AUDIT">Auditoría</option>
              <option value="MAINTENANCE">Mantenimiento</option>
              <option value="OCCUPATIONAL_HEALTH_AND_SAFETY">Seguridad y Salud Ocupacional</option>
              <option value="CUSTOMER_SERVICE">Servicio al Cliente</option>
              <option value="PLANNING">Planeamiento</option>
              <option value="INNOVATION">Innovación</option>
            </select>
          </div>
          <div class="form-group">
            <label>Ocupación</label>
            <input v-model="form.employee.occupation" type="text" required />
          </div>
        </template>

        <button type="submit">
          {{ activeForm === 'admin' ? 'Crear Administrador' : 'Registrar' }}
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
      // Para admin
      email: '',
      password: '',

      // Para empresa
      name: '',
      ruc: '',
      sector: '',
      employee: {
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
      }
    })

    watch(activeForm, () => {
      // Resetear todo el formulario al cambiar de tab
      for (let key in form) {
        if (typeof form[key] === 'object' && form[key] !== null) {
          for (let subKey in form[key]) {
            form[key][subKey] = ''
          }
        } else {
          form[key] = ''
        }
      }
      message.value = ''
    })

    const handleLogout = () => {
      authStore.logout()
      router.push('/login')
    }

    const handleSubmit = async () => {
      let payload
      if (activeForm.value === 'admin') {
        payload = {
          email: form.email,
          password: form.password,
          role: 'ADMIN'
        }
      } else if (activeForm.value === 'company') {
        const adminAreas = [
          'GENERAL_MANAGEMENT',
          'ADMINISTRATION',
          'HUMAN_RESOURCES',
          'INFORMATION_TECHNOLOGY'
        ]
        
        const role = adminAreas.includes(form.employee.area) ? 'ADMINISTRATIVE' : 'EMPLOYEE'

        payload = {
          name: form.name,
          ruc: form.ruc,
          sector: form.sector,
          employee: { 
            ...form.employee,
            role
          }
        }
      }

      try {
        const res = await fetch('/api/v1/users/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authStore.token}`
          },
          body: JSON.stringify(payload)
        })

        if (!res.ok) throw new Error('Error al crear')

        const result = await res.json()
        message.value = result.message || 'Creado correctamente'

        // Limpiar formulario parcialmente si es empresa
        if (activeForm.value === 'company') {
          // Limpiar solo datos del empleado
          for (let key in form.employee) {
            form.employee[key] = ''
          }
          // Mantener datos de empresa (name, ruc, sector)
        } else {
          // Limpiar todo si es admin
          form.email = ''
          form.password = ''
        }

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
  flex-wrap: wrap; /* Para soportar wrapping en móvil */
}

/* Sidebar en escritorio */
.sidebar {
  width: 250px;
  background-color: #2c3e50;
  color: white;
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  position: relative;
}

/* Botón de cerrar sesión fijo abajo */
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

.logout:hover {
  background-color: #ec2323;
}


/* Botones del nav */
.switch {
  background: none;
  border: none;
  color: white;
  padding: 10px 0;
  font-size: 16px;
  cursor: pointer;
  text-align: left;
}

.switch.active {
  font-weight: bold;
  color: #1abc9c;
}

.switch:hover {
  color: #1abc9c;
}

/* Contenido principal */
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

/* Tablet y móvil */
@media (max-width: 768px) {
  .admin-dashboard {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 15px 20px;
    position: relative;
  }

  .sidebar h2 {
    margin: 0;
    font-size: 18px;
  }

  .sidebar nav {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .logout {
    /* Posicionamiento normal, no absoluto */
    position: static;
    margin-left: auto;
    padding: 8px 14px;
    font-size: 14px;
  }

  .switch {
    padding: 8px 12px;
    font-size: 14px;
    text-align: center;
  }

  .content {
    padding: 20px;
  }
}

</style>
