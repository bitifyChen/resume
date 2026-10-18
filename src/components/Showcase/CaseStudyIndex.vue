<script setup>
  import { caseStudyLocation } from '@/utils/portfolio'
  import AppIcon from '@/components/Shared/AppIcon.vue'
  defineProps({ studies: { type: Array, required: true } })
</script>

<template>
  <TransitionGroup name="case-order" tag="ul" class="case-study-index">
    <li v-for="study in studies" :key="study.id">
      <RouterLink :to="caseStudyLocation(study, 'home')">
        <span class="case-study-meta-row">
          <span class="case-study-labels">
            <small v-for="project in study.projects || [study.project]" :key="project.id" class="case-study-project">
              {{ project.title }}
            </small>
            <small class="case-study-type">
              {{ study.type === 'feature' ? '新功能' : '解決問題' }}
            </small>
            <small v-if="study.kind === 'team-component'" class="case-study-kind">團隊元件</small>
          </span>
          <span v-if="study.featured" class="case-study-featured" role="img" aria-label="精選案例">
            <AppIcon name="StarFilled" :size="16" />
          </span>
        </span>
        <span class="case-study-content">
          <strong>{{ study.title }}</strong>
          <span v-if="study.subtitle" class="case-study-subtitle">{{ study.subtitle }}</span>
        </span>
        <AppIcon name="ArrowRight" :size="20" />
      </RouterLink>
    </li>
  </TransitionGroup>
</template>
