<script setup>
  import zhTw from 'element-plus/es/locale/lang/zh-tw'
  import SiteHeader from '@/components/Showcase/SiteHeader.vue'
  import { scrollToElement } from '@/utils/dom'

  document.documentElement.dataset.product = ''
  document.documentElement.dataset.theme = 'light'
  document.documentElement.classList.remove('dark')
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
    <SiteHeader v-if="!$route.meta.localEditor" />
    <RouterView />
    <footer v-if="!$route.meta.localEditor" class="site-footer page-container">
      <RouterLink to="/" class="wordmark">
        Chenchen
        <span class="wordmark-divider">/</span>
      </RouterLink>
      <p>公司專案為去識別重製；Side Project 使用個人作品實際內容。</p>
    </footer>
  </el-config-provider>
</template>
