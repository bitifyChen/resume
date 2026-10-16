import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import '@fontsource-variable/manrope'
import App from './App.vue'
import router from './router'
import './assets/styles/main.scss'

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000, retry: false, refetchOnWindowFocus: false } }
})

createApp(App).use(createPinia()).use(router).use(VueQueryPlugin, { queryClient }).mount('#app')
