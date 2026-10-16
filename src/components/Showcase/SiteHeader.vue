<script setup>
  import AppIcon from '@/components/Shared/AppIcon.vue'
</script>

<template>
  <header class="site-header page-container">
    <RouterLink to="/" class="wordmark" aria-label="Chenchen 展示首頁">
      Chenchen
      <span>/</span>
    </RouterLink>
    <nav aria-label="主要導覽">
      <RouterLink to="/">作品總覽</RouterLink>
      <a href="https://chenchenworkshop.com/project" target="_blank" rel="noopener noreferrer">
        過往作品
        <AppIcon name="ArrowRight" :size="14" />
      </a>
    </nav>
  </header>
</template>
