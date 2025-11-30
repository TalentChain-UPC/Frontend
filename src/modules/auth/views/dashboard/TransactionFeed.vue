<template>
  <div class="transaction-feed">
    <h3>Últimas Transacciones</h3>

    <div v-if="transactions.length === 0">
      No hay transacciones recientes.
    </div>

    <table v-else class="transaction-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Hash</th>
          <th>Monto (monedas)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="trx in transactions" :key="trx.id">
          <td>#{{ trx.id || "?" }}</td>
          <td><code>{{ trx.transactionId || "N/A" }}</code></td>
          <td>{{ trx.amount }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import Stomp from 'stompjs'

const authStore = useAuthStore()
const transactions = ref([])

let stompClient = null

onMounted(() => {
  const companyId = authStore.user?.company_id
  if (!companyId) {
    console.warn('No hay company_id disponible.')
    return
  }

  const socket = new WebSocket('ws://34.39.178.54/ws')
  stompClient = Stomp.over(socket)

  stompClient.connect({}, () => {
    console.log("Conectado a WebSocket")

    stompClient.subscribe(`/topic/transactions/${companyId}`, (message) => {
      const trx = JSON.parse(message.body)
      console.log("Mensaje recibido:", trx)

      transactions.value.unshift(trx)
      if (transactions.value.length > 10) {
        transactions.value.pop()
      }
    })
  }, (error) => {
    console.error("Error de conexión:", error)
  })
})

onUnmounted(() => {
  if (stompClient) {
    stompClient.disconnect(() => {
      console.log("Desconectado del WebSocket")
    })
  }
})
</script>

<style scoped>
.transaction-feed {
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
}

.transaction-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.transaction-table th,
.transaction-table td {
  border: 1px solid #ddd;
  padding: 0.5rem;
  text-align: left;
}

.transaction-table th {
  background-color: #ffffff;
  color: #000000;
}

.transaction-table tr:nth-child(even) {
  background-color: #f0f0f0;
}

.transaction-table code {
  background: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  font-size: 0.9em;
}
</style>
