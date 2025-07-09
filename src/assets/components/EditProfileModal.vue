<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <h2>Editar perfil</h2>
      <div class="form-group">
        <label>Nombre completo</label>
        <input v-model="localUser.name" />
      </div>
      <div class="form-group">
        <label>Email</label>
        <input v-model="localUser.email" />
      </div>
      <div class="form-group">
        <label>Rol</label>
        <input v-model="localUser.puesto" />
      </div>
      <div class="modal-actions">
        <button class="save-btn" @click="save">Guardar</button>
        <button class="cancel-btn" @click="$emit('close')">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
})

const emits = defineEmits(['save', 'close'])

// Creamos una copia local para editar sin modificar el original hasta "Guardar"
const localUser = reactive({
  name: props.user.name,
  email: props.user.email,
  puesto: props.user.puesto
})

// Si el usuario cambia externamente mientras el modal está abierto, actualizamos los campos
watch(
  () => props.user,
  (newVal) => {
    localUser.name = newVal.name
    localUser.email = newVal.email
    localUser.puesto = newVal.puesto
  },
  { deep: true, immediate: true }
)

const save = () => {
  emits('save', { ...localUser })
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  box-sizing: border-box;
}

.modal-content {
  background: #ffffff;
  padding: 30px;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-content h2 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.5rem;
  color: #333;
  font-weight: 600;
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #555;
  font-size: 0.95rem;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 12px 14px;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-sizing: border-box;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #4caf50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
  outline: none;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 30px;
}

.save-btn,
.cancel-btn {
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  font-size: 0.95rem;
  transition: background-color 0.3s, transform 0.2s;
}

.save-btn {
  background-color: #4caf50;
  color: white;
}

.save-btn:hover {
  background-color: #45a049;
  transform: translateY(-1px);
}

.cancel-btn {
  background-color: #f44336;
  color: white;
}

.cancel-btn:hover {
  background-color: #d7372f;
  transform: translateY(-1px);
}
</style>
