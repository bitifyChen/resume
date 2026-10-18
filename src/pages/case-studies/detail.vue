<script setup>
  import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { animate, stagger } from 'motion'
  import { findCaseStudyById, getProjectCases } from '@/data/portfolio'
  import { caseStudyLocation } from '@/utils/portfolio'
  import AppIcon from '@/components/Shared/AppIcon.vue'
  import IssueStudy from '@/components/Showcase/IssueStudy.vue'

  const route = useRoute()
  const pageRoot = ref(null)
  const issue = computed(() => findCaseStudyById(route.params.id))
  const project = computed(() => {
    if (route.query.from === 'project' && route.query.project) {
      const selected = issue.value?.projects?.find((item) => item.id === route.query.project)
      if (selected) return selected
    }
    return issue.value?.project
  })
  const studies = computed(() => getProjectCases(project.value?.id))
  const currentStudyIndex = computed(() =>
    studies.value.findIndex((study) => study.id === issue.value?.id)
  )
  const entrySource = computed(() => (route.query.from === 'home' ? 'home' : 'project'))
  const backLocation = computed(() =>
    entrySource.value === 'home' ? '/' : `/projects/${project.value.slug}`
  )
  const backLabel = computed(() =>
    entrySource.value === 'home' ? '返回首頁' : project.value?.title
  )
  const previousStudy = computed(() => studies.value[currentStudyIndex.value - 1])
  const nextStudy = computed(() => studies.value[currentStudyIndex.value + 1])
  let introAnimation

  async function playIntro() {
    introAnimation?.stop()
    await nextTick()

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const targets = pageRoot.value?.querySelectorAll('[data-page-intro]')
    if (!targets?.length) return

    introAnimation = animate(
      targets,
      {
        opacity: [0, 1],
        transform: ['translateY(16px)', 'translateY(0)']
      },
      {
        delay: stagger(0.07),
        duration: 0.52,
        ease: [0.22, 1, 0.36, 1]
      }
    )
  }

  watch(
    issue,
    (value) => {
      if (!value) return
      document.title = `${value.title} / ${value.project.title} / Chenchen`
      playIntro()
    },
    { immediate: true }
  )

  onBeforeUnmount(() => introAnimation?.stop())
</script>

<template>
  <main
    v-if="issue"
    id="main-content"
    ref="pageRoot"
    class="case-study-detail page-container"
  >
    <RouterLink :to="backLocation" class="project-back" data-page-intro>
      <AppIcon name="ArrowLeft" :size="16" />
      {{ backLabel }}
    </RouterLink>

    <header class="case-study-page-heading" data-page-intro>
      <div class="case-study-page-labels">
        <RouterLink
          v-for="linkedProject in issue.projects || [project]"
          :key="linkedProject.id"
          :to="`/projects/${linkedProject.slug}`"
          class="case-study-project-label"
        >
          {{ linkedProject.title }}
        </RouterLink>
        <span class="case-study-type-label">
          {{ issue.type === 'feature' ? '新功能' : '解決問題' }}
        </span>
        <span v-if="issue.kind === 'team-component'" class="case-study-kind-label">團隊元件</span>
      </div>
      <h1>{{ issue.title }}</h1>
      <p v-if="issue.subtitle" class="case-study-page-subtitle">{{ issue.subtitle }}</p>
      <p class="case-study-page-description">{{ issue.description }}</p>
    </header>

    <div class="case-study-page-content">
      <IssueStudy :key="issue.id" :issue="issue" :show-heading="false" />

      <nav
        v-if="previousStudy || nextStudy"
        class="case-study-pagination"
        aria-label="同專案案例"
      >
        <RouterLink
          v-if="previousStudy"
          class="case-study-pagination-link is-previous"
          :to="caseStudyLocation(previousStudy, entrySource, entrySource === 'project' ? project.id : undefined)"
        >
          <AppIcon name="ArrowLeft" :size="20" />
          <span>
            <small>上一個議題</small>
            <strong>{{ previousStudy.title }}</strong>
          </span>
        </RouterLink>
        <RouterLink
          v-if="nextStudy"
          class="case-study-pagination-link is-next"
          :to="caseStudyLocation(nextStudy, entrySource, entrySource === 'project' ? project.id : undefined)"
        >
          <span>
            <small>下一個議題</small>
            <strong>{{ nextStudy.title }}</strong>
          </span>
          <AppIcon name="ArrowRight" :size="20" />
        </RouterLink>
      </nav>
    </div>
  </main>
  <main v-else id="main-content" class="page-container not-found">
    <h1>找不到這個案例。</h1>
    <RouterLink to="/" class="button primary">返回作品總覽</RouterLink>
  </main>
</template>
