<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <h2>Editar perfil</h2>
      <div class="profile-photo-section" style="text-align:center; margin-bottom:20px;">
        <img
          :src="localUser.photoPreview || localUser.photo || defaultPhoto"
          alt="Foto de perfil"
          class="profile-pic-edit"
        />
        <input type="file" accept="image/*" @change="onPhotoChange" style="margin-top:10px;" />
      </div>
      <div class="form-group">
        <label>Nombre</label>
        <input v-model="localUser.name" />
      </div>
      <div class="form-group">
        <label>Apellido</label>
        <input v-model="localUser.lastName" />
      </div>
      <div class="form-group">
        <label>Ocupación</label>
        <input v-model="localUser.occupation" />
      </div>
      <div class="form-group">
        <label>Email</label>
        <input v-model="localUser.email" />
      </div>
      <div class="modal-actions">
        <button class="save-btn" @click="save">Guardar</button>
        <button class="cancel-btn" @click="$emit('close')">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, ref } from 'vue'

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
})

const emits = defineEmits(['save', 'close'])

const defaultPhoto = ref('https://randomuser.me/api/portraits/men/44.jpg')

// Creamos una copia local para editar sin modificar el original hasta "Guardar"
const localUser = reactive({
  name: props.user.name || '',
  lastName: props.user.lastName || '',
  occupation: props.user.occupation || '',
  email: props.user.email || '',
  photo: props.user.photo || '',
  photoFile: null,
  photoPreview: ''
})

// Si el usuario cambia externamente mientras el modal está abierto, actualizamos los campos
watch(
  () => props.user,
  (newVal) => {
    localUser.name = newVal.name || ''
    localUser.lastName = newVal.lastName || ''
    localUser.occupation = newVal.occupation || ''
    localUser.email = newVal.email || ''
    localUser.photo = newVal.photo || ''
    localUser.photoFile = null
    localUser.photoPreview = ''
  },
  { deep: true, immediate: true }
)

const onPhotoChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    localUser.photoFile = file
    const reader = new FileReader()
    reader.onload = (ev) => {
      localUser.photoPreview = ev.target.result
    }
    reader.readAsDataURL(file)
  }
}

const save = () => {
  // Si hay una nueva foto, la incluimos en el objeto emitido
  const userToSave = { ...localUser }
  emits('save', userToSave)
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

.profile-photo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.profile-pic-edit {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e91e63;
  margin-bottom: 8px;
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
