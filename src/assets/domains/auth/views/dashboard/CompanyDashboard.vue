<template>
  <AppNavbar />
</template>

<script>
import AppNavbar from '@/shared/components/AppNavbar.vue';


export default {
  components: {
    AppNavbar
  },
}
</script>

<style scoped>
.company-dashboard {
  background-color: #f0fdf4;
}

.company-features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 2rem;
}

.feature-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.feature-card h3 {
  color: #166534;
  margin-bottom: 0.5rem;
}
</style>
