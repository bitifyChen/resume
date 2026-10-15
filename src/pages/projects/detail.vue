<script setup>
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { findProject } from '@/data/projects'
  import { asset } from '@/utils/format'
  import AppIcon from '@/components/Shared/AppIcon.vue'
  const route = useRoute()
  const project = computed(() => findProject(route.params.slug))
</script>

<template>
  <main v-if="project" id="main-content" class="project-detail page-container">
    <RouterLink class="back-link" to="/">
      <AppIcon name="ArrowLeft" :size="16" />
      所有產品案例
    </RouterLink>
    <section class="case-heading">
      <p class="eyebrow">{{ project.english }}</p>
      <h1>{{ project.title }}</h1>
      <p>{{ project.subtitle }}</p>
      <RouterLink :to="project.demo" class="button primary">
        開啟互動展示
        <AppIcon name="ArrowRight" :size="18" />
      </RouterLink>
    </section>
    <figure class="case-cover">
      <img :src="asset(project.image)" :alt="project.imageAlt" width="1672" height="941" />
      <figcaption>{{ project.coverNote }}</figcaption>
    </figure>
    <section class="case-content">
      <aside class="case-meta">
        <span>我的角色</span>
        <h2>{{ project.role }}</h2>
        <p>{{ project.summary }}</p>
        <div class="stack-labels">
          <span>Vue 3</span>
          <span>Pinia</span>
          <span>Vue Query</span>
        </div>
      </aside>
      <div class="case-body">
        <h2>我負責的範圍</h2>
        <ul>
          <li v-for="item in project.responsibilities" :key="item">{{ item }}</li>
        </ul>
        <h2>要解決的問題</h2>
        <p>{{ project.challenge }}</p>
        <h2>我的實作方式</h2>
        <p>{{ project.approach }}</p>
        <h2>這次展示能看到什麼</h2>
        <ul>
          <li v-for="item in project.outcomes" :key="item">{{ item }}</li>
        </ul>
      </div>
    </section>
    <section class="walkthrough">
      <h2>可以試試這條流程</h2>
      <div class="walkthrough-grid">
        <article v-for="step in project.steps" :key="step.title">
          <AppIcon name="ArrowRight" :size="24" />
          <h3>{{ step.title }}</h3>
          <p>{{ step.description }}</p>
        </article>
      </div>
      <RouterLink :to="project.demo" class="button primary">
        開啟互動展示
        <AppIcon name="ArrowRight" :size="18" />
      </RouterLink>
    </section>
    <section class="case-engineering">
      <h2>程式怎麼組織</h2>
      <ul>
        <li v-for="item in project.engineering" :key="item">{{ item }}</li>
      </ul>
      <p class="boundary-note">{{ project.boundary }}</p>
    </section>
  </main>
  <main v-else id="main-content" class="page-container not-found">
    <h1>找不到這個專案。</h1>
    <RouterLink to="/" class="button primary">返回首頁</RouterLink>
  </main>
</template>
