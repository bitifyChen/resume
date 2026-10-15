<script setup>
  import { useSessionStore } from '@/store/useSessionStore'
  import AppIcon from '@/components/Shared/AppIcon.vue'
  const session = useSessionStore()
</script>

<template>
  <header class="site-header page-container">
    <RouterLink to="/" class="wordmark" aria-label="Chenchen 展示首頁">
      Chenchen
      <span>/</span>
    </RouterLink>
    <nav aria-label="主要導覽">
      <RouterLink to="/">產品工程案例</RouterLink>
      <a href="https://chenchenworkshop.com/project" target="_blank" rel="noopener noreferrer">
        過往作品
        <AppIcon name="ArrowRight" :size="14" />
      </a>
    </nav>
    <button
      class="icon-button"
      :aria-label="session.isDark ? '切換淺色' : '切換深色'"
      @click="session.toggleTheme"
    >
      <AppIcon :name="session.isDark ? 'Sunny' : 'Moon'" />
    </button>
  </header>
</template>
