<script setup>
  import { computed, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { findProject, findSideProject, getProjectCases } from '@/data/portfolio'
  import { caseStudyLocation } from '@/utils/portfolio'
  import { sortTechnologies } from '@/utils/technologyOrder'
  import { asset } from '@/utils/format'
  import sideProjectGalleries from 'virtual:side-project-galleries'
  import AppIcon from '@/components/Shared/AppIcon.vue'
  import HighlightText from '@/components/Shared/HighlightText.vue'
  import SideProjectGallery from '@/components/Showcase/SideProjectGallery.vue'
  import ContentStatusBadge from '@/components/Showcase/ContentStatusBadge.vue'

  const route = useRoute()
  const isSideProject = computed(() => route.name === 'SideProject')
  const project = computed(() =>
    isSideProject.value ? findSideProject(route.params.slug) : findProject(route.params.slug)
  )
  const studies = computed(() => (isSideProject.value ? [] : getProjectCases(project.value?.id)))
  const orderedHighlights = computed(() =>
    [...(project.value?.highlights || [])].sort(
      (a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured))
    )
  )
  const sideProjectGallery = computed(() => {
    if (!project.value) return []

    const projectImages = sideProjectGalleries[project.value.slug] || []
    if (projectImages.length) {
      const configuredImages = new Map((project.value.gallery || []).map((image) => [image.src, image]))
      const configuredOrder = new Map(
        (project.value.gallery || []).map((image, index) => [image.src, index])
      )

      return [...projectImages]
        .sort(
          (a, b) =>
            (configuredOrder.get(a.src) ?? Number.MAX_SAFE_INTEGER) -
            (configuredOrder.get(b.src) ?? Number.MAX_SAFE_INTEGER)
        )
        .map((image, index) =>
          configuredImages.get(image.src) || {
            ...image,
            alt:
              index === 0
                ? project.value.imageAlt
                : `${project.value.title} 專案畫面 ${index + 1}`
          }
        )
    }

    if (project.value.gallery?.length) return project.value.gallery
    if (!project.value.image) return []

    return [
      {
        src: project.value.image,
        alt: project.value.imageAlt
      }
    ]
  })

  watch(
    [project, isSideProject],
    ([value, sideProject]) => {
      if (value) {
        const category = sideProject ? 'Side Project' : 'Project'
        document.title = `${value.title} / ${category} / Chenchen`
      }
    },
    { immediate: true }
  )
</script>

