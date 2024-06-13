import { defineStore } from 'pinia'
import { onMounted, ref } from 'vue'
import axios from 'axios'

async function getCount() {
  const response = await axios.get<{ count: number }>('/api/count', { responseType: 'json' })
  return response.data.count || 0
}

async function getClient() {
  const response = await axios.get<string[]>('/api/client', { responseType: 'json' })
  return response.data || []
}

export const useStatusStore = defineStore('status', () => {
  const clients = ref<string[]>([])
  const count = ref(0)

  async function refresh() {
    clients.value = await getClient().catch(() => [])
    count.value = await getCount().catch(() => 0)
  }

  onMounted(async () => {
    refresh()
    setInterval(refresh, 1000 * 60)
  })

  return {
    clients,
    count,
  }
})
