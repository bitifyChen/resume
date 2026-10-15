<script setup>
  import { watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { useSessionStore } from '@/store/useSessionStore'
  import zhTw from 'element-plus/es/locale/lang/zh-tw'
  import SiteHeader from '@/components/Showcase/SiteHeader.vue'
  import { scrollToElement } from '@/utils/dom'
  const session = useSessionStore()
  const route = useRoute()
  watch(
    () => [route.meta.demo, route.meta.system, session.theme],
    ([demo, system]) => {
      document.documentElement.dataset.product = demo ? system || 'storefront' : ''
      document.documentElement.classList.toggle('dark', !demo && session.isDark)
    },
    { immediate: true }
  )
</script>

<template>
  <el-config-provider :locale="zhTw">
    <a
      class="skip-link"
      href="#main-content"
      @click.prevent="scrollToElement('main-content', true)"
    >
      跳至主要內容
    </a>
    <SiteHeader v-if="!$route.meta.demo" />
    <RouterView />
    <footer v-if="!$route.meta.demo" class="site-footer page-container">
      <RouterLink to="/" class="wordmark">
        Chenchen
        <span>/</span>
      </RouterLink>
      <p>獨立重製介面，所有展示資料皆為虛構。</p>
      <button class="text-button" @click="session.toggleTheme">
        {{ session.isDark ? '切換淺色' : '切換深色' }}
      </button>
    </footer>
  </el-config-provider>
</template>
