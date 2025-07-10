<script>
</script>
<template>
  <div class="catalog-modal">
    <div class="catalog-header">
      <button class="back-btn" @click="closeCatalog">Volver</button>
      <div class="catalog-header-left">
        <h1 class="catalog-logo">Catálogo</h1>
        <div class="catalog-desc">Explora y canjea increíbles recompensas usando tus monedas acumuladas. El catálogo está lleno de premios pensados para ti:</div>
      </div>
    </div>
    <div class="catalog-search">
      <input v-model="search" type="text" placeholder="Buscar..." />
    </div>
    <div class="catalog-grid">
      <div v-for="item in filteredRewards" :key="item.id" class="catalog-card">
        <img :src="item.image" :alt="item.title" class="catalog-img" />
        <div class="catalog-info">
          <h2 class="catalog-card-title">{{ item.title }}</h2>
          <div class="catalog-card-footer">
            <span class="catalog-coins">
              {{ item.coins }} monedas
            </span>
            <button class="redeem-btn" :disabled="item.disabled">Canjear</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const search = ref('')

const companyCatalogs = {
  default: [
    {
      id: 1,
      title: 'Día libre',
      coins: 2000,
      image: 'https://cdn-icons-png.flaticon.com/512/3062/3062634.png',
      disabled: false
    },
    {
      id: 2,
      title: '2 entradas al cine',
      coins: 2500,
      image: 'https://cdn-icons-png.flaticon.com/512/3223/3223044.png',
      disabled: false
    },
    {
      id: 3,
      title: 'Combo de Bembos',
      coins: 1800,
      image: 'https://cdn-icons-png.flaticon.com/512/3075/3075977.png',
      disabled: false
    },
    {
      id: 4,
      title: 'Pizza Familiar',
      coins: 1200,
      image: 'https://cdn-icons-png.flaticon.com/512/3132/3132693.png',
      disabled: false
    },
    {
      id: 5,
      title: 'Día de relax en Spa',
      coins: 3500,
      image: 'https://cdn-icons-png.flaticon.com/512/1986/1986244.png',
      disabled: false
    },
    {
      id: 6,
      title: 'Vale de Consumo',
      coins: 1800,
      image: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
      disabled: false
    },
    {
      id: 7,
      title: 'Audífonos Bluetooth',
      coins: 3200,
      image: 'https://cdn-icons-png.flaticon.com/512/1048/1048949.png',
      disabled: false
    },
    {
      id: 8,
      title: 'Kit de oficina premium',
      coins: 2700,
      image: 'https://cdn-icons-png.flaticon.com/512/2921/2921822.png',
      disabled: false
    }
  ],
  // Puedes agregar más catálogos por empresa aquí
}

const rewards = ref(companyCatalogs.default)

const filteredRewards = computed(() => {
  if (!search.value) return rewards.value
  return rewards.value.filter(item =>
    item.title.toLowerCase().includes(search.value.toLowerCase())
  )
})

const closeCatalog = () => {
  window.history.back()
}
</script>

<style scoped>
.catalog-modal {
  background: #fff;
  border-radius: 16px;
  max-width: 1100px;
  margin: 32px auto;
  box-shadow: 0 8px 32px rgba(0,0,0,0.10);
  padding: 32px 32px 32px 32px;
  position: relative;
  margin-bottom: 15px;
}
.catalog-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
  position: relative;
}
.catalog-header-left {
  display: flex;
  flex-direction: column;
  margin-left: 60px;
}
.catalog-logo {
  color: #e91e63;
  font-size: 2.1rem;
  font-weight: 700;
  margin-bottom: 0;
  letter-spacing: 1px;
}
.catalog-desc {
  color: #222;
  font-size: 1.1rem;
  margin-bottom: 8px;
}
.back-btn {
  position: absolute;
  left: 0;
  top: -8px;
  left: -8px;
  background: none;
  border: none;
  color: #e91e63;
  font-size: 0.8rem;
  cursor: pointer;
  border-radius: 8px;
  transition: background 0.2s;
  z-index: 2;
}
.catalog-search {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  position: relative;
}
.catalog-search input {
  width: 100%;
  padding: 12px 40px 12px 16px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  font-size: 1rem;
  background: #fafafa;
}
.search-icon {
  position: absolute;
  right: 16px;
  font-size: 1.2rem;
  color: #aaa;
}
.catalog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 22px;
}
.catalog-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(233,30,99,0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: 2px solid #f3e6f7;
  transition: box-shadow 0.2s, border-color 0.2s, transform 0.2s;
}
.catalog-card:hover {
  box-shadow: 0 8px 32px rgba(233,30,99,0.13);
  border-color: #e91e63;
  transform: translateY(-4px) scale(1.03);
}
.catalog-img {
  width: 100%;
  height: 120px;
  object-fit: contain;
  background: #f9f9f9;
  border-bottom: 1px solid #f3e6f7;
}
.catalog-info {
  padding: 16px 14px 12px 14px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.catalog-card-title {
  font-size: 1.08rem;
  font-weight: 600;
  color: #222;
  margin-bottom: 12px;
}
.catalog-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.catalog-coins {
  font-weight: 600;
  color: #e91e63;
  font-size: 1.05rem;
}
.redeem-btn {
  background: #fff;
  color: #e91e63;
  border: 2px solid #e91e63;
  border-radius: 8px;
  padding: 7px 18px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, border 0.2s, transform 0.2s;
  box-shadow: 0 2px 8px rgba(233,30,99,0.08);
}
.redeem-btn:disabled {
  background: #f3f3f3;
  color: #aaa;
  border: 2px solid #e0e0e0;
  cursor: not-allowed;
  box-shadow: none;
}
.redeem-btn:not(:disabled):hover {
  background: #e91e63;
  color: #fff;
  border: 2px solid #e91e63;
  transform: translateY(-2px) scale(1.04);
}
</style>
