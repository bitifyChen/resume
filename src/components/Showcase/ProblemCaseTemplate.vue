<script setup>
  import CaseComparison from '@/components/Showcase/CaseComparison.vue'
  import CaseImplementationDetails from '@/components/Showcase/CaseImplementationDetails.vue'
  import CaseProblemSummary from '@/components/Showcase/CaseProblemSummary.vue'
  import CaseStudyShowcase from '@/components/Showcase/CaseStudyShowcase.vue'

  defineProps({ issue: { type: Object, required: true } })
</script>

<template>
  <CaseProblemSummary :issue="issue" />
  <CaseImplementationDetails :issue="issue" />
  <CaseComparison :issue="issue" />
  <CaseStudyShowcase>
    <slot name="showcase" />
  </CaseStudyShowcase>
</template>
