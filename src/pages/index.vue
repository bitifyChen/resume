<script setup>
  import { caseStudies, projects, sideProjects } from '@/data/portfolio'
  import CaseStudyIndex from '@/components/Showcase/CaseStudyIndex.vue'
  import ProjectTile from '@/components/Showcase/ProjectTile.vue'
</script>

<template>
  <main id="main-content" class="portfolio-index page-container">
    <section id="case-study" class="portfolio-section" aria-labelledby="case-study-title">
      <header class="portfolio-section-heading">
        <h1 id="case-study-title">Case Study</h1>
      </header>
      <CaseStudyIndex v-if="caseStudies.length" :studies="caseStudies" />
      <p v-else class="portfolio-empty">案例整理中。</p>
    </section>
    <section id="selected-work" class="portfolio-section" aria-labelledby="project-title">
      <header class="portfolio-section-heading">
        <h2 id="project-title">Project</h2>
      </header>
      <div v-if="projects.length" class="project-entries">
        <ProjectTile v-for="project in projects" :key="project.id" :project="project" />
      </div>
      <p v-else class="portfolio-empty">專案整理中。</p>
    </section>
    <section id="side-project" class="portfolio-section" aria-labelledby="side-project-title">
      <header class="portfolio-section-heading">
        <h2 id="side-project-title">Side Project</h2>
      </header>
      <div v-if="sideProjects.length" class="project-entries">
        <ProjectTile v-for="project in sideProjects" :key="project.id" :project="project" />
      </div>
      <p v-else class="portfolio-empty">之後新增。</p>
    </section>
    <aside class="portfolio-disclosure">
      <strong>關於展示</strong>
      <p>保留產品操作結構，以虛構品牌與資料重製；不提供公司原始碼或內部服務。</p>
    </aside>
  </main>
</template>
