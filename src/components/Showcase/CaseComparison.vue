<script setup>
  import AppIcon from '@/components/Shared/AppIcon.vue'

  defineProps({ issue: { type: Object, required: true } })
</script>

<template>
  <section
    id="case-comparison"
    class="case-study-section case-comparison-section"
    aria-labelledby="case-comparison-title"
    data-case-reveal-group
  >
    <header class="case-section-heading" data-case-reveal-item>
      <p class="case-section-label">Before / After</p>
      <h2 id="case-comparison-title">問題與解法</h2>
      <p>{{ issue.comparisonPresentation?.description || '同一項任務，在調整前後的操作差異。' }}</p>
    </header>

    <div class="issue-comparison" aria-label="Before 與 After 操作對照">
      <section class="comparison-panel comparison-before" data-case-reveal-item>
        <p class="comparison-label">
          {{ issue.comparisonPresentation?.leftLabel || 'Before' }}
          <span>{{ issue.comparisonPresentation?.leftCaption || '原本流程' }}</span>
        </p>
        <h3>{{ issue.before.title }}</h3>
        <p>{{ issue.before.description }}</p>
        <ol>
          <li v-for="step in issue.before.steps" :key="step">{{ step }}</li>
        </ol>
      </section>

      <div class="comparison-direction" aria-hidden="true" data-case-reveal-item>
        <AppIcon name="ArrowRight" :size="20" />
      </div>

      <section class="comparison-panel comparison-after" data-case-reveal-item>
        <p class="comparison-label">
          {{ issue.comparisonPresentation?.rightLabel || 'After' }}
          <span>{{ issue.comparisonPresentation?.rightCaption || '重製方案' }}</span>
        </p>
        <h3>{{ issue.after.title }}</h3>
        <p>{{ issue.after.description }}</p>
        <ol>
          <li v-for="step in issue.after.steps" :key="step">{{ step }}</li>
        </ol>
      </section>
    </div>
  </section>
</template>
