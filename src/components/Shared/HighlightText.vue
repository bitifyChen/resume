<script setup>
  import { computed } from 'vue'
  import { parseHighlightText } from '@/utils/highlightText'

  const props = defineProps({
    text: { type: [String, Number], default: '' },
    tag: { type: String, default: 'span' },
    highlightAll: { type: Boolean, default: false }
  })

  const segments = computed(() => parseHighlightText(props.text, props.highlightAll))
</script>

<template>
  <component :is="tag">
    <template v-for="(segment, index) in segments" :key="`${index}-${segment.text}`">
      <mark v-if="segment.highlighted" class="portfolio-text-highlight">{{ segment.text }}</mark>
      <template v-else>{{ segment.text }}</template>
    </template>
  </component>
</template>
