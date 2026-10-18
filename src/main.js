import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import '@fontsource-variable/manrope'
import 'element-plus/theme-chalk/el-message-box.css'
import App from './App.vue'
import router from './router'
import { initializeAnalytics } from './utils/analytics'
import './assets/styles/main.scss'

initializeAnalytics(import.meta.env.VITE_GA_MEASUREMENT_ID, import.meta.env.PROD)

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000, retry: false, refetchOnWindowFocus: false } }
})

createApp(App).use(createPinia()).use(router).use(VueQueryPlugin, { queryClient }).mount('#app')
