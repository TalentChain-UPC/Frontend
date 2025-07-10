<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="navbar-left">
        <div class="logo">TalentChain</div>
      </div>
      <button class="menu-toggle" @click="toggleMenu">
        &#9776;
      </button>
      <div class="navbar-right" :class="{ open: isMenuOpen }">
        <button class="catalog" @click="goToCatalog">
          Catálogo
        </button>
        <button class="logout" @click="handleLogout">
          Cerrar Sesión
        </button>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

export default {
  name: 'AppNavbar',
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()
    const isMenuOpen = ref(false)

    const handleLogout = async () => {
      authStore.logout()
      await router.replace('/login')
    }

    const toggleMenu = () => {
      isMenuOpen.value = !isMenuOpen.value
    }

    const goToCatalog = () => {
      router.push('/catalogo')
    }

    return {
      handleLogout,
      isMenuOpen,
      toggleMenu,
      goToCatalog
    }
  }
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: center;
  padding: 20px 0; /* Espacio arriba y abajo */
  position: relative; /* Importante para posicionar el menú absoluto */
}

/* Contenedor centrado */
.navbar-container {
  background-color: #303b46;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 100%;
  max-width: 1123px;
  padding: 10px 20px;
  font-family: 'Poppins', sans-serif;
  position: relative; /* Necesario para que el menú se posicione respecto a este contenedor */
}

/* Logo */
.logo {
  color: white;
  font-size: 20px;
  font-weight: bold;
}

/* Botón de menú hamburguesa */
.menu-toggle {
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.6rem;
  cursor: pointer;
}

/* Botones de la derecha */
.navbar-right {
  display: flex;
  gap: 12px;
  align-items: center;
}

.catalog,
.logout {
  font-weight: bold;
  padding: 10px 14px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.catalog {
  background-color: #e61aca;
  color: white;
}
.catalog:hover {
  background-color: #d015b9;
}

.logout {
  background-color: #f44336;
  color: white;
}
.logout:hover {
  background-color: #d32f2f;
}

/* Mobile Styles */
@media (max-width: 768px) {
  .menu-toggle {
    display: block;
  }

  .navbar-right {
    position: absolute;
    top: 60px; /* Separación respecto al navbar */
    right: 20px;
    background: #303b46;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    flex-direction: column;
    align-items: stretch;
    width: 160px;
    padding: 10px;
    display: none;
    z-index: 100;
  }

  .navbar-right.open {
    display: flex;
  }

  .navbar-right button {
    width: 100%;
    text-align: left;
  }
}
</style>
