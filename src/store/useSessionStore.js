import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSessionStore = defineStore('session', () => {
  const storeId = ref('s1')
  const roleId = ref('admin')
  const sidebarOpen = ref(false)
  return { storeId, roleId, sidebarOpen }
})
