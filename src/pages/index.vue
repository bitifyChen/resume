<script setup>
  import { computed, ref } from 'vue'
  import { caseStudies, projects, sideProjects } from '@/data/portfolio'
  import AppIcon from '@/components/Shared/AppIcon.vue'
  import CaseStudyIndex from '@/components/Showcase/CaseStudyIndex.vue'
  import HomeAbout from '@/components/Showcase/HomeAbout.vue'
  import ProjectTile from '@/components/Showcase/ProjectTile.vue'
  import { usePortfolioStore } from '@/store/usePortfolioStore'
  import { sortSideProjects } from '@/utils/portfolio'

  const disclosure = '保留產品操作結構，以虛構品牌與資料重製；不提供公司原始碼或內部服務。'
  const portfolioStore = usePortfolioStore()
  const showLegacyWorkDialog = ref(false)
  const sortedSideProjects = computed(() => sortSideProjects(sideProjects))
  const sortedCaseStudies = computed(() => {
    const projectOrder = new Map(projects.map((project, index) => [project.id, index]))
    return [...caseStudies].sort((a, b) => {
      const featuredOrder = Number(Boolean(b.featured)) - Number(Boolean(a.featured))
      const typeOrder =
        portfolioStore.caseStudySort === 'type'
          ? Number(a.type === 'feature') - Number(b.type === 'feature')
          : 0
      return (
        featuredOrder ||
        typeOrder ||
        projectOrder.get(a.projectId) - projectOrder.get(b.projectId) ||
        a.order - b.order
      )
    })
  })
</script>

<template>
  <main id="main-content" class="portfolio-index page-container">
    <HomeAbout />
    <section id="case-study" class="portfolio-section" aria-labelledby="case-study-title">
      <header class="portfolio-section-heading portfolio-section-heading-case">
        <div>
          <h2 id="case-study-title">Case Study</h2>
          <p>{{ disclosure }}</p>
        </div>
        <div class="case-study-sort" role="group" aria-label="Case Study 排序">
          <span class="case-study-sort-icon" aria-hidden="true">
            <AppIcon name="Sort" :size="17" />
          </span>
          <button
            type="button"
            :aria-pressed="portfolioStore.caseStudySort !== 'type'"
            @click="portfolioStore.caseStudySort = 'project'"
          >
            專案
          </button>
          <button
            type="button"
            :aria-pressed="portfolioStore.caseStudySort === 'type'"
            @click="portfolioStore.caseStudySort = 'type'"
          >
            類型
          </button>
        </div>
      </header>
      <CaseStudyIndex v-if="caseStudies.length" :studies="sortedCaseStudies" />
      <p v-else class="portfolio-empty">案例整理中。</p>
    </section>
    <section id="selected-work" class="portfolio-section" aria-labelledby="project-title">
      <header class="portfolio-section-heading">
        <h2 id="project-title">Project</h2>
        <p>{{ disclosure }}</p>
      </header>
      <div v-if="projects.length" class="project-entries">
        <ProjectTile
          v-for="project in projects"
          :key="project.id"
          :project="project"
        />
      </div>
      <p v-else class="portfolio-empty">專案整理中。</p>
    </section>
    <section id="side-project" class="portfolio-section" aria-labelledby="side-project-title">
      <header class="portfolio-section-heading portfolio-section-heading-case">
        <div class="portfolio-section-title">
          <h2 id="side-project-title">Side Project</h2>
          <span class="portfolio-section-period">2023→Now</span>
        </div>
      </header>
      <TransitionGroup
        v-if="sideProjects.length"
        name="project-order"
        tag="div"
        class="project-entries"
      >
        <ProjectTile
          v-for="project in sortedSideProjects"
          :key="project.id"
          :project="project"
          collection="side-project"
        />
      </TransitionGroup>
      <p v-else class="portfolio-empty">之後新增。</p>
    </section>
    <section id="more-side-project" class="portfolio-section" aria-labelledby="more-side-project-title">
      <header class="portfolio-section-heading">
        <div class="portfolio-section-title">
          <h2 id="more-side-project-title">More Side Project</h2>
          <span class="portfolio-section-period">Before→2023</span>
        </div>
      </header>
      <button
        type="button"
        class="button primary legacy-work-trigger"
        aria-haspopup="dialog"
        @click="showLegacyWorkDialog = true"
      >
        前往瀏覽過往作品
        <AppIcon name="ArrowRight" :size="16" />
      </button>
    </section>

    <el-dialog
      v-model="showLegacyWorkDialog"
      title="即將離開本站"
      width="min(480px, calc(100vw - 32px))"
      class="legacy-link-dialog"
      align-center
    >
      <div class="legacy-link-dialog__content">
        <p>你即將前往 Chenchen Workshop，瀏覽 2023 年以前的作品。</p>
        <p class="legacy-link-dialog__destination">chenchenworkshop.com/project</p>
      </div>
      <template #footer>
        <div class="legacy-link-dialog__actions">
          <button type="button" class="button secondary" @click="showLegacyWorkDialog = false">
            留在本站
          </button>
          <a
            class="button primary"
            href="https://chenchenworkshop.com/project"
            target="_blank"
            rel="noopener noreferrer"
            @click="showLegacyWorkDialog = false"
          >
            前往過往作品
            <AppIcon name="ArrowRight" :size="16" />
          </a>
        </div>
      </template>
    </el-dialog>
  </main>
</template>