<template>
  <main v-if="project" id="main-content" class="project-detail page-container">
    <RouterLink to="/" class="project-back">
      <AppIcon name="ArrowLeft" :size="16" />
      {{ isSideProject ? 'Side Projects' : 'Projects' }}
    </RouterLink>

    <section class="project-overview" aria-labelledby="project-title">
      <SideProjectGallery
        v-if="isSideProject"
        class="project-overview-visual"
        :images="sideProjectGallery"
        :title="project.title"
      />
      <figure v-else class="project-overview-visual">
        <img :src="asset(project.image)" :alt="project.imageAlt" width="1440" height="900" />
      </figure>
      <div class="project-overview-copy">
        <h1 id="project-title">{{ project.title }}</h1>
        <ContentStatusBadge
          v-if="isSideProject"
          class="project-detail-status"
          :status="project.contentStatus"
        />
        <HighlightText tag="p" class="project-overview-summary" :text="project.summary" />
        <p class="project-overview-role" :class="{ 'is-emphasized': project.roleEmphasis }">
          <span>Role</span>
          <strong>{{ project.role }}</strong>
        </p>
        <section
          v-if="isSideProject && (project.architecture || project.technologies?.length)"
          class="project-overview-skills"
          aria-label="Skills"
        >
          <span>Skills</span>
          <div>
            <HighlightText v-if="project.architecture" tag="p" :text="project.architecture" />
            <ul v-if="project.technologies?.length" class="side-project-technologies">
              <li v-for="technology in sortTechnologies(project.technologies)" :key="technology">
                {{ technology }}
              </li>
            </ul>
          </div>
        </section>
        <div
          v-if="isSideProject && (project.liveUrl || project.repositoryUrl)"
          class="project-overview-links"
        >
          <a
            v-if="project.liveUrl"
            class="button primary"
            :href="project.liveUrl"
            target="_blank"
            rel="noreferrer"
          >
            開啟網站
            <AppIcon name="ArrowRight" :size="16" />
          </a>
          <a
            v-if="project.repositoryUrl"
            class="button secondary"
            :href="project.repositoryUrl"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </div>
      </div>
    </section>

    <section
      v-if="project.description"
      class="project-detail-section project-detail-intro"
      aria-labelledby="project-description-title"
    >
      <header>
        <h2 id="project-description-title">專案說明</h2>
      </header>
      <HighlightText tag="p" class="project-detail-description-copy" :text="project.description" />
      <aside v-if="!isSideProject && project.boundary" class="project-detail-disclosure">
        <strong>展示範圍</strong>
        <p>{{ project.boundary }}</p>
      </aside>
    </section>

    <section
      v-if="isSideProject && project.highlights?.length"
      class="project-detail-section side-project-highlights"
      aria-labelledby="side-project-highlights-title"
    >
      <header>
        <h2 id="side-project-highlights-title">實作亮點</h2>
      </header>
      <dl class="case-story-list">
        <div v-for="item in orderedHighlights" :key="item.id">
          <dt>
            <HighlightText :text="item.title" :highlight-all="item.featured" />
          </dt>
          <dd>
            <HighlightText tag="p" :text="item.text" />
            <ul v-if="item.technologies?.length" class="side-project-inline-technologies">
              <li v-for="technology in sortTechnologies(item.technologies)" :key="technology">
                {{ technology }}
              </li>
            </ul>
          </dd>
        </div>
      </dl>
    </section>

    <section
      v-if="!isSideProject && project.ownership?.length"
      class="project-detail-section project-detail-ownership"
      aria-labelledby="project-ownership-title"
    >
      <header>
        <h2 id="project-ownership-title">我負責什麼項目</h2>
      </header>
      <dl class="case-story-list">
        <div v-for="item in project.ownership" :key="item.label">
          <dt>{{ item.label }}</dt>
          <dd>{{ item.text }}</dd>
        </div>
      </dl>
    </section>

    <section
      v-if="!isSideProject"
      class="project-detail-section"
      aria-labelledby="project-cases-title"
    >
      <header>
        <h2 id="project-cases-title">Case Study</h2>
      </header>
      <ul v-if="studies.length" class="project-detail-case-list">
        <li v-for="study in studies" :key="study.id">
          <RouterLink :to="caseStudyLocation(study, 'project', project.id)">
            <span>
              <span class="project-detail-case-title">
                <strong>{{ study.title }}</strong>
                <em v-if="study.kind === 'team-component'">團隊元件</em>
              </span>
              <small>{{ study.subtitle || study.teaser }}</small>
            </span>
            <AppIcon name="ArrowRight" :size="20" />
          </RouterLink>
        </li>
      </ul>
      <p v-else class="portfolio-empty">案例整理中。</p>
    </section>

    <section
      v-if="!isSideProject && !project.ownership?.length"
      class="project-detail-section project-detail-scope"
      aria-labelledby="project-scope-title"
    >
      <header>
        <h2 id="project-scope-title">負責範圍</h2>
      </header>
      <ul>
        <li v-for="item in project.responsibilities" :key="item">{{ item }}</li>
      </ul>
      <div class="project-detail-boundary">
        <strong>展示範圍</strong>
        <p>{{ project.boundary }}</p>
      </div>
    </section>
  </main>
  <main v-else id="main-content" class="page-container not-found">
    <h1>找不到這個專案。</h1>
    <RouterLink to="/" class="button primary">返回 Projects</RouterLink>
  </main>
</template>
