<script setup>
  import { projects } from '@/data/projects'
  import { asset } from '@/utils/format'
  import AppIcon from '@/components/Shared/AppIcon.vue'
</script>

<template>
  <main id="main-content" class="portfolio-index page-container">
    <header class="projects-intro">
      <p>前端開發 / 實務案例</p>
      <h1>projects.</h1>
      <p>從專案進入，看我處理過的問題。</p>
    </header>
    <div id="selected-work" class="project-entries">
      <article
        v-for="project in projects"
        :key="project.slug"
        class="project-entry"
        :class="`entry-${project.slug}`"
      >
        <RouterLink
          :to="`/projects/${project.slug}`"
          class="project-entry-preview"
          :aria-label="`檢視${project.title}案例`"
        >
          <img
            :src="asset(project.image)"
            :alt="project.imageAlt"
            width="1440"
            height="900"
            :loading="project.slug === 'commerce-admin' ? 'eager' : 'lazy'"
            :fetchpriority="project.slug === 'commerce-admin' ? 'high' : 'auto'"
          />
        </RouterLink>
        <div class="project-entry-content">
          <p class="project-entry-role">{{ project.role }}</p>
          <h2>
            <RouterLink :to="`/projects/${project.slug}`">{{ project.title }}</RouterLink>
          </h2>
          <p class="project-entry-summary">{{ project.summary }}</p>
          <ul class="project-entry-issues">
            <li v-for="issue in project.issues" :key="issue.id">
              <RouterLink :to="{ path: `/projects/${project.slug}`, query: { issue: issue.id } }">
                <span>
                  <strong>{{ issue.title }}</strong>
                  <small>{{ issue.teaser }}</small>
                </span>
                <AppIcon name="ArrowRight" :size="18" />
              </RouterLink>
            </li>
          </ul>
        </div>
      </article>
    </div>
    <aside class="portfolio-disclosure">
      <strong>關於展示</strong>
      <p>保留產品操作結構，以虛構品牌與資料重製；不提供公司原始碼或內部服務。</p>
    </aside>
  </main>
</template>
