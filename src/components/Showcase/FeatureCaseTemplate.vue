<script setup>
  import CaseImplementationDetails from '@/components/Showcase/CaseImplementationDetails.vue'
  import CaseStudyShowcase from '@/components/Showcase/CaseStudyShowcase.vue'

  defineProps({ issue: { type: Object, required: true } })
</script>

<template>
  <CaseImplementationDetails :issue="issue" />
  <CaseStudyShowcase>
    <slot name="showcase" />
  </CaseStudyShowcase>
</template>
