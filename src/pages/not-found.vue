<script setup>
  import AppIcon from '@/components/Shared/AppIcon.vue'
</script>

<template>
  <main id="main-content" class="page-container not-found-page">
    <section class="not-found-layout" aria-labelledby="not-found-title">
      <p class="not-found-code" aria-hidden="true">404</p>
      <div class="not-found-content">
        <p class="not-found-eyebrow">PAGE NOT FOUND</p>
        <h1 id="not-found-title">找不到這個頁面</h1>
        <p class="not-found-description">
          網址可能已變更，或這個頁面不存在。回到作品總覽，繼續瀏覽 Case Study 與 Projects。
        </p>
        <RouterLink to="/" class="button primary">
          回到作品總覽
          <AppIcon name="ArrowRight" :size="16" />
        </RouterLink>
      </div>
    </section>
  </main>
</template>
