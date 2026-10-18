<script setup>
  import CaseFeaturePreview from '@/components/Showcase/CaseFeaturePreview.vue'
  import CaseWalkthrough from '@/components/Showcase/CaseWalkthrough.vue'
  import ComponentLibraryStory from '@/components/Showcase/ComponentLibraryStory.vue'

  defineProps({ issue: { type: Object, required: true } })
</script>

<template>
  <ComponentLibraryStory v-if="issue.kind === 'team-component'" :issue="issue" />
  <CaseFeaturePreview v-else-if="issue.previewType" :issue="issue" />
  <CaseWalkthrough v-else-if="issue.images?.length" :issue="issue" />
</template>
