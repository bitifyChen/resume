<script setup>
  import { computed, nextTick, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { comparisonNote } from '@/data/caseStudies'
  import { findProject, findCaseStudy, getProjectCases } from '@/data/portfolio'
  import AppIcon from '@/components/Shared/AppIcon.vue'
  import IssueStudy from '@/components/Showcase/IssueStudy.vue'
  import { scrollToElement } from '@/utils/dom'
  const route = useRoute()
  const project = computed(() => findProject(route.params.slug))
  const studies = computed(() => getProjectCases(project.value?.id))
  const issue = computed(() => findCaseStudy(project.value, route.query.issue))
  const nextIssue = computed(() => {
    const index = studies.value.indexOf(issue.value)
    return studies.value[index + 1]
  })
  watch(
    issue,
    (value) => {
      if (value) document.title = `${value.title} / ${project.value.title} / Chenchen`
    },
    { immediate: true }
  )
  watch(
    () => route.query.issue,
    async () => {
      await nextTick()
      scrollToElement('main-content', true)
    }
  )
</script>

<template>
  <main v-if="project" id="main-content" class="project-case page-container">
    <RouterLink to="/" class="project-back">
      <AppIcon name="ArrowLeft" :size="16" />
      Case Study
    </RouterLink>
    <header class="project-case-heading">
      <h1>{{ project.title }}</h1>
      <p>{{ project.summary }}</p>
      <div class="project-case-meta">
        <span>{{ project.role }}</span>
        <span>Vue / JavaScript</span>
      </div>
    </header>
    <div class="project-case-layout">
      <aside class="project-contents">
        <nav aria-label="案例議題">
          <p>解決的議題</p>
          <RouterLink
            v-for="item in studies"
            :key="item.id"
            :to="{ path: `/projects/${project.slug}`, query: { issue: item.id } }"
            :aria-current="issue?.id === item.id ? 'page' : undefined"
            :class="{ active: issue?.id === item.id }"
          >
            <strong>{{ item.title }}</strong>
            <small>{{ item.teaser }}</small>
          </RouterLink>
        </nav>
        <p class="comparison-disclaimer">{{ comparisonNote }}</p>
      </aside>
      <div class="project-issue-content">
        <IssueStudy v-if="issue" :key="`${project.slug}-${issue.id}`" :issue="issue" />
        <p v-else>案例整理中。</p>
        <RouterLink
          v-if="nextIssue"
          class="next-issue"
          :to="{ path: `/projects/${project.slug}`, query: { issue: nextIssue.id } }"
        >
          <span>
            <small>下一個議題</small>
            <strong>{{ nextIssue.title }}</strong>
          </span>
          <AppIcon name="ArrowRight" :size="20" />
        </RouterLink>
        <details class="project-scope">
          <summary>負責範圍與展示限制</summary>
          <ul>
            <li v-for="item in project.responsibilities" :key="item">{{ item }}</li>
          </ul>
          <p>{{ project.boundary }}</p>
        </details>
      </div>
    </div>
  </main>
  <main v-else id="main-content" class="page-container not-found">
    <h1>找不到這個專案。</h1>
    <RouterLink to="/" class="button primary">返回 Projects</RouterLink>
  </main>
</template>
