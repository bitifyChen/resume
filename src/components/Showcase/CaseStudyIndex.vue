<script setup>
  import { caseStudyLocation } from '@/utils/portfolio'
  import AppIcon from '@/components/Shared/AppIcon.vue'
  defineProps({ studies: { type: Array, required: true } })
</script>

<template>
  <ul class="case-study-index">
    <li v-for="study in studies" :key="study.id">
      <RouterLink :to="caseStudyLocation(study)">
        <span>
          <small>{{ study.project.title }}</small>
          <strong>{{ study.title }}</strong>
        </span>
        <AppIcon name="ArrowRight" :size="20" />
      </RouterLink>
    </li>
  </ul>
</template>
