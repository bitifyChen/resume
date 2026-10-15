<script setup>
  import { projects } from '@/data/projects'
  import { asset } from '@/utils/format'
  import AppIcon from '@/components/Shared/AppIcon.vue'
</script>

<template>
  <main id="main-content" class="showcase-home page-container">
    <section class="work-intro">
      <p>Chenchen / Frontend Developer</p>
      <h1>
        讓實際做過的產品，
        <br />
        說明我的開發能力。
      </h1>
      <div class="work-intro-description">
        <p>從消費者購物，到客服與門店每天使用的工作工具。</p>
        <p>三個獨立案例，保留原產品的介面結構與操作邏輯，以假資料開放體驗。</p>
      </div>
    </section>
    <section id="selected-work" class="work-section">
      <div class="section-title"><h2>Projects</h2></div>
      <div class="work-projects">
        <article v-for="project in projects" :key="project.slug" class="work-project">
          <RouterLink :to="project.demo" class="work-preview" :aria-label="`體驗${project.title}`">
            <img
              :src="asset(project.image)"
              :alt="project.imageAlt"
              width="1440"
              height="900"
              loading="lazy"
            />
          </RouterLink>
          <div class="work-project-text">
            <p class="work-role">{{ project.role }}</p>
            <h3>{{ project.title }}</h3>
            <p class="work-summary">{{ project.summary }}</p>
            <div class="work-project-links">
              <RouterLink :to="project.demo">
                開啟展示
                <AppIcon name="ArrowRight" :size="15" />
              </RouterLink>
              <RouterLink :to="`/projects/${project.slug}`">閱讀案例</RouterLink>
            </div>
          </div>
        </article>
      </div>
    </section>
    <section class="work-practice">
      <h2>不只列功能，也說明怎麼完成。</h2>
      <div>
        <p>每個案例分別說明負責範圍、遇到的問題、實作決策，以及可以親自操作的代表流程。</p>
        <p>商城後台與 POS 後台是兩套不同產品。聊天工作台與可調整看板，則是這次展示的重點。</p>
      </div>
    </section>
    <aside class="disclosure">
      <strong>公開展示的範圍</strong>
      <p>
        依開發經驗重新實作，替換公司品牌、會員、商品、交易及營運資料。不提供公司原始碼、內部
        API、帳號或正式環境存取；案例中的模擬限制另有標示。
      </p>
    </aside>
  </main>
</template>
