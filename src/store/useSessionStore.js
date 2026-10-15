import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

function initialTheme() {
  try {
    const saved = localStorage.getItem('resume-theme')
    if (['light', 'dark'].includes(saved)) return saved
  } catch {
    /* Storage can be disabled in private browsing. */
  }
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export const useSessionStore = defineStore('session', () => {
  const theme = ref(initialTheme())
  const storeId = ref('s1')
  const roleId = ref('admin')
  const sidebarOpen = ref(false)
  const isDark = computed(() => theme.value === 'dark')
  watch(
    theme,
    (value) => {
      document.documentElement.dataset.theme = value
      document.documentElement.classList.toggle('dark', value === 'dark')
      try {
        localStorage.setItem('resume-theme', value)
      } catch {
        /* The active theme still works without persistence. */
      }
    },
    { immediate: true }
  )
  const toggleTheme = () => {
    theme.value = isDark.value ? 'light' : 'dark'
  }
  return { theme, isDark, storeId, roleId, sidebarOpen, toggleTheme }
})
