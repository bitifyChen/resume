<script setup>
  import { projects } from '@/data/projects'
  import { asset } from '@/utils/format'
  import AppIcon from '@/components/Shared/AppIcon.vue'
  import { scrollToElement } from '@/utils/dom'
  const ordered = [projects[1], projects[0], projects[2]]
</script>

<template>
  <main id="main-content" class="showcase-home page-container">
    <section class="home-hero">
      <div class="hero-copy">
        <p class="eyebrow">Product engineering by Chenchen</p>
        <h1>
          讓產品流程，
          <br />
          真正運作起來。
        </h1>
        <p class="hero-intro">
          商城、營運後台、POS。
          <br />
          從消費者體驗，到團隊每天使用的工作工具。
        </p>
        <a
          href="#selected-work"
          class="button primary"
          @click.prevent="scrollToElement('selected-work')"
        >
          瀏覽產品案例
          <AppIcon name="ArrowDown" :size="18" />
        </a>
      </div>
      <figure class="hero-visual">
        <img
          :src="asset('images/commerce-admin.png')"
          alt="客服與營運工作台概念圖"
          width="1672"
          height="941"
          fetchpriority="high"
        />
        <figcaption>營運與客服工作台 / 概念示意</figcaption>
      </figure>
    </section>

    <section id="selected-work" class="work-section">
      <div class="section-title">
        <h2>三套系統，三種工作場景。</h2>
        <span>Selected work</span>
      </div>
      <div class="project-grid">
        <RouterLink
          v-for="(project, index) in ordered"
          :key="project.slug"
          :to="`/projects/${project.slug}`"
          class="project-tile"
          :class="{ featured: index === 0 }"
        >
          <div class="tile-image">
            <img
              :src="asset(project.image)"
              :alt="project.imageAlt"
              loading="lazy"
              width="1672"
              height="941"
            />
          </div>
          <div class="tile-copy">
            <span class="project-category">{{ project.category }}</span>
            <h3>
              {{ project.title }}
              <AppIcon name="ArrowRight" :size="25" />
            </h3>
            <p>{{ project.summary }}</p>
            <span class="tile-link">查看案例與互動展示</span>
          </div>
        </RouterLink>
      </div>
    </section>

    <section class="engineering-note">
      <AppIcon name="Collection" :size="36" />
      <div>
        <h2>讓操作，替能力說話。</h2>
        <p>
          每個案例包含我的負責範圍、開發思考與可操作的展示版。你可以建立一筆訂單、接手客服會話，或調整門店庫存。
        </p>
      </div>
      <div class="stack-labels">
        <span>Vue 3</span>
        <span>JavaScript</span>
        <span>Pinia</span>
        <span>Element Plus</span>
        <span>Vue Query</span>
      </div>
    </section>
    <aside class="disclosure">
      <strong>關於這份展示</strong>
      <p>
        依實務開發經驗獨立重製，使用虛構品牌與資料。功能範圍及模擬限制皆於案例頁說明；不包含公司原始碼、API
        或真實營運資料。
      </p>
    </aside>
  </main>
</template>
