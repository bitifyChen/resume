<script setup>
  import { computed } from 'vue'

  const props = defineProps({
    status: { type: Number, default: 0 }
  })

  const isComplete = computed(() => props.status === 1)
  const label = computed(() => (isComplete.value ? '已完成' : '草稿'))
</script>

<template>
  <span
    class="content-status-badge"
    :class="{ 'is-complete': isComplete }"
    :aria-label="`內容狀態：${label}`"
  >
    {{ label }}
  </span>
</template>
